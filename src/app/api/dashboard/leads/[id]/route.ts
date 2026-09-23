import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateLeadSchema } from '@/lib/validations/api';
import { z } from 'zod';

const isDate = (v: string) => !Number.isNaN(Date.parse(v));
const leadExtraFieldsSchema = z.object({
  last_contacted_at: z.string().max(40).refine(isDate, 'Invalid date').nullable().optional(),
  follow_up_date: z.string().max(40).refine(isDate, 'Invalid date').nullable().optional(),
  follow_up_note: z.string().max(2000).nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

// Note: withAuth doesn't pass through Next.js route params, so we keep
// the standard export function pattern for dynamic routes that need params.
// However, we can still use withAuth by extracting the ID from the URL.

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('leads') + 1];

  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(updateLeadSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (validatedData.status !== undefined) updates.status = validatedData.status;
  if (validatedData.priority !== undefined) updates.priority = validatedData.priority;
  if (validatedData.notes !== undefined) updates.notes = validatedData.notes;
  // These fields aren't in updateLeadSchema and used to be written raw, so a
  // malformed date or non-uuid assignee reached Postgres and came back as an
  // opaque 500. Validate them here and return a 400 instead.
  const extra = leadExtraFieldsSchema.safeParse(body);
  if (!extra.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: extra.error.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
      },
      { status: 400 }
    );
  }
  for (const key of ['last_contacted_at', 'follow_up_date', 'follow_up_note', 'assigned_to'] as const) {
    if (extra.data[key] !== undefined) updates[key] = extra.data[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // Update the lead
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this lead
    .select()
    .maybeSingle(); // no row = not this user's lead → 404 below, not a 500

  if (error) {
    logger.error('Error updating lead', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-leads' } });

export const DELETE = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('leads') + 1];

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    logger.error('Error deleting lead', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-leads' } });

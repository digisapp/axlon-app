import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateLeadSchema } from '@/lib/validations/api';

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
  if (body.last_contacted_at !== undefined) updates.last_contacted_at = body.last_contacted_at;
  if (body.follow_up_date !== undefined) updates.follow_up_date = body.follow_up_date;
  if (body.follow_up_note !== undefined) updates.follow_up_note = body.follow_up_note;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;

  // Update the lead
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this lead
    .select()
    .single();

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

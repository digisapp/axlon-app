import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { z } from 'zod';

// Statuses the trade_in_requests table uses (migration 061; 'valued' comes from
// the 011 base schema and is still set by the timestamp tracking below).
const TRADE_IN_STATUSES = [
  'pending',
  'reviewing',
  'contacted',
  'valued',
  'offered',
  'accepted',
  'rejected',
  'completed',
] as const;

// Defined inline (not in lib/validations) so this route validates what it
// actually writes: raw body fields were previously spread into .update().
const tradeInPatchSchema = z.object({
  status: z.enum(TRADE_IN_STATUSES).optional(),
  estimated_value: z.number().nonnegative().nullable().optional(),
  valuation_notes: z.string().max(5000).nullable().optional(),
  assigned_dealer_id: z.string().uuid().nullable().optional(),
});

export const GET = withAuth(async (request, { user, supabase }) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').at(-1);

  const { data, error } = await supabase
    .from('trade_in_requests')
    .select(`
      *,
      interested_listing:listings(id, title, price, images:listing_images(url, is_primary)),
      interested_category:categories(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Check authorization
  if (data.user_id !== user.id && data.assigned_dealer_id !== user.id) {
    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  }

  return NextResponse.json({ data });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:trade-in' } });

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').at(-1);
  const rawBody = await request.json();

  // Check if user is dealer/admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_business, is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_business && !profile?.is_admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const parsed = tradeInPatchSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Allowed fields for dealers to update
  if (body.status) updateData.status = body.status;
  if (body.estimated_value !== undefined) updateData.estimated_value = body.estimated_value;
  if (body.valuation_notes !== undefined) updateData.valuation_notes = body.valuation_notes;
  if (body.assigned_dealer_id !== undefined) updateData.assigned_dealer_id = body.assigned_dealer_id;

  // Track timestamps
  if (body.status === 'valued') {
    updateData.valued_at = new Date().toISOString();
  }
  if (body.status && ['valued', 'accepted', 'rejected'].includes(body.status)) {
    updateData.responded_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('trade_in_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ data });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:trade-in' } });

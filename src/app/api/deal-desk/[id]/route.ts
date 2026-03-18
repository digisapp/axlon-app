import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { updateDealSchema } from '@/lib/validations/deals';
import { logger } from '@/lib/logger';

// GET - Get single deal with all relations
export const GET = withAuth(async (request, { user, supabase }) => {
  const id = new URL(request.url).pathname.split('/').at(-1);

  const { data: deal, error } = await supabase
    .from('deals')
    .select(`
      *,
      lead:leads(id, buyer_name, buyer_email, buyer_phone, status, message),
      listing:listings(id, title, price, status, stock_number, year, make, model, vin, mileage, hours,
        images:listing_images(url, is_primary, sort_order),
        acquisition_cost
      ),
      salesperson:profiles!deals_salesperson_id_fkey(id, name, email),
      sales_manager:profiles!deals_sales_manager_id_fkey(id, name, email),
      floor_plan:listing_floor_plans(id, current_balance, floor_amount, days_floored),
      line_items:deal_line_items(*, order:sort_order.asc),
      documents:deal_documents(*),
      payments:deal_payments(*),
      activities:deal_activities(*, performer:profiles!deal_activities_performed_by_fkey(id, name))
    `)
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (error || !deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  return NextResponse.json({ data: deal });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:deal-desk' } });

// PATCH - Update deal
export const PATCH = withAuth(async (request, { user, supabase }) => {
  const id = new URL(request.url).pathname.split('/').at(-1);

  // Verify deal exists and belongs to user
  const { data: existingDeal } = await supabase
    .from('deals')
    .select('id, status')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (!existingDeal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  const body = await request.json();
  const parseResult = updateDealSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parseResult.error.issues },
      { status: 400 }
    );
  }

  const updateData = parseResult.data;

  // Don't allow updating certain fields on closed or lost deals
  if (existingDeal.status === 'closed' || existingDeal.status === 'lost') {
    if (updateData.status && updateData.status !== existingDeal.status) {
      // Allow reopening, but nothing else
      const allowedStatuses = ['quote', 'negotiation'];
      if (!allowedStatuses.includes(updateData.status)) {
        return NextResponse.json(
          { error: 'Cannot modify closed or lost deal' },
          { status: 400 }
        );
      }
    }
  }

  const { data: deal, error } = await supabase
    .from('deals')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      lead:leads(id, buyer_name, buyer_email),
      listing:listings(id, title, price, stock_number),
      salesperson:profiles!deals_salesperson_id_fkey(id, name)
    `)
    .single();

  if (error) {
    logger.error('Update deal error', { error });
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }

  return NextResponse.json({ data: deal });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:deal-desk' } });

// DELETE - Delete deal
export const DELETE = withAuth(async (request, { user, supabase }) => {
  const id = new URL(request.url).pathname.split('/').at(-1);

  // Verify deal exists and belongs to user
  const { data: existingDeal } = await supabase
    .from('deals')
    .select('id, status')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (!existingDeal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  // Don't allow deleting closed deals
  if (existingDeal.status === 'closed') {
    return NextResponse.json(
      { error: 'Cannot delete closed deals' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Delete deal error', { error });
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:deal-desk' } });

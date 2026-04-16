import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, dashboardCreateLeadSchema } from '@/lib/validations/api';

export const GET = withAuth(async (request, { user, supabase }) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '50'), 200));
  const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));

  let query = supabase
    .from('leads')
    .select(`
      *,
      listing:listings(id, title, price)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    logger.error('Error fetching leads', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json(data);
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-leads' } });

export const POST = withAuth(async (request, { supabase }) => {
  const body = await request.json();

  let validatedData;
  try {
    validatedData = validateBody(dashboardCreateLeadSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  const {
    listing_id,
    user_id,
    buyer_name,
    buyer_email,
    buyer_phone,
    message,
  } = validatedData;

  const { data, error } = await supabase
    .from('leads')
    .insert({
      listing_id,
      user_id,
      buyer_name,
      buyer_email,
      buyer_phone,
      message,
      status: 'new',
      priority: 'medium',
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating lead', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-leads' } });

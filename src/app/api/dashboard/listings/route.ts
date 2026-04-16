import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const GET = withAuth(async (request, { user, supabase }) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

  let query = supabase
    .from('listings')
    .select(`
      id, title, price, status,
      images:listing_images(url, thumbnail_url, is_primary)
    `)
    .eq('user_id', user.id)
    .is('deleted_at', null) // exclude soft-deleted listings
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: listings, error } = await query;

  if (error) {
    logger.error('Failed to fetch dashboard listings', { error, userId: user.id });
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }

  return NextResponse.json({ listings: listings || [] });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-listings' } });

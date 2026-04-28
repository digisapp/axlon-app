import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (stats can be expensive)
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin:stats',
    });

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { isAdmin } = await checkIsAdmin();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30'; // days

    const supabase = await createClient();

    // Calculate date range
    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const startDateStr = startDate.toISOString();

    // Batch all independent count queries in parallel — aggregates stay in Postgres
    const [
      { count: totalUsers },
      { count: totalBusinesses },
      { count: pendingBusinesses },
      { count: totalListings },
      { count: activeListings },
      { count: totalLeads },
      { count: totalMessages },
      { data: totalViewsRow },
      { count: newUsers },
      { count: newListings },
      { count: newLeads },
      { data: dailySignupsRows },
      { data: dailyListingsRows },
      { data: dailyLeadsRows },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_business', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('business_status', 'pending'),
      supabase.from('listings').select('*', { count: 'exact', head: true }),
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.rpc('get_total_views_count'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      supabase.from('listings').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startDateStr),
      supabase.rpc('get_daily_counts', { table_name: 'profiles', start_date: startDateStr }),
      supabase.rpc('get_daily_counts', { table_name: 'listings', start_date: startDateStr }),
      supabase.rpc('get_daily_counts', { table_name: 'leads', start_date: startDateStr }),
    ]);

    const totalViews = Number(totalViewsRow) || 0;

    // Build day-keyed maps from RPC results
    const signupsByDay = groupByDayFromRpc(dailySignupsRows || [], daysAgo);
    const listingsByDay = groupByDayFromRpc(dailyListingsRows || [], daysAgo);
    const leadsByDay = groupByDayFromRpc(dailyLeadsRows || [], daysAgo);

    // Get top dealers by listings
    const { data: topBusinesses } = await supabase
      .from('profiles')
      .select(`
        id,
        company_name,
        email,
        avatar_url
      `)
      .eq('is_business', true)
      .limit(10);

    // Get listing counts for top dealers — single batch query instead of N+1
    const topDealerIds = (topBusinesses || []).map(d => d.id);
    const { data: dealerListingRows } = topDealerIds.length > 0
      ? await supabase
          .from('listings')
          .select('user_id')
          .in('user_id', topDealerIds)
          .eq('status', 'active')
      : { data: [] };

    const dealerListingCounts = new Map<string, number>();
    for (const row of dealerListingRows ?? []) {
      dealerListingCounts.set(row.user_id, (dealerListingCounts.get(row.user_id) ?? 0) + 1);
    }

    const topBusinessesWithStats = (topBusinesses || []).map(dealer => ({
      ...dealer,
      listing_count: dealerListingCounts.get(dealer.id) ?? 0,
    }));

    // Sort by listing count
    topBusinessesWithStats.sort((a, b) => b.listing_count - a.listing_count);

    // Get listing breakdown by category via aggregate RPC
    const { data: categoryRows } = await supabase.rpc('get_active_listings_by_category');
    const categoryStats = (categoryRows || []).reduce((acc: Record<string, number>, row: { category_name: string; listing_count: number }) => {
      acc[row.category_name] = Number(row.listing_count);
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      overview: {
        total_users: totalUsers || 0,
        total_businesses: totalBusinesses || 0,
        pending_businesses: pendingBusinesses || 0,
        total_listings: totalListings || 0,
        active_listings: activeListings || 0,
        total_leads: totalLeads || 0,
        total_messages: totalMessages || 0,
        total_views: totalViews,
      },
      period: {
        days: daysAgo,
        new_users: newUsers || 0,
        new_listings: newListings || 0,
        new_leads: newLeads || 0,
      },
      charts: {
        signups: signupsByDay,
        listings: listingsByDay,
        leads: leadsByDay,
      },
      top_businesses: topBusinessesWithStats.slice(0, 5),
      category_breakdown: categoryStats,
    });
  } catch (error) {
    logger.error('Admin stats error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function groupByDayFromRpc(
  rows: { date_bucket: string; cnt: number }[],
  days: number
): { date: string; count: number }[] {
  const result: Record<string, number> = {};

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result[date.toISOString().split('T')[0]] = 0;
  }

  for (const row of rows) {
    const dateStr = row.date_bucket.split('T')[0];
    if (Object.hasOwn(result, dateStr)) {
      result[dateStr] = Number(row.cnt);
    }
  }

  return Object.entries(result).map(([date, count]) => ({ date, count }));
}

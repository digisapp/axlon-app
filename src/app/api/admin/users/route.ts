import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';
import { requireCsrf } from '@/lib/security/csrf';
export async function GET(request: NextRequest) {
  try {
    // Rate limit admin endpoints (100 requests per minute)
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin',
    });

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { isAdmin } = await checkIsAdmin();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '20');
    const page = Math.max(1, Math.min(rawPage, 500));
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all'; // all, dealers, individuals
    const status = searchParams.get('status') || 'all'; // all, active, suspended
    const VALID_SORT_FIELDS = new Set(['created_at', 'email', 'company_name', 'is_business', 'is_suspended']);
    const rawSort = searchParams.get('sort') || 'created_at';
    const sort = VALID_SORT_FIELDS.has(rawSort) ? rawSort : 'created_at';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        company_name,
        slug,
        phone,
        city,
        state,
        is_business,
        business_status,
        is_admin,
        is_suspended,
        suspended_at,
        avatar_url,
        created_at
      `, { count: 'exact' });

    // Search filter
    if (search) {
      const s = sanitizeSearchFilter(search);
      query = query.or(`email.ilike.%${s}%,company_name.ilike.%${s}%`);
    }

    // Type filter
    if (type === 'dealers') {
      query = query.eq('is_business', true);
    } else if (type === 'individuals') {
      query = query.eq('is_business', false);
    }

    // Status filter
    if (status === 'active') {
      query = query.eq('is_suspended', false);
    } else if (status === 'suspended') {
      query = query.eq('is_suspended', true);
    }

    // Sorting
    const ascending = order === 'asc';
    query = query.order(sort, { ascending });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, count, error } = await query;

    if (error) {
      logger.error('Error fetching users', { error });
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Get listing counts for all users in a single query (avoids N+1)
    const userIds = (users || []).map(u => u.id);
    const countMap = new Map<string, number>();

    if (userIds.length > 0) {
      const { data: userListings } = await supabase
        .from('listings')
        .select('user_id')
        .in('user_id', userIds);

      (userListings || []).forEach((l: { user_id: string }) => {
        countMap.set(l.user_id, (countMap.get(l.user_id) || 0) + 1);
      });
    }

    const usersWithStats = (users || []).map(user => ({
      ...user,
      listing_count: countMap.get(user.id) || 0,
    }));

    // Overall counts must be aggregated in Postgres: a bare select is capped at
    // 1,000 rows by PostgREST, so counting the rows in JS silently saturated
    // every stat card once the platform passed that many profiles.
    const [
      { count: totalUsersCount },
      { count: totalBusinessesCount },
      { count: suspendedUsersCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_business', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_suspended', true),
    ]);

    const totalUsers = totalUsersCount ?? 0;
    const totalBusinesses = totalBusinessesCount ?? 0;
    const suspendedUsers = suspendedUsersCount ?? 0;

    return NextResponse.json({
      data: usersWithStats,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
      stats: {
        total_users: totalUsers,
        total_businesses: totalBusinesses,
        suspended_users: suspendedUsers,
      },
    });
  } catch (error) {
    logger.error('Admin users error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

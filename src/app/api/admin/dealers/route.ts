import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
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
    const status = searchParams.get('status') || 'pending';
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '20');
    const page = Math.max(1, Math.min(rawPage, 500));
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        company_name,
        phone,
        city,
        state,
        is_business,
        business_status,
        business_applied_at,
        business_reviewed_at,
        business_rejection_reason,
        business_license,
        tax_id,
        created_at,
        avatar_url
      `, { count: 'exact' });

    // Filter by status
    if (status === 'all') {
      query = query.neq('business_status', 'none');
    } else {
      query = query.eq('business_status', status);
    }

    // Pagination
    query = query
      .order('business_applied_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    const { data: dealers, count, error } = await query;

    if (error) {
      logger.error('Error fetching dealers', { error });
      return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
    }

    // Get counts by status — single query instead of three
    const { data: statusCounts } = await supabase
      .from('profiles')
      .select('business_status')
      .in('business_status', ['pending', 'approved', 'rejected']);

    const counts = { pending: 0, approved: 0, rejected: 0 };
    for (const row of statusCounts ?? []) {
      const s = row.business_status as keyof typeof counts;
      if (s in counts) counts[s]++;
    }

    return NextResponse.json({
      data: dealers,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
      counts,
    });
  } catch (error) {
    logger.error('Admin dealers error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

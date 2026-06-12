import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-outreach',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const state = searchParams.get('state');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('outreach_contacts')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (source) {
      query = query.eq('source', source);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (state) {
      query = query.eq('state', state);
    }
    if (search) {
      const s = sanitizeSearchFilter(search);
      if (s) {
        query = query.or(
          `name.ilike.%${s}%,email.ilike.%${s}%,city.ilike.%${s}%,state.ilike.%${s}%,phone.ilike.%${s}%`
        );
      }
    }

    const { data: contacts, count, error } = await query;

    if (error) {
      logger.error('Error fetching outreach contacts', { error });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get stats using count queries to avoid Supabase 1000-row default limit
    const [
      { count: totalCount },
      { data: sourceData },
      { data: statusData },
    ] = await Promise.all([
      supabase.from('outreach_contacts').select('*', { count: 'exact', head: true }),
      supabase.rpc('outreach_stats_by_source'),
      supabase.rpc('outreach_stats_by_status'),
    ]);

    const stats = {
      total: totalCount || 0,
      bySource: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };

    for (const row of sourceData || []) {
      stats.bySource[row.source] = Number(row.count);
    }
    for (const row of statusData || []) {
      stats.byStatus[row.status] = Number(row.count);
    }

    return NextResponse.json({
      contacts,
      total: count || 0,
      stats,
    });
  } catch (error) {
    logger.error('Error in GET /api/admin/outreach', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-outreach',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const supabase = await createClient();
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
    }

    if (ids.length > 100) {
      return NextResponse.json({ error: 'Max 100 deletions at once' }, { status: 400 });
    }

    const { error } = await supabase
      .from('outreach_contacts')
      .delete()
      .in('id', ids);

    if (error) {
      logger.error('Error deleting outreach contacts', { error });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error) {
    logger.error('Error in DELETE /api/admin/outreach', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

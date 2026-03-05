import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dashboard-outreach',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data: contacts, count, error } = await query;

    if (error) {
      logger.error('Error fetching outreach contacts', { error });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get stats
    const { data: statsData } = await supabase
      .from('outreach_contacts')
      .select('source, status');

    const stats = {
      total: statsData?.length || 0,
      bySource: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };

    for (const row of statsData || []) {
      stats.bySource[row.source] = (stats.bySource[row.source] || 0) + 1;
      stats.byStatus[row.status] = (stats.byStatus[row.status] || 0) + 1;
    }

    return NextResponse.json({
      contacts,
      total: count || 0,
      stats,
    });
  } catch (error) {
    logger.error('Error in GET /api/dashboard/outreach', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:dashboard-outreach',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    logger.error('Error in DELETE /api/dashboard/outreach', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

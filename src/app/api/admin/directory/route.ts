import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';

const VALID_CATEGORIES = [
  'trailer_dealer', 'crane_rigging', 'truck_manufacturer', 'trailer_manufacturer',
  'transportation', 'equipment_dealer', 'parts_supplier', 'services', 'other', 'uncategorized',
];
const VALID_INVITE_STATUSES = ['none', 'invited', 'accepted', 'declined'];

/** Sanitize a search string for use in PostgREST ilike filters */
function sanitizeSearch(str: string): string {
  return str.replace(/[%_\\(),.]/g, '').trim().slice(0, 100);
}

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin:directory',
    });
    if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;, { status: 403 });

    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Math.min(1000, parseInt(searchParams.get('page') || '1')));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50')));
    const source = searchParams.get('source');
    const excludeSource = searchParams.get('excludeSource');
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const q = searchParams.get('q');
    const hasEmail = searchParams.get('hasEmail');
    const hasPhone = searchParams.get('hasPhone');
    const inviteStatus = searchParams.get('inviteStatus');
    const excludeSources = searchParams.get('excludeSources');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('business_directory')
      .select('*', { count: 'exact' })
      .order('company_name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (source) query = query.eq('source', source);
    if (excludeSource) query = query.neq('source', excludeSource);
    if (category) query = query.eq('category', category);
    if (state) query = query.eq('state', state);
    if (hasEmail === 'true') query = query.not('email', 'is', null);
    if (hasEmail === 'false') query = query.is('email', null);
    if (hasPhone === 'true') query = query.not('phone', 'is', null);
    if (hasPhone === 'false') query = query.is('phone', null);
    if (inviteStatus) query = query.eq('invite_status', inviteStatus);
    if (excludeSources) {
      for (const src of excludeSources.split(',').slice(0, 10)) {
        query = query.neq('source', src.trim());
      }
    }
    if (q) {
      const safe = sanitizeSearch(q);
      if (safe) {
        query = query.or(`company_name.ilike.%${safe}%,city.ilike.%${safe}%,email.ilike.%${safe}%`);
      }
    }

    const { data, count, error } = await query;

    if (error) {
      logger.error('Directory fetch error', { error: error.message });
      return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
    }

    const { data: stats } = await supabase.rpc('get_directory_stats');

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      stats: Array.isArray(stats) ? stats[0] : stats || null,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Bulk update categories / invite status
export async function PATCH(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.auth,
      prefix: 'ratelimit:admin:directory-patch',
    });
    if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { ids, category, invite_status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
    }

    if (ids.length > 500) {
      return NextResponse.json({ error: 'Maximum 500 records per batch' }, { status: 400 });
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (invite_status && !VALID_INVITE_STATUSES.includes(invite_status)) {
      return NextResponse.json({ error: 'Invalid invite_status' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (category) updates.category = category;
    if (invite_status) updates.invite_status = invite_status;

    const { error } = await supabase
      .from('business_directory')
      .update(updates)
      .in('id', ids);

    if (error) {
      logger.error('Directory bulk update error', { error: error.message });
      return NextResponse.json({ error: 'Failed to update records' }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: ids.length });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

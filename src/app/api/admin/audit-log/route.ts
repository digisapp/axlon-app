import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';

export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-audit-log',
    });
    if (!rl.success) return rateLimitResponse(rl);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '50');
    const page = Math.max(1, Math.min(rawPage, 500));
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = (page - 1) * limit;
    const adminFilter = searchParams.get('admin_id') || null;
    const actionFilter = searchParams.get('action') || null;
    const targetType = searchParams.get('target_type') || null;

    const supabase = await createClient();

    let query = supabase
      .from('admin_activity_log')
      .select(`
        id,
        action,
        target_type,
        target_id,
        details,
        created_at,
        admin:profiles!admin_activity_log_admin_id_fkey(id, email, company_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (adminFilter) query = query.eq('admin_id', adminFilter);
    if (actionFilter) query = query.eq('action', actionFilter);
    if (targetType) query = query.eq('target_type', targetType);

    const { data, count, error } = await query;

    if (error) {
      logger.error('Audit log fetch error', { error });
      return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
    }

    return NextResponse.json({
      data,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    logger.error('Admin audit log error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const source = searchParams.get('source');
  const excludeSource = searchParams.get('excludeSource');
  const category = searchParams.get('category');
  const state = searchParams.get('state');
  const q = searchParams.get('q');
  const hasEmail = searchParams.get('hasEmail');
  const hasPhone = searchParams.get('hasPhone');
  const inviteStatus = searchParams.get('inviteStatus');
  const excludeSources = searchParams.get('excludeSources'); // comma-separated

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
    for (const src of excludeSources.split(',')) {
      query = query.neq('source', src.trim());
    }
  }
  if (q) query = query.or(`company_name.ilike.%${q.replace(/[%_]/g, '')}%,city.ilike.%${q.replace(/[%_]/g, '')}%,email.ilike.%${q.replace(/[%_]/g, '')}%`);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get aggregate stats
  const { data: stats } = await supabase.rpc('get_directory_stats');

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    limit,
    stats: Array.isArray(stats) ? stats[0] : stats || null,
  });
}

// Bulk update categories
export async function PATCH(request: NextRequest) {
  const supabase = getSupabase();
  const { ids, category, invite_status } = await request.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (category) updates.category = category;
  if (invite_status) updates.invite_status = invite_status;

  const { error } = await supabase
    .from('business_directory')
    .update(updates)
    .in('id', ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, updated: ids.length });
}

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const GET = withAuth(async (request, { user, supabase }) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // active, closed, converted, all
  const rawLimit = parseInt(searchParams.get('limit') || '50');
  const rawOffset = parseInt(searchParams.get('offset') || '0');
  const limit = Math.max(1, Math.min(rawLimit, 100));
  const offset = Math.max(0, rawOffset);

  // Fetch conversations with pagination — do NOT embed messages (too expensive for list view)
  let query = supabase
    .from('chat_conversations')
    .select(`
      id,
      status,
      created_at,
      updated_at,
      visitor_id,
      lead_id,
      message_count,
      last_message_at,
      last_message_preview,
      lead:leads(id, status, buyer_name)
    `, { count: 'exact' })
    .eq('dealer_id', user.id)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: conversations, count, error } = await query;

  if (error) {
    logger.error('Error fetching conversations', { error });
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }

  return NextResponse.json({
    conversations,
    total: count || 0,
    limit,
    offset,
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-conversations' } });

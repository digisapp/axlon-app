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

  let query = supabase
    .from('chat_conversations')
    .select(`
      id,
      dealer_id,
      visitor_name,
      visitor_email,
      visitor_phone,
      status,
      created_at,
      updated_at,
      lead_id,
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

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ conversations: [], total: 0, limit, offset });
  }

  // Batch-fetch message stats for all conversations in one query (avoids N+1)
  const conversationIds = conversations.map((c) => c.id);
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('conversation_id, role, content, created_at')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true });

  // Group messages by conversation in memory
  type MsgRow = { conversation_id: string; role: string; content: string; created_at: string };
  const msgsByConv = new Map<string, MsgRow[]>();
  for (const msg of messages ?? []) {
    const arr = msgsByConv.get(msg.conversation_id) ?? [];
    arr.push(msg);
    msgsByConv.set(msg.conversation_id, arr);
  }

  const processedConversations = conversations.map((conv) => {
    const msgs = msgsByConv.get(conv.id) ?? [];
    const lastMessage = msgs[msgs.length - 1];
    const userMessages = msgs.filter((m) => m.role === 'user');

    return {
      ...conv,
      message_count: msgs.length,
      user_message_count: userMessages.length,
      last_message: lastMessage?.content?.substring(0, 100) ?? null,
      last_message_at: lastMessage?.created_at ?? conv.updated_at,
    };
  });

  return NextResponse.json({
    conversations: processedConversations,
    total: count ?? 0,
    limit,
    offset,
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-conversations' } });

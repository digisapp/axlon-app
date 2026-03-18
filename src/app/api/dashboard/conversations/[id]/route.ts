import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';

export const GET = withAuth(async (request, { user, supabase }) => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.indexOf('conversations') + 1];
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  // Fetch conversation metadata and lead info
  const { data: conversation, error } = await supabase
    .from('chat_conversations')
    .select(`
      *,
      lead:leads(id, status, buyer_name, buyer_email, buyer_phone)
    `)
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (error || !conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Get total message count
  const { count: totalMessages } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', id);

  // Fetch messages with pagination - get most recent first, then reverse
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, role, content, metadata, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Reverse to get chronological order (oldest to newest)
  const sortedMessages = messages?.reverse() || [];

  return NextResponse.json({
    conversation: {
      ...conversation,
      messages: sortedMessages,
    },
    pagination: {
      total: totalMessages || 0,
      limit,
      offset,
      hasMore: (totalMessages || 0) > offset + limit,
    },
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-conversations' } });

// Update conversation status
export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('conversations') + 1];

  const body = await request.json();
  const { status } = body;

  // Validate status value
  const allowedStatuses = ['active', 'closed', 'archived'];
  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
      { status: 400 }
    );
  }

  // Verify ownership and update
  const { data: conversation, error } = await supabase
    .from('chat_conversations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('dealer_id', user.id)
    .select()
    .single();

  if (error || !conversation) {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }

  return NextResponse.json({ conversation });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-conversations' } });

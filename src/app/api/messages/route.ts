import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { validateBody, ValidationError, createMessageSchema } from '@/lib/validations/api';

// GET - Fetch conversations for the current user
export const GET = withAuth(async (request, { user, supabase }) => {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '200'), 500));

  // Get messages where user is sender or recipient (bounded)
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      id,
      listing_id,
      sender_id,
      recipient_id,
      content,
      is_read,
      created_at,
      listing:listings(id, title, price, images:listing_images(url, is_primary)),
      sender:profiles!messages_sender_id_fkey(id, company_name, email, avatar_url),
      recipient:profiles!messages_recipient_id_fkey(id, company_name, email, avatar_url)
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  // Group messages into conversations by listing + other party
  const conversationsMap = new Map();

  messages?.forEach((msg) => {
    const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
    const key = `${msg.listing_id}-${otherUserId}`;

    if (!conversationsMap.has(key)) {
      conversationsMap.set(key, {
        listing: msg.listing,
        otherUser: msg.sender_id === user.id ? msg.recipient : msg.sender,
        lastMessage: msg,
        unreadCount: 0,
        messages: [],
      });
    }

    const conv = conversationsMap.get(key);
    conv.messages.push(msg);

    if (!msg.is_read && msg.recipient_id === user.id) {
      conv.unreadCount++;
    }
  });

  const conversations = Array.from(conversationsMap.values());

  return NextResponse.json({ data: conversations });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:messages' } });

// POST - Send a new message
export const POST = withAuth(async (request, { user, supabase }) => {
  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(createMessageSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }
  const { listing_id, recipient_id, content } = validatedData;

  // Cannot message yourself
  if (recipient_id === user.id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
  }

  // Verify listing exists
  const { data: listing } = await supabase
    .from('listings')
    .select('id, user_id')
    .eq('id', listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Insert message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      listing_id,
      sender_id: user.id,
      recipient_id,
      content,
      is_read: false,
    })
    .select(`
      id,
      listing_id,
      sender_id,
      recipient_id,
      content,
      is_read,
      created_at
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ data: message });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:messages' } });

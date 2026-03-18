import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { parseConversationId } from '@/lib/validations/api';

// GET - Fetch messages for a specific conversation (listing + user combo)
export const GET = withAuth(async (request, { user, supabase }) => {
  // Extract conversationId from URL path
  const url = new URL(request.url);
  const conversationId = url.pathname.split('/').pop()!;

  // Parse and validate conversation ID (format: listingUUID-userUUID)
  const parsed = parseConversationId(conversationId);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid conversation ID format' }, { status: 400 });
  }

  const { listingId, userId: otherUserId } = parsed;

  // Fetch all messages between these users for this listing
  // Using parameterized filters instead of string interpolation
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
      sender:profiles!messages_sender_id_fkey(id, company_name, email, avatar_url)
    `)
    .eq('listing_id', listingId)
    .or(`sender_id.eq.${user.id},sender_id.eq.${otherUserId}`)
    .or(`recipient_id.eq.${user.id},recipient_id.eq.${otherUserId}`)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('listing_id', listingId)
    .eq('sender_id', otherUserId)
    .eq('recipient_id', user.id);

  // Get listing and other user info
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      id, title, price,
      images:listing_images(url, is_primary)
    `)
    .eq('id', listingId)
    .single();

  const { data: otherUser } = await supabase
    .from('profiles')
    .select('id, company_name, email, avatar_url')
    .eq('id', otherUserId)
    .single();

  return NextResponse.json({
    data: {
      messages,
      listing,
      otherUser,
    },
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:messages' } });

// PUT - Mark messages as read
export const PUT = withAuth(async (request, { user, supabase }) => {
  // Extract conversationId from URL path
  const url = new URL(request.url);
  const conversationId = url.pathname.split('/').pop()!;

  // Parse and validate conversation ID
  const parsed = parseConversationId(conversationId);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid conversation ID format' }, { status: 400 });
  }

  const { listingId, userId: otherUserId } = parsed;

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('listing_id', listingId)
    .eq('sender_id', otherUserId)
    .eq('recipient_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:messages' } });

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, conversationReplySchema } from '@/lib/validations/api';

export const POST = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('conversations') + 1];

  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(conversationReplySchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }
  const { message } = validatedData;

  // Verify dealer owns this conversation
  const { data: conversation } = await supabase
    .from('chat_conversations')
    .select('id, dealer_id')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Add dealer's reply as assistant message with metadata indicating it's from dealer
  const { data: newMessage, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: id,
      role: 'assistant',
      content: message.trim(),
      metadata: {
        from_dealer: true,
        dealer_id: user.id,
      },
    })
    .select()
    .single();

  if (error) {
    logger.error('Error saving reply', { error });
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }

  // Update conversation updated_at
  await supabase
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);

  return NextResponse.json({ message: newMessage });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-conversations' } });

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { chatLeadCapturedEmail } from '@/lib/email/templates';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, chatLeadSchema } from '@/lib/validations/api';

// Same visitor-fingerprint cookie the /api/chat route sets when a conversation
// is created, used here to prove ownership before touching a conversation row.
const VISITOR_COOKIE = 'axlon_chat_visitor';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokensMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.auth,
      prefix: 'ratelimit:chat-lead',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    let validatedData;
    try {
      validatedData = validateBody(chatLeadSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }
    const { dealerId, conversationId, name, email, phone } = validatedData;

    // Service-role client: chat_conversations RLS is dealer-owner + service_role
    // only (migration 057). Visitor writes go through admin, gated by the
    // fingerprint check below.
    const supabase = createAdminClient();

    // Only touch a conversation the caller proves they own (UUID + matching
    // fingerprint cookie). Pure lead capture with no conversationId still works.
    const cookieToken = request.cookies.get(VISITOR_COOKIE)?.value;
    const visitorToken = cookieToken && UUID_REGEX.test(cookieToken) ? cookieToken : null;
    let ownedConversationId: string | null = null;

    if (conversationId && UUID_REGEX.test(conversationId)) {
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .select('id, dealer_id, visitor_fingerprint')
        .eq('id', conversationId)
        .single();

      if (
        conversation &&
        conversation.dealer_id === dealerId &&
        visitorToken &&
        conversation.visitor_fingerprint &&
        tokensMatch(conversation.visitor_fingerprint, visitorToken)
      ) {
        ownedConversationId = conversation.id;
      } else {
        logger.warn('Chat lead: ignoring conversationId (ownership mismatch)', {
          conversationId,
          dealerId,
        });
      }
    }

    // Get dealer info for notification. Only real business accounts can receive
    // chat leads — this blocks lead-spam/inbox-poisoning against arbitrary user
    // UUIDs (mirrors the is_business gate in /api/chat).
    const { data: dealer } = await supabase
      .from('profiles')
      .select('email, company_name, notification_settings, is_business')
      .eq('id', dealerId)
      .single();

    if (!dealer || !dealer.is_business) {
      return NextResponse.json({ error: 'Invalid dealer' }, { status: 404 });
    }

    // Update conversation with visitor info (only if owned)
    if (ownedConversationId) {
      await supabase
        .from('chat_conversations')
        .update({
          visitor_name: name,
          visitor_email: email,
          visitor_phone: phone || null,
          status: 'converted',
        })
        .eq('id', ownedConversationId);
    }

    // Create a lead record
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: dealerId, // Dealer receiving the lead
        buyer_name: name,
        buyer_email: email,
        buyer_phone: phone || null,
        message: 'Lead captured from AI chat widget',
        source: 'chat',
        status: 'new',
        priority: 'high', // Chat leads are high intent
      })
      .select('id')
      .single();

    if (leadError) {
      logger.error('Error creating lead', { leadError, dealerId, conversationId });
      return NextResponse.json(
        { error: 'Failed to save your contact info. Please try again.' },
        { status: 500 }
      );
    }

    // Link lead to conversation if both exist and the conversation is owned
    if (lead && ownedConversationId) {
      await supabase
        .from('chat_conversations')
        .update({ lead_id: lead.id })
        .eq('id', ownedConversationId);
    }

    // Send notification email to dealer
    const notificationSettings = dealer?.notification_settings || {};
    const shouldNotifyLead = notificationSettings.new_lead !== false; // Default to true

    if (shouldNotifyLead && dealer?.email) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      try {
        await sendEmail({
          to: dealer.email,
          subject: `New lead captured from chat: ${name}`,
          html: chatLeadCapturedEmail({
            dealerName: dealer.company_name || 'Dealer',
            visitorName: name,
            visitorEmail: email,
            visitorPhone: phone,
            conversationUrl: `${baseUrl}/dashboard/conversations/${ownedConversationId ?? ''}`,
            leadsUrl: `${baseUrl}/dashboard/leads`,
          }),
        });
      } catch (emailError) {
        logger.error('Failed to send lead notification', { emailError });
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead?.id,
    });
  } catch (error) {
    logger.error('Chat lead capture error', { error });
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

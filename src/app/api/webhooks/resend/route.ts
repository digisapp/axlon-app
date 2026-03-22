import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend } from '@/lib/email/resend';
import { classifyAndDraftReply, wrapInBrandedTemplate } from '@/lib/ai/email-classifier';
import { logger } from '@/lib/logger';

/**
 * Resend Webhook — /api/webhooks/resend
 *
 * Handles:
 * - email.received → inbound email processing + AI classification + auto-reply
 * - email.delivered / email.bounced / email.complained → delivery status updates
 */

// ─── Types ──────────────────────────────────────────────

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from?: string;
    to?: string[];
    cc?: string[];
    subject?: string;
    message_id?: string;
    created_at?: string;
  };
}

// ─── Helpers ────────────────────────────────────────────

function parseEmailAddress(raw: string): { email: string; name: string | null } {
  const match = raw.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^["']|["']$/g, ''), email: match[2].trim() };
  }
  return { name: null, email: raw.trim() };
}

// ─── Spam Filtering ─────────────────────────────────────

const SPAM_PATTERNS = [
  /\b(viagra|cialis|lottery|winner|prince|inheritance)\b/i,
  /\b(click here|act now|limited time|free money)\b/i,
  /\bnoreply@/i,
  /\bmailer-daemon@/i,
  /\bpostmaster@/i,
];

const BLOCKED_DOMAINS = [
  'spam.com', 'tempmail.com', 'throwaway.email', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com',
];

function isSpam(from: string, subject: string): { isSpam: boolean; reason?: string } {
  const senderEmail = parseEmailAddress(from).email.toLowerCase();
  const senderDomain = senderEmail.split('@')[1];

  if (BLOCKED_DOMAINS.includes(senderDomain)) {
    return { isSpam: true, reason: `blocked domain: ${senderDomain}` };
  }

  let matches = 0;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(subject) || pattern.test(from)) matches++;
  }
  // 2+ pattern matches = spam
  if (matches >= 2) {
    return { isSpam: true, reason: `${matches} spam patterns matched` };
  }

  if (!subject || subject.trim().length === 0) {
    return { isSpam: true, reason: 'empty subject' };
  }

  return { isSpam: false };
}

// ─── Delivery Status Handler ────────────────────────────

async function handleDeliveryStatus(type: string, emailId: string) {
  const supabase = createAdminClient();

  const statusMap: Record<string, string> = {
    'email.delivered': 'delivered',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
  };

  const newStatus = statusMap[type];
  if (!newStatus) return;

  await supabase
    .from('emails')
    .update({ status: newStatus })
    .eq('resend_id', emailId);

  logger.info('Email delivery status updated', { emailId, status: newStatus });
}

// ─── AI Classification + Auto-Reply ─────────────────────

async function processWithAI(emailDbId: string, emailData: {
  fromEmail: string;
  fromName: string | null;
  subject: string;
  bodyText: string | null;
  bodyHtml: string | null;
  threadId: string;
}) {
  const supabase = createAdminClient();

  try {
    const classification = await classifyAndDraftReply({
      fromEmail: emailData.fromEmail,
      fromName: emailData.fromName,
      subject: emailData.subject,
      bodyText: emailData.bodyText,
      bodyHtml: emailData.bodyHtml,
    });

    // Store AI results on the email
    await supabase.from('emails').update({
      ai_category: classification.category,
      ai_confidence: classification.confidence,
      ai_summary: classification.summary,
      ai_draft_html: classification.draftHtml || null,
      ai_draft_text: classification.draftText || null,
      ai_processed_at: new Date().toISOString(),
    }).eq('id', emailDbId);

    logger.info('AI classification complete', {
      emailId: emailDbId,
      category: classification.category,
      confidence: classification.confidence,
      autoSendable: classification.autoSendable,
    });

    // Auto-reply if safe
    if (classification.autoSendable && classification.draftHtml) {
      // Check if auto-reply is enabled
      const { data: setting } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'ai_auto_reply_enabled')
        .single();

      const autoReplyEnabled = setting?.value === true || setting?.value === 'true';

      if (autoReplyEnabled) {
        await sendAutoReply({
          to: emailData.fromEmail,
          subject: `Re: ${emailData.subject}`,
          draftHtml: classification.draftHtml,
          originalHtml: emailData.bodyHtml || emailData.bodyText || '',
          threadId: emailData.threadId,
          inboundEmailId: emailDbId,
        });
      }
    }
  } catch (aiError) {
    logger.error('AI email processing failed', { error: aiError, emailId: emailDbId });
    // Non-fatal — email is already stored
  }
}

async function sendAutoReply(params: {
  to: string;
  subject: string;
  draftHtml: string;
  originalHtml: string;
  threadId: string;
  inboundEmailId: string;
}) {
  const supabase = createAdminClient();
  const resend = getResend();

  const brandedHtml = wrapInBrandedTemplate(params.draftHtml, params.originalHtml);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>';

  try {
    const { data: sendResult, error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: brandedHtml,
    });

    if (sendError) {
      logger.error('Auto-reply send failed', { error: sendError });
      return;
    }

    // Parse from address
    const fromMatch = fromEmail.match(/^(.+?)\s*<(.+?)>$/);
    const fromAddr = fromMatch ? fromMatch[2] : fromEmail;
    const fromName = fromMatch ? fromMatch[1].trim() : null;

    // Store outbound auto-reply
    await supabase.from('emails').insert({
      thread_id: params.threadId,
      resend_id: sendResult?.id || null,
      direction: 'outbound',
      from_email: fromAddr,
      from_name: fromName,
      to_email: params.to,
      subject: params.subject,
      html_body: brandedHtml,
      status: 'sent',
      is_read: true,
      ai_category: 'auto_reply',
      metadata: { auto_sent: true },
    });

    // Mark inbound as replied
    await supabase.from('emails').update({
      status: 'replied',
      replied_at: new Date().toISOString(),
    }).eq('id', params.inboundEmailId);

    // Update thread status
    await supabase.from('email_threads').update({
      status: 'replied',
    }).eq('id', params.threadId);

    logger.info('Auto-reply sent', { to: params.to, threadId: params.threadId });
  } catch (error) {
    logger.error('Auto-reply error', { error });
  }
}

// ─── Main Handler ───────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();

    // Verify webhook signature
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const resend = getResend();
      try {
        resend.webhooks.verify({
          payload,
          headers: {
            id: request.headers.get('svix-id') || '',
            timestamp: request.headers.get('svix-timestamp') || '',
            signature: request.headers.get('svix-signature') || '',
          },
          webhookSecret,
        });
      } catch {
        logger.error('Webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event: ResendWebhookEvent = JSON.parse(payload);

    // ─── Delivery Status Events ─────────────────────
    if (['email.delivered', 'email.bounced', 'email.complained', 'email.opened', 'email.clicked'].includes(event.type)) {
      await handleDeliveryStatus(event.type, event.data.email_id);
      return NextResponse.json({ received: true });
    }

    // ─── Inbound Email ──────────────────────────────
    if (event.type !== 'email.received') {
      return NextResponse.json({ received: true });
    }

    const { data } = event;
    const sender = parseEmailAddress(data.from || '');

    // Spam filter
    const spamCheck = isSpam(data.from || '', data.subject || '');
    if (spamCheck.isSpam) {
      logger.info('Inbound email filtered as spam', { from: sender.email, reason: spamCheck.reason });
      return NextResponse.json({ received: true, filtered: true });
    }

    // Fetch full email body via Resend API
    const resend = getResend();
    let htmlBody: string | null = null;
    let textBody: string | null = null;

    try {
      const emailDetail = await resend.emails.get(data.email_id);
      if (emailDetail.data) {
        const emailData = emailDetail.data as unknown as { html?: string; text?: string };
        htmlBody = emailData.html || null;
        textBody = emailData.text || null;
      }
    } catch (fetchErr) {
      logger.warn('Could not fetch email body from Resend API', { emailId: data.email_id, error: fetchErr });
    }

    const supabase = createAdminClient();

    // ─── Thread Matching (3-tier) ─────────────────────

    let threadId: string | null = null;

    // 1. Match by message_id
    if (data.message_id) {
      const cleanId = data.message_id.replace(/[<>]/g, '');
      const { data: existingEmail } = await supabase
        .from('emails')
        .select('thread_id')
        .eq('resend_id', cleanId)
        .limit(1)
        .single();

      if (existingEmail) {
        threadId = existingEmail.thread_id;
      }
    }

    // 2. Match by sender email + normalized subject
    if (!threadId) {
      const normalizedSubject = (data.subject || '').replace(/^(Re|Fwd|Fw):\s*/gi, '').trim();
      if (normalizedSubject) {
        const { data: existingThread } = await supabase
          .from('email_threads')
          .select('id')
          .eq('participant_email', sender.email)
          .ilike('subject', `%${normalizedSubject}%`)
          .order('last_message_at', { ascending: false })
          .limit(1)
          .single();

        if (existingThread) {
          threadId = existingThread.id;
        }
      }
    }

    // 3. Match by sender email alone
    if (!threadId) {
      const { data: existingThread } = await supabase
        .from('email_threads')
        .select('id')
        .eq('participant_email', sender.email)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (existingThread) {
        threadId = existingThread.id;
      }
    }

    // ─── Determine Owner ──────────────────────────────

    let ownerId: string | null = null;

    if (threadId) {
      const { data: thread } = await supabase
        .from('email_threads')
        .select('owner_id')
        .eq('id', threadId)
        .single();
      ownerId = thread?.owner_id || null;
    }

    // Try to link sender to a user
    if (!ownerId) {
      const { data: userByEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', sender.email)
        .limit(1)
        .single();

      if (userByEmail) {
        // Find an admin to own the thread
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_admin', true)
          .limit(1)
          .single();
        ownerId = adminProfile?.id || null;
      }
    }

    if (!ownerId) {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1)
        .single();
      ownerId = adminProfile?.id || null;
    }

    if (!ownerId) {
      logger.error('No owner found for inbound email', { from: sender.email });
      return NextResponse.json({ error: 'No owner found' }, { status: 422 });
    }

    // ─── Create or Update Thread ──────────────────────

    if (!threadId) {
      const { data: newThread, error: threadError } = await supabase
        .from('email_threads')
        .insert({
          subject: (data.subject || '(no subject)').replace(/^(Re|Fwd|Fw):\s*/gi, '').trim(),
          owner_id: ownerId,
          participant_email: sender.email,
          participant_name: sender.name,
          is_unread: true,
          status: 'received',
        })
        .select('id')
        .single();

      if (threadError) {
        logger.error('Failed to create email thread', { error: threadError });
        return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
      }
      threadId = newThread.id;
    } else {
      await supabase
        .from('email_threads')
        .update({ is_unread: true, status: 'received' })
        .eq('id', threadId);
    }

    // ─── Store Inbound Email ──────────────────────────

    const { data: storedEmail, error: emailError } = await supabase.from('emails').insert({
      thread_id: threadId,
      resend_id: data.email_id,
      direction: 'inbound',
      from_email: sender.email,
      from_name: sender.name,
      to_email: data.to?.[0] || '',
      subject: data.subject || '(no subject)',
      html_body: htmlBody,
      text_body: textBody,
      status: 'received',
      is_read: false,
      headers: { message_id: data.message_id || null },
    }).select('id').single();

    if (emailError) {
      logger.error('Failed to store inbound email', { error: emailError });
      return NextResponse.json({ error: 'Failed to store email' }, { status: 500 });
    }

    // ─── Async AI Processing (survives after response is sent) ───────────
    after(async () => {
      try {
        await processWithAI(storedEmail.id, {
          fromEmail: sender.email,
          fromName: sender.name,
          subject: data.subject || '',
          bodyText: textBody,
          bodyHtml: htmlBody,
          threadId: threadId!,
        });
      } catch (err) {
        logger.error('Background AI processing failed', { error: err });
      }
    });

    logger.info('Inbound email stored', { threadId, from: sender.email, hasBody: !!(htmlBody || textBody) });
    return NextResponse.json({ success: true, threadId });
  } catch (error) {
    logger.error('Inbound webhook error', { error });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

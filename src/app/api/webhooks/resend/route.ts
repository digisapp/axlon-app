import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend } from '@/lib/email/resend';
import { logger } from '@/lib/logger';

/**
 * Resend Inbound Email Webhook — /api/webhooks/resend
 *
 * Receives inbound emails from Resend when someone replies to an email
 * sent from axlon.ai. Auto-threads using In-Reply-To/References headers
 * or falls back to sender + subject matching.
 *
 * IMPORTANT: The webhook payload only contains metadata (from, to, subject).
 * We must call the Resend API to fetch the actual email body (html/text).
 *
 * Setup:
 * 1. Add MX records for your domain pointing to Resend
 * 2. Configure inbound webhook URL in Resend dashboard: /api/webhooks/resend
 * 3. Set RESEND_WEBHOOK_SECRET env var with the signing secret from Resend
 */

// ─── Types ──────────────────────────────────────────────

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    message_id?: string;
    created_at: string;
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
  /\b(unsubscribe|opt.out)\b/i, // marketing blasts, not real replies
  /\bnoreply@/i, // auto-generated, not real replies
  /\bmailer-daemon@/i,
  /\bpostmaster@/i,
];

const BLOCKED_DOMAINS = [
  'spam.com',
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'sharklasers.com',
];

function isSpam(from: string, subject: string): { isSpam: boolean; reason?: string } {
  const senderEmail = parseEmailAddress(from).email.toLowerCase();
  const senderDomain = senderEmail.split('@')[1];

  // Block disposable/known-spam domains
  if (BLOCKED_DOMAINS.includes(senderDomain)) {
    return { isSpam: true, reason: `blocked domain: ${senderDomain}` };
  }

  // Check subject against spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(subject)) {
      return { isSpam: true, reason: `spam pattern in subject: ${pattern.source}` };
    }
  }

  // Empty subject with no prior thread is suspicious
  if (!subject || subject.trim().length === 0) {
    return { isSpam: true, reason: 'empty subject' };
  }

  return { isSpam: false };
}

// ─── Handler ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();

    // Verify webhook signature using Resend SDK
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

    const event: ResendWebhookPayload = JSON.parse(payload);

    // Only handle inbound emails
    if (event.type !== 'email.received') {
      return NextResponse.json({ received: true });
    }

    const { data } = event;
    const sender = parseEmailAddress(data.from);

    // ─── Spam Filter ──────────────────────────────────
    const spamCheck = isSpam(data.from, data.subject);
    if (spamCheck.isSpam) {
      logger.info('Inbound email filtered as spam', { from: sender.email, reason: spamCheck.reason });
      return NextResponse.json({ received: true, filtered: true });
    }

    // ─── Fetch Full Email Body via Resend API ─────────
    // The webhook only sends metadata — we need the actual content
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
      // Continue without body — we still want to store the metadata
    }

    const supabase = createAdminClient();

    // ─── Thread Matching (3-tier) ─────────────────────

    let threadId: string | null = null;

    // 1. Match by message_id → In-Reply-To/References (Resend provides message_id)
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
      const normalizedSubject = data.subject.replace(/^(Re|Fwd|Fw):\s*/gi, '').trim();
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

    // 3. Match by sender email alone (most recent thread)
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

    if (!ownerId) {
      // Default to first admin user
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
          subject: data.subject.replace(/^(Re|Fwd|Fw):\s*/gi, '').trim(),
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

    const { error: emailError } = await supabase.from('emails').insert({
      thread_id: threadId,
      resend_id: data.email_id,
      direction: 'inbound',
      from_email: sender.email,
      from_name: sender.name,
      to_email: data.to[0],
      subject: data.subject,
      html_body: htmlBody,
      text_body: textBody,
      status: 'received',
      is_read: false,
      headers: { message_id: data.message_id || null },
    });

    if (emailError) {
      logger.error('Failed to store inbound email', { error: emailError });
      return NextResponse.json({ error: 'Failed to store email' }, { status: 500 });
    }

    logger.info('Inbound email stored', { threadId, from: sender.email, hasBody: !!(htmlBody || textBody) });
    return NextResponse.json({ success: true, threadId });
  } catch (error) {
    logger.error('Inbound webhook error', { error });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

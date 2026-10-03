import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { getResend } from '@/lib/email/resend';
import { suppressEmail } from '@/lib/email/suppression';
import { classifyAndDraftReply } from '@/lib/ai/email-classifier';
import { AdminInboxService, type EmailAttachmentMeta, type EmailStatus } from '@/lib/email/admin-inbox';
import { sendAutoReply } from '@/lib/email/auto-reply';
import { isLikelySpam, parseAuthResults } from '@/lib/email/spam';
import {
  cleanMessageId,
  findOurRecipient,
  isOurSender,
  parseEmailAddress,
  parseThreadIdFromAddresses,
  senderDisplayName,
} from '@/lib/email/inbound-address';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// The AI step runs in after() and can take up to 30 s on its own.
export const maxDuration = 60;

/**
 * Resend webhook — /api/webhooks/resend
 *
 * Inbound: Resend receives mail for ANY address on a receiving domain and
 * POSTs `email.received`. That event carries METADATA ONLY — ids, bare from,
 * to[], subject, attachment names. The body and the headers are fetched from
 * GET /emails/receiving/{email_id}. Replies to mail we sent arrive at
 * support+<threadId>@<receiving domain> (see inbound-address.ts), which
 * threads them exactly.
 *
 * Resend webhooks are ACCOUNT-wide, not domain-scoped, and this account is
 * shared with several unrelated projects. Only mail with a recipient on our
 * domains is stored; the rest is acknowledged and dropped before the body
 * fetch, so the AI never answers another business's customers as Axleyard.
 *
 * Delivery: `email.delivered` / `bounced` / `complained` / `failed` /
 * `opened` / `clicked` update the status of the outbound row with that Resend
 * id. Bounces and complaints also go on the suppression list.
 *
 * Ops: the endpoint registered in Resend must be exactly
 * `${NEXT_PUBLIC_APP_URL}/api/webhooks/resend` — www.axleyard.com 308s to the
 * bare domain and Svix treats every 3xx as a failed delivery.
 */

type ReceivedEmail = NonNullable<Awaited<ReturnType<ReturnType<typeof getResend>['emails']['receiving']['get']>>['data']>;

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[] | string;
    cc?: string[] | string;
    bcc?: string[] | string;
    received_for?: string[] | string;
    subject?: string;
    message_id?: string;
    attachments?: Array<{ id: string; filename?: string | null; content_type?: string; size?: number }>;
  };
}

function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string' && !!v);
  return typeof value === 'string' && value ? [value] : [];
}

function lowercaseKeys(h: Record<string, unknown> | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(h || {})) {
    if (v == null) continue;
    out[k.toLowerCase()] = Array.isArray(v) ? v.join(' ') : String(v);
  }
  return out;
}

// ─── Delivery status ────────────────────────────────────

const DELIVERY_STATUS: Record<string, EmailStatus> = {
  'email.delivered': 'delivered',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.failed': 'failed',
  'email.opened': 'opened',
  'email.clicked': 'clicked',
};

async function handleDeliveryStatus(event: ResendWebhookEvent) {
  const status = DELIVERY_STATUS[event.type];
  const emailId = event.data.email_id;
  if (!status || !emailId) return;

  const updatedRecipients = await AdminInboxService.updateDeliveryStatus(emailId, status);

  // A bounce or spam complaint must also stop future sends to that address —
  // continuing to mail it is what burns the sending domain's reputation.
  // Delivery webhooks are account-wide too: a bounce on another project's
  // mail must not put that address on OUR suppression list. The payload's
  // recipients count only when the message was ours (tracked in `emails`, or
  // sent from one of our domains).
  if (event.type === 'email.bounced' || event.type === 'email.complained') {
    const reason = event.type === 'email.bounced' ? 'bounced' : 'complained';
    const ours = updatedRecipients.length > 0 || isOurSender(event.data.from);
    const addresses = new Set<string>([
      ...updatedRecipients,
      ...(ours ? toList(event.data.to).map((a) => parseEmailAddress(a).email) : []),
    ].filter(Boolean));
    for (const address of addresses) await suppressEmail(address, reason);
  }

  logger.info('Email delivery status updated', { emailId, status, matched: updatedRecipients.length });
}

// ─── Handler ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Everything downstream trusts the sender field (admin inbox, LLM
    // classification, auto-replies from our support address), so an
    // unverified payload is an email-spoofing + outbound-spam vector.
    if (!env.resendWebhookSecret) {
      logger.error('Resend webhook: RESEND_WEBHOOK_SECRET is not set — rejecting');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Signature is over the raw body — read text first, parse after verify.
    const payload = await request.text();
    const resend = getResend();
    try {
      resend.webhooks.verify({
        payload,
        headers: {
          id: request.headers.get('svix-id') || '',
          timestamp: request.headers.get('svix-timestamp') || '',
          signature: request.headers.get('svix-signature') || '',
        },
        webhookSecret: env.resendWebhookSecret,
      });
    } catch {
      logger.error('Resend webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: ResendWebhookEvent = JSON.parse(payload);
    const data = event.data ?? {};

    if (event.type in DELIVERY_STATUS) {
      await handleDeliveryStatus(event);
      return NextResponse.json({ received: true });
    }

    if (event.type !== 'email.received') {
      return NextResponse.json({ received: true });
    }

    // ─── Inbound ─────────────────────────────────────
    const emailId = data.email_id;

    // Cheap pre-filter on the event's own recipients: mail for another
    // project's domain never needs the (rate-limited) body fetch.
    const eventRecipients = [...toList(data.received_for), ...toList(data.to), ...toList(data.cc), ...toList(data.bcc)];
    if (eventRecipients.length > 0 && !findOurRecipient(eventRecipients)) {
      return NextResponse.json({ received: true, ignored: 'not our domain' });
    }

    // The webhook has no body/headers. Fetch the full message; without it
    // there is nothing to read or classify, so a fetch failure is returned
    // as 5xx so Svix retries (dedup in the service makes retries safe).
    let full: ReceivedEmail | null = null;
    if (emailId) {
      // 'cid' keeps inline images as references to attachments. The default
      // inlines them as base64, which can put megabytes into html_body and
      // push a thread past the response size limit.
      const { data: fetched, error } = await resend.emails.receiving.get(emailId, { html_format: 'cid' });
      if (error || !fetched) {
        logger.error('Resend webhook: failed to fetch received email', { emailId, error: error?.message });
        return NextResponse.json({ error: 'Failed to fetch email content' }, { status: 502 });
      }
      full = fetched;
    }

    const recipients = [
      ...toList(data.received_for),
      ...toList(full?.received_for),
      ...toList(full?.to ?? data.to),
      ...toList(full?.cc ?? data.cc),
      ...toList(full?.bcc ?? data.bcc),
    ];
    const to = findOurRecipient(recipients);
    if (!to) {
      return NextResponse.json({ received: true, ignored: 'not our domain' });
    }

    const headers = lowercaseKeys(full?.headers);
    const { email: from } = parseEmailAddress(full?.from ?? data.from);
    if (!from || !from.includes('@')) {
      logger.warn('Resend webhook: ignoring email with no sender', { emailId });
      return NextResponse.json({ received: true, ignored: 'no sender' });
    }
    // Resend's `from` is the bare address; the display name only survives in
    // the raw From header.
    const fromName = senderDisplayName(headers['from'], full?.from ?? data.from);
    const subject = (full?.subject || data.subject || '').trim() || '(no subject)';
    const messageId = cleanMessageId(headers['message-id'] || full?.message_id || data.message_id);
    const inReplyTo = cleanMessageId(headers['in-reply-to']);
    const references = (headers['references'] || '').trim();
    const threadIdHint = parseThreadIdFromAddresses(recipients);
    const text = full?.text || null;
    const html = full?.html || null;
    const attachments: EmailAttachmentMeta[] = (full?.attachments ?? data.attachments ?? []).map((a) => ({
      id: a.id,
      filename: a.filename || 'attachment',
      contentType: a.content_type || '',
      size: typeof a.size === 'number' ? a.size : undefined,
      ...('content_id' in a && a.content_id ? { contentId: String(a.content_id).replace(/[<>]/g, '') } : {}),
    }));

    const auth = parseAuthResults(headers['authentication-results']);
    const spamCheck = isLikelySpam({ from, subject, text, headers });

    const stored = await AdminInboxService.storeInboundEmail({
      from,
      fromName,
      to,
      subject,
      text,
      html,
      messageId: messageId || undefined,
      inReplyTo: inReplyTo || undefined,
      references: references || undefined,
      threadIdHint,
      resendEmailId: emailId,
      cc: toList(full?.cc ?? data.cc).map((c) => parseEmailAddress(c).email),
      attachments,
      spam: spamCheck.spam,
      auth,
    });

    if (!stored) {
      logger.info('Resend webhook: duplicate inbound email skipped', { emailId, messageId });
      return NextResponse.json({ received: true, duplicate: true });
    }

    logger.info('Inbound email stored', {
      threadId: stored.thread.id, from, to, subject, spam: spamCheck.spam, reason: spamCheck.reason, hasBody: !!(html || text),
    });

    // AI classification + (optional) auto-reply run after the 200 is sent.
    // after() keeps the function alive until they finish — a bare floating
    // promise gets frozen once the response returns.
    if (!stored.thread.is_spam && !spamCheck.spam && process.env.XAI_API_KEY) {
      const { email, thread } = stored;
      after(async () => {
        try {
          const classification = await classifyAndDraftReply({
            fromEmail: from,
            fromName,
            subject,
            bodyText: text,
            bodyHtml: html,
          });
          await AdminInboxService.updateAiFields(email.id, {
            ai_category: classification.category,
            ai_confidence: classification.confidence,
            ai_summary: classification.summary,
            ai_draft_html: classification.draftHtml || null,
            ai_draft_text: classification.draftText || null,
          });
          const auto = await sendAutoReply(email.id, classification, {
            from,
            subject,
            threadId: thread.id,
            resendEmailId: emailId,
            headers,
          });
          if (!auto.sent) logger.info('No auto-reply', { emailId: email.id, reason: auto.reason });
        } catch (err) {
          logger.error('AI email processing failed', { error: err, emailId: email.id });
        }
      });
    }

    return NextResponse.json({ received: true, threadId: stored.thread.id, spam: spamCheck.spam });
  } catch (error) {
    logger.error('Resend webhook error', { error });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

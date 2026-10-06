import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import { buildUnsubscribeQuery } from '@/lib/email/unsubscribe-token';
import { isEmailSuppressed } from '@/lib/email/suppression';
import { getInboundAddress } from '@/lib/email/inbound-address';

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

/** The Resend client, or null when RESEND_API_KEY is not set (read-only checks). */
export function getResendOrNull(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return getResend();
}

export function getDefaultFrom(): string {
  // Trimmed: a value pasted into the host's env UI can carry a trailing newline.
  return process.env.RESEND_FROM_EMAIL?.trim() || 'AXLON AI <noreply@axlon.ai>';
}

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  /** Plain-text alternative. Omitted → Resend derives one from the HTML. */
  text?: string;
  /** Overrides RESEND_FROM_EMAIL. Must be on a verified sending domain. */
  from?: string;
  /**
   * Where a reply to this email goes. Defaults to the admin inbox address
   * (see inbound-address.ts) so "just reply to this email" lands in
   * /admin/email instead of the noreply mailbox. Pass `null` to send with no
   * Reply-To at all.
   */
  replyTo?: string | string[] | null;
  headers?: Record<string, string>;
  /**
   * 'marketing' sends (drip sequences, digests, reports) are checked against the
   * suppression list and skipped for opted-out recipients. Transactional mail
   * (password reset, confirmations, dealer lead alerts) always sends.
   * 'conversation' is one human writing to another from the admin inbox: no
   * List-Unsubscribe headers, no footer rewriting — Gmail would otherwise show
   * an "Unsubscribe" link on a support reply. Defaults to 'transactional'.
   */
  category?: 'transactional' | 'marketing' | 'conversation';
  /**
   * Resend idempotency key (honored for 24h). Set it wherever a retry could
   * send the same message twice, e.g. a cron row re-queued after a timeout.
   */
  idempotencyKey?: string;
  /** Files to attach: base64 content (no data: prefix). */
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
}

/**
 * Send an email via Resend. Used for transactional emails (welcome,
 * confirmation, alerts) and, with `category: 'conversation'`, for admin inbox
 * replies.
 */
export async function sendEmail(template: EmailTemplate) {
  const primaryRecipient = Array.isArray(template.to) ? template.to[0] : template.to;

  // Honor the opt-out list for marketing mail (CAN-SPAM).
  if (template.category === 'marketing' && (await isEmailSuppressed(primaryRecipient))) {
    logger.info('Skipping marketing email to suppressed recipient', { to: primaryRecipient });
    return null;
  }

  const resend = getResend();
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://axleyard.com').replace(/\/+$/, '');

  let html = template.html;
  const unsubHeaders: Record<string, string> = {};

  if (template.category !== 'conversation') {
    // Per-recipient HMAC token so the unsubscribe endpoint can verify the
    // request without CSRF/cookies (required for RFC 8058 one-click).
    const unsubQuery = buildUnsubscribeQuery(primaryRecipient);
    if (unsubQuery) {
      // One-click clients (Gmail/Yahoo) POST "List-Unsubscribe=One-Click" to
      // this URL; the API route reads email+token from the query string. Its
      // GET handler redirects browsers to the /unsubscribe confirmation page.
      unsubHeaders['List-Unsubscribe'] = `<${baseUrl}/api/unsubscribe?${unsubQuery}>`;
      unsubHeaders['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
      // Centrally rewrite tokenless unsubscribe links hard-coded in email
      // template footers so the visible link also carries the token.
      html = html.replace(
        /href="https?:\/\/[^"]*\/unsubscribe"/g,
        `href="${baseUrl}/unsubscribe?${unsubQuery}"`
      );
    } else {
      // No signing secret configured: fall back to the plain page link and omit
      // List-Unsubscribe-Post — the API would reject a tokenless one-click POST.
      unsubHeaders['List-Unsubscribe'] = `<${baseUrl}/unsubscribe?email=${encodeURIComponent(primaryRecipient)}>`;
    }
  }

  // undefined → the admin inbox; null → explicitly none.
  const replyTo = template.replyTo === undefined ? getInboundAddress() : template.replyTo;

  const { data, error } = await resend.emails.send(
    {
      from: template.from || getDefaultFrom(),
      to: template.to,
      subject: template.subject,
      html,
      ...(template.text ? { text: template.text } : {}),
      // The SDK takes camelCase `replyTo` and maps it to the API's `reply_to`
      // itself; a snake_case key here is silently dropped.
      ...(replyTo ? { replyTo } : {}),
      ...(template.attachments?.length ? { attachments: template.attachments } : {}),
      headers: {
        ...unsubHeaders,
        ...template.headers,
      },
    },
    template.idempotencyKey ? { idempotencyKey: template.idempotencyKey } : undefined
  );

  if (error) {
    logger.error('Email send error', { error });
    throw error;
  }

  return data;
}

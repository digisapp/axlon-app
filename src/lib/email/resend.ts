import { Resend } from 'resend';
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { buildUnsubscribeQuery } from '@/lib/email/unsubscribe-token';
import { isEmailSuppressed } from '@/lib/email/suppression';

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

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
  /**
   * 'marketing' sends (drip sequences, digests, reports) are checked against the
   * suppression list and skipped for opted-out recipients. Transactional mail
   * (password reset, confirmations, dealer lead alerts) always sends. Defaults
   * to 'transactional' so existing callers are unaffected.
   */
  category?: 'transactional' | 'marketing';
}

/**
 * Send an email via Resend (existing behavior, no DB tracking).
 * Used for transactional emails like welcome, confirmation, alerts.
 */
export async function sendEmail(template: EmailTemplate) {
  // Honor the opt-out list for marketing mail (CAN-SPAM).
  if (template.category === 'marketing' && (await isEmailSuppressed(template.to))) {
    logger.info('Skipping marketing email to suppressed recipient', { to: template.to });
    return null;
  }

  const resend = getResend();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';

  // Per-recipient HMAC token so the unsubscribe endpoint can verify the
  // request without CSRF/cookies (required for RFC 8058 one-click).
  const unsubQuery = buildUnsubscribeQuery(template.to);

  let html = template.html;
  const unsubHeaders: Record<string, string> = {};
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
    unsubHeaders['List-Unsubscribe'] = `<${baseUrl}/unsubscribe?email=${encodeURIComponent(template.to)}>`;
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>',
    to: template.to,
    subject: template.subject,
    html,
    headers: {
      ...unsubHeaders,
      ...template.headers,
    },
  });

  if (error) {
    logger.error('Email send error', { error });
    throw error;
  }

  return data;
}

/**
 * Send an email via Resend AND track it in the emails table.
 * Used for inbox emails (compose, reply) where we want conversation threading.
 */
export interface TrackedEmailOptions {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
  threadId: string;
  userId: string;
  supabase: SupabaseClient;
}

export async function sendTrackedEmail(options: TrackedEmailOptions) {
  const { to, subject, html, headers, threadId, userId, supabase } = options;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>';

  // Send via Resend
  const resendData = await sendEmail({ to, subject, html, headers });

  // Parse the from address for storage
  const fromMatch = fromEmail.match(/^(.+?)\s*<(.+?)>$/);
  const fromAddr = fromMatch ? fromMatch[2] : fromEmail;
  const fromName = fromMatch ? fromMatch[1].trim() : null;

  // Store in database
  const { data: email, error } = await supabase.from('emails').insert({
    thread_id: threadId,
    resend_id: resendData?.id || null,
    direction: 'outbound',
    from_email: fromAddr,
    from_name: fromName,
    to_email: to,
    subject,
    html_body: html,
    status: 'sent',
    is_read: true,
    headers: headers || {},
  }).select('id').single();

  if (error) {
    logger.error('Failed to track sent email in DB', { error, threadId });
  }

  return { resendId: resendData?.id, emailId: email?.id };
}

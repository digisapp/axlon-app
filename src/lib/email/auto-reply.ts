/**
 * AI auto-reply for the admin inbox: the guards that decide whether a
 * classified inbound email may be answered automatically, and the send.
 *
 * Classification itself lives in `@/lib/ai/email-classifier` (Grok). This
 * module only runs when the webhook has stored the email; nothing here is
 * reachable from a request a visitor can make.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { AdminInboxService, htmlToText } from './admin-inbox';
import type { EmailClassification } from '@/lib/ai/email-classifier';
import { isOurSender, replySubject } from './inbound-address';
import { parseAuthResults, senderAuthenticated } from './spam';

/**
 * Reasons an inbound email must never receive an automatic reply, no matter
 * how confident the classifier is.
 *
 * - Automated senders and list mail: an out-of-office responder (or another
 *   bot) and our auto-reply would ping-pong forever.
 * - Our own domains: a mailer-daemon or our own notification would get a
 *   cheerful "Thanks for reaching out" back.
 * - Unauthenticated senders: From is trivially forged, and a reply to a
 *   forged From lands on a third party — that is how a form or an inbox gets
 *   turned into an email-bombing relay. Only DMARC-passing mail is answered.
 */
export function autoReplySuppressionReason(args: {
  from: string;
  headers?: Record<string, string | string[] | undefined | null> | null;
}): string | null {
  const from = (args.from || '').toLowerCase().trim();
  if (!from || !from.includes('@')) return 'no sender address';
  const localPart = from.split('@')[0];
  if (isOurSender(from)) return 'sender is our own domain';
  if (/^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|auto-?reply|newsletter)\b/.test(localPart)) {
    return `sender looks automated (${localPart})`;
  }

  const h: Record<string, string> = {};
  for (const [k, v] of Object.entries(args.headers || {})) {
    if (v == null) continue;
    h[k.toLowerCase()] = Array.isArray(v) ? v.join(' ') : String(v);
  }
  const autoSubmitted = (h['auto-submitted'] || '').toLowerCase();
  if (autoSubmitted && autoSubmitted !== 'no') return `Auto-Submitted: ${autoSubmitted}`;
  const precedence = (h['precedence'] || h['x-precedence'] || '').toLowerCase();
  if (/bulk|list|junk|auto_reply/.test(precedence)) return `Precedence: ${precedence}`;
  if (h['x-auto-response-suppress'] || h['x-autoreply'] || h['x-autorespond'] || h['list-id'] || h['list-unsubscribe']) {
    return 'automated/list mail headers present';
  }
  if (!senderAuthenticated(parseAuthResults(h['authentication-results']))) {
    return 'sender not authenticated (no DMARC pass)';
  }
  return null;
}

/** How long after our last outbound in a thread we refuse to auto-reply again. */
export const AUTO_REPLY_THREAD_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export async function sendAutoReply(
  inboundEmailId: string,
  classification: EmailClassification,
  original: {
    from: string;
    subject: string;
    threadId: string;
    /** Resend's id of the inbound message: the idempotency key, so one message gets one reply. */
    resendEmailId?: string | null;
    headers?: Record<string, string | string[] | undefined | null> | null;
  },
): Promise<{ sent: boolean; reason?: string; outboundId?: string | null }> {
  // 0. Loop / forgery guards — evaluated before anything else so a
  //    misconfigured platform setting can't override them.
  const suppression = autoReplySuppressionReason({ from: original.from, headers: original.headers });
  if (suppression) return { sent: false, reason: `auto-reply suppressed: ${suppression}` };

  // The reply goes to the thread's participant, so the address that was just
  // authenticated has to BE that participant.
  const supabase = createAdminClient();
  const { data: thread } = await supabase
    .from('email_threads')
    .select('participant_email, is_spam')
    .eq('id', original.threadId)
    .maybeSingle();
  if (!thread) return { sent: false, reason: 'auto-reply suppressed: thread not found' };
  if (thread.is_spam) return { sent: false, reason: 'auto-reply suppressed: thread is spam' };
  if (String(thread.participant_email).trim().toLowerCase() !== original.from.trim().toLowerCase()) {
    return { sent: false, reason: 'auto-reply suppressed: sender is not the thread participant' };
  }

  const since = new Date(Date.now() - AUTO_REPLY_THREAD_COOLDOWN_MS).toISOString();
  const { count: recentOutbound, error: cooldownError } = await supabase
    .from('emails')
    .select('id', { count: 'exact', head: true })
    .eq('thread_id', original.threadId)
    .eq('direction', 'outbound')
    .gte('created_at', since);
  // Fail closed: if the cooldown can't be checked, nothing is sent.
  if (cooldownError) return { sent: false, reason: 'auto-reply suppressed: cooldown check failed' };
  if ((recentOutbound ?? 0) > 0) {
    return { sent: false, reason: 'auto-reply suppressed: we already replied on this thread in the last 24h' };
  }

  // 1. Platform toggle (off unless an admin turned it on, with confirmation).
  const enabled = await AdminInboxService.getSetting('ai_auto_reply_enabled');
  if (!enabled) return { sent: false, reason: 'ai_auto_reply_enabled is not true in platform settings' };

  // 2. Only safe categories at high confidence.
  // The reply is always rebuilt from plain text: model-written HTML is never
  // mailed out, so nothing in the inbound email can smuggle markup into it.
  const draft = (classification.draftText || htmlToText(classification.draftHtml)).trim();
  if (!classification.autoSendable || !draft) {
    return {
      sent: false,
      reason: `Category "${classification.category}" is not auto-sendable or confidence ${classification.confidence} too low`,
    };
  }

  // 3. Send through the normal reply path: threading headers, per-thread
  //    Reply-To, the inbound quoted underneath, outbound row stored, inbound
  //    marked replied. One auto-reply per inbound message, even if this runs twice.
  const result = await AdminInboxService.sendNewEmail({
    subject: replySubject(original.subject || '(no subject)'),
    bodyText: draft,
    replyToThreadId: original.threadId,
    autoSent: true,
    idempotencyKey: `auto-reply/${original.resendEmailId || inboundEmailId}`,
    ai: { category: classification.category, confidence: classification.confidence, summary: classification.summary },
  });
  if (!result.success) {
    logger.error('Auto-reply send failed', { error: result.error, inboundEmailId });
    return { sent: false, reason: `Email send failed: ${result.error}` };
  }

  logger.info('Auto-reply sent', { to: original.from, threadId: original.threadId, category: classification.category });
  return { sent: true, outboundId: result.emailId };
}

/**
 * Guards for the public forms (contact, apply, listing inquiry) against the
 * bots that have been using them, and for the mail those forms trigger.
 *
 * The attack seen since September: a bot fills a form with a random name, a
 * random 10-digit "message" and a third party's real email address, so that
 * the "we received your message" auto-reply bombs that person. The per-IP
 * rate limit does nothing against a few submissions a day from rotating IPs.
 *
 * Pure functions, unit tested. The one database check lives in
 * instant-reply-guard.ts.
 */

export interface FormSignalsInput {
  name: string | null | undefined;
  message: string | null | undefined;
  /** A field real people never see (CSS-hidden); any value means a bot. */
  honeypot?: string | null;
  /** Date.now() when the form was first shown, sent by the browser. */
  startedAt?: number | null;
  /** Date.now() at submission (injectable for tests). */
  now?: number;
}

/** Fewer milliseconds than this between opening a form and sending it is a bot. */
export const MIN_FILL_MS = 3000;

/** The honeypot field's name: looks like a real field to a form filler. */
export const HONEYPOT_FIELD = 'website';

/** Reasons a submission looks automated. Empty means it looks like a person. */
export function botSignals(input: FormSignalsInput): string[] {
  const reasons: string[] = [];
  if (input.honeypot && input.honeypot.trim()) reasons.push('honeypot filled');

  const now = input.now ?? Date.now();
  if (typeof input.startedAt === 'number' && Number.isFinite(input.startedAt)) {
    const elapsed = now - input.startedAt;
    // A clock skew in the future reads as 0 ms, which is also "too fast".
    if (elapsed < MIN_FILL_MS) reasons.push(`filled in ${Math.max(0, elapsed)} ms`);
  }

  const name = (input.name ?? '').trim();
  // "gdlOIndfiDUtAdyoidSyq": one long token with case flipping mid-word.
  if (name.length >= 12 && !/\s/.test(name)) {
    let flips = 0;
    for (let i = 1; i < name.length; i++) {
      const a = name[i - 1], b = name[i];
      if (/[a-z]/.test(a) && /[A-Z]/.test(b)) flips++;
    }
    if (flips >= 3) reasons.push('random-looking name');
  }

  const message = (input.message ?? '').trim();
  // A bare number (the bots send a random 10-digit "message").
  if (message && /^[\d\s().+-]{6,}$/.test(message)) reasons.push('message is only a number');

  return reasons;
}

/**
 * Local parts that are machines, not people: an automatic reply to one of
 * these either bounces or starts a loop.
 */
const AUTOMATED_LOCAL_PART = /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|auto-?reply|newsletter|abuse|security|subpoena\w*)\b/i;

/** Addresses that are SMS or paging gateways: mail to them is a text message someone pays for. */
const GATEWAY_DOMAINS = /@(vtext\.com|txt\.att\.net|tmomail\.net|messaging\.sprintpcs\.com|vzwpix\.com|mms\.att\.net|pm\.sprint\.com|email\.uscc\.net)$/i;

/**
 * Whether an automatic email may go to this address at all, ignoring rate.
 * Returns the reason it may not, or null.
 */
export function autoMailBlockedReason(to: string, message?: string | null): string | null {
  const address = (to || '').trim().toLowerCase();
  if (!address.includes('@')) return 'no address';
  if (AUTOMATED_LOCAL_PART.test(address.split('@')[0])) return 'automated address';
  if (GATEWAY_DOMAINS.test(address)) return 'SMS gateway address';
  if (message && /\b(?:https?:\/\/|www\.)\S+/i.test(message)) return 'message contains a link';
  return null;
}

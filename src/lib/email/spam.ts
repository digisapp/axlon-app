/**
 * Inbound trust heuristics for the admin inbox: spam filing and sender
 * authentication. Pure, so unit testable.
 *
 * Spam is stored and filed under the Spam folder (never dropped) so an admin
 * can rescue a false positive. Spam never gets an AI reply.
 */

const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|prince|inheritance)\b/i,
  /\b(unsubscribe.*click here|act now|limited time|free money)\b/i,
  /\b(bitcoin.*invest|crypto.*guaranteed|guaranteed return)\b/i,
  /\b(wire transfer|western union)\b/i,
];

const SPAM_TLDS = ['.xyz', '.top', '.click', '.bid', '.win', '.loan', '.buzz', '.icu'];

const BLOCKED_DOMAINS = [
  'spam.com', 'tempmail.com', 'throwaway.email', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com',
];

export function isLikelySpam(email: {
  from: string;
  subject: string;
  text?: string | null;
  /** Lower-cased raw headers; the receiving server's own verdicts are honoured. */
  headers?: Record<string, string> | null;
}): { spam: boolean; reason?: string } {
  const h = email.headers || {};
  if ((h['x-ses-virus-verdict'] || '').toUpperCase() === 'FAIL') return { spam: true, reason: 'virus verdict FAIL' };
  if ((h['x-ses-spam-verdict'] || '').toUpperCase() === 'FAIL') return { spam: true, reason: 'spam verdict FAIL' };

  const domain = email.from.split('@')[1]?.toLowerCase() || '';
  if (BLOCKED_DOMAINS.includes(domain)) return { spam: true, reason: `blocked domain ${domain}` };
  if (SPAM_TLDS.some((tld) => domain.endsWith(tld))) return { spam: true, reason: `spam TLD ${domain}` };
  const content = `${email.subject} ${email.text || ''}`;
  const matches = SPAM_PATTERNS.filter((p) => p.test(content)).length;
  if (matches >= 2) return { spam: true, reason: `${matches} spam patterns` };
  return { spam: false };
}

export interface SenderAuth {
  spf: string | null;
  dkim: string | null;
  dmarc: string | null;
}

/** The authserv-id Resend's receiving servers (Amazon SES) stamp on mail. */
export const TRUSTED_AUTHSERV_ID = 'amazonses.com';

/**
 * SPF / DKIM / DMARC verdicts out of an `Authentication-Results` header
 * (`amazonses.com; spf=pass …; dkim=pass …; dmarc=pass …`).
 *
 * A sender can put their own Authentication-Results header in a message, so
 * only one written by the receiving server counts: it must start with that
 * server's authserv-id, and a value carrying more than one DMARC verdict
 * (two headers folded together) is refused outright. Null whenever it
 * cannot be trusted or carries none of the three.
 */
export function parseAuthResults(header: string | null | undefined): SenderAuth | null {
  const value = (header || '').trim();
  if (!value) return null;
  if (!value.toLowerCase().startsWith(`${TRUSTED_AUTHSERV_ID};`)) return null;
  if ((value.match(/(?:^|[;\s])dmarc=/gi) || []).length > 1) return null;
  const pick = (key: string) => value.match(new RegExp(`(?:^|[;\\s])${key}=([a-z]+)`, 'i'))?.[1]?.toLowerCase() ?? null;
  const auth = { spf: pick('spf'), dkim: pick('dkim'), dmarc: pick('dmarc') };
  return auth.spf || auth.dkim || auth.dmarc ? auth : null;
}

/**
 * Is the From address proven to be who it says? Only an aligned DMARC pass
 * counts: SPF alone authenticates the envelope, not the From header, so a
 * forged From on a domain without DMARC would otherwise look fine. Anything
 * automated (the AI auto-reply) must not answer a sender that fails this —
 * a reply to a forged From lands on a third party.
 */
export function senderAuthenticated(auth: SenderAuth | null | undefined): boolean {
  return auth?.dmarc === 'pass';
}

/** The sender demonstrably is not who the From header claims. */
export function senderFailedAuth(auth: SenderAuth | null | undefined): boolean {
  return auth?.dmarc === 'fail';
}

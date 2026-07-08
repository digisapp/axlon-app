import crypto from 'crypto';

/**
 * Unsubscribe link tokens.
 *
 * Every outbound email embeds an HMAC-SHA256 token derived from the
 * recipient's email address. The unsubscribe API only honors requests that
 * present a valid token, which proves the requester received an email from
 * us (or controls the address) — without it, anyone could unsubscribe any
 * address (CAN-SPAM abuse vector in the other direction).
 *
 * Scheme: HMAC-SHA256(secret, `unsubscribe:v1:${normalizedEmail}`), hex.
 * Tokens are deliberately non-expiring: CAN-SPAM requires unsubscribe links
 * to keep working for at least 30 days after send, and old emails linger in
 * inboxes far longer.
 *
 * Secret: UNSUBSCRIBE_SECRET, falling back to INTERNAL_API_SECRET and then
 * CRON_SECRET so tokenized links work before the dedicated var is set.
 * Verification accepts tokens minted with ANY of the configured secrets, so
 * setting UNSUBSCRIBE_SECRET later doesn't break links in already-sent
 * emails that were signed with a fallback secret.
 */

const TOKEN_SCOPE = 'unsubscribe:v1';

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function candidateSecrets(): string[] {
  return [
    process.env.UNSUBSCRIBE_SECRET,
    process.env.INTERNAL_API_SECRET,
    process.env.CRON_SECRET,
  ].filter((s): s is string => Boolean(s && s.trim() !== ''));
}

function hmac(secret: string, email: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${TOKEN_SCOPE}:${normalizeEmail(email)}`)
    .digest('hex');
}

function timingSafeMatch(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * Generate the unsubscribe token for a recipient. Returns null when no
 * secret is configured (feature degrades to tokenless links; the API will
 * reject unsubscribe attempts, so configure at least one secret in prod).
 */
export function generateUnsubscribeToken(email: string): string | null {
  const secrets = candidateSecrets();
  if (secrets.length === 0) return null;
  return hmac(secrets[0], email);
}

/**
 * Verify a token against every configured secret (constant-time compare)
 * so links signed before a secret rotation/addition remain valid.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const secrets = candidateSecrets();
  let valid = false;
  for (const secret of secrets) {
    if (timingSafeMatch(token, hmac(secret, email))) valid = true;
  }
  return valid;
}

/** Query string (`email=..&token=..`) for unsubscribe URLs, or null if no secret. */
export function buildUnsubscribeQuery(email: string): string | null {
  const token = generateUnsubscribeToken(email);
  if (!token) return null;
  return `email=${encodeURIComponent(normalizeEmail(email))}&token=${token}`;
}

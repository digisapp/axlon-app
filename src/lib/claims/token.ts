import crypto from 'crypto';

/**
 * Claim links prove that the holder received the invitation we sent to the
 * dealer's own contact address, so the token must never be derivable by a
 * visitor: it is an HMAC over the dealer_sources id with a server secret.
 * Server-only — never import from client components.
 */
function secret(): string | null {
  return process.env.INTERNAL_API_SECRET || process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || null;
}

export function makeClaimToken(sourceId: string): string | null {
  const key = secret();
  if (!key) return null;
  return crypto.createHmac('sha256', key).update(`claim:${sourceId}`).digest('hex').slice(0, 40);
}

export function verifyClaimToken(sourceId: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = makeClaimToken(sourceId);
  if (!expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function buildClaimUrl(baseUrl: string, sourceId: string): string | null {
  const token = makeClaimToken(sourceId);
  if (!token) return null;
  return `${baseUrl.replace(/\/+$/, '')}/claim?source=${encodeURIComponent(sourceId)}&t=${token}`;
}

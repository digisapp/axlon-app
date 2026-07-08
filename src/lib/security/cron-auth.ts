import crypto from 'crypto';
import type { NextRequest } from 'next/server';

/**
 * Verify a cron request's `Authorization: Bearer <CRON_SECRET>` header.
 *
 * - Fails closed: if CRON_SECRET is not configured, ALL requests are rejected
 *   (previously `Bearer undefined` would authorize when the env var was unset).
 * - Uses a constant-time comparison to avoid timing side channels.
 */
export function verifyCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(authHeader);

  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(expected, provided);
}

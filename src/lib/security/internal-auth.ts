import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

function timingSafeMatch(signature: string, expected: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Verify that a request is from an internal service.
 * Uses HMAC signature verification with a shared secret.
 *
 * Preferred (v2) signature covers `timestamp.METHOD.path`, so a captured
 * signature is only replayable against the same endpoint+method within the
 * timestamp window. The legacy timestamp-only format is still accepted for
 * external callers that haven't migrated — remove that fallback once all
 * callers send v2.
 */
export function verifyInternalRequest(request: NextRequest): boolean {
  const internalSecret = process.env.INTERNAL_API_SECRET;

  // If no secret is configured, reject internal requests
  if (!internalSecret) {
    logger.warn('INTERNAL_API_SECRET not configured - internal endpoints disabled');
    return false;
  }

  const signature = request.headers.get('x-internal-signature');
  const timestamp = request.headers.get('x-internal-timestamp');

  if (!signature || !timestamp) {
    return false;
  }

  // Verify timestamp is within 5 minutes to prevent replay attacks
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);

  if (isNaN(requestTime) || Math.abs(now - requestTime) > 5 * 60 * 1000) {
    return false;
  }

  // v2: signature bound to method + path
  const v2Payload = `${timestamp}.${request.method.toUpperCase()}.${request.nextUrl.pathname}`;
  const expectedV2 = crypto
    .createHmac('sha256', internalSecret)
    .update(v2Payload)
    .digest('hex');

  if (timingSafeMatch(signature, expectedV2)) {
    return true;
  }

  // Legacy: timestamp-only signature (replayable across endpoints — migrate
  // callers to v2 and delete this)
  const expectedLegacy = crypto
    .createHmac('sha256', internalSecret)
    .update(`${timestamp}`)
    .digest('hex');

  if (timingSafeMatch(signature, expectedLegacy)) {
    logger.warn('Internal request used legacy timestamp-only signature', {
      path: request.nextUrl.pathname,
    });
    return true;
  }

  return false;
}

/**
 * Generate headers for internal API calls.
 * Pass the method and path of the request being made so the signature is
 * bound to that endpoint (v2 format).
 */
export function generateInternalHeaders(method: string, path: string): Record<string, string> {
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (!internalSecret) {
    throw new Error('INTERNAL_API_SECRET not configured');
  }

  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', internalSecret)
    .update(`${timestamp}.${method.toUpperCase()}.${path}`)
    .digest('hex');

  return {
    'x-internal-signature': signature,
    'x-internal-timestamp': timestamp,
  };
}


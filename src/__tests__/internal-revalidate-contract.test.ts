import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { verifyInternalRequest } from '@/lib/security/internal-auth';
// Plain .mjs script module — no type declarations, so import it untyped.
import { signInternalRequest } from '../../scripts/lib/manufacturer-scraper-utils.mjs';

/**
 * The scraper (a script) signs; the app (a route handler) verifies. They live
 * in different worlds and share only a string format. This test runs the
 * script's signer through the app's real verifier so the two can't drift
 * apart silently — a drift here means every scrape's revalidation quietly
 * returns 401 and the microsites go stale.
 */
const PATH = '/api/internal/revalidate';
const SECRET = 'test-secret-do-not-use';

function requestWith(headers: Record<string, string>, method = 'POST', path = PATH) {
  return new NextRequest(`https://axleyard.com${path}`, { method, headers });
}

describe('internal revalidate: signer ↔ verifier contract', () => {
  let saved: string | undefined;
  beforeEach(() => {
    saved = process.env.INTERNAL_API_SECRET;
    process.env.INTERNAL_API_SECRET = SECRET;
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.INTERNAL_API_SECRET;
    else process.env.INTERNAL_API_SECRET = saved;
  });

  it('accepts a request the scraper signed for this method and path', () => {
    expect(verifyInternalRequest(requestWith(signInternalRequest('POST', PATH)))).toBe(true);
  });

  it('rejects the same signature replayed against another endpoint', () => {
    const headers = signInternalRequest('POST', PATH);
    expect(verifyInternalRequest(requestWith(headers, 'POST', '/api/admin/microsites'))).toBe(false);
  });

  it('rejects the same signature replayed with another method', () => {
    const headers = signInternalRequest('POST', PATH);
    expect(verifyInternalRequest(requestWith(headers, 'DELETE', PATH))).toBe(false);
  });

  it('rejects a signature made with the wrong secret', () => {
    const headers = signInternalRequest('POST', PATH, 'some-other-secret');
    expect(verifyInternalRequest(requestWith(headers))).toBe(false);
  });

  it('rejects a stale timestamp', () => {
    const headers = signInternalRequest('POST', PATH);
    headers['x-internal-timestamp'] = String(Date.now() - 6 * 60 * 1000);
    expect(verifyInternalRequest(requestWith(headers))).toBe(false);
  });

  it('rejects everything when the app has no secret configured', () => {
    const headers = signInternalRequest('POST', PATH);
    delete process.env.INTERNAL_API_SECRET;
    expect(verifyInternalRequest(requestWith(headers))).toBe(false);
  });
});

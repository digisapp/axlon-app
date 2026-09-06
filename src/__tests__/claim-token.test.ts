import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { makeClaimToken, verifyClaimToken, buildClaimUrl } from '@/lib/claims/token';

const SOURCE = '11111111-2222-4333-8444-555555555555';

describe('claim token', () => {
  const original = process.env.INTERNAL_API_SECRET;
  beforeEach(() => { process.env.INTERNAL_API_SECRET = 'test-secret'; });
  afterEach(() => { process.env.INTERNAL_API_SECRET = original; });

  it('round-trips for the same source id', () => {
    const token = makeClaimToken(SOURCE);
    expect(token).toMatch(/^[0-9a-f]{40}$/);
    expect(verifyClaimToken(SOURCE, token)).toBe(true);
  });

  it('rejects tokens for a different source, tampering, and empty input', () => {
    const token = makeClaimToken(SOURCE)!;
    expect(verifyClaimToken('11111111-2222-4333-8444-555555555556', token)).toBe(false);
    expect(verifyClaimToken(SOURCE, token.slice(0, -1) + (token.endsWith('0') ? '1' : '0'))).toBe(false);
    expect(verifyClaimToken(SOURCE, '')).toBe(false);
    expect(verifyClaimToken(SOURCE, null)).toBe(false);
  });

  it('builds a claim URL without double slashes', () => {
    expect(buildClaimUrl('https://axleyard.com/', SOURCE)).toMatch(/^https:\/\/axleyard\.com\/claim\?source=.+&t=[0-9a-f]{40}$/);
  });

  it('refuses to mint anything without a server secret', () => {
    delete process.env.INTERNAL_API_SECRET;
    delete process.env.UNSUBSCRIBE_SECRET;
    delete process.env.CRON_SECRET;
    expect(makeClaimToken(SOURCE)).toBeNull();
    expect(verifyClaimToken(SOURCE, 'anything')).toBe(false);
  });
});

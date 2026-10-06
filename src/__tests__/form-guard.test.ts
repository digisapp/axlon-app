import { describe, expect, it } from 'vitest';
import { autoMailBlockedReason, botSignals, MIN_FILL_MS } from '@/lib/leads/form-guard';

describe('botSignals', () => {
  const now = 1_700_000_000_000;

  it('lets a person through', () => {
    expect(botSignals({ name: 'Jim Walker', message: 'Is the 55-ton lowboy still available?', honeypot: '', startedAt: now - 45_000, now })).toEqual([]);
    // No timing info at all (an old client) is not held against them.
    expect(botSignals({ name: 'Dana Reyes', message: 'Call me about the step deck.' })).toEqual([]);
  });

  it('catches the bot signature seen on the contact form', () => {
    const reasons = botSignals({ name: 'gdlOIndfiDUtAdyoidSyq', message: '4830192837', honeypot: '', startedAt: now - 900, now });
    expect(reasons).toContain('random-looking name');
    expect(reasons).toContain('message is only a number');
    expect(reasons.some((r) => r.startsWith('filled in'))).toBe(true);
  });

  it('treats a filled honeypot or an instant submit as a bot on its own', () => {
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', honeypot: 'http://x', startedAt: now - 60_000, now })).toEqual(['honeypot filled']);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now - (MIN_FILL_MS - 1), now })).toHaveLength(1);
    expect(botSignals({ name: 'Jim Walker', message: 'Hello', startedAt: now + 5_000, now })).toEqual(['filled in 0 ms']);
  });

  it('does not flag ordinary names or messages', () => {
    for (const name of ['DeShawn McAllister', 'TJ', "O'Brien-Smith", 'José María López', 'JimWalker']) {
      expect(botSignals({ name, message: 'Hi there' })).toEqual([]);
    }
    expect(botSignals({ name: 'Jim', message: 'Call me at 469-555-0142 about unit 12' })).toEqual([]);
  });
});

describe('autoMailBlockedReason', () => {
  it('never mails machines, SMS gateways, or back a link', () => {
    expect(autoMailBlockedReason('jim@example.com', 'Is it available?')).toBeNull();
    expect(autoMailBlockedReason('no-reply@bank.example')).toBe('automated address');
    expect(autoMailBlockedReason('subpoenainquiries@valvesoftware.com')).toBe('automated address');
    expect(autoMailBlockedReason('5551234567@vtext.com')).toBe('SMS gateway address');
    expect(autoMailBlockedReason('jim@example.com', 'see https://evil.test/claim')).toBe('message contains a link');
    expect(autoMailBlockedReason('not-an-address')).toBe('no address');
  });
});

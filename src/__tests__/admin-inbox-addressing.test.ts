import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanMessageId,
  decodeEncodedWords,
  findOurRecipient,
  getAdminFrom,
  getInboundAddress,
  getInboundDomain,
  isOurInboundAddress,
  normalizeSubject,
  parseEmailAddress,
  parseThreadIdFromAddresses,
  replySubject,
  senderDisplayName,
  threadReplyAddress,
} from '@/lib/email/inbound-address';
import { isLikelySpam, parseAuthResults, senderAuthenticated, senderFailedAuth } from '@/lib/email/spam';
import { autoReplySuppressionReason } from '@/lib/email/auto-reply';
import {
  buildQuote, canAdvanceStatus, htmlToText, idList, isBulkAction, isInboxFolder, isInboxSettingKey, searchPattern, textToHtml,
} from '@/lib/email/admin-inbox';
import { isResendInboundMx, registeredZone, zoneHost } from '@/lib/email/inbox-status';

const THREAD = '7f3d2a10-9c4b-4e6f-8a1d-2b3c4d5e6f70';

describe('inbound addressing', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    delete process.env.ADMIN_EMAIL_ADDRESS;
    delete process.env.ADMIN_EMAIL_FROM;
    delete process.env.INBOUND_EMAIL_DOMAINS;
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  it('defaults the receiving mailbox to support@axleyard.com and honours the env override', () => {
    expect(getInboundAddress()).toBe('support@axleyard.com');
    expect(getInboundDomain()).toBe('axleyard.com');
    process.env.ADMIN_EMAIL_ADDRESS = '"Inbox@Inbound.Axleyard.com"';
    expect(getInboundAddress()).toBe('inbox@inbound.axleyard.com');
    expect(getInboundDomain()).toBe('inbound.axleyard.com');
    process.env.ADMIN_EMAIL_ADDRESS = 'not-an-address';
    expect(getInboundAddress()).toBe('support@axleyard.com');
  });

  it('builds the From header from ADMIN_EMAIL_FROM with a safe default', () => {
    expect(getAdminFrom()).toBe('Axleyard Support <support@axleyard.com>');
    process.env.ADMIN_EMAIL_FROM = 'Sales <sales@axlon.ai>';
    expect(getAdminFrom()).toBe('Sales <sales@axlon.ai>');
    process.env.ADMIN_EMAIL_FROM = 'garbage';
    expect(getAdminFrom()).toBe('Axleyard Support <support@axleyard.com>');
  });

  it('tags the Reply-To with the thread id and round-trips it', () => {
    const replyTo = threadReplyAddress(THREAD, 'support@axleyard.com');
    expect(replyTo).toBe(`support+${THREAD}@axleyard.com`);
    expect(parseThreadIdFromAddresses([`Axleyard <${replyTo}>`], 'support@axleyard.com')).toBe(THREAD);
    // A different local part or domain is not our tag.
    expect(parseThreadIdFromAddresses([`sales+${THREAD}@axleyard.com`], 'support@axleyard.com')).toBeNull();
    expect(parseThreadIdFromAddresses([`support+${THREAD}@example.com`], 'support@axleyard.com')).toBeNull();
    // Non-UUID tags are ignored and never produce a plus-address.
    expect(parseThreadIdFromAddresses(['support+hello@axleyard.com'], 'support@axleyard.com')).toBeNull();
    expect(threadReplyAddress('nope', 'support@axleyard.com')).toBe('support@axleyard.com');
  });

  it('recognises mail for our domains and subdomains only', () => {
    expect(isOurInboundAddress('support@axleyard.com')).toBe(true);
    expect(isOurInboundAddress('Someone <sales@axlon.ai>')).toBe(true);
    expect(isOurInboundAddress('x@dealers.axlon.ai')).toBe(true);
    expect(isOurInboundAddress('x@inbound.digis.cc')).toBe(false);
    expect(isOurInboundAddress('x@notaxleyard.com')).toBe(false);
    expect(findOurRecipient(['a@other.io', 'Support <support@axleyard.com>'])).toBe('support@axleyard.com');
    expect(findOurRecipient(['a@other.io'])).toBeNull();
    process.env.INBOUND_EMAIL_DOMAINS = 'example.org';
    expect(isOurInboundAddress('x@example.org')).toBe(true);
  });

  it('parses display names and bare addresses', () => {
    expect(parseEmailAddress('"José Pérez" <jose@example.com>')).toEqual({ name: 'José Pérez', email: 'jose@example.com' });
    expect(parseEmailAddress('Jane <JANE@Example.com>')).toEqual({ name: 'Jane', email: 'jane@example.com' });
    expect(parseEmailAddress('<a@b.co>')).toEqual({ name: null, email: 'a@b.co' });
    expect(parseEmailAddress('a@b.co')).toEqual({ name: null, email: 'a@b.co' });
  });

  it('decodes RFC 2047 encoded words in From headers', () => {
    const b64 = Buffer.from('José Pérez', 'utf8').toString('base64');
    expect(decodeEncodedWords(`=?UTF-8?B?${b64}?= <jose@example.com>`)).toBe('José Pérez <jose@example.com>');
    expect(decodeEncodedWords('=?UTF-8?Q?Jos=C3=A9_P=C3=A9rez?= <jose@example.com>')).toBe('José Pérez <jose@example.com>');
    expect(senderDisplayName(`=?UTF-8?B?${b64}?= <jose@example.com>`, 'jose@example.com')).toBe('José Pérez');
    expect(senderDisplayName(undefined, 'jose@example.com')).toBeNull();
    expect(senderDisplayName('"Jane\r\n Doe" <x@y.z>', null)).toBe('Jane Doe');
    // A name that is only quotes/brackets falls back to null (callers show the address).
    expect(senderDisplayName('">>" <x@y.z>', null)).toBeNull();
  });

  it('normalises subjects and message ids', () => {
    expect(normalizeSubject('Re: RE: Fwd: Lowboy quote')).toBe('Lowboy quote');
    expect(normalizeSubject('Lowboy quote')).toBe('Lowboy quote');
    expect(replySubject('Lowboy quote')).toBe('Re: Lowboy quote');
    expect(replySubject('RE: Lowboy quote')).toBe('RE: Lowboy quote');
    expect(cleanMessageId(' <abc@mail.example> ')).toBe('abc@mail.example');
    expect(cleanMessageId(42)).toBe('');
  });
});

describe('spam heuristics', () => {
  it('files obvious junk as spam but keeps ordinary mail', () => {
    expect(isLikelySpam({ from: 'buyer@example.com', subject: 'Question about your 55-ton lowboy', text: 'Is it still available?' }).spam).toBe(false);
    expect(isLikelySpam({ from: 'x@promo.xyz', subject: 'Hello', text: '' }).spam).toBe(true);
    expect(isLikelySpam({ from: 'x@mailinator.com', subject: 'Hello', text: '' }).spam).toBe(true);
    expect(isLikelySpam({ from: 'x@example.com', subject: 'You are a lottery winner', text: 'act now for free money' }).spam).toBe(true);
    expect(isLikelySpam({ from: 'x@example.com', subject: 'Winner of the bid', text: 'Congrats on the auction' }).spam).toBe(false);
  });
});

describe('sender authentication', () => {
  const SES = 'amazonses.com; spf=pass (spfCheck: domain of example.com designates 1.2.3.4 as permitted sender) smtp.mailfrom=example.com; dkim=pass header.i=@example.com; dmarc=pass header.from=example.com;';

  it('reads SPF / DKIM / DMARC verdicts from the receiving server\'s Authentication-Results', () => {
    expect(parseAuthResults(SES)).toEqual({ spf: 'pass', dkim: 'pass', dmarc: 'pass' });
    expect(parseAuthResults('amazonses.com; spf=pass smtp.mailfrom=a.com; dmarc=fail header.from=b.com')).toEqual({ spf: 'pass', dkim: null, dmarc: 'fail' });
    expect(parseAuthResults('amazonses.com; none')).toBeNull();
    expect(parseAuthResults(undefined)).toBeNull();
  });

  it('ignores an Authentication-Results header the sender could have written', () => {
    // Not stamped by our receiving server.
    expect(parseAuthResults('mx.attacker.test; spf=pass; dkim=pass; dmarc=pass')).toBeNull();
    expect(parseAuthResults('dmarc=pass')).toBeNull();
    // Two headers folded into one value: refuse rather than guess which is real.
    expect(parseAuthResults(`${SES} amazonses.com; dmarc=fail`)).toBeNull();
    expect(parseAuthResults(`amazonses.com; dmarc=pass x; dmarc=pass`)).toBeNull();
  });

  it('only an aligned DMARC pass proves the From address', () => {
    expect(senderAuthenticated({ spf: 'pass', dkim: 'pass', dmarc: 'pass' })).toBe(true);
    // SPF authenticates the envelope, not the From header a reply would go to.
    expect(senderAuthenticated({ spf: 'pass', dkim: null, dmarc: 'none' })).toBe(false);
    expect(senderAuthenticated({ spf: 'pass', dkim: 'pass', dmarc: 'fail' })).toBe(false);
    expect(senderAuthenticated(null)).toBe(false);
    expect(senderFailedAuth({ spf: 'pass', dkim: null, dmarc: 'fail' })).toBe(true);
    expect(senderFailedAuth({ spf: 'pass', dkim: null, dmarc: 'none' })).toBe(false);
    expect(senderFailedAuth(null)).toBe(false);
  });

  it('honours the receiving server\'s own spam and virus verdicts', () => {
    const mail = { from: 'buyer@example.com', subject: 'Question about a lowboy', text: 'Is it available?' };
    expect(isLikelySpam({ ...mail, headers: { 'x-ses-spam-verdict': 'FAIL' } }).spam).toBe(true);
    expect(isLikelySpam({ ...mail, headers: { 'x-ses-virus-verdict': 'FAIL' } }).spam).toBe(true);
    expect(isLikelySpam({ ...mail, headers: { 'x-ses-spam-verdict': 'PASS', 'x-ses-virus-verdict': 'PASS' } }).spam).toBe(false);
  });
});

describe('auto-reply guards', () => {
  const PASS = { 'Authentication-Results': 'amazonses.com; spf=pass smtp.mailfrom=example.com; dkim=pass header.i=@example.com; dmarc=pass header.from=example.com' };

  it('answers an authenticated person', () => {
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: PASS })).toBeNull();
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { ...PASS, 'auto-submitted': 'no' } })).toBeNull();
  });

  it('never answers a sender whose From address is not proven', () => {
    // A reply to a forged From lands on a third party.
    expect(autoReplySuppressionReason({ from: 'buyer@example.com' })).toMatch(/not authenticated/);
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { 'Authentication-Results': 'amazonses.com; spf=pass smtp.mailfrom=evil.test; dmarc=none' } })).toMatch(/not authenticated/);
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { 'Authentication-Results': 'amazonses.com; spf=pass; dkim=pass; dmarc=fail' } })).toMatch(/not authenticated/);
    // A pass the sender wrote themselves does not count.
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { 'Authentication-Results': 'mx.attacker.test; dmarc=pass' } })).toMatch(/not authenticated/);
  });

  it('never answers automated senders, our own domain, or list mail', () => {
    expect(autoReplySuppressionReason({ from: 'no-reply@example.com', headers: PASS })).toMatch(/automated/);
    expect(autoReplySuppressionReason({ from: 'mailer-daemon@example.com', headers: PASS })).toMatch(/automated/);
    expect(autoReplySuppressionReason({ from: 'notifications@example.com', headers: PASS })).toMatch(/automated/);
    expect(autoReplySuppressionReason({ from: 'someone@axleyard.com', headers: PASS })).toMatch(/own domain/);
    expect(autoReplySuppressionReason({ from: 'someone@dealers.axlon.ai', headers: PASS })).toMatch(/own domain/);
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { ...PASS, 'Auto-Submitted': 'auto-replied' } })).toMatch(/Auto-Submitted/);
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { ...PASS, Precedence: 'bulk' } })).toMatch(/Precedence/);
    expect(autoReplySuppressionReason({ from: 'buyer@example.com', headers: { ...PASS, 'List-Unsubscribe': '<mailto:x>' } })).toMatch(/list mail/);
    expect(autoReplySuppressionReason({ from: '' })).toBe('no sender address');
  });
});

describe('reply bodies', () => {
  it('turns an HTML email into readable text', () => {
    expect(htmlToText('<style>p{color:red}</style><p>Hello&nbsp;<b>there</b></p><p>Line 2<br>Line 3 &amp; more</p>')).toBe('Hello there\nLine 2\nLine 3 & more');
    expect(htmlToText(null)).toBe('');
  });

  it('quotes the original as escaped text, never as its own HTML', () => {
    const quote = buildQuote({
      from_email: 'buyer@example.com',
      from_name: 'Buyer <b>',
      created_at: '2026-10-01T15:00:00Z',
      text_body: null,
      html_body: '<p>Is the <a href="https://evil.test">lowboy</a> available?</p><script>alert(1)</script>',
    });
    expect(quote).not.toBeNull();
    expect(quote!.html).not.toMatch(/<a |<script|<b>/);
    expect(quote!.html).toContain('Buyer &lt;b&gt; &lt;buyer@example.com&gt; wrote:');
    expect(quote!.html).toContain('Is the lowboy available?');
    expect(quote!.text).toMatch(/wrote:\n> Is the lowboy available\?/);
    expect(buildQuote({ from_email: 'a@b.co', from_name: null, created_at: 'x', text_body: '  ', html_body: null })).toBeNull();
    expect(buildQuote(null)).toBeNull();
  });

  it('never moves a delivery status backwards, and failures always win', () => {
    expect(canAdvanceStatus('sent', 'delivered')).toBe(true);
    expect(canAdvanceStatus('delivered', 'opened')).toBe(true);
    expect(canAdvanceStatus('opened', 'delivered')).toBe(false);
    expect(canAdvanceStatus('clicked', 'opened')).toBe(false);
    expect(canAdvanceStatus('bounced', 'delivered')).toBe(false);
    expect(canAdvanceStatus('delivered', 'bounced')).toBe(true);
    expect(canAdvanceStatus('opened', 'complained')).toBe(true);
    expect(canAdvanceStatus('sent', 'failed')).toBe(true);
  });
});

describe('inbox whitelists', () => {
  it('only accepts known folders, bulk actions and setting keys', () => {
    expect(isInboxFolder('inbox')).toBe(true);
    expect(isInboxFolder('trash')).toBe(false);
    expect(isBulkAction('markRead')).toBe(true);
    expect(isBulkAction('drop table')).toBe(false);
    expect(isInboxSettingKey('ai_auto_reply_enabled')).toBe(true);
    expect(isInboxSettingKey('stripe_live')).toBe(false);
  });

  it('validates id lists', () => {
    expect(idList([THREAD, THREAD.replace('7f3d', '8f3d')])).toHaveLength(2);
    expect(idList([THREAD, THREAD])).toEqual([THREAD]);
    expect(idList([THREAD, 'nope'])).toBeNull();
    expect(idList([])).toBeNull();
    expect(idList(new Array(201).fill(THREAD))).toBeNull();
    expect(idList('x')).toBeNull();
  });

  it('builds search patterns that match addresses and cannot break the filter', () => {
    expect(searchPattern('john.doe@gmail.com')).toBe('%john.doe@gmail.com%');
    expect(searchPattern('xl_specialized')).toBe('%xl_specialized%');
    // Structural characters of the PostgREST or() string become one-char wildcards.
    expect(searchPattern('a,b(c)"d"*e%f\\g')).toBe('%a_b_c__d__e_f_g%');
    expect(searchPattern('   ')).toBeNull();
    expect(searchPattern(',()')).toBeNull();
  });

  it('turns typed text into escaped paragraphs', () => {
    expect(textToHtml('Hi <there>\nline two\n\nBye')).toBe(
      '<p style="margin:0 0 12px;">Hi &lt;there&gt;<br />line two</p>\n<p style="margin:0 0 12px;">Bye</p>',
    );
  });
});

describe('setup card DNS hosts', () => {
  it('maps Resend record names to registrar host fields', () => {
    expect(registeredZone('inbound.axleyard.com')).toBe('axleyard.com');
    expect(registeredZone('axleyard.com')).toBe('axleyard.com');
    expect(zoneHost('axleyard.com', 'axleyard.com')).toBe('@');
    expect(zoneHost('', 'axleyard.com')).toBe('@');
    expect(zoneHost('@', 'axleyard.com')).toBe('@');
    expect(zoneHost('inbound.axleyard.com', 'axleyard.com')).toBe('inbound');
    expect(zoneHost('resend._domainkey', 'axleyard.com')).toBe('resend._domainkey');
    expect(zoneHost('send.inbound.axleyard.com', 'axleyard.com')).toBe('send.inbound');
  });

  it('recognises Resend\'s inbound MX target', () => {
    expect(isResendInboundMx('inbound-smtp.us-east-1.amazonaws.com')).toBe(true);
    expect(isResendInboundMx('inbound-smtp.eu-west-1.amazonaws.com.')).toBe(true);
    expect(isResendInboundMx('aspmx.l.google.com')).toBe(false);
    expect(isResendInboundMx('feedback-smtp.us-east-1.amazonses.com')).toBe(false);
  });
});

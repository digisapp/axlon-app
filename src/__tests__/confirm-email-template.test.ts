import { describe, expect, it } from 'vitest';
import { confirmEmailTemplate } from '@/lib/email/templates';
import { sanitizeUrl } from '@/lib/utils/html-escape';

describe('confirmEmailTemplate', () => {
  const url = 'https://axleyard.com/auth/callback?token=abc123&type=signup';
  const mail = confirmEmailTemplate({ companyName: 'Blyth Trailer Sales', confirmationUrl: url });

  it('carries the confirmation link in the button, the fallback line and the text version', () => {
    expect(mail.subject).toBe('Confirm your AXLON AI account');
    // Button + pasteable fallback: the attribute-escaped URL is the href twice.
    expect(mail.html.match(new RegExp(`href="${sanitizeUrl(url).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'))).toHaveLength(2);
    // What a person reads is the real URL, not the entity-encoded one.
    expect(mail.html).toContain('>https://axleyard.com/auth/callback?token=abc123&amp;type=signup</a>');
    expect(mail.html).not.toContain('&#x2F;&#x2F;axleyard.com</a>');
    expect(mail.text).toContain(`Confirm: ${url}`);
    expect(mail.text).not.toContain('&#x2F;');
  });

  it('names the company without greeting it like a person, and uses the small email mark', () => {
    expect(mail.html).toContain('account for <strong style="color: #0b1220;">Blyth Trailer Sales</strong>');
    expect(mail.html).not.toContain('Hi Blyth');
    expect(mail.html).toContain('/images/email/axlon-mark.png');
    expect(mail.html).not.toContain('axlonai-logo.png');
    expect(mail.text).toContain('Blyth Trailer Sales');
  });

  it('escapes what the signup form sends and refuses an unsafe link', () => {
    const hostile = confirmEmailTemplate({
      companyName: '<script>alert(1)</script> & Sons',
      confirmationUrl: 'javascript:alert(1)',
    });
    expect(hostile.html).not.toContain('<script>');
    expect(hostile.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; Sons');
    expect(hostile.html).not.toContain('javascript:');
    expect(hostile.text).not.toContain('javascript:');
  });

  it('says AXLON, not Axleyard, in the copy', () => {
    // Strip link/image attributes and bare URLs; what is left is the copy.
    const copy = mail.html.replace(/(?:href|src)="[^"]*"/g, '').replace(/https?:\/\/\S+/g, '');
    expect(copy).not.toMatch(/axleyard/i);
    expect(copy).toContain('AXLON');
    expect(mail.text.replace(/https?:\/\/\S+/g, '')).not.toMatch(/axleyard/i);
  });
});

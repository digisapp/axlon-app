/**
 * Admin-inbox addressing helpers. Pure (no DB, no network) so they are unit
 * testable and shared by the Resend webhook, the manual send path and the
 * AI auto-reply.
 *
 * Threading model
 * ---------------
 * Every outbound admin email sets Reply-To to a per-thread plus-address,
 * `<inbox>+<threadId>@<receiving domain>`. Resend delivers mail for ANY local
 * part on a receiving domain, so a reply comes back already tagged with the
 * thread it belongs to. That is exact, independent of whether the recipient's
 * mail client preserves In-Reply-To, and needs no subject matching.
 *
 * Which domain receives
 * ---------------------
 * `ADMIN_EMAIL_ADDRESS` names the mailbox (default support@axleyard.com).
 * Its domain is the one that needs Resend receiving + an MX record. Mail for
 * axleyard.com, axlon.ai or any subdomain of either is treated as ours.
 *
 * Resend webhooks are account-wide: every receiving domain on the account
 * (other projects included) fires `email.received` at every endpoint. The
 * webhook keeps only mail with at least one recipient on our domains.
 */

export const DEFAULT_INBOUND_ADDRESS = 'support@axleyard.com';

/** Domains whose mail belongs to this platform (plus their subdomains). */
export const PRIMARY_DOMAINS = ['axleyard.com', 'axlon.ai'] as const;

/** Who admin replies go out as. Must be on a verified Resend sending domain. */
export const DEFAULT_ADMIN_FROM_ADDRESS = 'support@axleyard.com';
export const ADMIN_FROM_NAME = 'Axleyard Support';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function cleanEnv(name: string): string {
  return (process.env[name] || '').trim().replace(/^['"]|['"]$/g, '');
}

/** Extra receiving domains from `INBOUND_EMAIL_DOMAINS` (comma separated). */
export function ourDomains(): string[] {
  const extra = cleanEnv('INBOUND_EMAIL_DOMAINS')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...PRIMARY_DOMAINS, ...extra]));
}

/** The bare receiving mailbox (env override, defaults to support@axleyard.com). */
export function getInboundAddress(): string {
  const raw = cleanEnv('ADMIN_EMAIL_ADDRESS');
  return isValidEmail(raw) ? raw.toLowerCase() : DEFAULT_INBOUND_ADDRESS;
}

/** Domain part of the inbound address — the domain that must receive in Resend. */
export function getInboundDomain(inboundAddress: string = getInboundAddress()): string {
  return inboundAddress.slice(inboundAddress.lastIndexOf('@') + 1).toLowerCase();
}

/** Bare sender address for admin replies (env `ADMIN_EMAIL_FROM` override). */
export function getAdminFromAddress(): string {
  const { email } = parseEmailAddress(cleanEnv('ADMIN_EMAIL_FROM'));
  return isValidEmail(email) ? email : DEFAULT_ADMIN_FROM_ADDRESS;
}

/** `Axleyard Support <support@axleyard.com>` — the From header on admin replies. */
export function getAdminFrom(): string {
  const { name, email } = parseEmailAddress(cleanEnv('ADMIN_EMAIL_FROM'));
  return `${name || ADMIN_FROM_NAME} <${isValidEmail(email) ? email : DEFAULT_ADMIN_FROM_ADDRESS}>`;
}

/** Display name half of the admin From header. */
export function getAdminFromName(): string {
  const { name } = parseEmailAddress(cleanEnv('ADMIN_EMAIL_FROM'));
  return name || ADMIN_FROM_NAME;
}

export function isValidEmail(value: string | null | undefined): value is string {
  return !!value && value.length <= 254 && EMAIL_RE.test(value);
}

/** `support@x` + thread `t` → `support+t@x`. Falls back to the bare address for a non-UUID. */
export function threadReplyAddress(threadId: string, inboundAddress: string = getInboundAddress()): string {
  const at = inboundAddress.lastIndexOf('@');
  if (at < 0 || !UUID_RE.test(threadId)) return inboundAddress;
  return `${inboundAddress.slice(0, at)}+${threadId.toLowerCase()}@${inboundAddress.slice(at + 1)}`;
}

/** Bare address (+ display name) from `"Name" <a@b>`, `Name <a@b>`, `<a@b>` or `a@b`. */
export function parseEmailAddress(raw: string | null | undefined): { name: string | null; email: string } {
  const s = decodeEncodedWords((raw || '').trim());
  const m = s.match(/^"?([^"<]*?)"?\s*<([^<>\s]+@[^<>\s]+)>$/);
  if (m) return { name: m[1].trim() || null, email: m[2].trim().toLowerCase() };
  return { name: null, email: s.replace(/^<|>$/g, '').trim().toLowerCase() };
}

/**
 * RFC 2047 encoded words (`=?UTF-8?B?...?=`), how non-ASCII names like
 * "José" arrive in raw headers. Adjacent encoded words join without the
 * whitespace between them. Anything undecodable is left as-is.
 */
export function decodeEncodedWords(value: string): string {
  if (!value.includes('=?')) return value;
  return value
    .replace(/\?=\s+=\?/g, '?==?')
    .replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, (whole, charset: string, enc: string, text: string) => {
      try {
        const bytes = enc.toUpperCase() === 'B'
          ? Buffer.from(text, 'base64')
          : Buffer.from(
              text.replace(/_/g, ' ').replace(/=([0-9A-Fa-f]{2})/g, (_m, hex: string) => String.fromCharCode(parseInt(hex, 16))),
              'latin1',
            );
        return new TextDecoder(charset).decode(bytes);
      } catch {
        return whole;
      }
    });
}

/**
 * Display name of an inbound sender. On a fetched Resend email `from` is the
 * bare address; the name only survives in the raw From header. Null when
 * there is none (callers fall back to the address).
 */
export function senderDisplayName(fromHeader: unknown, fallbackFrom?: string | null): string | null {
  const candidates = [typeof fromHeader === 'string' ? fromHeader : '', fallbackFrom || ''];
  for (const raw of candidates) {
    const { name } = parseEmailAddress(raw);
    const clean = (name || '').replace(/["<>\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (clean) return clean;
  }
  return null;
}

/** Our receiving domains: the inbound address's domain plus every primary domain and subdomains. */
export function isOurInboundAddress(raw: string | null | undefined, inboundAddress: string = getInboundAddress()): boolean {
  const { email } = parseEmailAddress(raw);
  const at = email.lastIndexOf('@');
  if (at < 0) return false;
  const host = email.slice(at + 1);
  if (host === getInboundDomain(inboundAddress)) return true;
  return ourDomains().some((domain) => host === domain || host.endsWith(`.${domain}`));
}

/** Sent from one of our domains (used to decide whether a bounce is about our mail). */
export function isOurSender(raw: string | null | undefined): boolean {
  return isOurInboundAddress(raw);
}

/**
 * The first recipient that is ours, or null when the mail was for another
 * project's domain on the same Resend account. Checks Resend's
 * `received_for` (envelope recipients — catches BCC) plus To/Cc/Bcc.
 */
export function findOurRecipient(
  addresses: Array<string | null | undefined>,
  inboundAddress: string = getInboundAddress(),
): string | null {
  for (const raw of addresses) {
    if (isOurInboundAddress(raw, inboundAddress)) return parseEmailAddress(raw).email;
  }
  return null;
}

/**
 * Find our thread tag in any recipient address of an inbound mail (To, Cc,
 * and Resend's `received_for` for forwarded mail). Returns null when no
 * address is `<ourLocal>+<uuid>@<ourDomain>`.
 */
export function parseThreadIdFromAddresses(
  addresses: Array<string | null | undefined>,
  inboundAddress: string = getInboundAddress(),
): string | null {
  const at = inboundAddress.lastIndexOf('@');
  if (at < 0) return null;
  const ourLocal = inboundAddress.slice(0, at).toLowerCase();
  const ourDomain = inboundAddress.slice(at + 1).toLowerCase();

  for (const raw of addresses) {
    const { email } = parseEmailAddress(raw);
    const i = email.lastIndexOf('@');
    if (i < 0 || email.slice(i + 1) !== ourDomain) continue;
    const local = email.slice(0, i);
    const plus = local.indexOf('+');
    if (plus < 0 || local.slice(0, plus) !== ourLocal) continue;
    const tag = local.slice(plus + 1);
    if (UUID_RE.test(tag)) return tag.toLowerCase();
  }
  return null;
}

/** Strip Re:/Fwd: prefixes for subject-based thread matching. */
export function normalizeSubject(subject: string | null | undefined): string {
  return (subject || '').replace(/^(\s*(re|fwd?|aw|wg)\s*:\s*)+/i, '').trim();
}

/** `Re: Subject` unless it already is one. */
export function replySubject(subject: string): string {
  const s = subject.trim();
  return /^re:/i.test(s) ? s : `Re: ${s}`;
}

/** Angle brackets and whitespace off a Message-ID header value. */
export function cleanMessageId(value: unknown): string {
  return typeof value === 'string' ? value.replace(/[<>\s]/g, '') : '';
}

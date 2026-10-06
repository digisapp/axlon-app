/**
 * What the inbox compose window and the send API share: outgoing attachments
 * (spec sheets, photos, PDFs), the reply greeting and the sign-off. Pure and
 * client-safe, so the browser and the server apply the same rules.
 */

/** A file as the browser sends it: base64, no data: prefix. */
export interface OutgoingAttachment {
  filename: string;
  contentType: string;
  content: string;
}

/** The host caps a request at 4.5 MB and base64 adds a third: 3 MB of files. */
export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;

const ATTACHMENT_TYPES = /^(application\/pdf|image\/(png|jpe?g|gif|webp|heic|heif)|text\/(plain|csv)|application\/(msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)|vnd\.ms-excel))$/i;

/** What the file picker offers. */
export const ATTACHMENT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.txt,.csv,.doc,.docx,.xls,.xlsx,.pptx';

export function isAllowedAttachmentType(contentType: string): boolean {
  return ATTACHMENT_TYPES.test(contentType.trim());
}

/** Decoded size of a base64 string. */
export function base64Bytes(content: string): number {
  const padding = content.endsWith('==') ? 2 : content.endsWith('=') ? 1 : 0;
  return Math.floor((content.length * 3) / 4) - padding;
}

/** A filename safe for a MIME header: no path, quotes or line breaks. */
export function cleanFilename(name: string): string {
  // Line breaks and quotes first: `.` does not cross a newline, so a path
  // after one would otherwise survive the path strip.
  return name.replace(/[\r\n"]+/g, '_').replace(/^.*[\\/]/, '').replace(/[\\/]+/g, '_').trim().slice(0, 120);
}

/** Validates outgoing attachments: the cleaned list, or the reason they can't be sent. */
export function checkOutgoingAttachments(raw: unknown): { ok: true; files: OutgoingAttachment[] } | { ok: false; error: string } {
  if (raw == null) return { ok: true, files: [] };
  if (!Array.isArray(raw)) return { ok: false, error: 'Attachments must be a list' };
  if (raw.length > MAX_ATTACHMENTS) return { ok: false, error: `Attach at most ${MAX_ATTACHMENTS} files` };
  const files: OutgoingAttachment[] = [];
  let total = 0;
  for (const item of raw) {
    const f = (item ?? {}) as Partial<OutgoingAttachment>;
    const filename = typeof f.filename === 'string' ? cleanFilename(f.filename) : '';
    const contentType = typeof f.contentType === 'string' ? f.contentType.trim().toLowerCase() : '';
    const content = typeof f.content === 'string' ? f.content.replace(/^data:[^,]*,/, '').replace(/\s+/g, '') : '';
    if (!filename || !content) return { ok: false, error: 'An attachment is missing its name or content' };
    if (!isAllowedAttachmentType(contentType)) return { ok: false, error: `${filename}: only PDFs, images, text and Office files can be attached` };
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(content)) return { ok: false, error: `${filename}: could not read the file` };
    total += base64Bytes(content);
    files.push({ filename, contentType, content });
  }
  if (total > MAX_ATTACHMENT_BYTES) return { ok: false, error: 'Attachments are over 3 MB in total' };
  return { ok: true, files };
}

/** "jillian hughson" → "Jillian"; null for an empty name or an address typed as a name. */
export function firstNameOf(name: string | null | undefined): string | null {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || parts[0].includes('@')) return null;
  // Names come from strangers (a form, a From header) and end up as the first
  // line of an email we send. Only something that looks like a name is used:
  // "evil.com/claim" would otherwise be linkified by the recipient's client.
  const NAME = /^\p{L}[\p{L}\p{M}'’-]{0,39}$/u;
  if (!NAME.test(parts[0])) return null;
  if ((parts[1] === '&' || parts[1]?.toLowerCase() === 'and') && parts[2] && !NAME.test(parts[2])) parts.splice(1);
  // Only all-lowercase or ALL-CAPS words are recapitalised: "DeShawn" and "TJ" stay.
  const cap = (w: string) => {
    if (w === w.toLowerCase()) return w.charAt(0).toUpperCase() + w.slice(1);
    if (w === w.toUpperCase() && w.length > 2) return w.charAt(0) + w.slice(1).toLowerCase();
    return w;
  };
  if ((parts[1] === '&' || parts[1]?.toLowerCase() === 'and') && parts[2]) return `${cap(parts[0])} ${parts[1]} ${cap(parts[2])}`;
  return cap(parts[0]);
}

/** How every reply from the inbox signs off (the AI drafts use it too). */
export const INBOX_SIGNOFF = 'Best,\nThe Axleyard Team';

/** The text a new reply starts with; the caret goes on the blank line. */
export function replyScaffold(name: string | null | undefined): { text: string; caret: number } {
  const first = firstNameOf(name);
  const greeting = first ? `Hi ${first},` : 'Hi there,';
  const head = `${greeting}\n\n`;
  return { text: `${head}\n\n${INBOX_SIGNOFF}`, caret: head.length };
}

/** Lead statuses, same list as /admin/leads. */
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v);
}

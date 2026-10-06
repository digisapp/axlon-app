import type { InboxStatus } from '@/lib/email/inbox-status';
import type {
  BulkAction, EmailAttachmentMeta, EmailRow, InboxFolder, ThreadListItem, ThreadRow,
} from '@/lib/email/admin-inbox';
import { TONE } from '@/components/admin/tones';

import type { LeadContext } from '@/lib/email/lead-inbox';
import type { LeadStatus } from '@/lib/email/compose';

export type { InboxStatus, BulkAction, InboxFolder, EmailAttachmentMeta, LeadContext, LeadStatus };
export { LEAD_STATUSES } from '@/lib/email/compose';

/** Lead status chips, same colours as /admin/leads. */
export const LEAD_STATUS_TONES: Record<string, string> = {
  new: TONE.blue,
  contacted: TONE.yellow,
  qualified: TONE.green,
  negotiating: TONE.purple,
  won: TONE.emerald,
  lost: TONE.gray,
};
export type Thread = ThreadRow;
export type ThreadListRow = ThreadListItem;
export type Email = EmailRow;

export interface FolderCounts {
  unread: number;
  starred: number;
  spam: number;
}

export const FOLDERS: ReadonlyArray<{ value: InboxFolder; label: string }> = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'sent', label: 'Sent' },
  { value: 'spam', label: 'Spam' },
];

/** Category chips: label + tone (light/dark pairs from tones.ts). */
export const AI_CATEGORY_LABELS: Record<string, { label: string; tone: string }> = {
  purchase_inquiry: { label: 'Buying', tone: TONE.green },
  selling_inquiry: { label: 'Selling', tone: TONE.blue },
  financing_question: { label: 'Financing', tone: TONE.purple },
  trade_in_request: { label: 'Trade-in', tone: TONE.orange },
  transport_quote: { label: 'Transport', tone: TONE.teal },
  parts_inquiry: { label: 'Parts', tone: TONE.indigo },
  appraisal_request: { label: 'Appraisal', tone: TONE.amber },
  dealer_onboarding: { label: 'Dealer', tone: TONE.emerald },
  general_inquiry: { label: 'General', tone: TONE.gray },
  support: { label: 'Support', tone: TONE.yellow },
  partnership: { label: 'Partnership', tone: TONE.blue },
  feedback: { label: 'Feedback', tone: TONE.gray },
  personal: { label: 'Personal', tone: TONE.gray },
  legal_compliance: { label: 'Legal', tone: TONE.red },
  spam: { label: 'Spam', tone: TONE.red },
  auto_reply: { label: 'Auto-reply', tone: TONE.yellow },
  other: { label: 'Other', tone: TONE.gray },
};

export const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
  queued: { label: 'Queued', tone: TONE.gray },
  sent: { label: 'Sent', tone: TONE.gray },
  delivered: { label: 'Delivered', tone: TONE.green },
  opened: { label: 'Opened', tone: TONE.green },
  clicked: { label: 'Clicked', tone: TONE.green },
  bounced: { label: 'Bounced', tone: TONE.red },
  complained: { label: 'Complaint', tone: TONE.red },
  failed: { label: 'Failed', tone: TONE.red },
  received: { label: 'New', tone: TONE.blue },
  replied: { label: 'Replied', tone: TONE.green },
};

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatListDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  });
}

export function formatFullDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

/** Who the conversation is with: name if we have one, else the address. */
export function counterpart(t: Pick<Thread, 'participant_email' | 'participant_name'>) {
  return { name: t.participant_name || t.participant_email, address: t.participant_email };
}

/** The newest inbound email in a conversation, if any. */
export function latestInbound(emails: Email[]): Email | null {
  for (let i = emails.length - 1; i >= 0; i--) {
    if (emails[i].direction === 'inbound') return emails[i];
  }
  return null;
}

/** Plain-text form of an email body for quoting under a reply. */
export function quoteText(email: Email): string {
  // A lead alert is our summary of a web form: quote only what they wrote.
  const alert = email.metadata?.kind === 'lead_alert';
  const own = alert ? ((email.metadata as { message?: string | null } | null)?.message ?? '') : null;
  const text = alert
    ? own || ''
    : email.text_body || email.html_body?.replace(/<!--[\s\S]*?-->/g, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  if (!text) return '';
  const who = email.from_name || email.from_email;
  return `--- On ${formatFullDate(email.created_at)}, ${who} wrote: ---\n${text.slice(0, 4000)}`;
}

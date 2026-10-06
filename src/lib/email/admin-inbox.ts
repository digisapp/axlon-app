/**
 * Admin inbox service — the one place that reads and writes `email_threads`
 * and `emails` for /admin/email, the Resend webhook and the AI auto-reply.
 *
 * Runs with the service role: callers (API routes behind withAdmin, the
 * signed webhook) have already authenticated. The tables are also RLS'd to
 * admins for anything that goes through a session client.
 *
 * Threading: every message we send carries Reply-To
 * `support+<threadId>@<receiving domain>` (see inbound-address.ts) so the
 * answer comes back tagged with its thread; In-Reply-To on our stored
 * Message-IDs and a normalized subject + sender match are the fallbacks.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { sendEmail } from './resend';
import { buildPlainEmail } from './plain-shell';
import type { OutgoingAttachment } from './compose';
import { findPlatformLeadIdByEmail, markLeadContacted } from './lead-link';
import {
  cleanMessageId,
  getAdminFrom,
  getAdminFromAddress,
  getAdminFromName,
  isValidEmail,
  normalizeSubject,
  replySubject,
  threadReplyAddress,
} from './inbound-address';

// ─── Types ──────────────────────────────────────────────

export type EmailDirection = 'inbound' | 'outbound';
export type ThreadStatus = 'open' | 'received' | 'read' | 'replied' | 'archived' | 'trash';
export type EmailStatus =
  | 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed' | 'received' | 'replied';

export interface EmailAttachmentMeta {
  id: string;
  filename: string;
  contentType: string;
  size?: number;
  /** Set on inline images: the `cid:` the HTML body refers to. */
  contentId?: string;
  /** A file we sent (outbound). Resend keeps no copy we can serve back. */
  sent?: boolean;
}

export interface EmailMetadata {
  /** A "new lead" alert written into the inbox by recordLeadInInbox(). */
  kind?: 'lead_alert';
  /** The lead a lead alert announces. */
  lead_id?: string;
  /** Where that lead came from (leads.source). */
  source?: string | null;
  /** Set on the "Send me a test" row so the UI can label it. */
  test?: boolean;
  /** Set on AI auto-replies. */
  auto_sent?: boolean;
  cc?: string[];
}

export interface ThreadRow {
  id: string;
  subject: string;
  owner_id: string;
  last_message_at: string;
  message_count: number;
  outbound_count: number;
  is_unread: boolean;
  status: ThreadStatus;
  participant_email: string;
  participant_name: string | null;
  listing_id: string | null;
  lead_id: string | null;
  is_starred: boolean;
  is_spam: boolean;
  last_preview: string | null;
  last_direction: EmailDirection | null;
  linked_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailRow {
  id: string;
  thread_id: string;
  resend_id: string | null;
  message_id: string | null;
  direction: EmailDirection;
  from_email: string;
  from_name: string | null;
  to_email: string;
  to_name: string | null;
  reply_to: string | null;
  subject: string;
  html_body: string | null;
  text_body: string | null;
  status: EmailStatus;
  headers: Record<string, unknown> | null;
  metadata: EmailMetadata | null;
  attachments: EmailAttachmentMeta[] | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  ai_category: string | null;
  ai_confidence: number | null;
  ai_summary: string | null;
  ai_draft_html: string | null;
  ai_draft_text: string | null;
  ai_processed_at: string | null;
  replied_at: string | null;
}

/** Thread row plus the bits of its newest inbound email the list shows. */
export interface ThreadListItem extends ThreadRow {
  ai_category: string | null;
  ai_confidence: number | null;
  has_attachments: boolean;
  is_test: boolean;
  /** The conversation started as a "new lead" alert. */
  is_lead_alert: boolean;
  /** Status of the linked lead, when there is one. */
  lead_status: string | null;
}

// ─── Folders / actions / settings (whitelists) ──────────

export const INBOX_FOLDERS = ['inbox', 'unread', 'starred', 'sent', 'spam'] as const;
export type InboxFolder = (typeof INBOX_FOLDERS)[number];

export function isInboxFolder(v: unknown): v is InboxFolder {
  return typeof v === 'string' && (INBOX_FOLDERS as readonly string[]).includes(v);
}

export const BULK_ACTIONS = ['markRead', 'markUnread', 'star', 'unstar', 'spam', 'notSpam', 'delete'] as const;
export type BulkAction = (typeof BULK_ACTIONS)[number];

export function isBulkAction(v: unknown): v is BulkAction {
  return typeof v === 'string' && (BULK_ACTIONS as readonly string[]).includes(v);
}

/** Only keys the inbox UI may read or write through /api/admin/inbox/settings. */
export const INBOX_SETTING_KEYS = ['ai_auto_reply_enabled'] as const;
export type InboxSettingKey = (typeof INBOX_SETTING_KEYS)[number];

export function isInboxSettingKey(v: unknown): v is InboxSettingKey {
  return typeof v === 'string' && (INBOX_SETTING_KEYS as readonly string[]).includes(v);
}

/** Statuses a thread has once it contains at least one inbound message. */
const INBOUND_STATUSES: ThreadStatus[] = ['received', 'read', 'replied'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v);
}

/** Up to 200 UUIDs, or null when anything in the list is not one. */
export function idList(v: unknown): string[] | null {
  if (!Array.isArray(v) || v.length === 0 || v.length > 200) return null;
  const ids = v.filter(isUuid);
  return ids.length === v.length ? Array.from(new Set(ids)) : null;
}

// ─── Helpers ────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Plain text typed in the compose box → paragraphs for the branded template. */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 12px;">${escapeHtml(para).replace(/\n/g, '<br />')}</p>`)
    .join('\n');
}

/** Readable plain text out of an HTML email body (for previews, quotes, AI drafts). */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return '';
  return html
    // HTML comments are never message text: Outlook's <!--[if mso]> blocks
    // otherwise leak values like a PixelsPerInch "96" into previews.
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(style|script|head|title)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const QUOTE_MAX_CHARS = 3000;

/**
 * The message being answered, quoted under a reply. Always rebuilt from plain
 * text and escaped: the original HTML is whatever a stranger sent us, and
 * embedding it raw would put their markup inside a mail from our domain.
 */
export function buildQuote(original: {
  from_email: string;
  from_name: string | null;
  created_at: string;
  text_body: string | null;
  html_body: string | null;
} | null | undefined): { html: string; text: string } | null {
  if (!original) return null;
  const body = (original.text_body?.trim() || htmlToText(original.html_body)).slice(0, QUOTE_MAX_CHARS);
  if (!body) return null;
  const when = new Date(original.created_at);
  const date = Number.isNaN(when.getTime())
    ? ''
    : when.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' });
  const who = original.from_name ? `${original.from_name} <${original.from_email}>` : original.from_email;
  const intro = date ? `On ${date} ET, ${who} wrote:` : `${who} wrote:`;
  return {
    html: `<p style="margin:0 0 8px;">${escapeHtml(intro)}</p><div style="white-space:pre-wrap;">${escapeHtml(body)}</div>`,
    text: `${intro}\n${body.split('\n').map((line) => `> ${line}`).join('\n')}`,
  };
}

/**
 * Delivery events arrive out of order. A status only moves forward along
 * sent → delivered → opened → clicked; failures always win.
 */
const PRIOR_STATUSES: Partial<Record<EmailStatus, EmailStatus[]>> = {
  delivered: ['queued', 'sent'],
  opened: ['queued', 'sent', 'delivered'],
  clicked: ['queued', 'sent', 'delivered', 'opened'],
};

export function canAdvanceStatus(current: EmailStatus, next: EmailStatus): boolean {
  const prior = PRIOR_STATUSES[next];
  return prior ? prior.includes(current) : true;
}

/**
 * A user-typed search term as an `ilike` pattern for a PostgREST `or(...)`
 * filter. Commas, parentheses and quotes structure that filter string and
 * `%`, `*`, `\` are wildcards/escapes, so each becomes `_` (any one
 * character). Dots and underscores stay, so an address or a domain matches.
 */
export function searchPattern(q: string): string | null {
  const cleaned = q.replace(/[%\\,()*"]/g, '_').replace(/\s+/g, ' ').trim();
  return cleaned.replace(/_/g, '').trim() ? `%${cleaned}%` : null;
}

/** Postgres text cannot hold NUL; a single one would fail the insert on every webhook retry. */
function stripNul<T extends string | null | undefined>(value: T): T {
  return (typeof value === 'string' ? value.replace(/\u0000/g, '') : value) as T;
}

// The Supabase builder's generics get too deep for tsc when a filter chain is
// built behind a generic helper, so the chain is applied on a loosely typed
// handle and the caller's type is handed back unchanged.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LooseQuery = any;

function applyFolder<Q>(query: Q, folder: InboxFolder): Q {
  const q = query as LooseQuery;
  switch (folder) {
    case 'inbox':
      return q.eq('is_spam', false).in('status', INBOUND_STATUSES);
    case 'unread':
      return q.eq('is_spam', false).in('status', INBOUND_STATUSES).eq('is_unread', true);
    case 'starred':
      return q.eq('is_spam', false).eq('is_starred', true);
    case 'sent':
      return q.eq('is_spam', false).gt('outbound_count', 0);
    case 'spam':
      return q.eq('is_spam', true);
  }
}

function db(): SupabaseClient {
  return createAdminClient();
}

// ─── Service ────────────────────────────────────────────

export const AdminInboxService = {
  /**
   * A shared inbox still needs an owner_id on each thread (NOT NULL since
   * 050): the longest-standing admin.
   */
  async inboxOwnerId(): Promise<string | null> {
    const { data } = await db()
      .from('profiles')
      .select('id')
      .eq('is_admin', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data?.id as string | undefined) ?? null;
  },

  async listThreads({
    folder = 'inbox',
    search,
    page = 1,
    limit = 25,
  }: {
    folder?: InboxFolder;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = db();
    let query = supabase.from('email_threads').select('*', { count: 'exact' });
    query = applyFolder(query, folder);

    const pattern = search ? searchPattern(search) : null;
    if (pattern) {
      query = query.or(
        `subject.ilike.${pattern},participant_email.ilike.${pattern},participant_name.ilike.${pattern},last_preview.ilike.${pattern}`,
      );
    }

    const from = (page - 1) * limit;
    const { data, error, count } = await query
      .order('last_message_at', { ascending: false })
      .range(from, from + limit - 1);
    if (error) throw error;

    const rows = (data ?? []) as ThreadRow[];
    const total = count ?? 0;

    // The newest inbound email per thread carries the AI category and any
    // attachments, and the first one says whether it began as a lead alert;
    // two extra queries for the page, not one per row.
    type Extras = Pick<ThreadListItem, 'ai_category' | 'ai_confidence' | 'has_attachments' | 'is_test' | 'is_lead_alert' | 'lead_status'>;
    const blank = (): Extras => ({ ai_category: null, ai_confidence: null, has_attachments: false, is_test: false, is_lead_alert: false, lead_status: null });
    const extras = new Map<string, Extras>();
    if (rows.length > 0) {
      const leadIds = Array.from(new Set(rows.map((r) => r.lead_id).filter((id): id is string => !!id)));
      const [{ data: emails }, { data: leads }] = await Promise.all([
        supabase
          .from('emails')
          .select('thread_id, direction, ai_category, ai_confidence, attachments, metadata, created_at')
          .in('thread_id', rows.map((r) => r.id))
          .order('created_at', { ascending: false }),
        leadIds.length > 0
          ? supabase.from('leads').select('id, status').in('id', leadIds)
          : Promise.resolve({ data: [] as Array<{ id: string; status: string }> }),
      ]);
      const leadStatus = new Map((leads ?? []).map((l) => [l.id as string, l.status as string]));
      for (const e of (emails ?? []) as Array<Pick<EmailRow, 'thread_id' | 'direction' | 'ai_category' | 'ai_confidence' | 'attachments' | 'metadata'>>) {
        const cur = extras.get(e.thread_id) ?? blank();
        if (e.direction === 'inbound' && cur.ai_category === null && e.ai_category) {
          cur.ai_category = e.ai_category;
          cur.ai_confidence = e.ai_confidence;
        }
        if (Array.isArray(e.attachments) && e.attachments.some((a) => !a.sent)) cur.has_attachments = true;
        if (e.metadata?.test) cur.is_test = true;
        if (e.metadata?.kind === 'lead_alert') cur.is_lead_alert = true;
        extras.set(e.thread_id, cur);
      }
      for (const r of rows) {
        if (!r.lead_id) continue;
        const cur = extras.get(r.id) ?? blank();
        cur.lead_status = leadStatus.get(r.lead_id) ?? null;
        extras.set(r.id, cur);
      }
    }

    const threads: ThreadListItem[] = rows.map((r) => ({ ...r, ...(extras.get(r.id) ?? blank()) }));

    return { threads, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  },

  /** Badge numbers for the folder pills. */
  async getFolderCounts() {
    const supabase = db();
    const [unread, starred, spam] = await Promise.all([
      applyFolder(supabase.from('email_threads').select('id', { count: 'exact', head: true }), 'unread'),
      applyFolder(supabase.from('email_threads').select('id', { count: 'exact', head: true }), 'starred'),
      applyFolder(supabase.from('email_threads').select('id', { count: 'exact', head: true }), 'spam'),
    ]);
    return { unread: unread.count ?? 0, starred: starred.count ?? 0, spam: spam.count ?? 0 };
  },

  async getUnreadCount() {
    const { count } = await applyFolder(
      db().from('email_threads').select('id', { count: 'exact', head: true }),
      'unread',
    );
    return count ?? 0;
  },

  async getThread(threadId: string): Promise<{ thread: ThreadRow; emails: EmailRow[] } | null> {
    const supabase = db();
    const { data: thread } = await supabase.from('email_threads').select('*').eq('id', threadId).maybeSingle();
    if (!thread) return null;
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { thread: thread as ThreadRow, emails: (emails ?? []) as EmailRow[] };
  },

  async getEmail(emailId: string): Promise<EmailRow | null> {
    const { data } = await db().from('emails').select('*').eq('id', emailId).maybeSingle();
    return (data as EmailRow | null) ?? null;
  },

  async markRead(threadId: string, isRead: boolean) {
    await this.bulk(isRead ? 'markRead' : 'markUnread', [threadId]);
  },

  async setStar(threadId: string, isStarred: boolean) {
    await this.bulk(isStarred ? 'star' : 'unstar', [threadId]);
  },

  async setSpam(threadId: string, isSpam: boolean) {
    await this.bulk(isSpam ? 'spam' : 'notSpam', [threadId]);
  },

  async deleteThread(threadId: string) {
    await this.bulk('delete', [threadId]);
  },

  async bulk(action: BulkAction, ids: string[]) {
    if (ids.length === 0) return;
    const supabase = db();
    const now = new Date().toISOString();

    switch (action) {
      case 'markRead': {
        const { error } = await supabase.from('email_threads').update({ is_unread: false, updated_at: now }).in('id', ids);
        if (error) throw error;
        // 'read' only replaces the initial 'received'; never clobber 'replied'.
        await supabase.from('email_threads').update({ status: 'read' }).in('id', ids).eq('status', 'received');
        await supabase.from('emails').update({ is_read: true, read_at: now }).in('thread_id', ids).eq('is_read', false);
        return;
      }
      case 'markUnread': {
        // Only threads that have inbound mail can be unread.
        const { error } = await supabase
          .from('email_threads')
          .update({ is_unread: true, updated_at: now })
          .in('id', ids)
          .in('status', INBOUND_STATUSES);
        if (error) throw error;
        await supabase.from('email_threads').update({ status: 'received' }).in('id', ids).eq('status', 'read');
        return;
      }
      case 'star': {
        const { error } = await supabase.from('email_threads').update({ is_starred: true, updated_at: now }).in('id', ids);
        if (error) throw error;
        return;
      }
      case 'unstar': {
        const { error } = await supabase.from('email_threads').update({ is_starred: false, updated_at: now }).in('id', ids);
        if (error) throw error;
        return;
      }
      case 'spam': {
        const { error } = await supabase.from('email_threads').update({ is_spam: true, is_unread: false, updated_at: now }).in('id', ids);
        if (error) throw error;
        return;
      }
      case 'notSpam': {
        const { error } = await supabase.from('email_threads').update({ is_spam: false, updated_at: now }).in('id', ids);
        if (error) throw error;
        return;
      }
      case 'delete': {
        // emails cascade from email_threads (050).
        const { error } = await supabase.from('email_threads').delete().in('id', ids);
        if (error) throw error;
        return;
      }
    }
  },

  /**
   * Compose a new email or reply inside a thread. Goes out as the admin From
   * with the per-thread Reply-To, in the plain shell with the message being
   * answered quoted underneath. The stored row keeps only what the admin
   * wrote, so the thread view reads like a conversation. A conversation with
   * a lead marks that lead contacted.
   */
  async sendNewEmail({
    to,
    toName,
    subject,
    bodyText,
    replyToThreadId,
    userId,
    test = false,
    autoSent = false,
    idempotencyKey,
    ai,
    attachments = [],
  }: {
    to?: string;
    toName?: string | null;
    subject?: string;
    bodyText: string;
    replyToThreadId?: string | null;
    /** Admin sending; owns a newly created thread. Not needed for a reply. */
    userId?: string;
    test?: boolean;
    /** Sent by the AI auto-reply rather than a person. */
    autoSent?: boolean;
    /** Defaults to a fresh key per call; pass one where a retry must not send twice. */
    idempotencyKey?: string;
    /** AI fields recorded on the outbound row of an auto-reply. */
    ai?: { category: string; confidence: number; summary: string };
    /** Already validated with checkOutgoingAttachments(). */
    attachments?: OutgoingAttachment[];
  }): Promise<
    | { success: true; emailId: string | null; threadId: string; resendId: string | null }
    | { success: false; error: string; status: 400 | 404 | 502 }
  > {
    const supabase = db();
    const text = bodyText.trim();
    if (!text) return { success: false, error: 'Message is required', status: 400 };
    if (text.length > 50_000) return { success: false, error: 'Message is too long', status: 400 };

    let thread: ThreadRow | null = null;
    let createdThread = false;
    const headers: Record<string, string> = {};
    let quote: { html: string; text: string } | null = null;

    if (replyToThreadId) {
      const { data } = await supabase.from('email_threads').select('*').eq('id', replyToThreadId).maybeSingle();
      if (!data) return { success: false, error: 'Conversation not found', status: 404 };
      thread = data as ThreadRow;

      // Threading headers need the RFC Message-ID the sender's client
      // assigned (stored on inbound rows). Carry References forward so long
      // threads keep grouping in their client.
      const { data: lastInbound } = await supabase
        .from('emails')
        .select('message_id, headers, html_body, text_body, from_email, from_name, created_at, metadata')
        .eq('thread_id', thread.id)
        .eq('direction', 'inbound')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const messageId = cleanMessageId(lastInbound?.message_id);
      if (messageId) {
        const prior = String((lastInbound?.headers as Record<string, unknown> | null)?.references || '')
          .split(/\s+/)
          .map(cleanMessageId)
          .filter((id) => id && id !== messageId)
          .slice(-20);
        headers['In-Reply-To'] = `<${messageId}>`;
        headers['References'] = [...prior, messageId].map((id) => `<${id}>`).join(' ');
      }
      // A lead alert is our own summary of a web form; quote only what the
      // person wrote on it, never the details block around it.
      const alert = (lastInbound?.metadata as EmailMetadata & { message?: string | null } | null) ?? null;
      quote = alert?.kind === 'lead_alert'
        ? buildQuote(lastInbound ? { ...lastInbound, text_body: alert.message || null, html_body: null } : null)
        : buildQuote(lastInbound);
    }

    const recipient = (thread ? thread.participant_email : to || '').trim().toLowerCase();
    if (!isValidEmail(recipient)) return { success: false, error: 'Enter a valid email address', status: 400 };

    const cleanSubject = (thread ? (subject?.trim() || replySubject(thread.subject)) : subject || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 300);
    if (!cleanSubject) return { success: false, error: 'Subject is required', status: 400 };

    if (!thread) {
      if (!userId) return { success: false, error: 'Could not start the conversation', status: 400 };
      const leadId = test ? null : await findPlatformLeadIdByEmail(recipient).catch(() => null);
      const { data: created, error } = await supabase
        .from('email_threads')
        .insert({
          subject: normalizeSubject(cleanSubject) || cleanSubject,
          owner_id: userId,
          participant_email: recipient,
          participant_name: toName?.replace(/[\r\n<>"]+/g, ' ').trim().slice(0, 120) || null,
          status: 'open',
          is_unread: false,
          lead_id: leadId,
        })
        .select('*')
        .single();
      if (error || !created) {
        logger.error('Inbox: failed to create thread', { error });
        return { success: false, error: 'Could not start the conversation', status: 502 };
      }
      thread = created as ThreadRow;
      createdThread = true;
    }

    const innerHtml = textToHtml(text);
    const html = buildPlainEmail(innerHtml, quote?.html);
    const replyTo = threadReplyAddress(thread.id);

    let resendId: string | null = null;
    try {
      const result = await sendEmail({
        to: recipient,
        subject: cleanSubject,
        html,
        text: quote ? `${text}\n\n${quote.text}` : text,
        from: getAdminFrom(),
        replyTo,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        category: 'conversation',
        idempotencyKey: idempotencyKey || `admin-inbox/${thread.id}/${crypto.randomUUID()}`,
        attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
      });
      resendId = result?.id ?? null;
    } catch (err) {
      logger.error('Inbox: send failed', { error: err, threadId: thread.id });
      if (createdThread) await supabase.from('email_threads').delete().eq('id', thread.id);
      const message = err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' ? err.message : 'Failed to send email';
      return { success: false, error: message, status: 502 };
    }

    const metadata: EmailMetadata = {};
    if (test) metadata.test = true;
    if (autoSent) metadata.auto_sent = true;

    const { data: stored, error: storeError } = await supabase
      .from('emails')
      .insert({
        thread_id: thread.id,
        resend_id: resendId,
        direction: 'outbound',
        from_email: getAdminFromAddress(),
        from_name: getAdminFromName(),
        to_email: recipient,
        to_name: thread.participant_name,
        reply_to: replyTo,
        subject: cleanSubject,
        html_body: innerHtml,
        text_body: text,
        status: 'sent',
        is_read: true,
        headers,
        metadata,
        attachments: attachments.map((a, i) => ({
          id: `sent-${i + 1}`,
          filename: a.filename,
          contentType: a.contentType,
          size: Math.floor((a.content.length * 3) / 4),
          sent: true,
        })),
        ...(ai
          ? {
              ai_category: 'auto_reply',
              ai_confidence: ai.confidence,
              ai_summary: `Auto-reply (${ai.category}): ${ai.summary}`.slice(0, 500),
              ai_processed_at: new Date().toISOString(),
            }
          : {}),
      })
      .select('id')
      .single();
    if (storeError) logger.error('Inbox: sent but failed to store outbound row', { error: storeError, threadId: thread.id });

    if (replyToThreadId) {
      const now = new Date().toISOString();
      // The mail is already out, so a failure here is logged rather than
      // returned — but it must be logged: a constraint that rejected
      // 'replied' once went unnoticed because nothing read this error.
      const { error: repliedError } = await supabase
        .from('emails')
        .update({ status: 'replied', replied_at: now })
        .eq('thread_id', thread.id)
        .eq('direction', 'inbound')
        .neq('status', 'replied');
      if (repliedError) logger.error('Inbox: sent, but could not mark the inbound mail replied', { error: repliedError, threadId: thread.id });
      // A person answering has read the thread; an auto-reply has not read it for them.
      if (!autoSent) {
        const { error: readError } = await supabase.from('email_threads').update({ is_unread: false, updated_at: now }).eq('id', thread.id);
        if (readError) logger.error('Inbox: sent, but could not mark the thread read', { error: readError, threadId: thread.id });
      }
    }

    // Only a person answering moves the lead; an AI auto-reply does not.
    if (thread.lead_id && !test && !autoSent) await markLeadContacted(thread.lead_id).catch(() => {});

    return { success: true, emailId: stored?.id ?? null, threadId: thread.id, resendId };
  },

  /**
   * Store an inbound email from the webhook, finding or creating its thread.
   * Returns null when the message was already stored (webhook retry).
   */
  async storeInboundEmail({
    from,
    fromName,
    to,
    subject,
    text,
    html,
    messageId,
    inReplyTo,
    references,
    threadIdHint,
    resendEmailId,
    cc,
    attachments,
    spam,
    auth,
  }: {
    from: string;
    fromName?: string | null;
    to: string;
    subject: string;
    text?: string | null;
    html?: string | null;
    messageId?: string;
    inReplyTo?: string;
    references?: string;
    /** Thread id parsed from our plus-addressed Reply-To (support+<id>@…). */
    threadIdHint?: string | null;
    /** Resend's received-email id (lets us fetch attachments later). */
    resendEmailId?: string;
    cc?: string[];
    attachments?: EmailAttachmentMeta[];
    spam?: boolean;
    /** SPF / DKIM / DMARC verdicts from the receiving server, when it reported them. */
    auth?: { spf: string | null; dkim: string | null; dmarc: string | null } | null;
  }): Promise<{ email: EmailRow; thread: ThreadRow; isNewThread: boolean } | null> {
    const supabase = db();

    from = from.trim().toLowerCase();
    subject = stripNul(subject);
    text = stripNul(text);
    html = stripNul(html);
    fromName = stripNul(fromName);

    // Deduplicate: Resend retries webhooks. (The unique index from 081 is the
    // real guard under concurrent deliveries; these lookups just avoid the
    // wasted work in the common case.)
    if (resendEmailId) {
      const { data: dup } = await supabase
        .from('emails')
        .select('id')
        .eq('resend_id', resendEmailId)
        .eq('direction', 'inbound')
        .limit(1);
      if (dup && dup.length > 0) return null;
    }
    if (messageId) {
      // Same sender only: a Message-ID is whatever the sender says it is, and
      // must not let one sender make another sender's mail look like a repeat.
      const { data: dup } = await supabase
        .from('emails')
        .select('id')
        .eq('message_id', messageId)
        .eq('from_email', from)
        .limit(1);
      if (dup && dup.length > 0) return null;
    }

    // A thread is a conversation with ONE address, and replies go to that
    // address. So mail only joins a thread when it comes from the thread's
    // participant, whichever way the thread was found. Otherwise anyone who
    // can guess a tag or quote a Message-ID could pull a reply — manual or
    // automatic — onto somebody else.
    const sameParticipant = (t: ThreadRow | null): ThreadRow | null =>
      t && t.participant_email.trim().toLowerCase() === from ? t : null;

    let thread: ThreadRow | null = null;

    // 1. Plus-address tag — set on every outbound Reply-To, so exact.
    if (threadIdHint && isUuid(threadIdHint)) {
      const { data } = await supabase.from('email_threads').select('*').eq('id', threadIdHint).maybeSingle();
      thread = sameParticipant(data as ThreadRow | null);
    }

    // 2. In-Reply-To / References → a message we stored.
    if (!thread) {
      const candidates = Array.from(new Set([inReplyTo, ...(references || '').split(/\s+/)].map(cleanMessageId).filter(Boolean))).slice(0, 50);
      if (candidates.length > 0) {
        const { data: related } = await supabase
          .from('emails')
          .select('thread_id')
          .in('message_id', candidates)
          .order('created_at', { ascending: false })
          .limit(1);
        const relatedThreadId = related?.[0]?.thread_id;
        if (relatedThreadId) {
          const { data } = await supabase.from('email_threads').select('*').eq('id', relatedThreadId).maybeSingle();
          thread = sameParticipant(data as ThreadRow | null);
        }
      }
    }

    // 3. Last resort: same sender, same normalized subject, within 90 days.
    const normalized = normalizeSubject(subject);
    if (!thread && normalized) {
      const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('email_threads')
        .select('*')
        .eq('participant_email', from)
        // Exact match: a pattern match would treat %, _ and * in a subject as wildcards.
        .eq('subject', normalized)
        .gte('last_message_at', since)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) thread = data as ThreadRow;
    }

    // Link the sender to a platform account, and to their lead, when there is one.
    const [{ data: profile }, leadId] = await Promise.all([
      supabase.from('profiles').select('id').eq('email', from).limit(1).maybeSingle(),
      thread?.lead_id ? Promise.resolve(thread.lead_id) : findPlatformLeadIdByEmail(from).catch(() => null),
    ]);
    const linkedProfileId: string | null = profile?.id ?? null;

    let isNewThread = false;
    if (!thread) {
      const ownerId = await this.inboxOwnerId();
      if (!ownerId) {
        logger.error('Inbox: no admin profile to own inbound thread', { from });
        throw new Error('No admin profile exists to own the inbound email');
      }
      const { data: created, error } = await supabase
        .from('email_threads')
        .insert({
          subject: normalized || subject || '(no subject)',
          owner_id: ownerId,
          participant_email: from,
          participant_name: fromName || null,
          status: 'received',
          is_unread: true,
          is_spam: !!spam,
          linked_profile_id: linkedProfileId,
          lead_id: leadId,
        })
        .select('*')
        .single();
      if (error || !created) {
        logger.error('Inbox: failed to create inbound thread', { error });
        throw error ?? new Error('Failed to create thread');
      }
      thread = created as ThreadRow;
      isNewThread = true;
    } else {
      const patch: Record<string, unknown> = {};
      if (!thread.participant_name && fromName) patch.participant_name = fromName;
      if (!thread.linked_profile_id && linkedProfileId) patch.linked_profile_id = linkedProfileId;
      if (!thread.lead_id && leadId) patch.lead_id = leadId;
      if (Object.keys(patch).length > 0) {
        await supabase.from('email_threads').update(patch).eq('id', thread.id);
        thread = { ...thread, ...patch } as ThreadRow;
      }
    }

    const headers: Record<string, unknown> = {};
    if (messageId) headers.message_id = messageId;
    if (inReplyTo) headers.in_reply_to = inReplyTo;
    if (references) headers.references = references;
    if (auth) headers.auth = auth;

    const metadata: EmailMetadata = {};
    if (cc?.length) metadata.cc = cc;

    const { data: stored, error } = await supabase
      .from('emails')
      .insert({
        thread_id: thread.id,
        resend_id: resendEmailId || null,
        message_id: messageId || null,
        direction: 'inbound',
        from_email: from,
        from_name: fromName || null,
        to_email: to,
        subject: subject || '(no subject)',
        html_body: html || null,
        text_body: text || null,
        status: 'received',
        is_read: false,
        headers,
        metadata,
        attachments: attachments ?? [],
      })
      .select('*')
      .single();
    if (error || !stored) {
      if (isNewThread) await supabase.from('email_threads').delete().eq('id', thread.id);
      // 23505 = unique violation on the inbound resend_id index: a concurrent
      // delivery of the same message won the race. That is a duplicate, not a failure.
      if (error?.code === '23505') return null;
      logger.error('Inbox: failed to store inbound email', { error });
      throw error ?? new Error('Failed to store email');
    }

    return { email: stored as EmailRow, thread, isNewThread };
  },

  /**
   * Delivery events only touch outbound rows (inbound rows carry a Resend id
   * too). Returns the recipients of the matching rows, updated or not.
   */
  async updateDeliveryStatus(resendId: string, status: EmailStatus): Promise<string[]> {
    const supabase = db();
    const { data: rows } = await supabase
      .from('emails')
      .select('id, to_email, status')
      .eq('resend_id', resendId)
      .eq('direction', 'outbound');
    const matched = (rows ?? []) as Array<{ id: string; to_email: string; status: EmailStatus }>;
    const advance = matched.filter((r) => canAdvanceStatus(r.status, status)).map((r) => r.id);
    if (advance.length > 0) {
      await supabase.from('emails').update({ status }).in('id', advance);
    }
    return matched.map((r) => r.to_email).filter(Boolean);
  },

  /**
   * Record, in a conversation, a reply that was sent by another part of the
   * platform (the instant AI reply on a listing inquiry), so the thread shows
   * it and nobody answers the same message twice.
   */
  async recordSentReply({
    threadId,
    to,
    subject,
    text,
    html,
    resendId,
    fromName,
    fromAddress,
    replyTo,
  }: {
    threadId: string;
    to: string;
    subject: string;
    text: string | null;
    html: string | null;
    resendId: string | null;
    fromName: string;
    fromAddress: string;
    replyTo: string;
  }) {
    const supabase = db();
    const now = new Date().toISOString();
    const { error } = await supabase.from('emails').insert({
      thread_id: threadId,
      resend_id: resendId,
      direction: 'outbound',
      from_email: fromAddress,
      from_name: fromName,
      to_email: to,
      reply_to: replyTo,
      subject: subject.slice(0, 300),
      html_body: html,
      text_body: text,
      status: 'sent',
      is_read: true,
      headers: {},
      metadata: { auto_sent: true },
      ai_category: 'auto_reply',
    });
    if (error) {
      logger.error('Inbox: could not record a reply sent elsewhere', { error, threadId });
      return;
    }
    await supabase
      .from('emails')
      .update({ status: 'replied', replied_at: now })
      .eq('thread_id', threadId)
      .eq('direction', 'inbound')
      .neq('status', 'replied');
  },

  async updateAiFields(
    emailId: string,
    fields: { ai_category?: string; ai_confidence?: number; ai_summary?: string; ai_draft_html?: string | null; ai_draft_text?: string | null },
  ) {
    await db().from('emails').update({ ...fields, ai_processed_at: new Date().toISOString() }).eq('id', emailId);
  },

  async getSetting(key: InboxSettingKey): Promise<boolean | null> {
    const { data } = await db().from('platform_settings').select('value').eq('key', key).maybeSingle();
    if (!data) return null;
    // JSONB: stored as true/false or the strings "true"/"false".
    return data.value === true || data.value === 'true';
  },

  async setSetting(key: InboxSettingKey, value: boolean) {
    const { error } = await db()
      .from('platform_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  },
};

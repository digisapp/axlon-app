'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf-fetch';
import type {
  BulkAction, Email, FolderCounts, InboxFolder, InboxStatus, LeadContext, LeadStatus, Thread, ThreadListRow,
} from '@/components/admin-inbox/types';
import { latestInbound, quoteText } from '@/components/admin-inbox/types';
import {
  MAX_ATTACHMENT_BYTES, MAX_ATTACHMENTS, base64Bytes, cleanFilename, isAllowedAttachmentType, replyScaffold,
  type OutgoingAttachment,
} from '@/lib/email/compose';

export interface ComposeState {
  open: boolean;
  to: string;
  toName: string;
  subject: string;
  bodyText: string;
  /** Set when replying inside a conversation. */
  replyToThreadId?: string;
  quotedText?: string;
  /** Where the caret starts in the message box (after the greeting). */
  caret?: number;
  /** The greeting + sign-off it started with: sending that alone is blocked. */
  scaffold?: string;
  attachments: OutgoingAttachment[];
}

const EMPTY_COMPOSE: ComposeState = { open: false, to: '', toName: '', subject: '', bodyText: '', attachments: [] };

/** A File as base64 (no data: prefix). */
function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file'));
    reader.readAsDataURL(file);
  });
}

/** The conversation id in the address bar (/admin/email?thread=<id>). */
function threadIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const id = new URLSearchParams(window.location.search).get('thread');
  return id && /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

/** Marks the history entry we pushed for an open conversation. */
const THREAD_HISTORY_KEY = '__inboxThread';

function threadUrl(id: string | null): string {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('thread', id);
  else url.searchParams.delete('thread');
  return url.toString();
}

/**
 * Keep ?thread= in step with the open conversation. On a phone, opening one
 * pushes a history entry, so the system back gesture returns to the list
 * instead of leaving the inbox; elsewhere the address just updates in place.
 */
function setThreadInUrl(id: string | null, mode: 'push' | 'replace' = 'replace') {
  if (typeof window === 'undefined') return;
  if (mode === 'push') window.history.pushState({ ...(window.history.state ?? {}), [THREAD_HISTORY_KEY]: id }, '', threadUrl(id));
  else window.history.replaceState(window.history.state, '', threadUrl(id));
}

function isPhoneLayout(): boolean {
  return typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches;
}

/** Same text once whitespace is ignored (an untouched greeting + sign-off). */
function sameText(a: string | null | undefined, b: string | null | undefined): boolean {
  return (a ?? '').replace(/\s+/g, ' ').trim() === (b ?? '').replace(/\s+/g, ' ').trim();
}

/** A type for files the OS left untyped (e.g. .docx on a PC without Office). */
const EXTENSION_TYPES: Record<string, string> = {
  pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
  heic: 'image/heic', heif: 'image/heif', txt: 'text/plain', csv: 'text/csv', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
const SEARCH_DEBOUNCE_MS = 300;
const POLL_MS = 45_000;
const PAGE_SIZE = 25;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  return (data && typeof data.error === 'string' && data.error) || fallback;
}

export function useAdminInbox() {
  const router = useRouter();
  // Responses can land out of order (fast folder switch, two quick clicks).
  // Each request takes a number; only the latest one may write state.
  const listSeq = useRef(0);
  const detailSeq = useRef(0);
  // Bumped by every local change to the list (read, star, spam, status…): a
  // list response requested before it would undo that change on screen.
  const localEdits = useRef(0);
  // Which conversation is open / on screen right now, for async callbacks.
  const selectedIdRef = useRef<string | null>(null);
  const shownThreadIdRef = useRef<string | null>(null);
  // Whether the open conversation has a history entry of its own (phones).
  const pushedThread = useRef(false);

  // ── List ──
  const [folder, setFolderState] = useState<InboxFolder>('inbox');
  const [threads, setThreads] = useState<ThreadListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<FolderCounts>({ unread: 0, starred: 0, spam: 0 });

  // ── Detail ──
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [lead, setLead] = useState<LeadContext | null>(null);
  // Busy flags carry the conversation they belong to, so opening another one
  // never shows it as "Writing…" or disables its buttons.
  const [leadSavingId, setLeadSavingId] = useState<string | null>(null);
  const [redraftingId, setRedraftingId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // ── Compose ──
  const [compose, setCompose] = useState<ComposeState>(EMPTY_COMPOSE);
  const [sending, setSending] = useState(false);

  // ── Selection / bulk ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActing, setBulkActing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  // ── Auto-reply ──
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [autoReplyLoading, setAutoReplyLoading] = useState(true);

  // ── Receiving status ──
  const [status, setStatus] = useState<InboxStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);
  const [enablingReceiving, setEnablingReceiving] = useState(false);

  // Always the latest fetchThreads, for timers and callbacks.
  const fetchThreadsRef = useRef<(opts?: { silent?: boolean }) => Promise<void>>(async () => {});

  // Search debounce → page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const fetchThreads = useCallback(async (opts: { silent?: boolean } = {}) => {
    const seq = ++listSeq.current;
    const editsAtStart = localEdits.current;
    if (!opts.silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const params = new URLSearchParams({ folder, page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await fetch(`/api/admin/inbox?${params}`);
      if (!res.ok) throw new Error(await readError(res, 'Failed to load emails'));
      const data = await res.json();
      if (seq !== listSeq.current) return;
      if (editsAtStart !== localEdits.current) {
        // Something changed on screen while this was in flight; ask again
        // rather than paint the older state over it.
        setTimeout(() => fetchThreadsRef.current({ silent: true }), 0);
        return;
      }
      const pages = data.totalPages ?? 1;
      setThreads(data.threads ?? []);
      setTotalPages(pages);
      setTotal(data.total ?? 0);
      if (data.counts) setCounts(data.counts);
      // The page emptied out (bulk delete, mail moved): step back to the last real one.
      if (page > pages) setPage(pages);
    } catch (err) {
      if (seq !== listSeq.current) return;
      if (!opts.silent) setError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      if (seq === listSeq.current && !opts.silent) setLoading(false);
    }
  }, [folder, page, debouncedSearch]);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // The sidebar and bell badges are rendered by the admin layout on the
  // server; refresh it whenever the unread number moves so they follow.
  const lastUnread = useRef<number | null>(null);
  useEffect(() => {
    if (lastUnread.current !== null && lastUnread.current !== counts.unread) router.refresh();
    lastUnread.current = counts.unread;
  }, [counts.unread, router]);

  // New mail shows up without a manual refresh: poll while the tab is
  // visible and nothing is selected for a bulk action.
  fetchThreadsRef.current = fetchThreads;
  const selectionSize = selectedIds.size;
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible' || selectionSize > 0) return;
      fetchThreadsRef.current({ silent: true });
    };
    const interval = setInterval(tick, POLL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [selectionSize]);

  const fetchStatus = useCallback(async (fresh = false) => {
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/admin/inbox/status${fresh ? '?fresh=1' : ''}`);
      if (res.ok) setStatus(await res.json());
    } catch { /* the page still works without the status card */ } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/inbox/settings?key=ai_auto_reply_enabled');
        if (res.ok) {
          const data = await res.json();
          setAutoReplyEnabled(data.value === true);
        }
      } catch { /* defaults to off */ } finally {
        setAutoReplyLoading(false);
      }
    })();
  }, []);

  const setAutoReply = useCallback(async (value: boolean) => {
    setAutoReplyLoading(true);
    try {
      const res = await csrfFetch('/api/admin/inbox/settings', {
        method: 'PUT', headers: JSON_HEADERS,
        body: JSON.stringify({ key: 'ai_auto_reply_enabled', value }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Could not save'));
      setAutoReplyEnabled(value);
      toast.success(value ? 'AI auto-reply is on' : 'AI auto-reply is off');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setAutoReplyLoading(false);
    }
  }, []);

  // ── Detail ──
  const patchFlags = useCallback(async (id: string, flags: Record<string, boolean>) => {
    const res = await csrfFetch(`/api/admin/inbox/${id}`, { method: 'PATCH', headers: JSON_HEADERS, body: JSON.stringify(flags) });
    if (!res.ok) throw new Error(await readError(res, 'Update failed'));
  }, []);

  const applyLocal = useCallback((ids: string[], patch: Partial<ThreadListRow>, removeFromFolder = false) => {
    localEdits.current++;
    setThreads((prev) => removeFromFolder
      ? prev.filter((t) => !ids.includes(t.id))
      : prev.map((t) => ids.includes(t.id) ? { ...t, ...patch } : t));
    setSelectedThread((prev) => prev && ids.includes(prev.id) ? { ...prev, ...(patch as Partial<Thread>) } : prev);
  }, []);

  const selectThread = useCallback(async (id: string, opts: { push?: boolean } = {}) => {
    const seq = ++detailSeq.current;
    const switching = shownThreadIdRef.current !== id;
    selectedIdRef.current = id;
    setSelectedId(id);
    if (switching) {
      // Never leave the previous conversation (and its Send / Reply / lead
      // controls) on screen while another one loads, or after it fails.
      shownThreadIdRef.current = null;
      setSelectedThread(null);
      setEmails([]);
      setLead(null);
    }
    if (opts.push && isPhoneLayout() && !pushedThread.current) {
      setThreadInUrl(id, 'push');
      pushedThread.current = true;
    }
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/admin/inbox/${id}`);
      if (!res.ok) throw new Error(await readError(res, 'Failed to open conversation'));
      const data = await res.json();
      if (seq !== detailSeq.current) return; // a newer click owns the pane
      const thread: Thread = data.thread;
      shownThreadIdRef.current = id;
      setSelectedThread(thread);
      setEmails(data.emails ?? []);
      setLead(data.lead ?? null);
      setThreadInUrl(id);

      if (thread.is_unread) {
        await patchFlags(id, { isRead: true }).catch(() => {});
        const nextStatus = thread.status === 'received' ? 'read' : thread.status;
        applyLocal([id], { is_unread: false, status: nextStatus });
        if (seq === detailSeq.current) setEmails((prev) => prev.map((e) => e.is_read ? e : { ...e, is_read: true }));
        // Spam is never counted as unread on the server either.
        if (!thread.is_spam) setCounts((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      }
    } catch (err) {
      if (seq === detailSeq.current) setDetailError(err instanceof Error ? err.message : 'Failed to open conversation');
    } finally {
      if (seq === detailSeq.current) setDetailLoading(false);
    }
  }, [patchFlags, applyLocal]);

  /** Forget the open conversation (state only, no address change). */
  const clearDetail = useCallback(() => {
    detailSeq.current++; // drop any response still in flight
    selectedIdRef.current = null;
    shownThreadIdRef.current = null;
    setDetailLoading(false);
    setSelectedId(null);
    setSelectedThread(null);
    setEmails([]);
    setLead(null);
    setDetailError(null);
  }, []);

  const closeDetail = useCallback(() => {
    clearDetail();
    if (pushedThread.current) {
      // Step back off the entry we pushed, so history matches the screen.
      pushedThread.current = false;
      window.history.back();
    } else {
      setThreadInUrl(null);
    }
  }, [clearDetail]);

  /** Open a conversation from the list (a history entry of its own on phones). */
  const openThread = useCallback((id: string) => selectThread(id, { push: true }), [selectThread]);

  // The system back / forward gesture moves between the list and a conversation.
  useEffect(() => {
    const onPop = () => {
      const id = threadIdFromUrl();
      if (!id) {
        pushedThread.current = false;
        clearDetail();
      } else if (id !== selectedIdRef.current) {
        pushedThread.current = !!(window.history.state as Record<string, unknown> | null)?.[THREAD_HISTORY_KEY];
        void selectThread(id);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [clearDetail, selectThread]);

  const toggleStar = useCallback(async (id: string) => {
    const current = threads.find((t) => t.id === id)?.is_starred ?? selectedThread?.is_starred ?? false;
    const next = !current;
    applyLocal([id], { is_starred: next }, folder === 'starred' && !next);
    setCounts((prev) => ({ ...prev, starred: Math.max(0, prev.starred + (next ? 1 : -1)) }));
    try {
      await patchFlags(id, { isStarred: next });
    } catch (err) {
      applyLocal([id], { is_starred: current });
      setCounts((prev) => ({ ...prev, starred: Math.max(0, prev.starred + (next ? -1 : 1)) }));
      toast.error(err instanceof Error ? err.message : 'Could not update star');
    }
  }, [threads, selectedThread, folder, applyLocal, patchFlags]);

  const markUnread = useCallback(async (id: string) => {
    try {
      await patchFlags(id, { isRead: false });
      const current = threads.find((t) => t.id === id) ?? selectedThread;
      // 'read' goes back to 'received'; an answered thread stays 'replied'.
      applyLocal([id], { is_unread: true, ...(current?.status === 'read' ? { status: 'received' as const } : {}) });
      if (!current?.is_spam) setCounts((prev) => ({ ...prev, unread: prev.unread + 1 }));
      closeDetail();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not mark unread');
    }
  }, [threads, selectedThread, patchFlags, applyLocal, closeDetail]);

  const setSpam = useCallback(async (id: string, isSpam: boolean) => {
    try {
      await patchFlags(id, { isSpam });
      const leavesFolder = (folder === 'spam') !== isSpam;
      applyLocal([id], { is_spam: isSpam }, leavesFolder);
      if (leavesFolder && selectedId === id) closeDetail();
      setCounts((prev) => ({ ...prev, spam: Math.max(0, prev.spam + (isSpam ? 1 : -1)) }));
      toast.success(isSpam ? 'Moved to spam' : 'Moved back to inbox');
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update');
    }
  }, [folder, selectedId, patchFlags, applyLocal, closeDetail, fetchThreads]);

  // Deletes always confirm first (page renders the dialog).
  const requestDelete = useCallback((ids: string[]) => { if (ids.length) setPendingDelete(ids); }, []);
  const cancelDelete = useCallback(() => setPendingDelete(null), []);
  const confirmDelete = useCallback(async () => {
    const ids = pendingDelete;
    if (!ids?.length) return;
    setBulkActing(true);
    try {
      const res = await csrfFetch('/api/admin/inbox', { method: 'DELETE', headers: JSON_HEADERS, body: JSON.stringify({ ids }) });
      if (!res.ok) throw new Error(await readError(res, 'Delete failed'));
      setThreads((prev) => prev.filter((t) => !ids.includes(t.id)));
      if (selectedId && ids.includes(selectedId)) closeDetail();
      setSelectedIds(new Set());
      setPendingDelete(null);
      toast.success(ids.length === 1 ? 'Conversation deleted' : `${ids.length} conversations deleted`);
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBulkActing(false);
    }
  }, [pendingDelete, selectedId, closeDetail, fetchThreads]);

  // ── Bulk ──
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAllOnPage = useCallback(() => {
    setSelectedIds((prev) => prev.size === threads.length && threads.length > 0 ? new Set() : new Set(threads.map((t) => t.id)));
  }, [threads]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const bulk = useCallback(async (action: BulkAction) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (action === 'delete') { requestDelete(ids); return; }
    setBulkActing(true);
    try {
      const res = await csrfFetch('/api/admin/inbox', { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify({ ids, action }) });
      if (!res.ok) throw new Error(await readError(res, 'Action failed'));
      setSelectedIds(new Set());
      await fetchThreads({ silent: true });
      toast.success({
        markRead: 'Marked as read', markUnread: 'Marked as unread', star: 'Starred', unstar: 'Unstarred',
        spam: 'Moved to spam', notSpam: 'Moved back to inbox', delete: 'Deleted',
      }[action]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBulkActing(false);
    }
  }, [selectedIds, requestDelete, fetchThreads]);

  // ── Compose ──
  const openCompose = useCallback((replyTo?: Thread | null, replyEmails: Email[] = []) => {
    if (replyTo) {
      const last = latestInbound(replyEmails) ?? replyEmails[replyEmails.length - 1] ?? null;
      // "Hi <name>, … Best, The Axleyard Team" with the caret in between.
      const scaffold = replyScaffold(replyTo.participant_name);
      setCompose((prev) => {
        // "Close" keeps what was typed: reopen an unsent reply to the same
        // conversation instead of starting over.
        const unsent = prev.replyToThreadId === replyTo.id
          && (!sameText(prev.bodyText, prev.scaffold) || prev.attachments.length > 0);
        if (unsent) return { ...prev, open: true, caret: undefined };
        return {
        open: true,
        to: replyTo.participant_email,
        toName: replyTo.participant_name || '',
        subject: /^re:/i.test(replyTo.subject) ? replyTo.subject : `Re: ${replyTo.subject}`,
        bodyText: scaffold.text,
        caret: scaffold.caret,
        scaffold: scaffold.text,
        replyToThreadId: replyTo.id,
        quotedText: last ? quoteText(last) || undefined : undefined,
        attachments: [],
        };
      });
    } else {
      // Reopen a half-written new email rather than wiping it.
      setCompose((prev) => (!prev.replyToThreadId && (prev.to || prev.subject || prev.bodyText))
        ? { ...prev, open: true }
        : { ...EMPTY_COMPOSE, open: true });
    }
  }, []);

  const setComposeField = useCallback((field: 'to' | 'toName' | 'subject' | 'bodyText', value: string) => {
    setCompose((prev) => ({ ...prev, [field]: value }));
  }, []);

  /** Add picked files, enforcing the same limits the server does. */
  const addAttachments = useCallback(async (files: FileList | File[]) => {
    const picked = Array.from(files);
    const next: OutgoingAttachment[] = [];
    for (const file of picked) {
      // Size first: reading a 100 MB file into memory just to refuse it
      // would stall a phone.
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`${file.name} is over 3 MB`);
        continue;
      }
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const contentType = file.type || EXTENSION_TYPES[ext] || 'application/octet-stream';
      if (!isAllowedAttachmentType(contentType)) {
        toast.error(`${file.name}: only PDFs, images, text and Office files can be attached`);
        continue;
      }
      try {
        next.push({ filename: cleanFilename(file.name), contentType, content: await readAsBase64(file) });
      } catch {
        toast.error(`Could not read ${file.name}`);
      }
    }
    setCompose((prev) => {
      const merged = [...prev.attachments, ...next];
      if (merged.length > MAX_ATTACHMENTS) {
        toast.error(`Attach at most ${MAX_ATTACHMENTS} files`);
        return prev;
      }
      if (merged.reduce((sum, a) => sum + base64Bytes(a.content), 0) > MAX_ATTACHMENT_BYTES) {
        toast.error('Attachments are over 3 MB in total');
        return prev;
      }
      return { ...prev, attachments: merged };
    });
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setCompose((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  }, []);

  /** Hide the window but keep what was typed. */
  const closeCompose = useCallback(() => setCompose((prev) => ({ ...prev, open: false })), []);
  const discardCompose = useCallback(() => setCompose(EMPTY_COMPOSE), []);

  const handleSend = useCallback(async () => {
    const to = compose.to.trim();
    const subject = compose.subject.trim();
    const body = compose.bodyText.trim();
    if (!body || sameText(body, compose.scaffold) || (!compose.replyToThreadId && (!to || !subject))) return;
    setSending(true);
    try {
      // The server quotes the message being answered under a reply; only
      // what was typed is sent from here.
      const res = await csrfFetch('/api/admin/inbox', {
        method: 'POST', headers: JSON_HEADERS,
        body: JSON.stringify({
          to, toName: compose.toName.trim() || undefined, subject, bodyText: body, replyToThreadId: compose.replyToThreadId,
          attachments: compose.attachments.length > 0 ? compose.attachments : undefined,
        }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Failed to send'));
      const wasReply = compose.replyToThreadId;
      setCompose(EMPTY_COMPOSE);
      toast.success(wasReply ? 'Reply sent' : 'Email sent');
      if (wasReply) {
        const contacted = lead?.status === 'new';
        applyLocal([wasReply], { status: 'replied', is_unread: false, ...(contacted ? { lead_status: 'contacted' } : {}) });
        if (selectedIdRef.current === wasReply) void selectThread(wasReply);
        // The admin layout's Leads badge counts new leads.
        if (contacted) router.refresh();
      }
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }, [compose, lead, applyLocal, selectThread, fetchThreads, router]);

  // ── AI draft ──
  const sendAiDraft = useCallback(async (threadId: string, emailId: string) => {
    setSending(true);
    try {
      const res = await csrfFetch(`/api/admin/inbox/${threadId}`, {
        method: 'PATCH', headers: JSON_HEADERS, body: JSON.stringify({ useAiDraft: true, emailId }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Failed to send draft'));
      toast.success('Suggested reply sent');
      applyLocal([threadId], { status: 'replied', is_unread: false });
      // Refresh it only if it is still the one open: never pull someone back
      // to a conversation they have left while this was sending.
      if (selectedIdRef.current === threadId) await selectThread(threadId);
      fetchThreads({ silent: true });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send draft');
    } finally {
      setSending(false);
    }
  }, [selectThread, fetchThreads, applyLocal, router]);

  const editAiDraft = useCallback((thread: Thread, email: Email) => {
    const draft = email.ai_draft_text || email.ai_draft_html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
    if (!draft) return;
    setCompose({
      open: true,
      to: thread.participant_email,
      toName: thread.participant_name || '',
      subject: /^re:/i.test(email.subject) ? email.subject : `Re: ${email.subject}`,
      bodyText: draft,
      replyToThreadId: thread.id,
      quotedText: quoteText(email) || undefined,
      attachments: [],
    });
  }, []);

  /** Ask the AI for a fresh suggested reply to the newest message. */
  const regenerateDraft = useCallback(async (threadId: string) => {
    setRedraftingId(threadId);
    try {
      const res = await csrfFetch(`/api/admin/inbox/${threadId}/draft`, { method: 'POST', headers: JSON_HEADERS });
      if (!res.ok) throw new Error(await readError(res, 'Could not write a new draft'));
      const data: { email: Email } = await res.json();
      setEmails((prev) => prev.map((e) => (e.id === data.email.id ? data.email : e)));
      if (selectedIdRef.current === threadId) toast.success('New draft ready');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not write a new draft');
    } finally {
      setRedraftingId((cur) => (cur === threadId ? null : cur));
    }
  }, []);

  // ── Lead ──
  const setLeadStatus = useCallback(async (threadId: string, status: LeadStatus) => {
    const seq = detailSeq.current;
    setLeadSavingId(threadId);
    try {
      const res = await csrfFetch(`/api/admin/inbox/${threadId}`, {
        method: 'PATCH', headers: JSON_HEADERS, body: JSON.stringify({ leadStatus: status }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Could not update the lead'));
      const data: { lead: LeadContext | null } = await res.json();
      // Another conversation may have been opened meanwhile.
      if (seq === detailSeq.current) setLead(data.lead);
      applyLocal([threadId], { lead_status: status });
      // Moving a lead past "new" clears its "new lead" alert from Unread.
      fetchThreads({ silent: true });
      // The admin layout's Leads badge counts new leads.
      router.refresh();
      toast.success(`Lead moved to ${status.charAt(0).toUpperCase()}${status.slice(1)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update the lead');
    } finally {
      setLeadSavingId((cur) => (cur === threadId ? null : cur));
    }
  }, [applyLocal, fetchThreads, router]);

  // ── Test email ──
  const sendTest = useCallback(async () => {
    setSendingTest(true);
    try {
      const res = await csrfFetch('/api/admin/inbox/test', { method: 'POST', headers: JSON_HEADERS });
      if (!res.ok) throw new Error(await readError(res, 'Test send failed'));
      const data = await res.json();
      toast.success(`Test sent to ${data.to}. Reply to it and watch the Inbox.`);
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Test send failed');
    } finally {
      setSendingTest(false);
    }
  }, [fetchThreads]);

  // ── Finish setup: switch receiving on in Resend once the MX is live ──
  const enableReceiving = useCallback(async () => {
    setEnablingReceiving(true);
    try {
      const res = await csrfFetch('/api/admin/inbox/status', { method: 'POST', headers: JSON_HEADERS });
      if (!res.ok) throw new Error(await readError(res, 'Could not turn on receiving'));
      const next: InboxStatus = await res.json();
      setStatus(next);
      toast.success(next.ready ? 'Receiving is on. Send yourself a test and reply to it.' : 'Receiving is on in Resend; waiting for it to verify the record.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not turn on receiving');
    } finally {
      setEnablingReceiving(false);
    }
  }, []);

  const setFolder = useCallback((next: InboxFolder) => {
    setFolderState(next);
    setPage(1);
    setSelectedIds(new Set());
    closeDetail();
  }, [closeDetail]);

  // Open the conversation named in the address bar (?thread=<id>) once.
  const openedFromUrl = useRef(false);
  useEffect(() => {
    if (openedFromUrl.current) return;
    openedFromUrl.current = true;
    const id = threadIdFromUrl();
    if (id) void selectThread(id);
  }, [selectThread]);

  // Unread count in the browser tab, so new mail is visible from other tabs.
  // Nothing is restored on leaving: the next page sets its own title.
  useEffect(() => {
    const base = 'Email inbox · Admin';
    const wanted = counts.unread > 0 ? `(${counts.unread}) ${base}` : base;
    const apply = () => { if (document.title !== wanted) document.title = wanted; };
    apply();
    // Next.js writes the page's metadata title after hydration (and on
    // navigation), which would quietly replace this one; put it back.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [counts.unread]);

  return {
    folder, setFolder, threads, loading, error, search, setSearch, page, setPage, totalPages, total, counts,
    refresh: () => fetchThreads(),
    selectedId, selectedThread, emails, detailLoading, detailError, selectThread, openThread, closeDetail,
    toggleStar, markUnread, setSpam, requestDelete, cancelDelete, confirmDelete, pendingDelete,
    selectedIds, toggleSelect, selectAllOnPage, clearSelection, bulk, bulkActing,
    sendAiDraft, editAiDraft, regenerateDraft,
    redrafting: !!redraftingId && redraftingId === selectedId,
    lead,
    leadSaving: !!leadSavingId && leadSavingId === selectedId,
    setLeadStatus,
    addAttachments, removeAttachment,
    autoReplyEnabled, autoReplyLoading, setAutoReply,
    compose, setComposeField, openCompose, closeCompose, discardCompose, sending, handleSend,
    status, statusLoading, refreshStatus: () => fetchStatus(true), sendTest, sendingTest,
    enableReceiving, enablingReceiving,
  };
}

export type AdminInbox = ReturnType<typeof useAdminInbox>;

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf-fetch';
import type {
  BulkAction, Email, FolderCounts, InboxFolder, InboxStatus, Thread, ThreadListRow,
} from '@/components/admin-inbox/types';
import { latestInbound, quoteText } from '@/components/admin-inbox/types';

export interface ComposeState {
  open: boolean;
  to: string;
  toName: string;
  subject: string;
  bodyText: string;
  /** Set when replying inside a conversation. */
  replyToThreadId?: string;
  quotedText?: string;
}

const EMPTY_COMPOSE: ComposeState = { open: false, to: '', toName: '', subject: '', bodyText: '' };
const SEARCH_DEBOUNCE_MS = 300;
const POLL_MS = 45_000;
const PAGE_SIZE = 25;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  return (data && typeof data.error === 'string' && data.error) || fallback;
}

export function useAdminInbox() {
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

  // Search debounce → page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const fetchThreads = useCallback(async (opts: { silent?: boolean } = {}) => {
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
      setThreads(data.threads ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
      if (data.counts) setCounts(data.counts);
    } catch (err) {
      if (!opts.silent) setError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      if (!opts.silent) setLoading(false);
    }
  }, [folder, page, debouncedSearch]);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // New mail shows up without a manual refresh: poll while the tab is
  // visible and nothing is selected for a bulk action.
  const fetchThreadsRef = useRef(fetchThreads);
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
    setThreads((prev) => removeFromFolder
      ? prev.filter((t) => !ids.includes(t.id))
      : prev.map((t) => ids.includes(t.id) ? { ...t, ...patch } : t));
    setSelectedThread((prev) => prev && ids.includes(prev.id) ? { ...prev, ...(patch as Partial<Thread>) } : prev);
  }, []);

  const selectThread = useCallback(async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/admin/inbox/${id}`);
      if (!res.ok) throw new Error(await readError(res, 'Failed to open conversation'));
      const data = await res.json();
      const thread: Thread = data.thread;
      setSelectedThread(thread);
      setEmails(data.emails ?? []);

      if (thread.is_unread) {
        await patchFlags(id, { isRead: true }).catch(() => {});
        const nextStatus = thread.status === 'received' ? 'read' : thread.status;
        applyLocal([id], { is_unread: false, status: nextStatus });
        setEmails((prev) => prev.map((e) => e.is_read ? e : { ...e, is_read: true }));
        setCounts((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      }
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Failed to open conversation');
    } finally {
      setDetailLoading(false);
    }
  }, [patchFlags, applyLocal]);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
    setSelectedThread(null);
    setEmails([]);
    setDetailError(null);
  }, []);

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
      applyLocal([id], { is_unread: true, status: 'received' });
      setCounts((prev) => ({ ...prev, unread: prev.unread + 1 }));
      closeDetail();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not mark unread');
    }
  }, [patchFlags, applyLocal, closeDetail]);

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
      setCompose({
        open: true,
        to: replyTo.participant_email,
        toName: replyTo.participant_name || '',
        subject: /^re:/i.test(replyTo.subject) ? replyTo.subject : `Re: ${replyTo.subject}`,
        bodyText: '',
        replyToThreadId: replyTo.id,
        quotedText: last ? quoteText(last) || undefined : undefined,
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

  /** Hide the window but keep what was typed. */
  const closeCompose = useCallback(() => setCompose((prev) => ({ ...prev, open: false })), []);
  const discardCompose = useCallback(() => setCompose(EMPTY_COMPOSE), []);

  const handleSend = useCallback(async () => {
    const to = compose.to.trim();
    const subject = compose.subject.trim();
    const body = compose.bodyText.trim();
    if (!body || (!compose.replyToThreadId && (!to || !subject))) return;
    setSending(true);
    try {
      // The server quotes the message being answered under a reply; only
      // what was typed is sent from here.
      const res = await csrfFetch('/api/admin/inbox', {
        method: 'POST', headers: JSON_HEADERS,
        body: JSON.stringify({
          to, toName: compose.toName.trim() || undefined, subject, bodyText: body, replyToThreadId: compose.replyToThreadId,
        }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Failed to send'));
      const wasReply = compose.replyToThreadId;
      setCompose(EMPTY_COMPOSE);
      toast.success(wasReply ? 'Reply sent' : 'Email sent');
      if (wasReply) {
        applyLocal([wasReply], { status: 'replied', is_unread: false });
        if (selectedId) selectThread(selectedId);
      }
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }, [compose, selectedId, applyLocal, selectThread, fetchThreads]);

  // ── AI draft ──
  const sendAiDraft = useCallback(async (threadId: string, emailId: string) => {
    setSending(true);
    try {
      const res = await csrfFetch(`/api/admin/inbox/${threadId}`, {
        method: 'PATCH', headers: JSON_HEADERS, body: JSON.stringify({ useAiDraft: true, emailId }),
      });
      if (!res.ok) throw new Error(await readError(res, 'Failed to send draft'));
      toast.success('AI draft sent');
      applyLocal([threadId], { status: 'replied', is_unread: false });
      await selectThread(threadId);
      fetchThreads({ silent: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send draft');
    } finally {
      setSending(false);
    }
  }, [selectThread, fetchThreads, applyLocal]);

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
    });
  }, []);

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

  return {
    folder, setFolder, threads, loading, error, search, setSearch, page, setPage, totalPages, total, counts,
    refresh: () => fetchThreads(),
    selectedId, selectedThread, emails, detailLoading, detailError, selectThread, closeDetail,
    toggleStar, markUnread, setSpam, requestDelete, cancelDelete, confirmDelete, pendingDelete,
    selectedIds, toggleSelect, selectAllOnPage, clearSelection, bulk, bulkActing,
    sendAiDraft, editAiDraft,
    autoReplyEnabled, autoReplyLoading, setAutoReply,
    compose, setComposeField, openCompose, closeCompose, discardCompose, sending, handleSend,
    status, statusLoading, refreshStatus: () => fetchStatus(true), sendTest, sendingTest,
    enableReceiving, enablingReceiving,
  };
}

export type AdminInbox = ReturnType<typeof useAdminInbox>;

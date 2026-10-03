'use client';

import {
  ArrowLeft, Reply, Star, Trash2, ShieldAlert, ShieldCheck, MailOpen, Bot, Send, PenLine, Paperclip, ExternalLink, Loader2, Zap, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SandboxedEmail } from '@/components/admin/SandboxedEmail';
import { cn } from '@/lib/utils';
import type { Email, Thread } from './types';
import { AI_CATEGORY_LABELS, STATUS_LABELS, formatBytes, formatFullDate } from './types';

interface EmailDetailViewProps {
  thread: Thread | null;
  emails: Email[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  onBack: () => void;
  onRetry: () => void;
  onReply: () => void;
  onToggleStar: (_id: string) => void;
  onMarkUnread: (_id: string) => void;
  onSetSpam: (_id: string, _isSpam: boolean) => void;
  onDelete: (_id: string) => void;
  onUseAiDraft: (_threadId: string, _emailId: string) => void;
  onEditAiDraft: (_thread: Thread, _email: Email) => void;
}

function Chip({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', tone)}>{children}</span>;
}

function Message({ msg, thread, isLast, sending, onUseAiDraft, onEditAiDraft }: {
  msg: Email;
  thread: Thread;
  isLast: boolean;
  sending: boolean;
  onUseAiDraft: (_threadId: string, _emailId: string) => void;
  onEditAiDraft: (_thread: Thread, _email: Email) => void;
}) {
  const outbound = msg.direction === 'outbound';
  const st = STATUS_LABELS[msg.status];
  const cat = msg.ai_category && !outbound ? AI_CATEGORY_LABELS[msg.ai_category] : null;
  const attachments = msg.attachments ?? [];
  const cc = msg.metadata?.cc ?? [];
  // DMARC fail = the From address is demonstrably not who sent this.
  const auth = (msg.headers as { auth?: { dmarc?: string | null } } | null)?.auth;
  const forged = !outbound && auth?.dmarc === 'fail';
  const hasDraft = !!(msg.ai_draft_html || msg.ai_draft_text);
  const canUseDraft = !outbound && hasDraft && msg.status !== 'replied' && !thread.is_spam;

  return (
    <article className={cn('px-4 py-4 sm:px-5', !isLast && 'border-b')}>
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="mt-0.5 h-9 w-9 shrink-0">
            <AvatarFallback className={cn('text-sm font-bold', outbound ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
              {outbound ? 'A' : (msg.from_name || msg.from_email)[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate text-sm font-semibold">{msg.from_name || msg.from_email}</span>
              {msg.from_name && <span className="truncate text-xs text-muted-foreground">{msg.from_email}</span>}
              {outbound && st && <Chip tone={st.tone}>{st.label}</Chip>}
              {msg.metadata?.auto_sent && <Chip tone="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"><Zap className="mr-1 h-3 w-3" />Auto-sent</Chip>}
              {msg.metadata?.test && <Chip tone="bg-muted text-muted-foreground">Test</Chip>}
              {forged && (
                <span title="This message failed DMARC: the sender address may be forged. Be careful replying or opening links.">
                  <Chip tone="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"><ShieldAlert className="mr-1 h-3 w-3" />Sender not verified</Chip>
                </span>
              )}
              {cat && <Chip tone={cat.tone}>{cat.label}{msg.ai_confidence != null && ` · ${Math.round(msg.ai_confidence * 100)}%`}</Chip>}
              {!outbound && thread.linked_profile_id && (
                <a
                  href={`/admin/users?search=${encodeURIComponent(msg.from_email)}`}
                  className="inline-flex items-center gap-0.5 rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background transition-colors hover:opacity-80"
                >
                  <ExternalLink className="h-3 w-3" /> Platform user
                </a>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              To: {msg.to_name ? `${msg.to_name} <${msg.to_email}>` : msg.to_email}
              {cc.length > 0 && ` · Cc: ${cc.join(', ')}`}
            </p>
          </div>
        </div>
        <time dateTime={msg.created_at} className="shrink-0 text-xs text-muted-foreground">{formatFullDate(msg.created_at)}</time>
      </header>

      {!outbound && msg.ai_summary && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-muted/50 p-2.5 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-muted-foreground"><span className="font-medium text-foreground">Summary.</span> {msg.ai_summary}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border">
        <SandboxedEmail html={msg.html_body} text={msg.text_body} />
      </div>

      {attachments.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {attachments.map((a) => (
            <li key={a.id}>
              <a
                href={`/api/admin/inbox/${thread.id}/attachments/${a.id}?email=${msg.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
              >
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="max-w-[220px] truncate">{a.filename}</span>
                {a.size ? <span className="text-muted-foreground">{formatBytes(a.size)}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      )}

      {canUseDraft && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              <Bot className="h-3.5 w-3.5" /> Suggested reply
            </span>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={() => onEditAiDraft(thread, msg)} disabled={sending}>
                <PenLine className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" onClick={() => onUseAiDraft(thread.id, msg.id)} disabled={sending}>
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {sending ? 'Sending…' : 'Send as is'}
              </Button>
            </div>
          </div>
          {msg.ai_draft_text ? (
            <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-relaxed">{msg.ai_draft_text}</p>
          ) : (
            <div className="rounded-lg bg-background p-2"><SandboxedEmail html={msg.ai_draft_html} /></div>
          )}
        </div>
      )}
    </article>
  );
}

export function EmailDetailView({
  thread, emails, loading, error, sending,
  onBack, onRetry, onReply, onToggleStar, onMarkUnread, onSetSpam, onDelete, onUseAiDraft, onEditAiDraft,
}: EmailDetailViewProps) {
  if (loading && !thread) {
    return <div className="flex flex-1 items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (error && !thread) {
    return (
      <div className="flex-1 p-4">
        <button onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground lg:hidden"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="mb-2">{error}</p>
          <Button size="sm" variant="outline" onClick={onRetry}>Try again</Button>
        </div>
      </div>
    );
  }
  if (!thread) return null;

  const hasInbound = emails.some((e) => e.direction === 'inbound');
  const st = STATUS_LABELS[thread.status];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-3 py-2.5 sm:px-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="lg:hidden" aria-label="Back to list">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">{thread.subject || '(no subject)'}</h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{thread.participant_name ? `${thread.participant_name} · ${thread.participant_email}` : thread.participant_email}</span>
            {hasInbound && st && <Chip tone={st.tone}>{st.label}</Chip>}
            {thread.is_spam && <Chip tone="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Spam</Chip>}
            {emails.length > 1 && <span>{emails.length} messages</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={() => onToggleStar(thread.id)} aria-label={thread.is_starred ? 'Unstar' : 'Star'} aria-pressed={thread.is_starred}>
            <Star className={cn('h-4 w-4', thread.is_starred && 'fill-amber-400 text-amber-400')} />
          </Button>
          {hasInbound && (
            <Button variant="ghost" size="icon-sm" onClick={() => onMarkUnread(thread.id)} aria-label="Mark as unread" title="Mark as unread">
              <MailOpen className="h-4 w-4" />
            </Button>
          )}
          {hasInbound && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSetSpam(thread.id, !thread.is_spam)}
              aria-label={thread.is_spam ? 'Not spam' : 'Mark as spam'}
              title={thread.is_spam ? 'Not spam' : 'Mark as spam'}
            >
              {thread.is_spam ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(thread.id)} aria-label="Delete" title="Delete" className="hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {emails.map((msg, i) => (
          <Message
            key={msg.id}
            msg={msg}
            thread={thread}
            isLast={i === emails.length - 1}
            sending={sending}
            onUseAiDraft={onUseAiDraft}
            onEditAiDraft={onEditAiDraft}
          />
        ))}
        {emails.length === 0 && !loading && (
          <p className="p-6 text-center text-sm text-muted-foreground">No messages in this conversation.</p>
        )}
      </div>

      <div className="border-t px-4 py-3 sm:px-5">
        <Button onClick={onReply} className="w-full sm:w-auto">
          <Reply className="h-4 w-4" /> Reply
        </Button>
      </div>
    </div>
  );
}

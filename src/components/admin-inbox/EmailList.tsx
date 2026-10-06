'use client';

import { Star, Paperclip, Inbox as InboxIcon, MailOpen, Send, ShieldAlert } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { InboxFolder, ThreadListRow } from './types';
import { AI_CATEGORY_LABELS, LEAD_STATUS_TONES, STATUS_LABELS, counterpart, formatListDate } from './types';

interface EmailListProps {
  threads: ThreadListRow[];
  folder: InboxFolder;
  selectedId: string | null;
  onSelect: (_id: string) => void;
  onToggleStar: (_id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (_id: string) => void;
  searching: boolean;
}

const EMPTY_COPY: Record<InboxFolder, { title: string; body: string; icon: typeof InboxIcon }> = {
  inbox: { title: 'Inbox is empty', body: 'Mail sent to the support address shows up here.', icon: InboxIcon },
  unread: { title: 'All caught up', body: 'No unread mail.', icon: MailOpen },
  starred: { title: 'Nothing starred', body: 'Star a conversation to keep it handy.', icon: Star },
  sent: { title: 'Nothing sent yet', body: 'Replies and new emails you send appear here.', icon: Send },
  spam: { title: 'No spam', body: 'Mail flagged as spam lands here instead of the inbox.', icon: ShieldAlert },
};

function Chip({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-none', tone)}>{children}</span>;
}

export function EmailList({ threads, folder, selectedId, onSelect, onToggleStar, selectedIds, onToggleSelect, searching }: EmailListProps) {
  if (threads.length === 0) {
    const copy = searching ? { title: 'No matches', body: 'Try a different search.', icon: InboxIcon } : EMPTY_COPY[folder];
    const Icon = copy.icon;
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <Icon className="mb-3 h-10 w-10 text-muted-foreground/60" />
        <p className="text-sm font-medium">{copy.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{copy.body}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {threads.map((thread) => {
        const active = thread.id === selectedId;
        const checked = selectedIds.has(thread.id);
        const unread = thread.is_unread && !thread.is_spam;
        const who = counterpart(thread);
        const cat = thread.ai_category ? AI_CATEGORY_LABELS[thread.ai_category] : null;
        const st = STATUS_LABELS[thread.status];
        const showStatus = thread.status === 'replied' || thread.status === 'received';
        const sentOnly = thread.outbound_count > 0 && !['received', 'read', 'replied'].includes(thread.status);

        return (
          <li
            key={thread.id}
            className={cn('relative flex items-start gap-3 px-3 py-3 transition-colors', active ? 'bg-primary/5' : 'hover:bg-muted/50')}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggleSelect(thread.id)}
              aria-label={`Select conversation with ${who.name}`}
              className="mt-1.5 shrink-0"
            />

            <button
              type="button"
              onClick={() => onSelect(thread.id)}
              aria-current={active ? 'true' : undefined}
              className="min-w-0 flex-1 text-left"
            >
              <div className="flex items-center gap-2">
                <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', unread ? 'bg-primary' : 'bg-transparent')} aria-hidden="true" />
                <span className={cn('flex-1 truncate text-sm', unread ? 'font-bold' : 'font-medium')}>
                  {sentOnly && <span className="font-normal text-muted-foreground">To: </span>}
                  {who.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatListDate(thread.last_message_at)}</span>
              </div>
              <p className={cn('mt-0.5 truncate pl-4 text-sm', unread ? 'font-semibold' : 'text-foreground/90')}>
                {thread.subject || '(no subject)'}
                {thread.message_count > 1 && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{thread.message_count}</span>}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 pl-4">
                <p className="flex-1 truncate text-xs text-muted-foreground">
                  {thread.last_direction === 'outbound' && <span className="text-muted-foreground/70">You: </span>}
                  {thread.last_preview || ''}
                </p>
                {thread.has_attachments && <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="Has attachments" />}
                {thread.is_test && <Chip tone="bg-muted text-muted-foreground">Test</Chip>}
                {thread.lead_status ? (
                  <Chip tone={LEAD_STATUS_TONES[thread.lead_status] ?? LEAD_STATUS_TONES.new}>
                    {thread.is_lead_alert && thread.lead_status === 'new' ? 'New lead' : `Lead · ${thread.lead_status}`}
                  </Chip>
                ) : thread.is_lead_alert ? (
                  <Chip tone="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Lead</Chip>
                ) : null}
                {cat && <Chip tone={cat.tone}>{cat.label}</Chip>}
                {showStatus && st && <Chip tone={st.tone}>{st.label}</Chip>}
                {thread.linked_profile_id && <Chip tone="bg-foreground text-background">User</Chip>}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onToggleStar(thread.id)}
              aria-label={thread.is_starred ? 'Unstar' : 'Star'}
              aria-pressed={thread.is_starred}
              className="mt-0.5 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-amber-500"
            >
              <Star className={cn('h-4 w-4', thread.is_starred && 'fill-amber-400 text-amber-400')} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

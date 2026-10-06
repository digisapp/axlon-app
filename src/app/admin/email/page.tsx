'use client';

import { useState } from 'react';
import {
  Bot, ChevronLeft, ChevronRight, Info, Inbox as InboxIcon, Loader2, Mail, MailOpen, Plus, RefreshCw, Search,
  ShieldAlert, ShieldCheck, Star, StarOff, Trash2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAdminInbox } from '@/hooks/useAdminInbox';
import { EmailList, EmailDetailView, ComposeDialog, InboxSetupCard, FOLDERS } from '@/components/admin-inbox';

export default function AdminEmailPage() {
  const d = useAdminInbox();
  const [showAutoReplyInfo, setShowAutoReplyInfo] = useState(false);
  const [confirmEnable, setConfirmEnable] = useState(false);

  const selectionCount = d.selectedIds.size;
  const allOnPageSelected = d.threads.length > 0 && selectionCount === d.threads.length;
  const inSpam = d.folder === 'spam';
  const from = d.status?.from ?? 'Axleyard Support <support@axleyard.com>';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Mail className="h-6 w-6" />
            Email inbox
            {d.counts.unread > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">{d.counts.unread} new</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Mail to <span className="font-mono">{d.status?.inboundAddress ?? 'the support address'}</span> lands here; replies go out as {from}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!d.autoReplyLoading && (
            <div className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm',
              d.autoReplyEnabled ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : 'bg-background',
            )}>
              <Bot className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="auto-reply" className="cursor-pointer text-sm">Auto-reply</Label>
              <Switch
                id="auto-reply"
                checked={d.autoReplyEnabled}
                onCheckedChange={(next) => (next ? setConfirmEnable(true) : d.setAutoReply(false))}
                disabled={d.autoReplyLoading}
                aria-label="AI auto-reply"
              />
              <button type="button" onClick={() => setShowAutoReplyInfo(true)} className="rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="About AI auto-reply">
                <Info className="h-4 w-4" />
              </button>
            </div>
          )}
          <Button variant="outline" onClick={d.refresh} disabled={d.loading} aria-label="Refresh">
            <RefreshCw className={cn('h-4 w-4', d.loading && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={() => d.openCompose()}>
            <Plus className="h-4 w-4" /> Compose
          </Button>
        </div>
      </div>

      {d.status && (
        <InboxSetupCard
          status={d.status}
          loading={d.statusLoading}
          onRecheck={d.refreshStatus}
          onSendTest={d.sendTest}
          sendingTest={d.sendingTest}
          onEnableReceiving={d.enableReceiving}
          enablingReceiving={d.enablingReceiving}
        />
      )}

      {/* Folders + search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Folders">
          {FOLDERS.map((f) => {
            const count = f.value === 'unread' ? d.counts.unread : f.value === 'starred' ? d.counts.starred : f.value === 'spam' ? d.counts.spam : 0;
            const active = d.folder === f.value;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => d.setFolder(f.value)}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {f.label}
                {count > 0 && (
                  <span className={cn('rounded-full px-1.5 text-[11px] font-semibold tabular-nums', active ? 'bg-primary-foreground/20' : 'bg-muted')}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={d.search}
            onChange={(e) => d.setSearch(e.target.value)}
            placeholder="Search subject, sender, text…"
            aria-label="Search emails"
            className="pl-9"
          />
        </div>
      </div>

      {d.error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span>{d.error}</span>
          <Button size="sm" variant="outline" onClick={d.refresh}>Retry</Button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="flex lg:h-[calc(100vh-21rem)] lg:min-h-[520px]">
          {/* List pane */}
          <div className={cn('w-full shrink-0 lg:w-[400px] lg:overflow-y-auto lg:border-r', d.selectedId ? 'hidden lg:block' : '')}>
            <div className="sticky top-0 z-10 flex min-h-[44px] items-center gap-2 border-b bg-background px-3 py-1.5 text-xs">
              <Checkbox
                checked={allOnPageSelected}
                onCheckedChange={d.selectAllOnPage}
                disabled={d.threads.length === 0}
                aria-label="Select all on this page"
              />
              {selectionCount > 0 ? (
                <div className="flex flex-1 flex-wrap items-center gap-1">
                  <span className="mr-1 font-medium tabular-nums">{selectionCount} selected</span>
                  {!inSpam && d.folder !== 'sent' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => d.bulk('markRead')} disabled={d.bulkActing}><MailOpen className="h-3.5 w-3.5" /> Read</Button>
                      <Button size="sm" variant="ghost" onClick={() => d.bulk('markUnread')} disabled={d.bulkActing}><Mail className="h-3.5 w-3.5" /> Unread</Button>
                    </>
                  )}
                  {d.folder === 'starred'
                    ? <Button size="sm" variant="ghost" onClick={() => d.bulk('unstar')} disabled={d.bulkActing}><StarOff className="h-3.5 w-3.5" /> Unstar</Button>
                    : <Button size="sm" variant="ghost" onClick={() => d.bulk('star')} disabled={d.bulkActing}><Star className="h-3.5 w-3.5" /> Star</Button>}
                  {d.folder !== 'sent' && (inSpam
                    ? <Button size="sm" variant="ghost" onClick={() => d.bulk('notSpam')} disabled={d.bulkActing}><ShieldCheck className="h-3.5 w-3.5" /> Not spam</Button>
                    : <Button size="sm" variant="ghost" onClick={() => d.bulk('spam')} disabled={d.bulkActing}><ShieldAlert className="h-3.5 w-3.5" /> Spam</Button>)}
                  <Button size="sm" variant="ghost" onClick={() => d.bulk('delete')} disabled={d.bulkActing} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  <button type="button" onClick={d.clearSelection} className="ml-auto rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Clear selection"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <span className="tabular-nums text-muted-foreground">
                  {d.loading ? 'Loading…' : `${d.total.toLocaleString()} ${d.total === 1 ? 'conversation' : 'conversations'}`}
                </span>
              )}
            </div>

            {d.loading && d.threads.length === 0 ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <>
                <EmailList
                  threads={d.threads}
                  folder={d.folder}
                  selectedId={d.selectedId}
                  onSelect={d.selectThread}
                  onToggleStar={d.toggleStar}
                  selectedIds={d.selectedIds}
                  onToggleSelect={d.toggleSelect}
                  searching={!!d.search.trim()}
                />
                {d.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t px-3 py-2">
                    <Button size="icon-sm" variant="ghost" onClick={() => d.setPage(Math.max(1, d.page - 1))} disabled={d.page <= 1} aria-label="Previous page">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs tabular-nums text-muted-foreground">Page {d.page} of {d.totalPages}</span>
                    <Button size="icon-sm" variant="ghost" onClick={() => d.setPage(Math.min(d.totalPages, d.page + 1))} disabled={d.page >= d.totalPages} aria-label="Next page">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Detail pane */}
          <div className={cn('min-w-0 flex-1', d.selectedId ? 'flex' : 'hidden lg:flex')}>
            {d.selectedId ? (
              <EmailDetailView
                thread={d.selectedThread}
                emails={d.emails}
                loading={d.detailLoading}
                error={d.detailError}
                sending={d.sending}
                onBack={d.closeDetail}
                onRetry={() => d.selectedId && d.selectThread(d.selectedId)}
                onReply={() => d.openCompose(d.selectedThread, d.emails)}
                onToggleStar={d.toggleStar}
                onMarkUnread={d.markUnread}
                onSetSpam={d.setSpam}
                onDelete={(id) => d.requestDelete([id])}
                onUseAiDraft={d.sendAiDraft}
                onEditAiDraft={d.editAiDraft}
                lead={d.lead}
                leadSaving={d.leadSaving}
                onSetLeadStatus={d.setLeadStatus}
                redrafting={d.redrafting}
                onRegenerateDraft={d.regenerateDraft}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <InboxIcon className="mb-3 h-10 w-10 opacity-60" />
                <p className="text-sm font-medium text-foreground">Pick a conversation to read it</p>
                <p className="mt-1 text-xs">The whole thread shows on the right.</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <ComposeDialog
        compose={d.compose}
        from={from}
        sending={d.sending}
        onField={d.setComposeField}
        onSend={d.handleSend}
        onClose={d.closeCompose}
        onDiscard={d.discardCompose}
        onAddFiles={d.addAttachments}
        onRemoveFile={d.removeAttachment}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!d.pendingDelete} onOpenChange={(open) => { if (!open) d.cancelDelete(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {d.pendingDelete && d.pendingDelete.length > 1 ? `Delete ${d.pendingDelete.length} conversations?` : 'Delete this conversation?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              It is removed from this inbox for good, along with every message in it. The copy in the other person&apos;s mailbox is not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={d.bulkActing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); d.confirmDelete(); }}
              disabled={d.bulkActing}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {d.bulkActing && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enable auto-reply confirmation */}
      <AlertDialog open={confirmEnable} onOpenChange={setConfirmEnable}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Turn on AI auto-reply?</AlertDialogTitle>
            <AlertDialogDescription>
              Incoming mail the AI is at least 85% sure is a routine buying, selling, financing, trade-in, transport, parts, appraisal,
              dealer-onboarding or general question gets an AI-written reply sent automatically as {from}. Everything else still waits for you.
              You can turn this off at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { await d.setAutoReply(true); setConfirmEnable(false); }}>Turn it on</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auto-reply info */}
      <Dialog open={showAutoReplyInfo} onOpenChange={setShowAutoReplyInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About AI auto-reply</DialogTitle>
            <DialogDescription>
              Every incoming email is read by the AI, which writes a one-line summary and a suggested reply you can send or edit.
              With Auto-reply off (the default), nothing is sent without you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="mb-1 font-semibold">With auto-reply on, the AI answers by itself for:</p>
              <ul className="ml-4 list-disc space-y-0.5 marker:text-green-600">
                <li>Buying and selling inquiries</li>
                <li>Financing and trade-in questions</li>
                <li>Transport, parts and appraisal requests</li>
                <li>Dealer onboarding and general questions</li>
              </ul>
              <p className="mt-1.5 text-xs text-muted-foreground">Only when it is at least 85% confident, never twice in 24 hours on one conversation, and never to automated senders.</p>
            </div>
            <div>
              <p className="mb-1 font-semibold">Always waits for you:</p>
              <ul className="ml-4 list-disc space-y-0.5 marker:text-amber-500">
                <li>Support and account problems</li>
                <li>Partnerships and personal messages</li>
                <li>Feedback, spam and anything unclear</li>
              </ul>
            </div>
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Auto-replies are real emails to real people, sent as {from}.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ComposeState } from '@/hooks/useAdminInbox';
import { ATTACHMENT_ACCEPT, MAX_ATTACHMENTS, base64Bytes } from '@/lib/email/compose';
import { formatBytes } from './types';

interface ComposeDialogProps {
  compose: ComposeState;
  from: string;
  sending: boolean;
  onField: (_field: 'to' | 'toName' | 'subject' | 'bodyText', _value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onDiscard: () => void;
  onAddFiles: (_files: FileList) => void;
  onRemoveFile: (_index: number) => void;
}

export function ComposeDialog({ compose, from, sending, onField, onSend, onClose, onDiscard, onAddFiles, onRemoveFile }: ComposeDialogProps) {
  const [showQuoted, setShowQuoted] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isReply = !!compose.replyToThreadId;
  // Whitespace doesn't count: an extra Enter is not a message.
  const squash = (v: string | undefined) => (v ?? '').replace(/\s+/g, ' ').trim();
  const typed = !!squash(compose.bodyText) && squash(compose.bodyText) !== squash(compose.scaffold);
  const canSend = typed && (isReply || !!(compose.to.trim() && compose.subject.trim())) && !sending;

  // A reply opens as "Hi <name>, … Best, The Axleyard Team": put the caret
  // on the empty line between, ready to type.
  useEffect(() => {
    if (!compose.open || compose.caret == null) return;
    const frame = requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(compose.caret!, compose.caret!);
    });
    return () => cancelAnimationFrame(frame);
  }, [compose.open, compose.caret, compose.replyToThreadId]);

  return (
    <Dialog open={compose.open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{isReply ? 'Reply' : 'New email'}</DialogTitle>
          <DialogDescription>
            From <span className="font-medium text-foreground">{from}</span>. Replies come back to this inbox.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (canSend) onSend(); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="compose-to">To</Label>
              <Input
                id="compose-to"
                type="email"
                autoComplete="off"
                value={compose.to}
                onChange={(e) => onField('to', e.target.value)}
                placeholder="name@example.com"
                readOnly={isReply}
                className={isReply ? 'bg-muted text-muted-foreground' : ''}
                required={!isReply}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compose-to-name">Name <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="compose-to-name"
                value={compose.toName}
                onChange={(e) => onField('toName', e.target.value)}
                placeholder="Jane Doe"
                readOnly={isReply}
                className={isReply ? 'bg-muted text-muted-foreground' : ''}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compose-subject">Subject</Label>
            <Input
              id="compose-subject"
              value={compose.subject}
              onChange={(e) => onField('subject', e.target.value)}
              placeholder="Subject"
              maxLength={200}
              required={!isReply}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compose-body">Message</Label>
            <Textarea
              ref={bodyRef}
              id="compose-body"
              value={compose.bodyText}
              onChange={(e) => onField('bodyText', e.target.value)}
              placeholder="Write your message…"
              rows={10}
              autoFocus={isReply}
              className="min-h-[160px] resize-y leading-relaxed"
            />
            {isReply && !typed && (
              <p className="text-xs text-muted-foreground">Write your message between the greeting and the sign-off.</p>
            )}
          </div>

          <div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept={ATTACHMENT_ACCEPT}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) onAddFiles(e.target.files);
                e.target.value = '';
              }}
            />
            {compose.attachments.length > 0 && (
              <ul className="mb-2 flex flex-wrap gap-2">
                {compose.attachments.map((a, i) => (
                  <li key={`${a.filename}-${i}`} className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/40 py-1 pl-2.5 pr-1 text-xs">
                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="max-w-[200px] truncate">{a.filename}</span>
                    <span className="text-muted-foreground">{formatBytes(base64Bytes(a.content))}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(i)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:h-7 sm:w-7"
                      aria-label={`Remove ${a.filename}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={compose.attachments.length >= MAX_ATTACHMENTS}
            >
              <Paperclip className="h-3.5 w-3.5" /> Attach files
            </Button>
            <span className="mt-1.5 block text-xs text-muted-foreground sm:ml-2 sm:mt-0 sm:inline">PDFs, photos, Office files · up to {MAX_ATTACHMENTS} files, 3 MB</span>
          </div>

          {compose.quotedText && (
            <div>
              <button
                type="button"
                onClick={() => setShowQuoted((v) => !v)}
                className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {showQuoted ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showQuoted ? 'Hide' : 'Show'} quoted message
              </button>
              {showQuoted && (
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-muted/40 px-3 py-2 font-sans text-xs leading-relaxed text-muted-foreground">
                  {compose.quotedText}
                </pre>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={onDiscard}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              <X className="h-4 w-4" /> Discard
            </button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Close</Button>
              <Button type="submit" disabled={!canSend}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

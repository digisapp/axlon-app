'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ComposeState } from '@/hooks/useAdminInbox';

interface ComposeDialogProps {
  compose: ComposeState;
  from: string;
  sending: boolean;
  onField: (_field: 'to' | 'toName' | 'subject' | 'bodyText', _value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onDiscard: () => void;
}

export function ComposeDialog({ compose, from, sending, onField, onSend, onClose, onDiscard }: ComposeDialogProps) {
  const [showQuoted, setShowQuoted] = useState(false);
  const isReply = !!compose.replyToThreadId;
  const canSend = !!compose.bodyText.trim() && (isReply || !!(compose.to.trim() && compose.subject.trim())) && !sending;

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
              id="compose-body"
              value={compose.bodyText}
              onChange={(e) => onField('bodyText', e.target.value)}
              placeholder="Write your message…"
              rows={10}
              autoFocus={isReply}
              className="min-h-[160px] resize-y leading-relaxed"
            />
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

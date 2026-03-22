'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Inbox,
  Send,
  Search,
  Mail,
  MailOpen,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Circle,
  ArrowLeft,
  Reply,
  Clock,
  CheckCheck,
  AlertCircle,
  Trash2,
  Sparkles,
  Bot,
  Zap,
  Eye,
  Pencil,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SandboxedEmail } from '@/components/admin/SandboxedEmail';

// ─── Types ──────────────────────────────────────────────

interface EmailThread {
  id: string;
  subject: string;
  participant_email: string;
  participant_name: string | null;
  last_message_at: string;
  message_count: number;
  is_unread: boolean;
  status: string;
  created_at: string;
}

interface EmailRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  from_email: string;
  from_name: string | null;
  to_email: string;
  to_name: string | null;
  subject: string;
  html_body: string | null;
  text_body: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
  ai_category: string | null;
  ai_confidence: number | null;
  ai_summary: string | null;
  ai_draft_html: string | null;
  ai_draft_text: string | null;
  ai_processed_at: string | null;
  metadata: Record<string, unknown> | null;
  replied_at: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Helpers ────────────────────────────────────────────

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'delivered': case 'opened': case 'clicked':
      return <CheckCheck className="w-3.5 h-3.5 text-green-500" />;
    case 'sent':
      return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
    case 'bounced': case 'failed':
      return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function CategoryBadge({ category, confidence }: { category: string | null; confidence: number | null }) {
  if (!category) return null;
  const colors: Record<string, string> = {
    purchase_inquiry: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    selling_inquiry: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    financing_question: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    trade_in_request: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    dealer_onboarding: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    spam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 line-through',
    auto_reply: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  const colorClass = colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  const label = category.replace(/_/g, ' ');
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
      {confidence !== null && <span className="opacity-60">{Math.round(confidence * 100)}%</span>}
    </span>
  );
}

// ─── Page Component ─────────────────────────────────────

export default function AdminEmailPage() {
  // Thread list
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 30, total: 0, totalPages: 0 });

  // Thread detail
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [threadEmails, setThreadEmails] = useState<EmailRecord[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [showReply, setShowReply] = useState(false);

  // Compose
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeSending, setComposeSending] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Auto-reply toggle
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyLoading, setAutoReplyLoading] = useState(false);

  // ─── Settings ─────────────────────────────────────

  useEffect(() => {
    fetch('/api/admin/settings?key=ai_auto_reply_enabled')
      .then(r => r.json())
      .then(d => setAutoReplyEnabled(d.value === true || d.value === 'true'))
      .catch(() => {});
  }, []);

  const toggleAutoReply = async (enabled: boolean) => {
    setAutoReplyLoading(true);
    setAutoReplyEnabled(enabled);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'ai_auto_reply_enabled', value: enabled }),
    });
    setAutoReplyLoading(false);
  };

  // ─── Data Fetching ────────────────────────────────

  const fetchThreads = useCallback(async (page = 1, search = searchQuery) => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      status: activeTab === 'inbox' ? 'received' : 'open',
      ...(search && { search }),
    });
    const response = await fetch(`/api/emails?${params}`);
    if (response.ok) {
      const result = await response.json();
      setThreads(result.data || []);
      setPagination(result.pagination);
    }
    setIsLoading(false);
  }, [activeTab, searchQuery]);

  useEffect(() => { fetchThreads(1, searchQuery); }, [activeTab]); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => fetchThreads(1, searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]); // eslint-disable-line

  // Real-time
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('admin-emails')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'email_threads' }, () => {
        fetchThreads(pagination.page, searchQuery);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [pagination.page, searchQuery, fetchThreads]);

  // ─── Thread Detail ────────────────────────────────

  const openThread = async (thread: EmailThread) => {
    setSelectedThread(thread);
    setLoadingThread(true);
    setShowReply(false);
    setReplyText('');
    const response = await fetch(`/api/emails/${thread.id}`);
    if (response.ok) {
      const { data } = await response.json();
      setThreadEmails(data.emails);
      fetchThreads(pagination.page, searchQuery);
    }
    setLoadingThread(false);
  };

  // ─── Reply ────────────────────────────────────────

  const handleReply = async (htmlOverride?: string) => {
    const content = htmlOverride || replyText.trim();
    if (!content || !selectedThread) return;
    setSending(true);

    const isRawHtml = !!htmlOverride;
    const html = isRawHtml ? content : `<p>${content.replace(/\n/g, '<br/>')}</p>`;

    const response = await fetch(`/api/emails/${selectedThread.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    });

    if (response.ok) {
      setReplyText('');
      setShowReply(false);
      const refreshRes = await fetch(`/api/emails/${selectedThread.id}`);
      if (refreshRes.ok) {
        const { data } = await refreshRes.json();
        setThreadEmails(data.emails);
      }
    }
    setSending(false);
  };

  // ─── Compose ──────────────────────────────────────

  const handleCompose = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComposeSending(true);
    const fd = new FormData(e.currentTarget);
    const response = await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: fd.get('to'),
        toName: fd.get('toName'),
        subject: fd.get('subject'),
        html: `<p>${(fd.get('body') as string).replace(/\n/g, '<br/>')}</p>`,
      }),
    });
    if (response.ok) {
      setComposeOpen(false);
      setActiveTab('sent');
      fetchThreads(1, searchQuery);
    }
    setComposeSending(false);
  };

  // ─── Bulk Actions ─────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === threads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(threads.map(t => t.id)));
    }
  };

  const bulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    const threadIds = Array.from(selectedIds);

    if (action === 'delete') {
      await fetch('/api/emails', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadIds }),
      });
    } else {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadIds, action }),
      });
    }

    setSelectedIds(new Set());
    fetchThreads(pagination.page, searchQuery);
  };

  const deleteThread = async (threadId: string) => {
    await fetch('/api/emails', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadIds: [threadId] }),
    });
    setSelectedThread(null);
    fetchThreads(pagination.page, searchQuery);
  };

  // ─── Keyboard Shortcuts ───────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedThread) {
        setSelectedThread(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedThread]);

  // ─── Derived ──────────────────────────────────────

  const unreadCount = threads.filter(t => t.is_unread).length;

  // ═══════════════════════════════════════════════════════
  // THREAD DETAIL VIEW
  // ═══════════════════════════════════════════════════════

  if (selectedThread) {
    const lastInbound = [...threadEmails].reverse().find(e => e.direction === 'inbound');

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedThread(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold truncate">{selectedThread.subject}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedThread.participant_name || selectedThread.participant_email}
              {selectedThread.participant_name && (
                <span className="ml-1 text-xs">({selectedThread.participant_email})</span>
              )}
              {' '}&middot; {selectedThread.message_count} email{selectedThread.message_count !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowReply(true)}>
              <Reply className="w-4 h-4 mr-2" /> Reply
            </Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteThread(selectedThread.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loadingThread ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {threadEmails.map((email) => (
                <Card key={email.id} className={email.direction === 'outbound' ? 'border-blue-200 dark:border-blue-800' : ''}>
                  <CardHeader className="pb-2 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className={`text-xs ${email.direction === 'outbound' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            {(email.from_name || email.from_email)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm truncate">
                              {email.from_name || email.from_email}
                            </span>
                            {email.direction === 'outbound' && (
                              <Badge variant="secondary" className="text-xs shrink-0">You</Badge>
                            )}
                            {!!(email.metadata as Record<string, unknown>)?.auto_sent && (
                              <Badge variant="outline" className="text-xs shrink-0 gap-1">
                                <Zap className="w-3 h-3" /> Auto-sent
                              </Badge>
                            )}
                            {email.ai_category && email.direction === 'inbound' && (
                              <CategoryBadge category={email.ai_category} confidence={email.ai_confidence} />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            To: {email.to_name || email.to_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        {email.direction === 'outbound' && <StatusIcon status={email.status} />}
                        <span>{formatDateTime(email.created_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* AI Summary */}
                    {email.ai_summary && email.direction === 'inbound' && (
                      <div className="flex items-start gap-2 mb-3 p-2 rounded bg-muted/50">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{email.ai_summary}</p>
                      </div>
                    )}

                    <SandboxedEmail html={email.html_body} text={email.text_body} />

                    {/* AI Draft Section */}
                    {email.ai_draft_html && email.direction === 'inbound' && !email.replied_at && (
                      <div className="mt-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">AI Draft Reply</span>
                          {email.ai_confidence && (
                            <span className="text-xs text-amber-600">{Math.round(email.ai_confidence * 100)}% confidence</span>
                          )}
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded p-3 mb-3 text-sm">
                          <SandboxedEmail html={email.ai_draft_html} />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(email.ai_draft_html!)}
                            disabled={sending}
                          >
                            <Send className="w-3.5 h-3.5 mr-1.5" /> Use Draft
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyText(email.ai_draft_text || email.ai_draft_html?.replace(/<[^>]+>/g, '') || '');
                              setShowReply(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Draft
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {/* just ignore */}}>
                            <X className="w-3.5 h-3.5 mr-1.5" /> Ignore
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reply box */}
            {showReply ? (
              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Replying to <strong>{selectedThread.participant_name || selectedThread.participant_email}</strong>
                    </p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Write your reply..."
                      autoFocus
                    />
                    {/* Quoted preview */}
                    {lastInbound && (() => {
                      const preview = lastInbound.text_body || lastInbound.html_body?.replace(/<[^>]+>/g, '') || '';
                      return (
                        <div className="border-l-2 border-muted-foreground/30 pl-3 text-xs text-muted-foreground max-h-24 overflow-hidden">
                          <p className="mb-1">On {formatDateTime(lastInbound.created_at)}, {lastInbound.from_name || lastInbound.from_email} wrote:</p>
                          <p className="line-clamp-3">{preview.slice(0, 300)}</p>
                        </div>
                      );
                    })()}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowReply(false)}>Cancel</Button>
                      <Button size="sm" disabled={sending || !replyText.trim()} onClick={() => handleReply()}>
                        {sending
                          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                          : <><Send className="w-4 h-4 mr-2" /> Send Reply</>
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setShowReply(true)}>
                <Reply className="w-4 h-4 mr-2" /> Reply to this thread
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // THREAD LIST VIEW
  // ═══════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Email
            {unreadCount > 0 && activeTab === 'inbox' && (
              <Badge variant="destructive" className="ml-2">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Send and receive emails — all conversations in one place
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-reply toggle */}
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="auto-reply" className="text-sm text-muted-foreground cursor-pointer">
              AI Auto-Reply
            </Label>
            <Switch
              id="auto-reply"
              checked={autoReplyEnabled}
              onCheckedChange={toggleAutoReply}
              disabled={autoReplyLoading}
            />
          </div>

          <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Compose</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Email</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCompose} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">To (email)</Label>
                    <Input id="to" name="to" type="email" placeholder="recipient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toName">Name (optional)</Label>
                    <Input id="toName" name="toName" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Email subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <textarea
                    id="body" name="body" rows={8}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Write your message..." required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={composeSending}>
                    {composeSending
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                      : <><Send className="w-4 h-4 mr-2" /> Send</>
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'inbox' | 'sent'); setSelectedIds(new Set()); }}>
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2"><Inbox className="w-4 h-4" /> Inbox</TabsTrigger>
            <TabsTrigger value="sent" className="gap-2"><Send className="w-4 h-4" /> Sent</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => bulkAction('mark_read')}>
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Mark Read
            </Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={() => bulkAction('delete')}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Thread List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : threads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            {activeTab === 'inbox'
              ? <MailOpen className="w-12 h-12 text-muted-foreground mb-4" />
              : <Send className="w-12 h-12 text-muted-foreground mb-4" />
            }
            <h3 className="text-lg font-medium mb-1">
              {searchQuery ? 'No emails match your search' : activeTab === 'inbox' ? 'No inbound emails yet' : 'No sent emails yet'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'inbox' && !searchQuery && 'When someone replies to your emails, they\'ll appear here.'}
              {activeTab === 'sent' && !searchQuery && 'Compose an email to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y">
            {/* Select all header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 text-xs text-muted-foreground">
              <Checkbox
                checked={selectedIds.size === threads.length && threads.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span>Select all</span>
            </div>

            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
                  thread.is_unread && activeTab === 'inbox' ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                <Checkbox
                  checked={selectedIds.has(thread.id)}
                  onCheckedChange={() => toggleSelect(thread.id)}
                  onClick={(e) => e.stopPropagation()}
                />

                {activeTab === 'inbox' && (
                  <div className="shrink-0 w-3">
                    {thread.is_unread && <Circle className="w-2.5 h-2.5 fill-blue-500 text-blue-500" />}
                  </div>
                )}

                <button
                  onClick={() => openThread(thread)}
                  className="flex-1 flex items-center gap-4 min-w-0 text-left"
                >
                  <div className="shrink-0 w-40 truncate">
                    <span className={`text-sm ${thread.is_unread && activeTab === 'inbox' ? 'font-semibold' : ''}`}>
                      {thread.participant_name || thread.participant_email}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 truncate">
                    <span className={`text-sm ${thread.is_unread && activeTab === 'inbox' ? 'font-semibold' : ''}`}>
                      {thread.subject}
                    </span>
                  </div>
                  {thread.message_count > 1 && (
                    <Badge variant="secondary" className="shrink-0 text-xs">{thread.message_count}</Badge>
                  )}
                  <span className="shrink-0 text-xs text-muted-foreground w-20 text-right">
                    {formatTime(thread.last_message_at)}
                  </span>
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => fetchThreads(pagination.page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchThreads(pagination.page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  X,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Clock,
  Zap,
  Loader2,
  RefreshCw,
  AlertCircle,
  Send,
  Inbox,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

type InboxItem = {
  id: string;
  channel: string;
  from_name: string;
  from_email: string | null;
  from_phone: string | null;
  inquiry_text: string;
  ai_subject: string;
  ai_draft: string;
  ai_draft_html: string;
  confidence: number;
  confidence_reasons: string[];
  status: string;
  edited_subject: string | null;
  edited_draft: string | null;
  feedback: string | null;
  sent_at: string | null;
  created_at: string;
  lead?: { buyer_name: string; priority: string; score: number } | null;
};

type Summary = Record<string, number>;

const STATUS_TABS = [
  { key: 'pending', label: 'Pending Review', icon: Clock },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'rejected', label: 'Rejected', icon: X },
  { key: 'all', label: 'All', icon: Inbox },
];

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    pct >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200';
  const label = pct >= 80 ? 'High confidence' : pct >= 60 ? 'Medium confidence' : 'Low confidence';
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>
      <Bot className="w-3 h-3" />
      {pct}% — {label}
    </span>
  );
}

export default function AIInboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selected, setSelected] = useState<InboxItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editDraft, setEditDraft] = useState('');
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await csrfFetch(`/api/dashboard/ai-inbox?status=${activeTab}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      logger.error('Failed to load AI inbox', { err });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (selected) {
      setEditSubject(selected.ai_subject);
      setEditDraft(selected.ai_draft);
      setEditMode(false);
    }
  }, [selected]);

  async function act(action: 'approve' | 'reject' | 'edit', item: InboxItem) {
    setActing(true);
    try {
      const body: Record<string, unknown> = { action };
      if (action === 'edit') {
        body.edited_subject = editSubject;
        body.edited_draft = editDraft;
      }
      const res = await csrfFetch(`/api/dashboard/ai-inbox?id=${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSelected(null);
        setEditMode(false);
        await load();
      }
    } catch (err) {
      logger.error('Action failed', { err });
    } finally {
      setActing(false);
    }
  }

  async function sendFeedback(item: InboxItem, feedback: 'positive' | 'negative') {
    await csrfFetch(`/api/dashboard/ai-inbox?id=${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'feedback', feedback }),
    });
    await load();
  }

  const pendingCount = summary['pending'] || 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Inbox
                {pendingCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">AI-drafted replies awaiting your review</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={load} className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6 w-fit">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelected(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.key !== 'all' && summary[tab.key] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/20'
                }`}>
                  {summary[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="font-medium text-muted-foreground">
              {activeTab === 'pending' ? 'No pending replies — you\'re all caught up.' : `No ${activeTab} items.`}
            </p>
            {activeTab === 'pending' && (
              <p className="text-sm text-muted-foreground mt-1">
                When leads come in, AI drafts responses here for your review.
              </p>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 ${selected ? 'lg:grid-cols-[1fr_500px]' : ''}`}>

            {/* List */}
            <div className="space-y-2">
              {items.map(item => {
                const isSelected = selected?.id === item.id;
                const isSent = item.status === 'sent' || item.status === 'approved' || item.status === 'edited';
                const isRejected = item.status === 'rejected';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelected(isSelected ? null : item)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'bg-background hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-sm">{item.from_name}</span>
                          {item.from_email && (
                            <span className="text-xs text-muted-foreground">{item.from_email}</span>
                          )}
                          <ConfidenceBadge score={item.confidence} />
                          {isSent && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Sent
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              Rejected
                            </span>
                          )}
                          {item.status === 'pending' && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Needs review
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1 truncate">
                          Re: {item.ai_subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.inquiry_text}
                        </p>
                      </div>
                      <div className="text-right shrink-0 text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <br />
                        {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Quick actions for pending items in list view */}
                    {item.status === 'pending' && !isSelected && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={e => { e.stopPropagation(); act('approve', item); }}
                          disabled={acting}
                        >
                          <CheckCircle className="w-3 h-3" /> Approve & Send
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={e => { e.stopPropagation(); setSelected(item); setEditMode(true); }}
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1 text-muted-foreground"
                          onClick={e => { e.stopPropagation(); act('reject', item); }}
                          disabled={acting}
                        >
                          <X className="w-3 h-3" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="bg-background border rounded-xl p-5 h-fit lg:sticky lg:top-24 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">AI Draft</h3>
                  <button onClick={() => { setSelected(null); setEditMode(false); }} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Inquiry */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Their inquiry</p>
                  <p className="text-sm leading-relaxed">{selected.inquiry_text}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {selected.from_email && (
                      <a href={`mailto:${selected.from_email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" />{selected.from_email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Confidence breakdown */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ConfidenceBadge score={selected.confidence} />
                    {selected.confidence < 0.80 && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Review before sending
                      </span>
                    )}
                    {selected.confidence >= 0.80 && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Would auto-send
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {(selected.confidence_reasons || []).map((r, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">·</span>{r}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Draft */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Draft</p>
                    {selected.status === 'pending' && (
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        {editMode ? 'Cancel edit' : 'Edit'}
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
                        <Input
                          value={editSubject}
                          onChange={e => setEditSubject(e.target.value)}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Body</label>
                        <Textarea
                          value={editDraft}
                          onChange={e => setEditDraft(e.target.value)}
                          rows={10}
                          className="text-sm font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Subject:</span> {selected.edited_subject || selected.ai_subject}
                      </p>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-2 mt-2">
                        {selected.edited_draft || selected.ai_draft}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selected.status === 'pending' && (
                  <div className="space-y-2 pt-1">
                    {editMode ? (
                      <Button
                        className="w-full gap-2"
                        onClick={() => act('edit', selected)}
                        disabled={acting}
                      >
                        {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Save Edits & Send
                      </Button>
                    ) : (
                      <Button
                        className="w-full gap-2"
                        onClick={() => act('approve', selected)}
                        disabled={acting}
                      >
                        {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve & Send
                      </Button>
                    )}
                    {!editMode && (
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-muted-foreground"
                        onClick={() => act('reject', selected)}
                        disabled={acting}
                      >
                        <X className="w-4 h-4" /> Reject — don't send
                      </Button>
                    )}
                  </div>
                )}

                {/* Feedback for sent items */}
                {(selected.status === 'sent' || selected.status === 'approved' || selected.status === 'edited') && !selected.feedback && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Was this response good?</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1 flex-1 h-8" onClick={() => sendFeedback(selected, 'positive')}>
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> Yes
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 flex-1 h-8" onClick={() => sendFeedback(selected, 'negative')}>
                        <ThumbsDown className="w-3.5 h-3.5 text-red-500" /> No
                      </Button>
                    </div>
                  </div>
                )}

                {selected.feedback && (
                  <div className="pt-2 border-t flex items-center gap-2 text-xs text-muted-foreground">
                    {selected.feedback === 'positive'
                      ? <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                      : <ThumbsDown className="w-3.5 h-3.5 text-red-500" />}
                    Feedback recorded — helps improve future drafts
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

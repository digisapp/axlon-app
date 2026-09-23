'use client';

import { useEffect, useRef, useState } from 'react';
import { csrfFetch } from '@/lib/csrf-fetch';
import { getSessionId, readAttribution } from '@/lib/microsites/attribution';
import { CheckCircle2, Loader2, MessageCircle, Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  micrositeId: string;
  siteName: string;
}

const GREETING =
  "Hi — tell me what you're hauling and roughly how heavy it is, and I'll point you to the trailers that fit.";

const STARTERS = ['Which trailer for a 40-ton excavator?', "What's in stock right now?", 'I need a quote'];

// Ask for details once the visitor has said enough for a specialist to act on.
const OFFER_CONTACT_AFTER = 2;

// /api/microsites/lead caps `message` at 2000 characters. The end of a chat is
// where the buyer states what they want, so that's the part to keep.
const TRANSCRIPT_BUDGET = 1900;

function transcript(messages: Message[]): string {
  const text = messages
    .map((m) => `${m.role === 'user' ? 'Buyer' : 'Assistant'}: ${m.content}`)
    .join('\n');
  const body = text.length > TRANSCRIPT_BUDGET ? `…${text.slice(-TRANSCRIPT_BUDGET)}` : text;
  return `[AI chat]\n${body}`;
}

/** The catalog slug when the visitor is on a model page (the browser path is /trailers/<slug>). */
function currentProductSlug(): string | null {
  const match = window.location.pathname.match(/^\/trailers\/([a-z0-9-]+)\/?$/);
  return match ? match[1] : null;
}

export function MicrositeChat({ micrositeId, siteName }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [contact, setContact] = useState<'hidden' | 'shown' | 'dismissed' | 'sending' | 'sent'>('hidden');
  const [contactError, setContactError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, contact, sending]);

  const userTurns = messages.filter((m) => m.role === 'user').length;
  useEffect(() => {
    if (contact === 'hidden' && userTurns >= OFFER_CONTACT_AFTER) setContact('shown');
  }, [userTurns, contact]);

  async function send(text: string) {
    const content = text.trim().slice(0, 1000);
    if (!content || sending) return;

    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setSending(true);

    try {
      const res = await csrfFetch('/api/microsites/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          microsite_id: micrositeId,
          product_slug: currentProductSlug(),
          // The server keeps no history; the greeting is display-only.
          messages: next.slice(-20),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't answer that just now. Leave your details below and a specialist will get back to you.",
        },
      ]);
      if (contact === 'hidden') setContact('shown');
    } finally {
      setSending(false);
    }
  }

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (contact === 'sending') return;
    const data = new FormData(e.currentTarget);

    // Same honeypot as the page form: invisible to people, filled by bots.
    if ((data.get('company_website') as string)?.trim()) {
      setContact('sent');
      return;
    }

    setContact('sending');
    setContactError(null);
    try {
      const res = await csrfFetch('/api/microsites/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          microsite_id: micrositeId,
          buyer_name: (data.get('buyer_name') as string)?.trim(),
          buyer_email: (data.get('buyer_email') as string)?.trim(),
          buyer_phone: (data.get('buyer_phone') as string)?.trim() || null,
          message: transcript(messages),
          product_interest: currentProductSlug(),
          landing_path: window.location.pathname,
          referrer: document.referrer || null,
          session_id: getSessionId(),
          ...readAttribution(window.location.search, document.referrer),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong. Please try again.');
      }
      setContact('sent');
    } catch (err) {
      setContact('shown');
      setContactError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Chat with ${siteName}`}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:brightness-110 sm:bottom-6 sm:right-6"
        style={{ background: 'var(--ms-accent)' }}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Ask about a trailer</span>
      </button>
    );
  }

  const field =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--ms-accent)]';

  return (
    <div
      role="dialog"
      aria-label={`${siteName} chat`}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 flex h-[min(560px,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: 'var(--ms-accent)' }}>
        <div>
          <p className="text-sm font-semibold">{siteName}</p>
          <p className="text-xs text-white/80">AI assistant · a specialist follows up</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="rounded-full p-1.5 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 p-4">
        <Bubble role="assistant" content={GREETING} />
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-left text-sm text-slate-700 hover:border-[var(--ms-accent)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}
        {sending && (
          <div className="flex">
            <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            </div>
          </div>
        )}

        {(contact === 'shown' || contact === 'sending') && (
          <form onSubmit={submitContact} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-medium">Want pricing and availability? A specialist will follow up.</p>
            <input name="buyer_name" required maxLength={100} placeholder="Name" autoComplete="name" className={field} />
            <input
              name="buyer_email"
              type="email"
              required
              maxLength={200}
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              className={field}
            />
            <input name="buyer_phone" type="tel" maxLength={20} placeholder="Phone (optional)" autoComplete="tel" className={field} />
            <input
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            {contactError && (
              <p className="text-xs text-red-600" role="alert">
                {contactError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={contact === 'sending'}
                className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'var(--ms-accent)' }}
              >
                {contact === 'sending' ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Send my details'}
              </button>
              <button
                type="button"
                onClick={() => setContact('dismissed')}
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Not now
              </button>
            </div>
          </form>
        )}
        {contact === 'sent' && (
          <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--ms-accent)' }} />
            <span>Got it — a specialist will follow up with pricing and availability. Keep asking questions if you like.</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            placeholder="What are you hauling?"
            aria-label="Message"
            className={`${field} flex-1`}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send"
            className="rounded-lg px-3 text-white disabled:opacity-50"
            style={{ background: 'var(--ms-accent)' }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-slate-400">AI answers can be wrong — a specialist confirms every quote.</p>
      </form>
    </div>
  );
}

function Bubble({ role, content }: Message) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
          role === 'user' ? 'rounded-br-md text-white' : 'rounded-bl-md border border-slate-200 bg-white'
        }`}
        style={role === 'user' ? { background: 'var(--ms-accent)' } : undefined}
      >
        {content}
      </p>
    </div>
  );
}

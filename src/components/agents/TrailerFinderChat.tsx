'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { csrfFetch } from '@/lib/csrf-fetch';
import { LinkifiedText } from '@/components/ui/linkified-text';
import { canAutofocus, useOverlayOpen, useVisibleViewport } from '@/lib/mobile-chrome';
import {
  closeAxlonChat,
  consumePendingMessage,
  buildChatLeadMessage,
  useAxlonChat,
  type AxlonListingContext,
} from '@/lib/axlon-chat';
import { HONEYPOT_FIELD } from '@/lib/leads/form-guard';
import { SALES_PHONE_E164, SALES_PHONE_DISPLAY } from '@/lib/contact';
import {
  Send, Loader2, User, Phone, Tag,
  Wrench, X, Maximize2, Minimize2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolsUsed?: Array<{ tool: string; args?: Record<string, unknown> }>;
  timestamp: Date;
}

interface TrailerFinderChatProps {
  /**
   * `floating`: the corner panel, opened and closed through lib/axlon-chat
   * (AxlonLauncher mounts it). `inline`: always open, in the page flow.
   */
  variant?: 'inline' | 'floating';
  className?: string;
}

const EXAMPLE_QUERIES = [
  'I need to haul a Cat 349 excavator in Texas',
  'Compare Trail King TK110 vs Fontaine Magnitude 55H',
  'Show me lowboys under $150k',
  'What financing looks like on a $180k trailer?',
  'Best RGN for 55 ton loads?',
];

// When the visitor is on a listing, the prompts are about that trailer.
const LISTING_QUERIES = [
  'Is the asking price fair?',
  'What can this trailer haul?',
  'What should I check before buying it?',
  'What would monthly payments look like?',
  'Get me a quote from the seller',
];

// Keys are the tool names the API reports in toolsUsed.
const TOOL_LABELS: Record<string, string> = {
  search_listings: 'Searching marketplace',
  seller_inventory: "Checking the seller's inventory",
  search_new_trailers: 'Checking manufacturer catalog',
  product_specs: 'Looking up specs',
  compare_products: 'Comparing models',
  financing: 'Calculating payments',
  equipment_weight: 'Looking up equipment weight',
};

const FACE = '/images/axlonai-logo-eyes.png';

export function TrailerFinderChat({ variant = 'inline', className = '' }: TrailerFinderChatProps) {
  const chat = useAxlonChat();
  const isOpen = variant === 'inline' || chat.open;
  const context: AxlonListingContext | null = variant === 'floating' ? chat.context : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFloatingOpen = variant === 'floating' && isOpen;

  // Seller handoff: the form AXLON offers when the buyer wants to reach the
  // seller of the listing they're viewing. One lead per listing per session.
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSentFor, setLeadSentFor] = useState<string | null>(null);
  const [isSendingLead, setIsSendingLead] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', phone: '', website: '' });
  const leadFormShownAt = useRef<number | null>(null);

  // While the panel is open the site's floating buttons step aside, and with
  // the iOS keyboard up the panel shrinks into the visible area instead of
  // hiding behind the keyboard.
  useOverlayOpen(isFloatingOpen);
  const visible = useVisibleViewport(isFloatingOpen);

  // Scroll the message list itself — scrollIntoView would also scroll the page
  // behind an inline chat. Skipped while a lead-form field has focus, since
  // iOS has already scrolled that field into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list || (messages.length === 0 && !isLoading)) return;
    if (list.contains(document.activeElement)) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, showLeadForm]);

  useEffect(() => {
    // On phones, focusing pops the keyboard over the example prompts.
    if (isOpen && inputRef.current && canAutofocus()) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const closePanel = useCallback(() => {
    closeAxlonChat();
    setIsExpanded(false);
  }, []);

  // Tapping a listing link on a phone: get the panel out of the way so the page
  // is visible. The conversation is kept for when they reopen it.
  const handleInternalNavigate = useCallback(() => {
    if (variant === 'floating' && window.matchMedia('(max-width: 639px)').matches) closePanel();
  }, [variant, closePanel]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // The API caps history at 20 messages — trim client-side so long chats
      // don't get rejected (or silently truncated) mid-conversation.
      const conversationHistory = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await csrfFetch('/api/agents/trailer-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory,
          // What the visitor is looking at, so "this trailer" means something.
          context: context ? { listingId: context.listingId } : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        toolsUsed: data.toolsUsed,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // AXLON judged the buyer wants the seller: offer the handoff.
      if (data.offerContact && context && leadSentFor !== context.listingId) {
        setShowLeadForm(true);
      }
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, context, leadSentFor]);

  // A message queued from outside (a failed search's "Ask AXLON") goes out as
  // soon as the panel is open and idle.
  useEffect(() => {
    if (!isOpen || isLoading) return;
    const pending = consumePendingMessage();
    if (pending) sendMessage(pending);
  }, [isOpen, isLoading, chat.pendingMessage, sendMessage]);

  // Leaving the listing closes its handoff form; a new listing gets a new one.
  useEffect(() => {
    if (!context) setShowLeadForm(false);
  }, [context]);

  useEffect(() => {
    if (showLeadForm && leadFormShownAt.current === null) leadFormShownAt.current = Date.now();
    if (!showLeadForm) leadFormShownAt.current = null;
  }, [showLeadForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const addAssistantNote = (content: string) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content, timestamp: new Date() }]);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || isSendingLead) return;
    const name = lead.name.trim();
    const email = lead.email.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsSendingLead(true);
    try {
      const response = await csrfFetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: context.listingId,
          seller_id: context.sellerId,
          buyer_name: name,
          buyer_email: email,
          buyer_phone: lead.phone.trim() || null,
          message: buildChatLeadMessage(
            context.title,
            messages.map(m => ({ role: m.role, content: m.content }))
          ),
          website: lead.website,
          startedAt: leadFormShownAt.current,
        }),
      });
      if (!response.ok) throw new Error('lead failed');
      setLeadSentFor(context.listingId);
      setShowLeadForm(false);
      setLead({ name: '', email: '', phone: '', website: '' });
      const seller = context.sellerName || 'the seller';
      addAssistantNote(
        `Done — I've passed your details and this conversation to ${seller}. They'll reach you at ${email}. Anything else you want to know while you wait?`
      );
    } catch {
      addAssistantNote(
        `I couldn't send that just now. Try again in a moment, or call ${SALES_PHONE_DISPLAY} and I'll take it by phone.`
      );
    } finally {
      setIsSendingLead(false);
    }
  };

  // ── Floating, closed: AxlonLauncher shows the corner pill ─────
  if (variant === 'floating' && !isOpen) return null;

  const containerClasses = variant === 'floating'
    ? `fixed z-50 flex flex-col shadow-2xl rounded-xl border bg-background transition-all ${
        isExpanded
          ? 'inset-2 sm:inset-4'
          : 'inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] h-[70dvh] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[600px]'
      }`
    : `w-full rounded-xl border bg-background ${className}`;

  const keyboardStyle = variant === 'floating' && visible
    ? { top: visible.top + 8, height: visible.height - 16, bottom: 'auto' }
    : undefined;

  const examples = context ? LISTING_QUERIES : EXAMPLE_QUERIES;
  const leadAlreadySent = Boolean(context && leadSentFor === context.listingId);

  return (
    <div className={containerClasses} style={keyboardStyle} role={variant === 'floating' ? 'dialog' : undefined} aria-label={variant === 'floating' ? 'Ask AXLON' : undefined}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Image src={FACE} alt="" width={24} height={28} className="h-6 w-auto dark:brightness-110" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm">AXLON</h3>
            <p className="text-xs text-muted-foreground truncate">Axleyard&apos;s AI &middot; searches live inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Voice is one tap away from inside the chat */}
          <a
            href={`tel:${SALES_PHONE_E164}`}
            className="flex size-10 md:size-8 items-center justify-center hover:bg-muted rounded-md transition-colors text-primary"
            aria-label={`Call AXLON ${SALES_PHONE_DISPLAY}`}
            title={`Call AXLON ${SALES_PHONE_DISPLAY}`}
          >
            <Phone className="w-4 h-4" />
          </a>
          {variant === 'floating' && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex size-10 md:size-8 items-center justify-center hover:bg-muted rounded-md transition-colors"
                aria-label={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={closePanel}
                className="flex size-10 md:size-8 items-center justify-center hover:bg-muted rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* What this conversation is about, when the visitor is on a listing */}
      {context && (
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40 text-xs">
          <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate min-w-0">
            Talking about <span className="font-medium text-foreground">{context.title}</span>
          </span>
          {!leadAlreadySent && !showLeadForm && (
            <button
              type="button"
              onClick={() => setShowLeadForm(true)}
              className="ml-auto shrink-0 font-medium text-primary hover:underline min-h-8 md:min-h-0"
            >
              Contact seller
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      {/* Floating: the list takes whatever the panel has left. A fixed 460px
          list in a 70dvh panel pushed the input off-screen on phones. */}
      <div ref={listRef} role="log" aria-live="polite" aria-label="Conversation" className={`overflow-y-auto overscroll-contain px-4 py-3 space-y-4 ${variant === 'floating' ? 'flex-1 min-h-0' : 'h-[500px]'}`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Image src={FACE} alt="" width={56} height={65} className="h-14 w-auto mx-auto mb-3 dark:brightness-110" />
            <p className="text-sm text-muted-foreground mb-4">
              {context
                ? <>I&apos;m AXLON. I&apos;ve got the {context.title} in front of me — ask me anything about it, or tell me what you need to haul.</>
                : <>I&apos;m AXLON. Tell me what you need to haul and I&apos;ll find the right trailer.</>}
            </p>
            <div className="space-y-2">
              {examples.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left text-sm px-3 py-2.5 md:py-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Image src={FACE} alt="" width={16} height={19} className="h-4 w-auto dark:brightness-110" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-3 py-2`}>
              {/* Tool usage indicator */}
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {msg.toolsUsed.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-[11px] gap-1 py-0">
                      <Wrench className="w-2.5 h-2.5" />
                      {TOOL_LABELS[t.tool] || 'Looking that up'}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {msg.role === 'assistant' ? (
                  <LinkifiedText text={msg.content} onInternalNavigate={handleInternalNavigate} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 bg-foreground/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Image src={FACE} alt="" width={16} height={19} className="h-4 w-auto dark:brightness-110" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching...
              </div>
            </div>
          </div>
        )}

        {/* Seller handoff */}
        {context && showLeadForm && !leadAlreadySent && (
          <form onSubmit={handleLeadSubmit} className="relative bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
            <div>
              <p className="font-medium text-sm">Reach {context.sellerName || 'the seller'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                I&apos;ll send them your details with this conversation, so they can pick up where we left off.
              </p>
            </div>
            <div>
              <Label htmlFor="axlon-lead-name" className="text-xs">Name</Label>
              <Input
                id="axlon-lead-name"
                autoComplete="name"
                required
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className="h-11 md:h-9"
              />
            </div>
            <div>
              <Label htmlFor="axlon-lead-email" className="text-xs">Email</Label>
              <Input
                id="axlon-lead-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className="h-11 md:h-9"
              />
            </div>
            <div>
              <Label htmlFor="axlon-lead-phone" className="text-xs">Phone <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="axlon-lead-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className="h-11 md:h-9"
              />
            </div>
            {/* Honeypot: real people never see this field. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="axlon-lead-website">Website</label>
              <input
                id="axlon-lead-website"
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={lead.website}
                onChange={(e) => setLead({ ...lead, website: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isSendingLead} className="h-10 md:h-8">
                {isSendingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send to seller'}
              </Button>
              <Button type="button" size="sm" variant="ghost" className="h-10 md:h-8" onClick={() => setShowLeadForm(false)}>
                Not now
              </Button>
            </div>
          </form>
        )}

      </div>

      {/* Input */}
      <div className="border-t px-3 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={context ? 'Ask about this trailer' : 'What do you need to haul?'}
            aria-label="Message AXLON"
            // readOnly, not disabled: disabling blurs the field and closes the
            // iOS keyboard after every message. sendMessage ignores repeats.
            readOnly={isLoading}
            aria-busy={isLoading}
            enterKeyHint="send"
            className="flex-1 min-w-0 h-11 md:h-9 px-3 text-base md:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary read-only:opacity-60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="size-11 md:size-9"
            aria-label="Send"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[11px] text-muted-foreground text-center mt-1.5">
          Powered by AXLON AI · {messages.filter(m => m.role === 'assistant').length > 0 ? `${messages.length} messages` : 'Ask anything about trailers'}
        </p>
      </div>
    </div>
  );
}

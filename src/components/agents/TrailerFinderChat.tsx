'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { csrfFetch } from '@/lib/csrf-fetch';
import { LinkifiedText } from '@/components/ui/linkified-text';
import { canAutofocus, useOverlayOpen, useVisibleViewport } from '@/lib/mobile-chrome';
import {
  Search, Send, Loader2, Bot, User,
  Wrench, ChevronDown, X, Maximize2, Minimize2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolsUsed?: Array<{ tool: string; args: Record<string, unknown> }>;
  timestamp: Date;
}

interface TrailerFinderChatProps {
  variant?: 'inline' | 'floating';
  className?: string;
  /** Start the floating variant open (e.g. launched from a "try it live" CTA). */
  initialOpen?: boolean;
}

const EXAMPLE_QUERIES = [
  'I need to haul a Cat 349 excavator in Texas',
  'Compare Trail King TK110 vs Fontaine Magnitude 55H',
  'Show me lowboys under $150k',
  'What financing looks like on a $180k trailer?',
  'Best RGN for 55 ton loads?',
];

const TOOL_LABELS: Record<string, string> = {
  search_listings: 'Searching marketplace',
  search_new_trailers: 'Checking manufacturer catalog',
  get_product_specs: 'Looking up specs',
  compare_products: 'Comparing models',
  calculate_financing: 'Calculating payments',
  lookup_equipment_weight: 'Looking up equipment weight',
};

export function TrailerFinderChat({ variant = 'inline', className = '', initialOpen = false }: TrailerFinderChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(variant === 'inline' || initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFloatingOpen = variant === 'floating' && isOpen;

  // While the panel is open the site's floating buttons step aside (the call
  // button otherwise sits on the Send button), and with the iOS keyboard up the
  // panel shrinks into the visible area instead of hiding behind the keyboard.
  useOverlayOpen(isFloatingOpen);
  const visible = useVisibleViewport(isFloatingOpen);

  // Scroll the message list itself — scrollIntoView would also scroll the page
  // behind an inline chat.
  useEffect(() => {
    const list = listRef.current;
    if (!list || (messages.length === 0 && !isLoading)) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    // On phones, focusing pops the keyboard over the example prompts.
    if (isOpen && inputRef.current && canAutofocus()) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
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
  }, [isLoading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Floating variant toggle button ────────────────────────────
  if (variant === 'floating' && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        data-fab
        className="fixed bottom-fab-2 right-4 md:bottom-[calc(var(--compare-bar-h,0px)+6rem)] md:right-6 z-50 bg-primary text-primary-foreground rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Open Trailer Finder"
      >
        <Search className="w-6 h-6" />
      </button>
    );
  }

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

  return (
    <div className={containerClasses} style={keyboardStyle}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Trailer Finder</h3>
            <p className="text-xs text-muted-foreground">AI-powered equipment search</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
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

      {/* Messages */}
      {/* Floating: the list takes whatever the panel has left. A fixed 460px
          list in a 70dvh panel pushed the input off-screen on phones. */}
      <div ref={listRef} className={`overflow-y-auto overscroll-contain px-4 py-3 space-y-4 ${variant === 'floating' ? 'flex-1 min-h-0' : 'h-[500px]'}`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Tell me what you need to haul and I&apos;ll find the right trailer.
            </p>
            <div className="space-y-2">
              {EXAMPLE_QUERIES.map((q, i) => (
                <button
                  key={i}
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
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-3 py-2`}>
              {/* Tool usage indicator */}
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {msg.toolsUsed.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-[11px] gap-1 py-0">
                      <Wrench className="w-2.5 h-2.5" />
                      {TOOL_LABELS[t.tool] || t.tool}
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
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching...
              </div>
            </div>
          </div>
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
            placeholder="What do you need to haul?"
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

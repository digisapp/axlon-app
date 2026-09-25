'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LinkifiedText } from '@/components/ui/linkified-text';
import {
  MessageCircle,
  Send,
  Loader2,
  Bot,
  User,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { canAutofocus, useOverlayOpen, useVisibleViewport } from '@/lib/mobile-chrome';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  dealerId: string;
  dealerName: string;
  chatSettings?: {
    greeting?: string;
    personality?: string;
    collectLeadAfter?: number;
  };
}

export function ChatWidget({ dealerId, dealerName, chatSettings }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  // "Maybe later" must stick — without this flag the auto-open effect below
  // re-opens the form the instant it closes.
  const [leadFormDismissed, setLeadFormDismissed] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // While open, the site's floating buttons step aside, and with the iOS
  // keyboard up the panel shrinks into the visible area above it.
  useOverlayOpen(isOpen);
  const visible = useVisibleViewport(isOpen);

  const greeting = chatSettings?.greeting || `Hi! I'm the AI assistant for ${dealerName}. How can I help you find the right equipment today?`;

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, greeting, messages.length]);

  // Scroll the message list itself — scrollIntoView also scrolled the
  // storefront behind the panel. Re-runs when the keyboard resizes the panel,
  // unless a lead-form field (inside the list) has focus: iOS has already
  // scrolled that field into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.contains(document.activeElement)) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, showLeadForm, visible?.height]);

  useEffect(() => {
    // On phones, focusing pops the keyboard over the greeting.
    if (isOpen && canAutofocus()) inputRef.current?.focus();
  }, [isOpen]);

  // Tapping a listing link on a phone: get the panel out of the way so the
  // listing is visible. The conversation is kept for when they reopen it.
  const handleInternalNavigate = useCallback(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setIsOpen(false);
  }, []);

  // Show lead form after X messages
  useEffect(() => {
    const collectAfter = chatSettings?.collectLeadAfter || 3;
    const userMessages = messages.filter((m) => m.role === 'user').length;
    if (userMessages >= collectAfter && !leadSubmitted && !leadFormDismissed && !showLeadForm) {
      setShowLeadForm(true);
    }
  }, [messages, chatSettings?.collectLeadAfter, leadSubmitted, leadFormDismissed, showLeadForm]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await csrfFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          conversationId,
          message: userMessage.content,
          chatSettings,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save conversation ID for continuity
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Error message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'm sorry, I'm having trouble connecting. Please try again or call us directly.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      logger.error('Chat error', { error });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadInfo.name || !leadInfo.email || leadSubmitting) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadInfo.email)) {
      setLeadError('Please enter a valid email');
      return;
    }

    setLeadError('');
    setLeadSubmitting(true);

    try {
      const response = await csrfFetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          conversationId,
          ...leadInfo,
        }),
      });

      if (!response.ok) {
        // Keep the form visible so the visitor can retry
        setLeadError("We couldn't save your info just now. Please try again.");
        return;
      }

      setLeadSubmitted(true);
      setShowLeadForm(false);

      // Add confirmation message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Thanks ${leadInfo.name}! I've saved your contact info. A member of our team will follow up with you soon. In the meantime, feel free to keep asking questions!`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      logger.error('Lead submit error', { error });
      setLeadError("We couldn't save your info just now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    // bottom-fab stacks the launcher above the storefront's MobileContactBar.
    return (
      <Button
        onClick={() => setIsOpen(true)}
        data-fab
        aria-label={`Chat with ${dealerName}`}
        className="fixed bottom-fab lg:bottom-6 right-4 lg:right-6 size-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="size-6" />
      </Button>
    );
  }

  // Phones: a near-full-width panel sitting above the contact bar, capped so it
  // never runs off the top of a small screen. With the keyboard up it's pinned
  // to the visible area instead (iOS doesn't shrink the layout viewport).
  const panelStyle = {
    '--chat-bottom': 'calc(max(var(--bottom-bar-h, 0px), env(safe-area-inset-bottom)) + 0.5rem)',
    '--chat-h': 'min(560px, calc(100dvh - var(--chat-bottom) - 0.5rem - env(safe-area-inset-top)))',
    ...(visible ? { top: visible.top + 8, height: visible.height - 16, bottom: 'auto' } : {}),
  } as React.CSSProperties;

  return (
    <Card
      role="dialog"
      aria-label={`Chat with ${dealerName}`}
      style={panelStyle}
      className="fixed z-50 gap-0 py-0 flex flex-col overflow-hidden rounded-2xl shadow-2xl inset-x-2 bottom-(--chat-bottom) h-(--chat-h) sm:inset-x-auto sm:right-4 sm:w-[380px] lg:right-6 lg:bottom-6 lg:h-[min(560px,calc(100dvh-3rem))]"
    >
      {/* Header — touch-none so a drag here doesn't scroll the page behind */}
      <div className="shrink-0 touch-none bg-primary text-primary-foreground pl-4 pr-2 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{dealerName}</p>
            <p className="text-xs text-white/70">AI Sales Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-white hover:bg-white/20 hover:text-white"
          onClick={() => setIsOpen(false)}
          aria-label="Minimize chat"
        >
          <Minimize2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 bg-muted/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] min-w-0 rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border rounded-bl-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.role === 'assistant' ? (
                  <LinkifiedText text={message.content} onInternalNavigate={handleInternalNavigate} />
                ) : (
                  message.content
                )}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        {/* Lead Collection Form */}
        {showLeadForm && !leadSubmitted && (
          <div className="bg-card border rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium">
              Want us to follow up with more details? Leave your info:
            </p>
            <Input
              placeholder="Your name"
              autoComplete="name"
              value={leadInfo.name}
              onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
              className="h-11 md:h-9 text-base md:text-sm"
            />
            <Input
              placeholder="Email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={leadInfo.email}
              onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
              className="h-11 md:h-9 text-base md:text-sm"
            />
            <Input
              placeholder="Phone (optional)"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={leadInfo.phone}
              onChange={(e) => setLeadInfo({ ...leadInfo, phone: e.target.value })}
              className="h-11 md:h-9 text-base md:text-sm"
            />
            {leadError && (
              <p className="text-xs text-destructive" role="alert">
                {leadError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleLeadSubmit}
                disabled={!leadInfo.name || !leadInfo.email || leadSubmitting}
              >
                {leadSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setLeadFormDismissed(true);
                  setShowLeadForm(false);
                }}
              >
                Maybe later
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Input — readOnly (not disabled) while waiting: disabling blurs the
          field, which closes the iOS keyboard after every message. */}
      <div className="shrink-0 px-4 pt-3 pb-2 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about inventory, pricing, availability..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={isLoading}
            aria-busy={isLoading}
            enterKeyHint="send"
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            // Keep focus (and the iOS keyboard) in the input when tapping Send.
            onMouseDown={(e) => e.preventDefault()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="size-11 md:size-9"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Powered by AI - Responses may not be 100% accurate
        </p>
      </div>
    </Card>
  );
}

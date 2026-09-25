'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { LinkifiedText } from '@/components/ui/linkified-text';
import {
  Bot,
  Send,
  Loader2,
  X,
  Minimize2,
  Maximize2,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { canAutofocus, useOverlayOpen, useVisibleViewport } from '@/lib/mobile-chrome';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedListings?: SuggestedListing[];
}

interface SuggestedListing {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  location?: string;
}

interface DealerAIChatProps {
  dealerId: string;
  dealerName: string;
  listingId?: string;
  listingTitle?: string;
  className?: string;
}

export function DealerAIChat({
  dealerId,
  dealerName,
  listingId,
  listingTitle,
  className,
}: DealerAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState('Axlon');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
  });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // While open (even minimized, it sits in the floating-button corner) the
  // site's floating buttons step aside; with the iOS keyboard up the panel is
  // pinned to the visible area instead of hiding behind the keyboard.
  useOverlayOpen(isOpen);
  const visible = useVisibleViewport(isOpen && !isMinimized);

  // Scroll the message list itself — scrollIntoView also scrolled the listing
  // page behind the panel. Skipped while a lead-form field (inside the list)
  // has focus, since iOS has already scrolled that field into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.contains(document.activeElement)) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, showLeadForm, visible?.height]);

  // Initialize conversation when chat opens
  const initConversation = useCallback(async () => {
    if (conversationId) return;

    try {
      const response = await csrfFetch('/api/ai/dealer-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          listingId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
      }
    } catch (error) {
      logger.error('Failed to init conversation', { error });
    }
  }, [dealerId, listingId, conversationId]);

  // Fetch greeting when chat opens
  const fetchGreeting = useCallback(async () => {
    if (messages.length > 0) return;

    setIsLoading(true);
    try {
      const response = await csrfFetch('/api/ai/dealer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          query: listingId
            ? `I'm looking at the ${listingTitle || 'listing'}. Can you tell me about it?`
            : 'Hello',
          listingId,
          messages: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.assistantName) {
          setAssistantName(data.assistantName);
        }

        const greeting: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestedListings: data.suggestedListings,
        };
        setMessages([greeting]);
      } else {
        // 404 (AI not configured for this dealer), 429, 500 — show a
        // fallback greeting instead of an empty chat panel
        setMessages([{
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Hey there! I'm here to help you explore ${dealerName}'s inventory. What are you looking for today?`,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      logger.error('Failed to fetch greeting', { error });
      // Fallback greeting
      setMessages([{
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hey there! I'm Axlon, here to help you explore ${dealerName}'s inventory. What are you looking for today?`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [dealerId, dealerName, listingId, listingTitle, messages.length]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    initConversation();
    fetchGreeting();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    // On phones, focusing pops the keyboard over the conversation.
    if (canAutofocus()) inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Tapping a listing link on a phone: close the panel so the listing it
  // opens is visible. The conversation is kept for when they reopen it.
  const handleInternalNavigate = useCallback(() => {
    if (window.matchMedia('(max-width: 639px)').matches) {
      setIsOpen(false);
      setIsMinimized(false);
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await csrfFetch('/api/ai/dealer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          query: userMessage.content,
          conversationId,
          listingId,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestedListings: data.suggestedListings,
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Show lead form if AI suggests capturing
        if (data.shouldCaptureLead && !leadCaptured) {
          setTimeout(() => {
            setShowLeadForm(true);
          }, 500);
        }
      } else {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: "I'm having trouble responding right now. Please try again or contact us directly.",
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      logger.error('Failed to send message', { error });
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm having trouble responding right now. Please try again or contact us directly.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorInfo.email && !visitorInfo.phone) return;

    try {
      const response = await csrfFetch('/api/ai/dealer-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId,
          conversationId,
          visitorName: visitorInfo.name,
          visitorEmail: visitorInfo.email,
          visitorPhone: visitorInfo.phone,
          visitorIntent: visitorInfo.interest || listingTitle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.leadCaptured) {
          setLeadCaptured(true);
          setShowLeadForm(false);
          // The PUT may have created a fresh conversation (e.g. the initial
          // one failed to init) — keep its id for the rest of the session
          if (data.conversationId) {
            setConversationId(data.conversationId);
          }

          // Add confirmation message
          setMessages(prev => [...prev, {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `Thanks ${visitorInfo.name || 'for your info'}! A team member from ${dealerName} will be in touch with you shortly. Is there anything else I can help you with in the meantime?`,
            timestamp: new Date(),
          }]);
          return;
        }
      }
      // Surface the failure instead of leaving the form silently open
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "I couldn't save your contact info just now. Please try again in a moment or reach out to the dealer directly.",
        timestamp: new Date(),
      }]);
      setShowLeadForm(false);
    } catch (error) {
      logger.error('Failed to submit lead', { error });
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "I couldn't save your contact info just now. Please try again in a moment or reach out to the dealer directly.",
        timestamp: new Date(),
      }]);
      setShowLeadForm(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Phones: a near-full-width panel above the listing's contact bar
  // (MobileContactCTA publishes --bottom-bar-h), capped to the screen so the
  // header can't end up above the viewport on an iPhone SE/mini.
  const panelStyle = {
    '--chat-bottom': 'calc(max(var(--bottom-bar-h, 0px), env(safe-area-inset-bottom)) + 0.5rem)',
    '--chat-h': 'min(520px, calc(100dvh - var(--chat-bottom) - 0.5rem - env(safe-area-inset-top)))',
    ...(visible ? { top: visible.top + 8, height: visible.height - 16, bottom: 'auto' } : {}),
  } as React.CSSProperties;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className={cn(
            'flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70',
            className
          )}
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI About This</span>
          <Sparkles className="w-3 h-3" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          role="dialog"
          aria-label={`Chat with ${dealerName}`}
          style={panelStyle}
          className={cn(
            'fixed z-50 gap-0 py-0 flex flex-col overflow-hidden shadow-2xl border-2 bottom-(--chat-bottom) lg:bottom-4',
            isMinimized
              ? 'right-2 sm:right-4 w-72 max-w-[calc(100vw-1rem)]'
              : 'inset-x-2 h-(--chat-h) sm:inset-x-auto sm:right-4 sm:w-[400px] lg:h-[min(520px,calc(100dvh-2rem))]'
          )}
        >
          {/* Header — touch-none so a drag here doesn't scroll the page behind */}
          <div className="shrink-0 touch-none pl-3 pr-1.5 py-2 md:py-3 md:pr-3 border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer"
                onClick={isMinimized ? handleMaximize : undefined}
              >
                <div className="relative shrink-0">
                  <Avatar className="w-10 h-10 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{assistantName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {dealerName}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 md:size-8"
                  onClick={isMinimized ? handleMaximize : handleMinimize}
                  aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 md:size-8"
                  onClick={handleClose}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Content — the list takes whatever height the panel has left */}
          {!isMinimized && (
            <>
              <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    <div
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className="flex items-start gap-2 max-w-[85%] min-w-0">
                        {msg.role === 'assistant' && (
                          <Avatar className="w-7 h-7 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="min-w-0">
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-2.5',
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.role === 'assistant' ? (
                                <LinkifiedText text={msg.content} onInternalNavigate={handleInternalNavigate} />
                              ) : (
                                msg.content
                              )}
                            </p>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 px-2">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                        {msg.role === 'user' && (
                          <Avatar className="w-7 h-7 flex-shrink-0">
                            <AvatarFallback className="bg-secondary">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>

                    {/* Suggested Listings */}
                    {msg.suggestedListings && msg.suggestedListings.length > 0 && (
                      <div className="ml-9 mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">
                          Recommended for you:
                        </p>
                        {msg.suggestedListings.slice(0, 2).map((listing) => (
                          <Link
                            key={listing.id}
                            href={`/listing/${listing.id}`}
                            onClick={handleInternalNavigate}
                            className="block p-3 bg-background border rounded-lg hover:border-primary transition-colors"
                          >
                            <p className="font-medium text-sm truncate">
                              {listing.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-primary font-semibold">
                                {listing.price
                                  ? `$${listing.price.toLocaleString()}`
                                  : 'Call for price'}
                              </p>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lead Capture Form */}
                {showLeadForm && !leadCaptured && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                    <p className="font-medium text-sm mb-3">
                      Want us to reach out to you?
                    </p>
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                      <div>
                        <Label htmlFor="chat-lead-name" className="text-xs">Name</Label>
                        <Input
                          id="chat-lead-name"
                          placeholder="Your name"
                          autoComplete="name"
                          value={visitorInfo.name}
                          onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                          className="h-11 md:h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chat-lead-email" className="text-xs">Email</Label>
                        <Input
                          id="chat-lead-email"
                          type="email"
                          placeholder="your@email.com"
                          autoComplete="email"
                          inputMode="email"
                          value={visitorInfo.email}
                          onChange={(e) => setVisitorInfo({ ...visitorInfo, email: e.target.value })}
                          className="h-11 md:h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chat-lead-phone" className="text-xs">Phone (optional)</Label>
                        <Input
                          id="chat-lead-phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          autoComplete="tel"
                          inputMode="tel"
                          value={visitorInfo.phone}
                          onChange={(e) => setVisitorInfo({ ...visitorInfo, phone: e.target.value })}
                          className="h-11 md:h-9"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowLeadForm(false)}
                          className="flex-1"
                        >
                          Maybe later
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="flex-1"
                          disabled={!visitorInfo.email && !visitorInfo.phone}
                        >
                          Contact me
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Input — readOnly (not disabled) while waiting: disabling blurs
                  the field, which closes the iOS keyboard after every message. */}
              <div className="shrink-0 px-3 pt-3 pb-2 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
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
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                    className="size-11 md:size-9"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Powered by Axlon • {dealerName}
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}

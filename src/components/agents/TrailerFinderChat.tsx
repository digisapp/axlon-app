'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { csrfFetch } from '@/lib/csrf-fetch';
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

export function TrailerFinderChat({ variant = 'inline', className = '' }: TrailerFinderChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(variant === 'inline');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      const conversationHistory = messages.map(m => ({
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
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Open Trailer Finder"
      >
        <Search className="w-6 h-6" />
      </button>
    );
  }

  const containerClasses = variant === 'floating'
    ? `fixed z-50 shadow-2xl rounded-xl border bg-background transition-all ${
        isExpanded
          ? 'inset-4'
          : 'bottom-6 right-6 w-[420px] h-[600px]'
      }`
    : `w-full rounded-xl border bg-background ${className}`;

  return (
    <div className={containerClasses}>
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
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                aria-label={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className={`overflow-y-auto px-4 py-3 space-y-4 ${variant === 'floating' ? (isExpanded ? 'h-[calc(100%-120px)]' : 'h-[460px]') : 'h-[500px]'}`}>
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
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg border hover:bg-muted transition-colors"
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
                    <Badge key={i} variant="outline" className="text-[10px] gap-1 py-0">
                      <Wrench className="w-2.5 h-2.5" />
                      {TOOL_LABELS[t.tool] || t.tool}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content}
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

        <div ref={messagesEndRef} />
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
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="px-3"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Powered by AXLON AI · {messages.filter(m => m.role === 'assistant').length > 0 ? `${messages.length} messages` : 'Ask anything about trailers'}
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { csrfFetch } from '@/lib/csrf-fetch';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { panelClass } from './panel';

interface AskAxlonProps {
  /** Prompts built from the dealer's own data — a lead waiting, a stale listing */
  suggestions: string[];
  /** Plan lacks aiAssistant (trial over): show an upgrade prompt instead of a box that only errors */
  locked?: boolean;
}

/**
 * The AXLON prompt on the overview: one input, a few prompts that fit what's
 * happening at the dealership right now, and the answer in place.
 */
export function AskAxlon({ suggestions, locked = false }: AskAxlonProps) {
  const [query, setQuery] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const handleSubmit = async (prompt: string) => {
    const q = (prompt || query).trim();
    if (!q || isAsking) return;
    setQuery(q);
    setAsked(q);
    setIsAsking(true);
    setAskError(null);
    setAnswer(null);
    try {
      const res = await csrfFetch('/api/dashboard/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setAnswer(data.answer);
      } else if (data.error === 'upgrade_required') {
        setAskError('Ask AXLON is part of AXLON Platform. Upgrade in Billing to keep using it.');
      } else {
        setAskError(data.error || 'Could not get an answer. Please try again.');
      }
    } catch {
      setAskError('Could not reach AXLON. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  const reset = () => {
    setQuery('');
    setAsked(null);
    setAnswer(null);
    setAskError(null);
  };

  return (
    <section className={cn(panelClass, 'border-primary/20')} aria-labelledby="ask-axlon-heading">
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="ask-axlon-heading" className="text-base md:text-lg font-semibold">
              Ask AXLON
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">Your business assistant, available 24/7.</p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            AI Assistant
          </span>
        </div>

        {locked ? (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm sm:flex-row sm:items-center">
            <p className="flex-1 text-muted-foreground">
              Ask AXLON is part of AXLON Platform. Upgrade to get answers about your listings, leads and pricing.
            </p>
            <Button size="sm" className="shrink-0" asChild>
              <Link href="/dashboard/billing">Upgrade</Link>
            </Button>
          </div>
        ) : (
          <>
            <form
              className="relative mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(query);
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isAsking}
                placeholder="Ask anything about your business..."
                aria-label="Ask AXLON a question about your business"
                className="w-full rounded-lg border border-border/60 bg-background py-3 pl-4 pr-12 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isAsking || !query.trim()}
                aria-label="Ask AXLON"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
              >
                {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
              </button>
            </form>

            {(answer || askError) && (
              <div
                className={cn(
                  'mt-3 rounded-lg border p-3 text-sm',
                  askError
                    ? 'border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400'
                    : 'border-primary/20 bg-primary/5 text-foreground'
                )}
              >
                {asked && !askError && (
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">{asked}</p>
                )}
                <p className="whitespace-pre-line">{askError ?? answer}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3 h-3" />
                  Ask something else
                </button>
              </div>
            )}

            {!answer && !askError && suggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSubmit(prompt)}
                    disabled={isAsking}
                    className="rounded-lg bg-muted px-3 py-1.5 text-xs md:text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

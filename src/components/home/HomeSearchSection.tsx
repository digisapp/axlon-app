'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AISearchBar } from '@/components/search/AISearchBar';
import { cn } from '@/lib/utils';

// Three ways in for a visitor who won't type: each runs through the same
// AI search as the box above it.
const SUGGESTED_PROMPTS = [
  'Lowboy trailers under $60k',
  'Show me trucks under $50,000',
  'Peterbilt 389 sleeper, 2020 or newer',
];

export function HomeSearchSection() {
  const [isTyping, setIsTyping] = useState(false);
  // Autofocus only on devices with a real pointer — on phones it pops the
  // keyboard over the page before the visitor has read anything.
  const [autoFocusEnabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  return (
    <>
      {/* AXLON's head, small, lighting up while the visitor types (the same
          treatment as axlon.ai) so the search box reads as his. Kept under
          the headline's size: the wordmark in the header already carries
          the brand. */}
      <div
        aria-hidden="true"
        className={cn(
          'mb-3 md:mb-4 transition-transform duration-500',
          isTyping && 'logo-glow scale-110'
        )}
      >
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt=""
          width={80}
          height={93}
          priority
          className="h-11 w-auto md:h-[58px] dark:brightness-110"
        />
      </div>

      {/* Headline */}
      <h1 className="text-center text-[1.85rem] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-2 md:mb-3 px-2">
        The smarter way to buy heavy equipment.
      </h1>
      <p className="text-center text-sm sm:text-base md:text-lg text-muted-foreground dark:text-foreground/60 max-w-xl mb-5 md:mb-7 px-2">
        Search trucks, trailers and equipment from dealers nationwide.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-3 md:mb-4 px-2">
        <AISearchBar
          size="large"
          autoFocus={autoFocusEnabled}
          animatedPlaceholder
          onTypingChange={setIsTyping}
        />
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-7 md:mb-10 px-2">
        <span className="text-xs text-muted-foreground dark:text-foreground/50">Try:</span>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Link
            key={prompt}
            href={`/search?q=${encodeURIComponent(prompt)}`}
            className="rounded-full border bg-white/70 dark:bg-white/[0.06] px-3 py-1.5 text-xs md:text-sm text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors"
          >
            {prompt}
          </Link>
        ))}
      </div>
    </>
  );
}

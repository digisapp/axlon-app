'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { AISearchBar } from '@/components/search/AISearchBar';
import { cn } from '@/lib/utils';

export function AskAxlonHero() {
  const [isTyping, setIsTyping] = useState(false);
  // Autofocus only on devices with a real pointer — on phones it pops the
  // keyboard over the page before the visitor has read anything.
  const [autoFocusEnabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center gap-6 -mt-12">
      {/* AXLON mascot — face lights up while the visitor types */}
      <div
        className={cn(
          'transition-all duration-500',
          isTyping && 'logo-glow scale-105'
        )}
      >
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt="AXLON"
          width={260}
          height={104}
          priority
          className={cn(
            'w-32 transition-all duration-500 dark:brightness-110 sm:w-40 md:w-48',
            isTyping && 'brightness-110'
          )}
        />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Sparkles className="h-3 w-3 text-primary" />
          AI for the heavy haul industry
        </span>
        <p className="max-w-md text-balance text-sm text-zinc-500 dark:text-zinc-400 md:text-base">
          Ask me anything — lowboy trailers, semi trucks, parts, prices, or
          financing. I&apos;ll search the yard and answer instantly.
        </p>
      </div>

      <AISearchBar
        size="large"
        autoFocus={autoFocusEnabled}
        animatedPlaceholder
        showLanguageHint
        onTypingChange={setIsTyping}
        className="w-full"
      />
    </div>
  );
}

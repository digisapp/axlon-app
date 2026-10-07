'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AISearchBar } from '@/components/search/AISearchBar';
import { cn } from '@/lib/utils';

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
          treatment as axlon.ai) so the search box reads as his */}
      <div
        aria-hidden="true"
        className={cn(
          'mb-4 md:mb-5 transition-transform duration-500',
          isTyping && 'logo-glow scale-110'
        )}
      >
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt=""
          width={80}
          height={93}
          priority
          className="h-14 w-auto md:h-[72px] dark:brightness-110"
        />
      </div>

      {/* Headline */}
      <h1 className="text-center text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-5 md:mb-7 px-2">
        The nationwide marketplace for trucks, trailers &amp; heavy equipment
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-4 md:mb-5 px-2">
        <AISearchBar
          size="large"
          autoFocus={autoFocusEnabled}
          animatedPlaceholder
          onTypingChange={setIsTyping}
        />
      </div>
    </>
  );
}

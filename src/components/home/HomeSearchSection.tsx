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
      {/* Logo with glow effect */}
      <div className={cn(
        "mb-3 md:mb-5 transition-all duration-500",
        isTyping && "logo-glow scale-105"
      )}>
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt="AXLON AI"
          width={200}
          height={80}
          priority
          className={cn(
            "dark:brightness-110 w-20 sm:w-28 md:w-36 transition-all duration-500",
            isTyping && "brightness-110"
          )}
        />
      </div>

      {/* Headline */}
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-3xl mb-2 md:mb-3 px-2">
        The AI marketplace for trucks, trailers &amp; heavy equipment
      </h1>
      <p className="text-center text-sm md:text-base text-muted-foreground dark:text-foreground/60 max-w-xl mb-5 md:mb-7 px-4">
        Search in plain English. Our AI finds the right equipment, answers your
        questions, and connects you with sellers — 24/7.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-4 md:mb-5 px-2">
        <AISearchBar
          size="large"
          autoFocus={autoFocusEnabled}
          animatedPlaceholder
          onTypingChange={setIsTyping}
          showLanguageHint
        />
      </div>
    </>
  );
}

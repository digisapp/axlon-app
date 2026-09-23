'use client';

import { useState } from 'react';
import { AISearchBar } from '@/components/search/AISearchBar';

export function HomeSearchSection() {
  // Autofocus only on devices with a real pointer — on phones it pops the
  // keyboard over the page before the visitor has read anything.
  const [autoFocusEnabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  return (
    <>
      {/* Headline — the header already carries the logo, so the hero leads
          with the promise and the search box instead of a second mascot */}
      <h1 className="text-center text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-3 md:mb-4 px-2">
        The nationwide marketplace for trucks, trailers &amp; heavy equipment
      </h1>
      <p className="text-center text-sm md:text-base text-muted-foreground dark:text-foreground/60 max-w-2xl mb-5 md:mb-7 px-4">
        Search in plain English, compare prices, and reach sellers across the country.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-4 md:mb-5 px-2">
        <AISearchBar
          size="large"
          autoFocus={autoFocusEnabled}
          animatedPlaceholder
        />
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
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
      <h1 className="text-center text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-5 md:mb-7 px-2">
        The nationwide marketplace for trucks, trailers &amp; heavy equipment
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-3 px-2">
        <AISearchBar
          size="large"
          autoFocus={autoFocusEnabled}
          animatedPlaceholder
        />
      </div>

      {/* One line to put the face and the name together on the first screen;
          the band further down (#meet-axlon) is where he gets introduced */}
      <a
        href="#meet-axlon"
        className="group inline-flex items-center gap-2 mb-5 md:mb-6 px-2 py-1 text-xs md:text-sm text-muted-foreground dark:text-foreground/60 hover:text-primary transition-colors"
      >
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt=""
          width={20}
          height={23}
          className="h-5 w-auto transition-transform group-hover:scale-110 dark:brightness-110"
        />
        <span>
          Powered by <span className="font-semibold text-foreground group-hover:text-primary transition-colors">AXLON</span>, the AI that runs the yard
        </span>
      </a>
    </>
  );
}

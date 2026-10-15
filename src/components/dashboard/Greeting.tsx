'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * "Good morning, Hale Trailers ✦". The hour is the dealer's, not the
 * server's, so the server renders "Welcome back" and the browser swaps in
 * the real greeting on hydration.
 */
export function Greeting({ name }: { name?: string | null }) {
  const greeting = useSyncExternalStore(subscribe, greetingForNow, () => 'Welcome back');

  return (
    <>
      {greeting}
      {name ? `, ${name}` : ''}{' '}
      <span aria-hidden="true" className="text-primary">
        ✦
      </span>
    </>
  );
}

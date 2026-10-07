'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { optionalImport, Nothing } from '@/lib/lazy';
import { RESERVED_SLUGS } from '@/lib/reserved-slugs';
import { openAxlonChat, useAxlonChat } from '@/lib/axlon-chat';
import { SALES_PHONE_E164, SALES_PHONE_DISPLAY } from '@/lib/contact';

// Optional widget: if its chunk can't load, show nothing — don't take the
// page down with it (see lib/lazy.ts).
const TrailerFinderChat = dynamic(
  optionalImport(
    () => import('@/components/agents/TrailerFinderChat').then((mod) => mod.TrailerFinderChat),
    Nothing
  ),
  { ssr: false, loading: () => null }
);

const HIDDEN_PREFIXES = [
  // The standalone AXLON page is the chat; the sign-in forms, the dealer
  // workspace and the admin console aren't places to pitch a buyer a call.
  '/ask', '/login', '/signup', '/forgot-password', '/reset-password', '/auth',
  '/dashboard', '/admin',
];

/**
 * The one AXLON in the corner of every marketplace page: his face and "Ask
 * AXLON" open the chat, the phone end dials the 24/7 line. One object, one
 * face — two stacked buttons each wearing the face read as a glitch.
 *
 * The chat panel is loaded on first open (prefetched when the browser is
 * idle) and stays mounted once opened, so closing it keeps the conversation.
 */
export function AxlonLauncher() {
  const pathname = usePathname();
  const { open, context } = useAxlonChat();
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  // Warm the panel chunk once the page has settled, so the first tap is
  // instant. Safari lacks requestIdleCallback.
  useEffect(() => {
    const load = () => {
      import('@/components/agents/TrailerFinderChat').catch(() => {});
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load);
      return () => window.cancelIdleCallback(id);
    }
    const timeout = window.setTimeout(load, 2500);
    return () => window.clearTimeout(timeout);
  }, []);

  // Dealer storefronts (axleyard.com/[slug]) have their own contact bar and
  // chat in this corner, and this number is AXLON's, not the dealer's. A
  // single-segment path whose first segment isn't a known app route is a
  // storefront.
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  const isStorefront = Boolean(firstSegment) && !RESERVED_SLUGS.has(firstSegment);
  if (isStorefront) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <>
      {!open && (
        <div
          data-fab
          className="fixed bottom-fab right-4 md:bottom-[calc(var(--compare-bar-h,0px)+1.5rem)] md:right-6 z-50 flex items-stretch overflow-hidden rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/10 transition-shadow hover:shadow-xl dark:bg-zinc-900 dark:ring-white/15"
        >
          <button
            type="button"
            onClick={() => openAxlonChat()}
            className="flex h-12 items-center gap-2 pl-1.5 pr-2.5 transition-colors hover:bg-muted md:h-14 md:pl-2 md:pr-4"
            aria-label={context ? `Ask AXLON about ${context.title}` : 'Ask AXLON'}
          >
            <Image
              src="/images/axlonai-logo-eyes.png"
              alt=""
              width={40}
              height={47}
              className="h-8 w-auto md:h-10 dark:brightness-110"
            />
            <span className="hidden text-sm font-semibold whitespace-nowrap md:block">Ask AXLON</span>
          </button>
          <a
            href={`tel:${SALES_PHONE_E164}`}
            className="group flex h-12 items-center bg-primary px-3.5 text-white transition-colors hover:bg-primary/90 md:h-14 md:px-4"
            aria-label={`Call AXLON ${SALES_PHONE_DISPLAY}`}
          >
            <Phone className="h-5 w-5 md:h-6 md:w-6" />
            {/* The number itself, revealed on hover — desktop only */}
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[160px] group-hover:pl-2.5 md:block">
              {SALES_PHONE_DISPLAY}
            </span>
          </a>
        </div>
      )}
      {everOpened && <TrailerFinderChat variant="floating" />}
    </>
  );
}

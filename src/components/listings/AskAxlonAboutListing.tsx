'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { openAxlonChat, useAxlonListingContext } from '@/lib/axlon-chat';

interface AskAxlonAboutListingProps {
  listingId: string;
  title: string;
  sellerId: string | null;
  sellerName: string | null;
  price: number | null;
}

/**
 * The listing's doorway to AXLON. It opens the same corner chat as the
 * floating launcher — not a second assistant — and, while this page is
 * mounted, tells that chat which trailer the visitor is looking at, so AXLON
 * can price-check it, answer from its specs, and hand the buyer to the
 * seller.
 */
export function AskAxlonAboutListing(props: AskAxlonAboutListingProps) {
  useAxlonListingContext(props);

  return (
    <button
      type="button"
      onClick={() => openAxlonChat()}
      className="group flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/40"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Image
          src="/images/axlonai-logo-eyes.png"
          alt=""
          width={32}
          height={37}
          className="h-7 w-auto dark:brightness-110"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">Ask AXLON about this trailer</span>
        <span className="block text-xs text-muted-foreground">
          Price check, specs, or a quote from the seller
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

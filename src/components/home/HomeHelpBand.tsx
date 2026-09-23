'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SALES_PHONE_E164, SALES_PHONE_DISPLAY } from '@/lib/contact';

const TrailerFinderChat = dynamic(
  () => import('@/components/agents/TrailerFinderChat').then((mod) => mod.TrailerFinderChat),
  { ssr: false, loading: () => null }
);

/**
 * The buyer's way to a person-like answer: the phone line (answered 24/7 by
 * the voice agent, which searches live inventory) or the same help in chat.
 * Buyer wording on purpose; the dealer pitch for this AI lives on
 * /for-business.
 */
export function HomeHelpBand() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <section className="w-full max-w-3xl mx-auto mb-10 md:mb-14 px-4">
      <div className="rounded-2xl border bg-white/80 dark:bg-white/[0.06] p-5 md:p-7 text-center">
        <h2 className="text-lg md:text-xl font-bold mb-1.5">Looking for something specific?</h2>
        <p className="text-sm text-muted-foreground dark:text-foreground/60 max-w-md mx-auto mb-5">
          Call or chat any time, day or night. We&apos;ll search live inventory,
          answer questions about a unit, and put you in touch with the seller.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="rounded-full gap-2 w-full sm:w-auto" asChild>
            <a href={`tel:${SALES_PHONE_E164}`}>
              <Phone className="w-4 h-4" />
              Call {SALES_PHONE_DISPLAY}
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full gap-2 glass-button !bg-white/80 dark:!bg-white/10 w-full sm:w-auto"
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare className="w-4 h-4" />
            Chat now
          </Button>
        </div>
      </div>
      {/* Portalled to <body>: rendered in place, the panel inherits the page's
          z-10 stacking context and the mobile bottom nav (z-40) covers its input. */}
      {chatOpen && createPortal(<TrailerFinderChat variant="floating" initialOpen />, document.body)}
    </section>
  );
}

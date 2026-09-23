'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SALES_PHONE_E164 as PHONE_NUMBER, SALES_PHONE_DISPLAY as DISPLAY_NUMBER } from '@/lib/contact';

const TrailerFinderChat = dynamic(
  () =>
    import('@/components/agents/TrailerFinderChat').then(
      (mod) => mod.TrailerFinderChat
    ),
  { ssr: false, loading: () => null }
);


// The transcripts beside this are static — this lets visitors talk to the
// real AI, which no competitor in the space offers from their homepage.
export function TryAxlonLive() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-5 text-center">
      <p className="text-sm font-semibold mb-1">
        Try it live — call or chat with AXLON right now
      </p>
      <p className="text-xs text-muted-foreground dark:text-foreground/60 mb-4">
        Talk to the same AI your customers would.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          className="rounded-full glass-button !bg-white/80 dark:!bg-white/10 gap-2 w-full sm:w-auto"
          asChild
        >
          <a href={`tel:${PHONE_NUMBER}`}>
            <Phone className="w-4 h-4" />
            Call our AI: {DISPLAY_NUMBER}
          </a>
        </Button>
        <Button
          className="rounded-full gap-2 w-full sm:w-auto"
          onClick={() => setChatOpen(true)}
        >
          <MessageSquare className="w-4 h-4" />
          Chat with AXLON AI
        </Button>
      </div>
      {/* Portalled to <body>: rendered in place, the panel inherits the page's
          z-10 stacking context and the mobile bottom nav (z-40) covers its input. */}
      {chatOpen && createPortal(<TrailerFinderChat variant="floating" initialOpen />, document.body)}
    </div>
  );
}

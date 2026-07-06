'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrailerFinderChat = dynamic(
  () =>
    import('@/components/agents/TrailerFinderChat').then(
      (mod) => mod.TrailerFinderChat
    ),
  { ssr: false, loading: () => null }
);

const PHONE_NUMBER = '+14694213536';
const DISPLAY_NUMBER = '(469) 421-3536';

// The demos above this are static transcripts — this lets visitors talk to
// the real AI, which no competitor in the space offers from their homepage.
export function TryAxlonLive() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="mt-4 md:mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-5 text-center">
      <p className="text-sm font-semibold mb-1">
        Don&apos;t take our word for it — try it live
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
      {chatOpen && <TrailerFinderChat variant="floating" initialOpen />}
    </div>
  );
}

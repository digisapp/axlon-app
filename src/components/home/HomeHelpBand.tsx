'use client';

import Image from 'next/image';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SALES_PHONE_E164, SALES_PHONE_DISPLAY } from '@/lib/contact';
import { openAxlonChat, useAxlonChat } from '@/lib/axlon-chat';

/**
 * Where the homepage introduces AXLON by face and name. The header and footer
 * show the same face as the site mark, so without this band visitors read it
 * as a logo rather than the character who answers the phone line (24/7, via
 * the voice agent, which searches live inventory) and the chat.
 *
 * Axleyard stays the brand and AXLON is its AI, presented as the one who
 * runs the yard. Buyer wording on purpose; the dealer pitch for this AI
 * lives on /for-business.
 */
export function HomeHelpBand() {
  // "Ask AXLON" opens the site's one corner chat (AxlonLauncher) rather than
  // a second panel of its own; the face here lights up while it's open.
  const { open: chatOpen } = useAxlonChat();

  return (
    <section id="meet-axlon" className="w-full max-w-3xl mx-auto mb-10 md:mb-14 px-4 scroll-mt-24">
      <div className="rounded-2xl border bg-white/80 dark:bg-white/[0.06] p-5 md:p-7">
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:gap-7 md:text-left">
          {/* The face lights up (same treatment as /ask) while the chat is open */}
          <div
            className={cn(
              'shrink-0 transition-transform duration-500',
              chatOpen && 'logo-glow scale-105'
            )}
          >
            <Image
              src="/images/axlonai-logo-eyes.png"
              alt="AXLON"
              width={120}
              height={140}
              sizes="(min-width: 768px) 112px, 88px"
              className="w-[88px] md:w-28 h-auto dark:brightness-110"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-widest font-medium text-primary mb-1">
              Meet AXLON
            </p>
            <h2 className="text-lg md:text-xl font-bold mb-1.5">
              The AI that runs the yard
            </h2>
            <p className="text-sm text-muted-foreground dark:text-foreground/60 max-w-md mx-auto md:mx-0 mb-4">
              AXLON is available 24/7 by phone or chat. He searches live
              inventory, answers questions about any unit, and connects you
              directly with the seller when you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Button size="lg" className="rounded-full gap-2 w-full sm:w-auto" asChild>
                <a href={`tel:${SALES_PHONE_E164}`}>
                  <Phone className="w-4 h-4" />
                  Call AXLON {SALES_PHONE_DISPLAY}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full gap-2 glass-button !bg-white/80 dark:!bg-white/10 w-full sm:w-auto"
                onClick={() => openAxlonChat()}
              >
                <MessageSquare className="w-4 h-4" />
                Ask AXLON
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

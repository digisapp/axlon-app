'use client';

import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublishedHeight } from '@/lib/mobile-chrome';

interface MobileContactBarProps {
  phone?: string | null;
  email?: string | null;
  dealerName: string;
}

export function MobileContactBar({ phone, email, dealerName }: MobileContactBarProps) {
  // Publish the solid bar's height so the chat launcher (bottom-fab) and the
  // open chat panel stack above it. lg:hidden → measures 0 on desktop.
  const barRef = usePublishedHeight('--bottom-bar-h');

  if (!phone && !email) return null;

  // Dial digits only — "(555) 123-4567" works on iOS but isn't a clean URI.
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
  // Encode the subject: a raw "&" in a dealer name ends the subject early.
  const mailHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Inquiry via Axleyard - ${dealerName}`)}`
    : '';

  return (
    <div data-bottom-bar className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pointer-events-none">
      {/* Gradient fade — taps pass through it to the page */}
      <div className="h-6 bg-gradient-to-t from-white to-transparent" />

      {/* Contact Bar */}
      <div
        ref={barRef}
        className="pointer-events-auto bg-white border-t border-slate-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        {phone && (
          <Button size="lg" className="flex-1 gap-2 shadow-md" asChild>
            <a href={telHref}>
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </Button>
        )}
        {email && (
          <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
            <a href={mailHref}>
              <Mail className="w-5 h-5" />
              Email
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

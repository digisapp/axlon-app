'use client';

import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

interface MobileContactCTAProps {
  phone?: string | null;
}

export function MobileContactCTA({ phone }: MobileContactCTAProps) {
  const scrollToContactForm = () => {
    document.getElementById('contact-seller')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur border-t px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex gap-3">
        {phone && (
          <Button variant="outline" className="flex-1" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              Call
            </a>
          </Button>
        )}
        <Button className="flex-1" onClick={scrollToContactForm}>
          <Mail className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Phone } from 'lucide-react';
import { useState } from 'react';

const PHONE_NUMBER = '+14694213536';
const DISPLAY_NUMBER = '(469) 421-3536';

export function FloatingCallButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`tel:${PHONE_NUMBER}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Call AXLON AI"
    >
      {/* Expanded state with number — desktop only */}
      <div
        className={`overflow-hidden transition-all duration-300 hidden md:block ${
          isHovered ? 'max-w-[200px] pl-4' : 'max-w-0 pl-0'
        }`}
      >
        <div className="whitespace-nowrap">
          <p className="text-xs font-medium opacity-90">Call AXLON AI</p>
          <p className="text-sm font-bold">{DISPLAY_NUMBER}</p>
        </div>
      </div>

      {/* Phone icon button — smaller on mobile */}
      <div className="p-3 md:p-4 flex items-center justify-center">
        <Phone className="w-5 h-5 md:w-6 md:h-6" />
      </div>

      {/* Pulse animation ring — subtler on mobile */}
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10 md:opacity-20 pointer-events-none" />
    </a>
  );
}

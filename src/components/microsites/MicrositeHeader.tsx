import Link from 'next/link';
import { Phone, Truck } from 'lucide-react';
import type { Microsite } from '@/lib/microsites/resolve';

export function MicrositeHeader({ site }: { site: Microsite }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-white"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            <Truck className="h-4 w-4" />
          </span>
          <span className="text-base sm:text-lg">{site.name}</span>
        </Link>

        <div className="flex items-center gap-2">
          {site.phone && (
            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
          )}
          <a
            href="#quote"
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            {site.cta_label}
          </a>
        </div>
      </div>
    </header>
  );
}

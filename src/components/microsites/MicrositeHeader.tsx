import Link from 'next/link';
import { Phone, Truck } from 'lucide-react';
import type { Microsite } from '@/lib/microsites/resolve';

// Section links resolve against "/" so they also work from a product page.
const NAV = [
  { href: '/#models', label: 'Models' },
  { href: '/#inventory', label: 'In stock' },
  { href: '/#faq', label: 'FAQ' },
];

export function MicrositeHeader({ site }: { site: Microsite }) {
  const telHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, '')}` : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            <Truck className="h-[18px] w-[18px]" />
          </span>
          <span className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {telHref && (
            <a
              href={telHref}
              aria-label={`Call ${site.phone}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:px-3"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">{site.phone}</span>
            </a>
          )}
          <a
            href="#quote"
            className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            {site.cta_label}
          </a>
        </div>
      </div>
    </header>
  );
}

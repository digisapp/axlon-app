import { Truck } from 'lucide-react';
import type { Microsite } from '@/lib/microsites/resolve';

export function MicrositeFooter({
  site,
  disclaimer,
}: {
  site: Microsite;
  disclaimer: string;
}) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2.5 font-bold text-white">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--ms-accent)' }}
            >
              <Truck className="h-4 w-4" />
            </span>
            {site.name}
          </span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="https://axleyard.com" className="transition hover:text-white">
              Browse the full marketplace
            </a>
            <a href="https://axleyard.com/privacy" className="transition hover:text-white">
              Privacy
            </a>
            <a href="https://axleyard.com/terms" className="transition hover:text-white">
              Terms
            </a>
          </nav>
        </div>

        {/* Affiliation disclosure — rendered on every page of every microsite. */}
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-500">{disclaimer}</p>

        <p className="mt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Axleyard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

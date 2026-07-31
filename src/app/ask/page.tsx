import type { Metadata } from 'next';
import { AskAxlonHero } from '@/components/ask/AskAxlonHero';

// The standalone AXLON surface. Served at axleyard.com/ask, and rewritten to
// from the root of axlon.ai by middleware — keep it self-contained (no Header/
// Footer) and anonymous-friendly.
export const metadata: Metadata = {
  title: { absolute: 'AXLON — AI for Heavy Haul' },
  description:
    'Ask AXLON anything about heavy haul — lowboy trailers, semi trucks, parts, prices, and financing. AXLON searches the Axleyard marketplace and answers instantly.',
  alternates: { canonical: 'https://axlon.ai' },
  openGraph: {
    title: 'AXLON — AI for Heavy Haul',
    description:
      'Ask AXLON anything about heavy haul — trailers, trucks, parts, and prices. Powered by the Axleyard marketplace.',
    url: 'https://axlon.ai',
    siteName: 'AXLON',
  },
};

export default function AskAxlonPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-start bg-white px-4 pt-[18dvh] dark:bg-zinc-950">
      {/* Subtle radial glow behind the mascot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60dvh] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12%),transparent_65%)]"
      />

      <AskAxlonHero />

      <footer className="mt-auto flex flex-col items-center gap-1 px-4 pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center">
        <a
          href="https://axleyard.com"
          className="inline-block py-2 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-primary hover:underline dark:text-zinc-300"
        >
          Browse the full yard at axleyard.com →
        </a>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          AXLON is the AI assistant of Axleyard — the trucks, trailers &amp;
          heavy equipment marketplace.
        </p>
      </footer>
    </main>
  );
}

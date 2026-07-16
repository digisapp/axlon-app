import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { AISearchBar } from '@/components/search/AISearchBar';

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
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-4 pb-[env(safe-area-inset-bottom)] dark:bg-zinc-950">
      {/* Subtle radial glow behind the wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12%),transparent_65%)]"
      />

      <div className="relative flex w-full max-w-2xl flex-col items-center gap-8 -mt-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3 text-primary" />
            AI for the heavy haul industry
          </span>
          <h1 className="font-[family-name:var(--font-gunship)] text-5xl font-bold tracking-wider text-zinc-900 dark:text-zinc-50 md:text-6xl">
            AXLON
          </h1>
          <p className="max-w-md text-balance text-sm text-zinc-500 dark:text-zinc-400 md:text-base">
            Ask me anything — lowboy trailers, semi trucks, parts, prices, or
            financing. I&apos;ll search the yard and answer instantly.
          </p>
        </div>

        <AISearchBar
          size="large"
          autoFocus
          animatedPlaceholder
          showLanguageHint
          className="w-full"
        />
      </div>

      <footer className="absolute bottom-6 flex flex-col items-center gap-1 px-4 text-center">
        <a
          href="https://axleyard.com"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-primary hover:underline dark:text-zinc-300"
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

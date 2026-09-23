import { notFound, redirect } from 'next/navigation';
import { getMicrositeByHost, disclaimerFor } from '@/lib/microsites/resolve';
import { isDirectAppHostRequest } from '@/lib/microsites/guard';
import { MicrositeHeader } from '@/components/microsites/MicrositeHeader';
import { MicrositeFooter } from '@/components/microsites/MicrositeFooter';
import { MicrositeTracker } from '@/components/microsites/MicrositeTracker';
import { MicrositeChat } from '@/components/microsites/MicrositeChat';

// Dynamic, not cached. `revalidate` would be inert here anyway: the root
// layout reads headers() for the CSP nonce, which opts the whole route tree
// into dynamic rendering. Every microsite request therefore renders fresh —
// slower, but it means an admin edit or a status change is visible
// immediately, with no cache to bust.

export default async function MicrositeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  // /sites/<domain> is a real path on the app host (and on every other
  // microsite host) too. Serving it there would publish every microsite
  // several times — duplicate content competing with the domain it was built
  // for. Only the proxy rewrite for this domain (which sets x-microsite-host)
  // may reach these pages in production.
  if (await isDirectAppHostRequest(domain)) {
    notFound();
  }

  const site = await getMicrositeByHost(domain);

  // No row, or the row isn't live yet: send the visitor to the marketplace
  // rather than showing them a dead page. This also makes the proxy's
  // catch-all rewrite non-breaking — a domain pointed at this project that we
  // have no microsite for keeps working instead of starting to 404. Its
  // robots.txt still returns Disallow: /, so nothing gets indexed here.
  if (!site) redirect('https://axleyard.com');

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ ['--ms-accent' as string]: site.accent_color }}
    >
      <MicrositeTracker micrositeId={site.id} />
      <MicrositeHeader site={site} />
      <main className="flex-1">{children}</main>
      <MicrositeFooter site={site} disclaimer={disclaimerFor(site)} />
      <MicrositeChat micrositeId={site.id} siteName={site.name} />
    </div>
  );
}

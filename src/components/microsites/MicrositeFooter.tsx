import type { Microsite } from '@/lib/microsites/resolve';

export function MicrositeFooter({
  site,
  disclaimer,
}: {
  site: Microsite;
  disclaimer: string;
}) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-semibold text-foreground">{site.name}</span>
          <nav className="flex flex-wrap gap-4">
            <a href="https://axleyard.com" className="hover:text-foreground">
              Browse the full marketplace
            </a>
            <a href="https://axleyard.com/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="https://axleyard.com/terms" className="hover:text-foreground">
              Terms
            </a>
          </nav>
        </div>

        {/* Affiliation disclosure — rendered on every page of every microsite. */}
        <p className="max-w-3xl text-xs leading-relaxed">{disclaimer}</p>

        <p className="text-xs">
          © {new Date().getFullYear()} Axleyard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

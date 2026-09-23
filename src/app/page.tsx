import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Search, Phone } from 'lucide-react';
import {
  LowboyTrailerIcon,
  FlatbedTrailerIcon,
  SleeperTruckIcon,
  DayCabTruckIcon,
  HeavyEquipmentIcon,
  AllCategoriesIcon,
} from '@/components/home/CategoryIcons';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSearchSection } from '@/components/home/HomeSearchSection';
import { HomeDeals } from '@/components/home/HomeDeals';
import { HomeHelpBand } from '@/components/home/HomeHelpBand';
import { SALES_PHONE_E164, SALES_PHONE_DISPLAY } from '@/lib/contact';
import { getHomeDeals, getHomeStats, roundStat } from '@/lib/home-data';
import { jsonLdString } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

// The root layout's headers() call keeps this route dynamic, so freshness is
// enforced by the TTL cache in home-data.ts; this export documents intent and
// takes effect if the route ever becomes cacheable.
export const revalidate = 300;

const CATEGORY_TILES = [
  { name: 'Lowboy Trailers', href: '/search?category=lowboy-trailers', icon: LowboyTrailerIcon },
  { name: 'Flatbed Trailers', href: '/search?category=flatbed-trailers', icon: FlatbedTrailerIcon },
  { name: 'Sleeper Trucks', href: '/search?category=sleeper-trucks', icon: SleeperTruckIcon },
  { name: 'Day Cab Trucks', href: '/search?category=day-cab-trucks', icon: DayCabTruckIcon },
  { name: 'Heavy Equipment', href: '/search?category=heavy-equipment', icon: HeavyEquipmentIcon },
  { name: 'All Categories', href: '/categories', icon: AllCategoriesIcon },
];

const SERVICE_LINKS = [
  { name: 'Financing', href: '/finance' },
  { name: 'Trade-In', href: '/trade-in' },
  { name: 'New Trailer Catalog', href: '/new-trailers' },
  { name: 'Below-Market Deals', href: '/deals' },
];

function HomePageJsonLd({ activeListings }: { activeListings: number | null }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Axleyard',
    url: 'https://axleyard.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered marketplace for buying and selling trucks, trailers, and heavy equipment. Search with natural language, get smart pricing, and list equipment instantly.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      // Structured data must reflect the live inventory, not a marketing figure
      ...(activeListings ? { offerCount: String(activeListings) } : {}),
      lowPrice: '5000',
      highPrice: '500000',
    },
    provider: {
      '@type': 'Organization',
      name: 'Axleyard',
      url: 'https://axleyard.com',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
    />
  );
}

export default async function HomePage() {
  const [deals, stats] = await Promise.all([getHomeDeals(), getHomeStats()]);

  return (
    <div className="min-h-dvh flex flex-col gradient-bg relative overflow-hidden">
      <HomePageJsonLd activeListings={stats.activeListings} />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt=""
              width={28}
              height={32}
              className="h-7 w-auto"
            />
            <span className="font-bold text-2xl font-[family-name:var(--font-gunship)] tracking-wider">AXLE<span className="text-primary">YARD</span></span>
          </Link>
          <HomeHeader />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 md:pt-20 px-4">

        {/* Hero: Logo + Search */}
        <HomeSearchSection />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 md:mb-10 w-full max-w-sm sm:max-w-none sm:w-auto px-2">
          <Button
            size="lg"
            className="gap-2 rounded-full shadow-lg shadow-primary/20 group w-full sm:w-auto"
            asChild
          >
            <Link href="/search">
              <Search className="w-4 h-4" />
              Browse Equipment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 rounded-full glass-button !bg-white/80 dark:!bg-white/10 w-full sm:w-auto"
            asChild
          >
            <a href={`tel:${SALES_PHONE_E164}`}>
              <Phone className="w-4 h-4" />
              Call {SALES_PHONE_DISPLAY}
            </a>
          </Button>
        </div>

        {/* Browse by Category */}
        <section className="w-full max-w-4xl mx-auto mb-8 md:mb-10 px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {CATEGORY_TILES.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-xl border bg-white/80 dark:bg-white/[0.08] p-3 md:p-4 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <Icon className="h-6 w-auto md:h-7 text-primary" />
                <span className="text-[11px] md:text-xs font-medium text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {SERVICE_LINKS.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground hover:text-primary rounded-full border px-3 py-2.5 md:py-1.5 bg-white/60 dark:bg-white/[0.05] transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* Hot Deals */}
        <HomeDeals deals={deals} />

        {/* Marketplace stats */}
        {(stats.activeListings ?? 0) >= 100 && (
          <section className="w-full max-w-3xl mx-auto mb-8 md:mb-12 px-4">
            <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4 text-center">
              <div>
                <p className="text-xl md:text-2xl font-bold">{Number(roundStat(stats.activeListings!)).toLocaleString('en-US')}+</p>
                <p className="text-xs text-muted-foreground dark:text-foreground/50">units for sale</p>
              </div>
              {(stats.sellers ?? 0) >= 100 && (
                <div>
                  <p className="text-xl md:text-2xl font-bold">{Number(roundStat(stats.sellers!)).toLocaleString('en-US')}+</p>
                  <p className="text-xs text-muted-foreground dark:text-foreground/50">dealers &amp; sellers</p>
                </div>
              )}
              <div>
                <p className="text-xl md:text-2xl font-bold">24/7</p>
                <p className="text-xs text-muted-foreground dark:text-foreground/50">help by phone &amp; chat</p>
              </div>
            </div>
          </section>
        )}

        {/* Trusted Brands */}
        <section className="w-full max-w-5xl mx-auto mb-8 md:mb-12 px-4">
          <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center mb-4 uppercase tracking-widest font-medium">
            Equipment from the brands you know
          </p>
          <div className="flex items-center justify-center gap-x-6 gap-y-4 md:gap-x-8 flex-wrap opacity-60 dark:opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <Image src="/images/brands/peterbilt.svg" alt="Peterbilt" width={90} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/freightliner.svg" alt="Freightliner" width={120} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/kenworth.png" alt="Kenworth" width={120} height={30} className="h-6 md:h-7 w-auto dark:invert" />
            <Image src="/images/brands/caterpillar.svg" alt="Caterpillar" width={100} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/trail-king.png" alt="Trail King" width={120} height={20} className="h-4 md:h-5 w-auto dark:invert" />
            <Image src="/images/brands/mack.svg" alt="Mack Trucks" width={100} height={49} className="h-8 md:h-9 w-auto dark:invert" />
            <Image src="/images/brands/john-deere.svg" alt="John Deere" width={176} height={121} className="h-9 md:h-10 w-auto dark:invert" />
            <Image src="/images/brands/volvo.svg" alt="Volvo Trucks" width={188} height={27} className="h-3 md:h-4 w-auto dark:invert" />
          </div>
        </section>

        {/* Help by phone or chat — the same AI that answers the phone line */}
        <HomeHelpBand />

        {/* Sellers: one strip. The dealer pitch lives on /for-business; dealers
            are reached by calls and email, not the buyers who land here. */}
        <section className="w-full max-w-3xl mx-auto mb-10 md:mb-14 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6 text-center md:text-left">
            <div>
              <h2 className="text-lg font-bold mb-1">Selling equipment?</h2>
              <p className="text-sm text-muted-foreground dark:text-foreground/60">
                List it free and reach buyers nationwide.{' '}
                <Link href="/for-business" className="text-primary hover:underline whitespace-nowrap">
                  Dealer tools &rarr;
                </Link>
              </p>
            </div>
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full md:w-auto shrink-0" asChild>
              <Link href="/signup">
                <Zap className="w-4 h-4" />
                List Equipment Free
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 md:py-10 px-4 border-t border-foreground/10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt=""
              width={18}
              height={20}
              className="h-5 w-auto"
            />
            <p className="text-xs md:text-sm text-muted-foreground">
              &copy; 2026 <span className="font-[family-name:var(--font-gunship)]">AXLEYARD</span>. All rights reserved.
              {' · '}
              <a href={`tel:${SALES_PHONE_E164}`} className="hover:text-foreground whitespace-nowrap">
                {SALES_PHONE_DISPLAY}
              </a>
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center md:justify-end gap-x-5 max-w-2xl">
            <FooterLink href="/search">Marketplace</FooterLink>
            <FooterLink href="/categories">Categories</FooterLink>
            <FooterLink href="/new-trailers">New Trailers</FooterLink>
            <FooterLink href="/deals">Deals</FooterLink>
            <FooterLink href="/finance">Financing</FooterLink>
            <FooterLink href="/for-business">For Dealers</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/dealers">Directory</FooterLink>
            <FooterLink href="/transform">Transform</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block py-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}

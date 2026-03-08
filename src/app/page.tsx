import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, RefreshCw, CalendarDays, Calculator, Truck, Store, Construction, Wrench, Bot, PhoneCall, BarChart3 } from 'lucide-react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSearchSection } from '@/components/home/HomeSearchSection';
import { HomeDeals } from '@/components/home/HomeDeals';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

function HomePageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AXLON AI',
    url: 'https://axlon.ai',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered marketplace for buying and selling trucks, trailers, and heavy equipment. Search with natural language, get smart pricing, and list equipment instantly.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: '5000+',
      lowPrice: '5000',
      highPrice: '500000',
    },
    provider: {
      '@type': 'Organization',
      name: 'AXLON AI',
      url: 'https://axlon.ai',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      <HomePageJsonLd />
      {/* Subtle noise texture */}
      <div className="noise-overlay" />

      {/* Top Banner - SSR for SEO */}
      <div className="relative z-10 w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20 py-2.5 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="relative flex items-center justify-center gap-2">
          <div className="hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <p className="text-center text-sm text-foreground/90">
            The <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AI-powered</span> marketplace for trucks, trailers & equipment
          </p>
        </div>
      </div>

      {/* Header - SSR shell + client auth */}
      <header className="relative z-10 w-full px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="AXLON AI"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="font-semibold text-sm">AXLON AI</span>
          </Link>
          <HomeHeader />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 md:pt-16 px-4">
        {/* Client: Logo animation + Search Bar */}
        <HomeSearchSection />

        {/* Quick Search Chips - SSR for SEO crawlability */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10 px-4">
          <Link
            href="/search?category=lowboy-trailers&sort=price"
            className="px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            Lowboy Deals
          </Link>
          <Link
            href="/search?category=sleeper-trucks&sort=price"
            className="px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            Sleeper Deals
          </Link>
          <Link
            href="/search?category=flatbed-trailers&sort=price"
            className="px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            Flatbed Deals
          </Link>
          <Link
            href="/new-trailers"
            className="px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            New Trailers
          </Link>
          <Link
            href="/deals"
            className="px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            View All Deals
          </Link>
        </div>

        {/* Action Buttons - SSR for SEO */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12 w-full sm:w-auto px-4">
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full shadow-lg shadow-primary/20 group"
            asChild
          >
            <Link href="/search">
              <Zap className="w-4 h-4" />
              Browse Listings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full glass-button !bg-white/80 dark:!bg-white/10"
            asChild
          >
            <Link href="/new-trailers">
              <Truck className="w-4 h-4" />
              New Trailers
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full glass-button !bg-white/80 dark:!bg-white/10"
            asChild
          >
            <Link href="/dealers">
              <Store className="w-4 h-4" />
              Dealers
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full glass-button !bg-white/80 dark:!bg-white/10"
            asChild
          >
            <Link href="/finance">
              <Calculator className="w-4 h-4" />
              Finance
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full glass-button !bg-white/80 dark:!bg-white/10"
            asChild
          >
            <Link href="/trade-in">
              <RefreshCw className="w-4 h-4" />
              Trade-In
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto rounded-full glass-button !bg-white/80 dark:!bg-white/10"
            asChild
          >
            <Link href="/search?listing_type=rent">
              <CalendarDays className="w-4 h-4" />
              Rentals
            </Link>
          </Button>
        </div>

        {/* Client: Hot Deals Section */}
        <HomeDeals />

        {/* Industry Solutions */}
        <section className="w-full max-w-5xl mx-auto mb-12 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">AI Tools for Every Industry</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Purpose-built solutions for heavy equipment professionals</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/industries/transport"
              className="group p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">Heavy Haul & Transport</h3>
              <p className="text-sm text-muted-foreground">AI lead capture, fleet analytics, and equipment listings for heavy haul companies.</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3 font-medium">
                Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/industries/crane"
              className="group p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 dark:hover:border-orange-800 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                <Construction className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-orange-600 transition-colors">Crane & Rigging</h3>
              <p className="text-sm text-muted-foreground">24/7 AI assistant, smart lead qualification, and crane fleet management tools.</p>
              <span className="inline-flex items-center gap-1 text-sm text-orange-600 mt-3 font-medium">
                Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/industries/rigging"
              className="group p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-emerald-600 transition-colors">Rigging & Heavy Lift</h3>
              <p className="text-sm text-muted-foreground">Project pipeline tracking, AI inquiries, and rigging equipment marketplace.</p>
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600 mt-3 font-medium">
                Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          <p className="text-center mt-6">
            <Link href="/get-started" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
              Get started free <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </section>

        {/* For Dealers Section */}
        <section className="w-full max-w-5xl mx-auto mb-12 px-4">
          <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Are you a dealer?</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Replace your DMS, CRM, and answering service with one AI-powered platform.
                Dealers save $100,000+ per year.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 border">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">AI Sales Assistant</p>
                  <p className="text-xs text-muted-foreground">Captures leads 24/7, trained on your inventory</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 border">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">AI Voice Agent</p>
                  <p className="text-xs text-muted-foreground">Answers phones, qualifies leads, never misses a call</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 border">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">CRM + Deal Desk</p>
                  <p className="text-xs text-muted-foreground">Pipeline, quotes, floor plan tracking — all in one</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="rounded-full gap-2" asChild>
                <Link href="/pricing">
                  View Pricing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full glass-button !bg-white/80 dark:!bg-white/10" asChild>
                <Link href="/contact?plan=demo">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SEO: Hidden crawlable content for search engines */}
        <section className="sr-only" aria-label="About AXLON AI">
          <h1>AXLON AI - AI-Powered Truck & Equipment Marketplace</h1>
          <p>
            Find and buy trucks, trailers, and heavy equipment with AI-powered search.
            Browse lowboy trailers, semi trucks, flatbed trailers, sleeper trucks, dump trucks,
            and more from dealers and private sellers across the United States.
          </p>
          <h2>Popular Categories</h2>
          <ul>
            <li><Link href="/search?category=lowboy-trailers">Lowboy Trailers</Link></li>
            <li><Link href="/search?category=sleeper-trucks">Sleeper Trucks</Link></li>
            <li><Link href="/search?category=flatbed-trailers">Flatbed Trailers</Link></li>
            <li><Link href="/search?category=day-cab-trucks">Day Cab Trucks</Link></li>
            <li><Link href="/search?category=heavy-equipment">Heavy Equipment</Link></li>
            <li><Link href="/categories">All Categories</Link></li>
          </ul>
          <h2>Services</h2>
          <ul>
            <li><Link href="/finance">Commercial Truck & Trailer Financing</Link></li>
            <li><Link href="/trade-in">Trade-In Your Equipment</Link></li>
            <li><Link href="/new-trailers">New Trailer Catalog</Link></li>
            <li><Link href="/deals">Below Market Deals</Link></li>
          </ul>
        </section>
      </main>

      {/* Footer - SSR for SEO crawlability */}
      <footer className="relative z-10 py-8 md:py-10 px-4 border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="AXLON AI"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <p className="text-xs md:text-sm text-muted-foreground">
              &copy; 2026 AXLON AI. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <FooterLink href="/trade-in">Trade-In</FooterLink>
            <FooterLink href="/tools/axle-weight-calculator">Weight Calculator</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/get-started">Business Login</FooterLink>
            <FooterLink href="/dealers">Dealers</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}

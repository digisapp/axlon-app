import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Bot, PhoneCall, BarChart3, Check, Search } from 'lucide-react';
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
      <div className="noise-overlay" />

      {/* Top Banner */}
      <div className="relative z-10 w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20 py-2.5 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="relative flex items-center justify-center gap-2">
          <div className="hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <p className="text-center text-sm text-foreground/90">
            AI that <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">runs your business</span> — from lead to close
          </p>
        </div>
      </div>

      {/* Header */}
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
      <main className="relative z-10 flex-1 flex flex-col items-center pt-4 md:pt-16 px-4">

        {/* Hero: Logo + Search + 2 CTAs */}
        <HomeSearchSection />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 md:mb-10 w-full sm:w-auto px-4">
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
            <Link href="/new-trailers">
              New Trailers
            </Link>
          </Button>
        </div>

        {/* Hot Deals — keeps the marketplace alive & interactive */}
        <HomeDeals />

        {/* Platform Features — the money-makers */}
        <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Business Services. Powered by AI.</h2>
          <p className="text-sm text-muted-foreground text-center mb-6 md:mb-8 max-w-lg mx-auto">
            Replace your DMS, CRM, answering service, and BDC team with AXLON AI.
          </p>
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {/* AI Sales Assistant */}
            <div className="p-4 md:p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2">AI Sales Assistant</h3>
              <p className="text-sm text-muted-foreground mb-3 md:mb-4">
                Trained on your inventory. Answers buyer questions, captures leads, and follows up — 24/7.
              </p>
              <ul className="space-y-1.5 md:space-y-2">
                <FeatureCheck>Instant lead capture & qualification</FeatureCheck>
                <FeatureCheck>Trained on your specific inventory</FeatureCheck>
                <FeatureCheck>Multi-language support</FeatureCheck>
              </ul>
            </div>

            {/* AI Voice Agent */}
            <div className="p-4 md:p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3 md:mb-4">
                <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2">AI Voice Agent</h3>
              <p className="text-sm text-muted-foreground mb-3 md:mb-4">
                Answers your phones like a real person. Qualifies callers, books appointments, never misses a lead.
              </p>
              <ul className="space-y-1.5 md:space-y-2">
                <FeatureCheck>Dedicated phone number</FeatureCheck>
                <FeatureCheck>500 minutes included</FeatureCheck>
                <FeatureCheck>Call transcripts & summaries</FeatureCheck>
              </ul>
            </div>

            {/* CRM + Deal Desk */}
            <div className="p-4 md:p-6 rounded-xl border bg-white/80 dark:bg-white/5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 md:mb-4">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2">CRM + Deal Desk</h3>
              <p className="text-sm text-muted-foreground mb-3 md:mb-4">
                Full pipeline management with AI-powered deal scoring, automated outreach, and floor plan tracking.
              </p>
              <ul className="space-y-1.5 md:space-y-2">
                <FeatureCheck>AI deal scoring & priority</FeatureCheck>
                <FeatureCheck>Automated email/SMS campaigns</FeatureCheck>
                <FeatureCheck>Floor plan & inventory analytics</FeatureCheck>
              </ul>
            </div>
          </div>
        </section>


        {/* Final CTA */}
        <section className="w-full max-w-3xl mx-auto mb-10 md:mb-12 px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Ready to AI your business?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full glass-button !bg-white/80 dark:!bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/how-it-works#pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </section>

        {/* SEO: Hidden crawlable content */}
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
          <h2>For Dealers</h2>
          <ul>
            <li><Link href="/how-it-works#pricing">AI Platform Pricing</Link></li>
            <li><Link href="/contact?plan=demo">Book a Demo</Link></li>
            <li><Link href="/dashboard/listings/new">List Equipment</Link></li>
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

      {/* Footer */}
      <footer className="relative z-10 py-6 md:py-10 px-4 border-t border-white/10 mt-auto">
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
          <div className="grid grid-cols-4 sm:flex gap-3 sm:gap-6 text-center sm:text-left">
            <FooterLink href="/new-trailers">New Trailers</FooterLink>
            <FooterLink href="/how-it-works#pricing">Pricing</FooterLink>
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

function FeatureCheck({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      {children}
    </li>
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

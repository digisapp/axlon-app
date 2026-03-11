import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Bot, Headphones, Check, Search, Truck, Building2, Wrench, Package, MessageSquare, Phone, Brain } from 'lucide-react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSearchSection } from '@/components/home/HomeSearchSection';
import { HomeDeals } from '@/components/home/HomeDeals';
import { createClient } from '@/lib/supabase/server';

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

const categories = [
  { label: 'Semi Trucks', slug: 'semi-trucks' },
  { label: 'Lowboy Trailers', slug: 'lowboy-trailers' },
  { label: 'Flatbed Trailers', slug: 'flatbed-trailers' },
  { label: 'Dump Trucks', slug: 'dump-trucks' },
  { label: 'Heavy Equipment', slug: 'heavy-equipment' },
  { label: 'Sleeper Trucks', slug: 'sleeper-trucks' },
];

const builtForItems = [
  { icon: Truck, label: 'Dealers' },
  { icon: Building2, label: 'Brokers' },
  { icon: Wrench, label: 'Service Businesses' },
  { icon: Package, label: 'Heavy Haul' },
];

export default async function HomePage() {
  // Fetch real stats for trust signals
  let listingCount = 0;
  let dealerCount = 0;
  try {
    const supabase = await createClient();
    const [{ count: listings }, { count: dealers }] = await Promise.all([
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_dealer', true).not('slug', 'is', null),
    ]);
    listingCount = listings || 0;
    dealerCount = dealers || 0;
  } catch {
    // Fallback to 0 if DB unavailable
  }

  const formattedListings = listingCount >= 1000
    ? `${Math.floor(listingCount / 1000)}k+`
    : listingCount > 0 ? `${listingCount}+` : '0';

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
            The <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AI platform</span> for equipment dealers
          </p>
          <Link
            href="/how-it-works"
            className="text-xs font-medium text-primary hover:underline ml-1"
          >
            For Dealers
          </Link>
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

        {/* Hero: Logo + Search */}
        <HomeSearchSection />

        {/* CTAs */}
        <div className="flex flex-row justify-center gap-3 mb-6 md:mb-10 w-full sm:w-auto px-4">
          <Button
            size="lg"
            className="gap-2 rounded-full shadow-lg shadow-primary/20 group flex-1 sm:flex-none"
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
            className="gap-2 rounded-full glass-button !bg-white/80 dark:!bg-white/10 flex-1 sm:flex-none"
            asChild
          >
            <Link href="/how-it-works">
              For Dealers
            </Link>
          </Button>
        </div>

        {/* Hot Deals */}
        <HomeDeals />

        {/* Dealer Platform Section */}
        <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Run Your Dealership with AI</h2>
          <p className="text-sm text-muted-foreground text-center mb-6 md:mb-8 max-w-xl mx-auto">
            Replace your DMS, CRM, answering service, and BDC team — all in one platform.
          </p>

          {/* Two Product Cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* AI Platform Card */}
            <Link href="/how-it-works" className="block group">
              <div className="p-5 md:p-7 rounded-xl border bg-white/80 dark:bg-white/5 hover:shadow-lg transition-shadow h-full">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1">AI Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sales assistant, CRM & automation
                </p>
                <ul className="space-y-2 mb-5">
                  <FeatureCheck>AI sales assistant trained on your inventory</FeatureCheck>
                  <FeatureCheck>Built-in CRM with deal scoring</FeatureCheck>
                  <FeatureCheck>Automated email & SMS follow-ups</FeatureCheck>
                  <FeatureCheck>Lead capture & qualification 24/7</FeatureCheck>
                </ul>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-bold text-primary">$399</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Learn more &rarr;
                </span>
              </div>
            </Link>

            {/* Voice Agents Card */}
            <Link href="/voice" className="block group">
              <div className="p-5 md:p-7 rounded-xl border bg-white/80 dark:bg-white/5 hover:shadow-lg transition-shadow h-full">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1">Voice Agents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  24/7 phone answering & lead capture
                </p>
                <ul className="space-y-2 mb-5">
                  <FeatureCheck>Answers calls like a real person</FeatureCheck>
                  <FeatureCheck>Qualifies callers & books appointments</FeatureCheck>
                  <FeatureCheck>Dedicated phone number included</FeatureCheck>
                  <FeatureCheck>Call transcripts & lead summaries</FeatureCheck>
                </ul>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-bold text-cyan-600">$499</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <span className="text-sm font-medium text-cyan-600 group-hover:underline">
                  Learn more &rarr;
                </span>
              </div>
            </Link>
          </div>

          {/* Built For Row */}
          <div className="bg-white/40 dark:bg-white/5 rounded-2xl border p-5">
            <p className="text-xs font-medium text-muted-foreground text-center mb-3 uppercase tracking-wider">Built for</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {builtForItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-foreground/80">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <Brain className="w-3 h-3" />
              See AI in Action
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">AI that works while you sleep</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              From answering calls to qualifying leads — here&apos;s what AXLON does for your dealership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* AI Conversation Demo */}
            <div className="rounded-xl border bg-white/80 dark:bg-white/5 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Sales Assistant</p>
                  <p className="text-xs text-muted-foreground">Handles buyer inquiries 24/7</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Buyer message */}
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Do you have any lowboy trailers under $60k?</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Yes! We have 3 lowboy trailers under $60k right now. Our best deal is a <strong>2023 Trail King TK110HDG</strong> — 55-ton, 26&apos; well, hydraulic detachable. Listed at $54,900. Want me to send specs and photos?</p>
                  </div>
                </div>
                {/* Buyer */}
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Yes, and can I schedule a viewing?</p>
                  </div>
                </div>
                {/* AI */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Absolutely! I have availability tomorrow at 10am or 2pm. Which works better? I&apos;ll send you the details and a link with all the specs.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground text-center">AI qualified this lead and booked the appointment automatically</p>
              </div>
            </div>

            {/* Voice Agent Demo */}
            <div className="rounded-xl border bg-white/80 dark:bg-white/5 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Voice Agent</p>
                  <p className="text-xs text-muted-foreground">Answers calls like a real person</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Call transcript style */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-cyan-600 shrink-0 mt-0.5">AXLON:</span>
                    <p className="text-muted-foreground">&quot;Good afternoon, thanks for calling ABC Truck Sales. This is AXLON, how can I help you today?&quot;</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-foreground/70 shrink-0 mt-0.5">Caller:</span>
                    <p className="text-muted-foreground">&quot;Hi, I&apos;m looking for a flatbed trailer, 48-foot, something under $40k.&quot;</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-cyan-600 shrink-0 mt-0.5">AXLON:</span>
                    <p className="text-muted-foreground">&quot;Great, we actually have two 48-foot flatbeds in that range. Let me get your name and email so I can send you the details with photos and pricing.&quot;</p>
                  </div>
                </div>

                {/* Lead summary card */}
                <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1.5">Lead Captured</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <span>Name: John D.</span>
                    <span>Intent: High</span>
                    <span>Looking for: Flatbed 48&apos;</span>
                    <span>Budget: &lt;$40k</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground text-center">This call came in at 8:47 PM — after business hours</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button variant="outline" size="sm" className="rounded-full gap-2 group" asChild>
              <Link href="/become-a-dealer">
                See how it works for your dealership
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="w-full max-w-4xl mx-auto mb-10 md:mb-16 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: formattedListings, label: 'Active Listings' },
              { value: `${dealerCount}+`, label: 'Dealers' },
              { value: '24/7', label: 'AI Availability' },
              { value: '100%', label: 'Free to Browse' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4 rounded-xl bg-white/50 dark:bg-white/5 border">
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Categories */}
        <section className="w-full max-w-4xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">Popular Categories</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="rounded-full border bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 px-4 py-2 text-sm transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-3xl mx-auto mb-10 md:mb-12 px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Start selling equipment with AI</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full glass-button !bg-white/80 dark:!bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/contact?plan=demo">
                Book a Demo
              </Link>
            </Button>
          </div>
        </section>

        {/* SEO: Hidden crawlable content */}
        <section className="sr-only" aria-label="About AXLON AI">
          <h1>AXLON AI — AI Platform for Equipment Dealers</h1>
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

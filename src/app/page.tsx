import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Search, MessageSquare, Phone, Brain, TrendingUp, UserCheck, Settings, Check, X } from 'lucide-react';
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
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AI marketplace</span> for trucks, trailers &amp; equipment
          </p>
          <Link
            href="/for-business"
            className="text-xs font-medium text-primary hover:underline ml-1"
          >
            + AI Tools for Business
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
            <span className="font-bold text-2xl font-[family-name:var(--font-gunship)] tracking-wider">AXLON <span className="text-primary">AI</span></span>
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
            <Link href="/signup">
              <Zap className="w-4 h-4" />
              List Equipment Free
            </Link>
          </Button>
        </div>

        {/* Hot Deals */}
        <HomeDeals />

        {/* Trusted Brands */}
        <section className="w-full max-w-4xl mx-auto mb-8 md:mb-12 px-4">
          <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center mb-4 uppercase tracking-widest font-medium">
            Trusted brands on AXLON
          </p>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap opacity-60 dark:opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <Image src="/images/brands/peterbilt.svg" alt="Peterbilt" width={90} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/freightliner.svg" alt="Freightliner" width={120} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/kenworth.png" alt="Kenworth" width={120} height={30} className="h-6 md:h-7 w-auto dark:invert" />
            <Image src="/images/brands/caterpillar.svg" alt="Caterpillar" width={100} height={36} className="h-7 md:h-8 w-auto dark:invert" />
            <Image src="/images/brands/trail-king.png" alt="Trail King" width={120} height={20} className="h-4 md:h-5 w-auto dark:invert" />
            <Image src="/images/brands/mack.svg" alt="Mack Trucks" width={100} height={30} className="h-6 md:h-7 w-auto dark:invert" />
            <Image src="/images/brands/john-deere.svg" alt="John Deere" width={120} height={30} className="h-6 md:h-7 w-auto dark:invert" />
            <Image src="/images/brands/volvo.svg" alt="Volvo Trucks" width={100} height={30} className="h-6 md:h-7 w-auto dark:invert" />
          </div>
        </section>

        {/* 3 Ways AXLON Helps */}
        <section className="w-full max-w-4xl mx-auto mb-6 md:mb-16 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Sell more equipment</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60">AI captures every lead, day and night</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Never miss a lead</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60">AI answers calls and chats 24/7</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Run your business with AI</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60">Inventory, CRM, deals — one platform</p>
            </div>
          </div>
        </section>

        {/* See AI in Action */}
        <section className="w-full max-w-5xl mx-auto mb-6 md:mb-16 px-4">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <Brain className="w-3 h-3" />
              See AI in Action
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">AI that works while you sleep</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* AI Conversation Demo */}
            <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Sales Assistant</p>
                  <p className="text-xs text-muted-foreground dark:text-foreground/50">Handles buyer inquiries 24/7</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Do you have any lowboy trailers under $100k?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Yes! We have 3 right now. Best deal: <strong>2023 Trail King TK110HDG</strong> — 55-ton, hydraulic detachable, $92,500. Want specs and photos?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">Yes, and can I schedule a viewing?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm">I have tomorrow at 10am or 2pm. Which works? I&apos;ll send you all the details.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center">Lead qualified and appointment booked — automatically</p>
              </div>
            </div>

            {/* Voice Agent Demo */}
            <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Voice Agent</p>
                  <p className="text-xs text-muted-foreground dark:text-foreground/50">Answers calls like a real person</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">AXLON:</span>
                    <p className="text-muted-foreground dark:text-foreground/70">&quot;Thanks for calling ABC Truck Sales. How can I help you?&quot;</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-foreground/70 dark:text-foreground/80 shrink-0 mt-0.5">Caller:</span>
                    <p className="text-muted-foreground dark:text-foreground/70">&quot;I&apos;m looking for a 48-foot flatbed under $55k.&quot;</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">AXLON:</span>
                    <p className="text-muted-foreground dark:text-foreground/70">&quot;We have two in that range. Let me get your info so I can send details with photos and pricing.&quot;</p>
                  </div>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1.5">Lead Captured</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground dark:text-foreground/60">
                    <span>Name: John D.</span>
                    <span>Intent: High</span>
                    <span>Looking for: Flatbed 48&apos;</span>
                    <span>Budget: &lt;$55k</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center">This call came in at 8:47 PM — after hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes AXLON Different */}
        <section className="w-full max-w-3xl mx-auto mb-6 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">What Makes AXLON Different</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground/60 text-center mb-6 max-w-lg mx-auto">
            One AI platform replaces the tools you&apos;re juggling today.
          </p>
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-bold text-primary">AXLON AI</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-muted-foreground">TruckPaper</th>
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-muted-foreground">Salesforce</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {([
                  { feature: 'AI voice agent (answers calls 24/7)', axlon: true, tp: false, sf: false },
                  { feature: 'AI chat assistant for buyers', axlon: true, tp: false, sf: false },
                  { feature: 'Built-in CRM & deal desk', axlon: true, tp: false, sf: true },
                  { feature: 'Inventory management', axlon: true, tp: false, sf: false },
                  { feature: 'Equipment marketplace', axlon: true, tp: true, sf: false },
                  { feature: 'AI lead capture & qualification', axlon: true, tp: false, sf: 'add-on' },
                  { feature: 'Financing & trade-in tools', axlon: true, tp: false, sf: false },
                  { feature: 'Built for equipment businesses', axlon: true, tp: true, sf: false },
                  { feature: 'No per-seat pricing', axlon: true, tp: true, sf: false },
                ] as { feature: string; axlon: boolean | string; tp: boolean | string; sf: boolean | string }[]).map((row) => (
                  <tr key={row.feature}>
                    <td className="py-2.5 px-2 sm:px-4 text-foreground/80 dark:text-foreground/70 break-words">{row.feature}</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center">
                      <Check className="w-4.5 h-4.5 text-primary mx-auto" />
                    </td>
                    <td className="py-2.5 px-2 sm:px-4 text-center">
                      {row.tp === true ? (
                        <Check className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                      ) : row.tp === 'add-on' ? (
                        <span className="text-xs text-muted-foreground">Add-on</span>
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 sm:px-4 text-center">
                      {row.sf === true ? (
                        <Check className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                      ) : row.sf === 'add-on' ? (
                        <span className="text-xs text-muted-foreground">Add-on</span>
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center mt-3">
            Purpose-built for heavy haul, crane & rigging, and equipment businesses.
          </p>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-3xl mx-auto mb-10 md:mb-12 px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Sell more equipment with AI</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground/60 mb-5">
            List your inventory, get a branded storefront, and let AI capture leads for you — free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto" asChild>
              <Link href="/signup">
                List Equipment Free
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
          <h1>AXLON AI — AI Platform for Equipment Businesses</h1>
          <p>
            Find and buy trucks, trailers, and heavy equipment with AI-powered search.
            Browse lowboy trailers, semi trucks, flatbed trailers, sleeper trucks, dump trucks,
            and more from businesses and private sellers across the United States.
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
          <h2>For Business</h2>
          <ul>
            <li><Link href="/transform">AI Transformation Program</Link></li>
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
      <footer className="relative z-10 py-6 md:py-10 px-4 border-t border-foreground/10 mt-auto">
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
              &copy; 2026 <span className="font-[family-name:var(--font-gunship)]">AXLON AI</span>. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:flex gap-3 sm:gap-6 text-center sm:text-left">
            <FooterLink href="/new-trailers">New Trailers</FooterLink>
            <FooterLink href="/transform">Transform</FooterLink>
            <FooterLink href="/dealers">Directory</FooterLink>
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

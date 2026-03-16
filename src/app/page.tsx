import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Bot, Headphones, Search, MessageSquare, Phone, Brain, Upload, PhoneCall, Handshake, TrendingUp, UserCheck, Settings } from 'lucide-react';
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
            <span className="font-bold text-xl font-[family-name:var(--font-gunship)] tracking-wide">AXLON <span className="text-primary">AI</span></span>
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
            <Link href="/get-started">
              <Zap className="w-4 h-4" />
              Try AXLON Free
            </Link>
          </Button>
        </div>

        {/* Hot Deals */}
        <HomeDeals />

        {/* 3 Ways AXLON Helps Dealers */}
        <section className="w-full max-w-4xl mx-auto mb-10 md:mb-16 px-4">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Sell more equipment</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60 hidden sm:block">AI captures every lead, day and night</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Never miss a lead</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60 hidden sm:block">AI answers calls and chats 24/7</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">Run your dealership with AI</h3>
              <p className="text-xs text-muted-foreground dark:text-foreground/60 hidden sm:block">Inventory, CRM, deals — one platform</p>
            </div>
          </div>
        </section>

        {/* Product Overview — simplified pillars, no pricing */}
        <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">One platform. Everything you need.</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground/60 text-center mb-6 md:mb-8 max-w-xl mx-auto">
            Replace your DMS, CRM, answering service, and BDC team — all in one platform.
          </p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-6">
            {/* AI Platform */}
            <Link href="/how-it-works" className="block group">
              <div className="p-5 md:p-6 rounded-xl border bg-white/80 dark:bg-white/[0.08] hover:shadow-lg transition-shadow h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">AI Platform</h3>
                <p className="text-sm text-muted-foreground dark:text-foreground/60 mb-3">
                  Run your inventory, leads, and deals with AI.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-foreground/60">
                  <li>AI sales assistant captures leads</li>
                  <li>CRM + deal desk</li>
                  <li>Inventory management</li>
                  <li>Dealer storefront</li>
                </ul>
              </div>
            </Link>

            {/* Voice Agent */}
            <Link href="/voice" className="block group">
              <div className="p-5 md:p-6 rounded-xl border bg-white/80 dark:bg-white/[0.08] hover:shadow-lg transition-shadow h-full">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Voice Agent</h3>
                <p className="text-sm text-muted-foreground dark:text-foreground/60 mb-3">
                  Never miss another customer call.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-foreground/60">
                  <li>AI answers calls 24/7</li>
                  <li>Lead capture & qualification</li>
                  <li>Call transcripts synced to CRM</li>
                </ul>
              </div>
            </Link>

            {/* AI Suite */}
            <Link href="/pricing" className="block group">
              <div className="p-5 md:p-6 rounded-xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-50/50 to-white/80 dark:from-emerald-950/20 dark:to-white/[0.08] hover:shadow-xl transition-shadow h-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">AI Suite</h3>
                <p className="text-sm text-muted-foreground dark:text-foreground/60 mb-3">
                  Your dealership powered entirely by AI.
                </p>
                <p className="text-sm text-muted-foreground dark:text-foreground/60">
                  Platform + Voice working together.
                </p>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Button variant="outline" size="sm" className="rounded-full gap-2 group" asChild>
              <Link href="/pricing">
                View Pricing
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* See AI in Action */}
        <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
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

        {/* How It Works — 4 steps */}
        <section className="w-full max-w-4xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StepItem icon={<Upload className="w-5 h-5" />} step={1} title="Import your inventory" />
            <StepItem icon={<Bot className="w-5 h-5" />} step={2} title="AXLON generates listings & captures leads" />
            <StepItem icon={<PhoneCall className="w-5 h-5" />} step={3} title="AI answers calls and qualifies buyers" />
            <StepItem icon={<Handshake className="w-5 h-5" />} step={4} title="Your team closes deals faster" />
          </div>
        </section>

        {/* What AXLON Replaces */}
        <section className="w-full max-w-2xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">What AXLON Replaces</h2>
          <p className="text-sm text-muted-foreground dark:text-foreground/60 text-center mb-6 max-w-lg mx-auto">
            Instead of juggling multiple tools, run your dealership from one AI platform.
          </p>
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tools Dealers Use Today</th>
                  <th className="text-left py-3 px-4 font-medium text-primary">Replaced by AXLON</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { old: 'Dealer DMS software', replaced: 'Inventory & deal management' },
                  { old: 'CRM systems', replaced: 'Built-in CRM + Deal Desk' },
                  { old: 'Answering services', replaced: 'AI Voice Agent' },
                  { old: 'BDC teams', replaced: 'AI lead capture & qualification' },
                  { old: 'Spreadsheet inventory', replaced: 'Real-time inventory manager' },
                  { old: 'Multiple listing sites', replaced: 'AI marketplace distribution' },
                ].map((item) => (
                  <tr key={item.old}>
                    <td className="py-2.5 px-4 text-muted-foreground dark:text-foreground/60">{item.old}</td>
                    <td className="py-2.5 px-4 text-primary font-medium">&#10003; {item.replaced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center mt-3">
            Replace thousands in monthly tools with one AI platform.
          </p>
        </section>

        {/* Light Pricing Teaser */}
        <section className="w-full max-w-2xl mx-auto mb-10 md:mb-16 px-4 text-center">
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] p-6 md:p-8">
            <p className="text-lg md:text-xl font-bold mb-1">Plans start at $399/month</p>
            <p className="text-sm text-muted-foreground dark:text-foreground/60 mb-4">
              30-day free trial &middot; No credit card required
            </p>
            <Button className="rounded-full gap-2 group" asChild>
              <Link href="/pricing">
                See Pricing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-3xl mx-auto mb-10 md:mb-12 px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Start selling equipment with AI</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto" asChild>
              <Link href="/get-started">
                Start Free Trial
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
            <li><Link href="/pricing">AI Platform Pricing</Link></li>
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
          <div className="grid grid-cols-4 sm:flex gap-3 sm:gap-6 text-center sm:text-left">
            <FooterLink href="/new-trailers">New Trailers</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
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

function StepItem({ icon, step, title }: { icon: React.ReactNode; step: number; title: string }) {
  return (
    <div className="text-center">
      <div className="relative w-12 h-12 rounded-xl bg-white/80 dark:bg-white/[0.08] border flex items-center justify-center mx-auto mb-3">
        {icon}
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{step}</span>
      </div>
      <p className="text-sm font-medium">{title}</p>
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

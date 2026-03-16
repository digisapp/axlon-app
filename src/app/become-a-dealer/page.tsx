import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Headphones,
  Store,
  Check,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Phone,
  MessageSquare,
  Package,
  Brain,
  Truck,
  Building2,
  Wrench,
  Shield,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Business — The AI Operating System | AXLON AI',
  description:
    'Replace your DMS, CRM, answering service, and BDC team with one AI platform. AXLON AI is the operating system built for equipment businesses.',
  alternates: {
    canonical: '/become-a-dealer',
  },
};

const pillars = [
  {
    icon: Bot,
    title: 'AI Platform',
    price: '$399',
    color: 'primary',
    features: [
      'AI sales assistant trained on your inventory',
      'Built-in CRM with deal scoring',
      'Automated email & SMS follow-ups',
      'Lead capture & qualification 24/7',
      'Bulk import & inventory management',
    ],
    href: '/how-it-works',
  },
  {
    icon: Headphones,
    title: 'Voice Agent',
    price: '$499',
    color: 'cyan',
    features: [
      'Knows your inventory, pricing & CRM inside out',
      'Answers customers in 30+ languages',
      'Team PIN access for instant company intel',
      'Captures leads, qualifies & books appointments',
      'You control what it knows and who can access it',
    ],
    href: '/voice',
  },
  {
    icon: Store,
    title: 'Marketplace',
    price: 'Free',
    color: 'amber',
    features: [
      'Branded storefront page',
      'Listings syndicated to buyers',
      'AI-powered search visibility',
      'Direct messaging with buyers',
      'Analytics & performance tracking',
    ],
    href: '/search',
  },
];

const beforeAfter = [
  {
    before: 'Missed calls after hours',
    after: 'AI answers every call 24/7',
    icon: Phone,
  },
  {
    before: 'Leads slip through the cracks',
    after: 'AI qualifies & follows up automatically',
    icon: Users,
  },
  {
    before: 'Hours spent on manual data entry',
    after: 'Bulk import — list 100 units in minutes',
    icon: Package,
  },
  {
    before: 'Paying for DMS + CRM + answering service',
    after: 'One platform replaces all three',
    icon: DollarSign,
  },
  {
    before: 'No idea which listings perform',
    after: 'AI insights surface what to price, promote, restock',
    icon: BarChart3,
  },
  {
    before: 'Buyers can\'t find your inventory',
    after: 'AI search puts your equipment in front of buyers',
    icon: TrendingUp,
  },
];

const stats = [
  { value: '24/7', label: 'AI Availability' },
  { value: '< 2s', label: 'Call Answer Time' },
  { value: '0', label: 'Missed Calls' },
  { value: '$0', label: 'Setup Fee' },
];

const audiences = [
  { icon: Truck, label: 'Heavy Haul', desc: 'Lowboys, flatbeds, step decks' },
  { icon: Building2, label: 'Truck & Transport', desc: 'Semi trucks, day cabs, sleepers' },
  { icon: Wrench, label: 'Equipment Companies', desc: 'Cranes, excavators, loaders' },
  { icon: Store, label: 'Brokers & Traders', desc: 'Buy, sell, and flip equipment' },
];

function ForDealersJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AXLON AI for Equipment Businesses',
    description: 'Replace your DMS, CRM, answering service, and BDC team with one AI platform.',
    url: 'https://axlon.ai/become-a-dealer',
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'AXLON AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        {
          '@type': 'Offer',
          name: 'Marketplace',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free marketplace listing and storefront',
        },
        {
          '@type': 'Offer',
          name: 'AI Platform',
          price: '399',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '399',
            priceCurrency: 'USD',
            billingDuration: 'P1M',
          },
          description: 'AI sales assistant, CRM, and automation',
        },
        {
          '@type': 'Offer',
          name: 'Voice Agent',
          price: '499',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '499',
            priceCurrency: 'USD',
            billingDuration: 'P1M',
          },
          description: 'AI voice and brain for your entire company — answers calls, knows your business inside out',
        },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ForDealersPage() {
  return (
    <div className="min-h-screen bg-background">
      <ForDealersJsonLd />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/axlonai-logo.png" alt="AXLON AI" width={36} height={36} className="w-9 h-9" />
              <span className="font-bold text-lg text-white">AXLON AI</span>
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              The AI Operating System for Equipment Businesses
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Replace your DMS, CRM,{' '}
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                & answering service
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              One AI platform that manages your inventory, captures leads, answers your phones,
              and closes more deals — while you focus on running your business.
            </p>
            <p className="text-sm text-emerald-400 font-medium mb-8">
              30-day free trial &middot; No credit card required
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/30 group w-full sm:w-auto text-base px-8" asChild>
                <Link href="/get-started">
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2 border-slate-600 text-slate-200 hover:bg-slate-800 w-full sm:w-auto text-base px-8" asChild>
                <Link href="/contact?plan=demo">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The old way is costing you deals</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every missed call, lost lead, and manual task is money left on the table.
            </p>
          </div>

          <div className="grid gap-4">
            {beforeAfter.map((item) => (
              <div key={item.before} className="grid md:grid-cols-[1fr,auto,1fr] gap-3 md:gap-0 items-center">
                {/* Before */}
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl px-5 py-4">
                  <item.icon className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300 line-through decoration-red-300">{item.before}</span>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center w-12">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* After */}
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl px-5 py-4">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">{item.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need. One platform.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three products that work together as your complete AI operating system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const colorMap: Record<string, { iconBg: string; iconText: string; price: string; check: string; link: string }> = {
                primary: {
                  iconBg: 'bg-primary/10',
                  iconText: 'text-primary',
                  price: 'text-primary',
                  check: 'text-primary',
                  link: 'text-primary',
                },
                cyan: {
                  iconBg: 'bg-cyan-500/10',
                  iconText: 'text-cyan-600',
                  price: 'text-cyan-600',
                  check: 'text-cyan-500',
                  link: 'text-cyan-600',
                },
                amber: {
                  iconBg: 'bg-amber-500/10',
                  iconText: 'text-amber-600',
                  price: 'text-amber-600',
                  check: 'text-amber-500',
                  link: 'text-amber-600',
                },
              };
              const colorClasses = colorMap[pillar.color] ?? colorMap.primary;

              return (
                <Link key={pillar.title} href={pillar.href} className="group block">
                  <div className="h-full p-6 md:p-8 rounded-xl border bg-card hover:shadow-xl transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl ${colorClasses.iconBg} flex items-center justify-center mb-5`}>
                      <pillar.icon className={`w-6 h-6 ${colorClasses.iconText}`} />
                    </div>

                    <h3 className="text-xl font-bold mb-1">{pillar.title}</h3>
                    <div className="flex items-baseline gap-1.5 mb-5">
                      <span className={`text-2xl font-bold ${colorClasses.price}`}>{pillar.price}</span>
                      {pillar.price !== 'Free' && <span className="text-sm text-muted-foreground">/mo</span>}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pillar.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className={`w-4 h-4 ${colorClasses.check} shrink-0 mt-0.5`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <span className={`text-sm font-medium ${colorClasses.link} group-hover:underline`}>
                      Learn more &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built For */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for your business</h2>
            <p className="text-muted-foreground text-lg">
              Whether you sell 10 units or 1,000 — AXLON scales with you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map((a) => (
              <div key={a.label} className="bg-card border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <a.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{a.label}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Get running in 15 minutes</h2>
            <p className="text-muted-foreground text-lg">30-day free trial. No credit card. No setup fees.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create your account',
                desc: 'Sign up free and tell us about your business. Import your inventory via CSV or add listings manually.',
                icon: Shield,
              },
              {
                step: '2',
                title: 'AI learns your business',
                desc: 'AXLON AI studies your inventory, pricing, and market data to become your smartest team member.',
                icon: Brain,
              },
              {
                step: '3',
                title: 'Start closing deals',
                desc: 'AI captures leads, answers calls, follows up, and surfaces insights — you focus on selling.',
                icon: TrendingUp,
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {s.step}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Command Center Preview */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <Brain className="w-3.5 h-3.5" />
              AI Command Center
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Your AI-powered dashboard</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Ask questions, get insights, and manage your entire business from one screen.
            </p>
          </div>

          {/* Mock Dashboard */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ask Axlon */}
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">Ask Axlon AI</span>
                </div>
                <div className="bg-slate-800 rounded-lg px-4 py-3 text-sm text-slate-400 mb-4 border border-slate-700">
                  &quot;Which trucks should I reprice this week?&quot;
                </div>
                <div className="space-y-2">
                  {['Show me stale inventory', 'Draft a follow-up for my top lead', 'What sold this month?'].map((q) => (
                    <div key={q} className="text-xs text-slate-500 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">Inventory Alert</span>
                  </div>
                  <p className="text-xs text-slate-400">3 listings over 45 days old — consider repricing</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-blue-300">New Leads</span>
                  </div>
                  <p className="text-xs text-slate-400">5 new leads this week — 2 are high intent</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">High Demand</span>
                  </div>
                  <p className="text-xs text-slate-400">Your 2024 Peterbilt 579 has 340 views this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            30-day free trial on all paid plans. No credit card required. Start free with the marketplace and add AI tools when you&apos;re ready.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-4">
            <div className="border rounded-xl p-6 bg-card">
              <Store className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg">Marketplace</h3>
              <p className="text-3xl font-bold mt-2 text-amber-600">Free</p>
              <p className="text-sm text-muted-foreground mt-1">List & sell equipment</p>
            </div>
            <div className="border-2 border-primary rounded-xl p-6 bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <Bot className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg">AI Platform</h3>
              <p className="text-3xl font-bold mt-2 text-primary">$399<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mt-1">CRM, AI assistant, automation</p>
              <p className="text-xs text-emerald-600 font-medium mt-2">30-day free trial</p>
            </div>
            <div className="border rounded-xl p-6 bg-card">
              <Headphones className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg">Voice Agent</h3>
              <p className="text-3xl font-bold mt-2 text-cyan-600">$499<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mt-1">Your company&apos;s voice and brain</p>
            </div>
          </div>

          <div className="border-2 border-emerald-500/40 rounded-xl p-4 bg-emerald-50/50 dark:bg-emerald-950/20 mb-10 max-w-md mx-auto">
            <p className="text-sm font-semibold text-center">AI Suite Bundle: <span className="text-emerald-600">$699/mo</span> <span className="text-muted-foreground line-through text-xs">$898</span></p>
            <p className="text-xs text-muted-foreground text-center mt-1">Platform + Voice — save $199/mo</p>
          </div>

          <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group text-base px-8" asChild>
            <Link href="/get-started">
              Start 30-Day Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to run your business with AI?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join businesses who are selling more equipment with less effort.
            Get started in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto text-base px-8" asChild>
              <Link href="/get-started">
                Start 30-Day Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base px-8" asChild>
              <Link href="/contact?plan=demo">
                Book a Demo
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            No credit card required &middot; 30-day free trial &middot; Cancel anytime
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/images/axlonai-logo.png" alt="AXLON AI" width={20} height={20} className="w-5 h-5" />
            <p className="text-xs text-muted-foreground">&copy; 2026 AXLON AI. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

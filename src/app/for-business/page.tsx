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
  DollarSign,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Business — AI Transformation for Equipment Companies | AXLON AI',
  description:
    'AXLON AI deploys a full AI operating system for heavy haul, crane & rigging, and equipment businesses. AI lead response, voice agent, CRM, and marketplace — built and run for you.',
  alternates: {
    canonical: '/for-business',
  },
  openGraph: {
    title: 'For Business — AI Transformation for Equipment Companies | AXLON AI',
    description: 'AXLON AI deploys a full AI operating system for heavy haul, crane & rigging, and equipment businesses.',
    type: 'website',
    url: '/for-business',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXLON AI for Business',
    description: 'AI operating system built and run for equipment businesses.',
  },
};

const beforeAfter = [
  {
    before: 'Leads go unanswered after hours',
    after: 'AI drafts and sends a response within seconds',
    icon: Phone,
  },
  {
    before: 'Missed calls mean missed deals',
    after: 'Voice agent answers every call 24/7',
    icon: Headphones,
  },
  {
    before: 'Leads slip through the cracks',
    after: 'AI qualifies, scores, and follows up automatically',
    icon: Users,
  },
  {
    before: 'Hours spent on manual data entry',
    after: 'Bulk import — list 100 units in minutes',
    icon: Package,
  },
  {
    before: 'Paying for DMS + CRM + answering service',
    after: 'One AI system replaces all three',
    icon: DollarSign,
  },
  {
    before: 'No visibility into what is working',
    after: 'AI performance dashboard shows ROI every month',
    icon: BarChart3,
  },
];

const stats = [
  { value: '24/7', label: 'AI Availability' },
  { value: '< 60s', label: 'Lead Response Time' },
  { value: '12mo', label: 'Transformation Program' },
  { value: '10–20', label: 'Clients We Work With' },
];

const audiences = [
  { icon: Truck, label: 'Heavy Haul', desc: 'Lowboys, flatbeds, step decks' },
  { icon: Building2, label: 'Crane & Rigging', desc: 'Lifting, transport, specialized' },
  { icon: Wrench, label: 'Equipment Companies', desc: 'Sales, rental, service' },
  { icon: Store, label: 'Truck & Transport', desc: 'Semi trucks, fleets, brokers' },
];

const aiSystems = [
  {
    icon: Bot,
    title: 'AI Lead Response',
    desc: 'Every inbound lead gets an instant, professional response drafted and sent under your brand — automatically.',
    color: 'primary',
  },
  {
    icon: Headphones,
    title: 'Voice Agent',
    desc: 'Answers your calls 24/7, knows your inventory and pricing, captures leads and books appointments.',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'CRM & Deal Desk',
    desc: 'Full pipeline management with AI-scored leads, automated follow-up sequences, and deal tracking.',
    color: 'emerald',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    desc: 'Bulk import, smart pricing alerts, and stale inventory detection — always know what to move.',
    color: 'amber',
  },
  {
    icon: TrendingUp,
    title: 'AI Performance Dashboard',
    desc: 'Monthly reporting on every AI action taken: hours saved, leads captured, response rate, ROI.',
    color: 'violet',
  },
  {
    icon: Store,
    title: 'Marketplace Listing',
    desc: 'Your inventory on AXLON.ai — AI-powered search puts your equipment in front of qualified buyers.',
    color: 'rose',
  },
];

const colorMap: Record<string, { iconBg: string; iconText: string }> = {
  primary:  { iconBg: 'bg-primary/10',   iconText: 'text-primary' },
  cyan:     { iconBg: 'bg-cyan-500/10',   iconText: 'text-cyan-600' },
  emerald:  { iconBg: 'bg-emerald-500/10',iconText: 'text-emerald-600' },
  amber:    { iconBg: 'bg-amber-500/10',  iconText: 'text-amber-600' },
  violet:   { iconBg: 'bg-violet-500/10', iconText: 'text-violet-600' },
  rose:     { iconBg: 'bg-rose-500/10',   iconText: 'text-rose-600' },
};

function ForBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AXLON AI for Equipment Businesses',
    description: 'AI operating system built and run for heavy haul, crane & rigging, and equipment businesses.',
    url: 'https://axlon.ai/for-business',
    mainEntity: {
      '@type': 'Service',
      name: 'AXLON AI Transformation Program',
      provider: {
        '@type': 'Organization',
        name: 'AXLON AI',
        url: 'https://axlon.ai',
      },
      serviceType: 'AI Business Transformation',
      areaServed: 'US',
      description: 'Full AI operating system deployment for equipment businesses including lead response, voice agent, CRM, and marketplace.',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ForBusinessPage() {
  return (
    <div className="min-h-screen bg-background">
      <ForBusinessJsonLd />

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
              AI Operating System for Equipment Businesses
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              We build and run your{' '}
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                AI operation
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              AI lead response, voice agent, CRM, and marketplace — deployed and managed
              for heavy haul, crane & rigging, and equipment businesses.
            </p>
            <p className="text-sm text-amber-400 font-medium mb-8">
              We work with a select group of 10–20 businesses &middot; Apply to see if you qualify
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/30 group w-full sm:w-auto text-base px-8" asChild>
                <Link href="/apply">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2 border-slate-600 text-slate-200 hover:bg-slate-800 w-full sm:w-auto text-base px-8" asChild>
                <Link href="/transform">
                  See the Program
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
              Every missed call, slow response, and manual task is money left on the table.
            </p>
          </div>

          <div className="grid gap-4">
            {beforeAfter.map((item) => (
              <div key={item.before} className="grid md:grid-cols-[1fr,auto,1fr] gap-3 md:gap-0 items-center">
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl px-5 py-4">
                  <item.icon className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300 line-through decoration-red-300">{item.before}</span>
                </div>
                <div className="hidden md:flex items-center justify-center w-12">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl px-5 py-4">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">{item.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Systems */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What gets deployed for your business</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Six AI systems working together as your complete operating layer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiSystems.map((system) => {
              const colors = colorMap[system.color] ?? colorMap.primary;
              return (
                <div key={system.title} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4`}>
                    <system.icon className={`w-5 h-5 ${colors.iconText}`} />
                  </div>
                  <h3 className="font-bold text-base mb-2">{system.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{system.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built For */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for your industry</h2>
            <p className="text-muted-foreground text-lg">
              We specialize in the businesses that move and lift heavy things.
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

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
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
                    <span className="text-sm font-medium text-emerald-300">AI Inbox</span>
                  </div>
                  <p className="text-xs text-slate-400">3 AI-drafted responses ready for your review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Tracks */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Two ways to work with AXLON</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Start with the marketplace for free, or apply for the full AI Transformation Program.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="border rounded-xl p-8 bg-card text-left">
              <Store className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="font-bold text-xl mb-1">Marketplace</h3>
              <p className="text-2xl font-bold text-amber-600 mb-3">Free</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                {['Branded storefront page', 'Listings in front of buyers', 'AI-powered search visibility', 'Direct messaging with buyers', 'Analytics & performance'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link href="/get-started">Create Free Account</Link>
              </Button>
            </div>

            <div className="border-2 border-primary rounded-xl p-8 bg-card text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                BY APPLICATION
              </div>
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-1">AI Transformation</h3>
              <p className="text-2xl font-bold text-primary mb-3">Custom</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                {['AI lead response system', 'Voice agent deployed', 'Full CRM & deal desk', 'AI inbox with human review', 'Monthly performance reviews'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full gap-2 group" asChild>
                <Link href="/apply">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Clock className="w-3.5 h-3.5" />
            Limited to 10–20 clients
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to run your business with AI?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            We work with a select group of equipment businesses. Apply to start a conversation — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 group w-full sm:w-auto text-base px-8" asChild>
              <Link href="/apply">
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base px-8" asChild>
              <Link href="/transform">
                See the Full Program
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/images/axlonai-logo.png" alt="AXLON AI" width={20} height={20} className="w-5 h-5" />
            <p className="text-xs text-muted-foreground">&copy; 2026 AXLON AI. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/transform" className="text-xs text-muted-foreground hover:text-foreground transition-colors">AI Transformation</Link>
            <Link href="/apply" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Apply</Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

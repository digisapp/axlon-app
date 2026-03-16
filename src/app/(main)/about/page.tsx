import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Target,
  Zap,
  Shield,
  ArrowRight,
  Building2,
  Truck,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About AXLON AI — The AI Platform for Equipment Businesses',
  description:
    'AXLON AI is building the operating system for equipment businesses. AI sales assistants, voice agents, CRM, and marketplace — all in one platform.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About AXLON AI',
    description: 'The AI operating system for equipment businesses.',
  },
};

const values = [
  {
    icon: Bot,
    title: 'AI-First',
    description:
      'We build AI that actually works for businesses — not generic chatbots, but purpose-built tools that understand equipment, financing, and business workflows.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Business Trust',
    description:
      'Every feature we build starts with business feedback. We earn trust by delivering results, not promises.',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Speed to Value',
    description:
      'Businesses are busy. Our platform is designed to deliver value from day one — no consultants, no 6-month implementations.',
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    icon: Target,
    title: 'Vertical Focus',
    description:
      "We don't try to serve every industry. We go deep on heavy equipment and trailers so our AI actually understands the business.",
    color: 'text-emerald-500 bg-emerald-500/10',
  },
];

const milestones = [
  {
    label: 'Founded',
    value: '2024',
    description: 'Started building in Miami, FL',
  },
  {
    label: 'Platform',
    value: 'AI-Powered',
    description: 'Sales assistant, voice agents, CRM',
  },
  {
    label: 'Focus',
    value: 'Equipment',
    description: 'Trailers, trucks, heavy machinery',
  },
  {
    label: 'Mission',
    value: 'Empower Businesses',
    description: 'Level the playing field with AI',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                About AXLON AI
              </h1>
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-xl">
              We&apos;re building the AI operating system for equipment businesses — so they can sell
              more, work less, and compete with anyone.
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="bg-card border rounded-xl p-4 md:p-5 text-center"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {m.label}
              </p>
              <p className="text-lg md:text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Equipment businesses are the backbone of construction, transportation, and
              infrastructure. Yet most still run on spreadsheets, missed calls, and
              word-of-mouth.
            </p>
            <p>
              We started AXLON because we saw an opportunity to bring modern AI tools to an
              industry that&apos;s been underserved by technology. Not another generic CRM with
              a chatbot bolted on — but a purpose-built platform that understands how equipment
              businesses actually work.
            </p>
            <p>
              Our AI sales assistant knows the difference between a lowboy and a step deck. Our
              voice agents can qualify leads and answer spec questions at 2 AM. Our marketplace
              connects buyers with the right equipment, instantly.
            </p>
            <p>
              We&apos;re based in Miami, FL, and we&apos;re just getting started.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What We Believe</h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border rounded-xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.color}`}
                  >
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{v.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Who We Serve</h2>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-card border rounded-xl p-5 md:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold mb-1">Equipment Businesses</h3>
              <p className="text-sm text-muted-foreground">
                Trailer, truck, and heavy equipment businesses of all sizes.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5 md:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Buyers</h3>
              <p className="text-sm text-muted-foreground">
                Contractors, fleet managers, and owner-operators looking for equipment.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5 md:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-1">Manufacturers</h3>
              <p className="text-sm text-muted-foreground">
                Trailer and equipment manufacturers showcasing their product lines.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                Ready to see AXLON in action?
              </h2>
              <p className="text-slate-400 max-w-lg text-sm md:text-base">
                Book a demo and see how AI can transform your business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button size="lg" className="rounded-full gap-2 group" asChild>
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-slate-600 text-slate-200 hover:bg-slate-800"
                asChild
              >
                <Link href="/contact?plan=demo">Book a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Construction,
  Brain,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tools for Crane & Rigging Companies',
  description: 'Axleyard helps crane and rigging companies manage leads, automate customer inquiries, list equipment, and grow their business with AI-powered tools.',
  openGraph: {
    title: 'AI Tools for Crane & Rigging Companies',
    description: 'Manage leads, automate inquiries, and grow your crane business with AI.',
  },
  alternates: { canonical: '/industries/crane' },
};

const features = [
  {
    icon: Brain,
    title: 'AI Sales Assistant',
    description: 'Answer customer questions about lift capacity, boom length, and availability 24/7 — even after hours.',
  },
  {
    icon: Users,
    title: 'Smart Lead Capture',
    description: 'AI qualifies incoming leads by project type, tonnage requirements, and timeline automatically.',
  },
  {
    icon: BarChart3,
    title: 'Fleet Analytics',
    description: 'Track utilization rates, rental revenue, and market demand for your crane fleet in real-time.',
  },
  {
    icon: MessageSquare,
    title: 'Branded Storefront',
    description: 'Your own page showcasing your fleet with specs, photos, and an AI chat widget for instant quotes.',
  },
  {
    icon: Shield,
    title: 'Equipment Marketplace',
    description: 'Buy and sell cranes, boom trucks, and rigging equipment with AI-optimized listings.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'AI-powered pricing data for crawler cranes, all-terrain cranes, tower cranes, and more.',
  },
];

const useCases = [
  'A contractor needs a 200-ton crane next week — your AI assistant qualifies the lead and books a call',
  'List surplus rigging gear and reach buyers across the country instantly',
  'Track which crane models get the most inquiries and optimize your fleet mix',
  'Your AI chatbot answers "What\'s your mobilization rate?" at 2 AM while you sleep',
];

export default function CranePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Link href="/get-started">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Construction className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-600">For Crane & Rigging Companies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Tools Built for Crane & Rigging
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stop missing leads after hours. Let AI handle customer inquiries, qualify prospects, and manage your equipment listings — so you can focus on lifting.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/get-started?industry=crane">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/search?category=crane">Browse Crane Equipment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold mb-4 text-center">Everything your crane business needs</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          From lead capture to fleet analytics, Axleyard gives crane and rigging companies the AI tools to compete and grow.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold mb-4">How crane companies use Axleyard</h2>
          <p className="text-lg text-muted-foreground mb-8">Real scenarios where AI saves you time and wins you business.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-lg bg-background border">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>{uc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">Set up in under 5 minutes</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">Ready to grow your crane business?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Join crane and rigging companies already using AI to capture more leads and sell equipment faster.
        </p>
        <Button asChild size="lg">
          <Link href="/get-started?industry=crane">Get Started Free</Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">No credit card required.</p>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Image src="/images/axlonai-logo.png" alt="AXLON AI" width={80} height={30} />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/industries/transport" className="hover:text-foreground">Transport</Link>
            <Link href="/industries/rigging" className="hover:text-foreground">Rigging</Link>
            <Link href="/get-started" className="hover:text-foreground">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

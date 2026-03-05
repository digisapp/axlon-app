import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Truck,
  Brain,
  BarChart3,
  Users,
  MessageSquare,
  Route,
  Clock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tools for Heavy Haul & Transport Companies | AxlonAI',
  description: 'AxlonAI helps heavy haul and specialized transport companies manage leads, sell equipment, and grow with AI-powered tools built for the industry.',
  openGraph: {
    title: 'AI Tools for Heavy Haul & Transport Companies',
    description: 'Manage leads, sell equipment, and grow your transport business with AI.',
  },
  alternates: { canonical: '/industries/transport' },
};

const features = [
  {
    icon: Brain,
    title: 'AI Sales Assistant',
    description: 'Answer shipper inquiries about capacity, routes, and rates automatically — even nights and weekends.',
  },
  {
    icon: Users,
    title: 'Smart Lead Capture',
    description: 'AI qualifies leads by load type, dimensions, weight, origin/destination, and timeline.',
  },
  {
    icon: BarChart3,
    title: 'Fleet Analytics',
    description: 'Track trailer utilization, revenue per unit, and market demand across your fleet.',
  },
  {
    icon: MessageSquare,
    title: 'Branded Storefront',
    description: 'Showcase your fleet — lowboys, RGNs, step decks, flatbeds — with AI-powered customer chat.',
  },
  {
    icon: Route,
    title: 'Equipment Marketplace',
    description: 'Buy and sell trailers, trucks, and transport equipment with AI-optimized listings.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'AI-powered pricing data for lowboy trailers, heavy haul trucks, and specialized equipment.',
  },
];

const useCases = [
  'A shipper needs an RGN for an oversize load next Monday — your AI assistant captures the details and alerts you',
  'List your surplus trailers and reach buyers nationwide with AI-written descriptions',
  'Track which trailer types generate the most inquiries and optimize your fleet investments',
  'Your AI chatbot handles "What\'s your max payload?" questions while you\'re on the road',
];

export default function TransportPage() {
  return (
    <div className="min-h-screen bg-background">
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
      <section className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600">For Heavy Haul & Transport</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Tools Built for Heavy Haul
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Capture more loads, sell equipment faster, and let AI handle the inquiries that come in while you&apos;re on the road.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/get-started?industry=transport">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/search?category=lowboy">Browse Trailers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold mb-4 text-center">Everything your transport business needs</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          From lead capture to fleet analytics, AxlonAI gives heavy haul companies the AI edge.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-blue-600" />
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
          <h2 className="text-3xl font-bold mb-4">How transport companies use AxlonAI</h2>
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
        <h2 className="text-3xl font-bold mb-4">Ready to grow your transport business?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Join heavy haul companies already using AI to capture more loads and sell equipment faster.
        </p>
        <Button asChild size="lg">
          <Link href="/get-started?industry=transport">Get Started Free</Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">No credit card required.</p>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Image src="/images/axlonai-logo.png" alt="AxlonAI" width={80} height={30} />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/industries/crane" className="hover:text-foreground">Crane</Link>
            <Link href="/industries/rigging" className="hover:text-foreground">Rigging</Link>
            <Link href="/get-started" className="hover:text-foreground">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

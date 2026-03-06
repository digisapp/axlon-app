import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Wrench,
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
  title: 'AI Tools for Rigging & Heavy Lift Services | AXLON AI',
  description: 'AXLON AI helps rigging companies, millwrights, and heavy lift service providers manage leads, list equipment, and grow with AI-powered tools.',
  openGraph: {
    title: 'AI Tools for Rigging & Heavy Lift Services',
    description: 'Manage leads, list equipment, and grow your rigging business with AI.',
  },
  alternates: { canonical: '/industries/rigging' },
};

const features = [
  {
    icon: Brain,
    title: 'AI Sales Assistant',
    description: 'Answer project inquiries about rigging capacity, equipment specs, and service areas automatically.',
  },
  {
    icon: Users,
    title: 'Smart Lead Capture',
    description: 'AI qualifies leads by project scope, weight requirements, location, and timeline.',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Track project pipeline, equipment utilization, and revenue trends across your operations.',
  },
  {
    icon: MessageSquare,
    title: 'Branded Storefront',
    description: 'Showcase your rigging capabilities, equipment inventory, and past projects with AI-powered chat.',
  },
  {
    icon: Shield,
    title: 'Equipment Marketplace',
    description: 'Buy and sell rigging gear, spreader bars, gantries, jacks, and skidding systems.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'AI-powered pricing data for rigging equipment and service rates in your region.',
  },
];

const useCases = [
  'A plant manager needs a machinery move quoted by EOD — your AI captures specs and sends you an alert',
  'List surplus rigging gear (shackles, slings, spreader bars) and reach buyers nationwide',
  'Track which services generate the most inquiries — millwright, rigging, or heavy lift',
  'Your AI chatbot answers "What\'s your max lift capacity?" and "Do you serve our area?" while you\'re on a job',
];

export default function RiggingPage() {
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
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">For Rigging & Heavy Lift</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Tools Built for Rigging Companies
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Win more projects, capture leads around the clock, and let AI handle the inquiries while you&apos;re on the job site.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/get-started?industry=rigging">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/search?category=rigging">Browse Rigging Equipment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold mb-4 text-center">Everything your rigging business needs</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          From lead capture to project tracking, AXLON AI gives rigging and heavy lift companies the AI tools to win more work.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-emerald-600" />
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
          <h2 className="text-3xl font-bold mb-4">How rigging companies use AXLON AI</h2>
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
        <h2 className="text-3xl font-bold mb-4">Ready to grow your rigging business?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Join rigging and heavy lift companies already using AI to win more projects and manage their pipeline.
        </p>
        <Button asChild size="lg">
          <Link href="/get-started?industry=rigging">Get Started Free</Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">No credit card required.</p>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Image src="/images/axlonai-logo.png" alt="AXLON AI" width={80} height={30} />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/industries/crane" className="hover:text-foreground">Crane</Link>
            <Link href="/industries/transport" className="hover:text-foreground">Transport</Link>
            <Link href="/get-started" className="hover:text-foreground">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

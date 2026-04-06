'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  Handshake,
  Bot,
  PhoneCall,
  BarChart3,
  Upload,
  Zap,
  Globe,
  Headphones,
} from 'lucide-react';

export function HowItWorksContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-8 md:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            AI-Powered Business Tools
          </Badge>
          <h1 className="text-2xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">
            AI that runs your business —<br className="hidden sm:block" /> from lead to close
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
            Replace your DMS, CRM, answering service, and BDC team with one AI platform. Built for equipment dealers, brokers, and service businesses.
          </p>
        </div>
      </section>

      {/* Three Product Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-10 md:mb-14">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
          {/* Free Assessment Card */}
          <Link href="/apply" className="group block">
            <Card className="h-full border-primary/30 hover:border-primary/60 hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <PhoneCall className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Free AI Assessment</CardTitle>
                <CardDescription className="text-sm">
                  See exactly where AI creates value in your operation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">Free</span>
                  <span className="text-sm text-muted-foreground">· 45 minutes</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {[
                    'Custom to your operation — not a generic demo',
                    'Specific ROI projections for your business',
                    'No obligation to continue',
                    'Delivered by our senior team',
                    'Includes your AI opportunity map',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Apply now <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* AI Transformation — Center Hero */}
          <Link href="/transform" className="group block">
            <Card className="h-full border-2 border-emerald-500/50 hover:border-emerald-500/80 hover:shadow-xl transition-all bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-600 text-xs">Most Common</Badge>
              </div>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">AI Transformation</CardTitle>
                <CardDescription className="text-sm">
                  Full 12-month AI overhaul of your entire operation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-emerald-600">Custom</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">$4,500–$12,000/mo · 12-month program</p>
                <ul className="space-y-2 mb-4">
                  {[
                    'AI Lead Response System (24/7 capture)',
                    'Dispatch & load matching automation',
                    'Document AI for BOLs, invoices & titles',
                    'Sales team AI assistant & CRM',
                    'Full Axlon Marketplace integration',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground mb-3">Average ROI: $150k–$500k in year one.</p>
                <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  See the full program <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Marketplace Card */}
          <Link href="/search" className="group block">
            <Card className="h-full border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center mb-2">
                  <Headphones className="w-5 h-5 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Axlon Marketplace</CardTitle>
                <CardDescription className="text-sm">
                  Buy and sell heavy haul equipment and trailers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">Free</span>
                  <span className="text-sm text-muted-foreground">to browse</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {[
                    'Lowboy & heavy haul trailers',
                    'Semi trucks & day cabs',
                    'Heavy equipment & cranes',
                    'Verified dealer network',
                    'AI-powered search by specs & capacity',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="text-sm text-cyan-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse equipment <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Get Started in 4 Steps */}
      <div className="max-w-5xl mx-auto px-4 pb-12 md:pb-16">
        <div id="platform-details" className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-3xl font-bold mb-2">Get started in 4 steps</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            From signup to closing deals — here&apos;s how AXLON replaces your entire tech stack.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          <StepCard
            step={1}
            icon={<Upload className="w-6 h-6" />}
            title="Import Your Data"
            description="Drop your spreadsheets, TruckPaper exports, or Salesforce data. AI parses and imports everything automatically."
          />
          <StepCard
            step={2}
            icon={<Bot className="w-6 h-6" />}
            title="Train Your AI"
            description="AI learns your inventory, pricing, and business rules. Your Knowledge Base makes it an expert on YOUR business."
          />
          <StepCard
            step={3}
            icon={<PhoneCall className="w-6 h-6" />}
            title="Go Live"
            description="Your AI Sales Assistant goes live on your site. Add Voice to answer phones 24/7 with a dedicated number."
          />
          <StepCard
            step={4}
            icon={<Handshake className="w-6 h-6" />}
            title="Close More Deals"
            description="AI captures leads, qualifies them, and feeds your CRM. You focus on selling — AI handles the rest."
          />
        </div>

        {/* What's Included */}
        <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">What&apos;s Included</h3>
        <div className="grid md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
          <FeatureCard
            icon={<Bot className="w-6 h-6 text-primary" />}
            title="AI Sales Assistant"
            features={[
              'Captures leads 24/7 on your website',
              'Trained on your inventory & pricing',
              'Speaks 30+ languages',
              'Instant answers to buyer questions',
            ]}
          />
          <Link href="/voice" className="block group">
            <FeatureCard
              icon={<Headphones className="w-6 h-6 text-cyan-600" />}
              title="Voice Agent"
              features={[
                'Knows your entire business inside out',
                'Answers calls in 30+ languages',
                'Staff PIN access for internal company intel',
                'You control what it knows and who can access it',
              ]}
              hasLink
            />
          </Link>
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
            title="CRM + Deal Desk"
            features={[
              'AI deal scoring & priority',
              'Automated email/SMS outreach',
              'Quote PDF generation',
              'Floor plan & inventory analytics',
            ]}
          />
        </div>

        {/* Multilingual highlight */}
        <div className="rounded-2xl border bg-gradient-to-br from-cyan-500/5 via-primary/5 to-cyan-500/5 p-5 md:p-8 mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-1">AI that speaks your customers&apos; language</h3>
              <p className="text-sm text-muted-foreground">
                No Spanish-speaking staff? No problem. AXLON AI handles live chat and phone calls in 30+ languages — Spanish, Portuguese, Russian, French, Arabic, and more. Open your business to every customer, regardless of language.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="rounded-full gap-2 w-full sm:w-auto" asChild>
            <Link href="/apply">
              Apply for Free Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto" asChild>
            <Link href="/transform">
              See the Full Program
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-8 md:py-12 px-4 bg-primary/5 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg md:text-2xl font-bold mb-2">
            Ready to see what&apos;s possible?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Start with a free 45-minute AI Opportunity Assessment. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/apply">
                <Zap className="w-4 h-4 mr-2" />
                Apply for Free Assessment
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/transform">
                See the Full Program
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-4 md:p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="absolute -top-2.5 -left-1.5 md:-top-3 md:-left-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-white text-xs md:text-sm font-bold flex items-center justify-center">
        {step}
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center mb-3 md:mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  features,
  hasLink,
}: {
  icon: React.ReactNode;
  title: string;
  features: string[];
  hasLink?: boolean;
}) {
  return (
    <div className="p-4 md:p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow h-full">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center mb-3 md:mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 flex items-center gap-2">
        {title}
        {hasLink && (
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        )}
      </h3>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}


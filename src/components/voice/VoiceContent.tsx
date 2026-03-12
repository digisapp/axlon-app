'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  PhoneCall,
  Headphones,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Zap,
  MessageSquare,
  BarChart3,
  Shield,
  Bot,
  Mic,
} from 'lucide-react';

export function VoiceContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-cyan-600/10 text-cyan-600 border-cyan-600/20 hover:bg-cyan-600/10">
            <Headphones className="w-3.5 h-3.5 mr-1.5" />
            Conversational AI Agent Solutions
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
            AI Customer Service Agents
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Voice AI agents delivering real-time customer support. Faster, more efficient support with
            agents that handle inbound calls, resolve requests, and deliver natural conversations around the clock.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full gap-2 bg-cyan-600 hover:bg-cyan-700" asChild>
              <Link href="/contact?plan=voice">
                Get Started with Voice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
              <Link href="/contact?plan=demo">
                Book a Demo
                <PhoneCall className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-10 md:py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">Key Capabilities</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-lg mx-auto mb-8 md:mb-12">
            Everything you need to deliver exceptional voice-based customer support at scale.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <CapabilityCard
              icon={<Clock className="w-6 h-6 text-cyan-600" />}
              title="24/7 Automated Support"
              description="Never miss a customer call. AI agents handle inbound calls around the clock, even on holidays and weekends."
            />
            <CapabilityCard
              icon={<MessageSquare className="w-6 h-6 text-cyan-600" />}
              title="Natural Voice Interactions"
              description="Resolve common issues through natural, human-like conversations that customers actually enjoy."
            />
            <CapabilityCard
              icon={<Zap className="w-6 h-6 text-cyan-600" />}
              title="Faster Response Times"
              description="Eliminate hold times and improve customer satisfaction with instant, intelligent responses to every call."
            />
            <CapabilityCard
              icon={<TrendingUp className="w-6 h-6 text-cyan-600" />}
              title="Scale on Demand"
              description="Handle high call volumes without hiring. Scale support up or down instantly during peak periods."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-lg mx-auto mb-8 md:mb-12">
            Get your AI voice agent up and running in minutes, not months.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StepCard
              step={1}
              icon={<Bot className="w-6 h-6" />}
              title="Train Your Agent"
              description="Upload your knowledge base, FAQs, and business rules. AI learns your products, policies, and tone."
            />
            <StepCard
              step={2}
              icon={<PhoneCall className="w-6 h-6" />}
              title="Assign a Number"
              description="Get a dedicated AI phone number or forward your existing line to your voice agent."
            />
            <StepCard
              step={3}
              icon={<Mic className="w-6 h-6" />}
              title="Go Live"
              description="Your AI agent starts handling calls immediately — answering questions, routing requests, and capturing leads."
            />
            <StepCard
              step={4}
              icon={<BarChart3 className="w-6 h-6" />}
              title="Monitor & Improve"
              description="Review transcripts, track resolution rates, and continuously refine your agent's responses."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-10 md:py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">Built for Business</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-lg mx-auto mb-8 md:mb-12">
            Enterprise-grade voice AI with the features your team needs.
          </p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-cyan-600" />}
              title="Multilingual Support"
              features={[
                'Speaks 30+ languages natively',
                'Auto-detects caller language',
                'Spanish, Portuguese, French, Arabic & more',
                'No translation delays',
              ]}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-cyan-600" />}
              title="Intelligent Routing"
              features={[
                'Seamless handoff to human agents',
                'Business hours + after-hours handling',
                'Staff PIN authentication',
                'Priority escalation rules',
              ]}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-cyan-600" />}
              title="Analytics & Insights"
              features={[
                'Call recording + AI transcription',
                'Conversation summaries',
                'Resolution rate tracking',
                'Customer sentiment analysis',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">Use Cases</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-lg mx-auto mb-8 md:mb-12">
            Voice AI agents that handle real business conversations.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <UseCaseCard
              title="Inbound Customer Support"
              description="Answer product questions, check order status, handle returns, and resolve common issues — all without human intervention."
              icon={<Headphones className="w-5 h-5" />}
            />
            <UseCaseCard
              title="Lead Qualification"
              description="Capture caller information, qualify leads with custom questions, and route hot prospects directly to your sales team."
              icon={<Users className="w-5 h-5" />}
            />
            <UseCaseCard
              title="Appointment Scheduling"
              description="Let callers book, reschedule, or cancel appointments through natural conversation integrated with your calendar."
              icon={<Clock className="w-5 h-5" />}
            />
            <UseCaseCard
              title="After-Hours Coverage"
              description="Provide full support outside business hours. Capture urgent requests and ensure nothing falls through the cracks."
              icon={<PhoneCall className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-10 md:py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-3xl mx-auto">
          <Card className="border-cyan-500/30 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-7 h-7 text-cyan-600" />
              </div>
              <CardTitle className="text-xl md:text-2xl">AXLON Voice Agent</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                AI answers your phones 24/7 — never miss a customer again
              </p>
              <div className="mt-4">
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-3xl md:text-4xl font-bold">$499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  500 minutes included &middot; Requires AXLON Platform ($399/mo)
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {[
                  'Dedicated AI phone number',
                  '24/7 inbound call handling',
                  '500 minutes included/month',
                  'Inventory search during calls',
                  'Automatic lead capture',
                  'Call recording + AI transcription',
                  'Staff PIN authentication',
                  'Business hours routing',
                  'Call transfer to human',
                  '30+ languages supported',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2 py-1">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700" size="lg" asChild>
                  <Link href="/contact?plan=voice">
                    Add Voice Agent
                    <PhoneCall className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" size="lg" asChild>
                  <Link href="/pricing">
                    See Full Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-8 md:py-12 px-4 bg-primary/5 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg md:text-2xl font-bold mb-2">
            Ready to transform your customer support?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Join businesses using AXLON Voice to handle thousands of calls automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/get-started">
                <Zap className="w-4 h-4 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/contact?plan=demo">
                Book a Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 md:p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow text-center">
      <div className="w-12 h-12 rounded-xl bg-cyan-600/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
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
      <div className="absolute -top-2.5 -left-1.5 md:-top-3 md:-left-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-cyan-600 text-white text-xs md:text-sm font-bold flex items-center justify-center">
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
}: {
  icon: React.ReactNode;
  title: string;
  features: string[];
}) {
  return (
    <div className="p-4 md:p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center mb-3 md:mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3">{title}</h3>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-5 md:p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

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
  Users,
  Globe,
  Zap,
  BarChart3,
  Shield,
  Bot,
  Mic,
  KeyRound,
  Building2,
  Phone,
} from 'lucide-react';

export function VoiceContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-cyan-600/10 text-cyan-600 border-cyan-600/20 hover:bg-cyan-600/10">
            <Headphones className="w-3.5 h-3.5 mr-1.5" />
            AI Voice Agent
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
            One number. Your entire<br className="hidden sm:block" /> business on the line.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your Voice Agent knows your inventory, your CRM, your pricing, and your team.
            Customers call and get real answers. Your team calls and gets instant company intel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full gap-2 bg-cyan-600 hover:bg-cyan-700" asChild>
              <Link href="/get-started?plan=suite">
                Start 30-Day Free Trial
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

      {/* How One Number Works */}
      <section className="py-10 md:py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-xl mx-auto mb-8 md:mb-12">
            One phone number. Two modes. The AI knows the difference.
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Customer Mode */}
            <Card className="border-cyan-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Customer Calls</CardTitle>
                    <p className="text-xs text-muted-foreground">Anyone who dials your number</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {[
                    'Answers in the caller\'s language automatically',
                    'Searches your live inventory during the call',
                    'Quotes pricing based on your rules',
                    'Captures lead info — name, email, what they need',
                    'Books appointments or transfers to sales',
                    'Handles after-hours calls like it\'s business hours',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/20">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Example:</span> &quot;Hi, I&apos;m looking for a 2023 lowboy under $100K.&quot;
                    — AI searches your inventory, finds 3 matches, texts specs to the caller, and logs the lead in your CRM.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team Mode */}
            <Card className="border-amber-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Team Calls with PIN</CardTitle>
                    <p className="text-xs text-muted-foreground">Your staff enters a PIN for internal access</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {[
                    '"What\'s the status on the Johnson deal?"',
                    '"How many units do we have on the lot?"',
                    '"What did we quote Mike Garcia last week?"',
                    '"Pull up the specs on unit #4821"',
                    '"What\'s our margin on the Trail King 55-ton?"',
                    'Access level depends on the PIN — you control it',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Example:</span> Sales manager calls, enters PIN #001.
                    &quot;What&apos;s our floor plan exposure this month?&quot; — AI pulls live CRM data and gives the answer in seconds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PIN Access Levels */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">You Control the Access</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-xl mx-auto mb-8 md:mb-12">
            Different PINs, different access levels. You decide what each role can see.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 rounded-xl border bg-background text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">Sales Team</h3>
              <p className="text-xs text-muted-foreground mb-3">PIN: #100–199</p>
              <ul className="space-y-1.5 text-left">
                {['Inventory & pricing', 'Their own deal status', 'Customer contact info', 'Quote history'].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border bg-background text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Managers</h3>
              <p className="text-xs text-muted-foreground mb-3">PIN: #001–010</p>
              <ul className="space-y-1.5 text-left">
                {['Everything sales sees', 'Deal margins & profit', 'Floor plan exposure', 'Team performance'].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border bg-background text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-1">Service / Parts</h3>
              <p className="text-xs text-muted-foreground mb-3">PIN: #200–299</p>
              <ul className="space-y-1.5 text-left">
                {['Service history', 'Parts availability', 'Work order status', 'Customer vehicles'].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Large Dealerships */}
      <section className="py-10 md:py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">Built to Scale</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-xl mx-auto mb-8 md:mb-12">
            One number works for most dealers. Multi-location? We scale with you.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ScaleCard
              icon={<Phone className="w-5 h-5 text-cyan-600" />}
              title="Single Location"
              description="One number, one agent. PIN access for your whole team. Most dealers start here."
              tag="Included"
            />
            <ScaleCard
              icon={<Building2 className="w-5 h-5 text-cyan-600" />}
              title="Multi-Location"
              description="Separate number per lot. Each agent trained on that location's inventory."
              tag="Enterprise"
            />
            <ScaleCard
              icon={<Globe className="w-5 h-5 text-cyan-600" />}
              title="Department Routing"
              description="One number, AI routes to Sales, Service, or Parts based on the conversation."
              tag="Included"
            />
            <ScaleCard
              icon={<BarChart3 className="w-5 h-5 text-cyan-600" />}
              title="Call Tracking"
              description="Unique numbers for ads and listings. Track which marketing drives calls."
              tag="Enterprise"
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-3">Everything Your Voice Agent Can Do</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-lg mx-auto mb-8 md:mb-12">
            Not just a phone answering bot. It&apos;s the AI brain for your entire company — with a voice.
          </p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-cyan-600" />}
              title="30+ Languages"
              features={[
                'Auto-detects caller language',
                'Spanish, Portuguese, French, Arabic & more',
                'No translation delays — real-time',
                'Same knowledge base in every language',
              ]}
            />
            <FeatureCard
              icon={<Bot className="w-6 h-6 text-cyan-600" />}
              title="Knows Your Business"
              features={[
                'Trained on your inventory & pricing',
                'Knows your CRM deals & customers',
                'Follows your business rules',
                'Learns from every conversation',
              ]}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-cyan-600" />}
              title="Full Visibility"
              features={[
                'Call recordings + AI transcripts',
                'Lead capture synced to CRM',
                'Conversation summaries',
                'Usage alerts & analytics',
              ]}
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
              <CardTitle className="text-xl md:text-2xl">Get Voice Agent</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Included in AI Suite — or add to any Platform plan
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-xs text-muted-foreground mb-1">Voice Agent add-on</p>
                  <p className="text-2xl font-bold">$499<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">+ Platform ($399/mo)</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Best Value — AI Suite</p>
                  <p className="text-2xl font-bold text-emerald-600">$699<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Platform + Voice — save $199</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                500 minutes included/month &middot; $0.25/min overage &middot; 30-day free trial
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
                  <Link href="/get-started?plan=suite">
                    Start Free Trial — AI Suite
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" size="lg" asChild>
                  <Link href="/pricing">
                    Compare Plans
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
            Ready to never miss a call again?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            30-day free trial. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/get-started">
                <Zap className="w-4 h-4 mr-2" />
                Start 30-Day Free Trial
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

function ScaleCard({
  icon,
  title,
  description,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="p-5 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          tag === 'Included' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
        }`}>
          {tag}
        </span>
      </div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  ArrowRight,
  Handshake,
  Bot,
  PhoneCall,
  BarChart3,
  Upload,
  Star,
  Zap,
  Users,
  DollarSign,
  Clock,
  Shield,
  Store,
  Globe,
  Headphones,
  Truck,
  Building2,
  Wrench,
  Package,
} from 'lucide-react';

export function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState('services');

  // Handle #pricing hash on load
  useEffect(() => {
    if (window.location.hash === '#pricing') {
      setActiveTab('pricing');
    }
  }, []);

  // Update hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'pricing') {
      window.history.replaceState(null, '', '/how-it-works#pricing');
    } else {
      window.history.replaceState(null, '', '/how-it-works');
    }
  };

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
            Replace your DMS, CRM, answering service, and BDC team with one AI platform. Built for dealers, brokers, and service businesses.
          </p>
        </div>
      </section>

      {/* Two Product Cards — hero-level */}
      <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-14">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* AI Platform Card */}
          <Link href="#platform-details" className="group block">
            <Card className="h-full border-primary/30 hover:border-primary/60 hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  AI Platform
                  <Badge className="bg-primary text-xs">Core</Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  Sales assistant, CRM & automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {[
                    'AI Sales Assistant — captures leads 24/7',
                    'CRM + Deal Desk with AI scoring',
                    'Knowledge Base trained on your inventory',
                    'Custom branded storefront',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">$399<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">30-day free trial</p>
                  </div>
                  <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start free trial <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Voice Agents Card */}
          <Link href="/voice" className="group block">
            <Card className="h-full border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 flex items-center justify-center mb-3">
                  <Headphones className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Voice Agents
                  <span className="text-[10px] font-semibold bg-cyan-600 text-white px-1.5 py-0.5 rounded-full leading-none">24/7</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Phone answering & lead capture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {[
                    'Dedicated AI phone number',
                    'Natural voice conversations in 30+ languages',
                    'Automatic lead capture from every call',
                    'Call recording + AI transcription',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">$499<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Bundle both for $699/mo</p>
                  </div>
                  <span className="text-sm text-cyan-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-14">
        <div className="rounded-2xl border bg-muted/30 p-5 md:p-8">
          <h3 className="font-bold text-base md:text-lg text-center mb-4 md:mb-6">Built for</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <AudienceCard icon={<Truck className="w-5 h-5" />} label="Dealers" />
            <AudienceCard icon={<Building2 className="w-5 h-5" />} label="Brokers" />
            <AudienceCard icon={<Wrench className="w-5 h-5" />} label="Service Businesses" />
            <AudienceCard icon={<Package className="w-5 h-5" />} label="Heavy Haul Companies" />
          </div>
        </div>
      </section>

      {/* Tabs: Details + Pricing */}
      <div className="max-w-5xl mx-auto px-4 pb-12 md:pb-16">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-10 h-11 md:h-12">
            <TabsTrigger value="services" className="gap-2 text-sm md:text-base">
              <Store className="w-4 h-4 hidden sm:block" />
              How It Works
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2 text-sm md:text-base">
              <DollarSign className="w-4 h-4 hidden sm:block" />
              Pricing
            </TabsTrigger>
          </TabsList>

          {/* === HOW IT WORKS === */}
          <TabsContent value="services">
            {/* Steps */}
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
                description="AI learns your inventory, pricing, and business rules. Your Knowledge Base makes it an expert on YOUR dealership."
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
                  title="Voice Agents"
                  features={[
                    'Dedicated AI phone number',
                    'Answers calls in any language',
                    '500 minutes included/month',
                    'Call transcripts & lead capture',
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
              <Button size="lg" className="rounded-full gap-2 w-full sm:w-auto" onClick={() => handleTabChange('pricing')}>
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto" asChild>
                <Link href="/contact?plan=demo">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* === PRICING === */}
          <TabsContent value="pricing" id="pricing">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-xl md:text-3xl font-bold mb-2">Simple, transparent pricing</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
                30-day free trial on all paid plans. No credit card required. No hidden costs.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
              {/* Platform */}
              <Card className="relative border-primary/50 shadow-lg">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">AXLON Platform</CardTitle>
                  </div>
                  <CardDescription>
                    Everything you need to run your dealership with AI
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold">$399</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      or $3,990/year (save $798)
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {[
                      'Unlimited listings on marketplace',
                      'AI Sales Assistant (24/7 lead capture)',
                      'AI Knowledge Base (trained on your inventory)',
                      'CRM + Deal Desk + Quote PDF generation',
                      'Floor Plan financing tracker',
                      'AI price estimates & image analysis',
                      'Custom branded storefront',
                      'Advanced analytics & trends',
                      'Staff management with permissions',
                      'Smart Import (AI-powered data migration)',
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/get-started">
                      Start 30-Day Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    No credit card required
                  </p>
                </CardContent>
              </Card>

              {/* Voice Add-on */}
              <Card className="relative border-cyan-500/30">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-cyan-600">Add-on</Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-5 h-5 text-cyan-600" />
                    <CardTitle className="text-xl">AXLON Voice</CardTitle>
                  </div>
                  <CardDescription>
                    AI answers your phones 24/7 — never miss a lead again
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold">$499</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      or $4,990/year (save $998) &middot; Requires Platform
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {[
                      'Dedicated AI phone number',
                      '24/7 inbound call handling',
                      '500 minutes included/month',
                      'Inventory search during calls',
                      'Automatic lead capture from every call',
                      'Call recording + AI transcription + summaries',
                      'Staff PIN authentication for internal data',
                      'Business hours routing + after-hours handling',
                      'Call transfer to human when needed',
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground border rounded-lg p-3 bg-muted/50">
                    Overage: $0.25/min beyond 500 included minutes
                  </p>
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700" size="lg" asChild>
                    <Link href="/contact?plan=voice">
                      Add Voice Agent
                      <PhoneCall className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ROI */}
            <div className="rounded-2xl bg-muted/30 border p-4 md:p-8 mb-10 md:mb-12">
              <h3 className="text-base md:text-xl font-bold text-center mb-4 md:mb-6">The math is simple</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <ROICard icon={<Users className="w-5 h-5 text-red-500" />} label="Receptionist" oldCost="$50,000/yr" />
                <ROICard icon={<DollarSign className="w-5 h-5 text-red-500" />} label="BDC Rep" oldCost="$45,000/yr" />
                <ROICard icon={<Clock className="w-5 h-5 text-red-500" />} label="Data Entry" oldCost="$35,000/yr" />
                <ROICard icon={<Shield className="w-5 h-5 text-red-500" />} label="Old DMS" oldCost="$5–30K/yr" />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold">
                  Total replaced: <span className="text-red-500 line-through">$130,000+/year</span>
                </p>
                <p className="text-xl md:text-2xl font-bold text-primary mt-1">
                  AXLON: $10,776/year
                </p>
              </div>
            </div>

            {/* Onboarding */}
            <h3 className="text-base md:text-xl font-bold text-center mb-4 md:mb-6">Get started your way</h3>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Self-Service
                    <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950/30">Free</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['Smart Import', 'Setup wizard', 'Help docs', 'Community support'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href="/get-started">Start Free</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/30 shadow-md relative">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-primary text-xs">Popular</Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Guided Setup
                    <span className="text-lg font-bold">$2,499</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['Onboarding specialist', 'AI configuration', 'Data migration', 'Team training', 'Priority support'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-green-600 font-medium mt-3">Waived with annual</p>
                  <Button size="sm" className="w-full mt-2" asChild>
                    <Link href="/contact?plan=guided">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Enterprise
                    <span className="text-lg font-bold">$14,999</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['On-site setup', 'Company analysis', 'Custom AI integration', 'Full data migration', 'In-person training'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-green-600 font-medium mt-3">Waived with annual</p>
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <Link href="/contact?plan=enterprise">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-center mb-6">FAQ</h3>
              <div className="space-y-4">
                <FAQItem
                  question="Do I need the Platform to use Voice?"
                  answer="Yes — Voice is an add-on. It uses your inventory, CRM, and Knowledge Base to answer calls intelligently."
                />
                <FAQItem
                  question="What happens if I go over 500 minutes?"
                  answer="$0.25/min overage. Most dealers use 200-400 min/month. You'll see usage alerts in your dashboard."
                />
                <FAQItem
                  question="Can I switch from my current DMS?"
                  answer="Yes — Smart Import migrates from TruckPaper, Salesforce, CDK, EverLogic, or any spreadsheet automatically."
                />
                <FAQItem
                  question="Is there a contract?"
                  answer="Annual commitment required. Annual plans include waived setup fees and save you $798-998/year."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom CTA — always visible */}
      <section className="py-8 md:py-12 px-4 bg-primary/5 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg md:text-2xl font-bold mb-3">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/get-started">
                <Zap className="w-4 h-4 mr-2" />
                Get Started Free
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

function AudienceCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-background border text-center">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <p className="text-sm font-medium">{label}</p>
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

function ROICard({
  icon,
  label,
  oldCost,
}: {
  icon: React.ReactNode;
  label: string;
  oldCost: string;
}) {
  return (
    <div className="p-4 bg-background rounded-xl border text-center">
      <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-2">
        {icon}
      </div>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-lg font-bold text-red-500 line-through">{oldCost}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-4">
      <h4 className="font-semibold text-sm mb-1">{question}</h4>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}

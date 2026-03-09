'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  ArrowRight,
  Search,
  MessageSquare,
  Handshake,
  Bot,
  PhoneCall,
  BarChart3,
  Upload,
  Sparkles,
  Star,
  Building2,
  Zap,
  Users,
  DollarSign,
  Clock,
  Shield,
  ShoppingCart,
  Store,
  Globe,
} from 'lucide-react';

export function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState('businesses');

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
      <section className="py-12 md:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            AXLON AI Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            See how AI can transform your business — and what it costs.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-10 h-12">
            <TabsTrigger value="businesses" className="gap-2 text-sm md:text-base">
              <Store className="w-4 h-4 hidden sm:block" />
              For Businesses
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2 text-sm md:text-base">
              <DollarSign className="w-4 h-4 hidden sm:block" />
              Pricing
            </TabsTrigger>
          </TabsList>

          {/* === FOR BUSINESSES === */}
          <TabsContent value="businesses">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Replace your entire tech stack with AI</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                DMS, CRM, answering service, BDC team — AXLON replaces it all for a fraction of the cost.
              </p>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

            {/* Features */}
            <h3 className="text-xl font-bold text-center mb-6">What&apos;s Included</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <FeatureCard
                icon={<Bot className="w-6 h-6 text-primary" />}
                title="AI Sales Assistant"
                features={[
                  'Captures leads 24/7 on your website',
                  'Trained on your inventory & pricing',
                  'Speaks 30+ languages (Spanish, Portuguese, Russian & more)',
                  'Instant answers to buyer questions',
                ]}
              />
              <FeatureCard
                icon={<PhoneCall className="w-6 h-6 text-cyan-600" />}
                title="AI Voice Agent"
                features={[
                  'Dedicated AI phone number',
                  'Answers calls in any language',
                  '500 minutes included/month',
                  'Call transcripts & lead capture',
                ]}
              />
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
            <div className="rounded-2xl border bg-gradient-to-br from-cyan-500/5 via-primary/5 to-cyan-500/5 p-6 md:p-8 mb-10">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">AI that speaks your customers&apos; language</h3>
                  <p className="text-sm text-muted-foreground">
                    No Spanish-speaking staff? No problem. AXLON AI handles live chat and phone calls in 30+ languages — Spanish, Portuguese, Russian, French, Arabic, and more. Open your business to every customer, regardless of language.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="rounded-full gap-2" onClick={() => handleTabChange('pricing')}>
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/contact?plan=demo">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* === PRICING === */}
          <TabsContent value="pricing" id="pricing">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Simple, transparent pricing</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                No per-user fees. No hidden costs. One platform, everything included.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
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
                      <span className="text-4xl font-bold">$399</span>
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
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Voice Add-on */}
              <Card className="relative border-cyan-500/30">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-cyan-600">Add-on</Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneCall className="w-5 h-5 text-cyan-600" />
                    <CardTitle className="text-xl">AXLON Voice</CardTitle>
                  </div>
                  <CardDescription>
                    AI answers your phones 24/7 — never miss a lead again
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">$499</span>
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
            <div className="rounded-2xl bg-muted/30 border p-6 md:p-8 mb-12">
              <h3 className="text-lg md:text-xl font-bold text-center mb-6">The math is simple</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <h3 className="text-lg md:text-xl font-bold text-center mb-6">Get started your way</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
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

            {/* FAQ — collapsed into fewer items */}
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
      <section className="py-12 px-4 bg-primary/5 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/get-started">
                <Zap className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
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
    <div className="relative p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
        {step}
      </div>
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
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
    <div className="p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
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

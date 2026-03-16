import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  PhoneCall,
  Star,
  Building2,
  Sparkles,
  Zap,
  Users,
  DollarSign,
  Clock,
  Shield,
  Gift,
  Bot,
  Headphones,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | AXLON AI',
  description: 'Simple, transparent pricing for the AI-powered business platform. AXLON Platform $399/mo, Voice AI $499/mo add-on. No hidden fees.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            30-day free trial — no credit card required
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            One platform. Everything you need.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Replace your DMS, CRM, answering service, and listing tools with one
            AI-powered platform. No per-user fees. No hidden costs.
          </p>
          <p className="text-sm text-muted-foreground">
            Set up in minutes — most businesses start receiving leads within days.
          </p>
        </div>
      </section>

      {/* Pricing Cards — 3 Column */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {/* Platform */}
          <Card className="relative border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">AI Platform</CardTitle>
              </div>
              <CardDescription>
                Run your inventory, leads, and deals with AI.
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
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required
              </p>
            </CardContent>
          </Card>

          {/* AI Suite — Center Hero */}
          <Card className="relative border-2 border-emerald-500/50 shadow-xl bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-emerald-600">Most Popular</Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-xl">AI Suite</CardTitle>
              </div>
              <CardDescription>
                Your business powered entirely by AI.
              </CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-emerald-600">$699</span>
                  <span className="text-muted-foreground">/month</span>
                  <span className="text-sm text-muted-foreground line-through">$898</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  or $6,990/year (save $1,398)
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xs font-medium">Everything in AI Platform, plus:</p>
              <ul className="space-y-3">
                {[
                  'AI Voice Agent answers calls 24/7',
                  'Dedicated AI phone number',
                  '500 voice minutes included/month',
                  'Searches inventory & quotes pricing on calls',
                  'Automatic lead capture & qualification',
                  'Call recordings + AI transcripts',
                  'Team PIN access — role-based company intel',
                  'Department routing + after-hours AI',
                  'Transfer to human when needed',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">Most businesses choose this plan.</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
                <Link href="/get-started?plan=suite">
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required
              </p>
            </CardContent>
          </Card>

          {/* Voice Agent */}
          <Card className="relative border-cyan-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-5 h-5 text-cyan-600" />
                <CardTitle className="text-xl">Voice Agent</CardTitle>
              </div>
              <CardDescription>
                Never miss another customer call.
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
                  '24/7 inbound call handling in 30+ languages',
                  '500 minutes included/month',
                  'Searches your inventory during live calls',
                  'Automatic lead capture from every call',
                  'Call recording + AI transcription',
                  'Team PIN access — role-based company intel',
                  'Department routing (Sales, Service, Parts)',
                  'Transfer to human when needed',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground border rounded-lg p-3 bg-muted/50">
                $0.25/min beyond 500 included minutes
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

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mt-12 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Feature</th>
                <th className="text-center py-3 px-4 font-medium">Platform</th>
                <th className="text-center py-3 px-4 font-bold text-emerald-600">AI Suite</th>
                <th className="text-center py-3 px-4 font-medium">Voice</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ['CRM + Deal Desk', true, true, false],
                ['AI Sales Assistant', true, true, false],
                ['Inventory Management', true, true, false],
                ['Branded Storefront', true, true, false],
                ['Smart Import', true, true, false],
                ['AI Voice Agent', false, true, true],
                ['Phone Lead Capture', false, true, true],
                ['Call Transcripts', false, true, true],
                ['Team PIN Access', false, true, true],
                ['Department Routing', false, true, true],
              ].map(([feature, platform, suite, voice]) => (
                <tr key={feature as string}>
                  <td className="py-2.5 pr-4 text-muted-foreground">{feature as string}</td>
                  <td className="py-2.5 px-4 text-center">{platform ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-2.5 px-4 text-center bg-emerald-50/30 dark:bg-emerald-950/10">{suite ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-2.5 px-4 text-center">{voice ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Cancel anytime &middot; No long-term contracts &middot; 30-day free trial on all plans
          </p>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            The math is simple
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            AXLON replaces multiple tools and salaries for a fraction of the cost
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ROICard
              icon={<Users className="w-5 h-5 text-red-500" />}
              label="Receptionist"
              oldCost="$50,000/yr"
              description="AXLON Voice handles calls 24/7"
            />
            <ROICard
              icon={<DollarSign className="w-5 h-5 text-red-500" />}
              label="BDC Rep"
              oldCost="$45,000/yr"
              description="AI captures and qualifies every lead"
            />
            <ROICard
              icon={<Clock className="w-5 h-5 text-red-500" />}
              label="Data Entry"
              oldCost="$35,000/yr"
              description="Smart Import migrates data in seconds"
            />
            <ROICard
              icon={<Shield className="w-5 h-5 text-red-500" />}
              label="Old DMS"
              oldCost="$5,000-30K/yr"
              description="AXLON replaces CDK, EverLogic, etc."
            />
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold">
              Total replaced: <span className="text-red-500 line-through">$130,000+/year</span>
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary mt-2">
              AXLON: $10,776/year
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Platform + Voice, billed annually
            </p>
          </div>
        </div>
      </section>

      {/* Onboarding Options */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Get started your way
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Whether you want to set up yourself or have us do everything — we have you covered
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Self-Service */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Self-Service
                  <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950/30">Free</Badge>
                </CardTitle>
                <CardDescription>
                  Sign up and get started on your own
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {[
                    'AI-powered Smart Import',
                    'Self-guided setup wizard',
                    'Help docs & video tutorials',
                    'Community support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/get-started">
                    Start Free
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Guided Setup */}
            <Card className="border-primary/30 shadow-md relative">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-primary">Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Guided Setup
                  <span className="text-xl font-bold">$2,499</span>
                </CardTitle>
                <CardDescription>
                  Remote onboarding via phone & Zoom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {[
                    'Dedicated onboarding specialist',
                    'AI configuration & training',
                    'Data migration assistance',
                    'Team training calls',
                    'Priority email support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-green-600 font-medium mt-4">
                  Waived with annual commitment
                </p>
                <Button className="w-full mt-4" asChild>
                  <Link href="/contact?plan=guided">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Onboarding */}
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Enterprise
                  <span className="text-xl font-bold">$14,999</span>
                </CardTitle>
                <CardDescription>
                  We fly to your office and do everything
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {[
                    'On-site at your location',
                    'Full company analysis',
                    'Custom AI integration',
                    'Complete data migration',
                    'In-person team training',
                    'Live in 2 weeks',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-green-600 font-medium mt-4">
                  Waived with annual commitment
                </p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/contact?plan=enterprise">
                    Contact Sales
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-3xl mx-auto text-center">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Multi-location business group?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get custom pricing with volume discounts, dedicated account management,
            API access, and priority support for your entire organization.
          </p>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact?plan=enterprise">
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Do I need the Platform to use Voice?"
              answer="Yes — AXLON Voice is an add-on that requires the Platform subscription. Voice uses your inventory data, CRM, and Knowledge Base to answer caller questions intelligently."
            />
            <FAQItem
              question="What happens if I go over 500 voice minutes?"
              answer="Overage is billed at $0.25 per minute. You'll see your usage in the dashboard and get alerts as you approach the limit. Most businesses use 200-400 minutes/month."
            />
            <FAQItem
              question="Can I switch from my current DMS?"
              answer="Yes — Smart Import automatically migrates data from TruckPaper, Salesforce, CDK, EverLogic, or any spreadsheet. Just drop your files and AI does the rest. Or choose Guided Setup and we'll handle the migration for you."
            />
            <FAQItem
              question="How does the 30-day free trial work?"
              answer="Sign up with just your email — no credit card required. You get full access to the AI Platform for 30 days. If you love it (and you will), pick a plan. If not, no charge."
            />
            <FAQItem
              question="Is there a contract?"
              answer="No long-term contracts required. Monthly plans are available, or save with an annual commitment that also waives setup fees. We're confident you'll see ROI within the first month."
            />
            <FAQItem
              question="How does the annual discount work?"
              answer="Annual plans are billed upfront at 10 months' price instead of 12 — saving you $798/year on Platform and $998/year on Voice. Setup fees ($2,499 or $14,999) are also waived with an annual commitment."
            />
            <FAQItem
              question="What if I just want to list equipment for free?"
              answer="You can create a free account and list up to 5 pieces of equipment on the marketplace. The Platform subscription unlocks unlimited listings plus all AI features."
            />
            <FAQItem
              question="How long does setup take?"
              answer="Self-service: you can be live in under an hour using Smart Import. Guided Setup: typically 3-5 business days. Enterprise Onboarding: 2 weeks from kickoff to fully live."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to modernize your business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start your 30-day free trial today. No credit card required.
            Join businesses saving $100,000+ per year with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/get-started">
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
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

function ROICard({
  icon,
  label,
  oldCost,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  oldCost: string;
  description: string;
}) {
  return (
    <div className="p-5 bg-background rounded-xl border text-center">
      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="font-medium text-sm mb-1">{label}</p>
      <p className="text-xl font-bold text-red-500 line-through mb-1">{oldCost}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}

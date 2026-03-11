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
  Crown,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | AXLON AI',
  description: 'Simple, transparent pricing for the AI-powered dealer platform. AXLON Platform $399/mo, Voice AI $499/mo add-on. No hidden fees.',
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
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Replace your DMS, CRM, answering service, and listing tools with one
            AI-powered platform. No per-user fees. No hidden costs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
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
              <p className="text-xs text-center text-muted-foreground">
                Included in AI Suite bundle
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Suite Bundle */}
        <div className="max-w-5xl mx-auto mt-8">
          <Card className="relative border-2 border-emerald-500/50 shadow-xl bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 dark:from-emerald-950/20 dark:to-cyan-950/20">
            <div className="absolute -top-3 left-4">
              <Badge className="bg-emerald-600">Best Value — Save $199/mo</Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-xl">AI Suite</CardTitle>
                <span className="text-sm text-muted-foreground">Platform + Voice</span>
              </div>
              <CardDescription>
                The complete AI operating system — everything in one bundle
              </CardDescription>
              <div className="mt-4 flex items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-emerald-600">$699</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <span className="text-sm text-muted-foreground line-through">$898/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                or $6,990/year (save $1,398) &middot; Save $199/mo vs buying separately
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Platform Included</p>
                  <ul className="space-y-2">
                    {['AI Sales Assistant & CRM', 'Smart Import & automation', 'Analytics & deal scoring', 'Custom branded storefront'].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Voice Included</p>
                  <ul className="space-y-2">
                    {['24/7 AI phone answering', '500 minutes/mo included', 'Call transcripts & summaries', 'Lead capture from every call'].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
                <Link href="/get-started?plan=suite">
                  Start 30-Day Free Trial — AI Suite
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                No credit card required &middot; Full access to everything
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Founding Dealer Program */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <Badge className="bg-amber-600">Limited — First 100 Dealers</Badge>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Founding Dealer Program</h3>
                  <p className="text-muted-foreground mb-4">
                    Lock in <span className="font-bold text-foreground">$299/mo for the AI Suite forever</span>.
                    As a founding dealer, your rate never increases — even as we add new features and raise prices.
                  </p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-500" />
                      Platform + Voice included
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-500" />
                      Price locked forever
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-500" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-amber-500" />
                      Early access to new features
                    </li>
                  </ul>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <p className="text-sm text-muted-foreground line-through">$699/mo</p>
                  <p className="text-4xl font-bold text-amber-600">$299</p>
                  <p className="text-sm text-muted-foreground">/mo forever</p>
                  <Button className="mt-3 bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/get-started?plan=founding">
                      Claim Your Spot
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
            Multi-location dealer group?
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
              answer="Overage is billed at $0.25 per minute. You'll see your usage in the dashboard and get alerts as you approach the limit. Most dealers use 200-400 minutes/month."
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
              question="What is the Founding Dealer Program?"
              answer="The first 100 dealers to sign up get the full AI Suite (Platform + Voice) locked at $299/mo forever — even as we add features and raise prices. It's our way of rewarding early adopters."
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
            Ready to modernize your dealership?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start your 30-day free trial today. No credit card required.
            Join dealers saving $100,000+ per year with AI.
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

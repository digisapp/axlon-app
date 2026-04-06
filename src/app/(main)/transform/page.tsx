import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle,
  Shield,
  Target,
  Truck,
  Zap,
  FileText,
  PhoneCall,
  TrendingUp,
  Award,
  Calendar,
  Settings,
  BarChart3,
  Users,
  Clock,
  Star,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Transformation Program | AXLON',
  description:
    'We partner with 12–15 heavy haul and equipment companies per year. We embed directly into your operations, deploy custom AI systems, and integrate your inventory into the Axlon Marketplace.',
  alternates: { canonical: '/transform' },
  openGraph: {
    title: 'AI Transformation Program | AXLON',
    description:
      'We partner with 12–15 heavy haul and equipment companies per year. Custom AI systems that eliminate waste and drive revenue.',
  },
  robots: { index: false, follow: false },
};

const whoWeServe = [
  {
    icon: Truck,
    title: 'Heavy Haul & Lowboy Carriers',
    description: 'Oversize load operators, specialized transport, and heavy haul fleets.',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: Building2,
    title: 'Equipment Dealers',
    description: 'Cat, John Deere, Komatsu, and independent heavy equipment dealerships.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Settings,
    title: 'Crane & Rigging Companies',
    description: 'Crane operators, rigging specialists, and specialized transport companies.',
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    icon: Users,
    title: 'Regional Fleet Operators',
    description: 'Fleets with 20+ trucks, trailers, or equipment rental operations.',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
];

const processSteps = [
  {
    step: '01',
    icon: PhoneCall,
    title: 'Free AI Opportunity Assessment',
    duration: '45 minutes',
    price: 'Free',
    description:
      'We review your current operations and identify exactly where AI creates the biggest impact — dispatch, leads, quoting, documents, or all of the above.',
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Paid AI Audit Report',
    duration: '5–7 business days',
    price: '$3,500',
    description:
      'A detailed 15–20 page report mapping every AI opportunity in your business, ranked by ROI, with exact cost-to-save projections and a 12-month roadmap.',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    step: '03',
    icon: Settings,
    title: 'Scoping Workshop',
    duration: 'Half-day session',
    price: '$9,500–$12,500',
    description:
      'We work directly with your leadership team to design your custom 12-month transformation plan. This fee applies toward the full program investment.',
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    step: '04',
    icon: Bot,
    title: '12-Month AI Transformation',
    duration: 'Full year',
    price: 'Custom',
    description:
      'Full deployment of custom AI systems across your entire operation, delivered in three structured phases with clear milestones and monthly reviews.',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
];

const phases = [
  {
    phase: 'Phase 1',
    months: 'Months 1–3',
    title: 'Foundation',
    icon: Zap,
    color: 'text-primary',
    borderColor: 'border-primary',
    items: [
      'AI Lead Response System — instant replies to inbound inquiries 24/7',
      'Intelligent CRM with automated follow-up sequences',
      'Document AI for BOLs, invoices, titles, and compliance docs',
      'Full business process audit and AI opportunity mapping',
    ],
  },
  {
    phase: 'Phase 2',
    months: 'Months 4–7',
    title: 'Core Automation',
    icon: Bot,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    items: [
      'AI Dispatch & Load Matching system',
      'Automated quoting engine tailored to your fleet or inventory',
      'Sales team AI assistant for faster, smarter deal management',
      'Predictive inventory and pricing intelligence',
    ],
  },
  {
    phase: 'Phase 3',
    months: 'Months 8–12',
    title: 'Optimization & Marketplace',
    icon: TrendingUp,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    items: [
      'Full analytics dashboard and AI performance reporting',
      'Complete Axlon Marketplace integration — we handle everything',
      'AI-Ready Dealer Certification',
      'Custom AI systems built specifically for your niche',
    ],
  },
];

const certificationBenefits = [
  '"AI-Ready Certified" badge on every marketplace listing',
  'Dedicated landing page on Axlon with SEO advantage',
  'Buyers can filter specifically for certified dealers',
  'Priority placement in Axlon search results',
  'Case study feature on Axlon marketing channels',
];

const results = [
  { metric: '$100k–$500k', label: 'Average annual savings per client' },
  { metric: '12 months', label: 'Full transformation timeline' },
  { metric: '10–15', label: 'Clients accepted per year' },
  { metric: '3–4', label: 'New spots available per quarter' },
];

export default function TransformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            Only 3–4 new clients accepted per quarter
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
              AI Transformation for the Heavy Haul & Equipment Industry
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              We partner with only 12–15 companies each year. We embed directly into your operations,
              deploy custom AI systems that eliminate waste and drive revenue, and integrate your
              inventory into the Axlon Marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-full gap-2 group" asChild>
                <Link href="/apply">
                  Apply for Free Assessment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-slate-600 text-slate-200 hover:bg-slate-800"
                asChild
              >
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16 space-y-16 md:space-y-24">

        {/* Results Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((r) => (
            <div key={r.label} className="bg-card border rounded-xl p-4 md:p-6 text-center">
              <p className="text-xl md:text-2xl font-bold text-primary mb-1">{r.metric}</p>
              <p className="text-xs text-muted-foreground leading-snug">{r.label}</p>
            </div>
          ))}
        </div>

        {/* Who This Is For */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Who This Is For</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              We work exclusively with businesses in the heavy equipment and transport industry —
              operators who are serious about using AI to build a durable competitive advantage.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {whoWeServe.map((item) => (
              <div key={item.title} className="bg-card border rounded-xl p-5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.color}`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1.5 text-sm md:text-base">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Process */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Our Process</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Every engagement starts with a free assessment and builds toward a fully custom
              12-month transformation. No guesswork, no generic templates.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className={`bg-card border rounded-xl p-5 md:p-6 relative overflow-hidden`}
              >
                <div className="absolute top-4 right-4 text-4xl font-bold text-muted/20 select-none">
                  {step.step}
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${step.color}`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base">{step.title}</h3>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                  <span className="text-xs font-semibold text-primary">{step.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get — Phases */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              The 12-Month Transformation
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Every client receives a fully custom AI stack, delivered in three structured phases
              with clear milestones and monthly executive reviews.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {phases.map((phase) => (
              <div
                key={phase.phase}
                className={`bg-card border-2 ${phase.borderColor}/30 rounded-xl p-5 md:p-6`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <phase.icon className={`w-4 h-4 ${phase.color}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${phase.color}`}>
                    {phase.phase}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-lg font-bold">{phase.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{phase.months}</p>
                <ul className="space-y-2.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${phase.color}`} />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Investment */}
        <div className="bg-card border rounded-2xl p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Investment</h2>
              </div>
              <p className="text-muted-foreground mb-5 leading-relaxed text-sm md:text-base">
                We do not publish fixed pricing. Every engagement is custom-built around your
                operation, your team size, and the complexity of what we&apos;re building.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
                Most clients invest between <strong className="text-foreground">$4,500 and $12,000 per month</strong> for
                the 12-month program, plus the scoping workshop. We structure every engagement so
                the ROI is demonstrably larger than the investment — typically 3–7x in year one.
              </p>
              <Button className="rounded-full gap-2 group" asChild>
                <Link href="/apply">
                  Apply to Work With Us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Small Operator', price: '$4,500/mo', note: 'Smaller carriers, single-location dealers' },
                { label: 'Standard Engagement', price: '$7,000/mo', note: 'Most common — mid-size fleets and dealers', highlight: true },
                { label: 'Enterprise', price: '$10,000–$15,000/mo', note: 'Multi-location, large fleet operations' },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className={`rounded-xl p-4 border ${tier.highlight ? 'border-primary bg-primary/5' : 'bg-muted/30'}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm">{tier.label}</span>
                    <span className={`font-bold text-sm ${tier.highlight ? 'text-primary' : ''}`}>{tier.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tier.note}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-1">
                All engagements are 12-month agreements. Scoping workshop fee ($9,500–$12,500) applies toward program total.
              </p>
            </div>
          </div>
        </div>

        {/* AI-Ready Certification */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  AI-Ready Dealer Certification
                </h2>
              </div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Companies that complete the program receive a certification that creates a real
                marketplace advantage — not just a badge, but a tangible edge over competitors.
              </p>
            </div>
            <ul className="space-y-3">
              {certificationBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* After Year One */}
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">After Year One</h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                At the end of the 12-month program, you own your AI systems. You have the option
                to continue with our <strong className="text-foreground">AI Maintenance Program</strong> at{' '}
                <strong className="text-foreground">$2,500–$3,500/month</strong> — which includes
                ongoing system updates, new AI features as we release them, continued marketplace
                optimization, and dedicated support. Most clients choose to continue.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
              <Shield className="w-3.5 h-3.5" />
              Selective — 3–4 spots available per quarter
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to see where AI can take your business?
            </h2>
            <p className="text-slate-400 mb-7 text-sm md:text-base leading-relaxed">
              The AI Opportunity Assessment is free, 45 minutes, and gives you a clear picture of
              what&apos;s possible — with no obligation to continue.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" className="rounded-full gap-2 group" asChild>
                <Link href="/apply">
                  Apply for Free Assessment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-slate-600 text-slate-200 hover:bg-slate-800"
                asChild
              >
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              We only accept 3–4 new clients per quarter. If your business is a fit, we&apos;ll move quickly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

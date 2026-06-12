'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { csrfFetch } from '@/lib/csrf-fetch';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Star,
  Building2,
  Truck,
  Users,
  Settings,
} from 'lucide-react';

const businessTypes = [
  'Heavy Haul / Lowboy Carrier',
  'Equipment Dealer',
  'Crane & Rigging Company',
  'Regional Fleet Operator',
  'Equipment Rental Company',
  'Specialized Transport',
  'Other',
];

const employeeRanges = ['1–10', '11–50', '51–200', '200+'];

const revenueRanges = ['Under $1M', '$1M – $5M', '$5M – $20M', '$20M+'];

const painPoints = [
  'Dispatch & load coordination',
  'Lead follow-up & missed inquiries',
  'Quoting & estimating time',
  'Document processing (BOLs, invoices, titles)',
  'Sales team efficiency',
  'Multiple areas equally',
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  employees: string;
  revenue: string;
  painPoint: string;
  isDecisionMaker: string;
  openToCommitment: string;
};

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  businessType: '',
  employees: '',
  revenue: '',
  painPoint: '',
  isDecisionMaker: '',
  openToCommitment: '',
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.company.trim() &&
    form.businessType &&
    form.employees &&
    form.revenue &&
    form.painPoint &&
    form.isDecisionMaker &&
    form.openToCommitment;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError('');

    const message = `
AI TRANSFORMATION APPLICATION

Business Type: ${form.businessType}
Company Size: ${form.employees} employees
Annual Revenue: ${form.revenue}
Biggest Pain: ${form.painPoint}
Decision Maker: ${form.isDecisionMaker}
Open to 12-Month Commitment: ${form.openToCommitment}

Phone: ${form.phone || 'Not provided'}
    `.trim();

    try {
      const res = await csrfFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company,
          subject: 'AI Transformation Application',
          message,
          plan: 'transformation',
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please email us directly at sales@axlon.ai');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Application Received</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We review every application personally. If your business is a strong fit, you&apos;ll
            hear from us within 1–2 business days to schedule your free AI Opportunity Assessment.
          </p>
          <div className="bg-card border rounded-xl p-5 text-left mb-6 space-y-3">
            <p className="text-sm font-semibold">What happens next:</p>
            {[
              'We review your application (1–2 business days)',
              'If qualified, we reach out to schedule your free 45-min assessment',
              'On the call, we show you exactly where AI creates value in your operation',
              'No obligation to continue — the assessment is genuinely useful on its own',
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/transform">Back to AI Transformation</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
            <Star className="w-3.5 h-3.5" />
            Only 3–4 new clients accepted per quarter
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Apply for Your Free AI Opportunity Assessment
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              We review every application personally. This form takes 2 minutes and helps us
              understand if your business is a fit before we get on a call.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card border rounded-xl p-5 md:p-6 space-y-4">
              <h2 className="font-semibold text-base">Your Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="John Smith"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="john@company.com"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={set('company')}
                    placeholder="Smith Heavy Haul LLC"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Business Profile */}
            <div className="bg-card border rounded-xl p-5 md:p-6 space-y-4">
              <h2 className="font-semibold text-base">About Your Business</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  What type of business do you operate? <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.businessType}
                  onChange={set('businessType')}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Number of employees <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.employees}
                    onChange={set('employees')}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    <option value="">Select range</option>
                    {employeeRanges.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Estimated annual revenue <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.revenue}
                    onChange={set('revenue')}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    <option value="">Select range</option>
                    {revenueRanges.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  What is your biggest operational pain right now? <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.painPoint}
                  onChange={set('painPoint')}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">Select primary pain point</option>
                  {painPoints.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Qualification */}
            <div className="bg-card border rounded-xl p-5 md:p-6 space-y-4">
              <h2 className="font-semibold text-base">Two Quick Questions</h2>
              <div>
                <label className="block text-sm font-medium mb-2.5">
                  Are you the owner or primary decision-maker for this type of investment?{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No — I will involve my partner/investor'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                        form.isDecisionMaker === opt
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-muted-foreground/40 text-muted-foreground'
                      }`}
                    >
                      <input
                        type="radio"
                        name="isDecisionMaker"
                        value={opt}
                        checked={form.isDecisionMaker === opt}
                        onChange={set('isDecisionMaker')}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          form.isDecisionMaker === opt ? 'border-primary' : 'border-muted-foreground/40'
                        }`}
                      >
                        {form.isDecisionMaker === opt && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2.5">
                  If the ROI is clearly demonstrated, are you open to a 12-month commitment?{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {['Yes', 'Need to learn more first'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                        form.openToCommitment === opt
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-muted-foreground/40 text-muted-foreground'
                      }`}
                    >
                      <input
                        type="radio"
                        name="openToCommitment"
                        value={opt}
                        checked={form.openToCommitment === opt}
                        onChange={set('openToCommitment')}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          form.openToCommitment === opt ? 'border-primary' : 'border-muted-foreground/40'
                        }`}
                      >
                        {form.openToCommitment === opt && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full gap-2 group"
              disabled={!isValid || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              {!submitting && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We review every application personally and respond within 1–2 business days.
            </p>
          </form>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-white">What to Expect</span>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Clock, text: 'Application reviewed within 1–2 business days' },
                  { icon: CheckCircle, text: 'If qualified, we schedule your free 45-min assessment' },
                  { icon: Star, text: 'Assessment is genuinely useful — no sales pressure' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                We Work With
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: Truck, label: 'Heavy haul & lowboy carriers' },
                  { icon: Building2, label: 'Equipment dealers' },
                  { icon: Settings, label: 'Crane & rigging companies' },
                  { icon: Users, label: 'Regional fleet operators' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Prefer to talk first?
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Reach us directly at{' '}
                <a
                  href="mailto:sales@axlon.ai"
                  className="text-primary hover:underline"
                >
                  sales@axlon.ai
                </a>
              </p>
              <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                <Link href="/transform">Learn About the Program</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

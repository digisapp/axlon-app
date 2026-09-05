import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/contact/ContactForm';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  ArrowRight,
  Bot,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Axleyard team. Book a demo, ask about pricing, or get support for your equipment business.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Axleyard',
    description: 'Get in touch with the Axleyard team. Book a demo or get support.',
  },
};

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

const planLabels: Record<string, string> = {
  demo: 'Book a Demo',
  voice: 'Voice Agent Inquiry',
  enterprise: 'Enterprise Plan',
  starter: 'Starter Plan',
  pro: 'Pro Plan',
};

export default async function ContactPage({ searchParams }: PageProps) {
  const { plan } = await searchParams;
  const planLabel = plan ? planLabels[plan] || 'General Inquiry' : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                Contact Us
              </h1>
            </div>
            <p className="text-slate-400 text-base md:text-lg">
              Have a question, want a demo, or need support? We&apos;d love to hear from you.
            </p>
            {planLabel && (
              <Badge className="mt-3 bg-primary/20 text-primary border-0">
                {planLabel}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1">Send us a message</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill out the form and we&apos;ll get back to you within 24 hours.
              </p>

              <ContactForm defaultSubject={plan} defaultPlan={plan} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-card border rounded-2xl p-6 space-y-5">
              <h3 className="font-semibold text-lg">Get in touch</h3>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:hello@axlon.ai"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    hello@axlon.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href="tel:+14694213536"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    (469) 421-3536
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Miami, FL</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Quick links</h3>

              <Link
                href="/get-started"
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    Get Started
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Set up your AI-powered storefront
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link
                href="/how-it-works"
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    How It Works
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Learn about our AI platform
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Check,
  X,
  Zap,
  Building2,
  Mail,
  Phone,
  Package,
  Bot,
  BarChart3,
  Crown,
  PhoneCall,
  Store,
} from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  'Unlimited listings on marketplace',
  'Branded storefront page',
  'Buyer messaging & inquiries',
  'Basic analytics',
  '10 AI price estimates/month',
];

const PLATFORM_FEATURES = [
  'Everything in Marketplace',
  'AI lead response (AI Inbox)',
  'AI Sales Assistant — 24/7 lead capture',
  'CRM + Deal Desk + Quote generation',
  'Advanced analytics & market trends',
  'Bulk import & inventory management',
  'Custom branded storefront',
  'Floor plan financing tracker',
  'Staff management with permissions',
  'Unlimited AI price estimates',
  'Featured listings (5/month)',
];

const VOICE_FEATURES = [
  'Dedicated AI phone number',
  '24/7 inbound call handling',
  '500 minutes included/month',
  'Inventory search during calls',
  'Automatic lead capture from every call',
  'Call recording + AI transcription',
  'Staff PIN authentication',
  'Business hours routing',
];

const TRANSFORMATION_FEATURES = [
  'Platform + Voice included',
  'We build & configure everything for you',
  'AI lead response system deployed',
  'Voice agent trained on your business',
  'Monthly performance reviews',
  'Dedicated AXLON strategist',
  'Ongoing optimization & tuning',
  'Priority support',
];

export default async function BillingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/dashboard/billing');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, company_name')
    .eq('id', user.id)
    .single();

  const { data: voiceAgent } = await supabase
    .from('dealer_voice_agents')
    .select('plan_tier, minutes_used, minutes_included, is_active')
    .eq('dealer_id', user.id)
    .single();

  const { count: listingCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const currentTier = profile?.subscription_tier || 'free';
  const isPro = currentTier === 'pro' || currentTier === 'enterprise';
  const hasVoice = voiceAgent?.is_active;
  const voiceMinutesUsed = voiceAgent?.minutes_used || 0;
  const voiceMinutesIncluded = voiceAgent?.minutes_included || 500;
  const voicePercentage = Math.min(100, (voiceMinutesUsed / voiceMinutesIncluded) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Plans & Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                {isPro && <Crown className="w-5 h-5 text-primary" />}
              </CardTitle>
              <CardDescription>
                {currentTier === 'free' && 'Marketplace — free forever'}
                {currentTier === 'pro' && 'AXLON Platform — $499/month'}
                {currentTier === 'enterprise' && 'AI Transformation Program'}
              </CardDescription>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'}>
              {currentTier === 'free' ? 'Free' : currentTier === 'pro' ? 'Platform' : 'Transformation'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>Active Listings</span>
              </div>
              <span className="font-medium">{listingCount || 0} / ∞</span>
            </div>

            {hasVoice && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-muted-foreground" />
                    <span>Voice Minutes</span>
                  </div>
                  <span className="font-medium">{voiceMinutesUsed} / {voiceMinutesIncluded} min</span>
                </div>
                <Progress value={voicePercentage} className="h-2" />
                {voicePercentage >= 80 && (
                  <p className="text-xs text-amber-600">Approaching limit — overage at $0.25/min</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      {currentTier !== 'enterprise' && (
        <>
          <h2 className="text-xl font-bold pt-2">
            {isPro ? 'Your Plan & Add-ons' : 'Upgrade Your Plan'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Marketplace Free */}
            <Card className={currentTier === 'free' ? 'border-primary/40' : ''}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base">Marketplace</CardTitle>
                  {currentTier === 'free' && <Badge variant="outline" className="ml-auto text-xs">Current</Badge>}
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold">Free</span>
                  <p className="text-xs text-muted-foreground mt-1">Free forever — no credit card</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  {FREE_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {PLATFORM_FEATURES.slice(1).map(f => (
                    <li key={f} className="flex items-start gap-2 opacity-40">
                      <X className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {currentTier === 'free' ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : null}
              </CardContent>
            </Card>

            {/* Platform */}
            <Card className={`relative ${currentTier === 'free' ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
              {currentTier === 'free' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary px-3">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">AXLON Platform</CardTitle>
                  {isPro && !hasVoice && <Badge variant="outline" className="ml-auto text-xs">Current</Badge>}
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold">$499</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                  <p className="text-xs text-muted-foreground mt-1">or $4,990/yr — save $998</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  {PLATFORM_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {currentTier === 'free' ? (
                  <Button className="w-full" asChild>
                    <Link href="/contact?plan=platform">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Platform
                    </Link>
                  </Button>
                ) : !hasVoice ? (
                  <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                ) : null}
              </CardContent>
            </Card>

            {/* Voice Add-on */}
            <Card className={`relative border-cyan-500/30 ${hasVoice ? 'border-cyan-500' : ''}`}>
              <div className="absolute -top-3 left-4">
                <Badge className="bg-cyan-600 text-white">{hasVoice ? 'Active' : 'Add-on'}</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-cyan-600" />
                  <CardTitle className="text-base">Voice Agent</CardTitle>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold">$299</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                  <p className="text-xs text-muted-foreground mt-1">Requires Platform · Bundle saves $99/mo</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  {VOICE_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground border rounded-lg p-2 bg-muted/50 mb-4">
                  Overage: $0.25/min beyond 500 included minutes
                </p>
                {!hasVoice ? (
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                    <Link href="/contact?plan=voice">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      {isPro ? 'Add Voice Agent' : 'Get Platform + Voice — $699/mo'}
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>Active</Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bundle callout */}
          {!hasVoice && (
            <Card className="bg-gradient-to-r from-primary/5 to-cyan-500/5 border-primary/20">
              <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Platform + Voice Bundle</p>
                  <p className="text-sm text-muted-foreground">Get both for <span className="font-bold text-foreground">$699/mo</span> — save $99 vs separate</p>
                </div>
                <Button asChild className="shrink-0">
                  <Link href="/contact?plan=bundle">Get the Bundle</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* AI Transformation */}
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <CardTitle>AI Transformation Program</CardTitle>
                <Badge className="bg-amber-600 text-white ml-2">By Application</Badge>
              </div>
              <CardDescription>
                We build, configure, and run your entire AI operation — you focus on selling.
              </CardDescription>
              <div className="mt-3">
                <span className="text-3xl font-bold">$4,500</span>
                <span className="text-muted-foreground text-sm">–$15,000/mo</span>
                <p className="text-xs text-muted-foreground mt-1">12-month engagement · Platform + Voice included</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {TRANSFORMATION_FEATURES.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-amber-600 hover:bg-amber-700" asChild>
                  <Link href="/apply">Apply Now</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/transform">See the Program</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Contact */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Questions about pricing?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Talk to us — we&apos;ll help you find the right fit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <a href="mailto:sales@axlon.ai">
                <Mail className="w-4 h-4 mr-2" />
                sales@axlon.ai
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

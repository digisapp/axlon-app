import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Check,
  X,
  Star,
  Zap,
  Building2,
  Mail,
  Phone,
  Package,
  Bot,
  BarChart3,
  Crown,
  PhoneCall,
  Sparkles,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

// Plan limits
const PLAN_LIMITS = {
  free: {
    listings: 5,
    aiPriceEstimates: 5,
    featuredListings: 0,
    aiAssistant: false,
    advancedAnalytics: false,
    customStorefront: false,
    crm: false,
    dealDesk: false,
    floorPlan: false,
    staffManagement: false,
    smartImport: false,
  },
  pro: {
    listings: -1, // unlimited
    aiPriceEstimates: -1,
    featuredListings: -1,
    aiAssistant: true,
    advancedAnalytics: true,
    customStorefront: true,
    crm: true,
    dealDesk: true,
    floorPlan: true,
    staffManagement: true,
    smartImport: true,
  },
  enterprise: {
    listings: -1,
    aiPriceEstimates: -1,
    featuredListings: -1,
    aiAssistant: true,
    advancedAnalytics: true,
    customStorefront: true,
    crm: true,
    dealDesk: true,
    floorPlan: true,
    staffManagement: true,
    smartImport: true,
  },
};

export default async function BillingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/billing');
  }

  // Check if user is a dealer
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_dealer, subscription_tier, company_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_dealer) {
    redirect('/get-started');
  }

  const currentTier = (profile?.subscription_tier || 'free') as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[currentTier];

  // Get current usage
  const [
    { count: listingCount },
    { data: voiceAgent },
  ] = await Promise.all([
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('dealer_voice_agents')
      .select('plan_tier, minutes_used, minutes_included, is_active')
      .eq('dealer_id', user.id)
      .single(),
  ]);

  const usage = {
    listings: listingCount || 0,
  };

  const listingPercentage = limits.listings === -1
    ? 0
    : Math.min(100, (usage.listings / limits.listings) * 100);

  const hasVoice = voiceAgent?.is_active;
  const voiceMinutesUsed = voiceAgent?.minutes_used || 0;
  const voiceMinutesIncluded = voiceAgent?.minutes_included || 0;
  const voicePercentage = voiceMinutesIncluded > 0
    ? Math.min(100, (voiceMinutesUsed / voiceMinutesIncluded) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Plans & Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and view usage
        </p>
      </div>

      {/* Current Plan & Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                {currentTier === 'pro' && <Crown className="w-5 h-5 text-primary" />}
              </CardTitle>
              <CardDescription>
                {currentTier === 'free' && 'You are on the Free plan'}
                {currentTier === 'pro' && 'You are on the AXLON Platform plan'}
                {currentTier === 'enterprise' && 'You are on the Enterprise plan'}
              </CardDescription>
            </div>
            <Badge
              variant={currentTier === 'free' ? 'secondary' : 'default'}
              className={currentTier === 'pro' ? 'bg-primary' : ''}
            >
              {currentTier === 'free' ? 'Free' : currentTier === 'pro' ? 'Platform' : 'Enterprise'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Stats */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Usage</h4>

            {/* Listings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Active Listings</span>
                </div>
                <span className="font-medium">
                  {usage.listings} / {limits.listings === -1 ? '∞' : limits.listings}
                </span>
              </div>
              {limits.listings !== -1 && (
                <Progress value={listingPercentage} className="h-2" />
              )}
              {limits.listings !== -1 && usage.listings >= limits.listings && (
                <p className="text-xs text-destructive">
                  You&apos;ve reached your listing limit. Upgrade to add more.
                </p>
              )}
            </div>

            {/* Voice Minutes */}
            {hasVoice && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-muted-foreground" />
                    <span>Voice Minutes</span>
                  </div>
                  <span className="font-medium">
                    {voiceMinutesUsed} / {voiceMinutesIncluded} min
                  </span>
                </div>
                <Progress value={voicePercentage} className="h-2" />
                {voicePercentage >= 80 && (
                  <p className="text-xs text-amber-600">
                    Approaching minute limit. Overage billed at $0.25/min.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Current Plan Features */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Your Plan Includes</h4>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {limits.listings === -1 ? 'Unlimited' : `Up to ${limits.listings}`} listings
              </li>
              <li className="flex items-center gap-2">
                {limits.aiAssistant ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={!limits.aiAssistant ? 'text-muted-foreground' : ''}>
                  AI Sales Assistant (24/7)
                </span>
              </li>
              <li className="flex items-center gap-2">
                {limits.crm ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={!limits.crm ? 'text-muted-foreground' : ''}>
                  CRM + Deal Desk
                </span>
              </li>
              <li className="flex items-center gap-2">
                {limits.advancedAnalytics ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={!limits.advancedAnalytics ? 'text-muted-foreground' : ''}>
                  Advanced Analytics
                </span>
              </li>
              <li className="flex items-center gap-2">
                {limits.customStorefront ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={!limits.customStorefront ? 'text-muted-foreground' : ''}>
                  Custom Storefront
                </span>
              </li>
              <li className="flex items-center gap-2">
                {limits.smartImport ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={!limits.smartImport ? 'text-muted-foreground' : ''}>
                  Smart Import (AI)
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options - Only show if not on enterprise */}
      {currentTier !== 'enterprise' && (
        <>
          <h2 className="text-xl font-bold pt-4">
            {currentTier === 'free' ? 'Upgrade Your Plan' : 'Available Plans'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Platform Plan */}
            <Card className={`relative ${currentTier === 'free' ? 'border-primary/50 shadow-lg' : ''}`}>
              {currentTier === 'free' && (
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-primary">Recommended</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <CardTitle>AXLON Platform</CardTitle>
                  {currentTier === 'pro' && (
                    <Badge variant="outline" className="ml-2">Current</Badge>
                  )}
                </div>
                <CardDescription>Everything you need to run your dealership with AI</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$399</span>
                  <span className="text-muted-foreground">/month</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    or $3,990/year (save $798)
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <strong>Unlimited</strong> listings on marketplace
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    AI Sales Assistant (24/7 lead capture)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    AI Knowledge Base (trained on your inventory)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    CRM + Deal Desk + Quote PDF generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Floor Plan financing tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    AI price estimates & image analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Custom branded storefront
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Advanced analytics & trends
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Staff management with permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Smart Import (AI-powered data migration)
                  </li>
                </ul>
                {currentTier === 'free' ? (
                  <Button className="w-full" asChild>
                    <Link href="/contact?plan=platform">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Platform
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Voice Add-on */}
            <Card className="relative border-cyan-500/30">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-cyan-600">Add-on</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-cyan-600" />
                  <CardTitle>AXLON Voice</CardTitle>
                  {hasVoice && (
                    <Badge variant="outline" className="ml-2">Active</Badge>
                  )}
                </div>
                <CardDescription>AI answers your phones 24/7 — never miss a lead</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$499</span>
                  <span className="text-muted-foreground">/month</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    or $4,990/year (save $998) &middot; Requires Platform plan
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Dedicated AI phone number
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    24/7 inbound call handling
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <strong>500 minutes</strong> included/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Inventory search during calls
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Automatic lead capture from every call
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Call recording + AI transcription + summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Staff PIN authentication for internal data
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Business hours routing + after-hours handling
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Call transfer to human when needed
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground border rounded-lg p-2 bg-muted/50">
                  Overage: $0.25/min beyond 500 included minutes
                </p>
                {!hasVoice ? (
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                    <Link href="/contact?plan=voice">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Add Voice Agent
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Active
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Options */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Onboarding & Setup
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you want to get started
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Self-Service</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sign up online and set up everything yourself. Use Smart Import to migrate
                    your data from spreadsheets, TruckPaper, or any other system.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      AI-powered Smart Import
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Self-guided setup wizard
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Help docs & video tutorials
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Guided Setup</span>
                    <span className="font-bold">$2,499</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remote onboarding via phone &amp; Zoom. We configure your AI, help migrate
                    your data, and train your team — all remotely.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Dedicated onboarding specialist
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      AI configuration & training
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Data migration assistance
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Team training calls
                    </li>
                  </ul>
                  <p className="text-xs text-green-600 font-medium mt-3">
                    Waived with annual commitment
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Enterprise Onboarding</span>
                    <span className="font-bold">$14,999</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We fly to your office, analyze your entire operation, train the AI on your
                    specific business, migrate all your data, and have you live in 2 weeks.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      On-site at your location
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Full company analysis
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Custom AI integration
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      Complete data migration
                    </li>
                    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500" />
                      In-person team training
                    </li>
                  </ul>
                  <p className="text-xs text-green-600 font-medium mt-3">
                    Waived with annual commitment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Enterprise</CardTitle>
              </div>
              <CardDescription>For multi-location dealer groups</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Everything in Platform + Voice
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Multi-location support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  API access & integrations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Custom onboarding & training
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Volume pricing on voice minutes
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact?plan=enterprise">
                  Contact Sales
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Contact */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Have questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our team is here to help you choose the right plan
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:sales@axlon.ai">
                  <Mail className="w-4 h-4 mr-2" />
                  sales@axlon.ai
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+1234567890">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

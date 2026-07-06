import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Check, Sparkles } from 'lucide-react';
import { FEATURE_INFO, PLAN_PRICES, type FeatureKey } from '@/lib/plans';

const PLATFORM_HIGHLIGHTS = [
  'AI Inbox — every lead answered in seconds',
  '24/7 AI Sales Assistant on your storefront',
  'CRM + Deal Desk built for equipment sales',
  'Bulk import from TruckPaper or spreadsheets',
  'Market intelligence & pricing recommendations',
  'Floor plan tracking across your credit lines',
];

export function UpgradePrompt({ feature }: { feature: FeatureKey }) {
  const info = FEATURE_INFO[feature];

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-16">
      <Card className="border-primary/30 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {info.label} is part of AXLON Platform
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {info.description}
          </p>
        </div>
        <CardContent className="p-6 space-y-6">
          <ul className="space-y-2.5">
            {PLATFORM_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">${PLAN_PRICES.pro}</span>
            <span className="text-muted-foreground text-sm">/month — replaces your CRM, DMS, and answering service</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" size="lg" asChild>
              <Link href="/dashboard/billing">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Platform
              </Link>
            </Button>
            <Button className="flex-1" size="lg" variant="outline" asChild>
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

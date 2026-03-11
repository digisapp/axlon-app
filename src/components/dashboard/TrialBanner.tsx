'use client';

import Link from 'next/link';
import { Clock, Eye, Users, Package, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TrialBannerProps {
  trialDaysRemaining: number;
  trialEndsAt: string;
  stats: {
    listingsCreated: number;
    totalViews: number;
    leadsCapured: number;
  };
}

export function TrialBanner({
  trialDaysRemaining,
  trialEndsAt,
  stats,
}: TrialBannerProps) {
  const isUrgent = trialDaysRemaining <= 9;
  const endDate = new Date(trialEndsAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      className={
        isUrgent
          ? 'border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20'
          : 'border-primary/30 bg-gradient-to-r from-primary/5 to-cyan-500/5'
      }
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Left: Trial status */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isUrgent ? (
                <Clock className="w-5 h-5 text-amber-600" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
              <h3 className="font-semibold text-sm md:text-base">
                {isUrgent
                  ? `${trialDaysRemaining} days left in your free trial`
                  : 'Your AXLON Free Trial'}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              {isUrgent
                ? `Your trial ends ${endDate}. Subscribe now to keep your AI assistant, leads, and data.`
                : `You have ${trialDaysRemaining} days to explore everything AXLON has to offer.`}
            </p>

            {/* Your Axlon Impact */}
            <div className="flex flex-wrap gap-4">
              <ImpactStat
                icon={<Package className="w-3.5 h-3.5" />}
                value={stats.listingsCreated}
                label="Listings created"
              />
              <ImpactStat
                icon={<Eye className="w-3.5 h-3.5" />}
                value={stats.totalViews}
                label="Views generated"
              />
              <ImpactStat
                icon={<Users className="w-3.5 h-3.5" />}
                value={stats.leadsCapured}
                label="Leads captured"
              />
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              className={
                isUrgent
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : ''
              }
              asChild
            >
              <Link href="/dashboard/billing">
                {isUrgent ? 'Subscribe Now' : 'View Plans'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            {isUrgent && (
              <p className="text-[10px] text-center text-muted-foreground">
                Founding Dealer: $299/mo forever
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImpactStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-bold">{value.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

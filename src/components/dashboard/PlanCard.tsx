import Link from 'next/link';
import { Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLAN_PRICES } from '@/lib/plans';

interface PlanCardProps {
  /** Actual plan on the profile, not the trial-aware tier */
  subscriptionTier?: string | null;
  /** Days left in the free trial; null/0 when not on one */
  trialDaysRemaining?: number | null;
  /** Mobile sheet closes itself when a link is followed */
  onNavigate?: () => void;
}

/**
 * The card at the bottom of the sidebar, aware of what the dealer is paying
 * for. Trial accounts see the countdown, free accounts past the trial see the
 * upgrade, and paying clients see nothing — software they already bought
 * shouldn't advertise itself to them.
 */
export function PlanCard({ subscriptionTier, trialDaysRemaining, onNavigate }: PlanCardProps) {
  const isFree = !subscriptionTier || subscriptionTier === 'free';
  if (!isFree) return null;

  const onTrial = typeof trialDaysRemaining === 'number' && trialDaysRemaining > 0;

  if (onTrial) {
    const urgent = trialDaysRemaining <= 7;
    return (
      <div
        className={
          urgent
            ? 'rounded-lg border border-amber-500/30 bg-amber-500/10 p-3'
            : 'rounded-lg border border-primary/20 bg-primary/5 p-3'
        }
      >
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Clock className={`w-3.5 h-3.5 ${urgent ? 'text-amber-500' : 'text-primary'}`} />
          {trialDaysRemaining} day{trialDaysRemaining === 1 ? '' : 's'} left in trial
        </p>
        <p className="mt-1 mb-3 text-xs text-muted-foreground">
          {urgent
            ? 'Keep your AI tools, leads and data after the trial.'
            : 'Every AXLON tool is unlocked while you try it.'}
        </p>
        <Button size="sm" variant={urgent ? 'default' : 'outline'} className="w-full" asChild>
          <Link href="/dashboard/billing" onClick={onNavigate}>
            {urgent ? 'Choose a plan' : 'See plans'}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
      <p className="flex items-center gap-1.5 text-sm font-medium">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        Unlock AXLON AI
      </p>
      <p className="mt-1 mb-3 text-xs text-muted-foreground">
        AI lead response, voice agent, CRM &amp; more — ${PLAN_PRICES.pro}/mo
      </p>
      <Button size="sm" className="w-full" asChild>
        <Link href="/dashboard/billing" onClick={onNavigate}>
          See plans
        </Link>
      </Button>
    </div>
  );
}

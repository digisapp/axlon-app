import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { panelClass } from './panel';

interface TrialBannerProps {
  trialDaysRemaining: number;
  trialEndsAt: string;
}

/**
 * One line, shown only in the last days of the trial. The sidebar plan card
 * carries the countdown the rest of the time.
 */
export function TrialBanner({ trialDaysRemaining, trialEndsAt }: TrialBannerProps) {
  const endDate = new Date(trialEndsAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={cn(
        panelClass,
        'flex flex-col gap-3 border-amber-500/30 bg-amber-500/5 px-4 py-3 sm:flex-row sm:items-center'
      )}
    >
      <Clock className="hidden sm:block w-5 h-5 shrink-0 text-amber-500" />
      <p className="flex-1 text-sm">
        <span className="font-medium">
          {trialDaysRemaining} day{trialDaysRemaining === 1 ? '' : 's'} left in your free trial.
        </span>{' '}
        <span className="text-muted-foreground">
          It ends {endDate}. Choose a plan to keep your AI tools, leads and data.
        </span>
      </p>
      <Button size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white" asChild>
        <Link href="/dashboard/billing">
          Choose a plan
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

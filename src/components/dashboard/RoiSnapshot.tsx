import { Users, Phone, DollarSign, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { panelClass } from './panel';

interface RoiSnapshotProps {
  monthLabel: string;
  leadsCaptured: number;
  pipelineValue: number;
  callsAnswered: number;
  aiDrafts: number;
}

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toLocaleString()}`;
}

/**
 * What AXLON did for this dealer this month, in one strip. This is the
 * reason a dealer keeps paying, so it sits right under the KPIs.
 */
export function RoiSnapshot({
  monthLabel,
  leadsCaptured,
  pipelineValue,
  callsAnswered,
  aiDrafts,
}: RoiSnapshotProps) {
  const stats = [
    { icon: <Users className="w-4 h-4" />, value: leadsCaptured.toLocaleString(), label: 'leads captured' },
    { icon: <Phone className="w-4 h-4" />, value: callsAnswered.toLocaleString(), label: 'calls answered' },
    { icon: <Bot className="w-4 h-4" />, value: aiDrafts.toLocaleString(), label: 'replies drafted' },
    { icon: <DollarSign className="w-4 h-4" />, value: formatCompactCurrency(pipelineValue), label: 'in open pipeline' },
  ];

  return (
    <section
      className={cn(panelClass, 'border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent')}
      aria-label={`AXLON activity in ${monthLabel}`}
    >
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6 md:px-5">
        <p className="flex items-center gap-2 text-sm font-semibold shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
          AXLON this month
          <span className="font-normal text-xs text-muted-foreground">{monthLabel}</span>
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-8">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-2">
              <span className="text-primary">{stat.icon}</span>
              <span className="text-base font-bold leading-none">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

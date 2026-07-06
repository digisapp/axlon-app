import { Card, CardContent } from '@/components/ui/card';
import { Users, Phone, DollarSign, Bot } from 'lucide-react';

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
 * The proof-of-value banner: what AXLON did for this dealer this month.
 * This number is the reason a dealer keeps paying $499/mo.
 */
export function RoiSnapshot({
  monthLabel,
  leadsCaptured,
  pipelineValue,
  callsAnswered,
  aiDrafts,
}: RoiSnapshotProps) {
  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: leadsCaptured.toLocaleString(),
      label: 'Leads captured',
      sub: 'Forms, AI chat & calls',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      value: formatCompactCurrency(pipelineValue),
      label: 'Active pipeline',
      sub: 'Open leads & deals',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      value: callsAnswered.toLocaleString(),
      label: 'Calls answered',
      sub: '24/7, never missed',
    },
    {
      icon: <Bot className="w-5 h-5" />,
      value: aiDrafts.toLocaleString(),
      label: 'AI responses drafted',
      sub: 'Replies in seconds',
    },
  ];

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm md:text-base">
            Your AXLON Impact
          </h2>
          <span className="text-xs md:text-sm text-muted-foreground">{monthLabel}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold leading-tight">{stat.value}</p>
                <p className="text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-[11px] md:text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

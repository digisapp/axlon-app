'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Users, ArrowRight } from 'lucide-react';

interface PipelineStage {
  key: string;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

interface LeadsPipelineProps {
  pipeline: {
    new: number;
    contacted: number;
    qualified: number;
    won: number;
    lost: number;
  };
}

export function LeadsPipeline({ pipeline }: LeadsPipelineProps) {
  const stages: PipelineStage[] = [
    { key: 'new', label: 'New', count: pipeline.new, color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { key: 'contacted', label: 'Contacted', count: pipeline.contacted, color: 'text-amber-600', bgColor: 'bg-amber-500' },
    { key: 'qualified', label: 'Qualified', count: pipeline.qualified, color: 'text-purple-600', bgColor: 'bg-purple-500' },
    { key: 'won', label: 'Won', count: pipeline.won, color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
    { key: 'lost', label: 'Lost', count: pipeline.lost, color: 'text-slate-500', bgColor: 'bg-slate-400' },
  ];

  const totalActive = pipeline.new + pipeline.contacted + pipeline.qualified;
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Leads Pipeline</h3>
          {totalActive > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {totalActive} active
            </span>
          )}
        </div>
        <Link
          href="/dashboard/leads"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Pipeline bars */}
      <div className="space-y-2.5">
        {stages.map((stage) => (
          <Link
            key={stage.key}
            href={`/dashboard/leads?status=${stage.key}`}
            className="flex items-center gap-3 group"
          >
            <span className={cn('text-xs font-medium w-20 shrink-0', stage.color)}>
              {stage.label}
            </span>
            <div className="flex-1 h-7 bg-muted/50 rounded-md overflow-hidden relative">
              <div
                className={cn('h-full rounded-md transition-all duration-500', stage.bgColor, 'opacity-20 group-hover:opacity-30')}
                style={{ width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 8 : 0)}%` }}
              />
              <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold">
                {stage.count}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Conversion hint */}
      {pipeline.won > 0 && totalActive > 0 && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          Win rate: <span className="font-medium text-emerald-600">{Math.round((pipeline.won / (pipeline.won + pipeline.lost || 1)) * 100)}%</span>
          {' · '}{totalActive} leads in progress
        </p>
      )}
    </div>
  );
}

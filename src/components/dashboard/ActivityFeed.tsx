'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Users,
  Eye,
  MessageSquare,
  Package,
  Phone,
  ArrowRight,
  Clock,
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'lead' | 'view' | 'message' | 'listing' | 'call';
  title: string;
  description: string;
  time: string;
  href?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeConfig = {
  lead: {
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  view: {
    icon: Eye,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  message: {
    icon: MessageSquare,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  listing: {
    icon: Package,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  call: {
    icon: Phone,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
        <p className="text-xs text-muted-foreground mt-1">Activity will appear here as leads come in</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, idx) => {
        const config = typeConfig[activity.type];
        const Icon = config.icon;

        const content = (
          <div className={cn(
            'flex items-start gap-3 p-2.5 rounded-lg transition-colors',
            activity.href && 'hover:bg-muted/50 cursor-pointer'
          )}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
              <Icon className={cn('w-4 h-4', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 mt-1">{activity.time}</span>
          </div>
        );

        if (activity.href) {
          return <Link key={activity.id} href={activity.href}>{content}</Link>;
        }
        return <div key={activity.id}>{content}</div>;
      })}
    </div>
  );
}

import Link from 'next/link';
import {
  MessageCircle,
  Clock,
  ImageOff,
  Inbox,
  Mail,
  PhoneMissed,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { panelClass } from './panel';

export type AttentionKind = 'lead' | 'followup' | 'draft' | 'message' | 'call' | 'photos' | 'stale';

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  description: string;
  href: string;
  /** Relative time label, e.g. "3h" */
  time?: string;
}

interface NeedsAttentionProps {
  items: AttentionItem[];
  /** Everything outstanding, including items beyond the ones listed */
  pendingCount: number;
}

const kindIcon: Record<AttentionKind, React.ReactNode> = {
  lead: <MessageCircle className="w-4 h-4" />,
  followup: <Clock className="w-4 h-4" />,
  draft: <Inbox className="w-4 h-4" />,
  message: <Mail className="w-4 h-4" />,
  call: <PhoneMissed className="w-4 h-4" />,
  photos: <ImageOff className="w-4 h-4" />,
  stale: <TrendingDown className="w-4 h-4" />,
};

/**
 * The actionable half of the overview: what a dealer has to do today, in
 * priority order, each row a link to the place it gets done.
 */
export function NeedsAttention({ items, pendingCount }: NeedsAttentionProps) {
  return (
    <section className={panelClass} aria-labelledby="needs-attention-heading">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-5 md:pt-5">
        <h2 id="needs-attention-heading" className="text-base md:text-lg font-semibold">
          Needs your attention
        </h2>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            {pendingCount} pending
          </span>
        ) : (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            All clear
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-3 px-4 py-6 md:px-5">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-medium">You&apos;re all caught up</p>
            <p className="text-xs text-muted-foreground">
              New inquiries, follow-ups and listing issues will show up here.
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-border/60 px-2 pb-2 md:px-3 md:pb-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    'flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary'
                  )}
                >
                  {kindIcon[item.kind]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
                </span>
                {item.time && (
                  <span className="hidden sm:block shrink-0 text-xs text-muted-foreground">{item.time}</span>
                )}
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground/60" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

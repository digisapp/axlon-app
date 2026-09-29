import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional icon shown before the title */
  icon?: React.ReactNode;
  /** Primary / secondary actions — right-aligned on desktop, wrap below the title on phones */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standard dashboard page header: one h1, a one-line description, and the
 * page's actions. Every dashboard page uses this so titles, spacing and
 * primary-action placement stay consistent from page to page.
 */
export function PageHeader({ title, description, icon, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight">
          {icon && <span className="shrink-0 text-primary [&_svg]:w-6 [&_svg]:h-6">{icon}</span>}
          <span className="min-w-0">{title}</span>
        </h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

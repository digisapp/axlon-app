import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    // The nav's negative margin + matching padding leaves layout unchanged but
    // gives the links' 40px hit areas room inside the overflow-x clip box
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 -my-3 py-3 -ml-3 pl-3 text-sm text-muted-foreground overflow-x-auto ${className}`}
    >
      <Link
        href="/"
        className="relative p-3 -m-3 hover:text-foreground transition-colors shrink-0"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 min-w-0">
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="py-2.5 -my-2.5 hover:text-foreground transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

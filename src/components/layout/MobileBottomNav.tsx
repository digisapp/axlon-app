'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/search', label: 'Search', icon: Search, exact: false },
  { href: '/dashboard/saved', label: 'Saved', icon: Heart, exact: false },
  { href: '/dashboard', label: 'Account', icon: User, exact: true },
];

// Marketplace browsing surfaces only — dashboard, admin, auth, listing detail
// (sticky contact CTA), and dealer storefronts (contact bar) keep their own
// bottom UI, so the nav stays out of the way there.
const SHOW_ON_PREFIXES = [
  '/search',
  '/new-trailers',
  '/categories',
  '/manufacturers',
  '/industries',
  '/dealers',
  '/deals',
  '/compare',
  '/finance',
  '/trade-in',
  '/tools',
  '/how-it-works',
  '/about',
  '/pricing',
  '/contact',
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const visible =
    pathname === '/' ||
    SHOW_ON_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

  if (!visible) return null;

  return (
    <>
      {/* In-flow spacer so page content isn't hidden behind the fixed nav */}
      <div className="h-[calc(3.5rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden="true" />
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid grid-cols-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

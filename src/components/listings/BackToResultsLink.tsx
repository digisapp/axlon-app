'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

function cameFromSite(): boolean {
  if (window.history.length < 2) return false;
  // Reached by client-side navigation: the URL differs from the document's
  // initial load (document.referrer isn't updated by soft navigations).
  const initial = performance.getEntriesByType('navigation')[0]?.name;
  if (initial && initial !== window.location.href) return true;
  try {
    return new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * "Back" on the mobile listing header. Arriving from inside the site (search
 * results, deals, a storefront), it steps back in history so the buyer lands
 * on the same filtered results and scroll position; from a shared link or
 * Google it falls back to /search.
 */
export function BackToResultsLink() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (cameFromSite()) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href="/search"
      onClick={handleClick}
      className="-ml-2 flex min-h-11 items-center gap-1 px-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </Link>
  );
}

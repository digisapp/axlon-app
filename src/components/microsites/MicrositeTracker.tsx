'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId, readAttribution } from '@/lib/microsites/attribution';

/**
 * Beacons one row per page view to /api/microsites/track.
 *
 * Client-side rather than server-side on purpose: the microsite pages are
 * statically revalidated (revalidate = 3600), so a server-side counter would
 * only fire on cache misses and undercount by orders of magnitude.
 */
export function MicrositeTracker({ micrositeId }: { micrositeId: string }) {
  const pathname = usePathname();
  // Guards React 18 StrictMode's double-effect in dev, and re-fires only on a
  // genuine path change.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    // The browser URL on a microsite is the public path ('/'), but the Next
    // pathname is the rewritten one ('/sites/xltrailers.com'). Record what the
    // visitor actually saw.
    const path = window.location.pathname || '/';
    const key = `${micrositeId}:${path}`;
    if (lastSent.current === key) return;
    lastSent.current = key;

    const attribution = readAttribution(window.location.search, document.referrer);

    const payload = JSON.stringify({
      microsite_id: micrositeId,
      session_id: getSessionId(),
      path,
      referrer: document.referrer || null,
      ...attribution,
    });

    // sendBeacon survives the page being closed mid-flight, which a fetch
    // from a bounced visitor often does not — and a bounce is still a visit.
    const sent =
      typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon('/api/microsites/track', new Blob([payload], { type: 'application/json' }));

    if (!sent) {
      fetch('/api/microsites/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {
        /* analytics must never break the page */
      });
    }
  }, [micrositeId, pathname]);

  return null;
}

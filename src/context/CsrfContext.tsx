'use client';

import { useEffect } from 'react';
import { getCsrfToken } from '@/lib/csrf-fetch';

/**
 * Pre-warms the CSRF token on app mount so the first mutation doesn't
 * incur an extra round-trip. No state — getCsrfToken() caches the promise
 * module-wide, so this is just a warm-up call.
 */
export function CsrfProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Fire-and-forget — errors are handled inside getCsrfToken
    getCsrfToken().catch(() => {
      // Token will be re-fetched lazily on first mutation
    });
  }, []);

  return <>{children}</>;
}

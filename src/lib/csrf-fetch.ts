/**
 * CSRF-aware fetch wrapper.
 *
 * Fetches a CSRF token from /api/csrf once per session and caches it in memory.
 * Automatically attaches the token as x-csrf-token on all state-changing requests
 * (POST, PUT, PATCH, DELETE).
 *
 * Usage — drop-in replacement for fetch():
 *   import { csrfFetch } from '@/lib/csrf-fetch';
 *   const res = await csrfFetch('/api/leads', { method: 'POST', body: ... });
 */

const CSRF_HEADER = 'x-csrf-token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let tokenPromise: Promise<string> | null = null;

async function fetchToken(): Promise<string> {
  const res = await fetch('/api/csrf', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch CSRF token');
  const { csrfToken } = await res.json();
  return csrfToken as string;
}

/** Returns a cached token, fetching once per module lifetime. */
export function getCsrfToken(): Promise<string> {
  if (!tokenPromise) {
    tokenPromise = fetchToken().catch((err) => {
      // Reset on failure so the next call retries
      tokenPromise = null;
      throw err;
    });
  }
  return tokenPromise;
}

/** Call this to force a fresh token (e.g. after a 403 CSRF error). */
export function resetCsrfToken(): void {
  tokenPromise = null;
}

/**
 * Drop-in replacement for fetch() that automatically attaches the CSRF token
 * on mutating requests. Read-only requests (GET, HEAD, OPTIONS) are passed through.
 */
export async function csrfFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase();

  if (!MUTATING_METHODS.has(method)) {
    return fetch(input, init);
  }

  const token = await getCsrfToken();

  const headers = new Headers(init.headers);
  headers.set(CSRF_HEADER, token);

  const res = await fetch(input, { ...init, headers });

  // If server rejects the token, reset so we fetch a fresh one next time
  if (res.status === 403) {
    const body = await res.clone().json().catch(() => ({}));
    if (body?.error?.toLowerCase().includes('csrf')) {
      resetCsrfToken();
    }
  }

  return res;
}

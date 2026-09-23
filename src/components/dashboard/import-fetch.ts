import { csrfFetch } from '@/lib/csrf-fetch';

const MAX_RATE_LIMIT_RETRIES = 3;

/**
 * POST one import row, waiting out a 429 instead of recording the row as
 * failed. The import loops send one request per row (up to 500) against
 * routes limited to 100 requests/minute, so every row past the 100th used to
 * fail with "Too many requests" and the dealer was left with a partial import.
 */
export async function postImportRow(url: string, body: unknown): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await csrfFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status !== 429 || attempt >= MAX_RATE_LIMIT_RETRIES) return res;

    const retryAfter = Number(res.headers.get('Retry-After'));
    const waitSeconds = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 65) : 10;
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
  }
}

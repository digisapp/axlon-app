/**
 * Manufacturer catalog images are still hotlinked from the manufacturers'
 * own sites. next/image fetches them server-side through /_next/image, and
 * a few origins sit behind bot protection that returns 403 to anything that
 * is not a real browser — the optimizer can never serve those, so they must
 * be rendered `unoptimized` (the browser loads them directly, as it did
 * before optimization was enabled).
 *
 * Verified 2026-09-05: www.eagerbeavertrailers.com answers 403 text/html to
 * every non-browser fetch, including curl with a Chrome user agent.
 *
 * The durable fix is re-hosting catalog images to Supabase storage like
 * listing images already are; until then, keep this list short and only
 * add a host after confirming the origin blocks server-side fetches.
 */
const OPTIMIZER_BLOCKED_HOSTS = new Set(['eagerbeavertrailers.com']);

export function isOptimizerBlockedImage(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    for (const blocked of OPTIMIZER_BLOCKED_HOSTS) {
      if (host === blocked || host.endsWith(`.${blocked}`)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { verifyInternalRequest } from '@/lib/security/internal-auth';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { MICROSITES_CACHE_TAG } from '@/lib/microsites/resolve';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * POST /api/internal/revalidate
 *
 * Drops every microsite data-cache entry (catalog grids, listings, stats).
 * Called by the manufacturer scraper when a run finishes, so a re-scrape shows
 * on the microsites on the next request instead of after the TTL — or never,
 * for a key whose stale-while-revalidate refresh was lost on a recycled
 * serverless instance.
 *
 * Auth is the HMAC v2 internal signature bound to this method and path, so a
 * captured header can't be replayed elsewhere. The admin UI has its own route
 * to the same revalidateTag; this one exists for callers outside a session.
 */
export async function POST(request: NextRequest) {
  try {
    if (!verifyInternalRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:internal-revalidate',
    });
    if (!limit.success) return rateLimitResponse(limit);

    // { expire: 0 } is the explicit purge-now for a route handler in Next 16;
    // a bare revalidateTag(tag) still purges but logs a deprecation warning.
    revalidateTag(MICROSITES_CACHE_TAG, { expire: 0 });

    logger.info('Microsite caches revalidated by internal request');
    return NextResponse.json({ revalidated: true, tag: MICROSITES_CACHE_TAG, at: new Date().toISOString() });
  } catch (error) {
    logger.error('Internal revalidate failed', { error });
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

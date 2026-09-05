/**
 * CDN caching for stable catalog data (manufacturer products, categories):
 * fresh at the edge for an hour, then served stale for a day while
 * revalidating. Browsers get max-age=0 so a deploy's CDN purge takes effect
 * immediately client-side.
 */
export const CATALOG_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

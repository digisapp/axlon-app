/**
 * Slugs that must never be used as a dealer storefront handle at axleyard.com/[slug].
 *
 * The root [slug] catch-all resolves AFTER static routes and route groups, so a
 * dealer whose slug collides with one of these (e.g. "pricing", "search") would
 * silently render the marketing page instead of their storefront and their
 * "View storefront" link would open the wrong page. Reject these on save.
 *
 * Keep in sync with the top-level segments under src/app/ (static pages, route
 * groups' public pages, and API/system paths).
 */
export const RESERVED_SLUGS = new Set<string>([
  // Marketing / public pages
  'about', 'apply', 'ask', 'become-a-dealer', 'categories', 'compare', 'contact',
  'deals', 'dealers', 'finance', 'for-business', 'get-started', 'how-it-works',
  'industries', 'listing', 'manufacturers', 'new-trailers', 'offline', 'pricing',
  'privacy', 'search', 'sponsors', 'terms', 'tools', 'trade-in', 'transform',
  'voice', 'workshops', 'claim',
  // Auth
  'login', 'signup', 'forgot-password', 'reset-password', 'auth', 'logout',
  // App areas / system
  'dashboard', 'admin', 'api', 'unsubscribe', 'sitemap', 'sitemap.xml',
  'robots.txt', 'favicon.ico', 'manifest.json', '_next', 'static', 'public',
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.trim().toLowerCase());
}

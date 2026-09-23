/**
 * Scraper-side guards against catalog debris.
 *
 * The first scrapes filed logos, certification badges and icons as product
 * photos, and consultation forms, colour charts and 404s as products. The app
 * hides what was found (src/lib/catalog/quality.ts); these guards stop the
 * next scrape putting it back, reading the same reviewed list.
 */
import junk from '../../src/lib/catalog/catalog-junk.json' with { type: 'json' };

const JUNK_HASHES = new Set(junk.junkImageHashes.map((e) => e.hash));
const HIDDEN_IDS = new Set(junk.hiddenProductIds.map((e) => e.id));
const NON_PRODUCT_NAME = new RegExp(junk.nonProductNamePattern, 'i');
const JUNK_COPY = new RegExp(junk.junkCopyPattern, 'i');
const LOGO_URL = new RegExp(junk.logoUrlPattern, 'i');

/** md5 prefix (8 hex) of a file already reviewed as not a product photo. */
export function isJunkImageHash(hash) {
  return JUNK_HASHES.has(String(hash).toLowerCase());
}

/** A source URL whose path says logo/icon/badge/social rather than photo. */
export function isLogoUrl(url) {
  try {
    return LOGO_URL.test(decodeURIComponent(new URL(url).pathname));
  } catch {
    return false;
  }
}

/** A product row deactivated by hand; a re-scrape must not revive it. */
export function isHiddenProductId(id) {
  return HIDDEN_IDS.has(id);
}

/** A scraped page title that names a service, option or article, not a trailer. */
export function isNonProductName(name) {
  return NON_PRODUCT_NAME.test(name || '');
}

/** Scraped copy, or null when it's a cookie banner, dealer copy, etc. */
export function cleanScrapedCopy(text) {
  if (!text) return null;
  return JUNK_COPY.test(text) ? null : text;
}

/**
 * Icon-sized images are never a trailer photo. Uses sharp when it can be
 * loaded (it ships with Next); without it, only the byte-size guard applies.
 */
let sharpModule;
export async function isIconSized(buffer) {
  if (sharpModule === undefined) {
    try {
      sharpModule = (await import('sharp')).default;
    } catch {
      sharpModule = null;
    }
  }
  if (!sharpModule) return false;
  try {
    const { width = 0, height = 0 } = await sharpModule(buffer).metadata();
    return Math.max(width, height) < 320;
  } catch {
    return false;
  }
}

import junk from '@/lib/catalog/catalog-junk.json';

/**
 * Scraped catalog "product images" that are not photos of the product.
 *
 * The manufacturer scrapers took every <img> on a product page, so a page's
 * logo, certification badges, icon-font graphics and social links landed in
 * manufacturer_product_images alongside the real photos — and for a whole
 * brand the junk was often image #1. xltrailers.com showed the same factory
 * icon on all 23 model cards; tag and category sites led with the Loadstar
 * and Globe logos.
 *
 * Re-hosted files are named `<n>-<first 8 hex of the file's md5>.<ext>`, so
 * one entry here catches every copy of the same file however many products it
 * was attached to. The list was built by hashing all 4,000 catalog images on
 * 2026-09-22, taking every file attached to 3+ products (160 of them), and
 * reviewing each by eye: 49 are logos, badges, icons, colour bars, maps,
 * truck-model banners or stock scenery — 533 image rows between them. Files
 * shared by sibling models that DO show a trailer were left alone. A second
 * pass looked at the lead photo of all 252 models the microsites can show.
 *
 * Filtering here rather than deleting rows keeps the call reversible; a
 * scraper-side guard is the durable fix.
 */
// The lists live in catalog-junk.json so the scrapers read the same ones.
const JUNK_HASH_PREFIXES = new Set(junk.junkImageHashes.map((e) => e.hash));

/**
 * Real trailer photos, but a maker's brand shot rather than the model: the
 * same image leads a whole range (fifteen Magnitude cards in a row). For
 * several Fontaine models they are the only images there are, so they are a
 * last resort, not junk — see `withBrandBannersLast`.
 */
const BRAND_BANNER_PREFIXES = new Set(junk.brandBannerHashes.map((e) => e.hash));

const HASHED_NAME = /-([0-9a-f]{8})\.[a-z0-9]+$/i;

function hashOf(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = HASHED_NAME.exec(url.split('?')[0]);
  return match ? match[1].toLowerCase() : null;
}

export function isJunkCatalogImage(url: string | null | undefined): boolean {
  const hash = hashOf(url);
  return hash !== null && JUNK_HASH_PREFIXES.has(hash);
}

export function isBrandBanner(url: string | null | undefined): boolean {
  const hash = hashOf(url);
  return hash !== null && BRAND_BANNER_PREFIXES.has(hash);
}

/**
 * Drop non-product images. Brand banners go too: the microsites draw a
 * trailer with the model's capacity instead, which reads better than one
 * banner repeated down the grid.
 */
export function withoutJunkImages<T extends { url: string }>(images: T[] | null | undefined): T[] {
  return (images ?? []).filter((img) => !isJunkCatalogImage(img.url) && !isBrandBanner(img.url));
}

/**
 * Drop non-product images but keep brand banners, moved behind every real
 * model photo. For the marketplace catalog, whose card has no drawn fallback:
 * a maker's own haul photo beats a grey truck icon.
 */
export function withBrandBannersLast<T extends { url: string }>(images: T[] | null | undefined): T[] {
  const kept = (images ?? []).filter((img) => !isJunkCatalogImage(img.url));
  return [...kept.filter((i) => !isBrandBanner(i.url)), ...kept.filter((i) => isBrandBanner(i.url))];
}

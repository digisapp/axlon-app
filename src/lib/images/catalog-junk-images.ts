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
 * shared by sibling models that DO show a trailer were left alone.
 *
 * Filtering here rather than deleting rows keeps the call reversible; a
 * scraper-side guard is the durable fix.
 */
const JUNK_HASH_PREFIXES = new Set([
  '26cb2b44', // Marmon / Berkshire Hathaway lockup
  'afc0564b', // JAS-ANZ / TCL certification badge
  '9f2ef939', // GSA Schedule badge
  'cca580db', // factory line icon (every XL Specialized model)
  '5712b202', // rosette check-mark icon
  '1b69e6db', // Kalyn Siebert logo
  '17e9ba15', // book-and-gear icon
  '2438cd59', // gears icon
  'd308f8d9', // NTDA logo
  '76700fcd', // ISO 9001 badge
  '84eee51c', // NATM logo
  '1b50b5e9', // Alabama Trucking Association logo
  '27a429c3', // Globe Trailers logo
  '1451cc61', // Alabama Forestry Association logo
  '906a85b6', // "Granite" truck-series banner
  '5af63cba', // colour bars
  '34243fa2', // Loadstar Trailers logo
  'c4100e26', // Cavanagh Construction logo
  'f48a5fe3', // Hoffmann Family of Companies logo
  'dca4b394', // stock scenery
  '96fbad3d', // "Keystone" banner
  'd662ce74', // "Pinnacle" banner
  '2cfb7c00', // "Pioneer" banner
  '7f5461d0', // stock bridge photo
  '83279058', // loading dock photo
  '757e9cba', // quarry scenery
  '913585d5', // Yantha logo
  'b51d8347', // "Terrapro" banner
  '832e78f2', // Sierra Construction logo
  '34d612da', // "MD Series" banner
  'b9011e71', // "Anthem" banner
  '4de253cc', // Michael Bros. Excavating logo
  '701ba4a6', // customer logo
  'ee5dbf08', // Twitter icon
  '6f68baf8', // social-media post screenshot
  '33dec6da', // Mulltech Excavating logo
  '38aa8908', // "Extreme" logo
  '722c8f0d', // dealer-locator map
  '8e63cc68', // EV charging stock photo
  'c2786811', // "MD Electric" banner
  '16382e60', // "Granite" banner
  'e32b6390', // "LR Electric" banner
  '99e24e6a', // Babb's Sand & Gravel logo
  '44f70d77', // Trans Power logo
  'a7bab700', // colour bars
  '9170b43d', // "LR" banner
  '948de5a2', // truck-cab lifestyle photo
  '055a8726', // key-fob lifestyle photo
  '9a6305d2', // truck-interior lifestyle photo
]);

const HASHED_NAME = /-([0-9a-f]{8})\.[a-z0-9]+$/i;

export function isJunkCatalogImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const match = HASHED_NAME.exec(url.split('?')[0]);
  return match !== null && JUNK_HASH_PREFIXES.has(match[1].toLowerCase());
}

/** Drop non-product images from a catalog product's image list. */
export function withoutJunkImages<T extends { url: string }>(images: T[] | null | undefined): T[] {
  return (images ?? []).filter((img) => !isJunkCatalogImage(img.url));
}

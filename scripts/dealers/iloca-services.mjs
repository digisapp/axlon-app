// @ts-nocheck
/**
 * ILoca Services (semitrailers.net) — inventory adapter.
 *
 * WooCommerce. The public Store API (/wp-json/wc/store/v1/products, the
 * same endpoint WooCommerce's own product blocks call; allowed by robots)
 * returns the "Trailers" category as JSON with attributes, photos and
 * description, so no HTML scraping or browser is needed. robots.txt sets
 * Crawl-delay: 10, which the polite client honors.
 *
 * (scripts/scrape-iloca-semitrailers.mjs drives a stealth browser; this
 * adapter replaces that approach with plain, identified requests.)
 *
 * Skipped: "AVAILABLE TO ORDER" units, units whose stock number reads
 * "pending", out-of-stock products, dollies / axle flips / shipping
 * containers (accessories, not trailers), and products without photos.
 * ILoca shows no prices online ("contact us for pricing") → price null.
 */

import {
  politeClient,
  decode,
  textOf,
  parsePrice,
  parseYear,
  parseCondition,
  cleanVin,
  titleCaseShouting,
  parseCityState,
  guessMake,
  canonicalMake,
} from './_lib.mjs';

const BASE_URL = 'https://semitrailers.net';
const PER_PAGE = 100;
const productsUrl = (page) => `${BASE_URL}/wp-json/wc/store/v1/products?category=trailers&per_page=${PER_PAGE}&page=${page}`;

const ACCESSORY_RE = /\b(dolly|dollies|axle flip|flip axle|\d(?:st|nd|rd|th) axle flip|container(?!\s+chassis))\b/i;
const ACCESSORY_CATEGORIES = new Set(['truck-trailer-components-other', 'intermodal-shipping-container-trailers']);

/** Product attributes as { name: 'a|b' } with trimmed names ("Condition " → "Condition"). */
export function attributesOf(product) {
  const out = {};
  for (const a of product.attributes || []) {
    const name = String(a.name || '').trim();
    if (name) out[name] = (a.terms || []).map((t) => decode(t.name).trim()).filter(Boolean).join('|');
  }
  return out;
}

export function isListableProduct(product) {
  const at = attributesOf(product);
  if (/available to order|sold|pending/i.test(at['For Sale'] || '')) return false;
  if (/^\s*pending\b|\bsold\b/i.test(at['Stock Number'] || at['Stock'] || '')) return false;
  if (product.is_in_stock === false) return false;
  const name = decode(product.name || '');
  if (ACCESSORY_RE.test(name)) return false;
  if ((product.categories || []).some((c) => ACCESSORY_CATEGORIES.has(c.slug))) return false;
  return (product.images || []).some((i) => i?.src);
}

/** "N110001864" ok; "5A3304 PAVER" → "5A3304"; "LOWBOY 55SA" / "TANDEM DOLLY" → null. */
export function stockNumberOf(value) {
  const first = String(value ?? '').trim().split(/\s+/)[0] || '';
  return /\d/.test(first) && first.length >= 5 && !/^pending$/i.test(first) ? first : null;
}

export function toRawListing(product, dealer) {
  const at = attributesOf(product);
  const rawTitle = decode(product.name || '').replace(/\s+/g, ' ').trim();
  const title = titleCaseShouting(rawTitle);
  const locations = (at.Location || '').split('|').filter(Boolean);
  const loc = locations.length === 1 ? parseCityState(locations[0]) : null;
  const make = canonicalMake(at.Manufacturer) || guessMake(rawTitle);

  const specs = {};
  const skip = new Set(['Year', 'Condition', 'Manufacturer', 'For Sale', 'Stock Number', 'Stock', 'Location']);
  for (const [k, v] of Object.entries(at)) {
    if (skip.has(k) || !v) continue;
    const label = k === 'Length (in feet)' ? 'Length' : k === 'Category' ? 'Listing Category' : k;
    const unit = k === 'Length (in feet)' ? ' ft' : k === 'Width' ? ' in' : '';
    specs[label] = unit && /^\d+$/.test(v) ? `${v}${unit}` : titleCaseShouting(v).replace(/\b(\d+)FT\b/g, '$1 ft');
  }
  const types = (product.categories || []).map((c) => decode(c.name)).filter((n) => n !== 'Trailers');
  if (types.length) specs['Trailer Type'] = [...new Set(types)].join(', ');
  if (locations.length > 1) specs['Available At'] = locations.join('; ');

  const minor = Number(product.prices?.currency_minor_unit ?? 2);
  const price = parsePrice(Number(product.prices?.price || 0) / 10 ** minor);
  const vin = cleanVin(product.sku);

  return {
    title,
    year: parseYear(at.Year) || parseYear(rawTitle),
    make,
    model: titleCaseShouting(at.Model || '') || null,
    condition: parseCondition(at.Condition) || parseCondition(rawTitle),
    price,
    price_type: price ? 'fixed' : 'call_for_price',
    stock_number: stockNumberOf(at['Stock Number'] || at.Stock),
    vin,
    description: textOf(product.description || product.short_description || ''),
    specs,
    images: [...new Set(product.images.map((i) => i?.src).filter(Boolean))],
    source_url: product.permalink,
    // WooCommerce's product id is permanent; ILoca reuses stock numbers across listings.
    source_listing_id: String(product.id),
    city: loc?.city || dealer.city || null,
    state: loc?.state || dealer.state || null,
  };
}

/** Every listable trailer ILoca has on semitrailers.net. */
export async function fetchListings(dealer, { log = console.log } = {}) {
  const client = politeClient(BASE_URL, { log });
  const products = [];
  for (let page = 1; page <= 20; page++) {
    const batch = await client.get(productsUrl(page), { as: 'json' });
    if (!Array.isArray(batch)) throw new Error('ILoca: Store API did not return a product array');
    products.push(...batch);
    if (batch.length < PER_PAGE) break;
  }
  const listable = products.filter(isListableProduct);
  log(`   ${products.length} products in Trailers, ${listable.length} for-sale trailers with photos`);
  return listable.map((p) => toRawListing(p, dealer));
}

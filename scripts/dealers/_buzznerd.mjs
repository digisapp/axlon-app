// @ts-nocheck
/**
 * Shared reader for dealer sites on the buzznerd WordPress/WooCommerce
 * platform (ballardtrucks.com, nwtruckandtrailer.com, …).
 *
 * These sites ask crawlers (robots.txt, "Algolia protection") not to hit
 * the query-string URLs that trigger their paid Algolia search. So this
 * reader works from server-rendered pages first:
 *
 *   1. The inventory page (cached HTML) renders the first 30 units as cards
 *      (product id, stock #, permalink, price) plus facet counts.
 *   2. If the condition facet says there are more units than cards, the
 *      facet's own path URLs (/condition/new?product-type=trailer — not
 *      disallowed) each render their own first 30.
 *   3. Only if a facet bucket still exceeds one page does it fall back to
 *      the exact Algolia query the page itself runs (public search-only key
 *      and filter published in `bznrd_woo_algolia_inventory_search`), one
 *      call with 100 hits per page, and it says so in the log.
 *
 * Each unit's product page then supplies the JSON-LD Product (stock #,
 * category, photos, offer price/availability, every pa_* attribute), the
 * description and the full photo gallery. The page filter is
 * product_type 'trailer', which leaves out 'sr_trailer' showroom models.
 */

import { politeClient, textOf, decode, parsePrice, parseYear, parseCondition, cleanVin, titleCaseShouting, canonicalMake } from './_lib.mjs';

const ALGOLIA_HITS_PER_PAGE = 100;

// ── inventory pages ──────────────────────────────────────────────────────────

/** Server-rendered unit cards: { id, sku, url, title, price, condition }. */
export function parseInventoryCards(html) {
  const cards = [];
  for (const chunk of html.split(/<li class="ais-InfiniteHits-item">/).slice(1)) {
    const link = chunk.match(/<h2 class="title"><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const id = chunk.match(/data-product_id='(\d+)'/)?.[1] || chunk.match(/data-product_id="(\d+)"/)?.[1];
    if (!link || !id) continue;
    cards.push({
      id,
      sku: decode(chunk.match(/data-product_sku='([^']*)'/)?.[1] || '').trim() || null,
      url: decode(link[1]),
      title: textOf(link[2]),
      price: parsePrice(textOf(chunk.match(/<div class="price">([\s\S]*?)<\/div>/)?.[1] || '')),
      condition: textOf(chunk.match(/<span class="condition">([^<]*)<\/span>/)?.[1] || ''),
    });
  }
  return cards;
}

/** Condition facet buckets from the inventory page: [{ label, count, url }]. */
export function parseConditionFacet(html) {
  const block = html.match(/<div id="condition">([\s\S]*?)<\/ul>/)?.[1] || '';
  return [...block.matchAll(/<a href="([^"]+)">[\s\S]*?labelText">([^<]*)<[\s\S]*?RefinementList-count">\((\d+)\)/g)].map((m) => ({
    url: decode(m[1]),
    label: textOf(m[2]),
    count: Number(m[3]),
  }));
}

/** App id, search-only key, index and base filter the inventory page publishes; null if absent. */
export function parseSearchConfig(html) {
  const m = html.match(/var bznrd_woo_algolia_inventory_search = (\{[\s\S]*?\});\s*\n/);
  if (!m) return null;
  const cfg = JSON.parse(m[1]);
  const { app_id: appId, search_only_api_key: apiKey, index_name: indexName, algoliaFilterQuery: filters } = cfg;
  if (!appId || !apiKey || !indexName || !filters) return null;
  return { appId, apiKey, indexName, filters, productType: cfg.selectedProductType || null };
}

export function algoliaQueryUrl(cfg, page = 0) {
  const qs = new URLSearchParams({ query: '', filters: cfg.filters, hitsPerPage: String(ALGOLIA_HITS_PER_PAGE), page: String(page) });
  return `https://${cfg.appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(cfg.indexName)}?${qs}`;
}

/** An Algolia hit as an inventory card (skipping showroom models and photo-less units). */
export function cardFromHit(hit) {
  if (hit.product_type === 'sr_trailer' || hit.post_status !== 'publish' || Number(hit.countImages) === 0) return null;
  return {
    id: String(hit.post_id),
    sku: hit.sku ? String(hit.sku) : null,
    url: hit.permalink,
    title: decode(hit.post_title || ''),
    price: parsePrice(hit.price),
    condition: [].concat(hit.taxonomies?.pa_condition || [])[0] || '',
  };
}

// ── product pages ────────────────────────────────────────────────────────────

function productJsonLd(html) {
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      continue;
    }
    const nodes = Array.isArray(json) ? json : json['@graph'] || [json];
    const product = nodes.find((n) => [].concat(n?.['@type'] || []).includes('Product'));
    if (product) return product;
  }
  return null;
}

/** Everything a product page says about the unit. */
export function parseDetail(html) {
  const product = productJsonLd(html) || {};
  const attributes = {};
  for (const p of product.additionalProperty || []) {
    const name = String(p?.name || '').replace(/^pa_/, '');
    const value = decode(String(p?.value ?? '')).trim();
    if (name && value) attributes[name] = value;
  }
  // Attribute rows rendered on the page, for anything the JSON-LD lacks.
  for (const [, key, val] of html.matchAll(/woocommerce-product-attributes-item--attribute_pa_([a-z0-9_-]+)[^"]*">\s*<label>[^<]*<\/label>\s*<span>([\s\S]*?)<\/span>/g)) {
    if (!attributes[key]) attributes[key] = textOf(val);
  }

  const gallery = [...html.matchAll(/woocommerce-product-gallery__image"[^>]*>\s*<a href="([^"]+)"/g)].map((m) => decode(m[1]));
  const ldImages = [].concat(product.image || []).map((i) => (typeof i === 'string' ? i : i?.url)).filter(Boolean);
  const wrapper = html.match(/<div id="product-\d+" class="([^"]*)"/)?.[1] || '';
  const availability = String(product.offers?.availability || '');

  const descHtml = html.match(/id="collapse-description"[^>]*>\s*<div class="panel-body">([\s\S]*?)<\/div>\s*<\/div>/)?.[1] || '';
  const visiblePrice = textOf(html.match(/<p class="price">([\s\S]*?)<\/p>/)?.[1] || '');

  return {
    sku: product.sku ? String(product.sku) : null,
    category: decode(product.category || ''),
    attributes,
    images: [...new Set(gallery.length ? gallery : ldImages)],
    price: parsePrice(product.offers?.price) || parsePrice(visiblePrice),
    outOfStock: (/\boutofstock\b/.test(wrapper) && !/\binstock\b/.test(wrapper)) || /OutOfStock|SoldOut/i.test(availability),
    description: textOf(descHtml) || decode(product.description || ''),
  };
}

// ── mapping ──────────────────────────────────────────────────────────────────

const pick = (at, ...keys) => keys.map((k) => at[k]).find((v) => v != null && v !== '') ?? null;

const CORE_KEYS = new Set([
  'truck_location', 'location', 'trailer_location', 'truck_year', 'bznrd-year', 'year', 'trailer_year',
  'truck_manufacturer', 'manufacturer', 'trailer_manufacturer', 'truck_model', 'model', 'trailer_model',
  'truck_vinserialnumber', 'trailer_vin', 'vin', 'condition', 'badge', 'for-sale', 'for-rent',
]);

const specLabel = (key) => {
  const k = key.replace(/^(truck|trailer)[_-]/, '').replace(/^trailer-/, '');
  if (k === 'type') return 'Trailer Type';
  return k.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const NOT_FOR_SALE_RE = /\b(sold|pending|on hold|deposit)\b/i;

export function isForSale(detail) {
  if (detail.outOfStock) return false;
  const at = detail.attributes || {};
  return !NOT_FOR_SALE_RE.test([at.badge, at['for-sale'], at.status].filter(Boolean).join(' '));
}

/**
 * @param locations the site's yard names (as stored in pa_location / pa_truck_location,
 *   lower-cased) → { city, state }; unknown yards fall back to the dealer config.
 */
export function toRawListing(card, detail, dealer, { locations = {} } = {}) {
  const at = detail.attributes || {};
  const yardName = pick(at, 'truck_location', 'location', 'trailer_location');
  const yard = yardName ? locations[yardName.toLowerCase()] : null;

  const specs = {};
  for (const [k, v] of Object.entries(at)) {
    if (CORE_KEYS.has(k)) continue;
    const name = specLabel(k);
    specs[name] = /length$/i.test(name) && /^\d+$/.test(v) ? `${v} ft` : /width$/i.test(name) && /^\d+$/.test(v) ? `${v} in` : titleCaseShouting(v);
  }
  if (!specs['Trailer Type'] && detail.category) specs['Trailer Type'] = detail.category.replace(/^(Semi-)?Trailers - /, '');
  if (yardName) specs['Yard'] = yard ? `${yard.city}, ${yard.state}` : titleCaseShouting(yardName);

  // The unit's own page is authoritative: the cached inventory card can carry a price the
  // dealer has since taken down (seen on Ballard), so a card price alone is not used.
  const price = detail.price || null;
  return {
    title: titleCaseShouting(card.title),
    year: parseYear(pick(at, 'truck_year', 'bznrd-year', 'year', 'trailer_year')) || parseYear(card.title),
    make: canonicalMake(pick(at, 'truck_manufacturer', 'manufacturer', 'trailer_manufacturer')),
    model: titleCaseShouting(pick(at, 'truck_model', 'model', 'trailer_model') || '') || null,
    condition: parseCondition(pick(at, 'condition')) || parseCondition(card.condition) || parseCondition(card.title),
    price,
    price_type: price ? 'fixed' : 'call_for_price',
    stock_number: detail.sku || card.sku || null,
    vin: cleanVin(pick(at, 'truck_vinserialnumber', 'trailer_vin', 'vin')),
    description: detail.description,
    specs,
    images: detail.images,
    source_url: card.url,
    // WordPress post id of the product record behind the unit page.
    source_listing_id: String(card.id),
    city: yard?.city || dealer.city || null,
    state: yard?.state || dealer.state || null,
  };
}

// ── orchestration ────────────────────────────────────────────────────────────

/** Fetch every for-sale trailer (with photos) from a buzznerd dealer site. */
export async function fetchBuzznerdListings({ baseUrl, inventoryPath, dealer, locations, log = console.log }) {
  const client = politeClient(baseUrl, { log });
  const html = await client.get(new URL(inventoryPath, baseUrl).href);
  const byId = new Map(parseInventoryCards(html).map((c) => [c.id, c]));
  const facet = parseConditionFacet(html);
  const total = facet.reduce((n, b) => n + b.count, 0);

  if (total > byId.size) {
    for (const bucket of facet) {
      for (const c of parseInventoryCards(await client.get(bucket.url))) byId.set(c.id, c);
    }
  }
  if (total > byId.size) {
    const cfg = parseSearchConfig(html);
    if (!cfg) throw new Error(`buzznerd: ${total} units but only ${byId.size} server-rendered and no search config`);
    log(`   ${total - byId.size} units beyond the server-rendered pages — running the page's own search query`);
    for (let page = 0; page < 20; page++) {
      const res = await client.get(algoliaQueryUrl(cfg, page), {
        as: 'json',
        headers: { 'X-Algolia-Application-Id': cfg.appId, 'X-Algolia-API-Key': cfg.apiKey },
      });
      for (const hit of res.hits || []) {
        const c = cardFromHit(hit);
        if (c && !byId.has(c.id)) byId.set(c.id, c);
      }
      if (page + 1 >= (res.nbPages || 1)) break;
    }
  }
  log(`   ${byId.size} units listed (site count ${total || 'n/a'})`);

  const listings = [];
  let notForSale = 0;
  let noPhotos = 0;
  for (const card of byId.values()) {
    let detail;
    try {
      detail = parseDetail(await client.get(card.url));
    } catch (err) {
      if (err.blocked) throw err;
      log(`   ⚠ product page failed for ${card.url}: ${err.message}`);
      continue;
    }
    if (!isForSale(detail)) notForSale++;
    else if (!detail.images.length) noPhotos++;
    else listings.push(toRawListing(card, detail, dealer, { locations }));
  }
  if (notForSale || noPhotos) log(`   skipped ${notForSale} not for sale, ${noPhotos} without photos`);
  return listings;
}

// @ts-nocheck
/**
 * Area Trailer Sales & Rentals (areatrailersalesandrentals.com) — inventory adapter.
 *
 * Squarespace commerce. robots.txt disallows `?format=json` (and /api/,
 * /search) for every agent, so this reads the plain HTML: the for-sale
 * collection page lists every product (no pagination), and each product
 * page carries the price, description, gallery and the variant JSON
 * (sku, price, salePrice, stock) in Static.SQUARESPACE_CONTEXT.
 *
 * Skipped: sold-out products (tracked stock at 0, or a "sold out"/"sold"/
 * "pending" mark), build-to-order models (untracked "unlimited" stock AND
 * no model year in the title — e.g. "Midland Sand Hopper - Wet Sand"), and
 * products without photos. A $0.00 price means "call" → null. Squarespace
 * sale prices are the current asking price.
 *
 * Units don't carry a yard; a title naming one of ATSR's yards
 * ("… Amarillo, TX") wins, otherwise the dealer config's city/state.
 */

import {
  politeClient,
  decode,
  textOf,
  parseYear,
  parseCondition,
  titleCaseShouting,
  guessMake,
} from './_lib.mjs';

const BASE_URL = 'https://www.areatrailersalesandrentals.com';
const INVENTORY_URL = `${BASE_URL}/trailers-for-sale-new-used`;

const YARDS = [
  ['Amarillo', 'TX'],
  ['Lubbock', 'TX'],
  ['Odessa', 'TX'],
  ['Boise', 'ID'],
  ['Idaho Falls', 'ID'],
  ['Spokane', 'WA'],
  ['Salt Lake City', 'UT'],
];

const NOT_FOR_SALE_RE = /\b(sold out|sold|pending|on hold|deposit taken)\b/i;

/** Product cards on the collection page: id, url, title, tag classes, marks. */
export function parseInventory(html) {
  const parts = html.split(/<div\s+class="(product-list-item(?:\s[^"]*)?)"\s+data-product-id="([^"]+)"/);
  const items = [];
  for (let i = 1; i + 1 < parts.length; i += 3) {
    const cls = parts[i];
    const id = parts[i + 1];
    const body = (parts[i + 2] || '').split('</section>')[0];
    const href = body.match(/class="product-list-item-link"\s+href="?([^"\s>]+)/)?.[1];
    if (!href) continue;
    const title = textOf(body.match(/class="product-list-item-title"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '');
    const status = textOf(body.match(/class="product-list-item-status"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '');
    const marks = [...body.matchAll(/class="product-mark ([^"]*)"/g)].map((m) => m[1].trim());
    const tags = cls.split(/\s+/).filter((c) => c.startsWith('tag-')).map((c) => c.slice(4));
    items.push({ id, url: new URL(href, BASE_URL).href, title, status, marks, tags });
  }
  if (!items.length) throw new Error('Area Trailer: no product cards found on the collection page');
  return items;
}

export function isForSaleCard(card) {
  if (card.marks.some((m) => /sold|pending/i.test(m))) return false;
  return !NOT_FOR_SALE_RE.test(card.status) && !/^\s*(sold|pending)\b/i.test(card.title);
}

/** The `"product":{...}` object from Static.SQUARESPACE_CONTEXT, or null. */
function productContext(html) {
  const start = html.indexOf('"product":{"variantAttributeNames"');
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  const from = html.indexOf('{', start);
  for (let i = from; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) {
      try {
        return JSON.parse(html.slice(from, i + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** "CAPACITY: 80,000 GVWR" style lines → specs. */
export function specsFromLines(text) {
  const specs = {};
  for (const line of String(text).split('\n')) {
    const m = line.match(/^\s*•?\s*([A-Za-z][A-Za-z0-9 /&().'"-]{1,40}?)\s*:\s*(.{1,200})$/);
    if (!m) continue;
    const label = titleCaseShouting(m[1]).replace(/\s+/g, ' ').trim();
    const value = m[2].trim();
    if (label && value && !specs[label]) specs[label] = value;
  }
  return specs;
}

/** Price, stock, SKU, description, specs and photos from a product page. */
export function parseDetail(html) {
  const product = productContext(html);
  const variant = product?.variants?.[0] || null;

  const cents = (p) => (p && Number(p.value) > 0 ? Number(p.value) : 0);
  const priceCents = variant ? (variant.onSale && cents(variant.salePrice)) || cents(variant.price) : 0;
  let price = priceCents ? Math.round(priceCents / 100) : null;
  if (!variant) {
    // Layout fallback: the visible price block ("$54,900.00"; "$0.00" means call).
    const block = html.match(/class="product-price-value">([\s\S]*?)<\/div>/)?.[1] || '';
    const sale = block.match(/class="sale-price">\s*\$([\d,.]+)/)?.[1];
    const plain = block.match(/\$([\d,.]+)/)?.[1];
    const n = Number(String(sale || plain || '').replace(/,/g, ''));
    price = n > 0 ? Math.round(n) : null;
  }

  const stock = variant?.stock || null;
  const soldOut =
    (stock && stock.unlimited === false && Number(stock.quantity) <= 0) ||
    /class="product-mark sold-out"|class="[^"]*\bsold-out\b[^"]*"\s*>\s*Sold Out/i.test(html);

  const title = textOf(html.match(/<h1 class="product-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '');
  const descHtml = html.match(/<div class="product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
  const description =
    textOf(descHtml) || decode(html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1] || '');

  const gallery = html.match(/class="product-gallery-slides"[\s\S]*?(?=class="product-gallery-thumbnails"|class="product-meta")/)?.[0] || '';
  const images = [
    ...new Set(
      [...gallery.matchAll(/data-(?:src|image)="(https:\/\/images\.squarespace-cdn\.com\/[^"?]+)/g)].map((m) => m[1])
    ),
  ];

  return {
    title,
    price,
    sku: variant?.sku || null,
    stock,
    soldOut: Boolean(soldOut),
    description,
    specs: specsFromLines(textOf(descHtml)),
    images,
  };
}

/**
 * Build-to-order model pages ("Midland Sand Hopper - Wet Sand"): stock is
 * untracked ("unlimited") and nothing ties the page to one physical unit —
 * no model year in the title, no dealer SKU, and no year or stock-number
 * token (SA8244, D42986, 206685) in the URL slug.
 */
export function isCatalogModel(card, detail) {
  if (detail.stock?.unlimited !== true) return false;
  if (parseYear(detail.title || card.title)) return false;
  if (dealerSku(detail.sku)) return false;
  const slug = card.url.split('/').pop() || '';
  if (/^(19|20)\d\d-/.test(slug) || /(?:^|-)(sa\d{4}|d\d{5}|\d{6})(?:-|$)/i.test(slug)) return false;
  return true;
}

export function yardFromTitle(title) {
  for (const [city, state] of YARDS) {
    if (new RegExp(`\\b${city},?\\s+${state}\\b`, 'i').test(title)) return { city, state };
  }
  return null;
}

/** A dealer-entered stock number; Squarespace's auto "SQ1234567" SKUs and free text don't count. */
export function dealerSku(sku) {
  const s = String(sku ?? '').trim();
  return s && !/^SQ\d+$/i.test(s) && !/\s/.test(s) && s.length <= 20 ? s : null;
}

export function toRawListing(card, detail, dealer) {
  const rawTitle = detail.title || card.title;
  const yard = yardFromTitle(rawTitle);
  let title = titleCaseShouting(rawTitle)
    .replace(/\s*\|\s*/g, ' – ')
    .replace(/^for sale:\s*/i, '')
    .replace(/\s+for sale\s*$/i, '');
  if (yard) title = title.replace(new RegExp(`\\s*[-–,]?\\s*${yard.city},?\\s+${yard.state}\\s*$`, 'i'), '');
  title = title.trim();
  const condition = parseCondition(card.tags.includes('used') ? 'used' : card.tags.includes('new') ? 'new' : rawTitle);
  const specs = { ...detail.specs };
  if (card.tags.length) specs['Categories'] = card.tags.filter((t) => t !== 'new' && t !== 'used').join(', ');
  if (!specs['Categories']) delete specs['Categories'];

  return {
    title,
    year: parseYear(rawTitle),
    make: guessMake(rawTitle.replace(/\bBrant\b/i, 'Brandt')),
    model: null,
    condition,
    price: detail.price,
    price_type: detail.price ? 'fixed' : 'call_for_price',
    stock_number: dealerSku(detail.sku),
    vin: null,
    description: detail.description,
    specs,
    images: detail.images,
    source_url: card.url,
    // Squarespace's product id is permanent for the item; SKUs can be edited.
    source_listing_id: card.id,
    city: yard?.city || dealer.city || null,
    state: yard?.state || dealer.state || null,
  };
}

/** Every for-sale unit with photos on areatrailersalesandrentals.com. */
export async function fetchListings(dealer, { log = console.log } = {}) {
  const client = politeClient(BASE_URL, { log });
  const cards = parseInventory(await client.get(INVENTORY_URL));
  const forSale = cards.filter(isForSaleCard);
  log(`   ${cards.length} products on the page, ${forSale.length} not marked sold/pending`);

  const listings = [];
  let catalog = 0;
  let sold = 0;
  let noPhotos = 0;
  for (const card of forSale) {
    let detail;
    try {
      detail = parseDetail(await client.get(card.url));
    } catch (err) {
      if (err.blocked) throw err;
      log(`   ⚠ product page failed for ${card.url}: ${err.message}`);
      continue;
    }
    if (detail.soldOut) sold++;
    else if (isCatalogModel(card, detail)) catalog++;
    else if (!detail.images.length) noPhotos++;
    else listings.push(toRawListing(card, detail, dealer));
  }
  log(`   skipped ${sold} sold out, ${catalog} build-to-order models, ${noPhotos} without photos`);
  return listings;
}

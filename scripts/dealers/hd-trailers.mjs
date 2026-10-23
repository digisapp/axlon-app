// @ts-nocheck
/**
 * HD Trailers (hdtrailers.com) — inventory adapter.
 *
 * The inventory page embeds every unit as one JSON array in a <script>
 * (HubSpot CMS), so a single plain HTTP fetch lists the whole yard; detail
 * pages add photos, the spec table and the description. No browser needed.
 *
 * Only units marked "For Sale" are returned — On Hold / Pending / Sold are
 * spoken for — and only trailers: flip axles, jeep dollies, spreader bars
 * and deck inserts are accessories, not units a buyer searches for. Units
 * without photos yet (mostly still in production) wait until HD posts them;
 * the next run picks them up. Prices are shown only where the dealer shows
 * them (show_price = 1).
 */

const BASE_URL = 'https://hdtrailers.com';
const INVENTORY_URL = `${BASE_URL}/inventory`;
const USER_AGENT = 'AxleyardBot/1.0 (+https://axleyard.com; inventory@axleyard.com)';
const DETAIL_DELAY_MS = 1500;

const ACCESSORY_TYPES = new Set([
  'flip axle', 'jeep dolly', 'spreader bar', 'deck insert', 'deck extension', 'flip neck extension',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

const textOf = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

async function getHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return res.text();
}

/** The embedded inventory array, or throws if the page layout changed. */
export function parseInventory(html) {
  for (const [, script] of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!script.includes('"hs_path"')) continue;
    const json = script.slice(script.indexOf('['), script.lastIndexOf(']') + 1)
      // HubL templates leave a trailing comma after the last element.
      .replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(json);
  }
  throw new Error('HD Trailers: inventory JSON not found on the page');
}

export function isListableUnit(unit) {
  if (unit?.status !== 'For Sale' || !unit.hs_path || unit.has_image !== 1) return false;
  const types = String(unit.trailer_type || '').toLowerCase().split(';').map((t) => t.trim());
  return !types.every((t) => ACCESSORY_TYPES.has(t));
}

/** Photos, spec rows and description from a unit's detail page. */
export function parseDetail(html) {
  const images = [
    ...new Set(
      [...html.matchAll(/https:\/\/hdtrailers\.com\/hs-fs\/hubfs\/crm-properties-file-values\/[^"'\s)?]+\.(?:jpe?g|png|webp)/gi)].map(
        (m) => m[0]
      )
    ),
  ];

  const specs = {};
  const table = html.match(/class="[^"]*vdp-specs-table[^"]*"[\s\S]*?<\/table>/i)?.[0] || '';
  for (const [, row] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) => textOf(m[1]));
    if (cells.length >= 2 && cells[0] && cells[1] && !/^(other|n\/a|-)$/i.test(cells[1])) {
      specs[cells[0]] = cells[1];
    }
  }

  const description =
    textOf(html.match(/DESCRIPTION\s*<\/[^>]+>\s*([\s\S]*?)<\/(?:p|div)>/i)?.[1] || '') ||
    decode(html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1] || '');

  return { images, specs, description };
}

export function toRawListing(unit, detail, dealer) {
  const price = unit.show_price === 1 && unit.list_price > 0 ? unit.list_price : null;
  const production = /production/i.test(unit.inventory_source || '');
  const details = [
    unit.trailer_type && `Type: ${unit.trailer_type}`,
    unit.tonnage && `Capacity: ${unit.tonnage}`,
    unit.neck_type && `Neck: ${unit.neck_type}`,
    unit.use_case && `Use: ${unit.use_case}`,
  ].filter(Boolean).join('. ');
  const description = [
    detail.description,
    details && `${details}.`,
    production && 'In production — ask the dealer for the completion date.',
  ].filter(Boolean).join(' ');

  return {
    title: unit.model,
    year: unit.year || null,
    make: unit.manufacturer || null,
    condition: /used/i.test(unit.condition || '') ? 'used' : /new/i.test(unit.condition || '') ? 'new' : null,
    price,
    price_type: price ? 'fixed' : 'call_for_price',
    stock_number: unit.stock_number || null,
    vin: unit.vin || null,
    description,
    specs: detail.specs,
    images: detail.images,
    source_url: `${INVENTORY_URL}/${unit.hs_path}`,
    // HubSpot's record id is stable for the life of the unit.
    source_listing_id: String(unit.hs_id || unit.inventory_id || unit.stock_number),
    city: dealer.city || null,
    state: dealer.state || null,
  };
}

/** Every listable unit on hdtrailers.com as raw listings for processListing. */
export async function fetchListings(dealer, { log = console.log } = {}) {
  const units = parseInventory(await getHtml(INVENTORY_URL));
  const listable = units.filter(isListableUnit);
  log(`   ${units.length} units on the site, ${listable.length} trailers for sale with photos`);

  const listings = [];
  for (const unit of listable) {
    let detail = { images: [], specs: {}, description: '' };
    try {
      detail = parseDetail(await getHtml(`${INVENTORY_URL}/${unit.hs_path}`));
    } catch (err) {
      log(`   ⚠ detail page failed for ${unit.hs_path}: ${err.message}`);
    }
    if (detail.images.length > 0) listings.push(toRawListing(unit, detail, dealer));
    await sleep(DETAIL_DELAY_MS);
  }
  return listings;
}

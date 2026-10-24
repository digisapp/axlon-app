// @ts-nocheck
/**
 * Cozad Trailers Product Catalog Scraper
 *
 * Scrapes cozadtrailers.com (Stockton, CA) for its heavy-haul detachable
 * gooseneck lowboys, from 35-ton two-axle trailers to 110-ton multi-axle
 * conversion trailers, and upserts them into the manufacturer_products tables.
 *
 * The /en/trailers/ index links every model page. Links mix .aspx and
 * folder-style URLs and are followed exactly as linked. Most model pages
 * carry a FEATURES table (row label | Standard | Optional); a few are photo
 * pages with only a title and pictures, which still become products.
 *
 * Usage:
 *   node scripts/scrape-mfr-cozad.mjs            # live (needs service-role key)
 *   node scripts/scrape-mfr-cozad.mjs --dry-run  # print what would be upserted
 */

import {
  getSupabaseClient,
  ensureManufacturer,
  upsertProduct,
  upsertProductImages,
  upsertProductSpecs,
  updateProductCount,
  cleanText,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';
import { isLogoUrl } from './lib/catalog-junk.mjs';
import { createPoliteFetcher, textOf, absoluteUrl, parseInches, parseFeet } from './lib/polite-fetch.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MANUFACTURER_SLUG = 'cozad';
const MANUFACTURER_NAME = 'Cozad Trailers';
const BASE_URL = 'https://www.cozadtrailers.com';
const INDEX_URL = `${BASE_URL}/en/trailers/`;
const MAX_IMAGES = 20;
const MANUFACTURER_INFO = {
  name: 'Cozad Trailers',
  canonical_name: 'Cozad',
  website: BASE_URL,
  headquarters: 'Stockton, California',
  country: 'USA',
  short_description:
    'Stockton, California builder of heavy-haul detachable gooseneck lowboy trailers, from 35-ton two-axle models to 110-ton multi-axle conversion trailers.',
  name_variations: ['cozad', 'cozad trailers', 'cozad trailer sales', 'cozad trailer'],
};

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

async function discoverModels(fetcher) {
  const page = await fetcher.html(INDEX_URL);
  if (!page) return null;
  const { $ } = page;
  const models = new Map();
  $('#content a[href], a[href]').each((_, a) => {
    const href = $(a).attr('href') || '';
    // /en/trailers/<tonnage-group>/<model>(.aspx|/)
    if (!/^(https?:\/\/[^/]+)?\/en\/trailers\/[^/]+\/[^/]+/.test(href)) return;
    const url = absoluteUrl(href, INDEX_URL);
    const label = textOf($(a)).replace(/\s*Click Here for More Info\s*$/i, '');
    if (url && !models.has(url)) models.set(url, label);
  });
  return [...models.entries()].map(([url, indexName]) => ({ url, indexName }));
}

// ---------------------------------------------------------------------------
// Model page parsing
// ---------------------------------------------------------------------------

/** Cell text with <br>/<p>/<div> boundaries kept as separate lines. */
function cellLines($, el) {
  const $c = $(el).clone();
  $c.find('br').replaceWith('\n');
  $c.find('p, div, li').each((_, b) => {
    $(b).prepend('\n').append('\n');
  });
  return $c
    .text()
    .replace(/ /g, ' ')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Spec rows from the FEATURES table: leaf rows (no nested tables) whose first
 * cell is a short label and that have a Standard and/or Optional value.
 */
function readSpecRows($) {
  const rows = [];
  $('#content tr').each((_, tr) => {
    if ($(tr).find('table').length) return;
    const cells = $(tr).children('td, th').toArray();
    if (cells.length < 2) return;
    const label = textOf($(cells[0])).replace(/:$/, '');
    if (!label || label.length > 40 || /^(standard|optional|features)$/i.test(label)) return;
    const standard = cellLines($, cells[1]);
    const optional = cells[2] ? cellLines($, cells[2]) : [];
    if (standard.length === 0 && optional.length === 0) return;
    if (/^(standard|optional)$/i.test(standard[0] || '')) return; // header row
    rows.push({ label, standard, optional });
  });
  return rows;
}

function readName($, indexName) {
  const h1 = $('#content h1')
    .toArray()
    .map((h) => textOf($(h)))
    .filter(Boolean)
    .join(' ');
  let name = h1 || textOf($('#content h2, #content h3').first()) || indexName;
  // A shorter page title whose words all appear in the index link
  // ("44 Ton Gen-X II Expando Trailer" vs "... Narrow Neck Expando Trailer").
  const words = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  if (indexName && words(indexName).length > words(name).length) {
    const idx = new Set(words(indexName));
    if (words(name).every((w) => idx.has(w))) name = indexName;
  }
  return cleanText(name.replace(/\b(\d+)-Ton\b/gi, '$1 Ton'));
}

function readImages($, pageUrl) {
  const photos = [];
  const drawings = [];
  $('#content img').each((_, img) => {
    const $img = $(img);
    const src = $img.attr('src') || '';
    const href = $img.closest('a').attr('href') || '';
    const url = absoluteUrl(/\.(jpe?g|png|gif|webp)$/i.test(href) ? href : src, pageUrl);
    if (!url || /spacer\.gif|gsa-approved|animation/i.test(url) || isLogoUrl(url)) return;
    const alt = cleanText($img.attr('alt') || '');
    const isDrawing = /drawing|_dwg|-dwg|dwg\.|specification/i.test(url + ' ' + alt);
    (isDrawing ? drawings : photos).push({ url, alt });
  });
  const seen = new Set();
  return [...photos, ...drawings]
    .filter((i) => {
      const key = decodeURIComponent(i.url).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_IMAGES);
}

// ---------------------------------------------------------------------------
// Page -> product
// ---------------------------------------------------------------------------

function tonnageFromName(name) {
  const range = /(\d+)\s*(?:-|–|\/|to)\s*(\d+)\s*ton/i.exec(name);
  if (range) return { min: +range[1], max: +range[2] };
  const single = /(\d+)\s*ton/i.exec(name);
  return single ? { min: +single[1], max: +single[1] } : { min: null, max: null };
}

function productType(name) {
  if (/steering dolly/i.test(name)) return 'other';
  if (/stretch/i.test(name)) return 'extendable';
  // Fixed-neck tail trailers; the pages carry no neck spec to say otherwise.
  if (/beaver ?tail|hydraulic tail/i.test(name)) return 'lowboy';
  return 'rgn';
}

function gooseneckType(name, neckText) {
  const t = `${name} ${neckText || ''}`;
  if (/hydra[\s-]?neck|hydraulic (neck|detach)/i.test(t)) return 'hydraulic-detachable';
  if (/mech(\.|anical)?\s*detach/i.test(t)) return 'mechanical-detachable';
  if (/detach|removable gooseneck/i.test(t)) return 'detachable';
  return null;
}

function specCategory(label) {
  if (/capacity/i.test(label)) return 'Capacity';
  if (/weight/i.test(label)) return 'Weight';
  if (/axle|suspension|brake|tire|wheel/i.test(label)) return 'Running Gear';
  if (/gooseneck|neck/i.test(label)) return 'Gooseneck';
  if (/jeep|booster|hydraulic|lift/i.test(label)) return 'Hydraulics';
  if (/length|width|height|deck|back-end/i.test(label)) return 'Dimensions';
  if (/light/i.test(label)) return 'Electrical';
  return 'Construction';
}

/** First comma-grouped number of at least 1,000 ("17.5 Wheels Trailer 24,000" → 24000). */
function poundsIn(text) {
  const m = /(\d{1,3}(?:,\d{3})+)/.exec(text || '');
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
}

function buildProduct({ url, indexName }, page) {
  const { $ } = page;
  const name = readName($, indexName);
  const rows = readSpecRows($);
  const row = (re) => rows.find((r) => re.test(r.label));
  const std = (re) => (row(re)?.standard || []).join(' ');

  const specs = [];
  for (const r of rows) {
    const category = specCategory(r.label);
    if (r.standard.length) specs.push({ category, key: r.label, value: r.standard.join('; '), unit: null });
    if (r.optional.length) specs.push({ category: 'Options', key: r.label, value: r.optional.join('; '), unit: null });
  }

  const tons = tonnageFromName(name);
  // "with 2 Axle Booster" counts the booster, not the trailer.
  const axleMatch = /(\d+)[\s-]axle\b(?!\s*booster)/i.exec(name);

  // Deck height: the loaded figure when the page gives one ("27" Empty / 21"
  // Loaded"). Always inches; a stray foot mark ("23'") is a typo for one.
  const heightText = (
    std(/^deck height.*loaded/i) ||
    std(/^deck height/i) ||
    std(/^drop side height/i) ||
    std(/^flat deck height/i)
  ).replace(/['’]/g, '"');
  const loaded = /([\d.\-/ ]+)["”]\s*loaded/i.exec(heightText);
  const deckHeight = parseInches(loaded ? loaded[1] : heightText);

  // Deck length: a "Deck Length" row, else "24'-5" Length STD" in the
  // "Deck / Options" row (not "Decking", which is the floor material).
  const deckText = std(/^deck length/i) || std(/^deck(?!ing)\b/i);
  // A stretch deck states "27'-10" To 47'-10" Length": keep the closed length.
  const FT = String.raw`(\d+\s*['’]\s*(?:-?\s*\d+\s*["”])?)`;
  const lengthMatch =
    new RegExp(FT + String.raw`\s*to\s*\d[^;]*?length`, 'i').exec(deckText) ||
    new RegExp(FT + String.raw`\s*(?:length|std)`, 'i').exec(deckText);
  const deckLength = parseFeet(lengthMatch ? lengthMatch[1] : std(/^deck length/i));

  const images = readImages($, url).map((img) => ({
    url: img.url,
    alt_text: img.alt || `Cozad ${name}`,
    source_url: url,
  }));

  return {
    product: {
      name,
      series: null,
      model_number: null,
      tagline: null,
      description: null,
      short_description: null,
      product_type: productType(name),
      tonnage_min: tons.min,
      tonnage_max: tons.max,
      deck_height_inches: deckHeight && deckHeight < 60 ? deckHeight : null,
      deck_length_feet: deckLength && deckLength >= 10 && deckLength <= 60 ? deckLength : null,
      overall_length_feet: parseFeet(std(/^overall length/i)),
      axle_count: axleMatch ? parseInt(axleMatch[1], 10) : null,
      gooseneck_type: gooseneckType(name, std(/^gooseneck/i)),
      empty_weight_lbs: poundsIn(std(/weight/i)),
      gvwr_lbs: null,
      concentrated_capacity_lbs: null,
      source_url: url,
    },
    specs,
    images,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  printBanner(MANUFACTURER_NAME, BASE_URL);

  const supabase = getSupabaseClient();
  const manufacturerId = await ensureManufacturer(supabase, MANUFACTURER_SLUG, MANUFACTURER_INFO);
  console.log(`Manufacturer ID: ${manufacturerId}\n`);

  const fetcher = createPoliteFetcher({ minDelayMs: 2500 });
  const stats = { scraped: 0, upserted: 0, errors: 0 };

  const models = await discoverModels(fetcher);
  if (!models || models.length === 0) {
    console.error('No model links found on the trailers index (blocked or changed). Nothing scraped.');
    stats.errors++;
    printSummary(MANUFACTURER_NAME, stats);
    process.exitCode = 1;
    return;
  }
  console.log(`Found ${models.length} model pages\n`);

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    console.log(`[${i + 1}/${models.length}] ${model.url}`);
    try {
      const page = await fetcher.html(model.url);
      if (!page) {
        stats.errors++;
        continue;
      }
      const { product, specs, images } = buildProduct(model, page);
      stats.scraped++;
      const productId = await upsertProduct(supabase, manufacturerId, product);
      if (!productId) {
        stats.errors++;
        continue;
      }
      stats.upserted++;
      await upsertProductImages(supabase, productId, images);
      await upsertProductSpecs(supabase, productId, specs);
    } catch (err) {
      console.error(`  [ERROR] ${model.url}: ${err.message}`);
      stats.errors++;
    }
  }

  const count = await updateProductCount(supabase, manufacturerId);
  console.log(`\nUpdated product count: ${count}`);
  printSummary(MANUFACTURER_NAME, stats);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

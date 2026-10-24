// @ts-nocheck
/**
 * Scrape the Brandt heavy-haul trailer catalog
 *
 * Brandt (brandt.ca; Brandt Group of Companies, Regina SK) sells multi-axle
 * heavy-haul transporters, scissorneck trailers and tag trailers. The site is ASP.NET (Kentico) and
 * server-rendered. Models are linked from two list pages:
 *
 *   /Products/Construction/Heavy-Haul-Trailers                 (full line)
 *   /Divisions/Equipment-Solutions/Products/Heavy-Haul-Trailers/Heavy-Haul-Trailers-US
 *                                                              (US line, adds the West Coast models)
 *
 * Model URLs are /…/Heavy-Haul-Trailers/<Category>/<Model>. Categories kept:
 *
 *   On-Highway-Transporters, On-Off-Highway-Transporters, West Coast → rgn
 *   Scissorneck-Trailers-(Fixed-Roll) / (Flip-Roll)                  → rgn
 *   TAG-Pintle-Hitch                                                 → tag-along
 *
 * Skipped: Jeeps and Boosters (add-on axle units, not trailers), and two
 * models filed among the transporters that are not lowboy-family — the T300
 * pole trailer and the P350 picker float.
 *
 * The page <h1> is the generic "Brandt Heavy Haul Trailers"; the model name is
 * the <h2> / <title>. Specs are a small table: Tare, Payload, Dimensions
 * (W x L [x H]), Axle Lines, Application. Pages are ~450 KB.
 *
 * Usage:
 *   node scripts/scrape-mfr-brandt.mjs
 *   node scripts/scrape-mfr-brandt.mjs --dry-run   # no DB writes, no keys needed
 */

import * as cheerio from 'cheerio';
import {
  getSupabaseClient,
  ensureManufacturer,
  upsertProduct,
  upsertProductImages,
  upsertProductSpecs,
  updateProductCount,
  sleep,
  cleanText,
  parseWeight,
  parseTonnage,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'brandt';
const MANUFACTURER_INFO = {
  name: 'Brandt',
  canonical_name: 'Brandt Group of Companies',
  website: 'https://www.brandt.ca',
  headquarters: 'Regina, SK',
  country: 'Canada',
  short_description:
    'The Brandt Group of Companies, headquartered in Regina, Saskatchewan, sells a heavy-haul trailer line of multi-axle transporters, scissorneck trailers and tag trailers.',
  name_variations: ['Brandt', 'Brandt Group of Companies', 'Brandt Trailers', 'Brandt Heavy Haul'],
};
const WEBSITE = MANUFACTURER_INFO.website;
const LIST_PAGES = [
  `${WEBSITE}/Products/Construction/Heavy-Haul-Trailers`,
  `${WEBSITE}/Divisions/Equipment-Solutions/Products/Heavy-Haul-Trailers/Heavy-Haul-Trailers-US`,
];
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Category path segment → how to file it. Anything not listed is skipped. */
const CATEGORIES = {
  'On-Highway-Transporters': { type: 'rgn', series: 'On-Highway Transporters', suffix: 'Transporter' },
  'On-Off-Highway-Transporters': { type: 'rgn', series: 'On/Off-Highway Transporters', suffix: 'Transporter' },
  'West-Coast': { type: 'rgn', series: 'West Coast Transporters', suffix: 'Transporter' },
  'Scissorneck-Trailers-(Fixed-Roll)': { type: 'rgn', series: 'Scissorneck Trailers', scissor: 'Fixed Roll' },
  'Scissorneck-Trailers-(Flip-Roll)': { type: 'rgn', series: 'Scissorneck Trailers', scissor: 'Flip Roll' },
  'TAG-Pintle-Hitch': { type: 'tag-along', series: 'Tag Trailers', suffix: 'Tag Trailer' },
};
const SKIPPED_CATEGORIES = new Set(['Jeeps', 'Boosters']);

/** Delay between page loads (ms) */
const PAGE_DELAY_MIN = 2000;
const PAGE_DELAY_MAX = 3000;
const MAX_RETRIES = 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomDelay() {
  return PAGE_DELAY_MIN + Math.random() * (PAGE_DELAY_MAX - PAGE_DELAY_MIN);
}

async function fetchHtml(url) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000),
      });
      if (res.status === 404) {
        console.warn(`    404 ${url}`);
        return null;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      console.warn(`    [WARN] ${url} attempt ${attempt + 1}: ${err.message}`);
      if (attempt < MAX_RETRIES) await sleep(5000);
    }
  }
  return null;
}

/** Curly / doubled feet-inch marks to ASCII: 8’6’’ → 8'6" */
function normalizeMarks(text) {
  return (text || '')
    .replace(/[’′‘]{2}|''|[″”“]/g, '"')
    .replace(/[’′‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** "8'6"" → 8.5, "26'" → 26 */
function feet(str) {
  const m = (str || '').match(/(\d+(?:\.\d+)?)\s*'\s*(?:(\d+(?:\.\d+)?)\s*")?/);
  if (!m) return null;
  return Math.round((parseFloat(m[1]) + (m[2] ? parseFloat(m[2]) / 12 : 0)) * 100) / 100;
}

/**
 * Dimensions (LxWxH) — despite the label, Brandt writes width first:
 * "10' x 26'", "8'6" x 26' x 34"", "9' x 22' | 24' | 26' | 28'",
 * "8'6" - 10' x 24' - 34'". Returns deck length (shortest offered) and the
 * loaded deck height when given in inches.
 */
function parseDimensions(raw) {
  const parts = normalizeMarks(raw).split(/\s*[x×]\s+/i);
  if (parts.length < 2) return { deckLength: null, deckHeight: null };
  const lengths = (parts[1].match(/\d+(?:\.\d+)?\s*'(?:\s*\d+(?:\.\d+)?")?/g) || []).map(feet).filter(Boolean);
  const heightMatch = parts[2] && parts[2].match(/^(\d+(?:\.\d+)?)\s*"/);
  return {
    deckLength: lengths.length ? Math.min(...lengths) : null,
    deckHeight: heightMatch ? parseFloat(heightMatch[1]) : null,
  };
}

/**
 * Model links on a list page → { model, category, url }. Model is the last
 * path segment (unique across categories); the West Coast models hang
 * directly off Heavy-Haul-Trailers with no category segment.
 */
function extractModelLinks($) {
  const out = [];
  $('a[href*="Heavy-Haul-Trailers/"]').each((_, a) => {
    const href = ($(a).attr('href') || '').trim().split(/[?#]/)[0];
    const m = href.match(/Heavy-Haul-Trailers\/(?:([^/]+)\/)?([^/]+)$/);
    if (!m) return;
    const [, rawCategory, model] = m;
    if (/^Heavy-Haul-Trailers-/i.test(model) || /^Heavy-Haul-Trailers-/i.test(rawCategory || '')) return;
    const category = rawCategory || (/West-Coast$/i.test(model) ? 'West-Coast' : null);
    if (!category || SKIPPED_CATEGORIES.has(category) || !CATEGORIES[category]) return;
    out.push({ model, category, url: new URL(href, WEBSITE).href.replace(/^http:/, 'https:') });
  });
  return out;
}

async function discoverProducts() {
  const found = new Map(); // model → { model, category, url }
  for (const listUrl of LIST_PAGES) {
    console.log(`  List: ${listUrl}`);
    const html = await fetchHtml(listUrl);
    if (html) {
      let added = 0;
      for (const link of extractModelLinks(cheerio.load(html))) {
        if (found.has(link.model)) continue;
        found.set(link.model, link);
        added++;
      }
      console.log(`    ${added} new model(s)`);
    }
    await sleep(randomDelay());
  }
  return [...found.values()];
}

async function scrapeProductPage({ url, model, category }) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);

  const siteName =
    cleanText($('#specs table th').first().text()) ||
    cleanText($('h2').first().text()) ||
    cleanText($('title').text().replace(/^Brandt\s*\|\s*/i, '')) ||
    model.replace(/-/g, ' ');

  const specs = {};
  $('#specs table tr').each((_, tr) => {
    const cells = $(tr).find('td');
    if (cells.length < 2) return;
    const key = cleanText($(cells[0]).text());
    const value = cleanText($(cells[1]).text());
    if (key && value) specs[key] = value;
  });

  const overview = $('#overview').clone();
  overview.find('h3').remove();
  const tagline = cleanText($('#overview h3').first().text()).replace(/\.$/, '') || null;
  const description = cleanText(overview.text()).replace(/\.{2,}$/, '.') || null;

  const features = $('#features li')
    .map((_, li) => cleanText($(li).text()))
    .get()
    .filter((t) => t && !/purchasing options|rentals|financing/i.test(t));

  const images = [];
  const seen = new Set();
  const addImage = (src) => {
    if (!src || !/\/getmedia\//i.test(src) || /maxsidesize/i.test(src)) return;
    const abs = new URL(src, WEBSITE).href.replace(/^http:/, 'https:');
    const key = abs.split('?')[0].toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    images.push({ url: abs, alt_text: `Brandt ${siteName} trailer`, source_url: url });
  };
  addImage($('.detail-image img').first().attr('src'));
  $('#gallery [id^="divImages"] img').each((_, img) => addImage($(img).attr('src')));

  return { url, model, category, siteName, specs, tagline, description, features, images };
}

/**
 * Listed among the transporters but not lowboy-family: the T300 is a cable-
 * steering pole trailer for pipe and the P350 a picker float (flat deck).
 */
function notLowboyFamily(d) {
  const text = `${d.siteName} ${d.description || ''}`;
  if (/\bpole trailer\b/i.test(text)) return 'pole trailer';
  if (/\bfloat\b/i.test(d.siteName)) return 'float (flat deck)';
  return null;
}

function buildProduct(d) {
  const cat = CATEGORIES[d.category];
  const type = cat.type;

  let name = d.siteName;
  if (cat.scissor) {
    const code = d.siteName.replace(/[-\s]*(fixed|flip)\b.*$/i, '');
    name = `${code} Scissorneck (${cat.scissor})`;
  } else if (cat.suffix && !/transporter|tag/i.test(name)) {
    name = `${name} ${cat.suffix}`;
  }

  // "22.5 tons" → 22: round down rather than overstate capacity.
  const payload = d.specs['Payload'] || '';
  const payloadTons = parseFloat((payload.replace(/,/g, '').match(/([\d.]+)\s*tons?/i) || [])[1]);
  const tonnage = Number.isFinite(payloadTons)
    ? { min: Math.floor(payloadTons), max: Math.floor(payloadTons) }
    : parseTonnage(payload);
  const tare = d.specs['Tare'] ? parseWeight(d.specs['Tare']) : null;
  const dims = parseDimensions(d.specs['Dimensions (LxWxH)'] || d.specs['Dimensions'] || '');
  // On the C-series pages the "Axle Lines" row repeats a dimension (28",
  // 26'10"); only a bare count is an axle-line figure.
  const axleLinesRaw = d.specs['Axle Lines'];
  const axleLines = /^\d{1,2}$/.test(axleLinesRaw || '') ? parseInt(axleLinesRaw, 10) : null;
  if (axleLinesRaw && !axleLines) delete d.specs['Axle Lines'];

  const modelNumber = (d.siteName.match(/^[A-Z]{1,4}\d{3,4}/) || [])[0] || null;
  // Only as specific as the page is: "mechanically removable gooseneck" (M
  // series) or a hydraulic neck; otherwise just detachable.
  const copy = `${d.description || ''} ${d.features.join(' ')}`;
  const gooseneck =
    type === 'tag-along'
      ? null
      : /mechanical(ly)?\s+(removable|detachable)|mechanical neck/i.test(copy)
        ? 'mechanical-detachable'
        : /hydraulic(ally)?\s+(removable|detachable)\s+(gooseneck|neck)|hydraulic (gooseneck|neck)\b/i.test(copy)
          ? 'hydraulic-detachable'
          : 'detachable';

  const specs = Object.entries(d.specs).map(([key, value]) => ({
    category: /tare|payload/i.test(key) ? 'Capacity' : /dimension/i.test(key) ? 'Dimensions' : /axle/i.test(key) ? 'Running Gear' : 'General',
    key: key === 'Dimensions (LxWxH)' ? 'Dimensions (W x L x H)' : key,
    value: normalizeMarks(value),
    unit: null,
  }));

  const description = [d.description, d.features.length ? `Features: ${d.features.join(' ')}` : null]
    .filter(Boolean)
    .join('\n\n') || null;

  return {
    product: {
      name,
      series: cat.series,
      model_number: modelNumber,
      tagline: d.tagline,
      description,
      short_description: d.description,
      product_type: type,
      tonnage_min: tonnage.min,
      tonnage_max: tonnage.max,
      deck_height_inches: dims.deckHeight,
      deck_length_feet: dims.deckLength,
      overall_length_feet: null,
      // Brandt's "Axle Lines" counts the configuration, which can include
      // booster and jeep axles (H550: 9, S500: 10) — not the trailer's own
      // axle count, so it is kept as a spec only.
      axle_count: null,
      gooseneck_type: gooseneck,
      empty_weight_lbs: tare,
      gvwr_lbs: null,
      concentrated_capacity_lbs: null,
      source_url: d.url,
    },
    specs,
    axleLines,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  printBanner(MANUFACTURER_INFO.name, WEBSITE);

  const supabase = getSupabaseClient();
  const manufacturerId = await ensureManufacturer(supabase, MANUFACTURER_SLUG, MANUFACTURER_INFO);
  console.log(`  Manufacturer ID: ${manufacturerId}\n`);

  const stats = { scraped: 0, upserted: 0, errors: 0 };

  try {
    console.log('Step 1: Discovering models...\n');
    const models = await discoverProducts();
    if (models.length === 0) {
      console.error('  No models discovered! Aborting.');
      return;
    }
    console.log(`\n  ${models.length} model pages to scrape\n`);

    console.log('Step 2: Scraping model pages...');
    for (let i = 0; i < models.length; i++) {
      const link = models[i];
      console.log(`\n[${i + 1}/${models.length}] ${link.url}`);
      try {
        const data = await scrapeProductPage(link);
        if (!data) {
          stats.errors++;
          continue;
        }
        stats.scraped++;

        const skip = notLowboyFamily(data);
        if (skip) {
          console.log(`    Skipping ${data.siteName}: ${skip}, not lowboy-family`);
          continue;
        }

        const { product, specs, axleLines } = buildProduct(data);
        if (axleLines) console.log(`    Axle lines (combination): ${axleLines}`);
        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          stats.errors++;
          continue;
        }
        await upsertProductImages(supabase, productId, data.images);
        await upsertProductSpecs(supabase, productId, specs);
        stats.upserted++;
      } catch (err) {
        console.error(`    Error processing ${link.url}: ${err.message}`);
        stats.errors++;
      }
      if (i < models.length - 1) await sleep(randomDelay());
    }

    console.log('\nStep 3: Updating product count...');
    const count = await updateProductCount(supabase, manufacturerId);
    console.log(`  Active products: ${count}`);
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    stats.errors++;
  }

  printSummary(MANUFACTURER_INFO.name, stats);
}

main().catch(console.error);

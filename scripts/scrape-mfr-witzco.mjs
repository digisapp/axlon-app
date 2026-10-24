// @ts-nocheck
/**
 * Scrape the Witzco Challenger lowboy / heavy-haul product catalog
 *
 * Witzco (witzco.com, Sarasota FL) is a WooCommerce + Divi site. Trailers
 * live under /product/<slug>/ alongside ~60 option pages ("Air Ride
 * Suspension", "36 inch Beaver Tail") in the same post type, so products are
 * discovered from the trailer category pages, never from the product sitemap:
 *
 *   uncategorized/srgrgs    RG series   removable gooseneck (ground bearing)  → rgn
 *   uncategorized/ngbgngbs  NGB series  non-ground-bearing removable neck     → rgn
 *   rnrns                   RN series   rigid neck                            → lowboy
 *   rtrts                   RT series   rolling tailboard, rigid neck         → lowboy
 *   taltts                  TT series   tag-along                             → tag-along
 *
 * Skipped: oa (options), dddds (DD drop decks), fbsps (SP flatbed).
 *
 * Pages are server-rendered, so this is plain fetch + cheerio. Two traps the
 * old Puppeteer version fell into: the first <h1> on every page is a header
 * widget's "Translate:" (the real name is h1.product_title), and /products/
 * and /product/ are 404s, so discovery used to fall back to four hardcoded
 * URLs. Specs are prose ("104,000# load capacity, 3 axles with 48′ overall
 * length … 22′ load deck"), parsed into structured fields below.
 *
 * Usage:
 *   node scripts/scrape-mfr-witzco.mjs
 *   node scripts/scrape-mfr-witzco.mjs --dry-run   # no DB writes, no keys needed
 */

import * as cheerio from 'cheerio';
import {
  getSupabaseClient,
  getManufacturerId,
  upsertProduct,
  upsertProductImages,
  upsertProductSpecs,
  updateProductCount,
  sleep,
  cleanText,
  parseTonnage,
  parseDeckHeight,
  parseLength,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'witzco';
const MANUFACTURER_NAME = 'Witzco Challenger';
const WEBSITE = 'https://www.witzco.com';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Trailer categories and what each one is. Order = scrape order. */
const CATEGORIES = [
  { path: 'uncategorized/srgrgs', series: 'RG Series', type: 'rgn', gooseneck: 'hydraulic-detachable' },
  { path: 'uncategorized/ngbgngbs', series: 'NGB Series', type: 'rgn', gooseneck: 'non-ground-bearing' },
  { path: 'rnrns', series: 'RN Series', type: 'lowboy', gooseneck: 'fixed' },
  { path: 'rtrts', series: 'RT Series', type: 'lowboy', gooseneck: 'fixed' },
  { path: 'taltts', series: 'TT Series', type: 'tag-along', gooseneck: null },
];

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
        signal: AbortSignal.timeout(45000),
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

/** Curly feet/inch marks to ASCII, so one set of patterns reads every page. */
function normalizeMarks(text) {
  return (text || '')
    .replace(/[’′‘`´]/g, "'")
    .replace(/[″”“]/g, '"')
    .replace(/\s+'/g, "'") // "22 ' 6"" → "22' 6""
    // "28', 6", lower deck" / "44'-3" overall" / "8'-6" width" → "28' 6" …"
    .replace(/(\d+)'\s*[,-]?\s*(\d+(?:\.\d+)?)"\s*,?/g, `$1' $2" `)
    .replace(/\s+/g, ' ')
    .trim();
}

/** "RN 40 • 40 TON NARROW NECK" → "RN-40 • 40 Ton Narrow Neck" */
function cleanName(raw) {
  let name = cleanText(raw).replace(/^(RG|NGB|RNN|RN|RT|TT)\s+(\d)/i, '$1-$2');
  const letters = name.replace(/^\S+/, '').replace(/[^a-z]/gi, '');
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    name = name
      .split(' ')
      .map((w) => (/\d/.test(w) || w.length <= 2 ? w : w.charAt(0) + w.slice(1).toLowerCase()))
      .join(' ');
  }
  return name;
}

/** Whole sentences up to `max` characters, never a cut-off word. */
function firstSentences(text, max = 300) {
  const t = cleanText(text);
  if (!t) return null;
  if (t.length <= max) return t;
  // Split after sentence punctuation followed by a space, so "16.5"" stays whole.
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = '';
  for (const s of sentences) {
    if ((out ? out.length + 1 : 0) + s.length > max) break;
    out = out ? `${out} ${s}` : s;
  }
  return out.trim() || t.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function extractModelNumber(name) {
  const m = name.toUpperCase().match(/^(RG|NGB|RNN|RN|RT|TT)[-\s]?(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : null;
}

const WORD_NUMBERS = { two: 2, three: 3, four: 4, five: 5, tandem: 2, tri: 3 };

/**
 * Parse Witzco's "Standard Features" prose into labelled specs.
 * Only facts actually stated on the page are returned.
 */
function parseFeatureProse(text) {
  const t = normalizeMarks(text);
  const specs = [];
  // A value that already carries its unit mark (43' 11", 40") gets no unit,
  // or the detail page would print "43' 11" ft".
  const add = (category, key, value, unit = null) => {
    if (!value) return;
    const v = String(value).trim();
    specs.push({ category, key, value: v, unit: /['"]$/.test(v) ? null : unit });
  };

  const cap = t.match(/(\d[\d,]{4,})\s*#\s*load capacity/i);
  if (cap) add('Capacity', 'Load Capacity', `${cap[1]} lbs`, 'lbs');

  const axles = t.match(/\b(\d|two|three|four)\s+(?:each\s+[\d,]+\s*#\s*)?axles\b/i);
  if (axles) add('Running Gear', 'Axles', String(WORD_NUMBERS[axles[1].toLowerCase()] || axles[1]));

  const axleCap = t.match(/(\d[\d,]{4,})\s*#\s*(?:capacity\s+)?axles/i);
  if (axleCap) add('Running Gear', 'Axle Capacity', `${axleCap[1]} lbs`, 'lbs');

  const overall = t.match(/(\d+'(?:\s*\d+(?:\.\d+)?")?)\s*overall length/i);
  if (overall) add('Dimensions', 'Overall Length', overall[1], 'ft');

  const deck = t.match(/(\d+'(?:\s*\d+(?:\.\d+)?")?)\s*(?:level\s+)?(?:load|lower|loading)\s+deck\b(?!\s*height)/i);
  if (deck) add('Dimensions', 'Deck Length', deck[1], 'ft');

  const height = t.match(/(?:lower\s+)?deck height\s*(?:of\s*)?(\d+(?:\.\d+)?)"/i);
  if (height) add('Dimensions', 'Deck Height', `${height[1]}"`, 'in');

  const width = t.match(/(\d+'\s*\d*"?)\s*wide/i) || t.match(/(\d+'\s*-\s*\d+")\s*width/i);
  if (width) add('Dimensions', 'Width', width[1].replace(/\s*-\s*/, ' '), 'ft');

  const neck = t.match(/(\d+'(?:\s*\d+")?)\s*long loadable gooseneck/i);
  if (neck) add('Dimensions', 'Loadable Gooseneck Length', neck[1], 'ft');

  const tail = t.match(/(\d+"|\d+'(?:\s*\d+")?)\s*beaver ?tail/i);
  if (tail) add('Dimensions', 'Beavertail Length', tail[1], tail[1].endsWith('"') ? 'in' : 'ft');

  const roller = t.match(/(\d+")\s*roller tail/i);
  if (roller) add('Dimensions', 'Roller Tail', roller[1], 'in');

  const susp = t.match(/(Hutch(?:en's)?(?: type)?\s*H?-?\d{4}[^,.]*?(?:suspension)?|air ride suspension)(?=[,.])/i);
  if (susp) add('Running Gear', 'Suspension', susp[1].trim());

  const brakes = t.match(/([\d.]+"\s*x\s*[\d.]+"\s*air brakes(?:\s*w\/ABS(?: system)?)?)/i);
  if (brakes) add('Running Gear', 'Brakes', brakes[1]);

  const tires = t.match(/(\d{3}\/\d{2}\s*R\s*\d{2}(?:\.\d)?)\s*(?:radial\s+)?tires/i);
  if (tires) add('Running Gear', 'Tires', tires[1].replace(/\s+/g, ' '));

  const decking = t.match(/(\d+"\s*(?:rough sawn\s+)?(?:oak|lumber)[^,.]*?decking|\d+"\s*(?:rough sawn\s+)?oak lumber)/i);
  if (decking) add('Construction', 'Decking', decking[1]);

  const outriggers = t.match(/\((\d+)\)\s*(\d+")\s*outriggers/i);
  if (outriggers) add('Construction', 'Outriggers', `${outriggers[1]} × ${outriggers[2]}`);

  const slope = t.match(/(\d+)\s*degree slope/i);
  if (slope) add('Gooseneck', 'Slope Bed to Neck', `${slope[1]}°`);

  const hitch = t.match(/(\d+"\s*lunette eye[^,.]*)/i);
  if (hitch) add('Hitch', 'Hitch', hitch[1]);

  const ramps = t.match(/(\d+"\s*x\s*\d+"\s*[^,.]*ramps)/i);
  if (ramps) add('Ramps', 'Ramps', ramps[1]);

  if (/self-contained hydraulic/i.test(t)) add('Hydraulics', 'Hydraulic System', 'Self-contained');
  if (/ride height adjustment/i.test(t)) add('Gooseneck', 'Ride Height Adjustment', '4-position, 2" increments');
  if (/air-operated gooseneck safety lock/i.test(t)) add('Gooseneck', 'Safety Lock', 'Air-operated locking pin');

  return specs;
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

/**
 * Product URLs per trailer category. A product listed in two categories is
 * kept under the first.
 */
async function discoverProducts() {
  const found = new Map(); // url → category
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const url = `${WEBSITE}/product-category/${cat.path}/`;
    console.log(`  Category: ${url}`);
    const html = await fetchHtml(url);
    if (html) {
      const $ = cheerio.load(html);
      let n = 0;
      $('ul.products li.product a.woocommerce-LoopProduct-link').each((_, a) => {
        const href = ($(a).attr('href') || '').split('?')[0];
        if (!/^https:\/\/www\.witzco\.com\/product\/[^/]+\/?$/.test(href)) return;
        const normalized = href.replace(/\/?$/, '/');
        if (!found.has(normalized)) {
          found.set(normalized, cat);
          n++;
        }
      });
      console.log(`    ${n} product(s)`);
    }
    await sleep(randomDelay());
  }
  return [...found.entries()].map(([url, category]) => ({ url, category }));
}

/**
 * Scrape a single product page and return structured data.
 */
async function scrapeProductPage(url, category) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);

  const rawName = $('h1.product_title').first().text();
  const name = cleanName(rawName);
  if (!name) {
    console.warn(`    No h1.product_title on ${url}, skipping`);
    return null;
  }

  // Description tab: marketing paragraphs + the "Standard Features" paragraph.
  // Colour and "call the factory" lines are dropped.
  const paragraphs = $('#tab-description p')
    .map((_, p) => cleanText($(p).text()))
    .get()
    .filter((p) => p.length > 20)
    .filter((p) => !/^colou?rs available|^we welcome custom/i.test(p));
  const featuresPara = paragraphs.find((p) => /standard features|features\s*[–-]/i.test(p)) || paragraphs.join(' ');
  const description = paragraphs
    .map((p) => p.replace(/\s*(We welcome custom requests?|Colou?rs available)[\s\S]*$/i, '').trim())
    .filter(Boolean)
    .join('\n\n');
  const marketing = paragraphs.find((p) => !/standard features|features\s*[–-]/i.test(p));
  const shortDescription = firstSentences(marketing || featuresPara, 300);

  // Features paragraph first so its numbers win; the NGB marketing copy
  // carries the ride-height and safety-lock facts.
  const specs = parseFeatureProse([featuresPara, ...paragraphs.filter((p) => p !== featuresPara)].join(' '));

  // Gallery: data-large_image is the full-size file.
  const images = [];
  const seen = new Set();
  $('.woocommerce-product-gallery__image').each((_, el) => {
    const img = $(el).find('img').first();
    const src = img.attr('data-large_image') || $(el).find('a').attr('href') || img.attr('data-src') || img.attr('src');
    if (!src || !/^https?:\/\//.test(src) || src.startsWith('data:')) return;
    const key = src.split('?')[0];
    if (seen.has(key)) return;
    seen.add(key);
    images.push({ url: src, alt_text: `${name} trailer`, source_url: url });
  });

  return { name, description, shortDescription, specs, images, category, sourceUrl: url };
}

/**
 * Build structured product data from scraped page data.
 */
function buildProduct(pageData) {
  const { name, description, shortDescription, specs, category, sourceUrl } = pageData;
  const spec = (key) => specs.find((s) => s.key === key)?.value || null;

  let tonnage = parseTonnage(spec('Load Capacity'));
  if (!tonnage.min) tonnage = parseTonnage(name);

  const axles = parseInt(spec('Axles') || '', 10) || null;

  return {
    name,
    series: category.series,
    model_number: extractModelNumber(name),
    tagline: null,
    description: description || null,
    short_description: shortDescription,
    product_type: category.type,
    tonnage_min: tonnage.min,
    tonnage_max: tonnage.max,
    deck_height_inches: parseDeckHeight(spec('Deck Height')),
    deck_length_feet: parseLength(spec('Deck Length')),
    overall_length_feet: parseLength(spec('Overall Length')),
    axle_count: axles,
    gooseneck_type: category.gooseneck,
    empty_weight_lbs: null,
    gvwr_lbs: null,
    concentrated_capacity_lbs: null,
    source_url: sourceUrl,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  printBanner(MANUFACTURER_NAME, WEBSITE);

  const supabase = getSupabaseClient();
  const manufacturerId = await getManufacturerId(supabase, MANUFACTURER_SLUG);
  console.log(`  Manufacturer ID: ${manufacturerId}\n`);

  const stats = { scraped: 0, upserted: 0, errors: 0 };

  try {
    console.log('Step 1: Discovering trailers from category pages...\n');
    const products = await discoverProducts();
    if (products.length === 0) {
      console.error('  No product pages discovered! Aborting.');
      return;
    }
    console.log(`\n  ${products.length} trailer pages to scrape\n`);

    console.log('Step 2: Scraping individual product pages...');
    for (let i = 0; i < products.length; i++) {
      const { url, category } = products[i];
      console.log(`\n[${i + 1}/${products.length}] ${url}`);

      try {
        const pageData = await scrapeProductPage(url, category);
        if (!pageData) {
          stats.errors++;
          continue;
        }
        stats.scraped++;

        const product = buildProduct(pageData);
        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          console.error('    Failed to upsert product');
          stats.errors++;
          continue;
        }
        await upsertProductImages(supabase, productId, pageData.images);
        await upsertProductSpecs(supabase, productId, pageData.specs);
        stats.upserted++;
      } catch (err) {
        console.error(`    Error processing ${url}: ${err.message}`);
        stats.errors++;
      }

      if (i < products.length - 1) await sleep(randomDelay());
    }

    console.log('\nStep 3: Updating product count...');
    const count = await updateProductCount(supabase, manufacturerId);
    console.log(`  Active products: ${count}`);
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    stats.errors++;
  }

  printSummary(MANUFACTURER_NAME, stats);
}

main().catch(console.error);

// @ts-nocheck
/**
 * Scrape the Alpha HD Trailers lowboy catalog
 *
 * Alpha HD Trailers (alphahdtrailers.com, Oelwein IA) builds detachable
 * gooseneck lowboys and double drops. WordPress (WPBakery), server-rendered.
 * Models live under /products/commercial/<model>/ and
 * /products/construction/<model>/; both category pages link every model from
 * the site's Products menu (the on-page grids show only some of them). The
 * "Jeep Dolly / Spreader Bar / Flip Axle" page is an accessory and skipped.
 *
 * Each model page: <h1> = model code (A80MG-E), a one-paragraph description
 * ("The Alpha HD A80MG-E is our 80,000# payload, mechanical gooseneck, double
 * drop, extendable. …"), a "Specifications" list of "Key: Value" items (OAL,
 * Capacity, Swing, Deck Length, Loaded deck height, Axle Capacity …) and a
 * thumbnail gallery whose links are the full-size photos.
 *
 * product_type follows the maker's own words in that first sentence:
 * "double drop" → double-drop, otherwise (hydraulic detachable "lowboy") → rgn.
 *
 * Usage:
 *   node scripts/scrape-mfr-alpha-hd.mjs
 *   node scripts/scrape-mfr-alpha-hd.mjs --dry-run   # no DB writes, no keys needed
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
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'alpha-hd';
const MANUFACTURER_INFO = {
  name: 'Alpha HD Trailers',
  canonical_name: 'Alpha HD Trailers',
  website: 'https://alphahdtrailers.com',
  headquarters: 'Oelwein, IA',
  country: 'USA',
  short_description:
    'Alpha HD Trailers builds hydraulic and mechanical detachable gooseneck lowboy and double-drop trailers in Oelwein, Iowa.',
  name_variations: ['Alpha HD', 'Alpha HD Trailers', 'AlphaHD', 'Alpha Heavy Duty'],
};
const WEBSITE = MANUFACTURER_INFO.website;
const CATEGORY_PAGES = [`${WEBSITE}/products/commercial/`, `${WEBSITE}/products/construction/`];
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

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

/** Curly feet/inch marks to ASCII, "½" to ".5". */
function normalizeMarks(text) {
  return (text || '')
    .replace(/\s*½/g, '.5')
    .replace(/[’′‘]/g, "'")
    .replace(/[″”“]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "29'" → 29, "50' 4"" → 50.33 (first length in the string) */
function feet(str) {
  const m = normalizeMarks(str).match(/(\d+(?:\.\d+)?)\s*'\s*(?:(\d+(?:\.\d+)?)\s*")?/);
  if (!m) return null;
  return Math.round((parseFloat(m[1]) + (m[2] ? parseFloat(m[2]) / 12 : 0)) * 100) / 100;
}

/** Largest "###,####" figure in a string, in lbs. */
function maxPounds(str) {
  const nums = (str || '').replace(/,/g, '').match(/(\d{4,})\s*#/g) || [];
  const vals = nums.map((n) => parseInt(n, 10)).filter(Number.isFinite);
  return vals.length ? Math.max(...vals) : null;
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

async function discoverProducts() {
  const found = new Set();
  for (const pageUrl of CATEGORY_PAGES) {
    console.log(`  Category: ${pageUrl}`);
    const html = await fetchHtml(pageUrl);
    if (html) {
      const $ = cheerio.load(html);
      let added = 0;
      $('a[href]').each((_, a) => {
        const href = ($(a).attr('href') || '').split(/[?#]/)[0];
        if (!/^https:\/\/alphahdtrailers\.com\/products\/(commercial|construction)\/[^/]+\/$/.test(href)) return;
        if (/jeep|dolly|spreader|flip-axle/i.test(href)) return; // accessory, not a trailer
        if (!found.has(href)) {
          found.add(href);
          added++;
        }
      });
      console.log(`    ${added} new model(s)`);
    }
    await sleep(randomDelay());
  }
  return [...found];
}

async function scrapeProductPage(url) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);

  const code = cleanText($('.wpb_wrapper h1').first().text() || $('h1').first().text());
  if (!code) {
    console.warn(`    No <h1> on ${url}, skipping`);
    return null;
  }

  const description =
    $('.wpb_text_column p')
      .map((_, p) => cleanText($(p).text()))
      .get()
      .filter((p) => p.length > 30)
      .join('\n\n') || null;

  // "Specifications" heading → the list that follows it
  const specs = [];
  $('h3, h4')
    .filter((_, h) => /^specifications$/i.test(cleanText($(h).text())))
    .first()
    .nextAll('ul')
    .first()
    .find('li')
    .each((_, li) => {
      const text = cleanText($(li).text());
      const m = text.match(/^([^:]{2,40}):\s*(.+)$/);
      if (m) specs.push({ key: m[1].trim(), value: normalizeMarks(m[2]) });
    });

  const images = [];
  const seen = new Set();
  $('.wpb_gallery a[href], a.qode-prettyphoto[href]').each((_, a) => {
    const href = $(a).attr('href');
    if (!href || !/\/wp-content\/uploads\/.+\.(jpe?g|png|webp)$/i.test(href) || /placeholder/i.test(href)) return;
    if (seen.has(href)) return;
    seen.add(href);
    images.push({ url: href, alt_text: `Alpha HD ${code} trailer`, source_url: url });
  });

  return { url, code, description, specs, images };
}

function buildProduct(d) {
  const spec = (re) => d.specs.find((s) => re.test(s.key))?.value || null;

  // "…is our 80,000# payload, mechanical gooseneck, double drop, extendable."
  const lead = (d.description || '').match(/is our\s+([\d,]+)\s*#\s*payload,?\s*([^.]*)\./i);
  const payloadLbs = lead ? parseInt(lead[1].replace(/,/g, ''), 10) : maxPounds(spec(/capacity/i));
  const style = lead ? cleanText(lead[2].replace(/\s*,\s*/g, ' ')) : '';

  const isDoubleDrop = /double drop/i.test(style);
  const type = isDoubleDrop ? 'double-drop' : 'rgn';
  const gooseneck = /hydraulic/i.test(style) || /HDG/i.test(d.code)
    ? 'hydraulic-detachable'
    : /mechanical/i.test(style) || /MG/i.test(d.code)
      ? 'mechanical-detachable'
      : 'detachable';

  // The bare code (A80MG-E) says nothing on a card; name what it is, from the
  // maker's own description: "A80MG-E Mechanical Gooseneck Extendable Double Drop".
  const neckLabel = {
    'hydraulic-detachable': 'Hydraulic Detachable',
    'mechanical-detachable': 'Mechanical Gooseneck',
  }[gooseneck] || 'Detachable';
  const deckLabel = [
    /paver/i.test(style) ? 'Paver' : null,
    /extendable/i.test(style) ? 'Extendable' : null,
    isDoubleDrop ? 'Double Drop' : 'Lowboy',
  ]
    .filter(Boolean)
    .join(' ');
  const name = `${d.code} ${neckLabel} ${deckLabel}`;

  // 125,000# is 62.5 tons: round down rather than overstate capacity.
  const tons = payloadLbs ? Math.floor(payloadLbs / 2000) : null;

  const axleCap = spec(/axle capacity/i) || '';
  const axleMatch = axleCap.match(/\((\d)\)/);

  const specs = d.specs.map(({ key, value }) => ({
    category: /capacity|payload/i.test(key)
      ? 'Capacity'
      : /axle|suspension|tire|flip|spreader/i.test(key)
        ? 'Running Gear'
        : /swing|fifth wheel|neck/i.test(key)
          ? 'Gooseneck'
          : 'Dimensions',
    key,
    value,
    unit: null,
  }));

  return {
    product: {
      name,
      series: /\/construction\//.test(d.url) ? 'Construction' : 'Commercial',
      model_number: d.code,
      tagline: null,
      description: d.description,
      short_description: d.description ? d.description.split(/(?<=[.!?])\s+/)[0] : null,
      product_type: type,
      tonnage_min: tons,
      tonnage_max: tons,
      deck_height_inches: parseFloat((normalizeMarks(spec(/loaded deck height/i) || '').match(/(\d+(?:\.\d+)?)\s*"/) || [])[1]) || null,
      deck_length_feet: feet(spec(/deck length/i)),
      overall_length_feet: feet(spec(/^oal$|overall length/i)),
      axle_count: axleMatch ? parseInt(axleMatch[1], 10) : null,
      gooseneck_type: gooseneck,
      empty_weight_lbs: null,
      gvwr_lbs: null,
      concentrated_capacity_lbs: null,
      source_url: d.url,
    },
    specs,
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
    const urls = await discoverProducts();
    if (urls.length === 0) {
      console.error('  No models discovered! Aborting.');
      return;
    }
    console.log(`\n  ${urls.length} model pages to scrape\n`);

    console.log('Step 2: Scraping model pages...');
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`\n[${i + 1}/${urls.length}] ${url}`);
      try {
        const data = await scrapeProductPage(url);
        if (!data) {
          stats.errors++;
          continue;
        }
        stats.scraped++;

        const { product, specs } = buildProduct(data);
        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          stats.errors++;
          continue;
        }
        await upsertProductImages(supabase, productId, data.images);
        await upsertProductSpecs(supabase, productId, specs);
        stats.upserted++;
      } catch (err) {
        console.error(`    Error processing ${url}: ${err.message}`);
        stats.errors++;
      }
      if (i < urls.length - 1) await sleep(randomDelay());
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

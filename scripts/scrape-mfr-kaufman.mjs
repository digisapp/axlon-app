// @ts-nocheck
/**
 * Scrape the Kaufman Trailers lowboy / heavy-haul product catalog
 *
 * Kaufman Trailers (kaufmantrailers.com, Lexington NC) sells detachable
 * gooseneck lowboys in five groups, each a category page under
 * /detachable-gooseneck-trailers/:
 *
 *   lowboy-trailers                            Construction    → rgn
 *   detachable-gooseneck-ag-trailers           Ag              → rgn
 *   detachable-gooseneck-paver-special-trailer Paver Special   → rgn
 *   detachable-gooseneck-commercial-trailers   Commercial      → rgn
 *   fix-neck-low-boy-gooseneck-trailers        Fixed Neck      → lowboy
 *
 * Product pages are TOP-LEVEL slugs (/35-ton-detachable-gooseneck-air-ride-
 * trailer), not nested under the category. The old scraper kept only links
 * with 2+ path segments, so it discarded every real product and fell back to
 * twelve hardcoded nested URLs that are all 404s; the catalog was stuck at 4
 * models. The site's other ~180 products (car haulers, dump, tilt, flatbed
 * goosenecks) are not heavy haul and are never visited.
 *
 * Each product page is server-rendered WooCommerce: the spec sheet is the
 * woocommerce-product-attributes table (G.V.W.R., Deck Height, Lower Deck,
 * Tongue, Axles, Suspension …) and the Lengths & Prices tab lists each well
 * length with its cash price. Plain fetch + cheerio; no browser needed.
 *
 * Usage:
 *   node scripts/scrape-mfr-kaufman.mjs
 *   node scripts/scrape-mfr-kaufman.mjs --dry-run   # no DB writes, no keys needed
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
  parseWeight,
  parseDeckHeight,
  parseLength,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'kaufman';
const MANUFACTURER_NAME = 'Kaufman Trailers';
const WEBSITE = 'https://www.kaufmantrailers.com';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Heavy-haul categories. Order = scrape order; a product in two keeps the first. */
const CATEGORIES = [
  { path: 'lowboy-trailers', series: 'Construction', type: 'rgn' },
  { path: 'detachable-gooseneck-ag-trailers', series: 'Ag', type: 'rgn' },
  { path: 'detachable-gooseneck-paver-special-trailer', series: 'Paver Special', type: 'rgn' },
  { path: 'detachable-gooseneck-commercial-trailers', series: 'Commercial', type: 'rgn' },
  { path: 'fix-neck-low-boy-gooseneck-trailers', series: 'Fixed Neck', type: 'lowboy' },
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

/** "35 Ton - Detachable Gooseneck Trailer - Deck On The Neck" → "35 Ton Detachable Gooseneck Trailer - Deck On The Neck" */
function cleanName(raw) {
  return cleanText(raw)
    .replace(/^(\d+\s*Ton)\s*[-–]\s*/i, '$1 ')
    .replace(/\s+[–—]\s+/g, ' - ');
}

/** Gooseneck type from the "Tongue" spec, falling back to the name. */
function classifyGooseneck(tongue, name, category) {
  const text = `${tongue || ''} ${name}`.toLowerCase();
  if (category.type === 'lowboy' || /fixed.?neck|fix.?neck/.test(text)) return 'fixed';
  if (/non.?ground.?bearing/.test(text)) return 'non-ground-bearing';
  if (/hydraulic/.test(text) && /removable|detach/.test(text)) return 'hydraulic-detachable';
  if (/mechanical/.test(text)) return 'mechanical-detachable';
  return 'hydraulic-detachable';
}

/** Spec category for a Kaufman attribute label. */
function specCategory(key) {
  const k = key.toLowerCase();
  if (/g\.?v\.?w\.?r|capacity/.test(k)) return 'Capacity';
  if (/deck|dovetail|length|width|height/.test(k)) return 'Dimensions';
  if (/axle|suspension|brake|wheel|tire/.test(k)) return 'Running Gear';
  if (/tongue|neck|coupler|kingpin/.test(k)) return 'Gooseneck';
  if (/frame|rail|floor|ramp|tie|toolbox/.test(k)) return 'Construction';
  if (/electric|light/.test(k)) return 'Electrical';
  if (/finish|paint/.test(k)) return 'Finish';
  return 'General';
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

async function discoverProducts() {
  const found = new Map(); // url → category
  for (const cat of CATEGORIES) {
    const url = `${WEBSITE}/detachable-gooseneck-trailers/${cat.path}`;
    console.log(`  Category: ${url}`);
    const html = await fetchHtml(url);
    if (html) {
      const $ = cheerio.load(html);
      let n = 0;
      $('.product-card h3.title a, .product-card .title a').each((_, a) => {
        const href = ($(a).attr('href') || '').split(/[?#]/)[0].replace(/\/$/, '');
        // Products are single-segment slugs on the main domain
        if (!/^https:\/\/www\.kaufmantrailers\.com\/[^/]+$/.test(href)) return;
        if (!found.has(href)) {
          found.set(href, cat);
          n++;
        }
      });
      console.log(`    ${n} product(s)`);
    }
    await sleep(randomDelay());
  }
  return [...found.entries()].map(([url, category]) => ({ url, category }));
}

async function scrapeProductPage(url, category) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);

  const name = cleanName($('.summary h1').first().text() || $('h1').first().text());
  if (!name) {
    console.warn(`    No product title on ${url}, skipping`);
    return null;
  }

  // Description: the product copy, minus the red "Price Shown Does Not
  // Include FET / Shown with Optional …" disclaimer paragraph.
  const paragraphs = $('.summary .desc-content p')
    .map((_, p) => cleanText($(p).text()))
    .get()
    .filter((p) => p.length > 20 && !/price shown|shown with optional|does not include fet/i.test(p));
  const description = paragraphs.join('\n\n') || null;

  // Spec sheet
  const attrs = [];
  $('.woocommerce-product-attributes-item').each((_, row) => {
    const key = cleanText($(row).find('.woocommerce-product-attributes-item__label').text()).replace(/:$/, '');
    const value = cleanText($(row).find('.woocommerce-product-attributes-item__value').text());
    if (key && value && !/^see additional options$/i.test(value)) attrs.push({ key, value });
  });

  // Lengths & Prices tab
  const variants = [];
  $('#LengthsPrices table.models tbody tr').each((_, tr) => {
    const cells = $(tr).find('td').map((__, td) => cleanText($(td).text())).get();
    if (cells.length < 3) return;
    const price = parseFloat((cells[2].match(/\$\s*([\d,]+(?:\.\d+)?)/) || [])[1]?.replace(/,/g, '') || '');
    variants.push({ productNumber: cells[0], length: cells[1], price: Number.isFinite(price) ? price : null });
  });

  // Gallery: the lightbox link is the full-size file. Skip video thumbnails.
  const images = [];
  const seen = new Set();
  $('.product-images .slider.main .swiper-slide').each((_, slide) => {
    const a = $(slide).find('a[data-fslightbox], a[href]').first();
    const img = $(slide).find('img').first();
    const src = a.attr('href') || img.attr('src');
    if (!src || !/^https:\/\/www\.kaufmantrailers\.com\/wp-content\/uploads\//.test(src)) return;
    if (!/\.(jpe?g|png|webp)$/i.test(src.split('?')[0])) return;
    const key = src.split('?')[0];
    if (seen.has(key)) return;
    seen.add(key);
    images.push({ url: src, alt_text: img.attr('alt') || `${name} trailer`, source_url: url });
  });

  return { name, description, attrs, variants, images, category, sourceUrl: url };
}

function buildProduct(pageData) {
  const { name, description, attrs, variants, category, sourceUrl } = pageData;
  const attr = (re) => attrs.find((a) => re.test(a.key))?.value || null;

  const gvwrText = attr(/g\.?v\.?w\.?r/i);
  const gvwr = gvwrText ? parseWeight(gvwrText) : null;
  const capMatch = (gvwrText || '').replace(/,/g, '').match(/capacity\s*(\d+)\s*lbs?/i);
  const capacityLbs = capMatch ? parseInt(capMatch[1], 10) : null;

  const tonMatch = name.match(/^(\d+)\s*Ton/i);
  const tons = tonMatch ? parseInt(tonMatch[1], 10) : capacityLbs ? Math.round(capacityLbs / 2000) : null;

  // "Lower Deck: 24' well length" is the well; "Deck Length" on fixed-neck
  // pages lists every section ("106" Top Deck, 78" Neck Slope, 27' Main Deck").
  const lowerDeck = attr(/^lower deck$/i);
  const deckLengthText = lowerDeck && /\d+\s*'/.test(lowerDeck) ? lowerDeck : attr(/^deck length$/i);
  // "24' well", "27'-0" Flat Deck", "33'6" well"
  const wellMatch = (deckLengthText || '').match(/(\d+(?:\.\d+)?)\s*'\s*(?:-?\s*(\d+(?:\.\d+)?)\s*")?/);
  const deckLength = wellMatch
    ? Math.round((parseFloat(wellMatch[1]) + (wellMatch[2] ? parseFloat(wellMatch[2]) / 12 : 0)) * 100) / 100
    : null;

  const deckHeight = parseDeckHeight(attr(/^deck height$/i));

  const axleText = attr(/^axles?$/i) || '';
  const axleMatch = axleText.match(/^(\d)\s*[-–x]/i) || axleText.match(/(\d)\s*axles?/i);
  const axles = axleMatch ? parseInt(axleMatch[1], 10) : null;

  const prices = variants.map((v) => v.price).filter(Boolean);

  const specs = attrs.map(({ key, value }) => ({
    category: specCategory(key),
    key,
    value,
    unit: null, // Kaufman values carry their own units ("24 in.", "86,000 lbs.")
  }));
  if (variants.length) {
    const lengths = variants.map((v) => parseLength(v.length)).filter(Boolean);
    if (lengths.length) {
      specs.push({
        category: 'Dimensions',
        key: 'Available Lengths',
        value: `${[...new Set(lengths)].join(', ')} ft.`,
        unit: null,
      });
    }
  }

  return {
    product: {
      name,
      series: category.series,
      model_number: null,
      tagline: null,
      description,
      short_description: firstSentences(description, 300),
      product_type: category.type,
      tonnage_min: tons,
      tonnage_max: tons,
      deck_height_inches: deckHeight,
      deck_length_feet: deckLength,
      overall_length_feet: null,
      axle_count: axles,
      gooseneck_type: classifyGooseneck(attr(/^tongue$/i), name, category),
      empty_weight_lbs: null,
      gvwr_lbs: gvwr,
      concentrated_capacity_lbs: capacityLbs,
      msrp_low: prices.length ? Math.min(...prices) : null,
      msrp_high: prices.length ? Math.max(...prices) : null,
      source_url: sourceUrl,
    },
    specs,
  };
}

/** Whole sentences up to `max` characters, never a cut-off word. */
function firstSentences(text, max = 300) {
  const t = cleanText(text);
  if (!t) return null;
  if (t.length <= max) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = '';
  for (const s of sentences) {
    if ((out ? out.length + 1 : 0) + s.length > max) break;
    out = out ? `${out} ${s}` : s;
  }
  return out || t.slice(0, max).replace(/\s+\S*$/, '') + '…';
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
    const seenNames = new Map();
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

        const { product, specs } = buildProduct(pageData);
        // The upsert key is the slugified name; two pages with one title
        // would silently overwrite each other.
        if (seenNames.has(product.name)) {
          console.warn(`    [WARN] "${product.name}" already scraped from ${seenNames.get(product.name)}`);
        }
        seenNames.set(product.name, url);

        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          console.error('    Failed to upsert product');
          stats.errors++;
          continue;
        }
        await upsertProductImages(supabase, productId, pageData.images);
        await upsertProductSpecs(supabase, productId, specs);
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

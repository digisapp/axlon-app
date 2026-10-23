// @ts-nocheck
/**
 * Interstate Trailers Product Catalog Scraper
 *
 * Scrapes interstatetrailers.com (Mansfield, TX) for its lowboys and
 * tag-along equipment trailers and upserts them into the manufacturer_products
 * tables.
 *
 * Each model page's heading is the model code ("110 SDGN"), followed by a
 * one-line summary ("110,000 lb. capacity lowboy trailer ..."), a short
 * "Key: value" list and a spec-sheet PDF link. Codes are decoded with the
 * site's own Model Abbreviation Key (SDGN = self-lifting detachable gooseneck,
 * LBG = level bed gooseneck, DLA = dual tired, airbrake, low profile, ...).
 *
 * Usage:
 *   node scripts/scrape-mfr-interstate.mjs            # live (needs service-role key)
 *   node scripts/scrape-mfr-interstate.mjs --dry-run  # print what would be upserted
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
import { createPoliteFetcher, textOf, absoluteUrl, parseFeet, parsePounds } from './lib/polite-fetch.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MANUFACTURER_SLUG = 'interstate';
const MANUFACTURER_NAME = 'Interstate Trailers';
const BASE_URL = 'https://interstatetrailers.com';
const MANUFACTURER_INFO = {
  name: 'Interstate Trailers',
  canonical_name: 'Interstate Trailers',
  website: BASE_URL,
  headquarters: 'Mansfield, Texas',
  country: 'USA',
  short_description:
    'Mansfield, Texas manufacturer of lowboy, tag-along, gooseneck and tilt equipment trailers.',
  name_variations: ['interstate', 'interstate trailers', 'interstate trailer', 'interstate trailers inc'],
};

// The categories in scope, and how their models are filed.
const CATEGORIES = [
  { path: '/lowboys/', label: 'Lowboy', type: 'lowboy' },
  { path: '/tag-along-trailers/', label: 'Tag-Along', type: 'tag-along' },
];

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

async function discoverModels(fetcher) {
  const models = [];
  const seen = new Set();
  for (const category of CATEGORIES) {
    const listUrl = `${BASE_URL}${category.path}`;
    const page = await fetcher.html(listUrl);
    if (!page) continue;
    page.$('a[href]').each((_, a) => {
      const url = absoluteUrl(page.$(a).attr('href'), listUrl);
      if (!url) return;
      const { pathname, host } = new URL(url);
      if (!host.endsWith('interstatetrailers.com')) return;
      // A model page is exactly one level below the category.
      const rest = pathname.startsWith(category.path) ? pathname.slice(category.path.length) : '';
      if (!/^[a-z0-9-]+\/?$/i.test(rest)) return;
      const clean = url.split('#')[0].replace(/\/?$/, '/');
      if (seen.has(clean)) return;
      seen.add(clean);
      models.push({ url: clean, category });
    });
  }
  return models;
}

// ---------------------------------------------------------------------------
// Model page parsing
// ---------------------------------------------------------------------------

/** Full-size upload URL: drop WordPress's "-1024x331" size suffix. */
function fullSize(url) {
  return url.replace(/-\d+x\d+(?=\.(webp|jpe?g|png)$)/i, '');
}

/**
 * Product images: everything above the spec list (the model's render or
 * spec drawing, sometimes a photo), plus any image elsewhere on the page whose
 * file name starts with the model code. The shared option carousel below the
 * specs (ramps, other models) is left out.
 */
function readImages($, pageUrl, code) {
  const compact = code.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const out = [];
  let beforeSpecs = true;
  $('body *').each((_, el) => {
    if ($(el).is('[data-widget_type="theme-post-content.default"]')) beforeSpecs = false;
    if (el.tagName !== 'img') return;
    const src = absoluteUrl($(el).attr('src'), pageUrl);
    if (!src || !/\/wp-content\/uploads\//.test(src) || isLogoUrl(src) || /icon-/i.test(src)) return;
    const file = src.split('/').pop().replace(/[^a-z0-9]/gi, '').toUpperCase();
    // File name starting with the code: "20-DT-..." yes, "G20DT-..." (the
    // gooseneck model) no.
    if (beforeSpecs || file.startsWith(compact)) {
      out.push({ url: fullSize(src), alt: cleanText($(el).attr('alt') || '') });
    }
  });
  const seen = new Set();
  return out.filter((i) => !seen.has(i.url) && seen.add(i.url));
}

function readPage($, pageUrl) {
  const $content = $('[data-widget_type="theme-post-content.default"]').first();
  const heading = textOf($('h1').first()) || textOf($('h2').first());

  // Summary lines sit between the heading and the spec list.
  const paragraphs = [];
  $('h1, h2, h3, p').each((_, el) => {
    const t = textOf($(el));
    if (/\b(lb\.?|ton)\b.*\bcapacity\b|\bcapacity\b/i.test(t) && t.length < 400 && !paragraphs.includes(t)) {
      paragraphs.push(t);
    }
  });

  const specLines = $content
    .find('li')
    .toArray()
    .map((el) => textOf($(el)))
    .filter(Boolean);
  // Some pages carry a sentence of copy in place of the spec list.
  $content.find('p').each((_, el) => {
    const t = textOf($(el));
    if (t.length > 20 && !paragraphs.includes(t)) paragraphs.push(t);
  });

  // "Download Spec Sheet" is a PDF on most pages and an image on a few.
  const sheetHref = $('a')
    .toArray()
    .filter((a) => /spec sheet/i.test(textOf($(a))))
    .map((a) => absoluteUrl($(a).attr('href'), pageUrl))
    .find(Boolean);
  const specSheet = sheetHref && /\.pdf$/i.test(sheetHref) ? sheetHref : null;
  const specSheetImage = sheetHref && /\.(webp|jpe?g|png)$/i.test(sheetHref) ? sheetHref : null;

  return { heading, paragraphs, specLines, specSheet, specSheetImage };
}

// ---------------------------------------------------------------------------
// Page -> product
// ---------------------------------------------------------------------------

const ABBREVIATIONS = {
  SDGN: 'self-lifting detachable gooseneck',
  LBG: 'level bed gooseneck',
  BST: 'Budd single tired',
  RBS: 'single tired, 82" between fenders',
  DT: 'dual tired',
  DTA: 'dual tired, air brakes',
  DLE: 'dual tired, low profile tires, electric brakes',
  DLA: 'dual tired, low profile tires, air brakes',
};

function buildProduct({ url, category }, page) {
  const { $ } = page;
  const { heading, paragraphs, specLines, specSheet, specSheetImage } = readPage($, url);
  const code = cleanText(heading).toUpperCase();
  if (!/^\d+\s*[A-Z]/.test(code)) return null;

  const suffix = code.replace(/^\d+\s*/, '').split('/')[0];
  const summary = paragraphs.find((p) => /capacity/i.test(p)) || null;
  const extra = paragraphs.filter((p) => p !== summary);

  const specs = [];
  const facts = {};
  for (const line of specLines) {
    const m = /^([^:]{2,40}):\s*(.+)$/.exec(line);
    if (m) {
      const key = cleanText(m[1]);
      facts[key.toLowerCase()] = cleanText(m[2]);
      const category =
        /weight/i.test(key) ? 'Weight' : /length|width|height/i.test(key) ? 'Dimensions' : 'General';
      specs.push({ category, key, value: cleanText(m[2]), unit: null });
    } else if (/brake/i.test(line)) {
      facts.brakes = line;
      specs.push({ category: 'Running Gear', key: 'Brakes', value: line, unit: null });
    } else {
      specs.push({ category: 'Features', key: line.slice(0, 60), value: 'Standard', unit: null });
    }
  }
  const capacityLbs = parsePounds((/([\d,]+)\s*lb\.?\s*capacity/i.exec(summary || '') || [])[1]);
  if (capacityLbs) specs.unshift({ category: 'Capacity', key: 'Capacity', value: capacityLbs.toLocaleString('en-US'), unit: 'lbs' });
  if (ABBREVIATIONS[suffix]) specs.push({ category: 'General', key: 'Model Code', value: `${suffix}: ${ABBREVIATIONS[suffix]}`, unit: null });
  if (specSheet) specs.push({ category: 'Documents', key: 'Spec Sheet (PDF)', value: specSheet, unit: null });

  let type = category.type;
  let gooseneck = null;
  if (category.type === 'lowboy') {
    if (/SDGN/.test(suffix)) {
      type = 'rgn';
      gooseneck = 'detachable';
    } else if (/LBG/.test(suffix)) {
      gooseneck = 'fixed';
    }
  }

  const name = `${code} ${category.label}`;
  const pageImages = readImages($, url, code);
  if (specSheetImage && !pageImages.some((i) => i.url === specSheetImage)) {
    pageImages.push({ url: specSheetImage, alt: `Interstate ${code} spec sheet` });
  }
  const images = pageImages.map((img) => ({
    url: img.url,
    alt_text: img.alt || `Interstate ${name}`,
    source_url: url,
  }));

  return {
    product: {
      name,
      series: null,
      model_number: code,
      tagline: null,
      description: [summary, ...extra].filter(Boolean).join('\n\n') || null,
      short_description: summary,
      product_type: type,
      tonnage_min: capacityLbs ? Math.round(capacityLbs / 2000) : null,
      tonnage_max: capacityLbs ? Math.round(capacityLbs / 2000) : null,
      deck_height_inches: null,
      deck_length_feet: parseFeet(facts['deck length']),
      overall_length_feet: null,
      axle_count: null,
      gooseneck_type: gooseneck,
      empty_weight_lbs: parsePounds(facts['trailer weight']),
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
  if (models.length === 0) {
    console.error('No model links found on the category pages (blocked or changed). Nothing scraped.');
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
      const built = buildProduct(model, page);
      if (!built) {
        console.warn(`  [SKIP] No model code heading on ${model.url}`);
        stats.errors++;
        continue;
      }
      const { product, specs, images } = built;
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

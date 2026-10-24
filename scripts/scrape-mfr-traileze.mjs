// @ts-nocheck
/**
 * TRAIL-EZE Product Catalog Scraper
 *
 * Scrapes traileze.com (Mitchell, SD; building trailers since 1963) for its
 * hydraulic tail, sliding axle, folding and detachable gooseneck lowboy, and
 * jeep/booster models, and upserts them into the manufacturer_products tables.
 *
 * Each /modelslist/<category>/ page carries one or more Ninja Tables spec
 * grids with ONE COLUMN PER MODEL (e.g. TE80HT | TE100HT). Every model column
 * becomes its own product. Some grids are inline in the HTML; the rest load
 * from the page's own public admin-ajax.php data URL (allowed by robots.txt).
 *
 * Usage:
 *   node scripts/scrape-mfr-traileze.mjs            # live (needs service-role key)
 *   node scripts/scrape-mfr-traileze.mjs --dry-run  # print what would be upserted
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
import {
  createPoliteFetcher,
  textOf,
  absoluteUrl,
  parseInches,
  parseFeet,
  parsePounds,
} from './lib/polite-fetch.mjs';
import * as cheerio from 'cheerio';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MANUFACTURER_SLUG = 'trail-eze';
const MANUFACTURER_NAME = 'TRAIL-EZE';
const BASE_URL = 'https://traileze.com';
const MANUFACTURER_INFO = {
  name: 'Trail-Eze',
  canonical_name: 'Trail-Eze',
  website: BASE_URL,
  headquarters: 'Mitchell, South Dakota',
  country: 'USA',
  short_description:
    'South Dakota manufacturer of custom hydraulic tail, sliding axle, folding gooseneck and detachable gooseneck trailers, building since 1963.',
  name_variations: ['trail-eze', 'trail eze', 'traileze', 'trail-eze trailers', 'trail eze trailers'],
};

// Categories seen on the site that are not heavy-haul catalog models:
// a container chassis, and a gallery of one-off custom builds with no specs.
const SKIP_CATEGORIES = new Set(['container-frame', 'specialty']);

// Model code suffix -> label (used in the product name) and type.
// Codes are TE + distributed capacity in thousands of lbs + a type suffix.
const CODE_TYPES = [
  { re: /DGBUS$/, label: 'Detachable Gooseneck Bus Hauler', type: 'rgn' },
  { re: /DGWS$/, label: 'Detachable Gooseneck Wide Side', type: 'rgn' },
  { re: /DGRR$/, label: 'Railroad Detachable Gooseneck', type: 'rgn' },
  { re: /FGRR$/, label: 'Railroad Folding Gooseneck', type: 'lowboy' },
  { re: /\d01A?RR$/, label: 'Railroad Slide Axle', type: 'traveling-axle' },
  { re: /DG$/, label: 'Detachable Gooseneck', type: 'rgn' },
  { re: /FG$/, label: 'Folding Gooseneck', type: 'lowboy' },
  // Upper deck + 37.5" main deck + hydraulic tail: a drop-deck layout.
  { re: /HT$/, label: 'Hydraulic Tail', type: 'step-deck' },
  { re: /XT$/, label: 'Extended Tail', type: 'step-deck' },
  { re: /ST$/, label: 'Sliding Axle Traveling Tail', type: 'traveling-axle' },
  { re: /^TE\d+01A?$/, label: 'Slide Axle', type: 'traveling-axle' },
  { re: /\dJ$/, label: 'Jeep', type: 'other' },
  { re: /\d(AB|NB|FA)$/, label: 'Booster', type: 'other' },
];

const MODEL_CODE = /^TE\d+[A-Z]*$/;

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

async function discoverCategories(fetcher) {
  const page = await fetcher.html(`${BASE_URL}/`);
  if (!page) return null;
  const slugs = new Set();
  page.$('a[href*="/modelslist/"]').each((_, a) => {
    const m = /\/modelslist\/([^/?#]+)\/?/.exec(page.$(a).attr('href') || '');
    if (m) slugs.add(m[1]);
  });
  return [...slugs].sort();
}

// ---------------------------------------------------------------------------
// Category page parsing
// ---------------------------------------------------------------------------

/** Ninja Tables config objects embedded in the page, keyed by instance name. */
function ninjaConfigs(html) {
  const configs = {};
  const re = /\['(ninja_table_instance_\d+)'\]\s*=\s*(\{.*?\});\s*<\/script>/gs;
  let m;
  while ((m = re.exec(html))) {
    try {
      configs[m[1]] = JSON.parse(m[2]);
    } catch {
      /* not a config we can read */
    }
  }
  return configs;
}

/** First value of `key` anywhere in a nested config object. */
function findKey(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  if (typeof obj[key] === 'string') return obj[key];
  for (const v of Object.values(obj)) {
    const found = findKey(v, key);
    if (found) return found;
  }
  return null;
}

/** Decode a Ninja Tables cell (may hold entities or a little HTML) to text. */
function cellText(value) {
  if (value == null) return '';
  return cheerio.load(`<div>${String(value)}</div>`)('div').text().replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Every spec grid on the page as { headers: [...], rows: [[...cells]] }.
 * Inline ("legacy") grids are read from the DOM; AJAX grids from the page's
 * own data URL, mapped through the column order in its config.
 */
async function readSpecGrids(fetcher, page, pageUrl) {
  const { $, html } = page;
  const configs = ninjaConfigs(html);
  const grids = [];

  for (const table of $('table.ninja_footable').toArray()) {
    const $t = $(table);
    const instance = $t.attr('ninja_table_instance') || $t.attr('data-ninja_table_instance');
    const config = instance ? configs[instance] : null;
    const bodyRows = $t.find('tbody tr').toArray();

    if (bodyRows.length > 0) {
      const headers = $t.find('thead th').toArray().map((th) => textOf($(th)));
      const rows = bodyRows.map((tr) => $(tr).find('td').toArray().map((td) => textOf($(td))));
      grids.push({ headers, rows });
      continue;
    }

    const dataUrl = findKey(config, 'data_request_url');
    if (!dataUrl) {
      console.warn(`  [WARN] Spec table with no rows and no data URL on ${pageUrl}`);
      continue;
    }
    const data = await fetcher.json(dataUrl, { headers: { Referer: pageUrl } });
    if (!Array.isArray(data)) {
      console.warn(`  [WARN] Could not load spec table data for ${pageUrl}`);
      continue;
    }
    const columns = (config.columns || []).map((c) => ({ key: c.key || c.name, title: cellText(c.title) }));
    grids.push({
      headers: columns.map((c) => c.title),
      rows: data.map((row) => columns.map((c) => cellText(row?.value?.[c.key]))),
    });
  }
  return grids;
}

/** Images: slider renders captioned per model, plus the page's photo gallery. */
function readImages(page, pageUrl, categorySlug) {
  const { $ } = page;
  const byModel = {};
  const backgrounds = {};
  $('.n2-ss-slide-background').each((_, el) => {
    const src = $(el).find('img').attr('src');
    if (src) backgrounds[$(el).attr('data-public-id')] = absoluteUrl(src, pageUrl);
  });
  $('.n2-ss-slide').each((_, el) => {
    const code = textOf($(el)).toUpperCase().replace(/\s+/g, '');
    const src = backgrounds[$(el).attr('data-slide-public-id')];
    if (!src || !MODEL_CODE.test(code)) return;
    (byModel[code] ||= []).push(src);
  });

  // The gallery on some pages also shows other categories' trailers
  // (a "Jeeps" or "Boosters" photo on the hydraulic tail page).
  const gallery = [];
  $('.fusion-gallery-image').each((_, el) => {
    const $a = $(el).find('a').first();
    const $img = $(el).find('img').first();
    const title = $img.attr('title') || $img.attr('alt') || '';
    if (categorySlug !== 'jeeps' && /\b(jeeps?|boosters?)\b/i.test(title)) return;
    const src = absoluteUrl($a.attr('href') || $img.attr('src'), pageUrl);
    if (src && /\.(jpe?g|png|webp)$/i.test(src)) gallery.push(src);
  });

  const keep = (url) => url && !isLogoUrl(url);
  return {
    byModel: Object.fromEntries(Object.entries(byModel).map(([k, v]) => [k, [...new Set(v)].filter(keep)])),
    gallery: [...new Set(gallery)].filter(keep),
  };
}

/** Intro copy on the page (most pages have none beyond the spec grid). */
function readIntro(page) {
  const { $ } = page;
  const parts = [];
  $('.fusion-text p, .fusion-text').each((_, el) => {
    const t = textOf($(el));
    if (t.length < 40) return;
    if (/custom design and manufacture your trailer|contact the trail-eze sales/i.test(t)) return;
    if (/acknowledgment of terms|must be checked/i.test(t)) return;
    if (!parts.includes(t)) parts.push(t);
  });
  return parts.join('\n\n') || null;
}

// ---------------------------------------------------------------------------
// Grid -> products
// ---------------------------------------------------------------------------

const CHECK = /^(✔|✓|x|yes|std\.?|standard)$/i;

function titleKey(raw) {
  const k = cleanText(raw).replace(/:$/, '');
  return k === k.toUpperCase() ? k.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : k;
}

function truncate(text, max = 300) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function categoryForKey(key, section) {
  if (section === 'options') return 'Options';
  if (/capacity/i.test(key)) return 'Capacity';
  if (/axle|brake|abs|wheel|tire|suspension|air lift/i.test(key)) return 'Running Gear';
  if (/gooseneck|neck|king ?pin|swing|5th wheel|pintle/i.test(key)) return 'Gooseneck';
  if (/hydraulic|tail/i.test(key)) return 'Hydraulics';
  if (/length|width|height|clearance|angle|porch|deck/i.test(key)) return 'Dimensions';
  if (/electrical|light/i.test(key)) return 'Electrical';
  if (/warranty/i.test(key)) return 'Warranty';
  return 'Construction';
}

/**
 * Split one grid into per-model { code, specs, facts }. The first column is
 * the row label; model columns are the headers that look like model codes.
 */
function gridToModels(grid) {
  const models = [];
  grid.headers.forEach((header, col) => {
    const code = (header || '').toUpperCase().replace(/\s+/g, '');
    if (!MODEL_CODE.test(code)) return;
    let section = 'standard';
    const specs = [];
    const facts = { features: {} };
    for (const row of grid.rows) {
      const label = cleanText(row[0] || '');
      const value = cleanText(row[col] || '');
      if (!label) continue;
      if (/^custom options$/i.test(label)) { section = 'options'; continue; }
      if (/^standard configuration$/i.test(label)) { section = 'standard'; continue; }
      if (!value || /^n\/?a$/i.test(value)) continue;

      if (CHECK.test(value)) {
        // Feature row: "AXLES: 25,000 # with oil seal hubs" ✔
        const m = /^([^:]{2,40}):\s*(.+)$/.exec(label);
        const key = titleKey(m ? m[1] : label);
        const text = m ? truncate(cleanText(m[2])) : 'Standard';
        specs.push({ category: categoryForKey(key, section), key, value: text, unit: null });
        facts.features[key.toLowerCase()] = m ? cleanText(m[2]) : label;
      } else {
        const key = titleKey(label);
        const unit = /capacity/i.test(key) && /^\d[\d,]*$/.test(value) ? 'lbs' : null;
        specs.push({ category: categoryForKey(key, section), key, value, unit });
        facts[key.toLowerCase()] = value;
      }
    }
    models.push({ code, specs, facts });
  });
  return models;
}

function classify(code) {
  return CODE_TYPES.find((t) => t.re.test(code)) || null;
}

function gooseneckType(type, facts) {
  const neck = facts.features.gooseneck || '';
  if (/fold/i.test(neck) || /FG(RR)?$/.test(facts.code || '')) return 'folding';
  if (/detach/i.test(neck)) return /hydraulic/i.test(neck) ? 'hydraulic-detachable' : 'detachable';
  if (type === 'rgn') return 'detachable';
  return null;
}

function buildProduct({ code, specs, facts }, ctx) {
  const kind = classify(code);
  const label = kind?.label || ctx.categoryLabel;
  const type = kind?.type || 'other';
  facts.code = code;

  const get = (...keys) => keys.map((k) => facts[k]).find(Boolean) || null;
  const distributed = parsePounds(get('distributed capacity', 'capacity distributed'));
  const concentrated = parsePounds(get('concentrated capacity', 'capacity in 10\''));
  const axleRow = get('number of axles @ spacing', 'number of axles');
  let axles = axleRow ? parseInt(/^(\d+)/.exec(axleRow)?.[1] || '', 10) || null : null;
  if (!axles && facts.features['single axle']) axles = 1;
  if (!axles && facts.features['double axle']) axles = 2;

  // Type-defining copy straight from the grid ("GOOSENECK: Folding neck ...").
  const defining = ['gooseneck', 'hydraulic tail', 'nitro booster']
    .map((k) => facts.features[k])
    .filter(Boolean)
    .map((t) => cleanText(t));
  const description = [ctx.intro, ...defining].filter(Boolean).join('\n\n') || null;

  const images = [...(ctx.images.byModel[code] || []), ...ctx.images.gallery].map((url) => ({
    url,
    alt_text: `TRAIL-EZE ${code} ${label}`,
    source_url: ctx.url,
  }));

  return {
    product: {
      name: `${code} ${label}`,
      series: label,
      model_number: code,
      tagline: null,
      description,
      short_description: defining[0] ? truncate(defining[0], 200) : null,
      product_type: type,
      tonnage_min: distributed ? Math.round(distributed / 2000) : null,
      tonnage_max: distributed ? Math.round(distributed / 2000) : null,
      deck_height_inches: parseInches(get('deck height', 'deck height loaded', 'loaded deck height', 'deck height (loaded)')),
      deck_length_feet: parseFeet(get('main deck length', 'bed length')),
      overall_length_feet: parseFeet(get('overall length')),
      axle_count: axles,
      gooseneck_type: gooseneckType(type, facts),
      empty_weight_lbs: null,
      gvwr_lbs: null,
      concentrated_capacity_lbs: concentrated,
      source_url: ctx.url,
    },
    specs,
    images,
  };
}

/**
 * A category page with no spec grid (Heavy Haul) still names its model in the
 * slider caption. It becomes one product with the page's copy and photos.
 */
function slideOnlyProducts(ctx) {
  return Object.keys(ctx.images.byModel).map((code) =>
    buildProduct({ code, specs: [], facts: { features: {} } }, ctx)
  );
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

  const categories = await discoverCategories(fetcher);
  if (!categories || categories.length === 0) {
    console.error('Could not read the category list from the home page (blocked or changed). Nothing scraped.');
    stats.errors++;
    printSummary(MANUFACTURER_NAME, stats);
    process.exitCode = 1;
    return;
  }
  console.log(`Found ${categories.length} categories: ${categories.join(', ')}\n`);

  const seen = new Set();
  for (const slug of categories) {
    if (SKIP_CATEGORIES.has(slug)) {
      console.log(`- Skipping ${slug} (not a catalog model page)`);
      continue;
    }
    const url = `${BASE_URL}/modelslist/${slug}/`;
    console.log(`\n[${slug}] ${url}`);
    const page = await fetcher.html(url);
    if (!page) {
      stats.errors++;
      continue;
    }

    const heading = textOf(page.$('h3').first()) || slug;
    const ctx = {
      url,
      categoryLabel: heading.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()),
      intro: readIntro(page),
      images: readImages(page, url, slug),
    };

    let built = [];
    try {
      const grids = await readSpecGrids(fetcher, page, url);
      built = grids.flatMap(gridToModels).map((m) => buildProduct(m, ctx));
      if (built.length === 0) built = slideOnlyProducts(ctx);
    } catch (err) {
      console.error(`  [ERROR] ${url}: ${err.message}`);
      stats.errors++;
      continue;
    }
    if (built.length === 0) console.warn(`  [WARN] No models found on ${url}`);

    for (const { product, specs, images } of built) {
      if (seen.has(product.model_number)) continue;
      seen.add(product.model_number);
      if (!classify(product.model_number)) {
        console.warn(`  [WARN] Unrecognised model code ${product.model_number}; filed as "${product.product_type}"`);
      }
      stats.scraped++;
      const productId = await upsertProduct(supabase, manufacturerId, product);
      if (!productId) {
        stats.errors++;
        continue;
      }
      stats.upserted++;
      await upsertProductImages(supabase, productId, images);
      await upsertProductSpecs(supabase, productId, specs);
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

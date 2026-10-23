// @ts-nocheck
/**
 * Scrape the Rogers Brothers (ROGERS) lowboy / heavy-haul product catalog
 *
 * Rogers Brothers Corporation (rogerstrailers.com, Albion PA) builds lowbed
 * heavy-haul trailers: detachable gooseneck (front loading), fixed gooseneck
 * (rear loading) and tag-alongs, plus custom modular / transformer / coil
 * builds.
 *
 * The site is Joomla + Fabrik and fully server-rendered. /trailers lists every
 * model, 10 per page, paginated with ?limitstart1=0,10,20…; each model's
 * detail page is a Fabrik read-only form whose fields carry stable classes
 * (fb_el_models___tons_ro, ___capacity_ro, ___deck_length_ro,
 * ___deck_height_ro, ___num_axles_ro, ___trailer_type_ro, ___suspension_ro,
 * ___feature_photo_ro …).
 *
 * product_type comes from the page's Trailer Type field. The URL slugs are
 * NOT reliable: every model's rowid slug says "rear-loading-tag-along-trailer",
 * detachables included.
 *
 * Usage:
 *   node scripts/scrape-mfr-rogers.mjs
 *   node scripts/scrape-mfr-rogers.mjs --dry-run   # no DB writes, no keys needed
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
  parseDeckHeight,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'rogers';
const MANUFACTURER_INFO = {
  name: 'Rogers Brothers',
  canonical_name: 'Rogers Brothers Corporation',
  website: 'https://www.rogerstrailers.com',
  headquarters: 'Albion, PA',
  country: 'USA',
  short_description:
    'Rogers Brothers Corporation builds ROGERS lowbed heavy-haul trailers in Albion, Pennsylvania, including detachable gooseneck, fixed gooseneck and tag-along models.',
  name_variations: ['Rogers', 'ROGERS', 'Rogers Brothers', 'Rogers Brothers Corporation', 'Rogers Trailers'],
};
const WEBSITE = MANUFACTURER_INFO.website;
const LIST_URL = `${WEBSITE}/trailers`;
const PAGE_SIZE = 10;
const MAX_PAGES = 20;
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

/**
 * product_type, gooseneck_type and the name label from the Trailer Type field.
 * "Specialized", "Detachable Rear" and "TVT" say nothing about the trailer by
 * themselves; for those the Trailer Use field does ("Electric Transformer",
 * "Coil Trailer", "Modular", "Front Loading: Detachable Gooseneck").
 */
function classify(trailerType, trailerUse) {
  const type = (trailerType || '').toLowerCase();
  const use = (trailerUse || '').toLowerCase();
  const special = /coil/.test(use)
    ? { type: 'other', label: 'Coil Trailer' }
    : /transformer/.test(use)
      ? { type: 'other', label: 'Transformer Trailer' }
      : null;

  if (/tag[\s-]*a[\s-]*long/.test(type)) return { type: 'tag-along', gooseneck: null, label: 'Tag-Along' };
  if (/detachable gooseneck/.test(type)) {
    return { type: 'rgn', gooseneck: 'hydraulic-detachable', label: 'Detachable Gooseneck' };
  }
  if (/fixed gooseneck|machinery hauler|tvt/.test(type)) {
    const label = /machinery hauler/.test(type) ? 'Machinery Hauler' : 'Fixed Gooseneck';
    if (special) return { type: 'other', gooseneck: 'fixed', label: `${label} ${special.label}` };
    return { type: 'lowboy', gooseneck: 'fixed', label };
  }

  // Specialized / Detachable Rear / anything new: go by the use.
  if (special) return { ...special, gooseneck: null };
  if (/modular/.test(use)) return { type: 'modular', gooseneck: null, label: 'Modular' };
  if (/detachable gooseneck/.test(use)) {
    return { type: 'rgn', gooseneck: 'hydraulic-detachable', label: 'Detachable Gooseneck' };
  }
  if (/fixed gooseneck/.test(use)) return { type: 'lowboy', gooseneck: 'fixed', label: 'Fixed Gooseneck' };
  if (/tag/.test(use)) return { type: 'tag-along', gooseneck: null, label: 'Tag-Along' };
  return { type: 'other', gooseneck: null, label: cleanText(trailerType || 'Trailer') };
}

/** "25'-0" (7.6-meter)" → 25; "28'-6"" → 28.5 */
function parseFeetInches(str) {
  const m = (str || '').match(/(\d+(?:\.\d+)?)\s*'\s*-?\s*(?:(\d+(?:\.\d+)?)\s*")?/);
  if (!m) return null;
  return Math.round((parseFloat(m[1]) + (m[2] ? parseFloat(m[2]) / 12 : 0)) * 100) / 100;
}

/** Imperial part of "20" (0.5-meter)" → '20"' */
function imperial(value) {
  return cleanText((value || '').replace(/\s*\([^)]*(meter|tonne|kilogram|kg|mm)[^)]*\)/gi, ''));
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

/** Every model detail URL across the paginated /trailers list. */
async function discoverProducts() {
  const found = new Map(); // row id → url
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `${LIST_URL}?resetfilters=0&clearordering=0&clearfilters=0&limitstart1=${page * PAGE_SIZE}`;
    console.log(`  List page ${page + 1}: ${url}`);
    const html = await fetchHtml(url);
    if (!html) break;
    const $ = cheerio.load(html);
    let added = 0;
    $('a[href*="/trailers/details/1/"]').each((_, a) => {
      const href = $(a).attr('href');
      const m = href && href.match(/\/trailers\/details\/1\/(\d+)/);
      if (!m || found.has(m[1])) return;
      found.set(m[1], new URL(href, WEBSITE).href);
      added++;
    });
    console.log(`    ${added} new model(s)`);
    if (added === 0) break;
    await sleep(randomDelay());
  }
  return [...found.values()];
}

async function scrapeProductPage(url) {
  const html = await fetchHtml(url);
  if (!html) return null;
  const $ = cheerio.load(html);

  const el = (field) => $(`.fb_el_models___${field}_ro .fabrikElement`).first();
  const field = (name) => cleanText(el(name).text()) || null;

  const modelName = field('model_name');
  if (!modelName) {
    console.warn(`    No model name on ${url}, skipping`);
    return null;
  }

  const bullets = el('standard_feature_bullets')
    .find('li')
    .map((_, li) => cleanText($(li).text()))
    .get()
    .filter(Boolean);

  const photo = el('feature_photo').find('img').first();
  const photoSrc = photo.attr('src');
  const images = [];
  if (photoSrc && /\.(jpe?g|png|webp)$/i.test(photoSrc.split('?')[0])) {
    images.push({ url: new URL(photoSrc, WEBSITE).href, alt_text: `ROGERS ${modelName} trailer`, source_url: url });
  }

  return {
    url,
    modelName,
    modelCode: field('model_code'),
    tons: field('tons'),
    capacity: field('capacity'),
    trailerType: field('trailer_type'),
    trailerUse: field('trailer_use'),
    series: field('model_series'),
    deckStyle: field('deck_style'),
    deckLength: field('deck_length'),
    deckHeight: field('deck_height'),
    deckWidth: field('deck_width'),
    loadConWeight: field('load_con_weight'),
    loadConLength: field('load_con_length'),
    axles: field('num_axles'),
    suspension: field('suspension'),
    axleType: field('axle_type'),
    tires: field('tires'),
    wheels: field('wheels'),
    brakes: field('brakes'),
    photoDescription: field('feature_photo_description'),
    bullets,
    images,
  };
}

function buildProduct(d) {
  const { type, gooseneck, label } = classify(d.trailerType, d.trailerUse);

  const tons = parseInt(d.tons || '', 10) || parseInt((d.capacity || '').match(/([\d.]+)\s*-?\s*ton/i)?.[1] || '', 10) || null;
  const axles = parseInt((d.axles || '').match(/(\d+)/)?.[1] || '', 10) || null;

  // "CR50GR 50-Ton Detachable Gooseneck" — the bare model code reads as a
  // part number on a card.
  const name = cleanText(`${d.modelName} ${tons ? `${tons}-Ton ` : ''}${label}`);

  // Some rows carry an impossible loaded deck height ("372\" (9.4-meter)" on
  // a 25-ton machinery hauler). Lowboy decks sit under ~6 ft; anything over
  // 100" is a data-entry error, so neither the column nor the spec gets it.
  const deckHeight = parseDeckHeight(imperial(d.deckHeight));
  const deckHeightOk = deckHeight && deckHeight <= 100 ? deckHeight : null;

  const description = [
    d.photoDescription,
    d.bullets.length ? `Standard features: ${d.bullets.join('; ')}.` : null,
  ]
    .filter(Boolean)
    .join('\n\n') || null;

  const specs = [];
  const add = (category, key, value) => {
    const v = imperial(value);
    if (v) specs.push({ category, key, value: v, unit: null });
  };
  add('Capacity', 'Capacity', d.capacity);
  add('Capacity', 'Concentrated Load', d.loadConWeight);
  add('Capacity', 'Concentrated Load Length', d.loadConLength);
  add('Dimensions', 'Deck Length', d.deckLength);
  if (deckHeightOk) add('Dimensions', 'Loaded Deck Height', d.deckHeight);
  add('Dimensions', 'Deck Width', d.deckWidth);
  add('Dimensions', 'Deck Style', d.deckStyle?.replace(/^"|"$/g, ''));
  add('Running Gear', 'Axles', d.axles);
  add('Running Gear', 'Axle Type', d.axleType);
  add('Running Gear', 'Suspension', d.suspension);
  add('Running Gear', 'Tires', d.tires);
  add('Running Gear', 'Wheels', d.wheels);
  add('Running Gear', 'Brakes', d.brakes);
  add('General', 'Trailer Type', d.trailerType);
  add('General', 'Trailer Use', d.trailerUse);

  return {
    product: {
      name,
      series: d.series,
      model_number: d.modelName,
      tagline: null,
      description,
      short_description: d.photoDescription || null,
      product_type: type,
      tonnage_min: tons,
      tonnage_max: tons,
      deck_height_inches: deckHeightOk,
      deck_length_feet: parseFeetInches(d.deckLength),
      overall_length_feet: null,
      axle_count: axles,
      gooseneck_type: gooseneck,
      empty_weight_lbs: null,
      gvwr_lbs: null,
      concentrated_capacity_lbs: d.loadConWeight ? parseWeight(d.loadConWeight) : null,
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
    console.log('Step 1: Discovering models from the trailer list...\n');
    const urls = await discoverProducts();
    if (urls.length === 0) {
      console.error('  No models discovered! Aborting.');
      return;
    }
    console.log(`\n  ${urls.length} model pages to scrape\n`);

    console.log('Step 2: Scraping model pages...');
    const built = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`  [${i + 1}/${urls.length}] ${url}`);
      try {
        const data = await scrapeProductPage(url);
        if (data) {
          stats.scraped++;
          built.push({ data, ...buildProduct(data) });
          console.log(`    ${data.modelName} | Type: ${data.trailerType || '—'} | Use: ${data.trailerUse || '—'}`);
        } else {
          stats.errors++;
        }
      } catch (err) {
        console.error(`    Error scraping ${url}: ${err.message}`);
        stats.errors++;
      }
      if (i < urls.length - 1) await sleep(randomDelay());
    }

    // Rogers lists a few model codes twice in different builds (SP55PL with a
    // 25' and a 26' deck). The upsert key is the slugified name, so the second
    // would overwrite the first; tell them apart by deck length, then by the
    // factory model code.
    const byName = new Map();
    for (const b of built) byName.set(b.product.name, [...(byName.get(b.product.name) || []), b]);
    for (const group of byName.values()) {
      if (group.length < 2) continue;
      const lengths = new Set(group.map((b) => b.product.deck_length_feet));
      for (const b of group) {
        const deck = b.product.deck_length_feet;
        b.product.name =
          lengths.size === group.length && deck
            ? `${b.product.name} (${deck}' Deck)`
            : `${b.product.name} (${b.data.modelCode || b.data.url.match(/details\/1\/(\d+)/)?.[1]})`;
      }
    }

    console.log(`\nStep 3: Upserting ${built.length} models...`);
    for (const { product, specs, data } of built) {
      try {
        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          stats.errors++;
          continue;
        }
        await upsertProductImages(supabase, productId, data.images);
        await upsertProductSpecs(supabase, productId, specs);
        stats.upserted++;
      } catch (err) {
        console.error(`    Error upserting ${product.name}: ${err.message}`);
        stats.errors++;
      }
    }

    console.log('\nStep 4: Updating product count...');
    const count = await updateProductCount(supabase, manufacturerId);
    console.log(`  Active products: ${count}`);
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    stats.errors++;
  }

  printSummary(MANUFACTURER_INFO.name, stats);
}

main().catch(console.error);

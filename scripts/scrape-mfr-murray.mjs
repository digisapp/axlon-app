// @ts-nocheck
/**
 * Murray Trailers Product Catalog Scraper
 *
 * Scrapes murraytrailer.com (Stockton, CA; a division of Hogan Mfg., Inc.;
 * founded 1946) for its low-profile removable-gooseneck low-bed trailers and
 * upserts them into the manufacturer_products tables.
 *
 * The model pages are listed in the site's "Trailers" menu. Each has an H1
 * model name, an H2 subtitle ("Low Profile 32-Ton, 8-Tire Trailer"), a
 * STANDARD FEATURES "Key: value" list, an OPTIONAL FEATURES list, PDF
 * brochure/spec-sheet links and a photo gallery. The Magnum, M2000 and M3000
 * appear only as brochure PDFs on the home page, so they are not scraped.
 *
 * Usage:
 *   node scripts/scrape-mfr-murray.mjs            # live (needs service-role key)
 *   node scripts/scrape-mfr-murray.mjs --dry-run  # print what would be upserted
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
import { createPoliteFetcher, textOf, absoluteUrl, parseInches, parseFeet, parsePounds } from './lib/polite-fetch.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MANUFACTURER_SLUG = 'murray';
const MANUFACTURER_NAME = 'Murray Trailers';
const BASE_URL = 'https://www.murraytrailer.com';
const MAX_IMAGES = 15;
const MANUFACTURER_INFO = {
  name: 'Murray Trailers',
  canonical_name: 'Murray Trailers',
  website: BASE_URL,
  headquarters: 'Stockton, California',
  country: 'USA',
  short_description:
    'California builder of low-profile removable-gooseneck low-bed trailers since 1946, now a division of Hogan Mfg., Inc.',
  name_variations: ['murray', 'murray trailer', 'murray trailers', 'harley murray', 'hogan murray'],
};

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

/** Model pages: the links under the "Trailers" item of the main menu. */
async function discoverModels(fetcher) {
  const page = await fetcher.html(`${BASE_URL}/`);
  if (!page) return null;
  const { $ } = page;
  const urls = new Set();
  $('li').each((_, li) => {
    const $li = $(li);
    const label = textOf($li.children('a').first());
    if (!/^trailers$/i.test(label)) return;
    $li.find('ul a[href]').each((_, a) => {
      const url = absoluteUrl($(a).attr('href'), BASE_URL);
      if (url && new URL(url).host.endsWith('murraytrailer.com')) urls.add(url.split('#')[0]);
    });
  });
  return [...urls];
}

// ---------------------------------------------------------------------------
// Model page parsing
// ---------------------------------------------------------------------------

/** The <li> items of the list that follows a heading ("STANDARD FEATURES"). */
function listAfterHeading($, headingRe) {
  const $h = $('h1, h2, h3, h4, h5')
    .filter((_, h) => headingRe.test(textOf($(h))))
    .first();
  if (!$h.length) return [];
  // The list is the next <ul> in document order after the heading.
  let found = null;
  let passed = false;
  $('body *').each((_, el) => {
    if (found) return false;
    if (el === $h[0]) passed = true;
    else if (passed && el.tagName === 'ul') found = el;
    return undefined;
  });
  return found ? $(found).children('li').toArray().map((li) => textOf($(li))).filter(Boolean) : [];
}

function fullSize(url) {
  return url.replace(/-\d+x\d+(?=\.(jpe?g|png|webp)$)/i, '');
}

function readImages($, pageUrl) {
  const out = [];
  const seen = new Set();
  $('.entry-content img').each((_, img) => {
    const $img = $(img);
    const href = $img.closest('a').attr('href') || '';
    const raw = /\.(jpe?g|png|webp)$/i.test(href) ? href : $img.attr('src');
    const url = absoluteUrl(raw, pageUrl);
    if (!url || isLogoUrl(url) || !/\/wp-content\/uploads\//.test(url)) return;
    const key = fullSize(url);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ url, alt: cleanText($img.attr('alt') || '') });
  });
  return out.slice(0, MAX_IMAGES);
}

function sentenceCase(text) {
  if (!text || text !== text.toUpperCase()) return text;
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function specCategory(key) {
  if (/capacity|net load|gvwr|gawr/i.test(key)) return 'Capacity';
  if (/weight/i.test(key)) return 'Weight';
  if (/axle|suspension|brake|tire|wheel|expando/i.test(key)) return 'Running Gear';
  if (/gooseneck|neck|kingpin/i.test(key)) return 'Gooseneck';
  if (/length|width|height|loading|angle/i.test(key)) return 'Dimensions';
  if (/light/i.test(key)) return 'Electrical';
  return 'Construction';
}

function buildProduct(url, page) {
  const { $ } = page;
  const name = cleanText(textOf($('h1').first()));
  if (!name) return null;
  const h2s = $('h2')
    .toArray()
    .map((h) => textOf($(h)))
    .filter((t) => t && !/photos$/i.test(t));
  const subtitle = h2s[0] || null;
  const slogan = h2s[1] ? sentenceCase(h2s[1]) : null;

  const standard = listAfterHeading($, /^standard features$/i);
  const optional = listAfterHeading($, /^optional features$/i);

  const specs = [];
  const facts = {};
  for (const line of standard) {
    const m = /^([^:]{2,40}):\s*(.+)$/.exec(line);
    if (!m) continue;
    const key = cleanText(m[1]);
    const value = cleanText(m[2]).replace(/\*+$/, '').trim();
    if (!(key.toLowerCase() in facts)) facts[key.toLowerCase()] = value;
    specs.push({ category: specCategory(key), key, value, unit: null });
  }
  for (const item of optional) {
    specs.push({ category: 'Options', key: item.slice(0, 80), value: 'Optional', unit: null });
  }
  $('a[href$=".pdf"]').each((_, a) => {
    const label = textOf($(a));
    const href = absoluteUrl($(a).attr('href'), url);
    if (href && /spec sheet|brochure/i.test(label)) {
      specs.push({ category: 'Documents', key: `${label} (PDF)`, value: href, unit: null });
    }
  });

  // Tonnage: the Capacity / Permitted NET Load row ("32 Tons", "CA, NV ... – 46 Tons"),
  // else the subtitle ("Low Profile 45-Ton, 3-Axle Trailer").
  const capText = facts['capacity'] || facts['permitted net load'] || subtitle || '';
  const tonMatch = /(\d+)\s*-?\s*tons?\b/i.exec(capText) || /(\d+)\s*-?\s*tons?\b/i.exec(subtitle || '');
  const tons = tonMatch ? parseInt(tonMatch[1], 10) : null;

  // Axles: "2 Axles at 20,000 lbs." / "2 each, ..." / subtitle "7-Axle Combination".
  const axleText = facts['axles'] || '';
  const axleMatch =
    /^(\d+)\s*(?:axles?\b|each\b)/i.exec(axleText) || /(\d+)[\s-]axle/i.exec(`${subtitle || ''} ${name}`);

  // "43'-4" with standard 21'-6" deck, gooseneck, & tail" / "61' with standard 20' deck"
  const lengthText = facts['overall length'] || facts['length'] || '';
  const deckMatch = /standard\s+(\d+\s*['’](?:\s*-?\s*\d+\s*["”])?)\s*deck/i.exec(lengthText);

  const neck = facts['goosenecks'] || facts['wide gooseneck'] || '';
  const gooseneck = /mechanical\s+removable|mechanical\s+detach/i.test(neck)
    ? 'mechanical-detachable'
    : /hydraulic/i.test(neck)
      ? 'hydraulic-detachable'
      : /removable|detach/i.test(neck)
        ? 'detachable'
        : null;

  const images = readImages($, url).map((img) => ({
    url: img.url,
    alt_text: img.alt || `Murray ${name}`,
    source_url: url,
  }));

  return {
    product: {
      name,
      series: null,
      model_number: null,
      tagline: subtitle,
      description: [subtitle, slogan].filter(Boolean).join('. ') || null,
      short_description: subtitle,
      // Removable-gooseneck low beds throughout the range.
      product_type: gooseneck ? 'rgn' : 'lowboy',
      tonnage_min: tons,
      tonnage_max: tons,
      deck_height_inches: parseInches(facts['deck height']),
      deck_length_feet: deckMatch ? parseFeet(deckMatch[1]) : null,
      overall_length_feet: parseFeet(lengthText),
      axle_count: axleMatch ? parseInt(axleMatch[1], 10) : null,
      gooseneck_type: gooseneck,
      empty_weight_lbs: parsePounds((/([\d,]{4,})\s*lbs/i.exec(facts['base trailer weight'] || '') || [])[1]),
      gvwr_lbs: parsePounds(facts['gvwr']),
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

  const urls = await discoverModels(fetcher);
  if (!urls || urls.length === 0) {
    console.error('No model links found in the Trailers menu (blocked or changed). Nothing scraped.');
    stats.errors++;
    printSummary(MANUFACTURER_NAME, stats);
    process.exitCode = 1;
    return;
  }
  console.log(`Found ${urls.length} model pages\n`);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] ${url}`);
    try {
      const page = await fetcher.html(url);
      if (!page) {
        stats.errors++;
        continue;
      }
      const built = buildProduct(url, page);
      if (!built) {
        console.warn(`  [SKIP] No model name on ${url}`);
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
      console.error(`  [ERROR] ${url}: ${err.message}`);
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

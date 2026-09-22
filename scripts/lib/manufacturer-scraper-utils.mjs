// @ts-nocheck
/**
 * Shared utilities for manufacturer product catalog scrapers.
 * Used by scripts/scrape-mfr-*.mjs to scrape manufacturer websites
 * and upsert products into the manufacturer_products table.
 */

import crypto from 'crypto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { downloadAndStoreManufacturerImage, isSupabaseStorageUrl } from './rehost-images.mjs';

puppeteer.use(StealthPlugin());

/**
 * Create a Puppeteer browser instance with stealth settings
 */
export async function createBrowser(headless = 'new') {
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080',
    ],
  });

  return browser;
}

/**
 * Create a new page with standard settings
 */
export async function createPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  return page;
}

/**
 * Get a Supabase client with service role key for write access
 */
export function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Get manufacturer ID by slug
 */
export async function getManufacturerId(supabase, slug) {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    throw new Error(`Manufacturer not found: ${slug}`);
  }
  return data.id;
}

/**
 * Upsert a manufacturer product. Returns the product ID.
 */
/**
 * Names that mean "the scraper followed a dead link", not "this is a trailer".
 *
 * Six of these reached production and rendered as real product cards on the
 * marketplace and on the lead-gen microsites ("Page Not Found", "404",
 * "Sorry About That", "Oops!Page Not Found" from Felling, Faymonville, Globe,
 * Kaufman and Etnyre). A scraper that follows a stale link gets the site's 404
 * page, reads its <h1>, and upserts it like any other product — nothing
 * downstream can tell the difference, because by then it is just a row.
 *
 * Matched on the whole trimmed name, not as a substring: a real model could
 * legitimately contain "404" (a part number) or the word "error".
 */
const DEAD_PAGE_NAMES = [
  /^(oops[!,.]?\s*)?page\s*not\s*found$/i,
  /^(error\s*)?404(\s*[-–—:]?\s*(page\s*)?not\s*found)?$/i,
  /^not\s*found$/i,
  /^sorry\s*about\s*that[!.]?$/i,
  /^(page\s*)?(unavailable|does\s*not\s*exist)$/i,
  /^(we(&#39;|')?re\s*sorry|oops)[!.]?$/i,
  /^(access\s*denied|forbidden|just\s*a\s*moment)[!.]?$/i,
  /^(untitled|coming\s*soon|under\s*construction)$/i,
];

/**
 * True when a scraped name looks like an error page rather than a product.
 * Exported so individual scrapers can skip early, before doing image work.
 */
export function isDeadPageName(name) {
  const trimmed = cleanText(name || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return true;
  return DEAD_PAGE_NAMES.some((re) => re.test(trimmed));
}

/**
 * Product types a name can state unambiguously.
 *
 * Half of the catalog rows whose name declares a type disagreed with the
 * stored product_type — tag-alongs, sliding-axle carriers and flatbeds all
 * filed under "lowboy", mostly from scrapers falling through to the default.
 * On a category microsite that puts a 20-ton tag-along at the top of a
 * heavy-haul lowboy grid.
 *
 * Only DISTINCT types are inferred here. lowboy / rgn / extendable overlap
 * (an RGN is a lowboy; extendable is a property) and are left to the scraper.
 * Whole-word patterns only: a loose "\bsd\b" once matched a side-dump
 * trailer's model code as a step deck.
 */
const NAME_TYPE_RULES = [
  // Bare "Tag" is a category claim too (XL's tag-along model is named
  // simply "XL Tag"); only "tag axle" — a lift axle — is excluded.
  ['tag-along',      /\btag[\s-]*a[\s-]*long\b|\btagalong\b|\btag\b(?!\s*axle)/i],
  ['traveling-axle', /\btravel+ing[\s-]*axle\b|\bslid(e|ing)[\s-]*axle\b|\brollback\b/i],
  ['double-drop',    /\bdouble[\s-]*drop\b/i],
  ['step-deck',      /\bstep[\s-]*deck\b|\bdrop[\s-]*deck\b|\bdrop[\s-]*flat\b/i],
  ['flatbed',        /\bflat[\s-]*bed\b/i],
  ['modular',        /\bmodular\b/i],
];

/**
 * The type the name states, or null when it states none of the distinct ones.
 * A detachable double drop is an RGN as much as a double drop, so a name that
 * also says detach/RGN yields null and the scraper's choice stands.
 */
export function inferProductTypeFromName(name) {
  const n = cleanText(name || '');
  if (!n) return null;
  if (/\b(detach\w*|rgn|removable\s+gooseneck)\b/i.test(n) && /\bdouble[\s-]*drop\b/i.test(n)) return null;
  for (const [type, re] of NAME_TYPE_RULES) {
    if (re.test(n)) return type;
  }
  return null;
}

export async function upsertProduct(supabase, manufacturerId, product) {
  // Refuse the row rather than letting a scraped 404 become a product. This
  // is the last common chokepoint before the database, so one check here
  // covers every manufacturer scraper.
  if (isDeadPageName(product.name)) {
    console.warn(`  Skipping "${product.name}" — looks like an error page, not a product (${product.source_url || 'no source url'})`);
    return null;
  }

  const slug = slugify(product.name);

  const row = {
    manufacturer_id: manufacturerId,
    name: product.name,
    slug,
    series: product.series || null,
    model_number: product.model_number || null,
    tagline: product.tagline || null,
    description: product.description || null,
    short_description: product.short_description || null,
    // A name that unambiguously states a distinct type wins over whatever the
    // scraper set — usually the 'lowboy' fallback, sometimes an explicit wrong
    // value. See inferProductTypeFromName for what counts as unambiguous.
    product_type: inferProductTypeFromName(product.name) || product.product_type || 'lowboy',
    tonnage_min: product.tonnage_min || null,
    tonnage_max: product.tonnage_max || null,
    deck_height_inches: product.deck_height_inches || null,
    deck_length_feet: product.deck_length_feet || null,
    overall_length_feet: product.overall_length_feet || null,
    axle_count: product.axle_count || null,
    gooseneck_type: product.gooseneck_type || null,
    empty_weight_lbs: product.empty_weight_lbs || null,
    gvwr_lbs: product.gvwr_lbs || null,
    concentrated_capacity_lbs: product.concentrated_capacity_lbs || null,
    msrp_low: product.msrp_low || null,
    msrp_high: product.msrp_high || null,
    source_url: product.source_url || null,
    last_scraped_at: new Date().toISOString(),
    is_active: true,
  };

  const { data, error } = await supabase
    .from('manufacturer_products')
    .upsert(row, { onConflict: 'manufacturer_id,slug' })
    .select('id')
    .single();

  if (error) {
    console.error(`  Error upserting product "${product.name}":`, error.message);
    return null;
  }

  return data.id;
}

/**
 * Upsert product images. Deletes existing images and re-inserts.
 *
 * Images are never hotlinked from the manufacturer's site: each one is
 * re-hosted into Supabase Storage (manufacturer-products/<productId>/...).
 * A copy already stored for the same original URL is reused, so re-running
 * a scraper does not re-download an unchanged catalog. Images that cannot
 * be fetched are dropped rather than inserted as a dead external link.
 */
export async function upsertProductImages(supabase, productId, images) {
  if (!images || images.length === 0) return;

  // Reuse stored copies keyed by the original external URL
  const { data: existing } = await supabase
    .from('manufacturer_product_images')
    .select('url, original_url')
    .eq('product_id', productId);
  const stored = new Map();
  for (const row of existing || []) {
    if (row.original_url && isSupabaseStorageUrl(row.url)) stored.set(row.original_url, row.url);
  }

  const rows = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img?.url || !img.url.startsWith('http')) continue;

    const hosted = isSupabaseStorageUrl(img.url)
      ? img.url
      : stored.get(img.url) ||
        (await downloadAndStoreManufacturerImage(supabase, img.url, productId, rows.length));
    if (!hosted) continue;

    rows.push({
      product_id: productId,
      url: hosted,
      original_url: isSupabaseStorageUrl(img.url) ? img.original_url || null : img.url,
      alt_text: img.alt_text || null,
      sort_order: rows.length,
      is_primary: rows.length === 0,
      source_url: img.source_url || null,
    });
  }

  // Replace the product's image set only once the new set is ready
  await supabase
    .from('manufacturer_product_images')
    .delete()
    .eq('product_id', productId);

  if (rows.length === 0) return;

  const { error } = await supabase
    .from('manufacturer_product_images')
    .insert(rows);

  if (error) {
    console.error(`  Error inserting images for product ${productId}:`, error.message);
  }
}

/**
 * Upsert product specs. Deletes existing specs and re-inserts.
 */
export async function upsertProductSpecs(supabase, productId, specs) {
  if (!specs || specs.length === 0) return;

  // Delete existing specs for this product
  await supabase
    .from('manufacturer_product_specs')
    .delete()
    .eq('product_id', productId);

  // Insert new specs. The table is UNIQUE(product_id, spec_category,
  // spec_key); a page that repeats a spec (common in tabbed spec sheets)
  // made the whole batch insert fail AFTER the delete above, leaving the
  // product with zero specs on every run. Keep the first occurrence.
  const seen = new Set();
  const rows = [];
  for (const spec of specs) {
    if (!spec?.category || !spec?.key) continue;
    const dedupeKey = spec.category + '::' + spec.key;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    rows.push({
      product_id: productId,
      spec_category: spec.category,
      spec_key: spec.key,
      spec_value: spec.value,
      spec_unit: spec.unit || null,
      sort_order: rows.length,
    });
  }
  if (rows.length === 0) return;

  const { error } = await supabase
    .from('manufacturer_product_specs')
    .insert(rows);

  if (error) {
    console.error(`  Error inserting specs for product ${productId}:`, error.message);
  }
}

/**
 * Update the product_count on the manufacturers table
 */
export async function updateProductCount(supabase, manufacturerId) {
  const { count } = await supabase
    .from('manufacturer_products')
    .select('*', { count: 'exact', head: true })
    .eq('manufacturer_id', manufacturerId)
    .eq('is_active', true);

  await supabase
    .from('manufacturers')
    .update({ product_count: count || 0 })
    .eq('id', manufacturerId);

  return count || 0;
}

/**
 * Sleep for a given number of milliseconds (default 300ms)
 */
/**
 * Sign a request the way src/lib/security/internal-auth.ts verifies it (v2:
 * the signature covers timestamp.METHOD.path, so it cannot be replayed
 * against a different endpoint). Kept in sync by a contract test that runs
 * this signer through the app's own verifier.
 */
export function signInternalRequest(method, path, secret = process.env.INTERNAL_API_SECRET) {
  if (!secret) throw new Error('INTERNAL_API_SECRET not configured');
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${method.toUpperCase()}.${path}`)
    .digest('hex');
  return { 'x-internal-signature': signature, 'x-internal-timestamp': timestamp };
}

/**
 * Tell the app the catalog changed so the microsites drop their cached grids.
 *
 * Without this a scrape rewrites hundreds of rows and the sites keep serving
 * the old catalog until the ten-minute TTL — or indefinitely for a key whose
 * background refresh was lost. Never throws: a failed notification must not
 * fail a successful scrape. Returns true when the app acknowledged.
 */
export async function notifyCatalogChanged() {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/+$/, '');
  const path = '/api/internal/revalidate';
  if (!appUrl || !process.env.INTERNAL_API_SECRET) {
    console.warn('  ⚠️  Skipping cache revalidation: NEXT_PUBLIC_APP_URL or INTERNAL_API_SECRET not set');
    return false;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${appUrl}${path}`, {
      method: 'POST',
      headers: signInternalRequest('POST', path),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`  ⚠️  Cache revalidation returned HTTP ${res.status}`);
      return false;
    }
    console.log('  🔄 Microsite caches revalidated');
    return true;
  } catch (error) {
    console.warn(`  ⚠️  Cache revalidation failed: ${error.message}`);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function sleep(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clean up text - trim whitespace, normalize spaces, remove excessive newlines
 */
export function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Parse a weight string like "19,560 lbs" or "20,100 lb" into a number
 */
export function parseWeight(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/([\d.]+)\s*(lbs?|pounds?|kg)?/i);
  if (!match) return null;
  const val = parseFloat(match[1]);
  if (match[2] && /kg/i.test(match[2])) {
    return Math.round(val * 2.20462); // Convert kg to lbs
  }
  return Math.round(val);
}

/**
 * Parse a tonnage string like "55 Ton" or "35-55 ton" into min/max
 */
export function parseTonnage(str) {
  if (!str) return { min: null, max: null };
  const cleaned = str.replace(/,/g, '').toLowerCase();

  // Range: "35-55 ton"
  const rangeMatch = cleaned.match(/([\d.]+)\s*[-–to]+\s*([\d.]+)\s*ton/i);
  if (rangeMatch) {
    return { min: Math.round(parseFloat(rangeMatch[1])), max: Math.round(parseFloat(rangeMatch[2])) };
  }

  // Single: "55 ton"
  const singleMatch = cleaned.match(/([\d.]+)\s*ton/i);
  if (singleMatch) {
    const val = Math.round(parseFloat(singleMatch[1]));
    return { min: val, max: val };
  }

  // Capacity in lbs: "110,000 lbs"
  const lbsMatch = cleaned.match(/([\d,]+)\s*lbs?/i);
  if (lbsMatch) {
    const lbs = parseFloat(lbsMatch[1].replace(/,/g, ''));
    const tons = Math.round(lbs / 2000);
    return { min: tons, max: tons };
  }

  return { min: null, max: null };
}

/**
 * Parse deck height from a string like "18 inches" or '22"' into a number
 */
export function parseDeckHeight(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/([\d.]+)\s*("|in|inch|inches)?/i);
  if (!match) return null;
  return parseFloat(match[1]);
}

/**
 * Parse a length string like "26' " or "52'8\"" into feet (decimal)
 */
export function parseLength(str) {
  if (!str) return null;
  // Handle feet and inches: 52'8"
  const ftInMatch = str.match(/([\d.]+)['']\s*([\d.]+)/);
  if (ftInMatch) {
    return parseFloat(ftInMatch[1]) + parseFloat(ftInMatch[2]) / 12;
  }
  // Handle feet only: 26'
  const ftMatch = str.match(/([\d.]+)\s*[''ft]/i);
  if (ftMatch) {
    return parseFloat(ftMatch[1]);
  }
  // Handle plain number
  const numMatch = str.match(/([\d.]+)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }
  return null;
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Print a header banner for a scraper
 */
export function printBanner(manufacturerName, website) {
  console.log(`\n🏭 Scraping ${manufacturerName} Product Catalog`);
  console.log(`   Source: ${website}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Print a summary after scraping
 */
export function printSummary(manufacturerName, stats) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Manufacturer: ${manufacturerName}`);
  console.log(`   Products scraped: ${stats.scraped || 0}`);
  console.log(`   Products upserted: ${stats.upserted || 0}`);
  console.log(`   Errors: ${stats.errors || 0}`);
  console.log('='.repeat(60) + '\n');
}

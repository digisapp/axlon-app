// @ts-nocheck
/**
 * Shared utilities for dealer inventory scraping.
 * Scrapes trailer/truck listings from dealer websites,
 * normalizes with AI, downloads images to Supabase Storage,
 * and upserts into the listings table with source tracking.
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import 'dotenv/config';

puppeteer.use(StealthPlugin());

// System user for scraped listings (admin@axlon.ai)
const AXLON_SYSTEM_USER_ID = '3d03c1b8-48d4-4aa2-a829-fb83cf0d082f';

// ─── Category map (slug → UUID) ───────────────────────────────────────────
const CATEGORY_MAP = {
  'trailers': 'eca4f79e-5f74-4e66-a4e3-07061080218a',
  'trucks': 'ca206c43-3d78-4ad0-a62a-2c75de52f4bb',
  'heavy-equipment': 'ac743680-65f3-4603-a5c2-b12d7a867cd2',
  'components-parts': 'c39cb9a5-cd31-4a51-9431-df346d6f4f16',
  'flatbed-trailers': 'eea4f8ae-8d83-447c-ae08-5258614abe5a',
  'lowboy-trailers': 'cbd04339-21be-48e3-a8dc-407b188bc806',
  'dump-trailers': '13846afc-003e-403c-87c3-6ba3a1578e3e',
  'cargo-trailers': 'b9fec317-1c71-4a82-9095-a58191c2c089',
  'gooseneck-trailers': '5d4fb5cc-9950-4070-97cc-a4148204dec3',
  'tilt-trailers': '9a6f6f58-f871-4d36-93ba-a6aa808585d2',
  'landscape-trailers': '37ee4564-868f-4d53-b26c-898670957d6c',
  'utility-trailers': 'a9aeba19-5c94-4ed4-b62b-dfcea4c1d0b4',
  'enclosed-trailers': 'b9fec317-1c71-4a82-9095-a58191c2c089',
  'car-hauler-trailers': 'a9aeba19-5c94-4ed4-b62b-dfcea4c1d0b4',
  'equipment-trailers': 'eea4f8ae-8d83-447c-ae08-5258614abe5a',
  'dry-van-trailers': 'f0bb6237-9d1f-44b3-9aa0-860f3f114419',
  'reefer-trailers': 'fcd08a53-704c-4d19-8f51-c157c913e6d0',
  'tank-trailers': '25724bf6-d1d0-4878-8c7c-62ea9b46d1a8',
  'step-deck-trailers': '099d8cf7-96d4-453d-9863-45b0bd5a4c9e',
  'end-dump-trailers': '3e875ac7-78db-4193-8a4d-c911fd6a0c7f',
  'side-dump-trailers': 'ddd5e12d-84c9-4f18-b050-8420a3c3386e',
  'horse-trailers': '053a7232-9199-466e-bcf6-efa2812d6412',
  'boat-trailers': 'f4efb460-6bd1-4d66-af4c-50616abb1c75',
};

// Default category fallback
const DEFAULT_CATEGORY_ID = 'eca4f79e-5f74-4e66-a4e3-07061080218a'; // Trailers

// ─── Supabase ──────────────────────────────────────────────────────────────

export function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ─── Browser / Page ────────────────────────────────────────────────────────

export async function createBrowser(headless = 'new') {
  return puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080',
    ],
  });
}

export async function createPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  return page;
}

// ─── Dealer Source Management ──────────────────────────────────────────────

/**
 * Get or create a dealer source record. Returns the dealer source ID.
 */
export async function ensureDealerSource(supabase, dealer) {
  const { data: existing } = await supabase
    .from('dealer_sources')
    .select('id')
    .eq('slug', dealer.slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('dealer_sources')
    .insert({
      name: dealer.name,
      slug: dealer.slug,
      website: dealer.website,
      inventory_url: dealer.inventoryUrl,
      scrape_method: dealer.scrapeMethod || 'auto',
      scrape_config: dealer.scrapeConfig || {},
      contact_name: dealer.contactName || null,
      contact_phone: dealer.contactPhone || null,
      contact_email: dealer.contactEmail || null,
      location_city: dealer.city || null,
      location_state: dealer.state || null,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create dealer source "${dealer.name}": ${error.message}`);
  return data.id;
}

/**
 * Update dealer source after a scrape run.
 */
export async function updateDealerSourceStats(supabase, dealerSourceId, count) {
  await supabase
    .from('dealer_sources')
    .update({
      last_scraped_at: new Date().toISOString(),
      last_scrape_count: count,
      updated_at: new Date().toISOString(),
    })
    .eq('id', dealerSourceId);
}

// ─── Deduplication ─────────────────────────────────────────────────────────

/**
 * Check if a listing already exists by source_dealer_id + source_listing_id.
 * Returns the existing listing ID if found, null otherwise.
 */
export async function findExistingListing(supabase, dealerSourceId, sourceListingId) {
  if (!sourceListingId) return null;
  const { data } = await supabase
    .from('listings')
    .select('id')
    .eq('source_dealer_id', dealerSourceId)
    .eq('source_listing_id', sourceListingId)
    .single();
  return data?.id || null;
}

// ─── AI Normalization ──────────────────────────────────────────────────────

const CATEGORY_SLUGS = Object.keys(CATEGORY_MAP);

/**
 * Use xAI (Grok) to normalize a raw scraped listing into structured fields.
 */
export async function normalizeWithAI(rawListing) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.warn('  ⚠ XAI_API_KEY not set, skipping AI normalization');
    return rawListing;
  }

  const prompt = `You are a trailer/truck listing normalizer. Given raw scraped data, extract and return a clean JSON object.

Raw listing data:
${JSON.stringify(rawListing, null, 2)}

Return a JSON object with these fields (use null for unknown):
{
  "title": "Clean title like '2025 Big Tex 22GN 40ft Gooseneck Trailer'",
  "description": "Clean 2-3 sentence description of the trailer/truck",
  "year": 2025,
  "make": "Big Tex",
  "model": "22GN",
  "condition": "new" or "used",
  "price": 12500 (number, no $ or commas, null if unknown),
  "price_type": "fixed" or "call_for_price",
  "category_slug": "one of: ${CATEGORY_SLUGS.join(', ')}",
  "specs": { "key": "value pairs for GVWR, axles, deck length, etc." },
  "axle_count": 2,
  "gvwr": 14000,
  "payload_capacity": 10000
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const resp = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!resp.ok) {
      console.warn(`  ⚠ AI normalization failed: ${resp.status}`);
      return rawListing;
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return rawListing;

    // Parse JSON from response (handle possible markdown wrapping)
    const jsonStr = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    const normalized = JSON.parse(jsonStr);
    return { ...rawListing, ...normalized };
  } catch (err) {
    console.warn(`  ⚠ AI normalization error: ${err.message}`);
    return rawListing;
  }
}

// ─── Image Pipeline ────────────────────────────────────────────────────────

// downloadAndStoreImage lives in rehost-images.mjs (shared with lightweight
// scrapers that must not pull in puppeteer); re-exported for back-compat.
import { downloadAndStoreImage, insertRehostedImages } from './rehost-images.mjs';
export { downloadAndStoreImage, insertRehostedImages };

// ─── Listing Upsert ────────────────────────────────────────────────────────

/**
 * Create or update a listing from scraped data.
 * Returns { id, action: 'created' | 'updated' | 'skipped' }
 */
/**
 * Compute a STABLE per-unit identifier for dedup. The title must not be the
 * primary key here: titles are AI-normalized (temp 0.1, not deterministic), so
 * keying on the title slug produces duplicates across runs and collapses
 * distinct same-title fleet units into one. Prefer real per-unit identifiers;
 * only fall back to the title slug when the listing carries no stable id.
 */
export function stableSourceListingId(listing) {
  if (listing.source_listing_id) return String(listing.source_listing_id);
  if (listing.sourceId) return String(listing.sourceId);
  if (listing.source_url) {
    return 'url:' + crypto.createHash('sha1').update(listing.source_url).digest('hex').slice(0, 16);
  }
  if (listing.vin) return 'vin:' + String(listing.vin).trim().toUpperCase();
  if (listing.stock_number) return 'stock:' + String(listing.stock_number).trim().toLowerCase();
  console.warn(`  ⚠ No stable id for "${listing.title}" — falling back to title slug (dedup may drift across runs)`);
  return slugify(listing.title);
}

// Once a dealer has claimed their scraped inventory (dealer_sources.claimed_by),
// every unit the scraper adds afterwards must land in their account rather
// than the admin placeholder. Cached per run — the owner doesn't change mid-scrape.
const ownerCache = new Map();
async function listingOwnerFor(supabase, dealerSourceId) {
  if (ownerCache.has(dealerSourceId)) return ownerCache.get(dealerSourceId);
  const { data } = await supabase
    .from('dealer_sources')
    .select('claimed_by')
    .eq('id', dealerSourceId)
    .maybeSingle();
  const owner = data?.claimed_by || AXLON_SYSTEM_USER_ID;
  ownerCache.set(dealerSourceId, owner);
  return owner;
}

export async function upsertListing(supabase, dealerSourceId, listing) {
  const sourceListingId = stableSourceListingId(listing);
  const ownerId = await listingOwnerFor(supabase, dealerSourceId);

  // Check for existing
  const existingId = await findExistingListing(supabase, dealerSourceId, sourceListingId);
  if (existingId) {
    return { id: existingId, action: 'skipped' };
  }

  const categoryId = CATEGORY_MAP[listing.category_slug] || DEFAULT_CATEGORY_ID;

  const row = {
    user_id: ownerId,
    title: listing.title,
    description: listing.description || listing.ai_description || null,
    price: listing.price || null,
    price_type: listing.price_type || (listing.price ? 'fixed' : 'call_for_price'),
    condition: listing.condition || 'new',
    year: listing.year || null,
    make: listing.make || null,
    model: listing.model || null,
    category_id: categoryId,
    specs: listing.specs || {},
    axle_count: listing.axle_count || null,
    gvwr: listing.gvwr || null,
    payload_capacity: listing.payload_capacity || null,
    status: 'active',
    listing_type: 'sale',
    source_dealer_id: dealerSourceId,
    source_url: listing.source_url || null,
    source_listing_id: sourceListingId,
    city: listing.city || null,
    state: listing.state || null,
    country: 'US',
    stock_number: listing.stock_number || null,
    vin: listing.vin || null,
    published_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('listings')
    .insert(row)
    .select('id')
    .single();

  if (error) {
    // Handle unique constraint (dedup race condition)
    if (error.code === '23505') {
      return { id: null, action: 'skipped' };
    }
    console.error(`  ✗ Error inserting listing "${listing.title}":`, error.message);
    return { id: null, action: 'error' };
  }

  return { id: data.id, action: 'created' };
}

/**
 * Insert listing images into listing_images table.
 */
export async function insertListingImages(supabase, listingId, imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return;

  const rows = imageUrls.map((url, i) => ({
    listing_id: listingId,
    url,
    thumbnail_url: url, // Same URL for now; could generate thumbnails later
    is_primary: i === 0,
    sort_order: i,
  }));

  const { error } = await supabase
    .from('listing_images')
    .insert(rows);

  if (error) {
    console.error(`  ✗ Error inserting images for listing ${listingId}:`, error.message);
  }
}

// ─── Full Pipeline ─────────────────────────────────────────────────────────

/**
 * Process a single scraped listing through the full pipeline:
 * 1. AI normalization
 * 2. Dedup check
 * 3. Upsert listing
 * 4. Download + store images
 * 5. Insert image records
 *
 * Returns { id, action }
 */
export async function processListing(supabase, dealerSourceId, rawListing) {
  // 1. Normalize with AI
  const normalized = await normalizeWithAI(rawListing);

  // 2-3. Upsert (includes dedup check)
  const { id, action } = await upsertListing(supabase, dealerSourceId, normalized);

  if (!id || action === 'skipped') {
    return { id, action };
  }

  // 4-5. Download images and store
  const imageUrls = rawListing.images || [];
  if (imageUrls.length > 0) {
    const storedUrls = [];
    for (let i = 0; i < Math.min(imageUrls.length, 10); i++) {
      const storedUrl = await downloadAndStoreImage(supabase, imageUrls[i], id, i);
      if (storedUrl) storedUrls.push(storedUrl);
    }

    if (storedUrls.length > 0) {
      await insertListingImages(supabase, id, storedUrls);
    }
  }

  return { id, action };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
}

export function printBanner(dealerName, website) {
  console.log(`\n🏪 Scraping ${dealerName} Inventory`);
  console.log(`   Source: ${website}`);
  console.log('='.repeat(60) + '\n');
}

export function printSummary(dealerName, stats) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Dealer: ${dealerName}`);
  console.log(`   Found: ${stats.found || 0}`);
  console.log(`   Created: ${stats.created || 0}`);
  console.log(`   Skipped (existing): ${stats.skipped || 0}`);
  console.log(`   Errors: ${stats.errors || 0}`);
  console.log('='.repeat(60) + '\n');
}

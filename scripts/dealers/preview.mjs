#!/usr/bin/env node
// @ts-nocheck
/**
 * Read-only preview of a dealer adapter — no database, no Supabase.
 *
 *   node scripts/dealers/preview.mjs <slug> [--city X --state YY] [--json out.json]
 *
 * Imports scripts/dealers/<slug>.mjs, calls fetchListings({city, state}),
 * and prints the count, three sample listings, the lowboy-family count and
 * basic data-quality tallies (missing price/VIN/stock, duplicate ids).
 */

import { writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import { isLowboyFamily } from './_lib.mjs';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

if (!slug) {
  console.error('usage: node scripts/dealers/preview.mjs <slug> [--city X --state YY] [--json out.json]');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const adapter = await import(pathToFileURL(path.join(here, `${slug}.mjs`)).href);
const dealer = { slug, city: opt('city') || null, state: opt('state') || null };

const started = Date.now();
let listings;
try {
  listings = await adapter.fetchListings(dealer, { log: (m) => console.log(m) });
} catch (err) {
  console.error(`\n✖ ${slug}: ${err.blocked ? 'BLOCKED — ' : ''}${err.message}`);
  process.exit(2);
}

const trunc = (s, n = 220) => (s && s.length > n ? `${s.slice(0, n)}…` : s);
const lowboys = listings.filter(isLowboyFamily);
const ids = listings.map((l) => l.source_listing_id);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);

console.log(`\n${slug}: ${listings.length} listings in ${((Date.now() - started) / 1000).toFixed(1)}s`);
for (const l of listings.slice(0, 3)) {
  console.log(JSON.stringify({ ...l, description: trunc(l.description), images: [`${l.images.length} images`, ...l.images.slice(0, 2)] }, null, 2));
}
console.log(`\nlowboy family: ${lowboys.length}`);
for (const l of lowboys) console.log(`  - ${l.title} | ${l.price ?? 'call'} | ${l.city}, ${l.state} | ${l.source_url}`);
console.log('\nquality:', {
  no_price: listings.filter((l) => l.price == null).length,
  no_vin: listings.filter((l) => !l.vin).length,
  no_stock: listings.filter((l) => !l.stock_number).length,
  no_year: listings.filter((l) => !l.year).length,
  no_images: listings.filter((l) => !l.images?.length).length,
  new: listings.filter((l) => l.condition === 'new').length,
  used: listings.filter((l) => l.condition === 'used').length,
  duplicate_ids: dupIds,
  missing_location: listings.filter((l) => !l.city || !l.state).length,
});

const out = opt('json');
if (out) {
  writeFileSync(out, JSON.stringify(listings, null, 2));
  console.log(`wrote ${out}`);
}

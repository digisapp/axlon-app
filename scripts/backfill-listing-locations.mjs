#!/usr/bin/env node
/**
 * Fill city/state on scraped listings from their dealer source.
 *
 * Dealer scrapers never captured a location, so 389 of the 918 active
 * listings had no state — invisible to the search map and location filters.
 * Every one of them belongs to a dealer_sources row that does carry a city
 * and state, which is the best available answer (the unit sits on that
 * dealer's lot).
 *
 *   node scripts/backfill-listing-locations.mjs          # dry run
 *   node scripts/backfill-listing-locations.mjs --apply
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const apply = process.argv.includes('--apply');

const { data: sources, error: sErr } = await supabase
  .from('dealer_sources')
  .select('id, name, location_city, location_state')
  .not('location_state', 'is', null);
if (sErr) throw sErr;

let updated = 0;
for (const src of sources) {
  const { count } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('source_dealer_id', src.id)
    .is('state', null);
  if (!count) continue;
  console.log(`${String(count).padStart(4)}  ${src.name} → ${src.location_city || '(no city)'}, ${src.location_state}`);
  if (!apply) continue;

  const patch = { state: src.location_state };
  if (src.location_city) patch.city = src.location_city;
  const { error, count: n } = await supabase
    .from('listings')
    .update(patch, { count: 'exact' })
    .eq('source_dealer_id', src.id)
    .is('state', null);
  if (error) console.error(`  failed: ${error.message}`);
  else updated += n ?? 0;
}
console.log(apply ? `updated ${updated} listings` : 'dry run — pass --apply to write');

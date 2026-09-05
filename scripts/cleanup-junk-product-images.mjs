#!/usr/bin/env node
/**
 * Remove non-photo rows from manufacturer_product_images and promote a real
 * image to primary where a junk row held that slot.
 *
 * Scrapers picked up tracking pixels (bat.bing.com), live-chat widget icons
 * and HTML page URLs as "images". Dry-run by default; pass --apply to write.
 *
 *   node scripts/cleanup-junk-product-images.mjs          # report only
 *   node scripts/cleanup-junk-product-images.mjs --apply  # delete + repair
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });
const apply = process.argv.includes('--apply');

const JUNK_HOSTS = new Set([
  'bat.bing.com',
  'cdn1.thelivechatsoftware.com',
  'www.google-analytics.com',
  'www.facebook.com',
  'px.ads.linkedin.com',
]);
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i;

function isJunk(u) {
  let parsed;
  try {
    parsed = new URL(u);
  } catch {
    return 'invalid url';
  }
  if (JUNK_HOSTS.has(parsed.hostname)) return `tracking/widget host ${parsed.hostname}`;
  // Anything under an obvious non-image path (HTML pages scraped as images)
  if (!IMAGE_EXT.test(parsed.pathname + parsed.search) && !/\/(uploads|images?|media|thumbnails?|styles|files)\//i.test(parsed.pathname) && !/wp\.com|vimeocdn|website-files/.test(parsed.hostname)) {
    return 'not an image URL';
  }
  return null;
}

const PAGE = 1000;
const junk = [];
for (let from = 0; ; from += PAGE) {
  const { data, error } = await supabase
    .from('manufacturer_product_images')
    .select('id, product_id, url, is_primary, sort_order')
    .order('id')
    .range(from, from + PAGE - 1);
  if (error) throw error;
  for (const row of data ?? []) {
    const reason = isJunk(row.url);
    if (reason) junk.push({ ...row, reason });
  }
  if (!data || data.length < PAGE) break;
}

console.log(`${junk.length} junk image rows${apply ? '' : ' (dry run — pass --apply to delete)'}`);
for (const j of junk) {
  console.log(`  ${j.is_primary ? 'PRIMARY ' : '        '} ${j.reason.padEnd(38)} ${j.url.slice(0, 90)}`);
}

if (!apply || junk.length === 0) process.exit(0);

const ids = junk.map((j) => j.id);
const { error: delError } = await supabase.from('manufacturer_product_images').delete().in('id', ids);
if (delError) throw delError;
console.log(`deleted ${ids.length} rows`);

// Repair primaries: any product that lost its primary gets its lowest sort_order image promoted
const affected = [...new Set(junk.filter((j) => j.is_primary).map((j) => j.product_id))];
let promoted = 0;
for (const productId of affected) {
  const { data: remaining } = await supabase
    .from('manufacturer_product_images')
    .select('id, is_primary')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })
    .limit(1);
  const next = remaining?.[0];
  if (next && !next.is_primary) {
    const { error } = await supabase.from('manufacturer_product_images').update({ is_primary: true }).eq('id', next.id);
    if (!error) promoted++;
  }
}
console.log(`promoted ${promoted} replacement primary images across ${affected.length} products`);

/**
 * Re-host external listing images into Supabase Storage.
 *
 * Older dealer imports hotlinked images from dealer sites (imanpro.net,
 * midcosales.com, etc.). Those hosts break (imanpro now 403s everything),
 * leaving broken images on /search. Newer imports already re-host via
 * downloadAndStoreImage — this backfills the old rows to the same
 * dealer-imports/<listingId>/<index>-<hash>.<ext> convention.
 *
 * For each listing_images row whose url is not on Supabase:
 *   - download (browser UA + referer) and upload to listing-images bucket
 *   - on success: update url + thumbnail_url to the storage public URL
 *   - on failure: delete the row (dead hotlink is worse than no image)
 * Then ensure every affected listing that still has images has a primary.
 *
 * Usage:
 *   node scripts/rehost-external-images.mjs --dry-run   # report only
 *   node scripts/rehost-external-images.mjs             # full run
 *   node scripts/rehost-external-images.mjs --limit 50  # first N rows
 *
 * Re-runnable: rehosted rows no longer match the external-url filter.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import crypto from 'crypto';

config({ path: '.env.local' });

const DRY_RUN = process.argv.includes('--dry-run');
const limitArg = process.argv.indexOf('--limit');
const LIMIT = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;
const CONCURRENCY = 6;
const FETCH_TIMEOUT_MS = 20000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchAllExternalRows() {
  const rows = [];
  let from = 0;
  const page = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('listing_images')
      .select('id, listing_id, url, thumbnail_url, is_primary, sort_order')
      .not('url', 'ilike', '%supabase.co%')
      .order('id')
      .range(from, from + page - 1);
    if (error) throw new Error(`fetch rows: ${error.message}`);
    rows.push(...data);
    if (data.length < page) break;
    from += page;
  }
  return rows;
}

async function downloadImage(rawUrl) {
  // Some legacy rows have unencoded spaces etc.
  const url = encodeURI(rawUrl.trim());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        Referer: new URL(url).origin,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    if (!resp.ok) return { error: `HTTP ${resp.status}` };
    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return { error: `not an image: ${contentType}` };
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 5000) return { error: `too small (${buffer.length}b)` };
    return { buffer, contentType };
  } catch (err) {
    return { error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function rehostRow(row) {
  const { buffer, contentType, error } = await downloadImage(row.url);
  if (error) return { row, ok: false, reason: error };

  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
  const index = row.sort_order ?? 0;
  const path = `dealer-imports/${row.listing_id}/${index}-${hash}.${ext}`;

  if (DRY_RUN) return { row, ok: true, reason: 'dry-run (downloadable)' };

  const { error: upErr } = await supabase.storage
    .from('listing-images')
    .upload(path, buffer, { contentType, upsert: true });
  if (upErr) return { row, ok: false, reason: `upload: ${upErr.message}` };

  const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path);
  const publicUrl = urlData?.publicUrl;
  if (!publicUrl) return { row, ok: false, reason: 'no public url' };

  const { error: dbErr } = await supabase
    .from('listing_images')
    .update({ url: publicUrl, thumbnail_url: publicUrl })
    .eq('id', row.id);
  if (dbErr) return { row, ok: false, reason: `db update: ${dbErr.message}` };

  return { row, ok: true };
}

async function runPool(rows) {
  const results = [];
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < rows.length) {
      const i = next++;
      results[i] = await rehostRow(rows[i]);
      done++;
      if (done % 100 === 0) console.log(`  ${done}/${rows.length} processed`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

async function deleteRows(ids) {
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const { error } = await supabase.from('listing_images').delete().in('id', chunk);
    if (error) throw new Error(`delete rows: ${error.message}`);
  }
}

async function ensurePrimaries(listingIds) {
  let fixed = 0;
  for (const listingId of listingIds) {
    const { data, error } = await supabase
      .from('listing_images')
      .select('id, is_primary, sort_order')
      .eq('listing_id', listingId)
      .order('sort_order');
    if (error || !data?.length) continue;
    if (!data.some((r) => r.is_primary)) {
      await supabase.from('listing_images').update({ is_primary: true }).eq('id', data[0].id);
      fixed++;
    }
  }
  return fixed;
}

const rows = (await fetchAllExternalRows()).slice(0, LIMIT);
console.log(`${rows.length} external image rows to process${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

const results = await runPool(rows);
const failed = results.filter((r) => !r.ok);
const succeeded = results.length - failed.length;

const failsByReason = {};
const failsByHost = {};
for (const f of failed) {
  failsByReason[f.reason] = (failsByReason[f.reason] || 0) + 1;
  try {
    const h = new URL(f.row.url).host;
    failsByHost[h] = (failsByHost[h] || 0) + 1;
  } catch {
    failsByHost['<malformed>'] = (failsByHost['<malformed>'] || 0) + 1;
  }
}

console.log(`\nRe-hosted: ${succeeded}`);
console.log(`Failed:    ${failed.length}`);
console.log('Failures by reason:', failsByReason);
console.log('Failures by host:', failsByHost);

if (!DRY_RUN && failed.length) {
  const deadIds = failed.map((f) => f.row.id);
  console.log(`\nDeleting ${deadIds.length} dead image rows...`);
  await deleteRows(deadIds);

  const affectedListings = [...new Set(failed.map((f) => f.row.listing_id))];
  console.log(`Ensuring primary image on ${affectedListings.length} affected listings...`);
  const fixed = await ensurePrimaries(affectedListings);
  console.log(`Promoted a new primary on ${fixed} listings.`);

  const { count: imageless } = await supabase
    .from('listings')
    .select('id, listing_images!inner(id)', { count: 'exact', head: true })
    .eq('status', 'active');
  console.log(`Active listings that still have >=1 image: ${imageless}`);
}

console.log('\nDone.');

#!/usr/bin/env node
/**
 * Re-host manufacturer catalog images into Supabase Storage.
 *
 * manufacturer_product_images rows hotlink photos from 20+ manufacturer
 * websites. next/image has to fetch those server-side, which breaks whenever
 * a host is missing from the allowlist or sits behind bot protection, and
 * the marketplace should own its images anyway (listing images were moved
 * in July 2026 for the same reason).
 *
 * For each row whose url is not on Supabase:
 *   - download (browser-like headers) and upload to
 *     listing-images/manufacturer-products/<product_id>/<sort>-<hash>.<ext>
 *   - on success: url -> storage public URL, original_url -> the old url
 *   - on a permanent failure (404/410, non-image body, tiny/oversize):
 *     delete the row — a dead hotlink is worse than no image
 *   - on a transient failure (403/429/5xx/timeout): leave the row for a
 *     later run and report it
 * Then make sure every product that still has images has exactly one primary.
 *
 * Usage:
 *   node scripts/rehost-manufacturer-images.mjs              # dry run (report only)
 *   node scripts/rehost-manufacturer-images.mjs --apply      # full run
 *   node scripts/rehost-manufacturer-images.mjs --apply --limit 100
 *   node scripts/rehost-manufacturer-images.mjs --apply --host landoll.com
 *
 * Re-runnable: rows already on Supabase are skipped.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import crypto from 'crypto';
import { isSupabaseStorageUrl } from './lib/rehost-images.mjs';

config({ path: '.env.local' });
config();

const APPLY = process.argv.includes('--apply');
const limitIdx = process.argv.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(process.argv[limitIdx + 1], 10) : Infinity;
const hostIdx = process.argv.indexOf('--host');
const ONLY_HOST = hostIdx !== -1 ? process.argv[hostIdx + 1] : null;
const CONCURRENCY = 6;
const FETCH_TIMEOUT_MS = 25_000;
const BUCKET = 'listing-images';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function fetchExternalRows() {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('manufacturer_product_images')
      .select('id, product_id, url, is_primary, sort_order')
      .not('url', 'ilike', '%supabase.co%')
      .order('id')
      .range(from, from + 999);
    if (error) throw new Error(`fetch rows: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) break;
  }
  return rows;
}

const PERMANENT = new Set([400, 404, 410]);

async function download(rawUrl) {
  const trimmed = rawUrl.trim();
  const url = /%[0-9A-Fa-f]{2}/.test(trimmed) ? trimmed : encodeURI(trimmed);
  try {
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Referer: new URL(url).origin,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!resp.ok) {
      return { error: `HTTP ${resp.status}`, permanent: PERMANENT.has(resp.status) };
    }
    const contentType = (resp.headers.get('content-type') || '').split(';')[0].trim();
    if (!contentType.startsWith('image/')) {
      return { error: `not an image (${contentType || 'unknown'})`, permanent: true };
    }
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 5000) return { error: `too small (${buffer.length}b)`, permanent: true };
    if (buffer.length > 15_000_000) return { error: `oversized (${buffer.length}b)`, permanent: true };
    return { buffer, contentType };
  } catch (err) {
    return { error: err.name === 'TimeoutError' || err.name === 'AbortError' ? 'timeout' : err.message, permanent: false };
  }
}

function extensionFor(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  if (contentType.includes('svg')) return 'svg';
  if (contentType.includes('avif')) return 'avif';
  return 'jpg';
}

async function rehostRow(row) {
  const { buffer, contentType, error, permanent } = await download(row.url);
  if (error) return { row, ok: false, reason: error, permanent };
  if (!APPLY) return { row, ok: true, reason: 'downloadable' };

  const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
  const path = `manufacturer-products/${row.product_id}/${row.sort_order ?? 0}-${hash}.${extensionFor(contentType)}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: true });
  if (upErr) return { row, ok: false, reason: `upload: ${upErr.message}`, permanent: false };

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!urlData?.publicUrl) return { row, ok: false, reason: 'no public url', permanent: false };

  const { error: dbErr } = await supabase
    .from('manufacturer_product_images')
    .update({ url: urlData.publicUrl, original_url: row.url })
    .eq('id', row.id);
  if (dbErr) return { row, ok: false, reason: `db update: ${dbErr.message}`, permanent: false };

  return { row, ok: true, bytes: buffer.length };
}

async function runPool(rows) {
  const results = [];
  let next = 0;
  let done = 0;
  const started = Date.now();
  async function worker() {
    while (next < rows.length) {
      const row = rows[next++];
      results.push(await rehostRow(row));
      done++;
      if (done % 100 === 0 || done === rows.length) {
        const s = ((Date.now() - started) / 1000).toFixed(0);
        console.log(`  ${done}/${rows.length} (${s}s)`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

async function repairPrimaries(productIds) {
  let fixed = 0;
  for (const productId of productIds) {
    const { data: imgs } = await supabase
      .from('manufacturer_product_images')
      .select('id, is_primary, sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });
    if (!imgs || imgs.length === 0) continue;
    const primaries = imgs.filter((i) => i.is_primary);
    if (primaries.length === 1) continue;
    // Exactly one primary: the lowest sort_order
    const keep = imgs[0].id;
    await supabase.from('manufacturer_product_images').update({ is_primary: false }).eq('product_id', productId).neq('id', keep);
    await supabase.from('manufacturer_product_images').update({ is_primary: true }).eq('id', keep);
    fixed++;
  }
  return fixed;
}

const all = await fetchExternalRows();
let rows = all;
if (ONLY_HOST) rows = rows.filter((r) => { try { return new URL(r.url).hostname.replace(/^www\./, '') === ONLY_HOST.replace(/^www\./, ''); } catch { return false; } });
if (Number.isFinite(LIMIT)) rows = rows.slice(0, LIMIT);

console.log(`${all.length} external image rows; processing ${rows.length}${APPLY ? '' : ' (DRY RUN — pass --apply to write)'}`);

const results = await runPool(rows);

const ok = results.filter((r) => r.ok);
const permanentFail = results.filter((r) => !r.ok && r.permanent);
const transientFail = results.filter((r) => !r.ok && !r.permanent);
const bytes = ok.reduce((s, r) => s + (r.bytes || 0), 0);

console.log(`\nre-hosted: ${ok.length}${APPLY ? ` (${(bytes / 1024 / 1024).toFixed(1)} MB uploaded)` : ' downloadable'}`);
console.log(`permanent failures (rows ${APPLY ? 'deleted' : 'would be deleted'}): ${permanentFail.length}`);
console.log(`transient failures (rows kept for a later run): ${transientFail.length}`);

const byHost = (list) => {
  const m = {};
  for (const r of list) { let h = '?'; try { h = new URL(r.row.url).hostname; } catch {} m[h] = (m[h] || 0) + 1; }
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([h, n]) => `    ${n.toString().padStart(4)}  ${h}`).join('\n');
};
const byReason = (list) => {
  const m = {};
  for (const r of list) m[r.reason] = (m[r.reason] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, n]) => `    ${n.toString().padStart(4)}  ${k}`).join('\n');
};
if (permanentFail.length) {
  console.log(`  permanent by reason:\n${byReason(permanentFail)}\n  permanent by host:\n${byHost(permanentFail)}`);
  console.log('  first permanent failures:');
  for (const r of permanentFail.slice(0, 40)) console.log(`    ${r.reason.padEnd(24)} ${r.row.is_primary ? 'PRIMARY ' : '        '}${r.row.url.slice(0, 110)}`);
}
if (transientFail.length) console.log(`  transient by reason:\n${byReason(transientFail)}\n  transient by host:\n${byHost(transientFail)}`);

if (APPLY && permanentFail.length) {
  const ids = permanentFail.map((r) => r.row.id);
  for (let i = 0; i < ids.length; i += 200) {
    const { error } = await supabase.from('manufacturer_product_images').delete().in('id', ids.slice(i, i + 200));
    if (error) console.error('delete failed:', error.message);
  }
  const affected = [...new Set(permanentFail.filter((r) => r.row.is_primary).map((r) => r.row.product_id))];
  const fixed = await repairPrimaries(affected);
  console.log(`deleted ${ids.length} dead rows; repaired primaries on ${fixed} products`);
}

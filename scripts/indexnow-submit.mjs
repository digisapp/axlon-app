#!/usr/bin/env node
/**
 * Tell IndexNow which listing pages changed, so Bing (and the other IndexNow
 * engines) recrawl them within hours instead of whenever they next read the
 * sitemap. ChatGPT search leans on third-party indexes such as Bing's
 * alongside its own OAI-SearchBot crawl, so this is how a new unit reaches
 * ChatGPT answers soon after it is listed.
 *
 * Reads the live sitemap and submits every /listing/ URL whose lastmod falls
 * inside the window. Static and category entries are left out: the sitemap
 * stamps them "now" on every build, so they would be resubmitted daily
 * whether or not anything changed.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs              # listings changed in the last 26h
 *   node scripts/indexnow-submit.mjs --hours 72
 *   node scripts/indexnow-submit.mjs --all        # every URL in the sitemap
 *   node scripts/indexnow-submit.mjs --dry-run
 */

const SITE = (process.env.SITE_URL || 'https://axleyard.com').replace(/\/$/, '');
// Public by design: IndexNow verifies ownership by fetching this key from
// the site itself (public/<key>.txt).
const KEY = '5cbd80f2a901d1a0760e6b147019a1ee';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
// IndexNow accepts up to 10,000 URLs per request.
const BATCH = 10_000;

const args = process.argv.slice(2);
const all = args.includes('--all');
const dryRun = args.includes('--dry-run');
const hoursArg = args.indexOf('--hours');
const hours = hoursArg >= 0 ? Number(args[hoursArg + 1]) : 26;
if (!Number.isFinite(hours) || hours <= 0) {
  console.error('--hours needs a positive number');
  process.exit(1);
}

const unescapeXml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

async function readSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const entries = [];
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim();
    if (loc) entries.push({ url: unescapeXml(loc), lastmod: lastmod ? new Date(lastmod) : null });
  }
  return entries;
}

async function submit(urls) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  // 200 = accepted, 202 = accepted while the key is still being verified.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.status;
}

const entries = await readSitemap();
const since = Date.now() - hours * 3_600_000;
const urls = all
  ? entries.map((e) => e.url)
  : entries.filter((e) => e.url.includes('/listing/') && e.lastmod && e.lastmod.getTime() >= since).map((e) => e.url);

console.log(
  `${entries.length} URLs in the sitemap; submitting ${urls.length}` +
    (all ? ' (all)' : ` listing URL(s) changed in the last ${hours}h`)
);

if (urls.length === 0 || dryRun) {
  if (dryRun) urls.slice(0, 20).forEach((u) => console.log(`  ${u}`));
  process.exit(0);
}

for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const status = await submit(batch);
  console.log(`  submitted ${batch.length} → ${status}`);
}

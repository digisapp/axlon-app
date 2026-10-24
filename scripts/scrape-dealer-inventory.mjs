#!/usr/bin/env node
// @ts-nocheck
/**
 * Universal Dealer Inventory Scraper
 *
 * Usage:
 *   node scripts/scrape-dealer-inventory.mjs                     # Scrape all active dealers
 *   node scripts/scrape-dealer-inventory.mjs --dealer big-tex-trailers  # Scrape one dealer
 *   node scripts/scrape-dealer-inventory.mjs --dry-run           # Preview without saving
 *
 * Flags:
 *   --dry-run        Crawl and print what would be imported. Never creates a
 *                    Supabase client, so it needs no DB env and cannot write.
 *   --verbose, -v    Print every parsed listing (dry run) / skips (live).
 *   --no-retire      Don't mark unseen units sold (one-off partial runs).
 *   --max-create N   Cap new listings created this run (overrides config).
 *
 * Exit code is 1 when any dealer's crawl was broken (bot wall, navigation
 * failure, or zero listings found) so the scheduled workflow shows red
 * instead of a green "Found 0 listings".
 */

import {
  getSupabaseClient,
  createBrowser,
  createPage,
  detectBotWall,
  ensureDealerSource,
  updateDealerSourceStats,
  countActiveListings,
  retireUnseenListings,
  stableSourceListingId,
  processListing,
  sleep,
  printBanner,
} from './lib/dealer-scraper-utils.mjs';
import { extractCardsInPage, buildRawListing } from './lib/dealer-card-extract.mjs';
import { DEALER_CONFIGS, getDealerBySlug, getActiveDealers } from './dealer-configs.mjs';

// ─── CLI args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dealerSlug = args.find((a, i) => args[i - 1] === '--dealer');
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose') || args.includes('-v');
// Units missing from a clean crawl are marked sold (see retireUnseenListings).
// --no-retire keeps the old add-only behaviour for one-off partial runs.
const noRetire = args.includes('--no-retire');
const maxCreateArg = args.find((a, i) => args[i - 1] === '--max-create');

// A live run creates at most this many listings per dealer (each costs an
// xAI call plus up to 10 image re-hosts, ~8s). The crawl itself is always
// complete, so retirement stays accurate; the remainder is created on the
// next run. Keeps a big first import inside the workflow's 120-min timeout.
const DEFAULT_MAX_CREATE_PER_RUN = 600;

// A crawl that saw fewer than this share of the count the dealer's own page
// advertises ("1-25 of 79 results") is treated as incomplete.
const MIN_COMPLETENESS = 0.9;

// The generic "next page" link patterns used when a dealer config doesn't
// name its own.
const DEFAULT_NEXT_SELECTOR = 'a[rel="next"], .next a, .pagination a.next, [class*="next"] a, a[aria-label="Next"]';

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // Dry runs never touch the database: no client is created at all, so no
  // code path below can write (or read) even if a guard were missed.
  const supabase = dryRun ? null : getSupabaseClient();

  let dealers;
  if (dealerSlug) {
    const dealer = getDealerBySlug(dealerSlug);
    if (!dealer) {
      console.error(`❌ Dealer not found: ${dealerSlug}`);
      console.log('Available dealers:', DEALER_CONFIGS.map(d => d.slug).join(', '));
      process.exit(1);
    }
    if (dealer.active === false) {
      console.warn(`⚠ ${dealer.slug} is marked inactive in dealer-configs; scraping anyway because it was requested explicitly.`);
    }
    dealers = [dealer];
  } else {
    // Only sites that actually let us in. Inactive entries (bot-blocked)
    // used to be attempted anyway and burned run time on guaranteed failures.
    dealers = getActiveDealers();
  }

  console.log(`\n🚀 AXLON Dealer Inventory Scraper`);
  console.log(`   Dealers: ${dealers.length}`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN (no database access)' : 'LIVE'}\n`);

  const browser = await createBrowser();
  const totalStats = { found: 0, unique: 0, created: 0, skipped: 0, deferred: 0, retired: 0, errors: 0 };
  const broken = [];

  for (const dealer of dealers) {
    try {
      const stats = await scrapeDealer(browser, supabase, dealer);
      totalStats.found += stats.found;
      totalStats.unique += stats.unique;
      totalStats.created += stats.created;
      totalStats.skipped += stats.skipped;
      totalStats.deferred += stats.deferred;
      totalStats.retired += stats.retired || 0;
      totalStats.errors += stats.errors;
      if (stats.pageErrors > 0 || stats.unique === 0) broken.push(dealer.slug);
    } catch (err) {
      console.error(`❌ Fatal error scraping ${dealer.name}:`, err.message);
      totalStats.errors++;
      broken.push(dealer.slug);
    }
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 TOTAL RESULTS');
  console.log(`   Found (cards): ${totalStats.found}`);
  console.log(`   Unique units: ${totalStats.unique}`);
  console.log(`   ${dryRun ? 'Would import' : 'Created'}: ${totalStats.created}`);
  console.log(`   Skipped: ${totalStats.skipped}`);
  if (totalStats.deferred) console.log(`   Deferred to next run (per-run cap): ${totalStats.deferred}`);
  console.log(`   Retired: ${totalStats.retired}`);
  console.log(`   Errors: ${totalStats.errors}`);
  if (broken.length) console.log(`   Broken crawls: ${broken.join(', ')}`);
  console.log('═'.repeat(60) + '\n');

  if (broken.length) process.exitCode = 1;
}

// ─── Scrape a single dealer ────────────────────────────────────────────────

async function scrapeDealer(browser, supabase, dealer) {
  printBanner(dealer.name, dealer.inventoryUrl || dealer.website);
  // `seen` collects the stable id of every unit the crawl encountered so
  // retirement only touches units that are genuinely gone from the site.
  // `pageErrors` counts crawl-level failures (navigation, bot wall, broken
  // selectors) and `truncated` marks a crawl that stopped before the end of
  // the inventory — either means nothing may be retired.
  const stats = {
    found: 0, unique: 0, created: 0, skipped: 0, deferred: 0, errors: 0,
    pageErrors: 0, truncated: false, seen: new Set(),
  };

  let dealerSourceId;
  if (!dryRun) {
    dealerSourceId = await ensureDealerSource(supabase, dealer);
    console.log(`   Dealer source ID: ${dealerSourceId}`);
  }

  const crawl = await crawlDealer(browser, dealer);
  stats.found = crawl.found;
  stats.pageErrors = crawl.pageErrors;
  stats.truncated = crawl.truncated;
  stats.unique = crawl.listings.length;
  // Every unit the crawl saw counts for retirement, photo or not…
  for (const raw of crawl.listings) stats.seen.add(stableSourceListingId(raw));
  // …but a unit without a photo isn't imported: it renders as a blank card,
  // can't qualify for Google's product results, and one dealer's photo-less
  // stock list (Hale: 6,740 units) would bury every real listing.
  const listings = crawl.listings.filter((l) => l.images?.length > 0);
  stats.noPhoto = crawl.listings.length - listings.length;

  console.log(`   Crawl: ${crawl.found} cards → ${listings.length} unique units` +
    (crawl.filtered ? ` (${crawl.filtered} filtered out by config)` : '') +
    (crawl.expected ? `; dealer's page advertises ${crawl.expected}` : ''));
  if (crawl.pageErrors) console.warn(`   ⚠ ${crawl.pageErrors} crawl error(s): ${crawl.errorReasons.join(' | ')}`);
  if (crawl.truncated) console.warn(`   ⚠ Crawl incomplete: ${crawl.truncatedReason}`);
  if (stats.noPhoto) console.log(`   ↷ ${stats.noPhoto} unit(s) without photos not imported`);
  if (listings.length === 0) console.warn('   ⚠ No listings found — selectors or URL are probably stale');

  if (dryRun) {
    printPreview(listings);
    stats.created = listings.length;
  } else {
    const cap = Number(maxCreateArg) || dealer.maxCreatePerRun || DEFAULT_MAX_CREATE_PER_RUN;
    for (let i = 0; i < listings.length; i++) {
      if (stats.created >= cap) {
        stats.deferred = listings.length - i;
        console.log(`   ↷ Per-run creation cap (${cap}) reached; ${stats.deferred} unit(s) left for the next run`);
        break;
      }
      const raw = listings[i];
      if (verbose) console.log(`   [${i + 1}/${listings.length}] ${raw.title}`);
      try {
        const result = await processListing(supabase, dealerSourceId, raw);
        if (result.action === 'created') {
          stats.created++;
          console.log(`     ✓ Created: ${result.id} — ${raw.title}`);
          await sleep(300); // rate limit AI calls
        } else if (result.action === 'skipped') {
          stats.skipped++;
          if (verbose) console.log('     ○ Skipped (already exists)');
        } else {
          stats.errors++;
        }
      } catch (err) {
        stats.errors++;
        console.error(`     ✗ Error: ${err.message}`);
      }
    }
  }

  if (!dryRun && dealerSourceId) {
    // Retire units that vanished from the dealer's site — only after a
    // complete crawl, and never more than half the inventory at once.
    if (noRetire) {
      console.log('   ↷ Retirement disabled (--no-retire)');
    } else if (stats.pageErrors > 0) {
      console.log('   ↷ Skipping retirement: crawl had page-level errors');
    } else if (stats.truncated) {
      console.log('   ↷ Skipping retirement: crawl did not reach the end of the inventory');
    } else {
      try {
        const result = await retireUnseenListings(supabase, dealerSourceId, stats.seen);
        stats.retired = result.retired;
        if (result.skipped) console.warn(`   ⚠ Retirement skipped: ${result.reason}`);
        else if (result.retired > 0) console.log(`   ⏏ Retired ${result.retired} unit(s) no longer on the site`);
      } catch (err) {
        console.error(`   ✗ Retirement failed: ${err.message}`);
        stats.errors++;
      }
    }

    const activeTotal = await countActiveListings(supabase, dealerSourceId);
    await updateDealerSourceStats(supabase, dealerSourceId, stats.created, activeTotal);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Dealer: ${dealer.name}`);
  console.log(`   Found (cards): ${stats.found}`);
  console.log(`   Unique units: ${stats.unique}`);
  if (stats.noPhoto) console.log(`   Without photos (not imported): ${stats.noPhoto}`);
  console.log(`   ${dryRun ? 'Would import' : 'Created'}: ${stats.created}`);
  if (!dryRun) console.log(`   Skipped (existing): ${stats.skipped}`);
  if (stats.deferred) console.log(`   Deferred (per-run cap): ${stats.deferred}`);
  if (typeof stats.retired === 'number') console.log(`   Retired (gone from site): ${stats.retired}`);
  console.log(`   Crawl complete: ${stats.pageErrors || stats.truncated ? 'NO' : 'yes'}`);
  console.log(`   Errors: ${stats.errors + stats.pageErrors}`);
  console.log('='.repeat(60) + '\n');
  return stats;
}

// ─── Crawl ─────────────────────────────────────────────────────────────────

/**
 * Walk every inventory page for a dealer and return the parsed, de-duplicated
 * raw listings plus crawl-health flags. Nothing here touches the database.
 */
async function crawlDealer(browser, dealer) {
  const cfg = dealer.scrapeConfig || {};
  const result = {
    found: 0, filtered: 0, pageErrors: 0, errorReasons: [], truncated: false, truncatedReason: '',
    expected: 0, listings: [],
  };
  const byId = new Map();

  if (dealer.adapter) {
    // Plain-HTTP adapter (scripts/dealers/<adapter>.mjs) that returns raw
    // listings itself — no browser. A bot challenge or robots.txt refusal
    // surfaces as an error, so the crawl counts as incomplete.
    try {
      const { fetchListings } = await import(`./dealers/${dealer.adapter}.mjs`);
      for (const raw of await fetchListings(dealer, { log: (...m) => console.log(...m) })) {
        result.found++;
        const id = stableSourceListingId(raw);
        if (!byId.has(id)) byId.set(id, raw);
      }
    } catch (err) {
      result.pageErrors++;
      result.errorReasons.push(err.message);
    }
    result.listings = [...byId.values()];
    return result;
  }

  const page = await createPage(browser);
  if (cfg.blockResources) {
    // Server-rendered listing pages don't need images/fonts/CSS to parse;
    // skipping them makes 500-page crawls (Hale) several times faster and
    // lighter on the dealer's server.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (type === 'image' || type === 'media' || type === 'font' || type === 'stylesheet') req.abort().catch(() => {});
      else req.continue().catch(() => {});
    });
  }

  const ctx = {
    page,
    log: (...m) => console.log(...m),
    sleep,
    goto: (url) => gotoChecked(page, url, cfg),
    extractFromHtml: (html) => page.evaluate(extractCardsInPage, cfg, html).then((r) => r.cards),
  };

  const addCards = (cards) => {
    let added = 0;
    for (const card of cards) {
      result.found++;
      const raw = buildRawListing(card, dealer);
      if (!raw) { result.filtered++; continue; }
      const id = stableSourceListingId(raw);
      if (byId.has(id)) continue;
      byId.set(id, raw);
      added++;
    }
    return added;
  };

  try {
    if (typeof dealer.crawl === 'function') {
      // Site-specific crawl (e.g. an inventory grid fed by the dealer's own
      // AJAX endpoint). It returns raw cards from extractCardsInPage.
      const custom = await dealer.crawl(page, ctx);
      addCards(custom.cards || []);
      if (custom.truncated) {
        result.truncated = true;
        result.truncatedReason = custom.truncatedReason || 'custom crawl stopped early';
      }
      if (custom.expected) result.expected += custom.expected;
    } else {
      const startUrls = dealer.inventoryUrls || [dealer.inventoryUrl || dealer.website];
      for (const startUrl of startUrls) {
        await crawlFromUrl(page, dealer, startUrl, addCards, result);
      }
    }
  } catch (err) {
    result.pageErrors++;
    result.errorReasons.push(err.message);
  } finally {
    await page.close().catch(() => {});
  }

  result.listings = [...byId.values()];

  if (result.expected && result.pageErrors === 0 && result.listings.length < result.expected * MIN_COMPLETENESS) {
    result.truncated = true;
    result.truncatedReason = `saw ${result.listings.length} of the ${result.expected} units the dealer's page advertises`;
  }
  return result;
}

async function gotoChecked(page, url, cfg) {
  const opts = { waitUntil: cfg.waitUntil || 'networkidle2', timeout: 45000 };
  let response = await page.goto(url, opts);
  if (response && response.status() >= 500) {
    // One polite retry: a single transient 5xx shouldn't sink a 70-page crawl.
    console.warn(`   ⚠ HTTP ${response.status()} at ${url}; retrying once in 10s`);
    await sleep(10000);
    response = await page.goto(url, opts);
  }
  const wall = await detectBotWall(page, response);
  if (wall) throw new Error(`Blocked at ${url}: ${wall}`);
  if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()} at ${url}`);
  const firstSelector = (cfg.listingSelector || '').split(',')[0].trim();
  if (firstSelector) await page.waitForSelector(firstSelector, { timeout: 15000 }).catch(() => {});
  return response;
}

async function scrollToLoad(page) {
  // Lazy-loaded card images only get their real src once scrolled into view.
  await page.evaluate(async () => {
    const step = Math.max(600, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await sleep(1000);
}

async function readExpectedTotal(page, cfg) {
  if (!cfg.totalSelector) return 0;
  const text = await page.$eval(cfg.totalSelector, (el) => el.textContent).catch(() => '');
  const m = (text || '').replace(/\s+/g, ' ').match(new RegExp(cfg.totalPattern || 'of\\s+([\\d,]+)', 'i'));
  return m ? Number(m[1].replace(/,/g, '')) : 0;
}

async function crawlFromUrl(page, dealer, startUrl, addCards, result) {
  const cfg = dealer.scrapeConfig || {};
  const pagination = cfg.pagination || { type: 'next-link', selector: DEFAULT_NEXT_SELECTOR };
  const maxPages = cfg.maxPages || 1;
  const delay = cfg.pageDelayMs ?? 2000;
  const visited = new Set();
  let firstPageSize = 0;

  console.log(`   Navigating to: ${startUrl}`);
  await gotoChecked(page, startUrl, cfg);
  await sleep(delay);
  visited.add(page.url());
  result.expected += await readExpectedTotal(page, cfg);

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    if (cfg.scrollToLoad) await scrollToLoad(page);

    let { selector, cards } = await page.evaluate(extractCardsInPage, cfg, null);
    if (cards.length === 0 && pageNum === 1 && dealer.scrapeMethod === 'auto') {
      cards = await autoDetectCards(page);
      selector = 'auto-detect';
    }
    const added = addCards(cards);
    console.log(`   Page ${pageNum}: ${cards.length} cards${selector ? ` via "${selector}"` : ''}, ${added} new unit(s)`);

    if (cards.length === 0) {
      // An empty first page means the selectors/URL are stale — a broken
      // crawl, not an empty lot. An empty later page is the normal end.
      if (pageNum === 1) {
        result.pageErrors++;
        result.errorReasons.push(`no listing cards matched at ${startUrl}`);
      }
      return;
    }
    if (pageNum > 1 && added === 0) return; // site served a page we already saw (out-of-range page)

    // maxPages 1 without an explicit pagination config means "single page"
    // (as before) — don't go looking for, or flag, a next link.
    if (maxPages <= 1 && !cfg.pagination) return;

    // Find the way to the next page.
    if (pagination.type === 'url') {
      // Fixed-size pages: one shorter than page 1 is the last page. Asking for
      // the page after it can hang (Hale's /used/?pg=35 timed out at 45s) and
      // would count as a crawl error.
      if (pageNum === 1) firstPageSize = cards.length;
      else if (cards.length < firstPageSize) return;
      // A page the dealer's server can't render (HTTP 5xx) is skipped so the
      // pages after it still get crawled — but it is recorded as a crawl
      // error, so nothing is retired this run (its units went unseen).
      let moved = false;
      let failures = 0;
      while (!moved && pageNum < maxPages) {
        const nextUrl = pagination.template.replace('{url}', startUrl).replace('{page}', String(pageNum + 1));
        await sleep(delay);
        try {
          await gotoChecked(page, nextUrl, cfg);
          visited.add(page.url());
          moved = true;
        } catch (err) {
          // WordPress answers past-the-end pages (/page/71/) with a 404: the
          // normal end of the inventory, not a failure.
          if (/^HTTP 404/.test(err.message)) return;
          if (!/^HTTP 5\d\d/.test(err.message) || ++failures > 2) throw err;
          result.pageErrors++;
          result.errorReasons.push(`${err.message} (skipped)`);
          console.warn(`   ⚠ ${err.message} — skipping that page`);
          pageNum++;
        }
      }
      if (!moved) break; // page cap reached
      continue;
    }

    if (pagination.type === 'click') {
      const canClick = await page.$eval(pagination.selector, (b) => !b.disabled && b.getAttribute('aria-disabled') !== 'true').catch(() => false);
      if (!canClick) return;
      if (pageNum === maxPages) break;
      const signature = cards.slice(0, 3).map((c) => c.title + c.text.slice(0, 80)).join('|');
      await page.click(pagination.selector);
      const changed = await page.waitForFunction(
        (cfgArg, sig) => {
          const sel = cfgArg.listingSelector.split(',')[0].trim();
          const els = [...document.querySelectorAll(sel)].slice(0, 3);
          if (els.length === 0) return false;
          const tsel = (cfgArg.titleSelector || 'h2, h3').split(',')[0].trim();
          const now = els.map((e) => ((e.querySelector(tsel)?.textContent || '').replace(/\s+/g, ' ').trim()) + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 80)).join('|');
          return now !== sig;
        },
        { timeout: 20000, polling: 500 },
        cfg,
        signature,
      ).then(() => true).catch(() => false);
      if (!changed) {
        result.pageErrors++;
        result.errorReasons.push(`clicking "${pagination.selector}" did not load page ${pageNum + 1}`);
        return;
      }
      await sleep(delay);
      continue;
    }

    // Default: follow a "next" link.
    const nextUrl = await page.evaluate((sel) => {
      for (const s of sel.split(',').map((x) => x.trim())) {
        const a = document.querySelector(s);
        const href = a && a.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) return new URL(href, location.href).href;
      }
      return null;
    }, pagination.selector || DEFAULT_NEXT_SELECTOR);
    if (!nextUrl || visited.has(nextUrl)) return;
    if (pageNum === maxPages) break;
    await sleep(delay);
    await gotoChecked(page, nextUrl, cfg);
    visited.add(page.url());
  }

  // Only reached when the page cap stopped us while more pages remained.
  result.truncated = true;
  result.truncatedReason = `hit maxPages (${maxPages}) at ${startUrl} with more pages remaining`;
}

// Last-resort heuristic for scrapeMethod 'auto' dealers only. CSS dealers
// whose selectors stop matching now fail loudly instead of silently
// importing whatever this finds (it picked up product-catalog tiles before).
async function autoDetectCards(page) {
  return page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const candidates = [...document.querySelectorAll('[class*="product"], [class*="inventory"], [class*="listing"], [class*="trailer"], [class*="item"]')];
    const valid = candidates.filter((el) => el.querySelector('img') && (el.querySelector('h1, h2, h3, h4, .title, [class*="name"], [class*="title"]') || el.querySelector('a[href]')));
    const deduped = valid.filter((el) => !valid.some((o) => o !== el && el.contains(o)));
    return deduped.slice(0, 50).map((el) => {
      const img = el.querySelector('img');
      const src = img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || img?.src;
      return {
        title: clean(el.querySelector('h1, h2, h3, h4, .title, [class*="name"], [class*="title"]')?.textContent),
        priceText: clean(el.querySelector('[class*="price"], .price')?.textContent),
        link: el.querySelector('a[href]')?.href || null,
        images: src && !src.startsWith('data:') ? [src] : [],
        idAttr: null, stockText: '', vinText: '', locationText: '', conditionText: '', yearText: '', makeText: '', modelText: '',
        fields: {},
        text: clean(el.textContent).slice(0, 3000),
      };
    }).filter((c) => c.title && c.title.length >= 5);
  });
}

// ─── Dry-run preview ───────────────────────────────────────────────────────

function printPreview(listings) {
  const fmt = (l) => [
    l.source_listing_id,
    l.title,
    l.price ? `$${l.price.toLocaleString('en-US')}` : 'call for price',
    l.year || '-',
    l.condition || '-',
    [l.city, l.state].filter(Boolean).join(', ') || '-',
    `imgs:${l.images.length}`,
    l.source_url || '-',
  ].join(' | ');

  const show = verbose ? listings : [...listings.slice(0, 40), ...(listings.length > 45 ? [null] : []), ...listings.slice(Math.max(40, listings.length - 5))];
  console.log('\n   Preview (id | title | price | year | condition | location | images | url):');
  show.forEach((l, i) => {
    if (l === null) console.log(`     … ${listings.length - 45} more …`);
    else console.log(`     ${fmt(l)}`);
    if (verbose && l) console.log(`       ${JSON.stringify(l)}`);
  });

  const n = listings.length || 1;
  const pct = (k) => `${Math.round((k / n) * 100)}%`;
  const priced = listings.filter((l) => l.price).length;
  const withImg = listings.filter((l) => l.images.length).length;
  const withLoc = listings.filter((l) => l.city || l.state).length;
  const withYear = listings.filter((l) => l.year).length;
  const withUrl = listings.filter((l) => l.source_url).length;
  const prices = listings.filter((l) => l.price).map((l) => l.price);
  console.log('\n   Field coverage:');
  console.log(`     priced ${priced} (${pct(priced)}), call-for-price ${listings.length - priced}` +
    (prices.length ? `, range $${Math.min(...prices).toLocaleString('en-US')}–$${Math.max(...prices).toLocaleString('en-US')}` : ''));
  console.log(`     images ${withImg} (${pct(withImg)}), location ${withLoc} (${pct(withLoc)}), year ${withYear} (${pct(withYear)}), detail url ${withUrl} (${pct(withUrl)})`);
}

// ─── Run ───────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

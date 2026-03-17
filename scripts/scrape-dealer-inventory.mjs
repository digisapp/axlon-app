#!/usr/bin/env node
// @ts-nocheck
/**
 * Universal Dealer Inventory Scraper
 *
 * Usage:
 *   node scripts/scrape-dealer-inventory.mjs                     # Scrape all active dealers
 *   node scripts/scrape-dealer-inventory.mjs --dealer big-tex-trailers  # Scrape one dealer
 *   node scripts/scrape-dealer-inventory.mjs --dry-run           # Preview without saving
 */

import {
  getSupabaseClient,
  createBrowser,
  createPage,
  ensureDealerSource,
  updateDealerSourceStats,
  processListing,
  cleanText,
  sleep,
  printBanner,
  printSummary,
} from './lib/dealer-scraper-utils.mjs';
import { DEALER_CONFIGS, getDealerBySlug } from './dealer-configs.mjs';

// ─── CLI args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dealerSlug = args.find((a, i) => args[i - 1] === '--dealer');
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose') || args.includes('-v');

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const supabase = getSupabaseClient();

  // Determine which dealers to scrape
  let dealers;
  if (dealerSlug) {
    const dealer = getDealerBySlug(dealerSlug);
    if (!dealer) {
      console.error(`❌ Dealer not found: ${dealerSlug}`);
      console.log('Available dealers:', DEALER_CONFIGS.map(d => d.slug).join(', '));
      process.exit(1);
    }
    dealers = [dealer];
  } else {
    dealers = DEALER_CONFIGS;
  }

  console.log(`\n🚀 AXLON Dealer Inventory Scraper`);
  console.log(`   Dealers: ${dealers.length}`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  const browser = await createBrowser();
  const totalStats = { found: 0, created: 0, skipped: 0, errors: 0 };

  for (const dealer of dealers) {
    try {
      const stats = await scrapeDealer(browser, supabase, dealer);
      totalStats.found += stats.found;
      totalStats.created += stats.created;
      totalStats.skipped += stats.skipped;
      totalStats.errors += stats.errors;
    } catch (err) {
      console.error(`❌ Fatal error scraping ${dealer.name}:`, err.message);
      totalStats.errors++;
    }
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 TOTAL RESULTS');
  console.log(`   Found: ${totalStats.found}`);
  console.log(`   Created: ${totalStats.created}`);
  console.log(`   Skipped: ${totalStats.skipped}`);
  console.log(`   Errors: ${totalStats.errors}`);
  console.log('═'.repeat(60) + '\n');
}

// ─── Scrape a single dealer ────────────────────────────────────────────────

async function scrapeDealer(browser, supabase, dealer) {
  printBanner(dealer.name, dealer.inventoryUrl || dealer.website);
  const stats = { found: 0, created: 0, skipped: 0, errors: 0 };

  // Register dealer source in DB
  let dealerSourceId;
  if (!dryRun) {
    dealerSourceId = await ensureDealerSource(supabase, dealer);
    console.log(`   Dealer source ID: ${dealerSourceId}`);
  }

  const page = await createPage(browser);

  try {
    // Navigate to inventory page
    const inventoryUrl = dealer.inventoryUrl || dealer.website;
    console.log(`   Navigating to: ${inventoryUrl}`);
    await page.goto(inventoryUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);

    // Extract listings from the page
    const rawListings = await extractListings(page, dealer);
    stats.found = rawListings.length;
    console.log(`   Found ${rawListings.length} listings on page`);

    if (rawListings.length === 0) {
      // Try auto-detection if configured selectors found nothing
      console.log('   Attempting auto-detection...');
      const autoListings = await autoDetectListings(page, dealer);
      stats.found = autoListings.length;
      console.log(`   Auto-detected ${autoListings.length} listings`);

      if (autoListings.length > 0) {
        rawListings.push(...autoListings);
      }
    }

    // Process each listing
    for (let i = 0; i < rawListings.length; i++) {
      const raw = rawListings[i];
      console.log(`   [${i + 1}/${rawListings.length}] ${raw.title || 'Untitled'}`);

      if (dryRun) {
        if (verbose) console.log(`     Preview:`, JSON.stringify(raw, null, 2));
        stats.created++;
        continue;
      }

      try {
        const result = await processListing(supabase, dealerSourceId, raw);
        if (result.action === 'created') {
          stats.created++;
          console.log(`     ✓ Created: ${result.id}`);
        } else if (result.action === 'skipped') {
          stats.skipped++;
          if (verbose) console.log(`     ○ Skipped (already exists)`);
        } else {
          stats.errors++;
        }
      } catch (err) {
        stats.errors++;
        console.error(`     ✗ Error: ${err.message}`);
      }

      // Rate limit AI calls
      await sleep(300);
    }

    // Scrape additional pages if pagination exists
    if (dealer.scrapeConfig?.maxPages > 1 && rawListings.length > 0) {
      await scrapeAdditionalPages(page, browser, supabase, dealer, dealerSourceId, stats);
    }

  } catch (err) {
    console.error(`   ✗ Page error: ${err.message}`);
    stats.errors++;
  } finally {
    await page.close();
  }

  // Update dealer source stats
  if (!dryRun && dealerSourceId) {
    await updateDealerSourceStats(supabase, dealerSourceId, stats.created);
  }

  printSummary(dealer.name, stats);
  return stats;
}

// ─── Extract listings using configured selectors ───────────────────────────

async function extractListings(page, dealer) {
  const config = dealer.scrapeConfig || {};
  const selectors = config.listingSelector?.split(',').map(s => s.trim()) || [];

  for (const selector of selectors) {
    try {
      const count = await page.$$eval(selector, els => els.length).catch(() => 0);
      if (count === 0) continue;

      console.log(`   Using selector "${selector}" (${count} matches)`);

      const listings = await page.$$eval(selector, (elements, cfg, dealerDefaults) => {
        return elements.map(el => {
          // Title
          const titleSelectors = (cfg.titleSelector || 'h2, h3, .title').split(',').map(s => s.trim());
          let title = '';
          for (const ts of titleSelectors) {
            const titleEl = el.querySelector(ts);
            if (titleEl?.textContent?.trim()) {
              title = titleEl.textContent.trim();
              break;
            }
          }

          // Price
          const priceSelectors = (cfg.priceSelector || '.price').split(',').map(s => s.trim());
          let priceText = '';
          for (const ps of priceSelectors) {
            const priceEl = el.querySelector(ps);
            if (priceEl?.textContent?.trim()) {
              priceText = priceEl.textContent.trim();
              break;
            }
          }

          // Image
          const imgSelectors = (cfg.imageSelector || 'img').split(',').map(s => s.trim());
          const images = [];
          for (const is of imgSelectors) {
            const imgEls = el.querySelectorAll(is);
            imgEls.forEach(img => {
              const src = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.src;
              if (src && !src.includes('placeholder') && !src.includes('data:image') && !src.includes('logo')) {
                images.push(src);
              }
            });
            if (images.length > 0) break;
          }

          // Link
          const linkSelectors = (cfg.linkSelector || 'a').split(',').map(s => s.trim());
          let link = '';
          for (const ls of linkSelectors) {
            const linkEl = el.querySelector(ls);
            if (linkEl?.href) {
              link = linkEl.href;
              break;
            }
          }

          // Extract price number
          const priceMatch = priceText.replace(/,/g, '').match(/\$?([\d.]+)/);
          const price = priceMatch ? parseFloat(priceMatch[1]) : null;

          return {
            title: title || null,
            price,
            price_type: price ? 'fixed' : 'call_for_price',
            images,
            source_url: link || null,
            source_listing_id: link ? link.split('/').filter(Boolean).pop()?.replace(/[^a-zA-Z0-9-]/g, '') : null,
            make: dealerDefaults.defaultMake || null,
            condition: dealerDefaults.defaultCondition || 'new',
          };
        }).filter(l => l.title); // Only return listings with titles
      }, config, { defaultMake: dealer.defaultMake, defaultCondition: dealer.defaultCondition });

      return listings;
    } catch (err) {
      if (verbose) console.log(`   Selector "${selector}" failed: ${err.message}`);
    }
  }

  return [];
}

// ─── Auto-detect listings when selectors fail ──────────────────────────────

async function autoDetectListings(page, dealer) {
  // Smart auto-detection: look for common inventory page patterns
  const listings = await page.evaluate((dealerDefaults) => {
    const results = [];

    // Strategy 1: Look for product/listing grids with images and links
    const candidates = [
      ...document.querySelectorAll('[class*="product"], [class*="inventory"], [class*="listing"], [class*="trailer"], [class*="item"]'),
    ];

    // Filter to elements that contain both an image and a title-like text
    const validCards = candidates.filter(el => {
      const hasImg = el.querySelector('img');
      const hasTitle = el.querySelector('h1, h2, h3, h4, .title, [class*="name"], [class*="title"]');
      const hasLink = el.querySelector('a[href]');
      return hasImg && (hasTitle || hasLink);
    });

    // Deduplicate by removing parent elements that contain child cards
    const deduped = validCards.filter(el => {
      return !validCards.some(other => other !== el && el.contains(other));
    });

    for (const el of deduped.slice(0, 50)) {
      const titleEl = el.querySelector('h1, h2, h3, h4, .title, [class*="name"], [class*="title"]');
      const title = titleEl?.textContent?.trim();
      if (!title || title.length < 5) continue;

      const img = el.querySelector('img');
      const imgSrc = img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || img?.src;
      const images = imgSrc && !imgSrc.includes('data:image') ? [imgSrc] : [];

      const link = el.querySelector('a[href]');
      const href = link?.href || '';

      const priceEl = el.querySelector('[class*="price"], .price');
      const priceText = priceEl?.textContent?.trim() || '';
      const priceMatch = priceText.replace(/,/g, '').match(/\$?([\d.]+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : null;

      results.push({
        title,
        price,
        price_type: price ? 'fixed' : 'call_for_price',
        images,
        source_url: href,
        source_listing_id: href ? href.split('/').filter(Boolean).pop()?.replace(/[^a-zA-Z0-9-]/g, '') : null,
        make: dealerDefaults.defaultMake || null,
        condition: dealerDefaults.defaultCondition || 'new',
      });
    }

    return results;
  }, { defaultMake: dealer.defaultMake, defaultCondition: dealer.defaultCondition });

  return listings;
}

// ─── Pagination ────────────────────────────────────────────────────────────

async function scrapeAdditionalPages(page, browser, supabase, dealer, dealerSourceId, stats) {
  const maxPages = dealer.scrapeConfig?.maxPages || 5;

  for (let pageNum = 2; pageNum <= maxPages; pageNum++) {
    // Try common pagination patterns
    const nextPageUrl = await page.evaluate(() => {
      const nextLink = document.querySelector(
        'a[rel="next"], .next a, .pagination a.next, [class*="next"] a, a[aria-label="Next"]'
      );
      return nextLink?.href || null;
    });

    if (!nextPageUrl) {
      if (verbose) console.log(`   No more pages (stopped at page ${pageNum - 1})`);
      break;
    }

    console.log(`   Page ${pageNum}: ${nextPageUrl}`);
    await page.goto(nextPageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);

    const moreListings = await extractListings(page, dealer);
    if (moreListings.length === 0) break;

    console.log(`   Found ${moreListings.length} listings on page ${pageNum}`);

    for (let i = 0; i < moreListings.length; i++) {
      const raw = moreListings[i];
      if (dryRun) {
        stats.created++;
        continue;
      }

      try {
        const result = await processListing(supabase, dealerSourceId, raw);
        if (result.action === 'created') stats.created++;
        else if (result.action === 'skipped') stats.skipped++;
        else stats.errors++;
      } catch (err) {
        stats.errors++;
      }

      await sleep(300);
    }

    stats.found += moreListings.length;
  }
}

// ─── Run ───────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

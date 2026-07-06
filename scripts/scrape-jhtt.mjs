// @ts-nocheck
/**
 * Scrape Jim Hawk Truck Trailers (JHTT)
 * Custom website - straightforward scraping
 */

import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { insertRehostedImages } from './lib/rehost-images.mjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEALER_INFO = {
  name: 'Jim Hawk Truck Trailers',
  email: 'inventory@jhtt.com',
  phone: '(712) 366-2241',
  city: 'Council Bluffs',
  state: 'IA',
  website: 'https://www.jhtt.com'
};

const BASE_URL = 'https://www.jhtt.com';

const CATEGORY_MAP = {
  'refrigerated': 'reefer-trailers',
  'reefer': 'reefer-trailers',
  'dry van': 'dry-van-trailers',
  'flatbed': 'flatbed-trailers',
  'drop deck': 'step-deck-trailers',
  'step deck': 'step-deck-trailers',
  'lowboy': 'lowboy-trailers',
  'dump': 'end-dump-trailers',
  'tank': 'tank-trailers',
  'livestock': 'livestock-trailers',
  'grain': 'hopper-trailers',
  'hopper': 'hopper-trailers',
  'curtain': 'curtain-side-trailers',
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getOrCreateDealer() {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('company_name', DEALER_INFO.name)
    .single();

  if (existing) {
    console.log('Dealer exists:', DEALER_INFO.name);
    return existing.id;
  }

  const password = 'JHTT2024!';
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email: DEALER_INFO.email,
    email_confirm: true,
    password: password,
  });

  if (error) {
    console.error('Error creating dealer:', error.message);
    return null;
  }

  await supabase.from('profiles').update({
    company_name: DEALER_INFO.name,
    phone: DEALER_INFO.phone,
    city: DEALER_INFO.city,
    state: DEALER_INFO.state,
    is_dealer: true,
    website: DEALER_INFO.website,
  }).eq('id', authUser.user.id);

  console.log('Created dealer:', DEALER_INFO.name);
  console.log('  Email:', DEALER_INFO.email);
  console.log('  Password:', password);
  return authUser.user.id;
}

async function getCategoryId(trailerType, title) {
  const searchText = (trailerType + ' ' + title).toLowerCase();
  let categorySlug = 'dry-van-trailers'; // default

  const sortedKeywords = Object.entries(CATEGORY_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, slug] of sortedKeywords) {
    if (searchText.includes(keyword)) {
      categorySlug = slug;
      break;
    }
  }

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  return cat?.id;
}

async function getAllListingUrls(page) {
  const allUrls = new Set();
  let pageNum = 1;
  const maxPages = 20;

  while (pageNum <= maxPages) {
    const url = pageNum === 1
      ? BASE_URL + '/inventory'
      : BASE_URL + '/inventory?page=' + pageNum;

    console.log('  Page', pageNum + '...');

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(1500);

      const urls = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('a[href*="/inventory/specs/"]').forEach(a => {
          if (!results.includes(a.href)) {
            results.push(a.href);
          }
        });
        return results;
      });

      if (urls.length === 0) {
        console.log('    No listings found, stopping.');
        break;
      }

      const before = allUrls.size;
      urls.forEach(u => allUrls.add(u));
      const added = allUrls.size - before;

      console.log('    Found', urls.length, '(' + added + ' new, ' + allUrls.size + ' total)');

      if (added === 0) {
        break;
      }

      pageNum++;
      await sleep(500);
    } catch (e) {
      console.log('    Error:', e.message.substring(0, 40));
      break;
    }
  }

  return [...allUrls];
}

async function scrapeListing(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1500);

  const data = await page.evaluate(() => {
    const title = document.querySelector('h1, h2, .title')?.textContent?.trim() || '';

    // Get images - prefer larger versions
    const images = [];
    const seen = new Set();
    document.querySelectorAll('img').forEach(img => {
      let src = img.src || img.getAttribute('data-src');
      if (src && src.includes('soarr') && !seen.has(src)) {
        // Get larger version
        src = src.replace('w=300', 'w=800').replace('w=150', 'w=800');
        seen.add(src);
        images.push(src);
      }
    });

    // Get specs
    let trailerType = '';
    let stockNum = '';
    const specElements = document.querySelectorAll('dt, dd');
    for (let i = 0; i < specElements.length; i += 2) {
      const label = specElements[i]?.textContent?.trim()?.toLowerCase() || '';
      const value = specElements[i + 1]?.textContent?.trim() || '';
      if (label.includes('trailer type')) trailerType = value;
      if (label.includes('stock')) stockNum = value;
    }

    // Extract year from title
    const yearMatch = title.match(/(20\d{2})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;

    // Extract make from title
    const makes = ['GREAT DANE', 'WABASH', 'UTILITY', 'HYUNDAI', 'STOUGHTON', 'VANGUARD', 'KRUZ', 'MAC', 'WILSON'];
    let make = '';
    const titleUpper = title.toUpperCase();
    for (const m of makes) {
      if (titleUpper.includes(m)) {
        make = m;
        break;
      }
    }

    return {
      title,
      images: [...new Set(images)],
      trailerType,
      stockNum,
      year,
      make
    };
  });

  return data;
}

async function main() {
  console.log('Scraping Jim Hawk Truck Trailers');
  console.log('   Direct from: jhtt.com');
  console.log('==================================================\n');

  const dealerId = await getOrCreateDealer();
  if (!dealerId) return;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Collecting listing URLs...\n');
  const listingUrls = await getAllListingUrls(page);
  console.log('\nTotal unique listings:', listingUrls.length, '\n');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < listingUrls.length; i++) {
    const url = listingUrls[i];
    process.stdout.write('[' + (i + 1) + '/' + listingUrls.length + '] ');

    try {
      const listing = await scrapeListing(page, url);
      process.stdout.write((listing.title?.substring(0, 35) || 'Unknown') + '... ');

      if (!listing.title || listing.title.length < 5) {
        console.log('no title');
        skipped++;
        continue;
      }

      if (listing.images.length === 0) {
        console.log('no images');
        skipped++;
        continue;
      }

      // Check for duplicate by title
      const { data: exists } = await supabase
        .from('listings')
        .select('id')
        .eq('title', listing.title)
        .eq('user_id', dealerId)
        .single();

      if (exists) {
        console.log('duplicate');
        skipped++;
        continue;
      }

      const categoryId = await getCategoryId(listing.trailerType, listing.title);

      const { data: newListing, error } = await supabase.from('listings').insert({
        user_id: dealerId,
        category_id: categoryId,
        title: listing.title,
        description: listing.trailerType + ' - Stock #' + listing.stockNum,
        price: null,
        price_type: 'contact',
        condition: listing.year >= 2024 ? 'new' : 'used',
        year: listing.year,
        make: listing.make,
        city: DEALER_INFO.city,
        state: DEALER_INFO.state,
        country: 'USA',
        status: 'active',
        listing_type: 'sale',
      }).select('id').single();

      if (error) {
        console.log('error: ' + error.message);
        errors++;
        continue;
      }

      await insertRehostedImages(supabase, newListing.id, listing.images);

      imported++;
      console.log('OK ' + listing.images.length + ' imgs');

      await sleep(300);
    } catch (e) {
      console.log('error: ' + (e.message?.substring(0, 40) || 'unknown'));
      errors++;
    }
  }

  await browser.close();

  console.log('\n==================================================');
  console.log('Summary:');
  console.log('   Dealer: ' + DEALER_INFO.name);
  console.log('   Imported: ' + imported);
  console.log('   Skipped: ' + skipped);
  console.log('   Errors: ' + errors);
  console.log('==================================================\n');
}

main().catch(console.error);

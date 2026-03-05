#!/usr/bin/env node
/**
 * SC&RA Directory Scraper
 * Scrapes all 1,900+ member companies from the Specialized Carriers & Rigging Association directory
 * Extracts: company name, address, phone, website, email, personnel, service codes
 */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

const SEARCH_URL = 'https://www.scranet.org/SCRA/SCRA/Content/membership/Search/Search_by_name.aspx?hkey=ba7c5a62-391a-48eb-8eb6-9399b0499674';
const PROFILE_BASE = 'https://www.scranet.org/CompanySearchResultsPopup?ID=';
const OUTPUT_DIR = path.join(process.cwd(), 'data');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'scra-directory.json');
const OUTPUT_CSV = path.join(OUTPUT_DIR, 'scra-directory.csv');
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'scra-progress.json');

// Rate limiting
const DELAY_BETWEEN_PROFILES = 1500; // ms between profile fetches
const DELAY_BETWEEN_PAGES = 2000; // ms between search pages
const BATCH_SIZE = 25; // Save progress every N profiles

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      console.log(`Resuming from progress: ${data.companies.length} companies already scraped`);
      return data;
    }
  } catch (e) {
    console.log('No valid progress file found, starting fresh');
  }
  return { companies: [], scrapedIds: [], lastPage: 0 };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function scrapeProfilePage(browser, companyId) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

  try {
    const url = `${PROFILE_BASE}${companyId}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract all profile data
    const company = {
      id: companyId,
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      fax: '',
      toll_free: '',
      website: '',
      email: '',
      member_since: '',
      service_codes: [],
      allied_codes: [],
      personnel: [],
      scraped_at: new Date().toISOString(),
    };

    // Get text content smartly
    const bodyText = $('body').text();

    // Company name - typically in h2 or prominent heading
    company.name = $('h2').first().text().trim() ||
                   $('h1').first().text().trim() ||
                   $('.company-name').text().trim();

    // Parse structured data from the profile page
    // These pages typically have label-value pairs
    const allText = $('body').text();

    // Extract fields from text patterns
    const extractField = (label) => {
      const regex = new RegExp(label + '\\s*[:\\n]\\s*(.+?)(?:\\n|$)', 'i');
      const match = allText.match(regex);
      return match ? match[1].trim() : '';
    };

    // Address - look for address patterns
    const addressEl = $('.address, [class*="address"]');
    if (addressEl.length) {
      company.address = addressEl.text().trim();
    }

    // Extract data from table rows or definition lists
    $('tr, .row, dl').each((_, el) => {
      const text = $(el).text().trim();
      const lowerText = text.toLowerCase();

      if (lowerText.includes('phone') && !lowerText.includes('fax')) {
        const phone = text.match(/[\(\d][\d\s\-\(\)\.]+\d/);
        if (phone) company.phone = phone[0].trim();
      }
      if (lowerText.includes('fax')) {
        const fax = text.match(/[\(\d][\d\s\-\(\)\.]+\d/);
        if (fax) company.fax = fax[0].trim();
      }
      if (lowerText.includes('toll') || lowerText.includes('free')) {
        const tf = text.match(/[\(\d][\d\s\-\(\)\.]+\d/);
        if (tf) company.toll_free = tf[0].trim();
      }
      if (lowerText.includes('website') || lowerText.includes('web site')) {
        const link = $(el).find('a').attr('href') || '';
        company.website = link || text.replace(/website\s*:?\s*/i, '').trim();
      }
    });

    // Find all email addresses on the page
    const emails = allText.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [];
    if (emails.length > 0) {
      company.email = emails[0]; // Primary email
    }

    // Find website from links
    if (!company.website) {
      $('a[href*="www"], a[href*="http"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href && !href.includes('scranet.org') && !href.includes('mailto:') && !href.includes('tel:')) {
          company.website = href;
          return false; // break
        }
      });
    }

    // Find phone from tel: links
    if (!company.phone) {
      $('a[href^="tel:"]').each((_, el) => {
        const phone = $(el).text().trim();
        if (phone) {
          company.phone = phone;
          return false;
        }
      });
    }

    // Extract personnel - look for name/title patterns
    // Personnel are usually in a section with names and titles
    const personnelSection = allText.match(/personnel|contacts?|staff|team/i);
    $('tr, .personnel, .contact-person, li').each((_, el) => {
      const text = $(el).text().trim();
      // Look for "Name, Title" or "Name - Title" patterns with email
      const personMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*[,\-–]\s*(.+?)(?:\s*[\w.+-]+@[\w-]+\.[\w.]+)?$/);
      if (personMatch) {
        const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
        company.personnel.push({
          name: personMatch[1].trim(),
          title: personMatch[2].trim(),
          email: email ? email[0] : '',
        });
      }
    });

    // Also try to find personnel from any mailto links with context
    $('a[href^="mailto:"]').each((_, el) => {
      const email = $(el).attr('href').replace('mailto:', '').trim();
      const parentText = $(el).parent().text().trim() || $(el).closest('tr, li, div').text().trim();
      // Try to extract name and title from surrounding text
      const nameMatch = parentText.match(/([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/);
      const titleWords = ['President', 'VP', 'Director', 'Manager', 'Owner', 'CEO', 'CFO', 'COO',
        'Operations', 'Sales', 'General Manager', 'Superintendent', 'Dispatcher', 'Administrator'];
      const titleRegex = new RegExp(`(${titleWords.join('|')}).*`, 'i');
      const titleMatch = parentText.match(titleRegex);

      // Avoid duplicates
      const existing = company.personnel.find(p => p.email === email);
      if (!existing && email) {
        company.personnel.push({
          name: nameMatch ? nameMatch[1] : '',
          title: titleMatch ? titleMatch[0].substring(0, 100) : '',
          email: email,
        });
      }
    });

    // Service codes
    const serviceSection = allText.match(/service\s*(?:code|classification|categor)s?\s*:?\s*(.+?)(?:\n\n|\z)/is);
    if (serviceSection) {
      company.service_codes = serviceSection[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    }

    // Member since
    const memberMatch = allText.match(/member\s*since\s*:?\s*(\d{4})/i);
    if (memberMatch) {
      company.member_since = memberMatch[1];
    }

    // Parse address into components
    if (company.address) {
      const addrParts = company.address.match(/(.+?)(?:,\s*)?([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\s*(.*?)$/);
      if (addrParts) {
        const cityPart = addrParts[1].split(',');
        company.city = cityPart[cityPart.length - 1]?.trim() || '';
        company.state = addrParts[2];
        company.zip = addrParts[3];
        company.country = addrParts[4]?.trim() || 'United States';
      }
    }

    return company;
  } catch (error) {
    console.error(`  Error scraping profile ${companyId}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

async function getAllCompanyIds(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

  console.log('Loading search page...');
  await page.goto(SEARCH_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // First, increase items per page to maximum
  console.log('Setting page size...');

  // Click the paginator page size dropdown
  const hasPaginator = await page.$('.mat-paginator-page-size-select');
  if (hasPaginator) {
    await page.click('.mat-paginator-page-size-select');
    await sleep(1000);

    // Try to select the largest option
    const options = await page.$$('.mat-option');
    if (options.length > 0) {
      await options[options.length - 1].click(); // Click last (largest) option
      await sleep(2000);
    }
  }

  // Click search with empty query
  console.log('Executing search...');
  await page.click('#pseudoSearchbtn');
  await page.waitForSelector('.radiusresult', { timeout: 20000 });
  await sleep(3000);

  // Get total count and collect all IDs by paginating
  const allCompanyIds = [];
  let hasNext = true;
  let pageNum = 1;

  while (hasNext) {
    // Extract company IDs from current page
    const pageData = await page.evaluate(() => {
      const results = document.querySelectorAll('.radiusresult');
      const ids = [];

      results.forEach(r => {
        const link = r.querySelector('a[href*="CompanySearchResultsPopup?ID="]');
        if (link) {
          const match = link.href.match(/ID=(\d+)/);
          if (match) {
            ids.push({
              id: match[1],
              name: r.querySelector('.name')?.textContent?.trim() || '',
              address: r.querySelector('.address')?.textContent?.trim() || '',
              phone: r.querySelector('.contact.phone a')?.textContent?.trim() || '',
            });
          }
        }
      });

      // Check pagination
      const pagText = document.querySelector('.mat-paginator-range-label')?.textContent?.trim() || '';
      const nextBtn = document.querySelector('.mat-paginator-navigation-next');
      const isDisabled = nextBtn?.disabled || nextBtn?.classList?.contains('mat-button-disabled');

      return { ids, pagText, hasNextPage: !isDisabled };
    });

    console.log(`  Page ${pageNum}: ${pageData.ids.length} companies (${pageData.pagText})`);
    allCompanyIds.push(...pageData.ids);

    hasNext = pageData.hasNextPage && pageData.ids.length > 0;

    if (hasNext) {
      // Click next page
      await page.click('.mat-paginator-navigation-next');
      await sleep(DELAY_BETWEEN_PAGES);
      await page.waitForSelector('.radiusresult', { timeout: 15000 }).catch(() => {});
      await sleep(1000);
      pageNum++;
    }
  }

  await page.close();
  console.log(`\nTotal companies found: ${allCompanyIds.length}`);
  return allCompanyIds;
}

function companyToCSVRow(company) {
  const personnelNames = company.personnel.map(p => `${p.name} (${p.title})`).join('; ');
  const personnelEmails = company.personnel.map(p => p.email).filter(Boolean).join('; ');

  const escape = (val) => {
    if (!val) return '';
    val = String(val);
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  return [
    escape(company.name),
    escape(company.address),
    escape(company.city),
    escape(company.state),
    escape(company.zip),
    escape(company.country),
    escape(company.phone),
    escape(company.fax),
    escape(company.toll_free),
    escape(company.email),
    escape(company.website),
    escape(personnelNames),
    escape(personnelEmails),
    escape(company.service_codes.join('; ')),
    escape(company.member_since),
    escape(company.id),
  ].join(',');
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Load progress for resume capability
    const progress = loadProgress();

    // Step 1: Get all company IDs from search results
    console.log('\n=== STEP 1: Collecting all company IDs ===\n');
    const companyListings = await getAllCompanyIds(browser);

    // Filter out already scraped IDs
    const scrapedSet = new Set(progress.scrapedIds);
    const toScrape = companyListings.filter(c => !scrapedSet.has(c.id));
    console.log(`\n${toScrape.length} companies remaining to scrape (${progress.scrapedIds.length} already done)\n`);

    // Step 2: Scrape each profile page
    console.log('=== STEP 2: Scraping company profiles ===\n');

    let count = progress.companies.length;
    const total = companyListings.length;

    for (let i = 0; i < toScrape.length; i++) {
      const listing = toScrape[i];
      count++;
      process.stdout.write(`[${count}/${total}] ${listing.name}... `);

      const company = await scrapeProfilePage(browser, listing.id);

      if (company) {
        // Merge listing data with profile data (listing has basic info as fallback)
        if (!company.name) company.name = listing.name;
        if (!company.address) company.address = listing.address;
        if (!company.phone) company.phone = listing.phone;

        progress.companies.push(company);
        progress.scrapedIds.push(listing.id);
        console.log(`OK (${company.personnel.length} contacts, ${company.email || 'no email'})`);
      } else {
        // Still save basic info from listing
        progress.companies.push({
          id: listing.id,
          name: listing.name,
          address: listing.address,
          phone: listing.phone,
          personnel: [],
          service_codes: [],
          scraped_at: new Date().toISOString(),
          error: true,
        });
        progress.scrapedIds.push(listing.id);
        console.log('FAILED (saved basic info)');
      }

      // Save progress periodically
      if (i > 0 && i % BATCH_SIZE === 0) {
        saveProgress(progress);
        console.log(`  [Progress saved: ${progress.companies.length} companies]`);
      }

      await sleep(DELAY_BETWEEN_PROFILES);
    }

    // Final save
    saveProgress(progress);

    // Step 3: Write output files
    console.log('\n=== STEP 3: Writing output files ===\n');

    // JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(progress.companies, null, 2));
    console.log(`JSON: ${OUTPUT_JSON} (${progress.companies.length} companies)`);

    // CSV
    const csvHeader = 'Company Name,Address,City,State,Zip,Country,Phone,Fax,Toll Free,Email,Website,Personnel,Personnel Emails,Service Codes,Member Since,SCRA ID';
    const csvRows = progress.companies.map(companyToCSVRow);
    fs.writeFileSync(OUTPUT_CSV, [csvHeader, ...csvRows].join('\n'));
    console.log(`CSV: ${OUTPUT_CSV}`);

    // Stats
    const withEmail = progress.companies.filter(c => c.email || c.personnel?.some(p => p.email)).length;
    const withWebsite = progress.companies.filter(c => c.website).length;
    const withPersonnel = progress.companies.filter(c => c.personnel?.length > 0).length;

    console.log(`\n=== SCRAPING COMPLETE ===`);
    console.log(`Total companies: ${progress.companies.length}`);
    console.log(`With email: ${withEmail}`);
    console.log(`With website: ${withWebsite}`);
    console.log(`With personnel: ${withPersonnel}`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);

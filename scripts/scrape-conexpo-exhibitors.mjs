#!/usr/bin/env node

/**
 * CONEXPO-CON/AGG 2026 Exhibitor Scraper
 *
 * Scrapes the public exhibitor directory at directory.conexpoconagg.com
 * Filters to only heavy equipment companies (trucks, trailers, cranes, etc.)
 * Fetches detail pages for contact info (website, phone, address, contacts).
 *
 * Output: data/conexpo-exhibitors.json
 *
 * Usage:
 *   node scripts/scrape-conexpo-exhibitors.mjs [--resume] [--no-filter]
 *
 *   --resume     Resume from last progress checkpoint
 *   --no-filter  Skip keyword filtering, keep all exhibitors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'conexpo-exhibitors.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'conexpo-progress.json');

const BASE_URL = 'https://directory.conexpoconagg.com/8_0';
const AJAX_URL = `${BASE_URL}/ajax/remote-proxy.cfm`;
const DETAIL_URL = `${BASE_URL}/exhibitor/exhibitor-details.cfm`;

const PAGE_SIZE = 50;
const DELAY_MS = 300;
const DETAIL_DELAY_MS = 400;
const MAX_RETRIES = 3;

const FLAGS = {
  resume: process.argv.includes('--resume'),
  noFilter: process.argv.includes('--no-filter'),
};

// ─── Equipment Industry Keywords ─────────────────────────────
// Used to filter exhibitors to only trucks, trailers, cranes, heavy equipment

const INCLUDE_KEYWORDS = [
  // Trucks
  'truck', 'trucks', 'semi', 'tractor', 'vocational truck', 'dump truck',
  'mixer truck', 'concrete truck', 'haul truck', 'off-highway truck',
  'articulated dump', 'off-road truck',
  // Trailers
  'trailer', 'trailers', 'lowboy', 'lowbed', 'flatbed', 'heavy haul',
  'semi-trailer', 'drop deck', 'step deck', 'double drop', 'rgn',
  'removable gooseneck', 'extendable trailer', 'modular trailer',
  // Cranes
  'crane', 'cranes', 'boom', 'hoist', 'rigging', 'lifting',
  'tower crane', 'crawler crane', 'mobile crane', 'overhead crane',
  'aerial lift', 'man lift', 'boom lift', 'scissor lift',
  'telescopic handler', 'telehandler',
  // Heavy Equipment
  'excavator', 'bulldozer', 'dozer', 'loader', 'backhoe',
  'grader', 'motor grader', 'scraper', 'compactor', 'roller',
  'paver', 'asphalt', 'concrete', 'crusher', 'screener',
  'mining', 'quarry', 'aggregate', 'earthmoving', 'earth moving',
  'pile driver', 'piling', 'foundation drill', 'drill rig',
  'forklift', 'material handler', 'skid steer', 'compact track',
  'wheel loader', 'track loader', 'mini excavator',
  // Attachments & Components
  'bucket', 'attachment', 'hydraulic cylinder', 'hydraulic pump',
  'undercarriage', 'wear parts', 'ground engaging',
  'grapple', 'breaker', 'hammer', 'auger', 'trencher',
  // Transport & Hauling
  'transport', 'hauling', 'logistics', 'heavy equipment',
  'construction equipment', 'fleet', 'off-highway',
  // Engines & Drivetrain
  'diesel engine', 'engine', 'transmission', 'axle', 'drivetrain',
  'powertrain', 'turbocharger',
  // Work Trucks & Bodies
  'work truck', 'service body', 'truck body', 'utility body',
  'crane truck', 'service crane', 'knuckle boom',
  // Tires & Tracks
  'tire', 'tires', 'otr tire', 'track', 'rubber track',
  // Dealer / Auction / Rental
  'equipment dealer', 'equipment rental', 'auction',
  'used equipment', 'equipment finance',
];

const EXCLUDE_KEYWORDS = [
  'software only', 'marketing agency', 'advertising agency',
  'public relations', 'media company', 'magazine', 'publication',
  'trade association', 'nonprofit', 'non-profit', 'suicide prevention',
  'drone only', 'survey only', 'ai takeoff', 'ai estimating',
  'erp software', 'accounting software', 'business management software',
];

function isEquipmentCompany(name, description) {
  const text = `${name} ${description}`.toLowerCase();

  // Check exclusions first
  for (const kw of EXCLUDE_KEYWORDS) {
    if (text.includes(kw)) return false;
  }

  // Check inclusions
  for (const kw of INCLUDE_KEYWORDS) {
    if (text.includes(kw)) return true;
  }

  return false;
}

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  const { skipXhr, ...fetchOptions } = options;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ...fetchOptions.headers,
      };
      if (!skipXhr) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
      }
      const res = await fetch(url, { ...fetchOptions, headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  Retry ${attempt}/${retries}: ${err.message}`);
      await sleep(1000 * attempt);
    }
  }
}

// ─── List API ────────────────────────────────────────────────

async function fetchExhibitorPage(letter, start, size = PAGE_SIZE) {
  const params = new URLSearchParams({
    action: 'search',
    search: letter,
    searchtype: 'exhibitoralpha',
    sortfield: 'alpha',
    sortdirection: 'asc',
    show: 'exhibitors',
    lazyload: 'true',
    [`size-exhibitors`]: String(size),
    start: String(start),
  });

  const res = await fetchWithRetry(`${AJAX_URL}?${params}`);
  const json = await res.json();

  if (!json.SUCCESS) {
    throw new Error(`API error: ${json.ERRORMESSAGE || 'Unknown'}`);
  }

  const exhibitorData = json.DATA?.results?.exhibitor;
  if (!exhibitorData) return { hits: [], total: 0 };

  return {
    hits: (exhibitorData.hit || []).map(h => ({
      id: h.fields?.exhid_l || h.id?.split('-')[0],
      name: h.fields?.exhname_t || '',
      description: (h.fields?.exhdesc_t || '').trim(),
    })),
    total: exhibitorData.found || 0,
  };
}

async function fetchAllExhibitors() {
  const params = new URLSearchParams({
    action: 'getsearchoptions',
    function: 'getexhibitoralphachars',
  });
  const res = await fetchWithRetry(`${AJAX_URL}?${params}`);
  const json = await res.json();

  const letters = json.DATA || [];
  const totalExpected = letters.reduce((sum, l) => sum + (l.count || 0), 0);
  console.log(`\nFound ${letters.length} letter groups, ~${totalExpected} total exhibitors\n`);

  const allExhibitors = [];

  for (const { value: letter, count } of letters) {
    if (count === 0) continue;

    process.stdout.write(`Fetching "${letter}" (${count})...`);
    let start = 0;
    let fetched = 0;

    while (fetched < count) {
      const { hits } = await fetchExhibitorPage(letter, start);
      if (hits.length === 0) break;

      allExhibitors.push(...hits);
      fetched += hits.length;
      start += hits.length;
      await sleep(DELAY_MS);
    }

    console.log(` ${fetched} fetched`);
  }

  return allExhibitors;
}

// ─── Detail Scraper ──────────────────────────────────────────

function parseDetailPage(html) {
  const result = {
    website: '',
    phone: '',
    address: {},
    contacts: [],
    social: {},
  };

  // Extract website
  const websiteMatch = html.match(/websiteValue:\s*"([^"]+)"/);
  if (websiteMatch) {
    result.website = websiteMatch[1].replace(/\\\//g, '/');
  }

  // Extract company phone
  const phoneMatch = html.match(/phoneValue:\s*"([^"]+)"/);
  if (phoneMatch) {
    result.phone = phoneMatch[1];
  }

  // Extract address
  const addressMatch = html.match(/addressValues:\s*(\{[^}]+\})/);
  if (addressMatch) {
    try {
      const addr = JSON.parse(addressMatch[1]);
      result.address = {
        street: [addr.ADDRESS1, addr.ADDRESS2, addr.ADDRESS3].filter(Boolean).join(', '),
        city: addr.CITY || '',
        state: addr.STATE || '',
        zip: addr.ZIP || '',
        country: addr.COUNTRY || '',
      };
    } catch {}
  }

  // Extract social media
  for (const field of ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube']) {
    const match = html.match(new RegExp(`${field}Value:\\s*"([^"]+)"`));
    if (match && match[1]) {
      result.social[field] = match[1].replace(/\\\//g, '/');
    }
  }

  // Extract contacts from onlinecontactsdata
  const contactsMatch = html.match(/this\.onlinecontactsdata\s*=\s*(\[[\s\S]*?\]);/);
  if (contactsMatch) {
    try {
      const contacts = JSON.parse(contactsMatch[1]);
      result.contacts = contacts
        .filter(c => c.published === 1)
        .map(c => ({
          name: (c.fullname || `${c.fname || ''} ${c.lname || ''}`).trim(),
          title: c.title || '',
          email: c.email || '',
          phone: c.phone || '',
        }))
        .filter(c => c.name || c.email);
    } catch {}
  }

  return result;
}

async function fetchExhibitorDetail(exhId) {
  // Detail pages must NOT use X-Requested-With header (returns JSON fragment otherwise)
  const res = await fetchWithRetry(`${DETAIL_URL}?exhid=${exhId}`, { skipXhr: true });
  const html = await res.text();
  return parseDetailPage(html);
}

// ─── Progress Management ─────────────────────────────────────

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { phase: 'list', exhibitors: [], filtered: [], detailsDone: [], lastDetailIndex: 0 };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  CONEXPO-CON/AGG 2026 — Equipment Company Scraper  ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`Filter: ${FLAGS.noFilter ? 'OFF (all exhibitors)' : 'ON (trucks/trailers/cranes/equipment only)'}`);
  console.log(`Resume: ${FLAGS.resume ? 'ON' : 'OFF'}`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let progress = FLAGS.resume ? loadProgress() : { phase: 'list', exhibitors: [], filtered: [], detailsDone: [], lastDetailIndex: 0 };

  // ── Phase 1: Fetch all exhibitors from list API ──
  let allExhibitors;
  if (FLAGS.resume && progress.exhibitors.length > 0) {
    console.log(`\nResuming with ${progress.exhibitors.length} exhibitors from checkpoint`);
    allExhibitors = progress.exhibitors;
  } else {
    allExhibitors = await fetchAllExhibitors();
    console.log(`\nTotal exhibitors fetched: ${allExhibitors.length}`);
    progress.exhibitors = allExhibitors;
    progress.phase = 'filter';
    saveProgress(progress);
  }

  // ── Phase 2: Filter to equipment companies ──
  let filtered;
  if (FLAGS.noFilter) {
    filtered = allExhibitors;
    console.log(`\nNo filter applied — keeping all ${filtered.length} exhibitors`);
  } else if (FLAGS.resume && progress.filtered.length > 0) {
    filtered = progress.filtered;
    console.log(`\nResuming with ${filtered.length} filtered exhibitors`);
  } else {
    filtered = allExhibitors.filter(e => isEquipmentCompany(e.name, e.description));
    console.log(`\nFiltered: ${filtered.length} equipment companies out of ${allExhibitors.length} total`);
    progress.filtered = filtered;
    progress.phase = 'details';
    saveProgress(progress);
  }

  // ── Phase 3: Fetch detail pages for contact info ──
  const startIdx = FLAGS.resume ? (progress.lastDetailIndex || 0) : 0;
  const detailsDone = new Set(progress.detailsDone || []);

  console.log(`\nFetching detail pages for ${filtered.length - startIdx} companies...\n`);

  let detailErrors = 0;
  for (let i = startIdx; i < filtered.length; i++) {
    const exh = filtered[i];

    if (detailsDone.has(exh.id)) continue;

    try {
      const detail = await fetchExhibitorDetail(exh.id);
      Object.assign(exh, detail);
      detailsDone.add(exh.id);
    } catch (err) {
      detailErrors++;
      console.log(`  Error: ${exh.name} (${exh.id}): ${err.message}`);
    }

    if ((i + 1) % 10 === 0) {
      process.stdout.write(`  ${i + 1}/${filtered.length} details fetched\r`);
    }

    // Checkpoint every 50
    if ((i + 1) % 50 === 0) {
      progress.filtered = filtered;
      progress.detailsDone = [...detailsDone];
      progress.lastDetailIndex = i + 1;
      saveProgress(progress);
      console.log(`  Checkpoint saved at ${i + 1}/${filtered.length}          `);
    }

    await sleep(DETAIL_DELAY_MS);
  }

  console.log(`\nDetail scraping complete (${detailErrors} errors)\n`);

  // ── Save final output ──
  const output = {
    source: 'CONEXPO-CON/AGG 2026',
    sourceUrl: 'https://directory.conexpoconagg.com',
    scrapedAt: new Date().toISOString(),
    totalExhibitors: filtered.length,
    filteredFrom: allExhibitors.length,
    exhibitors: filtered.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      website: e.website || '',
      phone: e.phone || '',
      address: e.address || {},
      contacts: e.contacts || [],
      social: e.social || {},
    })),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Saved ${filtered.length} exhibitors to ${OUTPUT_FILE}`);

  // Summary
  const withWebsite = filtered.filter(e => e.website).length;
  const withPhone = filtered.filter(e => e.phone).length;
  const withContacts = filtered.filter(e => e.contacts?.length > 0).length;
  const withAddress = filtered.filter(e => e.address?.city).length;
  const withEmail = filtered.filter(e => e.contacts?.some(c => c.email)).length;

  console.log('\n── Summary ──────────────────────────────────────');
  console.log(`Total equipment companies: ${filtered.length} (from ${allExhibitors.length} exhibitors)`);
  console.log(`With website:             ${withWebsite}`);
  console.log(`With phone:               ${withPhone}`);
  console.log(`With contact email:       ${withEmail}`);
  console.log(`With contacts:            ${withContacts}`);
  console.log(`With address:             ${withAddress}`);
  console.log('─────────────────────────────────────────────────\n');

  // Cleanup
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// @ts-nocheck
/**
 * Scrape Kalyn Siebert (kalynsiebert.com) trailer product catalog
 *
 * Kalyn Siebert manufactures a wide range of trailers including Heavy Haul
 * (Diamondback, RGN, Sliding Axle, SlideMAXX, VersaMAXX), Construction
 * (Step Deck, Platform Deck, MiniDECK), Agriculture (Chip Van), Oil & Gas
 * (LBO, SNO, Oilfield Chassis), ISO Systems, Data Center, and Defense
 * (Tactical Trailers, Vans). Based in Gatesville, TX, Kalyn Siebert is
 * known for custom-engineered heavy haul and oilfield trailers.
 *
 * This scraper discovers product pages from their /all-trailers/ section
 * and individual /project/ pages, extracts specs, images, and descriptions,
 * and upserts them into the manufacturer_products tables via shared utilities.
 *
 * Usage:  node scripts/scrape-mfr-kalyn-siebert.mjs
 */

import {
  createBrowser,
  createPage,
  getSupabaseClient,
  getManufacturerId,
  upsertProduct,
  upsertProductImages,
  upsertProductSpecs,
  updateProductCount,
  sleep,
  cleanText,
  parseWeight,
  parseTonnage,
  parseDeckHeight,
  parseLength,
  slugify,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'kalyn-siebert';
const MANUFACTURER_NAME = 'Kalyn Siebert';
const WEBSITE = 'https://kalynsiebert.com';

/** Starting pages to discover trailer products */
const SEED_URLS = [
  'https://kalynsiebert.com/all-trailers/',
];

/** Direct product pages we know about (fallbacks in case discovery misses them) */
const KNOWN_PRODUCT_PAGES = [
  // Agriculture
  'https://kalynsiebert.com/project/ag-chip-van/',
  'https://kalynsiebert.com/project/chip-van/',
  // Data Centers
  'https://kalynsiebert.com/project/data-center-trailer/',
  // Heavy Haul
  'https://kalynsiebert.com/project/diamondback/',
  'https://kalynsiebert.com/project/heavy-haul/',
  'https://kalynsiebert.com/project/lightweight-50t/',
  'https://kalynsiebert.com/project/removable-gooseneck-trailers/',
  'https://kalynsiebert.com/project/siebert-phoenix-sliding-axle/',
  'https://kalynsiebert.com/project/slidemaxx/',
  'https://kalynsiebert.com/project/sliding-axle/',
  'https://kalynsiebert.com/project/versamaxx/',
  // Construction
  'https://kalynsiebert.com/project/mini-deck/',
  'https://kalynsiebert.com/project/platform-deck/',
  'https://kalynsiebert.com/project/reset-recap-projects/',
  'https://kalynsiebert.com/project/step-deck/',
  // Oil & Gas
  'https://kalynsiebert.com/project/fixed-neck-low-boy-oilfield-lbo/',
  'https://kalynsiebert.com/project/ks-fueling-systems/',
  'https://kalynsiebert.com/project/o-g-integration/',
  'https://kalynsiebert.com/project/oilfield-equipment-chassis/',
  'https://kalynsiebert.com/project/heil-trailer-pressure-pumping-systems/',
  'https://kalynsiebert.com/project/scissors-neck-oilfield-sno/',
  // ISO
  'https://kalynsiebert.com/project/extendable-iso-chassis/',
  'https://kalynsiebert.com/project/iso-systems/',
  // Defense
  'https://kalynsiebert.com/project/tactical-trailers/',
  'https://kalynsiebert.com/project/vans/',
];

/**
 * Keywords that signal a page is a trailer product page.
 * Used to filter discovered links.
 */
const TRAILER_KEYWORDS = [
  'trailer', 'lowboy', 'low boy', 'removable', 'gooseneck', 'rgn',
  'heavy haul', 'detachable', 'tonnage', 'ton', 'step deck',
  'platform', 'chip van', 'oilfield', 'chassis', 'sliding axle',
  'hydraulic', 'mechanical', 'deck', 'diamondback', 'slidemaxx',
  'versamaxx', 'minideck', 'phoenix', 'tactical', 'iso', 'fueling',
  'data center', 'pressure pumping', 'scissors neck', 'fixed neck',
  'van', 'extendable',
];

/** Delay between page loads (ms) */
const PAGE_DELAY_MIN = 2000;
const PAGE_DELAY_MAX = 3500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomDelay() {
  return PAGE_DELAY_MIN + Math.random() * (PAGE_DELAY_MAX - PAGE_DELAY_MIN);
}

/**
 * Determine the product_type from a product name / description / category.
 */
function classifyProductType(name, description = '', category = '') {
  const text = `${name} ${description} ${category}`.toLowerCase();

  // ISO / Container
  if (/iso|container.?chassis/i.test(text)) return 'other';
  // Extendable
  if (/extendable/i.test(text) && !/iso/i.test(text)) return 'extendable';
  // Step deck
  if (/step.?deck/i.test(text)) return 'step-deck';
  // Dry van / chip van
  if (/chip.?van|ag.?chip|dry.?van/i.test(text)) return 'other';
  // Data center / specialized
  if (/data.?center|tactical|defense/i.test(text)) return 'other';
  // Vans (defense)
  if (/^vans$/i.test(name.trim())) return 'other';
  // Platform deck / construction
  if (/platform.?deck|mini.?deck/i.test(text)) return 'lowboy';
  // Oil & Gas / oilfield
  if (/oilfield|lbo|sno|fueling|pressure.?pump|o\s*&?\s*g/i.test(text)) return 'lowboy';
  // Heavy haul defaults
  if (/heavy.?haul|diamondback|rgn|removable.?gooseneck|sliding.?axle|slidemaxx|versamaxx|lightweight|phoenix/i.test(text)) return 'lowboy';
  // Reset/recap
  if (/reset|recap/i.test(text)) return 'lowboy';

  return 'lowboy'; // default for Kalyn Siebert
}

/**
 * Determine the gooseneck_type from product name / specs text.
 */
function classifyGooseneckType(name, specsText = '') {
  const text = `${name} ${specsText}`.toLowerCase();
  if (/hrg|hydraulic.?removable|hydraulic.?detach/i.test(text)) return 'hydraulic-detachable';
  if (/mrg|mech.?removable|mechanical.?detach|mech\b/i.test(text)) return 'mechanical-detachable';
  if (/sno|scissors.?neck/i.test(text)) return 'scissors';
  if (/fixed.?neck|lbo/i.test(text)) return 'fixed';
  if (/rgn|removable.?gooseneck|detach/i.test(text)) return 'detachable';
  if (/sliding.?axle|slide/i.test(text)) return null;
  return null;
}

/**
 * Detect series from the product name / URL.
 */
function detectSeries(name, url = '') {
  const text = `${name} ${url}`.toUpperCase();
  if (/DIAMONDBACK/i.test(text)) return 'Diamondback';
  if (/HRG/i.test(text)) return 'HRG';
  if (/MRG/i.test(text)) return 'MRG';
  if (/SLIDEMAXX/i.test(text)) return 'SlideMAXX';
  if (/VERSAMAXX/i.test(text)) return 'VersaMAXX';
  if (/MINIDECK|MINI.?DECK/i.test(text)) return 'MiniDECK';
  if (/PHOENIX/i.test(text)) return 'Phoenix';
  if (/SNO|SCISSORS.?NECK/i.test(text)) return 'SNO';
  if (/LBO|FIXED.?NECK.*OILFIELD/i.test(text)) return 'LBO';
  if (/STEP.?DECK/i.test(text)) return 'Step Deck';
  if (/PLATFORM.?DECK/i.test(text)) return 'Platform Deck';
  if (/CHIP.?VAN/i.test(text)) return 'Chip Van';
  if (/ISO/i.test(text)) return 'ISO';
  if (/TACTICAL/i.test(text)) return 'Tactical';
  if (/DATA.?CENTER/i.test(text)) return 'Data Center';
  if (/SLIDING.?AXLE/i.test(text)) return 'Sliding Axle';
  if (/HEAVY.?HAUL/i.test(text)) return 'Heavy Haul';
  if (/LIGHTWEIGHT/i.test(text)) return 'Lightweight';
  if (/RGN|REMOVABLE.?GOOSENECK/i.test(text)) return 'RGN';
  return null;
}

/**
 * Extract model number from a product name, URL, or spec text.
 * E.g. "KS-HRG-2-35T-DB" or "KS-RGN-2A-40T-MECH"
 */
function extractModelNumber(name, url = '', specsText = '') {
  const text = `${name} ${url} ${specsText}`.toUpperCase();

  // Match KS-* model numbers: KS-HRG-2-35T-DB, KS-RGN-2A-40T-MECH, etc.
  const ksMatch = text.match(/KS[-\s][A-Z0-9][-A-Z0-9]*/);
  if (ksMatch) return ksMatch[0].replace(/\s/g, '-');

  // Match standalone tonnage patterns like "50T" or "55T"
  const tonMatch = text.match(/(\d+)\s*T\b/);
  if (tonMatch) return `KS-${tonMatch[1]}T`;

  return null;
}

/**
 * Parse axle count from spec text.
 */
function parseAxleCount(text) {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(?:axle|axles)/i);
  if (match) return parseInt(match[1], 10);
  // Try standalone numbers near axle context
  const numMatch = text.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);
  return null;
}

/**
 * Map product name/category to estimated MSRP range.
 * Returns { low, high } or { low: null, high: null }.
 */
function estimateMsrp(name, category = '') {
  // Kalyn Siebert is a custom-build manufacturer; public MSRP data is sparse
  // We leave pricing null to avoid inaccurate estimates
  return { low: null, high: null };
}

/**
 * Map category string from the known products table to a normalized form.
 */
const PRODUCT_CATEGORIES = {
  'ag-chip-van': 'Agriculture',
  'chip-van': 'Agriculture',
  'data-center-trailer': 'Data Centers',
  'diamondback': 'Heavy Haul',
  'heavy-haul': 'Heavy Haul',
  'lightweight-50t': 'Heavy Haul',
  'removable-gooseneck-trailers': 'Heavy Haul',
  'siebert-phoenix-sliding-axle': 'Heavy Haul',
  'slidemaxx': 'Heavy Haul',
  'sliding-axle': 'Heavy Haul',
  'versamaxx': 'Heavy Haul',
  'mini-deck': 'Construction',
  'platform-deck': 'Construction',
  'reset-recap-projects': 'Construction',
  'step-deck': 'Construction',
  'fixed-neck-low-boy-oilfield-lbo': 'Oil & Gas',
  'ks-fueling-systems': 'Oil & Gas',
  'o-g-integration': 'Oil & Gas',
  'oilfield-equipment-chassis': 'Oil & Gas',
  'heil-trailer-pressure-pumping-systems': 'Oil & Gas',
  'scissors-neck-oilfield-sno': 'Oil & Gas',
  'extendable-iso-chassis': 'ISO',
  'iso-systems': 'ISO',
  'tactical-trailers': 'Defense',
  'vans': 'Defense',
};

/**
 * Extract the slug from a /project/<slug>/ URL.
 */
function extractSlugFromUrl(url) {
  const match = url.match(/\/project\/([^/]+)/);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

/**
 * Discover product page URLs from seed pages.
 */
async function discoverProductLinks(page) {
  const allLinks = new Set();

  for (const seedUrl of SEED_URLS) {
    console.log(`  Crawling seed page: ${seedUrl}`);
    try {
      await page.goto(seedUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await sleep(randomDelay());

      const links = await page.evaluate((baseUrl) => {
        const found = [];
        document.querySelectorAll('a[href]').forEach((a) => {
          const href = a.getAttribute('href');
          if (!href) return;
          const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;
          // Only keep links on kalynsiebert.com with /project/ path
          if (fullUrl.includes('kalynsiebert.com') && fullUrl.includes('/project/')) {
            found.push(fullUrl.replace(/\/$/, '') + '/');
          }
        });
        return [...new Set(found)];
      }, WEBSITE);

      links.forEach((l) => allLinks.add(l));
      console.log(`    Found ${links.length} links`);
    } catch (err) {
      console.error(`    Error crawling ${seedUrl}: ${err.message}`);
    }
  }

  // Add known product pages as fallbacks
  KNOWN_PRODUCT_PAGES.forEach((url) => {
    allLinks.add(url.replace(/\/$/, '') + '/');
  });

  // Filter to relevant product pages
  const filtered = [...allLinks].filter((url) => {
    const urlLower = url.toLowerCase();

    // Must contain /project/ path
    if (!urlLower.includes('/project/')) return false;

    // Skip non-product pages
    if (urlLower.includes('/contact') || urlLower.includes('/about')) return false;
    if (urlLower.includes('/news') || urlLower.includes('/blog')) return false;
    if (urlLower.includes('/careers') || urlLower.includes('/dealers')) return false;
    if (urlLower.includes('.pdf') || urlLower.includes('.jpg')) return false;

    return true;
  });

  // Deduplicate
  const unique = [...new Set(filtered)];
  console.log(`\n  Discovered ${unique.length} candidate product pages`);
  return unique;
}

/**
 * Scrape a single product page and return structured data.
 */
async function scrapeProductPage(page, url) {
  console.log(`\n  Scraping: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(randomDelay());
  } catch (err) {
    console.error(`    Navigation error: ${err.message}`);
    return null;
  }

  const pageData = await page.evaluate(() => {
    // --- Name / title (Kalyn Siebert uses h3 for product name, no h1/h2) ---
    const h1 = document.querySelector('h1');
    let name = h1 ? h1.textContent.trim() : '';
    // Fallback to first h3 (actual product heading on KS pages)
    if (!name) {
      const h3 = document.querySelector('h3');
      name = h3 ? h3.textContent.trim() : '';
    }
    // Final fallback: extract from page title (e.g. "Diamondback - Kalyn Siebert")
    if (!name) {
      const titleParts = document.title.split(' - ');
      if (titleParts.length > 1) name = titleParts[0].trim();
    }

    // --- Tagline (often in a subtitle or first prominent heading after h1) ---
    let tagline = '';
    const subtitle = document.querySelector(
      '.entry-subtitle, .page-subtitle, .hero-subtitle'
    );
    if (subtitle) {
      tagline = subtitle.textContent.trim();
    }

    // --- Description from Divi text modules ---
    let description = '';
    let shortDescription = '';
    const contentSelectors = [
      '.et_pb_text_inner p',
      '.et_pb_text p',
      '.entry-content p',
      '.page-content p',
      'article p',
      'main p',
      '.content p',
      '#content p',
    ];
    for (const sel of contentSelectors) {
      const paragraphs = document.querySelectorAll(sel);
      if (paragraphs.length > 0) {
        const texts = [];
        paragraphs.forEach((p) => {
          const t = p.textContent.trim();
          if (t.length > 20) texts.push(t);
        });
        if (texts.length > 0) {
          description = texts.join('\n\n');
          shortDescription = texts[0].substring(0, 300);
          break;
        }
      }
    }

    // --- Features list ---
    const features = [];
    document.querySelectorAll('ul li, ol li').forEach((li) => {
      const t = li.textContent.trim();
      if (t.length > 10 && t.length < 300) {
        features.push(t);
      }
    });
    if (features.length > 0 && !description) {
      description = features.join('\n');
    }

    // --- Specs from tablepress tables ---
    const specs = [];

    // TablePress tables (common on Kalyn Siebert detail pages)
    const tablePresses = document.querySelectorAll('table[id^="tablepress-"], .tablepress');
    tablePresses.forEach((table) => {
      const headers = [];
      const headerRow = table.querySelector('thead tr');
      if (headerRow) {
        headerRow.querySelectorAll('th, td').forEach((cell) => {
          headers.push(cell.textContent.trim());
        });
      }

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          if (headers.length > 0) {
            // Use headers as context: "Model: KS-HRG-2-35T-DB", "Length: 45'", etc.
            const modelName = cells[0] ? cells[0].textContent.trim() : '';
            for (let i = 1; i < cells.length && i < headers.length; i++) {
              const key = headers[i];
              const value = cells[i].textContent.trim();
              if (key && value && key.length < 100 && value.length < 200) {
                const prefix = modelName ? `${modelName} - ` : '';
                specs.push({ rawKey: `${prefix}${key}`, rawValue: value });
              }
            }
            // Also store the model number row itself
            if (modelName && headers[0]) {
              specs.push({ rawKey: headers[0], rawValue: modelName });
            }
          } else {
            // No headers - treat first cell as key, second as value
            const key = cells[0].textContent.trim();
            const value = cells[1].textContent.trim();
            if (key && value && key.length < 100 && value.length < 200) {
              specs.push({ rawKey: key, rawValue: value });
            }
          }
        }
      });
    });

    // Also look for regular tables (non-tablepress)
    const tables = document.querySelectorAll('table:not([id^="tablepress-"]):not(.tablepress)');
    tables.forEach((table) => {
      const rows = table.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 2) {
          const key = cells[0].textContent.trim();
          const value = cells[1].textContent.trim();
          if (key && value && key.length < 100 && value.length < 200) {
            specs.push({ rawKey: key, rawValue: value });
          }
        }
      });
    });

    // Also look for definition lists
    const dlItems = document.querySelectorAll('dl dt, dl dd');
    for (let i = 0; i < dlItems.length - 1; i += 2) {
      if (dlItems[i].tagName === 'DT' && dlItems[i + 1]?.tagName === 'DD') {
        const key = dlItems[i].textContent.trim();
        const value = dlItems[i + 1].textContent.trim();
        if (key && value) {
          specs.push({ rawKey: key, rawValue: value });
        }
      }
    }

    // Also look for spec-like key/value pairs in list items
    document.querySelectorAll('li, .spec-item, .feature-item').forEach((li) => {
      const text = li.textContent.trim();
      // Patterns like "Capacity: 110,000 lbs" or "Deck Height: 18""
      const kvMatch = text.match(/^([^:]{3,50}):\s*(.+)$/);
      if (kvMatch) {
        specs.push({ rawKey: kvMatch[1].trim(), rawValue: kvMatch[2].trim() });
      }
    });

    // Also look for strong/b tags followed by text (common spec format in Divi)
    document.querySelectorAll('.et_pb_text_inner p, .et_pb_text_inner div, p, div').forEach((el) => {
      const strongs = el.querySelectorAll('strong, b');
      strongs.forEach((strong) => {
        const key = strong.textContent.trim().replace(/:$/, '');
        const fullText = el.textContent.trim();
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const valueMatch = fullText.match(
          new RegExp(escapedKey + '[:\\s]+(.+)', 'i')
        );
        if (valueMatch && key.length > 2 && key.length < 80) {
          specs.push({ rawKey: key, rawValue: valueMatch[1].trim() });
        }
      });
    });

    // --- Images ---
    const images = [];
    const seenUrls = new Set();

    // Priority 1: BWG gallery images (Photo Gallery plugin)
    document.querySelectorAll(
      '.bwg-container img, .bwg-standard-thumbnails img, .bwg_standart_thumb img, ' +
      '#bwg_carousel0 img, .bwg-carousel img, .bwg_slideshow_image_wrap img'
    ).forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src') ||
        img.getAttribute('data-original');
      if (!src) return;
      const normalizedSrc = src.split('?')[0];
      if (seenUrls.has(normalizedSrc)) return;
      seenUrls.add(normalizedSrc);
      images.push({ url: src, alt: img.alt || '' });
    });

    // Priority 2: Divi image module images
    document.querySelectorAll('.et_pb_image_wrap img, .et_pb_gallery_image img').forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (!src) return;
      const normalizedSrc = src.split('?')[0];
      if (seenUrls.has(normalizedSrc)) return;
      seenUrls.add(normalizedSrc);
      images.push({ url: src, alt: img.alt || '' });
    });

    // Priority 3: General img tags (with filtering)
    document.querySelectorAll('img').forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (!src) return;
      // Skip tiny icons, logos, etc.
      if (src.includes('logo') || src.includes('icon') || src.includes('favicon')) return;
      if (src.includes('.gif') || src.includes('.svg')) return;
      if (src.includes('gravatar') || src.includes('wp-content/plugins')) return;
      // Only keep kalynsiebert.com domain images or wp-content paths
      if (!src.includes('kalynsiebert.com') && !src.includes('wp-content')) return;

      const width = img.naturalWidth || img.width || 0;
      if (width > 0 && width < 50) return; // skip tiny images

      const normalizedSrc = src.split('?')[0];
      if (seenUrls.has(normalizedSrc)) return;
      seenUrls.add(normalizedSrc);

      images.push({
        url: src,
        alt: img.alt || '',
      });
    });

    // --- Body text for classification ---
    const bodyText = document.body ? document.body.textContent.substring(0, 5000) : '';

    return { name, tagline, description, shortDescription, features, specs, images, bodyText };
  });

  if (!pageData || !pageData.name) {
    console.log('    No product name found, skipping');
    return null;
  }

  console.log(`    Name: ${pageData.name}`);
  console.log(`    Specs found: ${pageData.specs.length}`);
  console.log(`    Images found: ${pageData.images.length}`);
  console.log(`    Features found: ${pageData.features?.length || 0}`);

  return { ...pageData, sourceUrl: url };
}

/**
 * Categorize raw specs into structured spec objects.
 */
function categorizeSpecs(rawSpecs) {
  const specs = [];
  const seen = new Set();

  for (const { rawKey, rawValue } of rawSpecs) {
    const key = rawKey.trim();
    const value = rawValue.trim();
    const dedup = `${key}|${value}`;
    if (seen.has(dedup)) continue;
    seen.add(dedup);

    const keyLower = key.toLowerCase();

    // Classify by key content
    let category = 'General';
    let unit = null;

    if (/capacity|payload|gvwr|weight|tonnage|ton/i.test(keyLower)) {
      category = 'Capacity';
      if (/lbs?|pounds?/i.test(value)) unit = 'lbs';
      else if (/ton/i.test(value)) unit = 'tons';
    } else if (/model/i.test(keyLower)) {
      category = 'Model';
    } else if (/deck|height|length|width|clearance|swing|loading.?angle/i.test(keyLower)) {
      category = 'Dimensions';
      if (/["'']/i.test(value) || /inch/i.test(value)) unit = 'in';
      else if (/['']/i.test(value) || /feet|ft/i.test(value)) unit = 'ft';
      else if (/degree/i.test(value)) unit = 'degrees';
    } else if (/axle|suspension|tire|wheel|brake/i.test(keyLower)) {
      category = 'Running Gear';
    } else if (/gooseneck|kingpin|hitch|fifth.?wheel/i.test(keyLower)) {
      category = 'Gooseneck';
    } else if (/hydraulic|cylinder|pump/i.test(keyLower)) {
      category = 'Hydraulics';
    } else if (/deck|floor|wood|platform/i.test(keyLower)) {
      category = 'Decking';
    } else if (/light|electric|wiring|harness/i.test(keyLower)) {
      category = 'Electrical';
    } else if (/frame|beam|steel|structural|i-beam/i.test(keyLower)) {
      category = 'Frame';
    } else if (/paint|finish|coating/i.test(keyLower)) {
      category = 'Finish';
    } else if (/outrigger|ramp|swing|accessori/i.test(keyLower)) {
      category = 'Accessories';
    } else if (/extend|retract/i.test(keyLower)) {
      category = 'Extension';
    } else if (/fuel|tank|pump/i.test(keyLower)) {
      category = 'Fuel Systems';
    } else if (/iso|container|chassis/i.test(keyLower)) {
      category = 'ISO / Container';
    }

    specs.push({ category, key, value, unit });
  }

  return specs;
}

/**
 * Build key features as additional spec entries for Kalyn Siebert products.
 * Kalyn Siebert trailers have well-known features that may not appear
 * in the scraped specs but should be recorded.
 */
function buildKalynSiebertFeatureSpecs(name, description, existingSpecs) {
  const featureSpecs = [];
  const combined = `${name} ${description}`.toLowerCase();
  const existingKeys = new Set(existingSpecs.map((s) => s.key.toLowerCase()));

  // Hydraulic removable gooseneck
  if (combined.includes('hydraulic') && combined.includes('removable')) {
    if (!existingKeys.has('gooseneck type')) {
      featureSpecs.push({
        category: 'Gooseneck',
        key: 'Gooseneck Type',
        value: 'Hydraulic removable gooseneck',
        unit: null,
      });
    }
  }

  // Mechanical removable gooseneck
  if (combined.includes('mechanical') && combined.includes('removable')) {
    if (!existingKeys.has('gooseneck type')) {
      featureSpecs.push({
        category: 'Gooseneck',
        key: 'Gooseneck Type',
        value: 'Mechanical removable gooseneck',
        unit: null,
      });
    }
  }

  // Scissors neck
  if (combined.includes('scissors') || combined.includes('sno')) {
    if (!existingKeys.has('neck type')) {
      featureSpecs.push({
        category: 'Gooseneck',
        key: 'Neck Type',
        value: 'Scissors neck oilfield',
        unit: null,
      });
    }
  }

  // Sliding axle
  if (combined.includes('sliding axle')) {
    if (!existingKeys.has('axle configuration')) {
      featureSpecs.push({
        category: 'Running Gear',
        key: 'Axle Configuration',
        value: 'Sliding axle',
        unit: null,
      });
    }
  }

  // Extendable
  if (combined.includes('extendable')) {
    if (!existingKeys.has('deck extension')) {
      featureSpecs.push({
        category: 'Extension',
        key: 'Deck Extension',
        value: 'Extendable',
        unit: null,
      });
    }
  }

  return featureSpecs;
}

/**
 * Build structured product data from scraped page data.
 */
function buildProduct(pageData) {
  const { name, tagline, description, shortDescription, specs: rawSpecs, sourceUrl } = pageData;

  // Determine category from known product mapping
  const slug = extractSlugFromUrl(sourceUrl);
  const category = slug ? (PRODUCT_CATEGORIES[slug] || '') : '';

  // Combine all spec values for searching
  const allSpecText = rawSpecs.map((s) => `${s.rawKey}: ${s.rawValue}`).join(' ');
  const combinedText = `${name} ${description} ${allSpecText}`;

  // Tonnage
  let tonnageMin = null;
  let tonnageMax = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/capacity|tonnage|ton|payload/i.test(rawKey)) {
      const t = parseTonnage(rawValue);
      if (t.min) {
        if (!tonnageMin || t.min < tonnageMin) tonnageMin = t.min;
        if (!tonnageMax || t.max > tonnageMax) tonnageMax = t.max;
      }
    }
  }
  // Fallback: search combined text for tonnage
  if (!tonnageMin) {
    const tonMatch = combinedText.match(/(\d+)\s*[-–]?\s*(?:to\s*)?(\d+)?\s*ton/i);
    if (tonMatch) {
      tonnageMin = parseInt(tonMatch[1], 10);
      tonnageMax = tonMatch[2] ? parseInt(tonMatch[2], 10) : tonnageMin;
    }
  }
  // Fallback: extract tonnage from name (e.g., "Lightweight 50T" -> 50)
  if (!tonnageMin) {
    const nameTon = name.match(/(\d+)\s*T\b/i);
    if (nameTon) {
      tonnageMin = parseInt(nameTon[1], 10);
      tonnageMax = tonnageMin;
    }
  }

  // Deck height
  let deckHeightInches = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/deck.?height|loaded.?height/i.test(rawKey)) {
      deckHeightInches = parseDeckHeight(rawValue);
      if (deckHeightInches) break;
    }
  }

  // Deck length
  let deckLengthFeet = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/deck.?length|well.?length|loading.?length/i.test(rawKey)) {
      deckLengthFeet = parseLength(rawValue);
      if (deckLengthFeet) break;
    }
  }
  // Fallback: try "Length" column from tablepress
  if (!deckLengthFeet) {
    for (const { rawKey, rawValue } of rawSpecs) {
      if (/length/i.test(rawKey) && !/overall/i.test(rawKey)) {
        deckLengthFeet = parseLength(rawValue);
        if (deckLengthFeet) break;
      }
    }
  }

  // Overall length
  let overallLengthFeet = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/overall.?length|total.?length/i.test(rawKey)) {
      overallLengthFeet = parseLength(rawValue);
      if (overallLengthFeet) break;
    }
  }

  // Axle count
  let axleCount = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/axle/i.test(rawKey)) {
      axleCount = parseAxleCount(rawValue);
      if (axleCount) break;
    }
  }
  // Fallback: extract axle count from model numbers (e.g., KS-HRG-2-35T -> 2 axles, KS-HRG-3-50T -> 3 axles)
  if (!axleCount) {
    const axleFromModel = combinedText.match(/KS[-\s](?:HRG|RGN|MRG|SNO|LBO)[-\s](\d)[A-Z]?[-\s]/i);
    if (axleFromModel) {
      axleCount = parseInt(axleFromModel[1], 10);
    }
  }

  // Empty weight
  let emptyWeightLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/empty.?weight|tare.?weight|unladen/i.test(rawKey)) {
      emptyWeightLbs = parseWeight(rawValue);
      if (emptyWeightLbs) break;
    }
  }
  // Fallback: search body text
  if (!emptyWeightLbs) {
    const weightMatch = combinedText.match(/(?:empty|tare|unladen)\s*(?:weight)?\s*[:=]?\s*([\d,]+)\s*(?:lbs?|pounds?)/i);
    if (weightMatch) {
      emptyWeightLbs = parseWeight(weightMatch[1] + ' lbs');
    }
  }

  // GVWR
  let gvwrLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/gvwr|gross.?vehicle|gross.?weight/i.test(rawKey)) {
      gvwrLbs = parseWeight(rawValue);
      if (gvwrLbs) break;
    }
  }

  // Concentrated capacity
  let concentratedCapacityLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/concentrated|max.?payload|capacity.*lbs/i.test(rawKey)) {
      concentratedCapacityLbs = parseWeight(rawValue);
      if (concentratedCapacityLbs) break;
    }
  }

  const modelNumber = extractModelNumber(name, sourceUrl, allSpecText);
  const series = detectSeries(name, sourceUrl);
  const productType = classifyProductType(name, description, category);
  const gooseneckType = classifyGooseneckType(name, allSpecText);
  const msrp = estimateMsrp(name, category);

  return {
    name: cleanText(name),
    series,
    model_number: modelNumber,
    tagline: cleanText(tagline) || null,
    description: cleanText(description) || null,
    short_description: cleanText(shortDescription) || null,
    product_type: productType,
    tonnage_min: tonnageMin,
    tonnage_max: tonnageMax,
    deck_height_inches: deckHeightInches,
    deck_length_feet: deckLengthFeet,
    overall_length_feet: overallLengthFeet,
    axle_count: axleCount,
    gooseneck_type: gooseneckType,
    empty_weight_lbs: emptyWeightLbs,
    gvwr_lbs: gvwrLbs,
    concentrated_capacity_lbs: concentratedCapacityLbs,
    msrp_low: msrp.low,
    msrp_high: msrp.high,
    source_url: sourceUrl,
  };
}

/**
 * Build images array for upsertProductImages.
 */
function buildImages(pageData) {
  return pageData.images.map((img) => ({
    url: img.url,
    alt_text: img.alt || `${pageData.name} Kalyn Siebert trailer`,
    source_url: pageData.sourceUrl,
  }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  printBanner(MANUFACTURER_NAME, WEBSITE);

  const supabase = getSupabaseClient();
  const manufacturerId = await getManufacturerId(supabase, MANUFACTURER_SLUG);
  console.log(`  Manufacturer ID: ${manufacturerId}\n`);

  const browser = await createBrowser('new');
  const page = await createPage(browser);

  const stats = { scraped: 0, upserted: 0, errors: 0 };

  try {
    // ------------------------------------------------------------------
    // Step 1: Discover product page URLs
    // ------------------------------------------------------------------
    console.log('Step 1: Discovering product pages...\n');
    const productUrls = await discoverProductLinks(page);

    if (productUrls.length === 0) {
      console.error('  No product pages discovered! Aborting.');
      await browser.close();
      return;
    }

    // Deduplicate by normalizing URLs
    const uniqueUrls = [...new Set(productUrls.map((u) => u.replace(/\/$/, '') + '/'))];
    console.log(`\n  ${uniqueUrls.length} unique product pages to scrape\n`);

    // ------------------------------------------------------------------
    // Step 2: Scrape each product page
    // ------------------------------------------------------------------
    console.log('Step 2: Scraping individual product pages...');

    for (let i = 0; i < uniqueUrls.length; i++) {
      const url = uniqueUrls[i];
      console.log(`\n[${i + 1}/${uniqueUrls.length}] ${url}`);

      try {
        const pageData = await scrapeProductPage(page, url);
        if (!pageData) {
          stats.errors++;
          continue;
        }
        stats.scraped++;

        // Build structured data
        const product = buildProduct(pageData);
        const images = buildImages(pageData);
        const baseSpecs = categorizeSpecs(pageData.specs);
        // Enrich with known Kalyn Siebert feature specs
        const featureSpecs = buildKalynSiebertFeatureSpecs(
          product.name,
          product.description || '',
          baseSpecs
        );
        const specs = [...baseSpecs, ...featureSpecs];

        console.log(`    Product type: ${product.product_type}`);
        console.log(`    Series: ${product.series || 'N/A'}`);
        console.log(`    Model: ${product.model_number || 'N/A'}`);
        console.log(`    Tonnage: ${product.tonnage_min || '?'}-${product.tonnage_max || '?'} ton`);
        console.log(`    Gooseneck: ${product.gooseneck_type || 'N/A'}`);
        console.log(`    Specs: ${specs.length}, Images: ${images.length}`);
        if (product.msrp_low) {
          console.log(`    MSRP: $${product.msrp_low.toLocaleString()}-$${product.msrp_high.toLocaleString()}`);
        }

        // ------------------------------------------------------------------
        // Step 3: Upsert to DB
        // ------------------------------------------------------------------
        const productId = await upsertProduct(supabase, manufacturerId, product);
        if (!productId) {
          console.error('    Failed to upsert product');
          stats.errors++;
          continue;
        }

        await upsertProductImages(supabase, productId, images);
        await upsertProductSpecs(supabase, productId, specs);

        stats.upserted++;
        console.log(`    Upserted product ID: ${productId}`);
      } catch (err) {
        console.error(`    Error processing ${url}: ${err.message}`);
        stats.errors++;
      }

      // Polite delay between page loads
      if (i < uniqueUrls.length - 1) {
        await sleep(randomDelay());
      }
    }

    // ------------------------------------------------------------------
    // Step 4: Update product count
    // ------------------------------------------------------------------
    console.log('\nStep 3: Updating product count...');
    const count = await updateProductCount(supabase, manufacturerId);
    console.log(`  Active products: ${count}`);
  } catch (err) {
    console.error(`Fatal error: ${err.message}`);
    stats.errors++;
  } finally {
    await browser.close();
  }

  printSummary(MANUFACTURER_NAME, stats);
}

main().catch(console.error);

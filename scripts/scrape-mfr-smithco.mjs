// @ts-nocheck
/**
 * Scrape SmithCo side dump trailer product catalog
 *
 * SmithCo (sidedump.com) manufactures side dump trailers including
 * the SX Series, CP Series (Construction Pup), Mine Series, Tub models,
 * Truck Mount Boxes (TMB), Double Tub, A-Trains & B-Trains, and Feedlot
 * Series. Based in Le Mars, Iowa, SmithCo is the world's leading
 * manufacturer of side dump trailers.
 *
 * This scraper discovers product pages from their /products/ section,
 * extracts specs, images, and descriptions, and upserts them into the
 * manufacturer_products tables via shared utilities.
 *
 * Usage:  node scripts/scrape-mfr-smithco.mjs
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

const MANUFACTURER_SLUG = 'smithco';
const MANUFACTURER_NAME = 'SmithCo';
const WEBSITE = 'https://sidedump.com';

/** Starting pages to discover side dump products */
const SEED_URLS = [
  'https://sidedump.com/products',
  'https://sidedump.com/products/sx-series',
  'https://sidedump.com/products/cp-series',
  'https://sidedump.com/products/mine-series',
];

/** Direct product pages we know about (fallbacks in case discovery misses them) */
const KNOWN_PRODUCT_PAGES = [
  // SX Series (Side Dump Trailers)
  'https://sidedump.com/products/sx-series/sx1',
  'https://sidedump.com/products/sx-series/sx2',
  'https://sidedump.com/products/sx-series/sx3',
  'https://sidedump.com/products/sx-series/sx4',
  'https://sidedump.com/products/sx-series/sx5',
  'https://sidedump.com/products/sx-series/sx6',
  'https://sidedump.com/products/sx-series/sx7',
  // CP Series (Construction Pup)
  'https://sidedump.com/products/cp-series/brute',
  'https://sidedump.com/products/cp-series/cpshv20',
  'https://sidedump.com/products/cp-series/agriculture-pup',
  // Other Product Lines
  'https://sidedump.com/products/mhvsr-tub',
  'https://sidedump.com/products/shv-tub',
  'https://sidedump.com/products/truck-mount-boxes',
  'https://sidedump.com/products/mine-series/mine-trailers',
  'https://sidedump.com/products/mine-series/double-tub-mine-trailers',
  'https://sidedump.com/products/double-tub-series',
  'https://sidedump.com/products/a-trains-b-trains',
  'https://sidedump.com/products/feedlot-series',
];

/**
 * Keywords that signal a page is a side dump product.
 * Used to filter discovered links.
 */
const SIDEDUMP_KEYWORDS = [
  'side dump', 'sidedump', 'side-dump', 'tub', 'dump trailer',
  'sx series', 'cp series', 'mine series', 'feedlot', 'brute',
  'truck mount', 'double tub', 'a-train', 'b-train', 'pup',
  'construction pup', 'agriculture', 'mhvsr', 'shv', 'tmb',
  'payload', 'cubic yard', 'cu yd', 'walking beam',
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
 * Determine the product_type from a product name / description.
 * All SmithCo products are side dump trailers.
 */
function classifyProductType(_name, _description = '') {
  return 'other'; // side dump trailers — not in standard enum
}

/**
 * Detect series from the product name / URL.
 */
function detectSeries(name, url = '') {
  const text = `${name} ${url}`.toLowerCase();
  if (/sx[-\s]?series|\/sx-series\//i.test(text)) return 'SX Series';
  if (/\bsx[1-7]\b/i.test(text)) return 'SX Series';
  if (/cp[-\s]?series|\/cp-series\//i.test(text)) return 'CP Series';
  if (/\bbrute\b/i.test(text) && /cp|pup|construction/i.test(text)) return 'CP Series';
  if (/\bcpshv/i.test(text)) return 'CP Series';
  if (/agriculture[-\s]?pup/i.test(text)) return 'CP Series';
  if (/mine[-\s]?series|\/mine-series\//i.test(text)) return 'Mine Series';
  if (/double[-\s]?tub[-\s]?series|\/double-tub-series/i.test(text)) return 'Double Tub Series';
  if (/double[-\s]?tub.*mine/i.test(text)) return 'Mine Series';
  if (/truck[-\s]?mount|\/truck-mount/i.test(text)) return 'TMB';
  if (/\bmhvsr\b/i.test(text)) return 'Tub';
  if (/\bshv[-\s]?tub\b/i.test(text)) return 'Tub';
  if (/a[-\s]?train|b[-\s]?train|\/a-trains/i.test(text)) return 'A-Train/B-Train';
  if (/feedlot|\/feedlot/i.test(text)) return 'Feedlot Series';
  return null;
}

/**
 * Extract model number from a product name or URL.
 * E.g. "SX1", "SX7", "CP20", "CP30", "CPSHV20", "MHVSR", "SHV", "TMB"
 */
function extractModelNumber(name, url = '') {
  const text = `${name} ${url}`.toUpperCase();

  // Match SX models: SX1-SX7
  const sxMatch = text.match(/\bSX([1-7])\b/);
  if (sxMatch) return `SX${sxMatch[1]}`;

  // Match CPSHV models: CPSHV20
  const cpshvMatch = text.match(/\bCPSHV\d*/);
  if (cpshvMatch) return cpshvMatch[0];

  // Match CP models: CP20, CP30
  const cpMatch = text.match(/\bCP(\d+)\b/);
  if (cpMatch) return `CP${cpMatch[1]}`;

  // Match BRUTE (CP30)
  if (/\bBRUTE\b/.test(text)) return 'CP30';

  // Match MHVSR
  if (/\bMHVSR\b/.test(text)) return 'MHVSR';

  // Match SHV (but not CPSHV)
  if (/\bSHV\b/.test(text) && !/CPSHV/.test(text)) return 'SHV';

  // Match TMB (Truck Mount Boxes)
  if (/\bTMB\b/.test(text) || /TRUCK\s*MOUNT/.test(text)) return 'TMB';

  return null;
}

/**
 * Parse cubic yard capacity from spec text.
 */
function parseCubicYards(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/([\d.]+)\s*(?:cu\.?\s*(?:yd|yard)|cubic\s*yard)/i);
  if (match) return parseFloat(match[1]);
  return null;
}

/**
 * Parse PSI rating from spec text.
 */
function parsePsi(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/([\d,]+)\s*PSI/i);
  if (match) return parseInt(match[1].replace(/,/g, ''), 10);
  return null;
}

/**
 * Parse axle count from spec text.
 */
function parseAxleCount(text) {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(?:axle|axles)/i);
  if (match) return parseInt(match[1], 10);
  // Check for common descriptions
  if (/single\s*axle/i.test(text)) return 1;
  if (/tandem/i.test(text)) return 2;
  if (/tridem|tri[-\s]?axle/i.test(text)) return 3;
  const numMatch = text.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);
  return null;
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
          // Only keep links on sidedump.com
          if (fullUrl.includes('sidedump.com')) {
            found.push(fullUrl.replace(/\/$/, ''));
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
    allLinks.add(url.replace(/\/$/, ''));
  });

  // Filter to relevant product pages
  const filtered = [...allLinks].filter((url) => {
    const urlLower = url.toLowerCase();

    // Must be under /products/
    if (!urlLower.includes('/products/')) return false;

    // Skip the top-level /products page (category listing)
    if (urlLower === 'https://sidedump.com/products') return false;

    // Skip category index pages that just list sub-products
    // (keep them only if they don't have sub-pages in our known list)
    const categoryPages = [
      'https://sidedump.com/products/sx-series',
      'https://sidedump.com/products/cp-series',
      'https://sidedump.com/products/mine-series',
    ];
    if (categoryPages.includes(urlLower.replace(/\/$/, ''))) return false;

    // Skip non-product pages
    if (urlLower.includes('/contact')) return false;
    if (urlLower.includes('/about')) return false;
    if (urlLower.includes('/news') || urlLower.includes('/blog')) return false;
    if (urlLower.includes('/dealers') || urlLower.includes('/careers')) return false;
    if (urlLower.includes('.pdf') || urlLower.includes('.jpg')) return false;
    if (urlLower.includes('.png') || urlLower.includes('.gif')) return false;

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
    // --- Name / title ---
    const h1 = document.querySelector('h1');
    let name = h1 ? h1.textContent.trim() : '';

    // Fallback to h2 if no h1
    if (!name) {
      const h2 = document.querySelector('h2');
      name = h2 ? h2.textContent.trim() : '';
    }

    // --- Tagline (often in a subtitle or prominent heading) ---
    let tagline = '';
    const subtitle = document.querySelector(
      '.subtitle, .hero-subtitle, .page-subtitle'
    );
    if (subtitle) {
      tagline = subtitle.textContent.trim();
    }
    // Fallback: use first h2 if h1 was the name
    if (!tagline && h1) {
      const h2 = document.querySelector('h2');
      if (h2 && h2.textContent.trim() !== name) {
        tagline = h2.textContent.trim();
      }
    }

    // --- Description ---
    let description = '';
    let shortDescription = '';
    const contentSelectors = [
      'main p',
      'article p',
      '.content p',
      '.product-description p',
      '.overview p',
      'section p',
      '#content p',
      'p',
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

    // --- Specs table / list ---
    const specs = [];

    // Look for specification tables (generic HTML tables)
    const tables = document.querySelectorAll('table');
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

    // Look for key:value pairs in list items
    document.querySelectorAll('li').forEach((li) => {
      const text = li.textContent.trim();
      // Patterns like "Tub Capacity: 15.3 cubic yards" or "Payload Rating: 30 tons"
      const kvMatch = text.match(/^([^:]{3,60}):\s*(.+)$/);
      if (kvMatch) {
        specs.push({ rawKey: kvMatch[1].trim(), rawValue: kvMatch[2].trim() });
      }
    });

    // Look for strong/b tags followed by text (common spec format)
    document.querySelectorAll('p, div').forEach((el) => {
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

    // Look for heading + adjacent content patterns (tabbed spec sections)
    document.querySelectorAll('h3, h4, h5').forEach((heading) => {
      const headingText = heading.textContent.trim().toLowerCase();
      if (/spec|dimension|capacity|feature/i.test(headingText)) {
        // Check sibling elements for spec data
        let sibling = heading.nextElementSibling;
        while (sibling && !['H1', 'H2', 'H3', 'H4', 'H5'].includes(sibling.tagName)) {
          if (sibling.tagName === 'TABLE') {
            const rows = sibling.querySelectorAll('tr');
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
          }
          sibling = sibling.nextElementSibling;
        }
      }
    });

    // --- Images ---
    const images = [];
    const seenUrls = new Set();
    document.querySelectorAll('img').forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (!src) return;
      // Skip tiny icons, logos, etc.
      if (src.includes('logo') || src.includes('icon') || src.includes('favicon')) return;
      if (src.includes('.gif') || src.includes('.svg')) return;
      if (src.includes('gravatar')) return;
      // Only keep sidedump.com domain images
      if (!src.includes('sidedump.com')) return;

      const width = img.naturalWidth || img.width || 0;
      if (width > 0 && width < 50) return; // skip tiny images

      const normalizedSrc = src.split('?')[0]; // remove query params for dedup
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

    if (/capacity|payload|tonnage|ton|cubic|cu\.?\s*yd|volume/i.test(keyLower)) {
      category = 'Capacity';
      if (/lbs?|pounds?/i.test(value)) unit = 'lbs';
      else if (/ton/i.test(value)) unit = 'tons';
      else if (/cu\.?\s*y|cubic\s*yard/i.test(value)) unit = 'cu yd';
    } else if (/length|width|height|clearance|dimension|frame\s*length/i.test(keyLower)) {
      category = 'Dimensions';
      if (/["'']/i.test(value) || /inch/i.test(value)) unit = 'in';
      else if (/['']/i.test(value) || /feet|ft/i.test(value)) unit = 'ft';
    } else if (/axle|suspension|tire|wheel|brake|walking\s*beam/i.test(keyLower)) {
      category = 'Running Gear';
      if (/\bk\b/i.test(value) || /capacity/i.test(value)) unit = 'lbs';
    } else if (/hydraulic|cylinder|psi|bore|pump|hoist/i.test(keyLower)) {
      category = 'Hydraulics';
      if (/psi/i.test(value)) unit = 'PSI';
      else if (/["'']/i.test(value) || /bore/i.test(value)) unit = 'in';
    } else if (/frame|steel|material|tub\s*material|ar\s*\d+|floor/i.test(keyLower)) {
      category = 'Frame';
    } else if (/gooseneck|kingpin|hitch|fifth.?wheel/i.test(keyLower)) {
      category = 'Gooseneck';
    } else if (/light|electric|wiring|harness/i.test(keyLower)) {
      category = 'Electrical';
    } else if (/paint|finish|coating/i.test(keyLower)) {
      category = 'Finish';
    } else if (/model|popular/i.test(keyLower)) {
      category = 'Models';
    } else if (/tub|hopper|box/i.test(keyLower)) {
      category = 'Tub';
      if (/cu\.?\s*y|cubic\s*yard/i.test(value)) unit = 'cu yd';
    }

    specs.push({ category, key, value, unit });
  }

  return specs;
}

/**
 * Build key features as additional spec entries for SmithCo products.
 * SmithCo side dump trailers have well-known features that may not appear
 * in the scraped specs but should be recorded.
 */
function buildSmithCoFeatureSpecs(name, description, existingSpecs) {
  const featureSpecs = [];
  const combined = `${name} ${description}`.toLowerCase();
  const existingKeys = new Set(existingSpecs.map((s) => s.key.toLowerCase()));

  // AR450 Steel construction
  if (combined.includes('ar450') || combined.includes('ar 450')) {
    if (!existingKeys.has('tub material')) {
      featureSpecs.push({
        category: 'Frame',
        key: 'Tub Material',
        value: 'AR450 Steel',
        unit: null,
      });
    }
  }

  // One-piece floor
  if (combined.includes('one-piece') && combined.includes('floor')) {
    if (!existingKeys.has('floor construction')) {
      featureSpecs.push({
        category: 'Frame',
        key: 'Floor Construction',
        value: 'One-piece floor',
        unit: null,
      });
    }
  }

  // Walking beam suspension
  if (combined.includes('walking beam')) {
    if (!existingKeys.has('suspension type')) {
      featureSpecs.push({
        category: 'Running Gear',
        key: 'Suspension Type',
        value: 'Walking beam',
        unit: null,
      });
    }
  }

  // Side dump mechanism
  if (!existingKeys.has('dump type')) {
    featureSpecs.push({
      category: 'General',
      key: 'Dump Type',
      value: 'Side dump',
      unit: null,
    });
  }

  return featureSpecs;
}

/**
 * Build structured product data from scraped page data.
 */
function buildProduct(pageData) {
  const { name, tagline, description, shortDescription, specs: rawSpecs, sourceUrl } = pageData;

  // Combine all spec values for searching
  const allSpecText = rawSpecs.map((s) => `${s.rawKey}: ${s.rawValue}`).join(' ');
  const combinedText = `${name} ${description} ${allSpecText}`;

  // Tonnage / payload
  let tonnageMin = null;
  let tonnageMax = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/payload|tonnage|ton|capacity.*ton/i.test(rawKey) || /payload|tonnage/i.test(rawKey)) {
      const t = parseTonnage(rawValue);
      if (t.min) {
        tonnageMin = t.min;
        tonnageMax = t.max;
        break;
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
  // Fallback: parse payload in lbs and convert to tons
  if (!tonnageMin) {
    for (const { rawKey, rawValue } of rawSpecs) {
      if (/payload|rating/i.test(rawKey)) {
        const weight = parseWeight(rawValue);
        if (weight && weight > 1000) {
          tonnageMin = Math.round(weight / 2000);
          tonnageMax = tonnageMin;
          break;
        }
      }
    }
  }

  // Deck height (not typical for side dumps but check anyway)
  let deckHeightInches = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/height|deck.?height|loaded.?height/i.test(rawKey)) {
      deckHeightInches = parseDeckHeight(rawValue);
      if (deckHeightInches) break;
    }
  }

  // Overall / frame length
  let deckLengthFeet = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/tub.?length|frame.?length|deck.?length/i.test(rawKey)) {
      deckLengthFeet = parseLength(rawValue);
      if (deckLengthFeet) break;
    }
  }
  // Fallback: look for frame lengths range
  if (!deckLengthFeet) {
    for (const { rawKey, rawValue } of rawSpecs) {
      if (/frame.?length/i.test(rawKey)) {
        // Parse something like "20' to 30'"
        const rangeMatch = rawValue.match(/([\d.]+)['']\s*(?:to|-)\s*([\d.]+)/);
        if (rangeMatch) {
          deckLengthFeet = parseFloat(rangeMatch[2]); // use max
          break;
        }
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
  // Fallback: infer from name for SX series
  if (!axleCount) {
    const nameLower = name.toLowerCase();
    if (/\bsx1\b/i.test(nameLower)) axleCount = 1; // single axle
  }

  // Empty weight
  let emptyWeightLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/empty.?weight|tare.?weight|unladen/i.test(rawKey)) {
      emptyWeightLbs = parseWeight(rawValue);
      if (emptyWeightLbs) break;
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

  // Concentrated capacity / max payload
  let concentratedCapacityLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/concentrated|max.?payload|capacity.*lbs|payload.*rating/i.test(rawKey)) {
      concentratedCapacityLbs = parseWeight(rawValue);
      if (concentratedCapacityLbs) break;
    }
  }

  const modelNumber = extractModelNumber(name, sourceUrl);
  const series = detectSeries(name, sourceUrl);
  const productType = classifyProductType(name, description);

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
    gooseneck_type: null, // Side dumps don't use removable goosenecks
    empty_weight_lbs: emptyWeightLbs,
    gvwr_lbs: gvwrLbs,
    concentrated_capacity_lbs: concentratedCapacityLbs,
    msrp_low: null,
    msrp_high: null,
    source_url: sourceUrl,
  };
}

/**
 * Build images array for upsertProductImages.
 */
function buildImages(pageData) {
  return pageData.images.map((img) => ({
    url: img.url,
    alt_text: img.alt || `${pageData.name} SmithCo side dump trailer`,
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
    const uniqueUrls = [...new Set(productUrls.map((u) => u.replace(/\/$/, '')))];
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
        // Enrich with known SmithCo feature specs
        const featureSpecs = buildSmithCoFeatureSpecs(
          product.name,
          product.description || '',
          baseSpecs
        );
        const specs = [...baseSpecs, ...featureSpecs];

        console.log(`    Product type: ${product.product_type}`);
        console.log(`    Series: ${product.series || 'N/A'}`);
        console.log(`    Model: ${product.model_number || 'N/A'}`);
        console.log(`    Tonnage: ${product.tonnage_min || '?'}-${product.tonnage_max || '?'} ton`);
        console.log(`    Specs: ${specs.length}, Images: ${images.length}`);

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

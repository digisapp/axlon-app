// @ts-nocheck
/**
 * Scrape Felling Trailers product catalog
 *
 * Felling Trailers (felling.com) manufactures over 240 models of trailers
 * including step decks, flatbeds, lowboys, detachable gooseneck, hydraulic tail,
 * tilt, drop-deck, deck-over tag, hydraulic dump, and utility/telecom trailers.
 * Based in Sauk Centre, MN since 1974, ISO 9001 certified.
 *
 * This scraper discovers product pages from their /trailers/ section,
 * extracts specs, images, and descriptions, and upserts them into the
 * manufacturer_products tables via shared utilities.
 *
 * Usage:  node scripts/scrape-mfr-felling.mjs
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

const MANUFACTURER_SLUG = 'felling';
const MANUFACTURER_NAME = 'Felling Trailers';
const WEBSITE = 'https://www.felling.com';

/** Starting pages to discover individual product/model pages */
const SEED_URLS = [
  // Commercial
  'https://www.felling.com/trailers/commercial/',
  'https://www.felling.com/trailers/commercial/step-deck-trailers/',
  'https://www.felling.com/trailers/commercial/hx-high-flatbed-semi-trailer/',
  'https://www.felling.com/trailers/commercial/x-force-detachable-gooseneck-lowboy-trailers/',
  'https://www.felling.com/trailers/commercial/hydraulic-tail-trailer/',
  'https://www.felling.com/trailers/commercial/tsa-tilt-slide-axle/',
  // Construction
  'https://www.felling.com/trailers/construction/',
  'https://www.felling.com/trailers/construction/drop-deck-trailer/',
  'https://www.felling.com/trailers/construction/drop-deck-trailer/tilt-lines-drop-deck/',
  'https://www.felling.com/trailers/construction/deck-over-tag/',
  'https://www.felling.com/trailers/construction/deck-over-tilt-trailers/',
  'https://www.felling.com/trailers/construction/hydraulic-dump-trailers-construction/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/mx-series-semi-trailer/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/nn-series-semi-trailer/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/rgt-tilt-series-semi-trailer/',
  // Utility / Telecom
  'https://www.felling.com/trailers/utility-telecom/',
  // Gooseneck
  'https://www.felling.com/gooseneck-trailers/',
];

/** Direct product pages we know about (fallbacks in case discovery misses them) */
const KNOWN_PRODUCT_PAGES = [
  // Commercial – Step Deck
  'https://www.felling.com/trailers/commercial/step-deck-trailers/',
  // Commercial – High Flatbed
  'https://www.felling.com/trailers/commercial/hx-high-flatbed-semi-trailer/',
  // Commercial – X-FORCE Lowboy
  'https://www.felling.com/trailers/commercial/x-force-detachable-gooseneck-lowboy-trailers/',
  // Commercial – Hydraulic Tail
  'https://www.felling.com/trailers/commercial/hydraulic-tail-trailer/',
  // Commercial – TSA Tilt Slide Axle
  'https://www.felling.com/trailers/commercial/tsa-tilt-slide-axle/',
  // Construction – Drop Deck
  'https://www.felling.com/trailers/construction/drop-deck-trailer/',
  // Construction – Tilt Lines Drop Deck
  'https://www.felling.com/trailers/construction/drop-deck-trailer/tilt-lines-drop-deck/',
  // Construction – Deck-Over Tag
  'https://www.felling.com/trailers/construction/deck-over-tag/',
  // Construction – Deck-Over Tilts
  'https://www.felling.com/trailers/construction/deck-over-tilt-trailers/',
  // Construction – Hydraulic Dump
  'https://www.felling.com/trailers/construction/hydraulic-dump-trailers-construction/',
  // Construction – Semi Trailers
  'https://www.felling.com/trailers/construction/semi-trailer-construction/mx-series-semi-trailer/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/nn-series-semi-trailer/',
  'https://www.felling.com/trailers/construction/semi-trailer-construction/rgt-tilt-series-semi-trailer/',
];

/**
 * Keywords that signal a page is a Felling trailer product.
 * Used to filter discovered links.
 */
const FELLING_KEYWORDS = [
  'trailer', 'step deck', 'flatbed', 'lowboy', 'gooseneck', 'detachable',
  'drop deck', 'drop-deck', 'deck over', 'deck-over', 'tag', 'tilt',
  'hydraulic tail', 'hydraulic dump', 'semi trailer', 'semi-trailer',
  'x-force', 'xforce', 'mx series', 'nn series', 'rgt series',
  'hx high', 'tsa tilt', 'slide axle', 'cable reel', 'pole trailer',
  'pipe coil', 'hdd trailer', 'utility', 'telecom', 'tonnage', 'ton',
  'gvwr', 'payload', 'axle', 'tandem', 'tridem',
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
 * Determine the product_type from a product name / description / URL.
 * Valid enum: 'lowboy', 'step-deck', 'flatbed', 'rgn', 'double-drop',
 *             'extendable', 'modular', 'traveling-axle', 'tag-along', 'other'
 */
function classifyProductType(name, description = '', url = '') {
  const text = `${name} ${description} ${url}`.toLowerCase();

  // X-FORCE detachable gooseneck lowboy
  if (/x-?force|detachable\s*gooseneck\s*lowboy/i.test(text)) return 'rgn';
  if (/\blowboy\b/i.test(text)) return 'lowboy';

  // Step deck
  if (/step[\s-]?deck/i.test(text)) return 'step-deck';

  // Double drop / drop deck (construction drop decks)
  if (/double[\s-]?drop/i.test(text)) return 'double-drop';
  if (/drop[\s-]?deck/i.test(text)) return 'step-deck';

  // Flatbed / high flatbed
  if (/flatbed|high\s*flat/i.test(text)) return 'flatbed';

  // Tag-along / deck-over tag
  if (/deck[\s-]?over[\s-]?tag|tag[\s-]?along|\btag\b.*trailer/i.test(text)) return 'tag-along';

  // Tilt trailers
  if (/tilt/i.test(text)) return 'tag-along';

  // RGT series (removable gooseneck tilt)
  if (/\brgt\b/i.test(text)) return 'rgn';

  // MX / NN series semi trailers (heavy haul)
  if (/\bmx[\s-]?series\b/i.test(text)) return 'lowboy';
  if (/\bnn[\s-]?series\b/i.test(text)) return 'lowboy';

  // Hydraulic tail
  if (/hydraulic\s*tail/i.test(text)) return 'flatbed';

  // Hydraulic dump
  if (/hydraulic\s*dump|dump\s*trailer/i.test(text)) return 'other';

  // TSA Tilt Slide Axle
  if (/tsa|slide[\s-]?axle/i.test(text)) return 'traveling-axle';

  // Utility / Telecom
  if (/utility|telecom|cable\s*reel|pole\s*trailer|pipe\s*coil|hdd/i.test(text)) return 'other';

  // Gooseneck
  if (/gooseneck/i.test(text)) return 'tag-along';

  return 'other';
}

/**
 * Detect series from the product name / URL.
 */
function detectSeries(name, url = '') {
  const text = `${name} ${url}`.toLowerCase();

  // X-FORCE series
  if (/x-?force/i.test(text)) return 'X-FORCE';

  // HX series
  if (/\bhx\b/i.test(text) && /flatbed|high/i.test(text)) return 'HX';

  // TSA series
  if (/\btsa\b/i.test(text)) return 'TSA';

  // MX Series
  if (/\bmx[\s-]?series\b/i.test(text) || /\/mx-series/i.test(text)) return 'MX Series';

  // NN Series
  if (/\bnn[\s-]?series\b/i.test(text) || /\/nn-series/i.test(text)) return 'NN Series';

  // RGT Series
  if (/\brgt\b/i.test(text) || /\/rgt-/i.test(text)) return 'RGT Series';

  // FT series (common Felling model prefix)
  const ftMatch = text.match(/\bft[-\s]?(\d+)/i);
  if (ftMatch) return `FT-${ftMatch[1]}`;

  // IT series (tag trailers)
  const itMatch = text.match(/\bit[-\s]?(\d+)/i);
  if (itMatch) return `IT-${itMatch[1]}`;

  // FD series (dump trailers)
  const fdMatch = text.match(/\bfd[-\s]?(\d+)/i);
  if (fdMatch) return `FD-${fdMatch[1]}`;

  // Step deck
  if (/step[\s-]?deck/i.test(text)) return 'Step Deck';

  // Drop deck
  if (/drop[\s-]?deck/i.test(text)) return 'Drop Deck';

  // Deck-over tag
  if (/deck[\s-]?over[\s-]?tag/i.test(text)) return 'Deck-Over Tag';

  // Deck-over tilt
  if (/deck[\s-]?over[\s-]?tilt/i.test(text)) return 'Deck-Over Tilt';

  // Hydraulic tail
  if (/hydraulic[\s-]?tail/i.test(text)) return 'Hydraulic Tail';

  // Hydraulic dump
  if (/hydraulic[\s-]?dump/i.test(text)) return 'Hydraulic Dump';

  return null;
}

/**
 * Extract model number from a product name or URL.
 * Felling uses patterns like FT-3, IT-I, FD-16, XF-1, MXG-51HDG, etc.
 */
function extractModelNumber(name, url = '') {
  const text = `${name} ${url}`.toUpperCase();

  // Match FT models (e.g., FT-3, FT-12)
  const ftMatch = text.match(/\bFT[-\s]?(\d+[A-Z]*)\b/);
  if (ftMatch) return `FT-${ftMatch[1]}`;

  // Match IT models (e.g., IT-I, IT-4)
  const itMatch = text.match(/\bIT[-\s]?([A-Z0-9]+)\b/);
  if (itMatch) return `IT-${itMatch[1]}`;

  // Match FD models (e.g., FD-16, FD-20)
  const fdMatch = text.match(/\bFD[-\s]?(\d+[A-Z]*)\b/);
  if (fdMatch) return `FD-${fdMatch[1]}`;

  // Match XF models (X-FORCE, e.g., XF-1)
  const xfMatch = text.match(/\bXF[-\s]?(\d+[A-Z]*)\b/);
  if (xfMatch) return `XF-${xfMatch[1]}`;

  // Match MXG / MX models
  const mxMatch = text.match(/\bMX[G]?[-\s]?(\d+[A-Z]*)\b/);
  if (mxMatch) return `MX-${mxMatch[1]}`;

  // Match NN models
  const nnMatch = text.match(/\bNN[-\s]?(\d+[A-Z]*)\b/);
  if (nnMatch) return `NN-${nnMatch[1]}`;

  // Match RGT models
  const rgtMatch = text.match(/\bRGT[-\s]?(\d+[A-Z]*)\b/);
  if (rgtMatch) return `RGT-${rgtMatch[1]}`;

  // Match HX models
  const hxMatch = text.match(/\bHX[-\s]?(\d+[A-Z]*)\b/);
  if (hxMatch) return `HX-${hxMatch[1]}`;

  // Match TSA models
  const tsaMatch = text.match(/\bTSA[-\s]?(\d+[A-Z]*)\b/);
  if (tsaMatch) return `TSA-${tsaMatch[1]}`;

  // Generic model pattern: alphanumeric with dash (e.g., "CF-12HD")
  const genericMatch = text.match(/\b([A-Z]{2,4}[-]?\d{1,3}[A-Z]{0,4})\b/);
  if (genericMatch) return genericMatch[1];

  return null;
}

/**
 * Parse axle count from spec text.
 */
function parseAxleCount(text) {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(?:axle|axles)/i);
  if (match) return parseInt(match[1], 10);
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
          // Only keep links on felling.com
          if (fullUrl.includes('felling.com')) {
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

    // Must be under /trailers/ or /gooseneck-trailers/
    if (!urlLower.includes('/trailers/') && !urlLower.includes('/gooseneck-trailers')) return false;

    // Skip the top-level /trailers page (category listing)
    if (urlLower === 'https://www.felling.com/trailers') return false;

    // Skip non-product pages
    if (urlLower.includes('/contact')) return false;
    if (urlLower.includes('/about')) return false;
    if (urlLower.includes('/news') || urlLower.includes('/blog')) return false;
    if (urlLower.includes('/dealers') || urlLower.includes('/careers')) return false;
    if (urlLower.includes('/gallery') && !urlLower.includes('/trailers/')) return false;
    if (urlLower.includes('.pdf') || urlLower.includes('.jpg')) return false;
    if (urlLower.includes('.png') || urlLower.includes('.gif')) return false;
    if (urlLower.includes('/cart') || urlLower.includes('/checkout')) return false;
    if (urlLower.includes('/request-a-quote')) return false;
    if (urlLower.includes('/find-a-dealer')) return false;
    if (urlLower.includes('/parts') || urlLower.includes('/service')) return false;
    if (urlLower.includes('#')) return false;

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
      '.subtitle, .hero-subtitle, .page-subtitle, .entry-subtitle'
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
      '.entry-content p',
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
      if (/spec|dimension|capacity|feature|standard/i.test(headingText)) {
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
      // Only keep felling.com domain images
      if (!src.includes('felling.com')) return;

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

    if (/capacity|payload|tonnage|ton|gvwr|gross/i.test(keyLower)) {
      category = 'Capacity';
      if (/lbs?|pounds?/i.test(value)) unit = 'lbs';
      else if (/ton/i.test(value)) unit = 'tons';
    } else if (/length|width|height|clearance|dimension|deck\s*size/i.test(keyLower)) {
      category = 'Dimensions';
      if (/["'']/i.test(value) || /inch/i.test(value)) unit = 'in';
      else if (/['']/i.test(value) || /feet|ft/i.test(value)) unit = 'ft';
    } else if (/axle|suspension|tire|wheel|brake/i.test(keyLower)) {
      category = 'Running Gear';
      if (/\bk\b/i.test(value) || /capacity/i.test(value)) unit = 'lbs';
    } else if (/hydraulic|cylinder|psi|bore|pump/i.test(keyLower)) {
      category = 'Hydraulics';
      if (/psi/i.test(value)) unit = 'PSI';
      else if (/["'']/i.test(value) || /bore/i.test(value)) unit = 'in';
    } else if (/frame|steel|material|floor|beam|cross[-\s]?member/i.test(keyLower)) {
      category = 'Frame';
    } else if (/gooseneck|kingpin|hitch|fifth.?wheel|coupler/i.test(keyLower)) {
      category = 'Gooseneck';
    } else if (/light|electric|wiring|harness/i.test(keyLower)) {
      category = 'Electrical';
    } else if (/paint|finish|coating|primer/i.test(keyLower)) {
      category = 'Finish';
    } else if (/model|series/i.test(keyLower)) {
      category = 'Models';
    } else if (/ramp|beavertail|tail|loading/i.test(keyLower)) {
      category = 'Loading';
    } else if (/deck|platform|surface/i.test(keyLower)) {
      category = 'Deck';
    } else if (/weight|empty|tare/i.test(keyLower)) {
      category = 'Weight';
      if (/lbs?|pounds?/i.test(value)) unit = 'lbs';
    }

    specs.push({ category, key, value, unit });
  }

  return specs;
}

/**
 * Build Felling-specific feature specs that may not appear in scraped specs
 * but should be recorded.
 */
function buildFellingFeatureSpecs(name, description, existingSpecs) {
  const featureSpecs = [];
  const combined = `${name} ${description}`.toLowerCase();
  const existingKeys = new Set(existingSpecs.map((s) => s.key.toLowerCase()));

  // ISO 9001 certification
  if (combined.includes('iso 9001') || combined.includes('iso-9001')) {
    if (!existingKeys.has('certification')) {
      featureSpecs.push({
        category: 'General',
        key: 'Certification',
        value: 'ISO 9001',
        unit: null,
      });
    }
  }

  // Air ride suspension
  if (combined.includes('air ride') || combined.includes('air suspension')) {
    if (!existingKeys.has('suspension type')) {
      featureSpecs.push({
        category: 'Running Gear',
        key: 'Suspension Type',
        value: 'Air ride',
        unit: null,
      });
    }
  }

  // Detachable gooseneck
  if (combined.includes('detachable') && combined.includes('gooseneck')) {
    if (!existingKeys.has('gooseneck type')) {
      featureSpecs.push({
        category: 'Gooseneck',
        key: 'Gooseneck Type',
        value: 'Detachable',
        unit: null,
      });
    }
  }

  // Hydraulic tilt
  if (combined.includes('hydraulic') && combined.includes('tilt')) {
    if (!existingKeys.has('tilt type')) {
      featureSpecs.push({
        category: 'Loading',
        key: 'Tilt Type',
        value: 'Hydraulic tilt',
        unit: null,
      });
    }
  }

  // Ramps
  if (combined.includes('ramp') || combined.includes('beavertail')) {
    if (!existingKeys.has('loading type')) {
      featureSpecs.push({
        category: 'Loading',
        key: 'Loading Type',
        value: combined.includes('beavertail') ? 'Beavertail with ramps' : 'Ramps',
        unit: null,
      });
    }
  }

  // Manufacturer
  if (!existingKeys.has('manufacturer')) {
    featureSpecs.push({
      category: 'General',
      key: 'Manufacturer',
      value: 'Felling Trailers',
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
    if (/payload|tonnage|ton|capacity.*ton|rated\s*capacity/i.test(rawKey)) {
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
      if (/payload|rating|capacity/i.test(rawKey)) {
        const weight = parseWeight(rawValue);
        if (weight && weight > 1000) {
          tonnageMin = Math.round(weight / 2000);
          tonnageMax = tonnageMin;
          break;
        }
      }
    }
  }

  // GVWR — also try to derive tonnage from GVWR
  let gvwrLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/gvwr|gross.?vehicle|gross.?weight/i.test(rawKey)) {
      gvwrLbs = parseWeight(rawValue);
      if (gvwrLbs) break;
    }
  }

  // Deck height
  let deckHeightInches = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/height|deck.?height|loaded.?height|deck\s*clearance/i.test(rawKey)) {
      deckHeightInches = parseDeckHeight(rawValue);
      if (deckHeightInches) break;
    }
  }

  // Deck / frame length
  let deckLengthFeet = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/deck.?length|frame.?length|overall.?deck|platform.?length/i.test(rawKey)) {
      deckLengthFeet = parseLength(rawValue);
      if (deckLengthFeet) break;
    }
  }
  // Fallback: look for length ranges
  if (!deckLengthFeet) {
    for (const { rawKey, rawValue } of rawSpecs) {
      if (/length/i.test(rawKey)) {
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
  // Fallback: infer from name / description
  if (!axleCount) {
    const textLower = `${name} ${description}`.toLowerCase();
    if (/tandem/i.test(textLower)) axleCount = 2;
    else if (/tridem|tri[-\s]?axle/i.test(textLower)) axleCount = 3;
    else if (/single\s*axle/i.test(textLower)) axleCount = 1;
  }

  // Empty weight
  let emptyWeightLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/empty.?weight|tare.?weight|unladen|curb.?weight/i.test(rawKey)) {
      emptyWeightLbs = parseWeight(rawValue);
      if (emptyWeightLbs) break;
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

  // Gooseneck type
  let gooseneckType = null;
  const nameAndDesc = `${name} ${description}`.toLowerCase();
  if (/detachable\s*gooseneck|removable\s*gooseneck/i.test(nameAndDesc)) {
    gooseneckType = 'detachable';
  } else if (/fixed\s*gooseneck/i.test(nameAndDesc)) {
    gooseneckType = 'fixed';
  }

  const modelNumber = extractModelNumber(name, sourceUrl);
  const series = detectSeries(name, sourceUrl);
  const productType = classifyProductType(name, description, sourceUrl);

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
    alt_text: img.alt || `${pageData.name} Felling Trailers`,
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
        // Enrich with known Felling feature specs
        const featureSpecs = buildFellingFeatureSpecs(
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

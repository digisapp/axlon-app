// @ts-nocheck
/**
 * Scrape Mack Trucks product catalog
 *
 * Mack Trucks (macktrucks.com) manufactures Class 6-8 trucks including
 * the Anthem (highway), Granite (vocational), Keystone, Pioneer,
 * LR Series (refuse), LR Electric, MD Series (medium duty),
 * MD Electric, and TerraPro (cabover). Based in Greensboro, NC,
 * Mack is one of the largest producers of heavy-duty trucks in
 * North America.
 *
 * This scraper uses hardcoded seed URLs for the 9 known truck models,
 * extracts specs, images, and descriptions, and upserts them into the
 * manufacturer_products tables via shared utilities.
 *
 * Usage:  node scripts/scrape-mfr-mack.mjs
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
  slugify,
  printBanner,
  printSummary,
} from './lib/manufacturer-scraper-utils.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MANUFACTURER_SLUG = 'mack';
const MANUFACTURER_NAME = 'Mack Trucks';
const WEBSITE = 'https://www.macktrucks.com';

/** All known Mack truck model pages (fixed catalog, no discovery needed) */
const SEED_URLS = [
  'https://www.macktrucks.com/trucks/anthem/',
  'https://www.macktrucks.com/trucks/granite/',
  'https://www.macktrucks.com/trucks/keystone/',
  'https://www.macktrucks.com/trucks/pioneer/',
  'https://www.macktrucks.com/trucks/lr-series/',
  'https://www.macktrucks.com/trucks/lr-electric/',
  'https://www.macktrucks.com/trucks/md/',
  'https://www.macktrucks.com/trucks/md-electric/',
  'https://www.macktrucks.com/trucks/terrapro-series/',
];

/** Delay between page loads (ms) */
const PAGE_DELAY_MIN = 2000;
const PAGE_DELAY_MAX = 4000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomDelay() {
  return PAGE_DELAY_MIN + Math.random() * (PAGE_DELAY_MAX - PAGE_DELAY_MIN);
}

/**
 * All Mack products are trucks — the product_type enum doesn't have 'truck',
 * so we use 'other'.
 */
function classifyProductType() {
  return 'other';
}

/**
 * Clean trademark symbols from a name for slug generation,
 * but keep them in the display name.
 */
function cleanNameForSlug(name) {
  return name
    .replace(/[®™©]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect the truck series/category from name and URL.
 */
function detectSeries(name, url = '') {
  const text = `${name} ${url}`.toLowerCase();
  if (/anthem/i.test(text)) return 'Highway';
  if (/granite/i.test(text)) return 'Vocational';
  if (/keystone/i.test(text)) return 'Vocational';
  if (/pioneer/i.test(text)) return 'Vocational';
  if (/lr[-\s]?electric/i.test(text)) return 'Electric';
  if (/lr[-\s]?series/i.test(text)) return 'Refuse';
  if (/md[-\s]?electric/i.test(text)) return 'Electric';
  if (/md[-\s]?series/i.test(text)) return 'Medium Duty';
  if (/terrapro/i.test(text)) return 'Vocational';
  return null;
}

/**
 * Extract model name from the product page name.
 * E.g. "Anthem®" -> "Anthem", "LR Electric" -> "LR Electric"
 */
function extractModelNumber(name) {
  // Remove trademark symbols and clean up
  const cleaned = name.replace(/[®™©]/g, '').trim();
  // The model name IS the model number for Mack trucks
  return cleaned || null;
}

/**
 * Parse horsepower range from text like "415-515 hp" or "up to 515 hp"
 */
function parseHorsepower(text) {
  if (!text) return { min: null, max: null };
  const rangeMatch = text.replace(/,/g, '').match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:hp|horsepower)/i);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  const upToMatch = text.replace(/,/g, '').match(/up\s*to\s*(\d+)\s*(?:hp|horsepower)/i);
  if (upToMatch) {
    return { min: null, max: parseInt(upToMatch[1], 10) };
  }
  const singleMatch = text.replace(/,/g, '').match(/(\d+)\s*(?:hp|horsepower)/i);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    return { min: val, max: val };
  }
  return { min: null, max: null };
}

/**
 * Parse torque range from text like "1,550-1,900 lb-ft"
 */
function parseTorque(text) {
  if (!text) return { min: null, max: null };
  const rangeMatch = text.replace(/,/g, '').match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:lb[-.\s]?ft|pound[-.\s]?fe?e?t)/i);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  const upToMatch = text.replace(/,/g, '').match(/up\s*to\s*(\d+)\s*(?:lb[-.\s]?ft)/i);
  if (upToMatch) {
    return { min: null, max: parseInt(upToMatch[1], 10) };
  }
  const singleMatch = text.replace(/,/g, '').match(/(\d+)\s*(?:lb[-.\s]?ft|pound[-.\s]?fe?e?t)/i);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    return { min: val, max: val };
  }
  return { min: null, max: null };
}

// ---------------------------------------------------------------------------
// Scraper Logic
// ---------------------------------------------------------------------------

/**
 * Scrape a single Mack truck product page and return structured data.
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

    // Fallback to title tag
    if (!name) {
      const titleEl = document.querySelector('title');
      if (titleEl) {
        name = titleEl.textContent.split('|')[0].trim();
      }
    }

    // --- Tagline ---
    let tagline = '';
    const subtitle = document.querySelector(
      '.subtitle, .hero-subtitle, .page-subtitle, .hero__subtitle'
    );
    if (subtitle) {
      tagline = subtitle.textContent.trim();
    }
    if (!tagline && h1) {
      // Look for first h2 that is different from name
      const h2s = document.querySelectorAll('h2');
      for (const h2 of h2s) {
        const h2Text = h2.textContent.trim();
        if (h2Text && h2Text !== name && h2Text.length < 200 && !/spec|download|config/i.test(h2Text)) {
          tagline = h2Text;
          break;
        }
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
      '.hero__description p',
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

    // --- Specs ---
    const specs = [];

    // Look for specification tables
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

    // Look for definition lists
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
    document.querySelectorAll('p, div, span').forEach((el) => {
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

    // Look for heading + adjacent content patterns (Specs & Downloads sections)
    document.querySelectorAll('h2, h3, h4, h5').forEach((heading) => {
      const headingText = heading.textContent.trim().toLowerCase();
      if (/spec|download|config|engine|transmission|axle/i.test(headingText)) {
        let sibling = heading.nextElementSibling;
        while (sibling && !['H1', 'H2', 'H3'].includes(sibling.tagName)) {
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
          // Also check for spec-like text in paragraphs and divs
          if (sibling.tagName === 'P' || sibling.tagName === 'DIV') {
            const text = sibling.textContent.trim();
            const kvMatch = text.match(/^([^:]{3,60}):\s*(.+)$/);
            if (kvMatch) {
              specs.push({ rawKey: kvMatch[1].trim(), rawValue: kvMatch[2].trim() });
            }
          }
          sibling = sibling.nextElementSibling;
        }
      }
    });

    // --- Scan full body text for inline specs (CLASS, HORSEPOWER, TORQUE, etc.) ---
    const bodyText = document.body ? document.body.textContent : '';

    // CLASS (e.g., "CLASS 8", "Class 6-7")
    const classMatch = bodyText.match(/CLASS\s*(\d+(?:\s*[-–]\s*\d+)?)/i);
    if (classMatch) {
      specs.push({ rawKey: 'Class', rawValue: classMatch[1].trim() });
    }

    // HORSEPOWER
    const hpMatch = bodyText.match(/(?:HORSEPOWER|HP)[:\s]*([\d,]+\s*[-–to]*\s*[\d,]*\s*(?:hp)?)/i);
    if (hpMatch) {
      specs.push({ rawKey: 'Horsepower', rawValue: hpMatch[1].trim() });
    }
    // Also try "XXX-XXX hp" patterns
    const hpRange = bodyText.match(/(\d{2,3}\s*[-–]\s*\d{2,3})\s*hp/i);
    if (hpRange) {
      specs.push({ rawKey: 'Horsepower', rawValue: hpRange[1].trim() + ' hp' });
    }

    // TORQUE
    const torqueMatch = bodyText.match(/(?:TORQUE)[:\s]*([\d,]+\s*[-–to]*\s*[\d,]*\s*(?:lb[-.\s]?ft)?)/i);
    if (torqueMatch) {
      specs.push({ rawKey: 'Torque', rawValue: torqueMatch[1].trim() });
    }
    // Also try "X,XXX-X,XXX lb-ft" patterns
    const torqueRange = bodyText.match(/([\d,]+\s*[-–]\s*[\d,]+)\s*lb[-.\s]?ft/i);
    if (torqueRange) {
      specs.push({ rawKey: 'Torque', rawValue: torqueRange[1].trim() + ' lb-ft' });
    }

    // Cab Configurations
    const cabMatch = bodyText.match(/Cab\s*Config(?:uration)?s?[:\s]*([^\n.]{5,100})/i);
    if (cabMatch) {
      specs.push({ rawKey: 'Cab Configurations', rawValue: cabMatch[1].trim() });
    }

    // Axle Configurations
    const axleMatch = bodyText.match(/Axle\s*Config(?:uration)?s?[:\s]*([^\n.]{5,100})/i);
    if (axleMatch) {
      specs.push({ rawKey: 'Axle Configurations', rawValue: axleMatch[1].trim() });
    }

    // Engine / Engines
    const engineMatch = bodyText.match(/Engines?[:\s]*((?:Mack|MP|Cummins)[^\n.]{5,150})/i);
    if (engineMatch) {
      specs.push({ rawKey: 'Engine', rawValue: engineMatch[1].trim() });
    }

    // Transmissions
    const transMatch = bodyText.match(/Transmissions?[:\s]*((?:Mack|mDRIVE|Allison|Eaton)[^\n.]{5,150})/i);
    if (transMatch) {
      specs.push({ rawKey: 'Transmission', rawValue: transMatch[1].trim() });
    }

    // --- Images ---
    const images = [];
    const seenUrls = new Set();
    document.querySelectorAll('img').forEach((img) => {
      const src =
        img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      if (!src) return;
      // Skip tiny icons, logos, social media, etc.
      if (src.includes('logo') && !src.includes('truck')) return;
      if (src.includes('icon')) return;
      if (src.includes('favicon')) return;
      if (src.includes('.gif') || src.includes('.svg')) return;
      if (src.includes('gravatar')) return;
      if (src.includes('social') || src.includes('facebook') || src.includes('twitter')) return;
      if (src.includes('linkedin') || src.includes('youtube') || src.includes('instagram')) return;
      // Prefer macktrucks.com images or CDN images
      if (!src.includes('macktrucks.com') && !src.includes('mack') && !src.includes('volvo')) return;

      const width = img.naturalWidth || img.width || 0;
      if (width > 0 && width < 80) return; // skip tiny images

      const normalizedSrc = src.split('?')[0];
      if (seenUrls.has(normalizedSrc)) return;
      seenUrls.add(normalizedSrc);

      images.push({
        url: src,
        alt: img.alt || '',
      });
    });

    // Also check for background images on hero sections
    document.querySelectorAll('[style*="background"]').forEach((el) => {
      const style = el.getAttribute('style') || '';
      const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch && bgMatch[1]) {
        const bgUrl = bgMatch[1];
        if (bgUrl.includes('macktrucks.com') || bgUrl.includes('mack')) {
          if (!bgUrl.includes('.svg') && !bgUrl.includes('icon')) {
            const normalizedSrc = bgUrl.split('?')[0];
            if (!seenUrls.has(normalizedSrc)) {
              seenUrls.add(normalizedSrc);
              images.push({ url: bgUrl, alt: '' });
            }
          }
        }
      }
    });

    // Check for picture/source elements (responsive images)
    document.querySelectorAll('picture source, source[srcset]').forEach((source) => {
      const srcset = source.getAttribute('srcset');
      if (!srcset) return;
      // Take the first URL from the srcset
      const firstUrl = srcset.split(',')[0].trim().split(/\s+/)[0];
      if (firstUrl && (firstUrl.includes('macktrucks') || firstUrl.includes('mack'))) {
        if (!firstUrl.includes('.svg') && !firstUrl.includes('icon')) {
          const normalizedSrc = firstUrl.split('?')[0];
          if (!seenUrls.has(normalizedSrc)) {
            seenUrls.add(normalizedSrc);
            images.push({ url: firstUrl, alt: '' });
          }
        }
      }
    });

    return { name, tagline, description, shortDescription, features, specs, images, bodyText: bodyText.substring(0, 5000) };
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
 * Categorize raw specs into structured spec objects for Mack trucks.
 */
function categorizeSpecs(rawSpecs) {
  const specs = [];
  const seen = new Set();

  for (const { rawKey, rawValue } of rawSpecs) {
    const key = rawKey.trim();
    const value = rawValue.trim();
    const dedup = `${key.toLowerCase()}|${value.toLowerCase()}`;
    if (seen.has(dedup)) continue;
    seen.add(dedup);

    const keyLower = key.toLowerCase();

    let category = 'General';
    let unit = null;

    if (/class/i.test(keyLower)) {
      category = 'Classification';
    } else if (/horsepower|hp|power/i.test(keyLower)) {
      category = 'Engine';
      unit = 'hp';
    } else if (/torque/i.test(keyLower)) {
      category = 'Engine';
      unit = 'lb-ft';
    } else if (/engine|motor|displacement/i.test(keyLower)) {
      category = 'Engine';
    } else if (/transmission|gear|mdrive|speed/i.test(keyLower)) {
      category = 'Transmission';
    } else if (/axle|suspension|tire|wheel|brake/i.test(keyLower)) {
      category = 'Axle & Suspension';
    } else if (/cab|sleeper|interior|seat/i.test(keyLower)) {
      category = 'Cab';
    } else if (/gvw|gcw|payload|capacity|rating/i.test(keyLower)) {
      category = 'Weight Ratings';
      if (/lbs?|pounds?/i.test(value)) unit = 'lbs';
      else if (/ton/i.test(value)) unit = 'tons';
    } else if (/length|width|height|dimension|wheelbase/i.test(keyLower)) {
      category = 'Dimensions';
      if (/["'']/i.test(value) || /inch/i.test(value)) unit = 'in';
      else if (/['']/i.test(value) || /feet|ft/i.test(value)) unit = 'ft';
    } else if (/fuel|tank|def|range|mpg|battery|kwh|charging/i.test(keyLower)) {
      category = 'Fuel & Range';
    } else if (/electric|ev|regenerat|charge/i.test(keyLower)) {
      category = 'Electric';
    } else if (/exhaust|emission|aftertreatment/i.test(keyLower)) {
      category = 'Emissions';
    } else if (/frame|chassis/i.test(keyLower)) {
      category = 'Frame';
    } else if (/pto|body|application/i.test(keyLower)) {
      category = 'Applications';
    }

    specs.push({ category, key, value, unit });
  }

  return specs;
}

/**
 * Build known specs for Mack trucks from the product name and body text
 * when the page scraper missed them.
 */
function buildMackFeatureSpecs(name, description, existingSpecs) {
  const featureSpecs = [];
  const combined = `${name} ${description}`.toLowerCase();
  const existingKeys = new Set(existingSpecs.map((s) => s.key.toLowerCase()));

  // Mack mDRIVE transmission (standard on most models)
  if (combined.includes('mdrive') || combined.includes('m-drive')) {
    if (!existingKeys.has('transmission')) {
      featureSpecs.push({
        category: 'Transmission',
        key: 'Transmission',
        value: 'Mack mDRIVE',
        unit: null,
      });
    }
  }

  // MP engine series
  if (combined.includes('mp7')) {
    if (!existingKeys.has('engine')) {
      featureSpecs.push({
        category: 'Engine',
        key: 'Engine',
        value: 'Mack MP7',
        unit: null,
      });
    }
  }
  if (combined.includes('mp8')) {
    if (!existingKeys.has('engine')) {
      featureSpecs.push({
        category: 'Engine',
        key: 'Engine',
        value: 'Mack MP8',
        unit: null,
      });
    }
  }

  // Electric drivetrain
  if (combined.includes('electric') || combined.includes(' ev ') || combined.includes(' bev ')) {
    if (!existingKeys.has('drivetrain')) {
      featureSpecs.push({
        category: 'Electric',
        key: 'Drivetrain',
        value: 'Battery Electric',
        unit: null,
      });
    }
  }

  // Refuse / vocational application
  if (combined.includes('refuse')) {
    if (!existingKeys.has('application')) {
      featureSpecs.push({
        category: 'Applications',
        key: 'Application',
        value: 'Refuse collection',
        unit: null,
      });
    }
  }

  // Vehicle type
  if (!existingKeys.has('vehicle type')) {
    featureSpecs.push({
      category: 'General',
      key: 'Vehicle Type',
      value: 'Truck',
      unit: null,
    });
  }

  // Manufacturer
  if (!existingKeys.has('manufacturer')) {
    featureSpecs.push({
      category: 'General',
      key: 'Manufacturer',
      value: 'Mack Trucks',
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

  // Clean name for slug (remove ® ™ symbols)
  const slugName = cleanNameForSlug(name);

  const modelNumber = extractModelNumber(name);
  const series = detectSeries(name, sourceUrl);
  const productType = classifyProductType();

  // Tonnage — trucks use GVWR class, not tonnage, but we can try to extract
  let tonnageMin = null;
  let tonnageMax = null;

  // GVW ratings are more relevant for trucks
  let gvwrLbs = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/gvw|gcw|gross.*weight|weight.*rating/i.test(rawKey)) {
      const weightMatch = rawValue.replace(/,/g, '').match(/([\d.]+)\s*(lbs?)?/i);
      if (weightMatch) {
        gvwrLbs = parseInt(weightMatch[1], 10);
        break;
      }
    }
  }

  // Horsepower — extract from specs
  let hpMin = null;
  let hpMax = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/horsepower|hp|power/i.test(rawKey)) {
      const hp = parseHorsepower(rawValue);
      if (hp.min || hp.max) {
        hpMin = hp.min;
        hpMax = hp.max;
        break;
      }
    }
  }
  // Fallback: search body text
  if (!hpMin && !hpMax) {
    const hp = parseHorsepower(combinedText);
    hpMin = hp.min;
    hpMax = hp.max;
  }

  // Torque — extract from specs
  let torqueMin = null;
  let torqueMax = null;
  for (const { rawKey, rawValue } of rawSpecs) {
    if (/torque/i.test(rawKey)) {
      const t = parseTorque(rawValue);
      if (t.min || t.max) {
        torqueMin = t.min;
        torqueMax = t.max;
        break;
      }
    }
  }
  // Fallback: search body text
  if (!torqueMin && !torqueMax) {
    const t = parseTorque(combinedText);
    torqueMin = t.min;
    torqueMax = t.max;
  }

  return {
    name: cleanText(name), // keep ® ™ in display name
    slug_override: slugify(slugName), // clean slug without symbols
    series,
    model_number: modelNumber,
    tagline: cleanText(tagline) || null,
    description: cleanText(description) || null,
    short_description: cleanText(shortDescription) || null,
    product_type: productType,
    tonnage_min: tonnageMin,
    tonnage_max: tonnageMax,
    deck_height_inches: null, // not applicable to trucks
    deck_length_feet: null,   // not applicable to trucks
    overall_length_feet: null,
    axle_count: null,
    gooseneck_type: null,
    empty_weight_lbs: null,
    gvwr_lbs: gvwrLbs,
    concentrated_capacity_lbs: null,
    msrp_low: null,
    msrp_high: null,
    source_url: sourceUrl,
    // Extra metadata for truck-specific specs (stored as product specs)
    _hp_min: hpMin,
    _hp_max: hpMax,
    _torque_min: torqueMin,
    _torque_max: torqueMax,
  };
}

/**
 * Build images array for upsertProductImages.
 */
function buildImages(pageData) {
  return pageData.images.map((img) => ({
    url: img.url,
    alt_text: img.alt || `${cleanNameForSlug(pageData.name)} Mack truck`,
    source_url: pageData.sourceUrl,
  }));
}

/**
 * Build extra specs from the structured product data (hp, torque, etc.)
 */
function buildTruckExtraSpecs(product) {
  const extras = [];

  if (product._hp_min || product._hp_max) {
    const hpValue = product._hp_min && product._hp_max && product._hp_min !== product._hp_max
      ? `${product._hp_min}-${product._hp_max} hp`
      : `${product._hp_max || product._hp_min} hp`;
    extras.push({
      category: 'Engine',
      key: 'Horsepower',
      value: hpValue,
      unit: 'hp',
    });
  }

  if (product._torque_min || product._torque_max) {
    const torqueValue = product._torque_min && product._torque_max && product._torque_min !== product._torque_max
      ? `${product._torque_min}-${product._torque_max} lb-ft`
      : `${product._torque_max || product._torque_min} lb-ft`;
    extras.push({
      category: 'Engine',
      key: 'Torque',
      value: torqueValue,
      unit: 'lb-ft',
    });
  }

  return extras;
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
    // Step 1: Scrape each truck model page (fixed catalog, no discovery)
    // ------------------------------------------------------------------
    console.log(`Step 1: Scraping ${SEED_URLS.length} truck model pages...\n`);

    for (let i = 0; i < SEED_URLS.length; i++) {
      const url = SEED_URLS[i];
      console.log(`\n[${i + 1}/${SEED_URLS.length}] ${url}`);

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

        // Deduplicate base specs against extra truck specs
        const existingSpecKeys = new Set(baseSpecs.map((s) => s.key.toLowerCase()));
        const truckExtras = buildTruckExtraSpecs(product).filter(
          (s) => !existingSpecKeys.has(s.key.toLowerCase())
        );

        // Enrich with known Mack feature specs
        const featureSpecs = buildMackFeatureSpecs(
          product.name,
          product.description || '',
          [...baseSpecs, ...truckExtras]
        );
        const specs = [...baseSpecs, ...truckExtras, ...featureSpecs];

        console.log(`    Product type: ${product.product_type}`);
        console.log(`    Series: ${product.series || 'N/A'}`);
        console.log(`    Model: ${product.model_number || 'N/A'}`);
        if (product._hp_min || product._hp_max) {
          console.log(`    Horsepower: ${product._hp_min || '?'}-${product._hp_max || '?'} hp`);
        }
        if (product._torque_min || product._torque_max) {
          console.log(`    Torque: ${product._torque_min || '?'}-${product._torque_max || '?'} lb-ft`);
        }
        console.log(`    Specs: ${specs.length}, Images: ${images.length}`);

        // ------------------------------------------------------------------
        // Step 2: Upsert to DB
        // ------------------------------------------------------------------
        // Remove internal-only fields before upserting
        const { _hp_min, _hp_max, _torque_min, _torque_max, slug_override, ...productData } = product;

        // Override the slug with the cleaned version (no ® ™)
        const productForDb = { ...productData };
        // The upsertProduct function generates slug from name, but the name
        // may contain ® ™ — so we override the name for slug generation
        // by temporarily cleaning it, then restoring the display name
        const originalName = productForDb.name;
        productForDb.name = cleanNameForSlug(originalName);
        const productId = await upsertProduct(supabase, manufacturerId, productForDb);

        if (!productId) {
          console.error('    Failed to upsert product');
          stats.errors++;
          continue;
        }

        // Update the display name back to include ® ™ symbols
        if (originalName !== productForDb.name) {
          await supabase
            .from('manufacturer_products')
            .update({ name: originalName })
            .eq('id', productId);
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
      if (i < SEED_URLS.length - 1) {
        await sleep(randomDelay());
      }
    }

    // ------------------------------------------------------------------
    // Step 3: Update product count
    // ------------------------------------------------------------------
    console.log('\nStep 2: Updating product count...');
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

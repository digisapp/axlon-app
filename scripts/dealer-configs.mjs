// @ts-nocheck
/**
 * Dealer configurations for inventory scraping.
 * These are ACTUAL DEALERS with for-sale inventory, not just manufacturer product catalogs.
 *
 * scrapeMethod:
 *   'css'  — use CSS selectors to extract listings from HTML pages
 *   'api'  — call a JSON API endpoint directly
 *   'auto' — try auto-detection (fallback)
 *
 * For CSS-based scrapers, provide selectors in scrapeConfig:
 *   - listingSelector: CSS selector for each listing card/row
 *   - titleSelector: within a listing, selector for the title
 *   - priceSelector: within a listing, selector for the price
 *   - imageSelector: within a listing, selector for primary image (src or data-src)
 *   - linkSelector: within a listing, selector for the detail page link
 *   - stockSelector: within a listing, selector for stock number
 *   - maxPages: max number of pages to scrape
 */

export const DEALER_CONFIGS = [
  // ─── Pinnacle Trailers (known working source) ──────────────────────
  {
    name: 'Pinnacle Trailers',
    slug: 'pinnacle-trailers',
    website: 'https://www.pinnacletrailers.com',
    inventoryUrl: 'https://www.pinnacletrailers.com/trailers/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.archive-trailer-listing-wrap',
      titleSelector: 'h2.trailer-title-label',
      priceSelector: '.trailer-price',
      imageSelector: 'img.featured_img',
      linkSelector: 'a.trailer-title-label-link',
      stockSelector: '.trailer-label',
      maxPages: 10,
    },
    city: 'Charleston',
    state: 'SC',
  },

  // ─── Hale Trailer Brake & Wheel ────────────────────────────────────
  {
    name: 'Hale Trailer Brake & Wheel',
    slug: 'hale-trailer',
    website: 'https://www.haletrailer.com',
    inventoryUrl: 'https://www.haletrailer.com/inventory/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.inventory-item, .listing-item, [class*="inventory"]',
      titleSelector: 'h2, h3, .title, [class*="title"]',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: 'a[href*="inventory"]',
      maxPages: 10,
    },
    city: 'Voorhees',
    state: 'NJ',
  },

  // ─── TEC Equipment ─────────────────────────────────────────────────
  {
    name: 'TEC Equipment',
    slug: 'tec-equipment',
    website: 'https://www.tecequipment.com',
    inventoryUrl: 'https://www.tecequipment.com/inventory/trailers/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.vehicle-card, .inventory-card, [class*="vehicle"], [class*="inventory-item"]',
      titleSelector: 'h2, h3, .title, [class*="title"]',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: 'a[href*="inventory"]',
      maxPages: 10,
    },
    city: 'Portland',
    state: 'OR',
  },

  // ─── Midco Sales ───────────────────────────────────────────────────
  {
    name: 'Midco Sales',
    slug: 'midco-sales',
    website: 'https://midcosales.com',
    inventoryUrl: 'https://midcosales.com/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'Oklahoma City',
    state: 'OK',
  },

  // ─── Royal Trailer Sales ───────────────────────────────────────────
  {
    name: 'Royal Trailer Sales',
    slug: 'royal-trailer-sales',
    website: 'https://royaltrailersales.com',
    inventoryUrl: 'https://royaltrailersales.com/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'Lubbock',
    state: 'TX',
  },

  // ─── JHTT (JH Trailer & Truck) ────────────────────────────────────
  {
    name: 'JH Trailer & Truck',
    slug: 'jhtt',
    website: 'https://jhtt.com',
    inventoryUrl: 'https://jhtt.com/trailers-for-sale/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'Houston',
    state: 'TX',
  },

  // ─── Renos Trailer Sales ───────────────────────────────────────────
  {
    name: 'Renos Trailer Sales',
    slug: 'renos-trailer',
    website: 'https://www.renostrailer.com',
    inventoryUrl: 'https://www.renostrailer.com/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'Reno',
    state: 'NV',
  },

  // ─── Semi Trailers .net ────────────────────────────────────────────
  {
    name: 'SemiTrailers.net',
    slug: 'semitrailers-net',
    website: 'https://semitrailers.net',
    inventoryUrl: 'https://semitrailers.net/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
  },

  // ─── Nelson Truck & Equipment ──────────────────────────────────────
  {
    name: 'Nelson Truck & Equipment',
    slug: 'nelson-truck',
    website: 'https://www.nelsontruck.com',
    inventoryUrl: 'https://www.nelsontruck.com/trailers',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 10 },
    city: 'Salt Lake City',
    state: 'UT',
  },

  // ─── Arrow Truck Sales ─────────────────────────────────────────────
  {
    name: 'Arrow Truck Sales',
    slug: 'arrow-truck-sales',
    website: 'https://www.arrowtruck.com',
    inventoryUrl: 'https://www.arrowtruck.com/inventory/trailers/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 10 },
    city: 'Kansas City',
    state: 'MO',
  },

  // ─── Utility Trailer Sales of Utah ─────────────────────────────────
  {
    name: 'Utility Trailer Sales of Utah',
    slug: 'utility-trailer-utah',
    website: 'https://www.utahtrailer.com',
    inventoryUrl: 'https://www.utahtrailer.com/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'West Valley City',
    state: 'UT',
  },

  // ─── Trailer World ─────────────────────────────────────────────────
  {
    name: 'Trailer World',
    slug: 'trailer-world',
    website: 'https://www.trailerworld.com',
    inventoryUrl: 'https://www.trailerworld.com/inventory/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 10 },
    city: 'Bowling Green',
    state: 'KY',
  },
];

export function getDealerBySlug(slug) {
  return DEALER_CONFIGS.find(d => d.slug === slug) || null;
}

export function getActiveDealers() {
  return DEALER_CONFIGS;
}

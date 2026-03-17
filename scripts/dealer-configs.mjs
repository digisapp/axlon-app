// @ts-nocheck
/**
 * Dealer configurations for inventory scraping.
 * These are ACTUAL DEALERS with for-sale inventory, not just manufacturer product catalogs.
 *
 * scrapeMethod:
 *   'css'  — use CSS selectors to extract listings from HTML pages
 *   'auto' — try auto-detection (fallback)
 *
 * For CSS-based scrapers, provide selectors in scrapeConfig:
 *   - listingSelector: CSS selector for each listing card/row
 *   - titleSelector: within a listing, selector for the title
 *   - priceSelector: within a listing, selector for the price
 *   - imageSelector: within a listing, selector for primary image (src or data-src)
 *   - linkSelector: within a listing, selector for the detail page link
 *   - maxPages: max number of pages to scrape
 */

export const DEALER_CONFIGS = [
  // ─── Pinnacle Trailers (verified working) ──────────────────────────
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
      maxPages: 10,
    },
    city: 'Charleston',
    state: 'SC',
  },

  // ─── TEC Equipment (verified working) ──────────────────────────────
  {
    name: 'TEC Equipment',
    slug: 'tec-equipment',
    website: 'https://www.tecequipment.com',
    inventoryUrl: 'https://www.tecequipment.com/inventory/trailers/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.inventory-card',
      titleSelector: 'h2, h3, .title, [class*="title"]',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: 'a[href*="inventory"]',
      maxPages: 10,
    },
    city: 'Portland',
    state: 'OR',
  },

  // ─── Royal Trailer Sales (verified working via auto-detect) ────────
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

  // ─── Hale Trailer Brake & Wheel (fixed URL: /trailer/) ────────────
  {
    name: 'Hale Trailer Brake & Wheel',
    slug: 'hale-trailer',
    website: 'https://haletrailer.com',
    inventoryUrl: 'https://haletrailer.com/trailer/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.trailer',
      titleSelector: '.repeater-title a strong, .repeater-title a',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: '.repeater-title a',
      maxPages: 10,
    },
    city: 'Voorhees',
    state: 'NJ',
  },

  // ─── JH Trailer & Truck (fixed URL: www.jhtt.com) ─────────────────
  {
    name: 'JH Trailer & Truck',
    slug: 'jhtt',
    website: 'https://www.jhtt.com',
    inventoryUrl: 'https://www.jhtt.com/inventory/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.listing',
      titleSelector: '.listing-title, a.listing-title',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: 'a.listing-title',
      maxPages: 5,
    },
    city: 'Davenport',
    state: 'IA',
  },

  // ─── Midco Sales (car dealer theme: .car-item) ────────────────────
  {
    name: 'Midco Sales',
    slug: 'midco-sales',
    website: 'https://midcosales.com',
    inventoryUrl: 'https://midcosales.com/inventory/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.car-item',
      titleSelector: '.car-content a',
      priceSelector: '.car-price, .price',
      imageSelector: '.car-image img',
      linkSelector: '.car-image a, .car-content a',
      maxPages: 5,
    },
    city: 'Phoenix',
    state: 'AZ',
  },

  // ─── Renos Trailer Sales (Algolia search: .ais-InfiniteHits-item) ─
  {
    name: 'Renos Trailer Sales',
    slug: 'renos-trailer',
    website: 'https://www.renostrailer.com',
    inventoryUrl: 'https://www.renostrailer.com/all-inventory/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.ais-InfiniteHits-item',
      titleSelector: '.contentRightCol h4, .contentRightCol a, .item a[href*="product"]',
      priceSelector: '[class*="price"]',
      imageSelector: '.pictures-wrapper img',
      linkSelector: 'a[href*="product"]',
      maxPages: 1, // Algolia infinite scroll, 1 page loads 30+
    },
    city: 'Belle Vernon',
    state: 'PA',
  },

  // ─── Arrow Truck Sales (Next.js grid cards) ───────────────────────
  {
    name: 'Arrow Truck Sales',
    slug: 'arrow-truck-sales',
    website: 'https://www.arrowtruck.com',
    inventoryUrl: 'https://www.arrowtruck.com/search-inventory/united-states',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.grid.items-stretch > .h-full',
      titleSelector: 'h3',
      priceSelector: 'h3', // Price is embedded in h3 text like "2023 Freightliner Cascadia$69,999"
      imageSelector: 'img',
      linkSelector: 'a[href*="inventory"], a[href*="truck"]',
      maxPages: 1,
    },
    city: 'Kansas City',
    state: 'MO',
  },

];

export function getDealerBySlug(slug) {
  return DEALER_CONFIGS.find(d => d.slug === slug) || null;
}

export function getActiveDealers() {
  return DEALER_CONFIGS;
}

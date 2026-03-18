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
      listingSelector: 'ul.alm-listing > li.alm-item',
      titleSelector: 'a strong, a',
      priceSelector: '.price, [class*="price"]',
      imageSelector: 'img',
      linkSelector: 'a[href*="/trailer/"]',
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

  // ─── Western Truck & Trailer (Webflow: .filter-course-item) ──────
  {
    name: 'Western Truck & Trailer',
    slug: 'western-truck',
    website: 'https://www.westerntruck.com',
    inventoryUrl: 'https://www.westerntruck.com/inventory',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.filter-course-item',
      titleSelector: '.subheading-regular.inventory',
      priceSelector: '.price',
      imageSelector: '.course-video-thumbnail',
      linkSelector: '.link-block-2',
      maxPages: 5,
    },
    city: 'Phoenix',
    state: 'AZ',
  },

  // ─── J & B Pavelka (blocked by Imperva/Distil bot protection) ──
  {
    name: 'J & B Pavelka',
    slug: 'jb-pavelka',
    website: 'https://www.jbpavelkainc.com',
    inventoryUrl: 'https://www.jbpavelkainc.com/Inventory/?/listings/for-sale/trailers/28?accountcrmid=361605&settingscrmid=361605&dlr=1',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    active: false, // Site blocks automated browsers (Imperva bot protection)
    city: 'Robstown',
    state: 'TX',
  },

  // ─── The Pete Store (Liferay CMS, .product-listing-card) ───────
  {
    name: 'The Pete Store',
    slug: 'the-pete-store',
    website: 'https://www.thepetestore.com',
    inventoryUrl: 'https://www.thepetestore.com/g/new',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.product-listing-card',
      titleSelector: '.product-card-title a',
      priceSelector: '.prod-price',
      imageSelector: '.product-card-top img',
      linkSelector: '.product-card-title a',
      maxPages: 10,
    },
    city: 'Multi-Location',
    state: 'FL',
  },

  // ─── LMI Tennessee (Sandhills/MachineryTrader, .listing-card) ──
  {
    name: 'LMI Tennessee',
    slug: 'lmi-tennessee',
    website: 'https://www.lmitennessee.com',
    inventoryUrl: 'https://www.lmitennessee.com/inventory/?/listings/for-sale/trailers/28?DSCompanyID=2184&dlr=1&settingscrmid=5010937',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.listing-card',
      titleSelector: '.listing-main-image',
      priceSelector: '.listing-price-value',
      imageSelector: '.listing-main-image, .listing-main-img',
      linkSelector: 'a[href*="listing/for-sale"]',
      maxPages: 5,
    },
    city: 'Waverly',
    state: 'TN',
  },

  // ─── Bruckner Truck & Equipment (JS-heavy, auto-detect) ───────
  {
    name: 'Bruckner Truck & Equipment',
    slug: 'bruckner-truck',
    website: 'https://www.brucknertruck.com',
    inventoryUrl: 'https://www.brucknertruck.com/Pre-Owned-Inventory-For-Sale/?category=Trailer',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    city: 'Dallas',
    state: 'TX',
  },

  // ─── Nuss Truck & Equipment (blocked: 403 Forbidden) ──────────
  {
    name: 'Nuss Truck & Equipment',
    slug: 'nuss-group',
    website: 'https://www.nussgrp.com',
    inventoryUrl: 'https://www.nussgrp.com/shoptrailers/',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    active: false, // Returns 403 Forbidden
    city: 'Rochester',
    state: 'MN',
  },

  // ─── All Roads Kenworth (SandHills Global inventory widget) ──
  {
    name: 'All Roads Kenworth',
    slug: 'all-roads-kenworth',
    website: 'https://www.allroadskenworth.com',
    inventoryUrl: 'https://www.allroadskenworth.com/inventory/all/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.list-listing-card-wrapper',
      titleSelector: 'h2.listing-portion-title, a.list-listing-title-link',
      priceSelector: '.price-contain',
      imageSelector: 'img.listing-main-img',
      linkSelector: 'a.list-listing-title-link',
      maxPages: 5,
    },
    city: 'Maryland',
    state: 'MD',
  },

  // ─── Tri-State Trailer Sales (SandHills Global, 84 listings) ─
  {
    name: 'Tri-State Trailer Sales',
    slug: 'tri-state-trailer',
    website: 'https://www.tristatetrailer.com',
    inventoryUrl: 'https://www.tristatetrailer.com/inventory/?/listings/for-sale/trailers/28?DSCompanyID=3584&dlr=1&settingscrmid=367709',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.list-listing-card-wrapper',
      titleSelector: 'h2.listing-portion-title, a.list-listing-title-link',
      priceSelector: '.price-contain',
      imageSelector: 'img.listing-main-img',
      linkSelector: 'a.list-listing-title-link',
      maxPages: 5,
    },
    city: 'Pittsburgh',
    state: 'PA',
  },

  // ─── Peters & Keatts (buzznerd/Algolia widget) ──────────────
  {
    name: 'Peters & Keatts',
    slug: 'peters-keatts',
    website: 'https://www.petersandkeatts.net',
    inventoryUrl: 'https://www.petersandkeatts.net/inventory/trailers/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.ais-InfiniteHits-item',
      titleSelector: '.contentRightCol h4, .contentRightCol a, .item a[href*="product"]',
      priceSelector: '[class*="price"]',
      imageSelector: '.pictures-wrapper img',
      linkSelector: 'a[href*="product"]',
      maxPages: 1, // Algolia infinite scroll
    },
    city: 'Raleigh',
    state: 'NC',
  },

  // ─── Bulk Equipment (blocked by Imperva bot protection) ─────
  {
    name: 'Bulk Equipment',
    slug: 'bulk-equipment',
    website: 'https://www.bulkequipment.com',
    inventoryUrl: 'https://www.bulkequipment.com/all-equipment',
    scrapeMethod: 'auto',
    scrapeConfig: { maxPages: 5 },
    active: false, // Imperva/Incapsula bot protection blocks all requests
    city: 'Ellaville',
    state: 'GA',
  },

  // ─── Preferred Lowboys (MyLittleSalesman platform, SSR) ────
  {
    name: 'Preferred Lowboys',
    slug: 'preferred-lowboys',
    website: 'https://www.preferredlowboys.com',
    inventoryUrl: 'https://www.preferredlowboys.com/all-equipment',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: 'a[href*="/for-sale/"]',
      titleSelector: 'a[href*="/for-sale/"]',
      priceSelector: 'p',
      imageSelector: 'img',
      linkSelector: 'a[href*="/for-sale/"]',
      maxPages: 4, // 25 per page, ~95 total
    },
    city: 'Houston',
    state: 'TX',
  },

];

export function getDealerBySlug(slug) {
  return DEALER_CONFIGS.find(d => d.slug === slug) || null;
}

export function getActiveDealers() {
  return DEALER_CONFIGS.filter(d => d.active !== false);
}

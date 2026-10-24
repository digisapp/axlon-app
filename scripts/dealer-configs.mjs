// @ts-nocheck
/**
 * Dealer configurations for inventory scraping.
 * These are ACTUAL DEALERS with for-sale inventory, not just manufacturer product catalogs.
 *
 * scrapeMethod:
 *   'css'  — use CSS selectors to extract listings from HTML pages
 *   'auto' — try auto-detection (fallback)
 *
 * For CSS-based scrapers, provide selectors in scrapeConfig (selector lists
 * are comma-separated and tried in order; within a card the descendant is
 * used, falling back to the card itself when the card IS the element):
 *   - listingSelector: CSS selector for each listing card/row
 *   - titleSelector: within a listing, selector for the title
 *   - priceSelector: within a listing, selector for the price text. Only a
 *       $/USD amount (or text that is only a number) counts as a price;
 *       "Call for price" → null, never a stray number from the card.
 *   - imageSelector: within a listing, image elements (data-src / data-original
 *       / nitro-lazy-src / src / srcset; Next.js /_next/image URLs unwrapped)
 *   - imageReplace: [[regex, replacement], …] applied to image URLs (thumb → full)
 *   - linkSelector: within a listing, selector for the detail page link
 *   - linkTemplate: detail URL built from the id when cards have no <a> ('{id}')
 *   - stockSelector / vinSelector / locationSelector / conditionSelector /
 *     yearSelector / makeSelector / modelSelector: optional per-field selectors
 *   - fieldSelector (+ fieldLabelSelector / fieldValueSelector): "Label: value"
 *       spec rows; Location / Stock # / VIN / Year / Manufacturer / Model /
 *       Condition|Status are mapped to listing fields, the rest kept as specs
 *   - stockPattern / specPatterns: regexes run over the card's text
 *   - idAttribute / idFrom: 'stock' / idFromLink (regex, group 1): stable
 *       per-unit id. Without one the last URL path segment is used (the
 *       historical id — don't add one to a dealer with existing rows, or every
 *       unit re-imports as a duplicate).
 *   - includeIf / excludeIf: regex on the card text (e.g. only "In stock")
 *   - cityStates: { 'City': 'ST' } for cards that only show a city
 *   - pagination: { type: 'next-link', selector } (default: generic next link)
 *                 { type: 'url', template: '{url}&page={page}' }
 *                 { type: 'click', selector } (client-side "Next" button)
 *   - maxPages: page cap. Hitting it with pages left marks the crawl
 *       incomplete, which skips retirement — keep headroom over the real count.
 *   - totalSelector / totalPattern: the dealer's own "1-25 of 79" count; a
 *       crawl that sees <90% of it is incomplete (no retirement)
 *   - pageDelayMs (default 2000; honour robots.txt Crawl-delay),
 *     waitUntil, blockResources (skip images/CSS/fonts), scrollToLoad
 *
 * Dealer-level: inventoryUrls (several start URLs), maxCreatePerRun (cap on
 * new listings per live run), defaultCondition, crawl(page, ctx) for a
 * site-specific crawl that returns { cards }.
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
      // 10 per page. 70 pages in Oct 2026 — the old cap of 40 stopped the
      // crawl at 400 of ~700 units and then retired units on pages 41+ as
      // "sold" (29 on the Oct 15 run). Hitting the cap now skips retirement.
      // URL paging (same /page/N/ pages the next link pointed to) so one
      // page their server 500s on (page 59, Oct 22) doesn't hide the rest.
      pagination: { type: 'url', template: '{url}page/{page}/' },
      maxPages: 100,
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

  // ─── Royal Truck & Utility Trailer (WooCommerce + AJAX grid) ───────
  // /inventory/ server-renders only the first 6 products; the rest of the
  // grid comes from the theme's own admin-ajax action, 6 per page. robots.txt
  // disallows query-string URLs (/*?) but explicitly allows admin-ajax.php,
  // so we page through that (same request the "next page" button makes).
  // Trailers only: the store also lists ~100 liftgates, truck bodies,
  // cranes and compressors that aren't marketplace inventory.
  // Id = product slug. The old auto-detect keyed rows on the card's first
  // <a> — the photo lightbox link — so existing rows carry image-file ids
  // (and units sharing a photo collapsed into one). Those won't match; the
  // first clean run creates fresh rows and retires the old ones as unseen.
  {
    name: 'Royal Trailer Sales',
    slug: 'royal-trailer-sales',
    website: 'https://royaltrailersales.com',
    inventoryUrl: 'https://royaltrailersales.com/inventory/',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.product-block',
      titleSelector: '.content-slide h2 a',
      priceSelector: '.product-price',
      imageSelector: '.swiper-slide img',
      linkSelector: '.content-slide h2 a',
      locationSelector: '.product-location',
      // Cards are labelled In Stock Now / On Order / Arriving Soon / Call for
      // Custom Order (or blank). "Call for Custom Order" tiles are
      // build-to-order configurations, not units.
      excludeIf: 'call for custom order',
      maxPages: 40,
    },
    async crawl(page, { goto, extractFromHtml, sleep, log }) {
      await goto('https://royaltrailersales.com/inventory/');
      const cap = 40;
      const cards = [];
      let maxPages = 1;
      for (let p = 1; p <= Math.min(maxPages, cap); p++) {
        const res = await page.evaluate(async (pageNum) => {
          const body = new URLSearchParams({ action: 'ps_load_filtered_products', page: String(pageNum), search: '', sort: '' });
          body.append('categories[]', 'trailers');
          const r = await fetch('/wp-admin/admin-ajax.php', { method: 'POST', body, credentials: 'same-origin' });
          if (!r.ok) return { error: `HTTP ${r.status}` };
          const j = await r.json().catch(() => null);
          if (!j || !j.success) return { error: 'unexpected response' };
          return { html: j.data.html, max: Number(j.data.max_pages) || 1 };
        }, p);
        if (res.error) throw new Error(`inventory page ${p}: ${res.error}`);
        maxPages = res.max;
        const pageCards = await extractFromHtml(res.html);
        log(`   Page ${p}/${maxPages}: ${pageCards.length} cards`);
        if (pageCards.length === 0) break;
        cards.push(...pageCards);
        await sleep(1500);
      }
      return maxPages > cap
        ? { cards, truncated: true, truncatedReason: `site reports ${maxPages} pages, cap is ${cap}` }
        : { cards };
    },
    city: 'Northville', // HQ per site footer (was Lubbock, TX — wrong dealer)
    state: 'MI',
  },

  // ─── Hale Trailer Brake & Wheel (Ajax Load More, server-rendered) ───
  // Real stock units (Stock # per unit), not catalog pages — but the old
  // `ul.alm-listing > li.alm-item` markup is gone, so the run fell back to
  // auto-detect, saw only the 12 newest units on page 1, and churned (created
  // 12 / retired 12 each run). Pages are deep-linkable with ?pg=N.
  // Oct 2026: ~529 pages of new (≈6,340 units) + ~34 pages of used (≈400).
  // No prices on the site (all call-for-price) and most units have only a
  // placeholder photo. The site answers ?pg=N slowly (~5s/page), so a full
  // crawl takes ~50 min; maxCreatePerRun keeps crawl + creation inside the
  // workflow's 120-min timeout and spreads the first import over many runs.
  // The crawl itself stays complete so retirement is right.
  {
    name: 'Hale Trailer Brake & Wheel',
    slug: 'hale-trailer',
    website: 'https://haletrailer.com',
    inventoryUrl: 'https://haletrailer.com/trailer/',
    inventoryUrls: ['https://haletrailer.com/trailer/', 'https://haletrailer.com/used/'],
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.trailer-wrap',
      titleSelector: '.repeater-title a',
      priceSelector: '.price, [class*="price"]',
      imageSelector: '.trailer-product_image_default img',
      linkSelector: '.repeater-title a',
      fieldSelector: 'p[class^="trailer-"]',
      pagination: { type: 'url', template: '{url}?pg={page}' },
      maxPages: 700,
      pageDelayMs: 1000,
      blockResources: true,
      waitUntil: 'domcontentloaded',
    },
    maxCreatePerRun: 300,
    // Off: none of the 6,740 units has a photo and every one is call-for-
    // price, so the no-photo rule would import nothing after a 50-min crawl.
    // Turn back on if Hale starts publishing photos.
    active: false,
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
      maxPages: 10, // 16 per page, ~7 pages,
    },
    city: 'Phoenix',
    state: 'AZ',
  },

  // ─── Renos Trailer Sales (moved to Sandhills; Cloudflare-challenged) ─
  // The old Algolia page (/all-inventory/) is gone (404). Inventory now lives
  // on a Sandhills dealer site (60 trailers, Oct 2026) that serves a
  // Cloudflare "Just a moment…" challenge to curl and to plain headless
  // Chrome, so it is marked inactive like the other bot-blocked dealers.
  // Config below is updated for the new site (selectors as Tri-State; the
  // &page=N pagination matches LMI's Sandhills site but is unverified on this
  // /listings/search URL) so re-enabling is a one-line change if the owner
  // decides scraping Cloudflare-challenged sites is acceptable.
  {
    name: 'Renos Trailer Sales',
    slug: 'renos-trailer',
    website: 'https://www.renostrailer.com',
    inventoryUrl: 'https://www.renostrailer.com/inventory/?/listings/search?DSCompanyID=3494&SettingsCRMID=16280910&ScopeCategoryIDs=28&Keywords={rts}',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.list-listing-card-wrapper',
      titleSelector: 'a.list-listing-title-link, h2.listing-portion-title',
      priceSelector: '.price-container .price, .price',
      imageSelector: 'img.listing-main-img, img.listing-main-image',
      linkSelector: 'a.list-listing-title-link',
      idAttribute: 'data-listing-id',
      fieldSelector: '.spec-container',
      fieldLabelSelector: '.spec-label',
      fieldValueSelector: '.spec-value',
      locationSelector: '.machine-location',
      totalSelector: '.list-listings-count',
      pagination: { type: 'url', template: '{url}&page={page}' },
      maxPages: 10,
    },
    active: false, // Cloudflare challenge (403 "Just a moment…") for curl and plain headless Chrome
    city: 'Belle Vernon',
    state: 'PA',
  },

  // ─── Arrow Truck Sales (Next.js grid, client-side paging) ─────────
  // Cards have no <a>: the detail page is /inventory/<stock #>. Paging is a
  // client-side "Next" button (URL params are ignored). ~313 used trucks in
  // 11 pages of 30 (Oct 2026). Images lazy-load, hence scrollToLoad.
  // robots.txt lists both "Allow: /" and "Disallow: /" for *; equal-length
  // rules resolve to Allow (RFC 9309).
  {
    name: 'Arrow Truck Sales',
    slug: 'arrow-truck-sales',
    website: 'https://www.arrowtruck.com',
    inventoryUrl: 'https://www.arrowtruck.com/search-inventory/united-states',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.grid.items-stretch > .h-full',
      titleSelector: 'h3 > span', // h3 also holds the price; the whole h3 read "2024 Peterbilt 579$83,999"
      priceSelector: 'h3 p',
      imageSelector: 'img',
      stockPattern: 'Stock #\\s*([A-Za-z0-9-]+)',
      idFrom: 'stock',
      linkTemplate: 'https://www.arrowtruck.com/inventory/{id}',
      locationSelector: 'span.ml-2',
      specPatterns: { mileage: '([\\d,]+)\\s*Miles' },
      scrollToLoad: true,
      pagination: { type: 'click', selector: 'button[aria-label="Next"]' },
      maxPages: 25,
    },
    defaultCondition: 'used',
    city: 'Kansas City',
    state: 'MO',
  },

  // ─── Western Truck & Trailer (rebuilt on Next.js, Oct 2026) ───────
  // The Webflow markup (.filter-course-item) is gone. One page lists every
  // card (~106), but over half are "Call for availability" model tiles with
  // no year/location — a product catalog, not units — so only "In stock"
  // cards are imported. No stock # on cards; the detail slug is the id.
  {
    name: 'Western Truck & Trailer',
    slug: 'western-truck',
    website: 'https://www.westerntruck.com',
    inventoryUrl: 'https://www.westerntruck.com/inventory',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: 'a[href^="/inventory/"]:has(h3)',
      titleSelector: 'h3',
      priceSelector: 'p[class*="type-display"]',
      imageSelector: 'img:not([alt$=" logo"])',
      linkSelector: 'a[href^="/inventory/"]',
      locationSelector: 'span:has(> svg.lucide-map-pin) > span:not(.sr-only)',
      yearSelector: 'span.nums-tabular',
      conditionSelector: 'span.absolute',
      includeIf: '\\bin stock\\b',
      scrollToLoad: true,
      maxPages: 1,
      // Cards show only the branch city (or just the state for Montana /
      // Texas / Nevada branches, which parseLocation maps on its own).
      cityStates: { 'Salt Lake City': 'UT', Roosevelt: 'UT', 'Las Vegas': 'NV' },
    },
    city: 'Salt Lake City', // HQ (was Phoenix, AZ — Western has no Arizona branch)
    state: 'UT',
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

  // ─── LMI Tennessee (Sandhills dealer site) ─────────────────────
  // Cards matched (28 on the Oct 15 run) but titleSelector pointed at an
  // <img> (no text), so every card was dropped. Selectors now match the
  // Tri-State config (same platform); 28 per page, &page=N paginates
  // (~365 trailers, ~14 pages, Oct 2026). Id = Sandhills listing id.
  // NOTE: like Tri-State / All Roads, this site serves a Cloudflare
  // challenge to plain headless Chrome; it only loads under the runner's
  // stealth setup, so whether it stays on is the same owner decision.
  // Selectors verified against a saved page snapshot, not a live dry run.
  {
    name: 'LMI Tennessee',
    slug: 'lmi-tennessee',
    website: 'https://www.lmitennessee.com',
    inventoryUrl: 'https://www.lmitennessee.com/inventory/?/listings/for-sale/trailers/28?DSCompanyID=2184&dlr=1&settingscrmid=5010937',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.list-listing-card-wrapper',
      titleSelector: 'a.list-listing-title-link, h2.listing-portion-title',
      priceSelector: '.price-container .price, .price',
      imageSelector: 'img.listing-main-img, img.listing-main-image',
      linkSelector: 'a.list-listing-title-link',
      idAttribute: 'data-listing-id',
      fieldSelector: '.spec-container',
      fieldLabelSelector: '.spec-label',
      fieldValueSelector: '.spec-value',
      locationSelector: '.machine-location',
      totalSelector: '.list-listings-count',
      pagination: { type: 'url', template: '{url}&page={page}' },
      maxPages: 25,
    },
    city: 'Waverly',
    state: 'TN',
  },

  // ─── Bruckner Truck & Equipment (WordPress inventory plugin) ──
  // Old URL was pre-owned trailers only (8 units); /inventory/?category=Trailer
  // is new + used (141, 36 per page, ?pg=N via the right-arrow link).
  // robots.txt asks for Crawl-delay: 10 — honoured via pageDelayMs.
  {
    name: 'Bruckner Truck & Equipment',
    slug: 'bruckner-truck',
    website: 'https://www.brucknertruck.com',
    inventoryUrl: 'https://www.brucknertruck.com/inventory/?category=Trailer',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.manage-inventory-container',
      titleSelector: '.inventory-main-title h2',
      priceSelector: '.list-sale-price, .list-pricing',
      imageSelector: 'input.inventory-list-images, img.manage-inventory-image',
      linkSelector: 'a.inventory-main-title',
      idAttribute: 'data-inventory-id',
      stockSelector: '.list-stock',
      locationSelector: '.card-location',
      fieldSelector: '.spec-name-value',
      fieldLabelSelector: '.spec-name',
      fieldValueSelector: '.spec-value',
      totalSelector: '.inventory-total-results',
      pagination: { type: 'next-link', selector: '.pagination-controls-container a.page-right-button:not(.disable-page-button)' },
      pageDelayMs: 10000,
      maxPages: 10,
      // Cards name only the branch.
      cityStates: {
        Alvarado: 'TX', Amarillo: 'TX', 'Dallas I-20': 'Dallas, TX', 'Fort Worth': 'TX', Lubbock: 'TX',
        Odessa: 'TX', 'San Antonio': 'TX', 'Wichita Falls': 'TX',
        'Big Cabin': 'OK', Enid: 'OK', 'Oklahoma City': 'OK', Tulsa: 'OK',
        'Garden City': 'KS', Hays: 'KS', Salina: 'KS', Wichita: 'KS',
        Farmington: 'NM', Hobbs: 'NM', 'Fountain/CO Springs': 'Fountain, CO',
        Monroe: 'LA', Shreveport: 'LA', Pottsville: 'AR', 'Van Buren': 'AR', Missoula: 'MT', 'Tye (Abilene)': 'Tye, TX',
      },
    },
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
  // The old config used the <a> itself as the card and then looked for an
  // <a> INSIDE it for the title, so all 75 matches were dropped as untitled.
  // Cards are .product-results-container (25 per page, ?p=N; 79 units in
  // Oct 2026). Id = MLS number at the end of the detail URL (the slug's year
  // can disagree with the title, so the slug alone isn't trusted). Images are
  // lazy (data-original) and "-thumb" — the full-size file sits beside it.
  // No robots.txt (404).
  {
    name: 'Preferred Lowboys',
    slug: 'preferred-lowboys',
    website: 'https://www.preferredlowboys.com',
    inventoryUrl: 'https://www.preferredlowboys.com/all-equipment',
    scrapeMethod: 'css',
    scrapeConfig: {
      listingSelector: '.product-results-container',
      titleSelector: 'h2 a[itemprop="name"], h2 a',
      priceSelector: '.product-price',
      imageSelector: '.product-image img, meta[itemprop="image"]',
      imageReplace: [['-thumb\\.(jpe?g|png|webp)$', '.$1']],
      linkSelector: 'h2 a[href*="/for-sale/"]',
      idFromLink: '-(\\d+)(?:[/?#]|$)',
      makeSelector: '[itemprop="brand"] meta[itemprop="name"]',
      modelSelector: 'meta[itemprop="model"]',
      conditionSelector: 'link[itemprop="itemCondition"]',
      fieldSelector: 'table tr',
      fieldLabelSelector: 'td.b',
      fieldValueSelector: 'td:last-child',
      totalSelector: '#sc_argc_pnlPagerTop',
      totalPattern: 'of\\s+([\\d,]+)\\s*results',
      pagination: { type: 'next-link', selector: '.pagination li.pagination-next:not(.disabled) a' },
      maxPages: 10,
    },
    city: 'Houston',
    state: 'TX',
  },


  // ─── Plain-HTTP adapters (scripts/dealers/<adapter>.mjs) ─────────────
  // Each fetches the dealer's own inventory without a browser, identifies as
  // AxleyardBot, honors robots.txt, and stops at any bot challenge.
  {
    name: 'HD Trailers',
    slug: 'hd-trailers',
    website: 'https://hdtrailers.com',
    inventoryUrl: 'https://hdtrailers.com/inventory',
    adapter: 'hd-trailers',
    city: 'Andalusia',
    state: 'AL',
  },
  {
    name: 'Lonestar Truck Group',
    slug: 'lonestar-truck-group',
    website: 'https://www.tntxtruck.com',
    inventoryUrl: 'https://www.tntxtruck.com/Sales/TrailerInventory.aspx',
    adapter: 'lonestar-truck-group',
    state: 'TX',
  },
  {
    name: 'Area Trailer Sales & Rentals',
    slug: 'area-trailer-sales',
    website: 'https://www.areatrailersalesandrentals.com',
    inventoryUrl: 'https://www.areatrailersalesandrentals.com/trailers-for-sale-new-used',
    adapter: 'area-trailer-sales',
    city: 'Odessa',
    state: 'TX',
  },
  {
    name: 'ILoca Services',
    slug: 'iloca-services',
    website: 'https://semitrailers.net',
    inventoryUrl: 'https://semitrailers.net/',
    adapter: 'iloca-services',
    city: 'Aurora',
    state: 'IL',
  },
  {
    name: 'Moore Truck & Equipment',
    slug: 'moore-truck',
    website: 'https://www.mooretruck.com',
    inventoryUrl: 'https://www.mooretruck.com/lowboy-trailers-for-sale.html',
    adapter: 'moore-truck',
    city: 'Shreveport',
    state: 'LA',
  },
  {
    name: 'Ballard Truck Centers',
    slug: 'ballard-trucks',
    website: 'https://www.ballardtrucks.com',
    inventoryUrl: 'https://www.ballardtrucks.com/trailer-inventory/',
    adapter: 'ballard-trucks',
    city: 'Avon',
    state: 'MA',
  },
  {
    name: 'Northwest Truck & Trailer',
    slug: 'northwest-truck-trailer',
    website: 'https://www.nwtruckandtrailer.com',
    inventoryUrl: 'https://www.nwtruckandtrailer.com/inventory/',
    adapter: 'northwest-truck-trailer',
    city: 'Fargo',
    state: 'ND',
  },
];

export function getDealerBySlug(slug) {
  return DEALER_CONFIGS.find(d => d.slug === slug) || null;
}

export function getActiveDealers() {
  return DEALER_CONFIGS.filter(d => d.active !== false);
}

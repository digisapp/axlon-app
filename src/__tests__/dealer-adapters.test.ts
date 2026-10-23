import { describe, it, expect } from 'vitest';
import * as lib from '../../scripts/dealers/_lib.mjs';
import * as lonestar from '../../scripts/dealers/lonestar-truck-group.mjs';
import * as area from '../../scripts/dealers/area-trailer-sales.mjs';

const dealer = { city: 'Dealer City', state: 'ZZ' };

describe('dealer adapter plumbing (_lib)', () => {
  it('parses robots.txt groups, wildcards and crawl-delay', () => {
    const robots = lib.parseRobots(
      [
        'User-agent: GPTBot',
        'Disallow: /',
        '',
        'User-agent: AdsBot-Google',
        'User-agent: *',
        'Disallow: /api/',
        'Allow: /api/ui-extensions/',
        'Disallow:/*?format=json',
        'Crawl-delay: 10',
      ].join('\n')
    );
    expect(robots.crawlDelay).toBe(10);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/trailers-for-sale')).toBe(true);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/trailers-for-sale?format=json')).toBe(false);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/api/commerce')).toBe(false);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/api/ui-extensions/a')).toBe(true);
  });

  it('applies a crawl-delay written before any user-agent line and ignores empty Disallow', () => {
    const robots = lib.parseRobots('Crawl-delay: 10\nUser-agent: *\nDisallow: /wp-content/uploads/wpforms/\nDisallow:\n');
    expect(robots.crawlDelay).toBe(10);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/used/trailer-inventory/')).toBe(true);
    expect(lib.isAllowedByRobots(robots, 'https://x.com/wp-content/uploads/wpforms/a.pdf')).toBe(false);
  });

  it('treats 403/429 and challenge pages as blocked', () => {
    expect(() => lib.assertNotChallenge(403, '', 'u')).toThrow(/blocked/);
    expect(() => lib.assertNotChallenge(429, '', 'u')).toThrow(/blocked/);
    expect(() => lib.assertNotChallenge(200, '<html><title>Just a moment...</title></html>', 'u')).toThrow(/challenge/);
    expect(() =>
      lib.assertNotChallenge(200, '<html><script src="/cdn-cgi/challenge-platform/scripts/jsd/main.js"></script></html>', 'u')
    ).not.toThrow();
  });

  it('parses prices, years, conditions and VINs conservatively', () => {
    expect(lib.parsePrice('$104,900')).toBe(104900);
    expect(lib.parsePrice('')).toBeNull();
    expect(lib.parsePrice('Call for price')).toBeNull();
    expect(lib.parsePrice(0)).toBeNull();
    expect(lib.parseYear('2027 Dragon RGN')).toBe(2027);
    expect(lib.parseYear('53 ft')).toBeNull();
    expect(lib.parseCondition('Pre-Owned')).toBe('used');
    expect(lib.parseCondition('New')).toBe('new');
    expect(lib.parseCondition('')).toBeNull();
    expect(lib.cleanVin('1unsf5336vd207257')).toBe('1UNSF5336VD207257');
    expect(lib.cleanVin('XXXXXXXXXSO70659X')).toBeNull(); // 'O' is never valid in a VIN
    expect(lib.cleanVin('N/A')).toBeNull();
  });

  it('classifies the lowboy family', () => {
    const t = (title: string, specs = {}) => lib.isLowboyFamily({ title, specs });
    expect(t('2027 Dragon RGN 55 Ton Lowboy')).toBe(true);
    expect(t('2025 Trail King TK110HDG')).toBe(false);
    expect(t('2025 Trail King TK110HDG', { 'Trailer Type': 'Hydraulic Detach' })).toBe(true);
    expect(t('2024 Fontaine Double Drop')).toBe(true);
    expect(t('2026 Witzco Tag-Along')).toBe(true);
    expect(t('2027 Wabash Flatbed')).toBe(false);
    expect(t('2012 Pitts Drop Deck')).toBe(false);
  });
});

describe('Lonestar Truck Group (tntxtruck.com)', () => {
  const page = `
<script>
    Lonestar.Inventory.ViewInventory.js.init(
        document.getElementById('dnn_ctr1122_ViewInventory_InventoryApplicationPanel'),
        {
            vehicles: [{"Specs":{"StockNumber":"VD207257","Year":"2027","Make":"Dragon","Model":"RGN","VIN":"1UNSF5336VD207257","NewUsed":"New","SalesPrice":"104900","WebComments":"FET included, 55 ton Hyd Detach, 26' well.","FrontWheelDesc":"All Steel","FrontTireSizeDesc":"","xColor":"Black","xLength":"53","xWidth":"102","xAxles":"Tri Axle","xSuspension":"Air","xtrailerType":"Lowboy - 55 Ton","xComposition":"Steel","GVWR":"","xCondition":"New","LocationCity":"Bryan","LocationState":"TX"},"Images":[{"ImagePath":"/Arc/VD207257/VD207257-01.jpg","ThumbnailPath":"/Arc/VD207257/thumb/VD207257-01.jpg"},{"ImagePath":"/Arc/VD207257/VD207257-02.jpg"}]},{"Specs":{"StockNumber":"SO70659X","Year":"2023","Make":"XL Specialized","Model":"SPREADER BAR","VIN":"XXXXXXXXXSO70659X","SalesPrice":"12500","xtrailerType":"Spreader Bar","LocationCity":"Bryan","LocationState":"TX"},"Images":[{"ImagePath":"/Arc/SO70659X/SO70659X-01.jpg"}]},{"Specs":{"StockNumber":"PS000187","Year":"2023","Make":"CTS","Model":"Bottom Dump - STND","VIN":"1C9BD4029PS000187","NewUsed":"Used","SalesPrice":"","xtrailerType":"Bottom Dump - STND","xWidth":"Other","LocationCity":"","LocationState":""},"Images":[{"ImagePath":"/Arc/PS000187/PS000187-01.jpg"}]},{"Specs":{"StockNumber":"NOPHOTO1","Year":"2024","Make":"Benson","Model":"FLATBED","xtrailerType":"Flatbed"},"Images":[]}],
            filters: [{"DisplayName":"Condition","Name":"NewUsed"}],
            detailsViewUrl: "https://www.tntxtruck.com/Sales/Trailer-Details",
        });
</script>`;

  it('extracts the inline vehicles array and details URL', () => {
    const { vehicles, detailsViewUrl } = lonestar.parseInventory(page);
    expect(vehicles).toHaveLength(4);
    expect(detailsViewUrl).toBe('https://www.tntxtruck.com/Sales/Trailer-Details');
    expect(() => lonestar.parseInventory('<html></html>')).toThrow(/not found/);
  });

  it('skips accessories and units without photos', () => {
    const { vehicles } = lonestar.parseInventory(page);
    expect(vehicles.filter(lonestar.isListableUnit).map((v: any) => v.Specs.StockNumber)).toEqual(['VD207257', 'PS000187']);
  });

  it('maps a unit to a raw listing with its own yard location', () => {
    const { vehicles, detailsViewUrl } = lonestar.parseInventory(page);
    const l = lonestar.toRawListing(vehicles[0], dealer, detailsViewUrl);
    expect(l).toMatchObject({
      title: '2027 Dragon RGN 55 Ton Lowboy',
      year: 2027,
      make: 'Dragon',
      model: 'RGN',
      condition: 'new',
      price: 104900,
      price_type: 'fixed',
      stock_number: 'VD207257',
      vin: '1UNSF5336VD207257',
      source_url: 'https://www.tntxtruck.com/Sales/Trailer-Details?vin=1UNSF5336VD207257',
      source_listing_id: 'VD207257',
      city: 'Bryan',
      state: 'TX',
    });
    expect(l.images).toEqual([
      'https://www.tntxtruck.com/Arc/VD207257/VD207257-01.jpg',
      'https://www.tntxtruck.com/Arc/VD207257/VD207257-02.jpg',
    ]);
    expect(l.specs).toMatchObject({ 'Trailer Type': 'Lowboy - 55 Ton', Length: '53 ft', Width: '102 in', Axles: 'Tri Axle' });
    expect(lib.isLowboyFamily(l)).toBe(true);
  });

  it('leaves a missing price null and falls back to the dealer location', () => {
    const { vehicles } = lonestar.parseInventory(page);
    const l = lonestar.toRawListing(vehicles[2], dealer);
    expect(l.price).toBeNull();
    expect(l.price_type).toBe('call_for_price');
    expect(l.condition).toBe('used');
    expect(l.title).toBe('2023 CTS Bottom Dump - STND');
    expect(l.specs.Width).toBeUndefined();
    expect([l.city, l.state]).toEqual(['Dealer City', 'ZZ']);
  });
});

describe('Area Trailer Sales & Rentals (Squarespace)', () => {
  const list = `
<div class="product-list-item" data-product-id="6aac458bc9c0f50bb5b8afae">
  <a class="product-list-item-link" href=/trailers-for-sale-new-used/p/2025-atoka-rgn-lowboy aria-label="2025 Atoka RGN Lowboy">
    <figure class="product-list-item-image"><img data-src="https://images.squarespace-cdn.com/content/v1/65ca/a/image002.jpg"></figure>
    <section class="product-list-item-meta" data-animation-role="content">
      <div class="product-list-title-price"><div class="product-list-item-title">
          2025 Atoka RGN Lowboy
        </div></div>
      <div class="product-list-item-status"></div>
    </section>
  </a>
</div>
<div class="product-list-item tag-dry-van tag-used" data-product-id="68bf23e891ca2a75c5ac9ed3">
  <a class="product-list-item-link" href=/trailers-for-sale-new-used/p/53-foot-dry-van-for-sale aria-label="x">
    <section class="product-list-item-meta">
      <div class="product-list-item-title">2020 Vanguard 53' Dry Van | Used Box Van</div>
      <div class="product-list-item-status"></div>
    </section>
  </a>
</div>
<div class="product-list-item on-sale" data-product-id="soldout1">
  <a class="product-list-item-link" href=/trailers-for-sale-new-used/p/sold-one aria-label="x">
    <section class="product-list-item-meta">
      <div class="product-list-item-title">2024 Dorsey Flatbed</div>
      <div class="product-list-item-status"><div class="product-mark sold-out">Sold Out</div></div>
    </section>
  </a>
</div>`;

  const detail = (variant: object, title = '2025 DORSEY COMBO DROP DECK BTR TRAILER') => `
<script>Static.SQUARESPACE_CONTEXT = {"templateId":"x","product":{"variantAttributeNames":[],"variants":[${JSON.stringify(variant)}],"subscribable":false},"showAnnouncementBar":true};</script>
<div class="product-gallery-slides">
  <div class="product-gallery-slides-item"><img data-src="https://images.squarespace-cdn.com/content/v1/65ca/x/one.jpg" data-image="https://images.squarespace-cdn.com/content/v1/65ca/x/one.jpg"></div>
  <div class="product-gallery-slides-item"><img data-src="https://images.squarespace-cdn.com/content/v1/65ca/x/two.jpg?format=1500w"></div>
</div>
<div class="product-gallery-thumbnails"><img data-src="https://images.squarespace-cdn.com/content/v1/65ca/x/thumb-only.jpg"></div>
<div class="product-meta">
  <h1 class="product-title">${title}</h1>
  <div class="product-price-value"><span class="sale-price">$54,900.00</span><span class="original-price">$55,900.00</span></div>
  <div class="product-description hidden-down-md"><p>CAPACITY: Standard Beam Pkg - 80,000 GVWR</p><p>OVERALL LENGTH: 53'</p><p>Great trailer &amp; ready to work.</p></div>
</div>`;
  const unit = { sku: 'D42986', price: { value: 5590000 }, salePrice: { value: 5490000 }, onSale: true, stock: { unlimited: false, quantity: 1 } };

  it('reads every product card with its id, url and tags', () => {
    const cards = area.parseInventory(list);
    expect(cards.map((c: any) => c.id)).toEqual(['6aac458bc9c0f50bb5b8afae', '68bf23e891ca2a75c5ac9ed3', 'soldout1']);
    expect(cards[0]).toMatchObject({
      url: 'https://www.areatrailersalesandrentals.com/trailers-for-sale-new-used/p/2025-atoka-rgn-lowboy',
      title: '2025 Atoka RGN Lowboy',
    });
    expect(cards[1].tags).toEqual(['dry-van', 'used']);
    expect(cards.filter(area.isForSaleCard).map((c: any) => c.id)).not.toContain('soldout1');
  });

  it('takes the sale price, the gallery photos and spec lines from a product page', () => {
    const d = area.parseDetail(detail(unit));
    expect(d.price).toBe(54900);
    expect(d.sku).toBe('D42986');
    expect(d.soldOut).toBe(false);
    expect(d.images).toEqual([
      'https://images.squarespace-cdn.com/content/v1/65ca/x/one.jpg',
      'https://images.squarespace-cdn.com/content/v1/65ca/x/two.jpg',
    ]);
    expect(d.specs).toMatchObject({ Capacity: 'Standard Beam Pkg - 80,000 GVWR', 'Overall Length': "53'" });
    expect(d.description).toContain('Great trailer & ready to work.');
  });

  it('treats $0 as call-for-price and tracked stock at 0 as sold out', () => {
    const zero = area.parseDetail(detail({ sku: 'SQ9243101', price: { value: 0 }, salePrice: { value: 0 }, onSale: false, stock: { unlimited: true } }));
    expect(zero.price).toBeNull();
    const sold = area.parseDetail(detail({ sku: 'D1', price: { value: 100 }, onSale: false, stock: { unlimited: false, quantity: 0 } }));
    expect(sold.soldOut).toBe(true);
  });

  it('skips build-to-order model pages but keeps untracked units that name a year or stock number', () => {
    const card = (slug: string, title: string) => ({
      id: 'x',
      url: `https://www.areatrailersalesandrentals.com/trailers-for-sale-new-used/p/${slug}`,
      title,
      tags: [],
      marks: [],
      status: '',
    });
    const unlimited = (title: string, sku = 'SQ4198243') => ({ title, sku, stock: { unlimited: true } });
    const wet = 'Midland Sand Hopper - Wet Sand';
    const tilt = 'Traveling Axle Tilt Trailer - 40 Ton';
    expect(area.isCatalogModel(card('midland-sand-hopper-wet-sand', wet), unlimited(wet))).toBe(true);
    expect(area.isCatalogModel(card('2025-atoka-rgn-lowboy', '2025 Atoka RGN Lowboy'), unlimited('2025 Atoka RGN Lowboy'))).toBe(false);
    expect(area.isCatalogModel(card('traveling-axle-tilt-trailer-40-ton-sa8244', tilt), unlimited(tilt))).toBe(false);
    expect(
      area.isCatalogModel(card('x', 'Midland Sand Hopper - Dry Sand'), { title: 'x', sku: '010871', stock: { unlimited: false, quantity: 1 } })
    ).toBe(false);
  });

  it('maps a product to a raw listing keyed by the Squarespace product id', () => {
    const [atoka, van] = area.parseInventory(list);
    const d = area.parseDetail(detail(unit));
    const l = area.toRawListing(atoka, d, { city: 'Amarillo', state: 'TX' });
    expect(l).toMatchObject({
      title: '2025 Dorsey Combo Drop Deck BTR Trailer',
      year: 2025,
      make: 'Dorsey',
      price: 54900,
      price_type: 'fixed',
      stock_number: 'D42986',
      source_listing_id: '6aac458bc9c0f50bb5b8afae',
      source_url: 'https://www.areatrailersalesandrentals.com/trailers-for-sale-new-used/p/2025-atoka-rgn-lowboy',
      city: 'Amarillo',
      state: 'TX',
    });
    const v = area.toRawListing(
      van,
      { ...d, title: 'For Sale: 2025 Hard Core Belly Dump Boise, ID', sku: 'Sand Chassis Trailers For Sale' },
      { city: 'Amarillo', state: 'TX' }
    );
    expect(v.title).toBe('2025 Hard Core Belly Dump');
    expect([v.city, v.state]).toEqual(['Boise', 'ID']);
    expect(v.condition).toBe('used');
    expect(v.stock_number).toBeNull();
  });
});

// ── more dealer suites below ──

import { describe, it, expect } from 'vitest';
import * as lib from '../../scripts/dealers/_lib.mjs';
import * as lonestar from '../../scripts/dealers/lonestar-truck-group.mjs';
import * as area from '../../scripts/dealers/area-trailer-sales.mjs';
import * as iloca from '../../scripts/dealers/iloca-services.mjs';
import * as moore from '../../scripts/dealers/moore-truck.mjs';

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

describe('ILoca Services (WooCommerce Store API)', () => {
  const attr = (name: string, ...terms: string[]) => ({ name, terms: terms.map((t) => ({ name: t })) });
  const product = (over: Record<string, unknown> = {}) => ({
    id: 2455031,
    name: '2027 FONTAINE SPECIALIZED 60LCC HYDRAULIC DETACHABLE LOWBOY',
    permalink: 'https://semitrailers.net/shop/2027-fontaine-specialized-60lcc-hydraulic-detachable-lowboy/',
    sku: '',
    description: '<p>Take on demanding heavy haul jobs with this <strong>60-ton</strong> lowboy.</p><ul><li>26&#8242; flat level deck</li></ul>',
    prices: { price: '0', currency_minor_unit: 2 },
    is_in_stock: true,
    images: [{ src: 'https://semitrailers.net/wp-content/uploads/2026/07/image002-1-1.jpg' }, { src: 'https://semitrailers.net/wp-content/uploads/2026/07/image003-1.jpg' }],
    categories: [
      { name: 'Heavy Haul Lowboys', slug: 'lowboy-heavy-haul-lowboy-trailers' },
      { name: 'Trailers', slug: 'trailers' },
    ],
    attributes: [
      attr('Year', '2027'),
      attr('Condition ', 'New'),
      attr('Axle', 'Tri'),
      attr('Length (in feet)', '51'),
      attr('Width', '102'),
      attr('Stock Number', 'N110001899'),
      attr('Location', 'Aurora, Illinois'),
    ],
    ...over,
  });

  it('keeps for-sale trailers and skips to-order, pending, sold, accessories and photo-less products', () => {
    expect(iloca.isListableProduct(product())).toBe(true);
    expect(iloca.isListableProduct(product({ attributes: [attr('For Sale', 'AVAILABLE TO ORDER')] }))).toBe(false);
    expect(iloca.isListableProduct(product({ attributes: [attr('For Sale', 'For Sale'), attr('Stock Number', 'Pending')] }))).toBe(false);
    expect(iloca.isListableProduct(product({ is_in_stock: false }))).toBe(false);
    expect(iloca.isListableProduct(product({ name: '2027 FONTAINE 3RD AXLE FLIP &#8211; DOUBLE DROP' }))).toBe(false);
    expect(iloca.isListableProduct(product({ name: '2027 VANGUARD NEW TANDEM AXLE DOLLY' }))).toBe(false);
    expect(iloca.isListableProduct(product({ name: '2022 CIMC ONE-WAY DOMESTIC CONTAINER' }))).toBe(false);
    expect(iloca.isListableProduct(product({ name: '2024 STOUGHTON 40FT CONTAINER CHASSIS' }))).toBe(true);
    expect(iloca.isListableProduct(product({ images: [] }))).toBe(false);
  });

  it('extracts a usable stock number or none', () => {
    expect(iloca.stockNumberOf('N110001864')).toBe('N110001864');
    expect(iloca.stockNumberOf('5A3304 PAVER')).toBe('5A3304');
    expect(iloca.stockNumberOf('LOWBOY 55SA')).toBeNull();
    expect(iloca.stockNumberOf('Pending')).toBeNull();
  });

  it('maps a product to a raw listing with its single yard location', () => {
    const l = iloca.toRawListing(product(), { city: 'Aurora', state: 'IL' });
    expect(l).toMatchObject({
      title: '2027 Fontaine Specialized 60LCC Hydraulic Detachable Lowboy',
      year: 2027,
      make: 'Fontaine',
      condition: 'new',
      price: null,
      price_type: 'call_for_price',
      stock_number: 'N110001899',
      vin: null,
      source_url: 'https://semitrailers.net/shop/2027-fontaine-specialized-60lcc-hydraulic-detachable-lowboy/',
      source_listing_id: '2455031',
      city: 'Aurora',
      state: 'IL',
    });
    expect(l.specs).toMatchObject({ Axle: 'Tri', Length: '51 ft', Width: '102 in', 'Trailer Type': 'Heavy Haul Lowboys' });
    expect(l.description).toContain('60-ton lowboy');
    expect(l.description).toContain('26′ flat level deck');
    expect(l.images).toHaveLength(2);
    expect(lib.isLowboyFamily(l)).toBe(true);
  });

  it('uses the dealer default when a unit is offered at several yards, and a VIN-shaped SKU as the VIN', () => {
    const l = iloca.toRawListing(
      product({
        sku: '13N350200V35A5755',
        prices: { price: '8990000', currency_minor_unit: 2 },
        attributes: [attr('Manufacturer', 'FONTAINE'), attr('Location', 'Aurora, Illinois', 'Davenport, Iowa')],
      }),
      { city: 'Aurora', state: 'IL' }
    );
    expect(l.vin).toBe('13N350200V35A5755');
    expect(l.price).toBe(89900);
    expect(l.price_type).toBe('fixed');
    expect(l.specs['Available At']).toBe('Aurora, Illinois; Davenport, Iowa');
    expect([l.city, l.state]).toEqual(['Aurora', 'IL']);
  });
});

describe('Moore Truck & Equipment (static HTML)', () => {
  const card = (cls: string, href: string, cond: string, title: string, badge: string, imgs: string[]) => `
<div class="product item ${cls} featured-0 new-0 clearfix">
    <div class="thumb">
        ${imgs.map((i) => `<a href="/assets/image-cache/${i}.0f5ae966.jpg" data-lightbox=x><img src="/assets/image-cache/${i}.40982122.jpg" alt=""></a>`).join('\n')}
    </div>
    <div class="product-info">
        <div class="product-title"><a href="${href}"><span class="condition">${cond}</span>&ensp;${title}</a></div>
        <div class="products-details"><h3>Details:</h3><ul>
<li>42' Deck x 102" Wide</li>
<li>Air Ride w/1 Lift Axle</li>
</ul></div>
        <div class="product-manufacturer viking"><h3>Manufacturer</h3></div>
        <div class="product-availability"><h3>Availability</h3><span class="glyphicon ${badge}"></span> Available</div>
    </div>
</div>`;
  const page = `<base href="https://www.mooretruck.com/"><div id="products">
${card('t10lowboy viking used', '4-axle-60-ton-oilfield-lowboy-3411010815.html', 'used', '2009 Viking Trailers 4 Axle 60 Ton Oilfield Lowboy', 'available-now', ['20260728_103821-800w', '20260728_103844-800w'])}
${card('t10lowboy kalyn new', 'stiff-narrow-neck-lowboy.html', 'new', ' KalynSiebert 5 Axle 60/70 Ton Stiff Narrow Neck Lowboy', 'available-now', ['1465481854KS5xStiff'])}
${card('t10lowboy xl new', 'mt-1009221219.html', 'new', ' XL Specialized Trailers 5 Axle 65 Ton Folding Neck Lowboy', 'available-order', ['78-product47'])}
${card('t70jeep scona used', 'tandem-axle-jeep-1111010814.html', 'used', '2012 Scona Tandem Axle Jeep', 'available-now', ['20260417_113700-800w'])}
${card('t20oilfield nabors used', 'no-id-float.html', 'used', '1976 Nabors 3 Axle Oilfield Float', 'available-now', ['02-product0'])}
</div>`;

  it('keeps only "Available Now" trailers, not to-order models or jeeps', () => {
    const cards = moore.parseInventory(page);
    expect(cards).toHaveLength(5);
    expect(cards.filter(moore.isListableCard).map((c: any) => c.title)).toEqual([
      '2009 Viking Trailers 4 Axle 60 Ton Oilfield Lowboy',
      'KalynSiebert 5 Axle 60/70 Ton Stiff Narrow Neck Lowboy',
      '1976 Nabors 3 Axle Oilfield Float',
    ]);
  });

  it('keys units by CMS record number or first-photo upload stamp, never by title', () => {
    const [viking, kalyn, , , float] = moore.parseInventory(page);
    expect(moore.stableIdOf(viking)).toBe('3411010815');
    expect(moore.stableIdOf(kalyn)).toBe('photo-1465481854');
    expect(moore.stableIdOf(float)).toBeNull();
  });

  it('maps a card to a raw listing', () => {
    const [viking, kalyn] = moore.parseInventory(page);
    const l = moore.toRawListing(viking, { city: 'Shreveport', state: 'LA' });
    expect(l).toMatchObject({
      title: '2009 Viking Trailers 4 Axle 60 Ton Oilfield Lowboy',
      year: 2009,
      make: 'Viking',
      condition: 'used',
      price: null,
      price_type: 'call_for_price',
      source_url: 'https://www.mooretruck.com/4-axle-60-ton-oilfield-lowboy-3411010815.html',
      source_listing_id: '3411010815',
      city: 'Shreveport',
      state: 'LA',
    });
    expect(l.images).toEqual([
      'https://www.mooretruck.com/assets/image-cache/20260728_103821-800w.0f5ae966.jpg',
      'https://www.mooretruck.com/assets/image-cache/20260728_103844-800w.0f5ae966.jpg',
    ]);
    expect(l.specs).toMatchObject({ 'Trailer Type': 'Lowboy', Capacity: '60 tons', Deck: `42' Deck x 102" Wide` });
    expect(l.description).toContain('• Air Ride w/1 Lift Axle');
    expect(moore.toRawListing(kalyn, {}).title).toBe('Kalyn Siebert 5 Axle 60/70 Ton Stiff Narrow Neck Lowboy');
  });
});

// ── more dealer suites below ──

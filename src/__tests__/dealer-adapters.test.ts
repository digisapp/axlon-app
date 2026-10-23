import { describe, it, expect } from 'vitest';
import * as lib from '../../scripts/dealers/_lib.mjs';
import * as lonestar from '../../scripts/dealers/lonestar-truck-group.mjs';

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

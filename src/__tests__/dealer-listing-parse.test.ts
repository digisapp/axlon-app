import { describe, it, expect } from 'vitest';
import {
  parsePrice,
  parseLocation,
  normalizeCondition,
  parseYear,
  stripLabel,
  fieldsToListing,
} from '../../scripts/lib/dealer-listing-parse.mjs';
import { extractCardsInPage, buildRawListing } from '../../scripts/lib/dealer-card-extract.mjs';

describe('parsePrice', () => {
  it('reads the $ amount, not the model year glued in front of it', () => {
    // Arrow Truck's h3 text — the old parser priced this truck at $2,024.
    expect(parsePrice('2024 Peterbilt 579$83,999')).toBe(83999);
    expect(parsePrice('$ 92,999')).toBe(92999);
    expect(parsePrice('USD $8,350')).toBe(8350);
    expect(parsePrice('$28,999.00')).toBe(28999);
    expect(parsePrice('28,999')).toBe(28999);
  });

  it('returns null for call-for-price text instead of a stray number', () => {
    // Preferred Lowboys — the old parser turned the phone number into $800.
    expect(parsePrice('Contact for price (800) 777-3383')).toBeNull();
    expect(parsePrice('Call for price')).toBeNull();
    expect(parsePrice('Call For Pricing')).toBeNull();
    expect(parsePrice('')).toBeNull();
    expect(parsePrice(null)).toBeNull();
    expect(parsePrice(undefined)).toBeNull();
  });

  it('rejects implausible amounts and malformed grouping', () => {
    expect(parsePrice('$0.00')).toBeNull();
    expect(parsePrice('$1')).toBeNull();
    expect(parsePrice('$99,999,999')).toBeNull();
    expect(parsePrice('$1,2,3')).toBeNull();
    expect(parsePrice('Stock # 274112')).toBeNull();
    // A bare number is accepted — it only ever comes from the dealer's own
    // price element (priceSelector), never from free card text.
    expect(parsePrice('45,500')).toBe(45500);
  });

  it('takes the first amount when a payment estimate follows the price', () => {
    expect(parsePrice('USD $69,900 Payments as low as USD $1,485.17')).toBe(69900);
  });
});

describe('parseLocation', () => {
  it('parses city + state in the common formats', () => {
    expect(parseLocation('Venus, Texas, US')).toEqual({ city: 'Venus', state: 'TX' });
    expect(parseLocation('French Camp, CA')).toEqual({ city: 'French Camp', state: 'CA' });
    expect(parseLocation('Belle Vernon, Pennsylvania')).toEqual({ city: 'Belle Vernon', state: 'PA' });
    expect(parseLocation('Location: Gaylord, MI'.replace('Location: ', ''))).toEqual({ city: 'Gaylord', state: 'MI' });
  });

  it('strips branch annotations and multi-branch counters', () => {
    expect(parseLocation('Manchester, IA | XL Specialized')).toEqual({ city: 'Manchester', state: 'IA' });
    expect(parseLocation('Salt Lake City +1', { 'Salt Lake City': 'UT' })).toEqual({ city: 'Salt Lake City', state: 'UT' });
  });

  it('treats a bare state as a state and maps known branch cities', () => {
    expect(parseLocation('Montana +2')).toEqual({ city: null, state: 'MT' });
    expect(parseLocation('Texas')).toEqual({ city: null, state: 'TX' });
    expect(parseLocation('Fort Worth', { 'Fort Worth': 'TX' })).toEqual({ city: 'Fort Worth', state: 'TX' });
    expect(parseLocation('Dallas I-20', { 'Dallas I-20': 'Dallas, TX' })).toEqual({ city: 'Dallas', state: 'TX' });
    expect(parseLocation('Fort Worth')).toEqual({ city: 'Fort Worth', state: null });
  });

  it('does not mistake Canada for California', () => {
    expect(parseLocation('Delhi, ON, CA')).toEqual({ city: 'Delhi', state: null });
    expect(parseLocation('St-Evariste, QC, Canada')).toEqual({ city: 'St-Evariste', state: null });
    expect(parseLocation('Sacramento, CA')).toEqual({ city: 'Sacramento', state: 'CA' });
  });

  it('returns nulls for placeholders', () => {
    expect(parseLocation('N/A')).toEqual({ city: null, state: null });
    expect(parseLocation('')).toEqual({ city: null, state: null });
    expect(parseLocation(null)).toEqual({ city: null, state: null });
  });
});

describe('normalizeCondition / parseYear / stripLabel', () => {
  it('maps dealer wording and schema.org URLs to new/used', () => {
    expect(normalizeCondition('Pre-Owned')).toBe('used');
    expect(normalizeCondition('USED')).toBe('used');
    expect(normalizeCondition('New')).toBe('new');
    expect(normalizeCondition('https://schema.org/NewCondition')).toBe('new');
    expect(normalizeCondition('https://schema.org/UsedCondition')).toBe('used');
    expect(normalizeCondition('In stock')).toBeNull();
  });

  it('finds a plausible model year', () => {
    expect(parseYear('2027 Trail King TK110HDG')).toBe(2027);
    expect(parseYear('Year: 1998')).toBe(1998);
    expect(parseYear('TK130 55 ton')).toBeNull();
    expect(parseYear('Stock 274112')).toBeNull();
  });

  it('strips leading field labels', () => {
    expect(stripLabel('Stock # 274112')).toBe('274112');
    expect(stripLabel('Stock #: B3722P')).toBe('B3722P');
    expect(stripLabel('Stock Number: TET7')).toBe('TET7');
    expect(stripLabel('VIN: 48X1F3724R1016881')).toBe('48X1F3724R1016881');
    expect(stripLabel('Location:  Belle Vernon, Pennsylvania')).toBe('Belle Vernon, Pennsylvania');
  });
});

describe('fieldsToListing', () => {
  it('maps spec labels to listing fields and keeps the rest as specs', () => {
    const out = fieldsToListing({
      Manufacturer: 'LANDOLL',
      Model: 'Hydraulic Tail Trailer',
      Location: 'N/A',
      'Stock #': 'A042385',
      Status: 'New',
      Year: '2027',
      Length: '51 ft.',
    });
    expect(out).toMatchObject({
      make: 'LANDOLL',
      model: 'Hydraulic Tail Trailer',
      stock_number: 'A042385',
      condition: 'new',
      year: 2027,
      specs: { Length: '51 ft.' },
    });
    expect(out.location).toBeUndefined(); // "N/A" is dropped
  });
});

describe('dealer card extraction', () => {
  const dealer = {
    slug: 'test',
    scrapeConfig: {
      listingSelector: '.card',
      titleSelector: 'h3 > span',
      priceSelector: 'h3 p',
      imageSelector: 'img',
      stockPattern: 'Stock #\\s*([A-Za-z0-9-]+)',
      idFrom: 'stock',
      linkTemplate: 'https://dealer.example/inventory/{id}',
      locationSelector: '.loc',
      includeIf: '\\bin stock\\b',
    },
    defaultCondition: 'used',
  };
  const html = `
    <div class="card">
      <h3><span>2024 Peterbilt 579</span><div><p><span>$</span><span>83,999</span></p></div></h3>
      <img src="/_next/image?url=https%3A%2F%2Fcdn.example%2F001_273747%2FImage01.jpg&w=640&q=75">
      <span class="loc"><svg><style>.a{fill:#848f98;}</style></svg> Cincinnati, OH</span>
      <p>2027</p><p>In stock</p><p>Stock # 273747</p>
    </div>
    <div class="card">
      <h3><span>Manac 4B240A200 Bottom Dump</span><div><p>Call for price</p></div></h3>
      <img src="/images/placeholder.jpeg"><p>Call for availability</p><p>Stock # 1</p>
    </div>`;

  it('extracts cards, unwraps Next.js image URLs and ignores inline <style> text', () => {
    const { selector, cards } = extractCardsInPage(dealer.scrapeConfig, html);
    expect(selector).toBe('.card');
    expect(cards).toHaveLength(2);
    expect(cards[0].title).toBe('2024 Peterbilt 579');
    expect(cards[0].images).toEqual(['https://cdn.example/001_273747/Image01.jpg']);
    expect(cards[0].locationText).toBe('Cincinnati, OH');
    expect(cards[1].images).toEqual([]); // placeholder filtered
  });

  it('builds a clean raw listing with a stable stock-number id and filters catalog tiles', () => {
    const { cards } = extractCardsInPage(dealer.scrapeConfig, html);
    const listings = cards.map((c: unknown) => buildRawListing(c, dealer));
    expect(listings[1]).toBeNull(); // "Call for availability" tile, not "In stock"
    expect(listings[0]).toMatchObject({
      title: '2024 Peterbilt 579',
      price: 83999,
      price_type: 'fixed',
      source_listing_id: '273747',
      stock_number: '273747',
      source_url: 'https://dealer.example/inventory/273747',
      year: 2024,
      condition: 'used',
      city: 'Cincinnati',
      state: 'OH',
    });
  });

  it('keeps the historical last-path-segment id when no id source is configured', () => {
    const cfg = { listingSelector: '.c', titleSelector: 'a', linkSelector: 'a' };
    const { cards } = extractCardsInPage(cfg, '<div class="c"><a href="https://haletrailer.com/trailer/a042385/">LANDOLL Hydraulic Tail Trailer</a></div>');
    const raw = buildRawListing(cards[0], { slug: 'x', scrapeConfig: cfg });
    expect(raw?.source_listing_id).toBe('a042385');
    expect(raw?.price).toBeNull();
    expect(raw?.price_type).toBe('call_for_price');
  });
});

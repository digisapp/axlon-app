import { describe, it, expect } from 'vitest';
import { categoryKind, listingSeoTitle } from '@/lib/seo/listing-title';

const lowboy = { slug: 'lowboy-trailers', name: 'Lowboy Trailers' };

describe('categoryKind', () => {
  it('singularizes plural category names', () => {
    expect(categoryKind(lowboy)).toBe('Lowboy Trailer');
    expect(categoryKind({ slug: 'excavators', name: 'Excavators' })).toBe('Excavator');
  });

  it('leaves names that only look plural alone', () => {
    expect(categoryKind({ slug: 'cab-chassis', name: 'Cab & Chassis' })).toBe('Cab & Chassis');
    expect(categoryKind({ slug: 'intermodal-chassis', name: 'Intermodal Chassis' })).toBe('Intermodal Chassis');
  });

  it('uses overrides for awkward names and skips catch-alls', () => {
    expect(categoryKind({ slug: 'live-floor-trailers', name: 'Live Floor / Walking Floor Trailers' })).toBe('Live Floor Trailer');
    expect(categoryKind({ slug: 'heavy-equipment', name: 'Heavy Equipment' })).toBeNull();
    expect(categoryKind(null)).toBeNull();
  });
});

describe('listingSeoTitle', () => {
  it("builds on the seller's title and adds where the unit is", () => {
    expect(
      listingSeoTitle({
        title: '2028 XL Specialized 65 Ton 10ft Wide Lowboy Trailer',
        year: 2028,
        make: 'XL Specialized',
        state: 'SC',
        category: lowboy,
      })
    ).toBe('2028 XL Specialized 65 Ton 10ft Wide Lowboy Trailer for Sale in SC');
  });

  it('adds the kind of equipment when the title leaves it out', () => {
    expect(
      listingSeoTitle({ title: '2025 Pitts LB35-22DC', year: 2025, make: 'Pitts', city: 'Waverly', state: 'TN', category: lowboy })
    ).toBe('2025 Pitts LB35-22DC Lowboy Trailer for Sale in Waverly, TN');
    expect(
      listingSeoTitle({ title: '2024 Battle Motors LNT', year: 2024, make: 'Battle Motors', category: { slug: 'trucks', name: 'Trucks' } })
    ).toBe('2024 Battle Motors LNT Truck for Sale');
  });

  it("doesn't repeat a kind the title already names", () => {
    expect(listingSeoTitle({ title: '2026 Pitts Lowboy', year: 2026, category: lowboy })).toBe('2026 Pitts Lowboy Trailer for Sale');
    expect(
      listingSeoTitle({ title: '2025 MAC Aluminum Dump', category: { slug: 'end-dump-trailers', name: 'End Dump Trailers' } })
    ).toBe('2025 MAC Aluminum Dump Trailer for Sale');
    expect(
      listingSeoTitle({ title: 'Fontaine Flatbed Trailer', state: 'IL', category: { slug: 'flatbed-trailers', name: 'Flatbed Trailers' } })
    ).toBe('Fontaine Flatbed Trailer for Sale in IL');
  });

  it('prefixes a missing year and drops a trailing "for sale"', () => {
    expect(listingSeoTitle({ title: 'Trail King TK110HDG Lowboy Trailer for sale in Houston', year: 2026, category: lowboy })).toBe(
      '2026 Trail King TK110HDG Lowboy Trailer for Sale'
    );
  });

  it('falls back to year/make/model without a title', () => {
    expect(listingSeoTitle({ title: '', year: 2027, make: 'Peterbilt', model: '567', category: { slug: 'trucks', name: 'Trucks' } })).toBe(
      '2027 Peterbilt 567 Truck for Sale'
    );
  });
});

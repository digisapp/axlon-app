import { describe, it, expect } from 'vitest';
// Plain .mjs script module — no type declarations, so import it untyped.
import { isDeadPageName, inferProductTypeFromName } from '../../scripts/lib/manufacturer-scraper-utils.mjs';

describe('isDeadPageName', () => {
  it('catches the six that actually reached production', () => {
    // These rendered as product cards on the marketplace and the microsites
    // until they were deactivated on 2026-09-20.
    for (const name of [
      'Page Not Found',
      'Oops!Page Not Found',
      '404 Not Found',
      '404',
      'Sorry About That',
      'Page Not Found ',
    ]) {
      expect(isDeadPageName(name), name).toBe(true);
    }
  });

  it('catches common variants the next scraper might hit', () => {
    for (const name of [
      'Not Found',
      'Error 404',
      '404 - Page Not Found',
      'Page Unavailable',
      "We're Sorry",
      'Oops!',
      'Access Denied',
      'Just a moment',
      'Coming Soon',
      'Untitled',
      '',
      '   ',
    ]) {
      expect(isDeadPageName(name), name).toBe(true);
    }
  });

  it('does not touch real models, including ones containing 404 or "error"', () => {
    // Matched on the whole name, not as a substring — a part number can
    // legitimately be 404, and dropping a real product is the worse failure.
    for (const name of [
      '4048TA',
      'XL Tag',
      'Model 404 Lowboy',
      '404XL Extendable',
      'Talbert 55SA',
      'Traveling Axle 404',
      'Error-Proof Deck',
      'XL Specialized Step Deck',
    ]) {
      expect(isDeadPageName(name), name).toBe(false);
    }
  });
});

describe('inferProductTypeFromName', () => {
  it('catches the misfilings that reached production', () => {
    expect(inferProductTypeFromName('20 Ton Tag-A-Long Trailers')).toBe('tag-along');
    expect(inferProductTypeFromName('XL Tag')).toBe('tag-along');
    expect(inferProductTypeFromName('Tri-Axle with Tag Axle')).toBeNull(); // a lift axle, not a tag-along
    expect(inferProductTypeFromName('Custom Built Commercial Light Tag Trailers')).toBe('tag-along');
    expect(inferProductTypeFromName('40-55 Ton Sliding Axle')).toBe('traveling-axle');
    expect(inferProductTypeFromName('Landoll 425B Traveling Axle Trailer')).toBe('traveling-axle');
    expect(inferProductTypeFromName('TKRB Rollback')).toBe('traveling-axle');
    expect(inferProductTypeFromName('Fixed-Neck Double Drop')).toBe('double-drop');
    expect(inferProductTypeFromName('COMBO GIANT – DROP DECK SERIES')).toBe('step-deck');
    expect(inferProductTypeFromName('STEEL DROP FLAT')).toBe('step-deck');
    expect(inferProductTypeFromName('ALUMINUM GIANT FLATBED')).toBe('flatbed');
  });

  it('leaves the overlapping types to the scraper', () => {
    // An RGN is a lowboy; extendable is a property; a detachable double drop is both.
    expect(inferProductTypeFromName('XL Hydraulic Detachable Gooseneck')).toBeNull();
    expect(inferProductTypeFromName('XL Mechanical Gooseneck Expandable')).toBeNull();
    expect(inferProductTypeFromName('Detachable Double Drop Extendable')).toBeNull();
    expect(inferProductTypeFromName('XL Heavy Duty Flat Deck')).toBeNull(); // heavy-haul flat deck ≠ freight flatbed
    expect(inferProductTypeFromName('Lowboy Trailers')).toBeNull();
  });

  it('does not match abbreviations inside model codes', () => {
    // A loose \bsd\b once filed a side-dump trailer as a step deck.
    expect(inferProductTypeFromName('Side Dump Landscape Trailers “E SD” Hydraulic Dump')).toBeNull();
    expect(inferProductTypeFromName('35 GSL-BR')).toBeNull();
    expect(inferProductTypeFromName('')).toBeNull();
  });
});

describe('inferProductTypeFromName reproduces every manual retype', () => {
  // The scraper upserts every column on re-scrape. The 26 rows retyped by
  // hand on 2026-09-21 survive only if the guard derives the same answer
  // from the name — otherwise the next scrape quietly reverts them.
  const RETYPED: Array<[string, string]> = [
    ['XL Tag', 'tag-along'],
    ['20 Ton Tag-A-Long Trailers', 'tag-along'],
    ['25 Ton Tag-A-Long Trailers', 'tag-along'],
    ['30 Ton Tag-A-Long Trailers', 'tag-along'],
    ['Custom Designed Heavy Duty Tag Trailers for Sale', 'tag-along'],
    ['Custom Built Commercial Light Tag Trailers', 'tag-along'],
    ['Deck-Over Tag Trailers', 'tag-along'],
    ['Slide Axle Trailers', 'traveling-axle'],
    ['40-55 Ton Sliding Axle', 'traveling-axle'],
    ['Landoll 425B Traveling Axle Trailer', 'traveling-axle'],
    ['50 Ton Sliding Axle (AG Trailer)', 'traveling-axle'],
    ['XL Slide Axle', 'traveling-axle'],
    ['TKRB Rollback', 'traveling-axle'],
    ['Siebert Phoenix Sliding Axle', 'traveling-axle'],
    ['SLIDING AXLE', 'traveling-axle'],
    ['Loadoll II Rollback Carrier', 'traveling-axle'],
    ['Fixed-Neck Double Drop', 'double-drop'],
    ['Custom Built Heavy Step Deck Trailer Manufacturer', 'step-deck'],
    ['Drop Deck', 'step-deck'],
    ['XL Specialized Step Deck', 'step-deck'],
    ['COMBO GIANT – DROP DECK SERIES', 'step-deck'],
    ['STEEL DROP FLAT', 'step-deck'],
    ['ALUMINUM DROP FLAT', 'step-deck'],
    ['ALUMINUM GIANT FLATBED', 'flatbed'],
    ['STEEL FLATBED', 'flatbed'],
    ['COMBO GIANT – FLATBED SERIES', 'flatbed'],
  ];
  it.each(RETYPED)('%s -> %s', (name, type) => {
    expect(inferProductTypeFromName(name)).toBe(type);
  });
});

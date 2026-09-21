import { describe, it, expect } from 'vitest';
// Plain .mjs script module — no type declarations, so import it untyped.
import { isDeadPageName } from '../../scripts/lib/manufacturer-scraper-utils.mjs';

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

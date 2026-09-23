import { describe, it, expect } from 'vitest';
import * as guards from '../../scripts/lib/catalog-junk.mjs';
import junk from '@/lib/catalog/catalog-junk.json';

describe('scraper catalog guards', () => {
  it('refuses reviewed junk files by hash', () => {
    expect(guards.isJunkImageHash('cca580db')).toBe(true); // XL factory icon
    expect(guards.isJunkImageHash('CCA580DB')).toBe(true);
    expect(guards.isJunkImageHash('5bc74c9a')).toBe(false);
  });

  it('skips logo/icon/social URLs but not photo filenames', () => {
    expect(guards.isLogoUrl('https://x.com/wp-content/uploads/2020/01/company-logo.png')).toBe(true);
    expect(guards.isLogoUrl('https://x.com/img/icons/twitter.svg')).toBe(true);
    expect(guards.isLogoUrl('https://x.com/uploads/55-GSL-3.jpg')).toBe(false);
    expect(guards.isLogoUrl('https://x.com/uploads/Magnitude-55H-DSR-Profile.png')).toBe(false);
  });

  it('refuses non-product page titles and keeps real models', () => {
    expect(guards.isNonProductName('Upgrade Your Heavy Hauling Now - Book Your Consultation!')).toBe(true);
    expect(guards.isNonProductName('Color Selection Chart')).toBe(true);
    expect(guards.isNonProductName('Galvanizing – Hot Dip')).toBe(true);
    expect(guards.isNonProductName('Magnitude 55H MDSR')).toBe(false);
    expect(guards.isNonProductName('440B Traveling Axle Trailer')).toBe(false);
    expect(guards.isNonProductName('Paver Special Trailers')).toBe(false);
  });

  it('does not revive rows deactivated by hand', () => {
    for (const { id } of junk.hiddenProductIds) expect(guards.isHiddenProductId(id)).toBe(true);
    expect(guards.isHiddenProductId('00000000-0000-0000-0000-000000000000')).toBe(false);
  });

  it('drops junk copy at scrape time', () => {
    expect(guards.cleanScrapedCopy('Privacy Policy | Cookie Policy')).toBeNull();
    expect(guards.cleanScrapedCopy('Now available at Hale Trailer.')).toBeNull();
    expect(guards.cleanScrapedCopy('A 35-ton lowboy.')).toBe('A 35-ton lowboy.');
  });

  it('treats icon-sized images as not a photo', async () => {
    const sharp = (await import('sharp')).default;
    const icon = await sharp({ create: { width: 200, height: 120, channels: 3, background: '#fff' } }).png().toBuffer();
    const photo = await sharp({ create: { width: 1200, height: 300, channels: 3, background: '#fff' } }).png().toBuffer();
    expect(await guards.isIconSized(icon)).toBe(true);
    expect(await guards.isIconSized(photo)).toBe(false);
  });
});

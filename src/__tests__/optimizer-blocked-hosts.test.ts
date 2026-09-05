import { describe, it, expect } from 'vitest';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';

describe('isOptimizerBlockedImage', () => {
  it('flags the bot-protected manufacturer origin and its subdomains', () => {
    expect(isOptimizerBlockedImage('https://www.eagerbeavertrailers.com/wp-content/uploads/a.jpg')).toBe(true);
    expect(isOptimizerBlockedImage('https://eagerbeavertrailers.com/a.jpg')).toBe(true);
  });

  it('leaves every other host on the optimizer', () => {
    expect(isOptimizerBlockedImage('https://www.trailking.com/a.jpg')).toBe(false);
    expect(isOptimizerBlockedImage('https://xyz.supabase.co/storage/v1/object/public/x.jpg')).toBe(false);
    expect(isOptimizerBlockedImage('https://notreallyeagerbeavertrailers.com/a.jpg')).toBe(false);
  });

  it('is safe on empty or malformed input', () => {
    expect(isOptimizerBlockedImage(null)).toBe(false);
    expect(isOptimizerBlockedImage('')).toBe(false);
    expect(isOptimizerBlockedImage('not a url')).toBe(false);
  });
});

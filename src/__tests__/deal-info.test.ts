import { describe, it, expect } from 'vitest';
import { getDealInfo } from '@/lib/deal-info';

type ListingArg = Parameters<typeof getDealInfo>[0];

const makeListing = (price: number | null, ai_price_estimate: number | null): ListingArg =>
  ({ price, ai_price_estimate } as ListingArg);

describe('getDealInfo', () => {
  it('returns null when no price', () => {
    expect(getDealInfo(makeListing(null, 50000))).toBeNull();
  });

  it('returns null when no AI estimate', () => {
    expect(getDealInfo(makeListing(45000, null))).toBeNull();
  });

  it('returns null when price is at market value', () => {
    expect(getDealInfo(makeListing(50000, 50000))).toBeNull();
  });

  it('returns hot deal when 15%+ below market', () => {
    const result = getDealInfo(makeListing(40000, 50000));
    expect(result).not.toBeNull();
    expect(result!.type).toBe('hot');
    expect(result!.percentage).toBe(20);
  });

  it('returns good deal when 5-15% below market', () => {
    const result = getDealInfo(makeListing(45000, 50000));
    expect(result).not.toBeNull();
    expect(result!.type).toBe('good');
    expect(result!.percentage).toBe(10);
  });

  it('returns null when price is above market', () => {
    expect(getDealInfo(makeListing(55000, 50000))).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { getApproxCoordinates, normalizeStateCode } from '@/lib/geo/state-centroids';

describe('normalizeStateCode', () => {
  it('accepts 2-letter codes in any case', () => {
    expect(normalizeStateCode('TX')).toBe('TX');
    expect(normalizeStateCode('tx')).toBe('TX');
    expect(normalizeStateCode(' nj ')).toBe('NJ');
  });

  it('resolves full state and province names', () => {
    expect(normalizeStateCode('Texas')).toBe('TX');
    expect(normalizeStateCode('new jersey')).toBe('NJ');
    expect(normalizeStateCode('Alberta')).toBe('AB');
  });

  it('returns null for unknown or empty values', () => {
    expect(normalizeStateCode(null)).toBeNull();
    expect(normalizeStateCode('')).toBeNull();
    expect(normalizeStateCode('ZZ')).toBeNull();
    expect(normalizeStateCode('Atlantis')).toBeNull();
  });
});

describe('getApproxCoordinates', () => {
  it('prefers exact coordinates when present', () => {
    const result = getApproxCoordinates({ id: 'a', state: 'TX', latitude: 32.78, longitude: -96.8 });
    expect(result).toEqual({ position: [32.78, -96.8], approximate: false });
  });

  it('falls back to a state-level position and is deterministic per listing', () => {
    const first = getApproxCoordinates({ id: 'listing-1', state: 'TX' });
    const again = getApproxCoordinates({ id: 'listing-1', state: 'TX' });
    const other = getApproxCoordinates({ id: 'listing-2', state: 'TX' });

    expect(first).not.toBeNull();
    expect(first!.approximate).toBe(true);
    expect(first).toEqual(again);
    // Same state, different listing: nearby but not stacked on one pixel
    expect(other!.position).not.toEqual(first!.position);
    expect(Math.abs(other!.position[0] - first!.position[0])).toBeLessThan(1.5);
    expect(Math.abs(other!.position[1] - first!.position[1])).toBeLessThan(1.5);
    // Still inside Texas-ish bounds
    expect(first!.position[0]).toBeGreaterThan(30);
    expect(first!.position[0]).toBeLessThan(33);
  });

  it('returns null when neither coordinates nor a known state exist', () => {
    expect(getApproxCoordinates({ id: 'x', state: null })).toBeNull();
    expect(getApproxCoordinates({ id: 'x', state: 'Nowhere' })).toBeNull();
  });
});

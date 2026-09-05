import { describe, it, expect } from 'vitest';
import { PUBLIC_LISTING_COLUMNS } from '@/lib/listings/public-columns';

// Guard against someone re-adding dealer-internal or bulk columns to the
// public select list. These must never reach the anon-facing API.
const NEVER_PUBLIC = [
  'acquisition_cost',
  'acquired_date',
  'lot_location',
  'source_url',
  'source_listing_id',
  'source_dealer_id',
  'search_vector',
  'publish_at',
  'unpublish_at',
  'deleted_at',
  'deleted_by',
  'ai_video_request_id',
];

const columns = PUBLIC_LISTING_COLUMNS.split(',').map((c) => c.trim());

describe('PUBLIC_LISTING_COLUMNS', () => {
  it('never includes dealer-internal or provenance columns', () => {
    for (const col of NEVER_PUBLIC) {
      expect(columns).not.toContain(col);
    }
  });

  it('includes everything the listing cards and map need', () => {
    const required = [
      'id', 'user_id', 'title', 'description', 'price', 'year', 'make', 'model',
      'mileage', 'hours', 'condition', 'city', 'state', 'is_featured',
      'ai_price_estimate', 'status', 'created_at',
    ];
    for (const col of required) {
      expect(columns).toContain(col);
    }
  });

  it('is a plain comma-separated identifier list with no wildcard', () => {
    expect(columns).not.toContain('*');
    for (const col of columns) {
      expect(col).toMatch(/^[a-z_]+$/);
    }
    expect(new Set(columns).size).toBe(columns.length);
  });
});

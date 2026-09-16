/**
 * The `listings.condition` CHECK constraint only allows these four values, so
 * anything headed for the listings API has to be mapped onto them first.
 * Richer grades the AI importer emits (excellent / good / fair) collapse to
 * 'used' — otherwise the API rejects the row with a 400.
 */
export const LISTING_CONDITIONS = ['new', 'used', 'certified', 'salvage'] as const;

export type ListingCondition = (typeof LISTING_CONDITIONS)[number];

export function toListingCondition(value?: string | null): ListingCondition {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'new' || normalized === 'certified' || normalized === 'salvage') {
    return normalized;
  }
  return 'used';
}

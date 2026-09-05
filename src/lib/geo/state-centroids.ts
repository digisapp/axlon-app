/**
 * Approximate map positions for listings.
 *
 * `listings` has no latitude/longitude columns, so the search map used to
 * filter every result out and render "No locations available". Most listings
 * do carry a state, which is enough to place them approximately: each state
 * (and Canadian province) maps to its centroid, and a small deterministic
 * per-listing offset keeps same-state markers from stacking on one pixel.
 */

type LatLng = [number, number];

const CENTROIDS: Record<string, LatLng> = {
  AL: [32.8, -86.8], AK: [64.2, -152.5], AZ: [34.3, -111.7], AR: [34.9, -92.4],
  CA: [37.2, -119.5], CO: [39.0, -105.5], CT: [41.6, -72.7], DE: [39.0, -75.5],
  DC: [38.9, -77.0], FL: [28.6, -82.4], GA: [32.7, -83.4], HI: [20.8, -156.3],
  ID: [44.4, -114.6], IL: [40.0, -89.2], IN: [39.9, -86.3], IA: [42.1, -93.5],
  KS: [38.5, -98.4], KY: [37.5, -85.3], LA: [31.1, -92.0], ME: [45.4, -69.2],
  MD: [39.0, -76.8], MA: [42.3, -71.8], MI: [44.3, -85.4], MN: [46.3, -94.3],
  MS: [32.7, -89.7], MO: [38.4, -92.5], MT: [47.0, -109.6], NE: [41.5, -99.8],
  NV: [39.3, -116.6], NH: [43.7, -71.6], NJ: [40.2, -74.7], NM: [34.4, -106.1],
  NY: [42.9, -75.5], NC: [35.6, -79.4], ND: [47.5, -100.5], OH: [40.3, -82.8],
  OK: [35.6, -97.5], OR: [43.9, -120.6], PA: [40.9, -77.8], RI: [41.7, -71.6],
  SC: [33.9, -80.9], SD: [44.4, -100.2], TN: [35.9, -86.4], TX: [31.5, -99.3],
  UT: [39.3, -111.7], VT: [44.1, -72.7], VA: [37.5, -78.8], WA: [47.4, -120.5],
  WV: [38.6, -80.6], WI: [44.6, -89.9], WY: [43.0, -107.5],
  PR: [18.2, -66.5], VI: [18.3, -64.9],
  // Canada
  AB: [53.9, -116.6], BC: [53.7, -127.6], MB: [53.8, -98.8], NB: [46.6, -66.5],
  NL: [53.1, -60.0], NS: [45.0, -63.0], ON: [50.0, -85.3], PE: [46.4, -63.2],
  QC: [52.9, -71.7], SK: [52.9, -106.5],
};

const NAME_TO_CODE: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS',
  kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA',
  michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO', montana: 'MT',
  nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY', alberta: 'AB', 'british columbia': 'BC',
  manitoba: 'MB', 'new brunswick': 'NB', ontario: 'ON', quebec: 'QC',
  saskatchewan: 'SK', 'nova scotia': 'NS',
};

/** Resolve a stored state value ("TX", "tx", "Texas") to a 2-letter code. */
export function normalizeStateCode(state: string | null | undefined): string | null {
  if (!state) return null;
  const trimmed = state.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (upper.length === 2 && CENTROIDS[upper]) return upper;
  return NAME_TO_CODE[trimmed.toLowerCase()] ?? null;
}

// Small, stable hash so the same listing always lands on the same spot
function hashToUnit(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000; // 0..1
}

/**
 * Best-available coordinates for a listing: explicit lat/lng when present,
 * otherwise a state-centroid position with a deterministic ~±0.5° offset.
 * Returns null when nothing usable is known.
 */
export function getApproxCoordinates(listing: {
  id: string;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): { position: LatLng; approximate: boolean } | null {
  if (
    typeof listing.latitude === 'number' &&
    typeof listing.longitude === 'number' &&
    Number.isFinite(listing.latitude) &&
    Number.isFinite(listing.longitude)
  ) {
    return { position: [listing.latitude, listing.longitude], approximate: false };
  }

  const code = normalizeStateCode(listing.state);
  if (!code) return null;
  const [lat, lng] = CENTROIDS[code];
  const dLat = (hashToUnit(`${listing.id}:lat`) - 0.5) * 1.0;
  const dLng = (hashToUnit(`${listing.id}:lng`) - 0.5) * 1.2;
  return { position: [lat + dLat, lng + dLng], approximate: true };
}

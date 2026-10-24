// @ts-nocheck
/**
 * Northwest Truck & Trailer Sales (nwtruckandtrailer.com) — inventory adapter.
 *
 * buzznerd platform, read from server-rendered pages: see ./_buzznerd.mjs.
 * /inventory/ is the trailer inventory (product type 'trailer'). The site's
 * main yard is stored as "NWTT" (Fargo, ND); satellite yards are in North
 * Dakota and Montana.
 */

import { fetchBuzznerdListings } from './_buzznerd.mjs';

export { parseInventoryCards, parseConditionFacet, parseDetail, isForSale, toRawListing } from './_buzznerd.mjs';

const BASE_URL = 'https://www.nwtruckandtrailer.com';

export const LOCATIONS = {
  nwtt: { city: 'Fargo', state: 'ND' },
  fargo: { city: 'Fargo', state: 'ND' },
  bismarck: { city: 'Bismarck', state: 'ND' },
  'grand forks': { city: 'Grand Forks', state: 'ND' },
  williston: { city: 'Williston', state: 'ND' },
  dickinson: { city: 'Dickinson', state: 'ND' },
  minot: { city: 'Minot', state: 'ND' },
  billings: { city: 'Billings', state: 'MT' },
  'great falls': { city: 'Great Falls', state: 'MT' },
};

export async function fetchListings(dealer, { log = console.log } = {}) {
  return fetchBuzznerdListings({ baseUrl: BASE_URL, inventoryPath: '/inventory/', dealer, locations: LOCATIONS, log });
}

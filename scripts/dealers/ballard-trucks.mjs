// @ts-nocheck
/**
 * Ballard Truck Centers (ballardtrucks.com) — inventory adapter.
 *
 * buzznerd platform, read from server-rendered pages: see ./_buzznerd.mjs.
 * /trailer-inventory/ lists units of product type 'trailer' (showroom
 * 'sr_trailer' models are a different type and never appear); each unit's
 * product page gives its photos, attributes and yard. Ballard's yards span
 * MA, NH, ME and RI. Prices are shown only where Ballard shows them.
 */

import { fetchBuzznerdListings } from './_buzznerd.mjs';

export { parseInventoryCards, parseConditionFacet, parseDetail, isForSale, toRawListing } from './_buzznerd.mjs';

const BASE_URL = 'https://www.ballardtrucks.com';

export const LOCATIONS = {
  avon: { city: 'Avon', state: 'MA' },
  worcester: { city: 'Worcester', state: 'MA' },
  springfield: { city: 'Springfield', state: 'MA' },
  tewksbury: { city: 'Tewksbury', state: 'MA' },
  wareham: { city: 'Wareham', state: 'MA' },
  manchester: { city: 'Manchester', state: 'NH' },
  hermon: { city: 'Hermon', state: 'ME' },
  bangor: { city: 'Bangor', state: 'ME' },
  portland: { city: 'Portland', state: 'ME' },
  johnston: { city: 'Johnston', state: 'RI' },
};

export async function fetchListings(dealer, { log = console.log } = {}) {
  return fetchBuzznerdListings({ baseUrl: BASE_URL, inventoryPath: '/trailer-inventory/', dealer, locations: LOCATIONS, log });
}

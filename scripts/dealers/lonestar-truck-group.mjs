// @ts-nocheck
/**
 * Lonestar Truck Group (tntxtruck.com) — inventory adapter.
 *
 * The DotNetNuke trailer-inventory page boots an Elm app with every unit
 * inlined as `vehicles: [...]` (specs, price, VIN, location and the full
 * photo list), so one plain HTTP fetch lists the whole group — no detail
 * pages needed. The site's own "details" link is Trailer-Details?vin=<VIN>.
 *
 * Lonestar runs ~13 yards (TX/AR/LA/NM plus MO/TN/MS stores), so each unit
 * carries its own yard's city/state. Spreader bars, flip axles and deck
 * plates are accessories and are skipped; the page lists only units for
 * sale (sold units drop off), and a missing SalesPrice stays null.
 */

import { politeClient, decode, parsePrice, parseYear, parseCondition, cleanVin, titleCaseShouting, canonicalMake } from './_lib.mjs';

const BASE_URL = 'https://www.tntxtruck.com';
const INVENTORY_URL = `${BASE_URL}/Sales/Trailer-Inventory`;
const DETAILS_URL = `${BASE_URL}/Sales/Trailer-Details`;

const ACCESSORY_RE = /\b(spreader bar|flip axle|deck plate|jeep|dolly|booster)\b/i;

/** `vehicles: [...]` and `detailsViewUrl` from the inventory page; throws if the layout changed. */
export function parseInventory(html) {
  const m = html.match(/vehicles:\s*(\[[\s\S]*?\])\s*,\s*\n\s*filters:/) || html.match(/vehicles:\s*(\[[\s\S]*?\])\s*,\s*\n/);
  if (!m) throw new Error('Lonestar: inventory JSON (vehicles: [...]) not found on the page');
  const vehicles = JSON.parse(m[1]);
  const detailsViewUrl = html.match(/detailsViewUrl:\s*"([^"]+)"/)?.[1] || DETAILS_URL;
  return { vehicles, detailsViewUrl };
}

export function isListableUnit(vehicle) {
  const s = vehicle?.Specs;
  if (!s?.StockNumber) return false;
  if (ACCESSORY_RE.test(`${s.xtrailerType || ''} ${s.Model || ''}`)) return false;
  return Array.isArray(vehicle.Images) && vehicle.Images.some((i) => i?.ImagePath);
}

const tidy = (s) => decode(String(s ?? '')).replace(/\r/g, '').replace(/\s+/g, ' ').trim();

/** "Lowboy - 55 Ton" → "55 Ton Lowboy", "Bottom Dump - LTWT" → "Bottom Dump". */
export function trailerTypeLabel(type) {
  const t = tidy(type);
  const ton = t.match(/^(.*?)\s*-\s*(\d+)\s*ton$/i);
  if (ton) return `${ton[2]} Ton ${ton[1]}`;
  return t.replace(/\s*-\s*(ltwt|stnd|standard|plantation)$/i, '');
}

export function toRawListing(vehicle, dealer, detailsViewUrl = DETAILS_URL) {
  const s = vehicle.Specs;
  const make = canonicalMake(s.Make);
  const model = titleCaseShouting(s.Model) || null;
  const type = trailerTypeLabel(s.xtrailerType);
  const typeWord = type.split(' ').pop()?.toLowerCase();
  const year = parseYear(s.Year);
  const title = [year, make, model, type && !String(model || '').toLowerCase().includes(typeWord) ? type : null]
    .filter(Boolean)
    .join(' ');

  const price = parsePrice(s.SalesPrice);
  const specs = {};
  const put = (label, value, suffix = '') => {
    const v = tidy(value);
    if (v && !/^(0|n\/a|-|none|other)$/i.test(v)) specs[label] = `${v}${suffix}`;
  };
  put('Trailer Type', s.xtrailerType);
  put('Length', s.xLength, /\d$/.test(tidy(s.xLength)) ? ' ft' : '');
  put('Width', s.xWidth, /\d$/.test(tidy(s.xWidth)) ? ' in' : '');
  put('Axles', s.xAxles);
  put('Suspension', s.xSuspension);
  put('Floor', s.xFloor);
  put('Construction', s.xComposition);
  put('Color', s.xColor);
  put('GVWR', s.GVWR, /\d$/.test(tidy(s.GVWR)) ? ' lbs' : '');
  put('Wheels', s.FrontWheelDesc);
  put('Tires', s.FrontTireSizeDesc);
  put('Location', [s.LocationCity || s.LocCity, s.LocationState || s.LocState].filter(Boolean).join(', '));

  const vin = cleanVin(s.VIN);
  return {
    title,
    year,
    make,
    model,
    condition: parseCondition(s.xCondition || s.NewUsed || s.xNewUsed),
    price,
    price_type: price ? 'fixed' : 'call_for_price',
    stock_number: tidy(s.StockNumber) || null,
    vin,
    description: tidy(s.WebComments || s.xWebComments),
    specs,
    images: [...new Set(vehicle.Images.map((i) => i?.ImagePath).filter(Boolean).map((p) => new URL(p, BASE_URL).href))],
    source_url: s.VIN ? `${detailsViewUrl}?vin=${encodeURIComponent(tidy(s.VIN))}` : INVENTORY_URL,
    // Lonestar's stock number is the unit's DMS key and never changes.
    source_listing_id: tidy(s.StockNumber),
    city: tidy(s.LocationCity || s.LocCity) || dealer.city || null,
    state: tidy(s.LocationState || s.LocState) || dealer.state || null,
  };
}

/** Every trailer Lonestar has for sale with photos, as raw listings. */
export async function fetchListings(dealer, { log = console.log } = {}) {
  const client = politeClient(BASE_URL, { log });
  const { vehicles, detailsViewUrl } = parseInventory(await client.get(INVENTORY_URL));
  const listable = vehicles.filter(isListableUnit);
  log(`   ${vehicles.length} units on the page, ${listable.length} trailers (not accessories) with photos`);
  return listable.map((v) => toRawListing(v, dealer, detailsViewUrl));
}

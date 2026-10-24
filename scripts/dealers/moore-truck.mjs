// @ts-nocheck
/**
 * Moore Truck & Equipment (mooretruck.com) — inventory adapter.
 *
 * Static MODX site. /browse-inventory/ renders every product card (lowboys,
 * oilfield floats, step decks, cooler-hauling trailers, jeeps, dollies) with
 * its photos, feature list, condition and an availability badge, so one
 * plain fetch covers the whole yard.
 *
 * Only cards badged "Available Now" are physical units on the lot; "Available
 * to Order" cards are build-to-order models and are skipped, as are jeeps
 * and dollies (accessories). Moore shows no prices or stock numbers.
 *
 * Stable id: the numeric record suffix MODX appends to the page alias
 * ("…-oilfield-lowboy-3411010815.html", "mt-1209213404.html"). Two older
 * pages have a title-only alias; for those the upload timestamp prefixing
 * the unit's first photo ("1465481854KS5xStiff.jpg") is used instead, and a
 * card with neither is skipped rather than keyed by its title.
 */

import { politeClient, textOf, parseYear, parseCondition } from './_lib.mjs';

const BASE_URL = 'https://www.mooretruck.com';
const INVENTORY_URL = `${BASE_URL}/browse-inventory/`;

const TYPES = {
  t10lowboy: 'Lowboy',
  t20oilfield: 'Oilfield Float',
  t50stepdeck: 'Step Deck',
  t60cooler: 'Cooler Hauling Trailer',
  t70jeep: 'Jeep',
  t80dolly: 'Dolly',
};
const ACCESSORY_TYPES = new Set(['t70jeep', 't80dolly']);

const MAKES = {
  kalyn: 'Kalyn Siebert',
  viking: 'Viking',
  holden: 'Holden',
  xl: 'XL Specialized',
  pitts: 'Pitts',
  blackstone: 'Blackstone',
  dorsey: 'Dorsey',
  nabors: 'Nabors',
  scona: 'Scona',
  load: 'Load King',
  specialized: 'Specialized Trailers',
};

/** Product cards: classes, detail href, condition, title, features, availability, photos. */
export function parseInventory(html) {
  const cards = [];
  for (const chunk of html.split(/<div class="product item /).slice(1)) {
    const classes = chunk.slice(0, chunk.indexOf('"')).split(/\s+/);
    const link = chunk.match(/class="product-title"><a href="([^"]+)">([\s\S]*?)<\/a>/);
    if (!link) continue;
    const condition = textOf(link[2].match(/class="condition">([^<]*)</)?.[1] || '');
    const title = textOf(link[2].replace(/<span class="condition">[^<]*<\/span>/, '')).replace(/^[\s-–]+/, '');
    const features = [...(chunk.match(/class="products-details">([\s\S]*?)<\/div>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)]
      .map((m) => textOf(m[1]))
      .filter(Boolean);
    const availability = chunk.match(/glyphicon (available-[a-z]+)"/)?.[1] || null;
    const images = [
      ...new Set([...chunk.matchAll(/<a href="(\/assets\/image-cache\/[^"]+\.(?:jpe?g|png|webp))"/gi)].map((m) => new URL(m[1], BASE_URL).href)),
    ];
    cards.push({
      typeClass: classes.find((c) => TYPES[c]) || null,
      makeClass: classes[1] || null,
      href: new URL(link[1], `${BASE_URL}/`).href,
      condition,
      title,
      features,
      availability,
      images,
    });
  }
  if (!cards.length) throw new Error('Moore: no product cards found on the inventory page');
  return cards;
}

export function isListableCard(card) {
  return card.availability === 'available-now' && !ACCESSORY_TYPES.has(card.typeClass) && card.images.length > 0;
}

/** The CMS record number in the page alias, else the first photo's upload timestamp, else null. */
export function stableIdOf(card) {
  const alias = card.href.split('/').pop() || '';
  const record = alias.match(/(?:^mt-|-)(\d{8,})\.html$/)?.[1];
  if (record) return record;
  const stamp = (card.images[0] || '').split('/').pop()?.match(/^(1\d{9})\D/)?.[1];
  return stamp ? `photo-${stamp}` : null;
}

export function toRawListing(card, dealer) {
  const title = card.title.replace(/\bKalynSiebert\b/g, 'Kalyn Siebert').replace(/\s+/g, ' ').trim();
  const type = TYPES[card.typeClass] || null;
  const make = MAKES[card.makeClass] || null;
  const specs = {};
  if (type) specs['Trailer Type'] = type;
  const deck = card.features.find((f) => /\bdeck\b/i.test(f) && /\d+'/.test(f));
  if (deck) specs['Deck'] = deck;
  const axles = title.match(/\b(\d|tandem|tri)[\s-]axle\b/i)?.[0];
  if (axles) specs['Axles'] = axles;
  const tons = title.match(/\b(\d+(?:\/\d+)?)\s*ton\b/i)?.[1];
  if (tons) specs['Capacity'] = `${tons} tons`;

  return {
    title,
    year: parseYear(title),
    make,
    model: null,
    condition: parseCondition(card.condition),
    price: null,
    price_type: 'call_for_price',
    stock_number: null,
    vin: null,
    description: card.features.length ? `Features:\n${card.features.map((f) => `• ${f}`).join('\n')}` : '',
    specs,
    images: card.images,
    source_url: card.href,
    source_listing_id: stableIdOf(card),
    city: dealer.city || null,
    state: dealer.state || null,
  };
}

/** Every "Available Now" trailer on mooretruck.com. */
export async function fetchListings(dealer, { log = console.log } = {}) {
  const client = politeClient(BASE_URL, { log });
  const cards = parseInventory(await client.get(INVENTORY_URL));
  const listable = cards.filter(isListableCard);
  const keyed = listable.filter((c) => stableIdOf(c));
  log(
    `   ${cards.length} cards, ${cards.filter((c) => c.availability === 'available-now').length} "Available Now", ` +
      `${listable.length} trailers (not jeeps/dollies) with photos, ${listable.length - keyed.length} skipped without a stable id`
  );
  return keyed.map((c) => toRawListing(c, dealer));
}

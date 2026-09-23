import junk from './catalog-junk.json';

/**
 * Display-side cleanup for the scraped manufacturer catalog.
 *
 * The manufacturer scrapers treated every page under a "products" path as a
 * product, and kept whatever text sat near the top of it. A review of all 380
 * active rows on 2026-09-22 found pages that are not trailers at all (a
 * consultation form, a colour chart, a scraped 404, a "Translate:" widget),
 * copy that is really a cookie banner or breadcrumb trail, and two rows lifted
 * from a real dealer's website — Hale Trailer — complete with their photo and
 * "now available at Hale Trailer", which on haletrailers.com reads as if we
 * were them.
 *
 * Deactivating those rows in the database is the durable fix (see
 * supabase/migrations/080_catalog_and_listing_cleanup.sql); this module keeps them off
 * every page until that runs, and keeps working after it does.
 */

/**
 * Scraped pages that are not a product. Hidden everywhere the catalog renders.
 * Listed with a reason each in catalog-junk.json, which the scrapers also read.
 */
export const HIDDEN_PRODUCT_IDS: readonly string[] = junk.hiddenProductIds.map((e) => e.id);

const HIDDEN = new Set(HIDDEN_PRODUCT_IDS);

export function isHiddenProduct(id: string): boolean {
  return HIDDEN.has(id);
}

/** PostgREST `in` list for `.not('id', 'in', HIDDEN_PRODUCT_FILTER)`. */
export const HIDDEN_PRODUCT_FILTER = `(${HIDDEN_PRODUCT_IDS.join(',')})`;

/**
 * Real products filed under a heavy-haul type they are not — the scraper's
 * default was "lowboy". A category site built on lowboys or tag-alongs must
 * not show a bottom-dump or a chip van. Names are reliable for these; the
 * product_type column is not.
 */
const OFF_NICHE = /\b(dump|live bottom|chip van|rollback|utility trailer|directional drill|equipment chassis)\b/i;

export function isOffNicheForHeavyHaul(name: string): boolean {
  return OFF_NICHE.test(name);
}

/**
 * Page titles, not product names: "Premium Quality Engineered Lowboy Trailer
 * Manufacturer 4-Axle", "Faymonville MultiMax Trailers for Sale". Strip the
 * SEO padding and fix SHOUTING, leave real model names alone.
 */
export function cleanProductName(name: string): string {
  let out = name
    .replace(/^(premium quality engineered|custom designed|custom built)\s+/i, '')
    .replace(/\s+for sale$/i, '')
    .replace(/\s+manufacturer\b/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // All-caps names ("REMOVABLE GOOSENECK TRAILERS") to title case, keeping
  // codes as written: anything with a digit ("LB35-38CS"), in parentheses
  // ("(LBO)"), or two letters or fewer ("HD", "AG"). Three-letter words are
  // lowered — "LOW BOY" is words, not a code.
  const letters = out.replace(/[^a-z]/gi, '');
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    out = out
      .split(' ')
      .map((w) =>
        /\d/.test(w) || /^\(.*\)$/.test(w) || w.replace(/[^a-z]/gi, '').length <= 2
          ? w
          : w.charAt(0) + w.slice(1).toLowerCase()
      )
      .join(' ');
  }
  return out || name;
}

/** Text that is page furniture, or another business's sales copy. */
const JUNK_COPY = new RegExp(junk.junkCopyPattern, 'i');

/**
 * Scraped description/short_description, or null when it isn't usable.
 * Strips a leading breadcrumb ("Home » Detachable Gooseneck Trailers » …").
 */
export function cleanCopy(text: string | null | undefined): string | null {
  if (!text) return null;
  let out = text.trim();
  if (JUNK_COPY.test(out)) return null;
  if (/^home\s*»/i.test(out)) {
    // Breadcrumb only, or breadcrumb then prose on the next line.
    const [, rest] = out.split(/\n+/, 2);
    out = (rest ?? '').trim();
  }
  // "- 3+2 Axles - 22" Deck Height" / "• 5 D-rings • 33" deck" → a readable list.
  out = out.replace(/^[-•]\s*/, '').replace(/\s+[-•]\s+/g, ' · ');
  return out.length >= 8 ? out : null;
}

/**
 * Manufacturer copy written in the first person ("We know that you work
 * hard…"). Fine on a detail page under the maker's name; on a card with no
 * attribution it reads as the site speaking, which is exactly the
 * affiliation the disclaimer says we don't have.
 */
export function isFirstPerson(text: string): boolean {
  // Case-sensitive "us" so "the US heavy haul industry" doesn't count.
  return /\b([Ww]e|[Ww]e're|[Ww]e've|[Oo]ur|us)\b/.test(text);
}

/**
 * The same boilerplate paragraph opening every product of a maker ("Pitts
 * Trailers is the world's largest…"). Tells a buyer nothing about the model.
 */
export function isBrandBoilerplate(text: string, makerName: string | null | undefined): boolean {
  if (!makerName) return false;
  const first = makerName.split(' ')[0].toLowerCase();
  const lead = text.slice(0, 60).toLowerCase();
  return lead.startsWith(first) && /\b(is the|has been|have been|since \d{4})\b/.test(lead);
}

/**
 * Rated capacity, corrected where the scrape is provably wrong.
 *
 * - Fontaine: the scraper took the smallest "capacity" figure on the page —
 *   a concentrated-load rating — so every Magnitude and Workhorse read 11–15
 *   tons. Fontaine's own URL states the rating ("…-55-ton-capacity-…").
 *   Renegade URLs carry no rating, and their stored 13 is an axle rating.
 * - Talbert "30-55 SRG" and siblings: a 30–55 ton range stored as a flat 30.
 *
 * Only these two patterns, both read from the maker's own naming; anything
 * else is returned as stored. Migration 080 fixes the rows themselves.
 */
export function correctedTonnage(product: {
  name: string;
  source_url?: string | null;
  tonnage_min?: number | null;
  tonnage_max?: number | null;
}): { tonnage_min: number | undefined; tonnage_max: number | undefined } {
  const rated = /(?:^|[/-])(\d{2,3})-ton-capacity(?:[-/]|$)/i.exec(product.source_url ?? '');
  if (rated) {
    const t = Number(rated[1]);
    return { tonnage_min: t, tonnage_max: t };
  }
  // Fontaine pages with no rating in the URL (Renegade): the stored 13 is a
  // 25,000 lb axle rating ÷ 2,000, not the trailer. Say nothing rather than
  // the wrong number; migration 080 stores the real 30/40.
  if (/fontainespecialized\.com/i.test(product.source_url ?? '') && (product.tonnage_max ?? 99) <= 15) {
    return { tonnage_min: undefined, tonnage_max: undefined };
  }
  const range = /^(\d{2,3})\s?[-–]\s?(\d{2,3})\b(?!\s?(?:ft|'|′))/.exec(product.name.trim());
  if (range && Number(range[2]) > Number(range[1])) {
    return { tonnage_min: Number(range[1]), tonnage_max: Number(range[2]) };
  }
  return { tonnage_min: product.tonnage_min ?? undefined, tonnage_max: product.tonnage_max ?? undefined };
}

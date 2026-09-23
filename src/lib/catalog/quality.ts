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

/** Scraped pages that are not a product. Hidden everywhere the catalog renders. */
export const HIDDEN_PRODUCT_IDS: readonly string[] = [
  // Lifted from Hale Trailer's site (a real dealer): their photo and copy.
  '587c05e2-9f87-4f0d-8db5-3428fb5e2a97', // Faymonville MegaMAX
  'b2abbf97-5048-43e2-ab98-1ff021bbb4ae', // Faymonville HighwayMAX
  // Marketing, service, parts and article pages.
  '9c103a59-a339-4a79-9aa0-1ac713309289', // Loadstar: "Book Your Consultation!"
  '95044af2-f230-4f08-890e-a9db25fcbd7d', // Loadstar: service department
  'c3c1faa5-a19e-409d-89d4-f93f25f64c0c', // Loadstar: parts
  'f5fb43f2-0d0e-4913-8575-a1dc71ca2137', // Loadstar: custom-build pitch
  'fd349e96-31a8-4aa6-853e-58384469f3da', // Globe: buying-guide article
  'a6892e36-0ffd-4f7b-8f20-2514d9e68058', // Globe: category index
  'ec0c18ce-3e80-41e0-b8c7-1e16b31d0d16', // Witzco: "Translate:" widget
  '62d0445b-5c20-45e3-a285-b75dd73158c4', // Kalyn Siebert: division page
  '664621ed-49c2-4402-92ac-7d80bd3584f4', // Kalyn Siebert: division page
  '571c715e-2745-4076-8cea-1d7db32e0262', // Kalyn Siebert: refurbishment programme
  '6522d3b1-331c-4e5c-b78a-884f72e575dc', // Faymonville: scraped 404 page
  '4b396dc4-266c-451f-a786-9a03275590c5', // Faymonville: brand overview
  'f06bb4df-f94a-45e2-88bc-3c9745787c5a', // Faymonville: "Built for everyday heroes."
  '4b67222b-13b5-4598-8851-57b442c7ed3d', // Felling: category index
  '069ecd9e-f2f0-429f-94d8-b050d11feb82', // Felling: category index
  '6a6186b0-5290-453a-9aea-f7cac6470db6', // Felling: government sales
  'e7796113-0fb5-4414-a099-eec241d404ff', // Felling: ramp options
  'b7669a76-d43e-4d87-bb9d-242c13b16c64', // Felling: hitch option
  'a3d21e9c-8cc1-4527-88c3-e6068bf7da4d', // Felling: OEM division
  '672ba9ec-46a0-4771-b3ef-2269b6274d08', // Felling: OEM division
  '31ba749f-77bd-4be9-b332-1250e8c7cc77', // Felling: division index
  '2c601e03-0189-4eb6-a1e0-2b651013d4a0', // Felling: colour chart
  '9ee67cd9-6e74-4e5d-8c6f-0fc37fd65eb1', // Felling: galvanizing process
  '8c533f1d-fd5c-4f2c-92b5-9cd792fce1ed', // Felling: dump-gate options
];

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
const JUNK_COPY =
  /(privacy policy|cookie policy|find dealers closest|service hours|digital driver guide|can.t be found|no webpage was found|hale trailer)/i;

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

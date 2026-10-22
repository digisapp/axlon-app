/**
 * Page titles for listing detail pages.
 *
 * "{year} {make} {model} for Sale" left 659 of 1,161 listings sharing a
 * title with another listing, and dropped what the unit IS — "2025 Pitts
 * for Sale" never says lowboy. Starting from the seller's title, naming the
 * kind of equipment (from the category) and saying where it sits answers
 * the query a buyer actually types, "lowboy trailer for sale in Texas".
 */

// Category names that don't singularize by dropping a trailing "s".
const KIND_OVERRIDES: Record<string, string | null> = {
  'heavy-equipment': null,
  'components-parts': null,
  'atv-trailers': 'ATV Trailer',
  'chip-trailers': 'Chip Trailer',
  'live-floor-trailers': 'Live Floor Trailer',
  'specialty-trailers': 'Trailer',
  'rv-hauler-trucks': 'RV Hauler',
  'service-trucks': 'Service Truck',
  'fuel-trucks': 'Fuel Truck',
  'winch-trucks': 'Winch Truck',
};

// Words too generic to show the title already names the kind.
const GENERIC_WORDS = new Set(['trailer', 'trailers', 'truck', 'trucks']);

/** "Lowboy Trailers" → "Lowboy Trailer"; null when there's no useful noun. */
export function categoryKind(category: { slug?: string | null; name?: string | null } | null | undefined): string | null {
  if (!category?.name) return null;
  if (category.slug && category.slug in KIND_OVERRIDES) return KIND_OVERRIDES[category.slug];
  const name = category.name.trim();
  // "Cab & Chassis", "Intermodal Chassis": not plurals.
  if (/(?:ss|is)$/i.test(name) || !/s$/i.test(name)) return name;
  return name.slice(0, -1);
}

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export interface ListingTitleInput {
  title?: string | null;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  city?: string | null;
  state?: string | null;
  category?: { slug?: string | null; name?: string | null } | null;
}

/** Title without the " | Axleyard" suffix the root layout's template adds. */
export function listingSeoTitle(listing: ListingTitleInput): string {
  // The seller's own title is the most specific name a unit has ("2028 XL
  // Specialized 65 Ton 10ft Wide Lowboy Trailer"); year/make/model alone
  // collapsed fifteen different XL lowboys into one title.
  const ymm = [listing.year, listing.make, listing.model].filter(Boolean).join(' ');
  let name =
    (listing.title ?? '').replace(/\s+/g, ' ').replace(/\s+for sale\b.*$/i, '').trim() || ymm || 'Equipment';
  if (listing.year && !name.includes(String(listing.year))) name = `${listing.year} ${name}`;

  const kind = categoryKind(listing.category);
  if (kind) {
    const have = new Set(words(name));
    const kindWords = words(kind);
    const specific = kindWords.filter((w) => !GENERIC_WORDS.has(w));
    if (specific.length > 0 && specific.some((w) => have.has(w))) {
      // "2026 Pitts Lowboy" already says lowboy: add only "Trailer".
      const generic = kind.split(' ').pop()!;
      if (GENERIC_WORDS.has(generic.toLowerCase()) && !have.has(generic.toLowerCase())) {
        name = `${name} ${generic}`;
      }
    } else if (!kindWords.every((w) => have.has(w))) {
      name = `${name} ${kind}`;
    }
  }

  const city = listing.city?.trim();
  const state = listing.state?.trim();
  const location = city && state ? `${city}, ${state}` : state || '';
  return `${name} for Sale${location ? ` in ${location}` : ''}`;
}

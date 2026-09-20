import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import type { ManufacturerProduct } from '@/types';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';
import { normalizeHost } from './config';
import { catalogScope } from './catalog-scope';

export { catalogScope } from './catalog-scope';

export type MicrositeStatus = 'draft' | 'live' | 'paused';

export interface Microsite {
  id: string;
  domain: string;
  name: string;
  status: MicrositeStatus;
  manufacturer_id: string | null;
  product_type: string | null;
  listing_make: string | null;
  listing_category_slugs: string[] | null;
  /** Null until migration 079 is applied; see SELECT_WITH_CATALOG_TYPES. */
  catalog_product_types: string[] | null;
  show_listings: boolean;
  headline: string | null;
  subheadline: string | null;
  hero_image_url: string | null;
  accent_color: string;
  cta_label: string;
  phone: string | null;
  disclaimer: string | null;
  lead_recipient_email: string | null;
  assigned_user_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  manufacturer?: {
    id: string;
    name: string;
    slug: string;
    website: string | null;
    short_description: string | null;
  } | null;
}

/**
 * Tag every cached microsite read, so one admin save can drop all of them.
 * Edits are rare and manual — per-site invalidation would buy nothing but a
 * more fragile key.
 */
export const MICROSITES_CACHE_TAG = 'microsites';

// The manufacturer catalog changes only when a scraper runs; live inventory
// changes whenever a dealer posts. Nothing here is per-visitor, so both are
// safe to share across requests.
const CATALOG_TTL_SECONDS = 600;
const LISTINGS_TTL_SECONDS = 60;

const SELECT_BASE = `
  id, domain, name, status, manufacturer_id, product_type, listing_make,
  listing_category_slugs,
  show_listings, headline, subheadline, hero_image_url, accent_color, cta_label,
  phone, disclaimer, lead_recipient_email, assigned_user_id, meta_title,
  meta_description,
  manufacturer:manufacturers(id, name, slug, website, short_description)
`;

const SELECT_WITH_CATALOG_TYPES = `${SELECT_BASE}, catalog_product_types`;

/**
 * Whether `microsites.catalog_product_types` (migration 079) exists yet.
 *
 * This code and the migration reach production through different doors, and
 * five domains are already serving live traffic. Naming a column that isn't
 * there yet fails the whole select, which would resolve every host to null and
 * bounce every visitor to the marketplace — the site would be down, quietly,
 * for as long as the two were out of step. So the first query probes, and the
 * answer is remembered for the life of the instance.
 *
 * null = not yet determined.
 */
let catalogTypesColumnExists: boolean | null = null;

/** PostgREST codes for "you asked for a column/field that does not exist". */
function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === '42703' || error.code === 'PGRST204') return true;
  return /column .* does not exist|does not exist on table/i.test(error.message ?? '');
}

/**
 * Look up a microsite by host.
 *
 * Config is read with the service-role client: the table holds lead-routing
 * addresses and is not readable by anon, and this runs only on the server.
 * `cache()` dedupes the lookup across layout/page/metadata in one request.
 *
 * Deliberately NOT in the cross-request data cache. This row carries `status`,
 * and a TTL here would mean flipping a site live takes effect minutes later —
 * the exact confusion the setup doc warns about. It is also the cheapest read
 * of the three: one unique-index hit on `domain`. The heavy reads below are
 * the ones worth caching.
 */
export const getMicrositeByHost = cache(
  async (rawHost: string): Promise<Microsite | null> => {
    const domain = normalizeHost(rawHost);
    if (!domain || !domain.includes('.')) return null;

    const supabase = createAdminClient();

    const runQuery = (select: string) =>
      supabase.from('microsites').select(select).eq('domain', domain).maybeSingle();

    let { data, error } = await runQuery(
      catalogTypesColumnExists === false ? SELECT_BASE : SELECT_WITH_CATALOG_TYPES
    );

    if (error && catalogTypesColumnExists !== false && isMissingColumnError(error)) {
      // Migration 079 hasn't landed on this database yet. Fall back for the
      // life of this instance rather than failing the request.
      catalogTypesColumnExists = false;
      logger.warn('microsites.catalog_product_types missing; migration 079 not applied');
      ({ data, error } = await runQuery(SELECT_BASE));
    } else if (!error && catalogTypesColumnExists === null) {
      catalogTypesColumnExists = true;
    }

    if (error) {
      logger.error('Microsite resolve failed', { error, domain });
      return null;
    }
    if (!data) return null;

    // PostgREST returns a many-to-one embed as an object, but the generated
    // types allow an array. Normalize once here so every caller — the pages,
    // the listing filter, the disclaimer — can read `site.manufacturer.name`
    // without each repeating the check (and one of them forgetting to).
    const row = data as unknown as Omit<Microsite, 'manufacturer'> & {
      manufacturer?: Microsite['manufacturer'] | NonNullable<Microsite['manufacturer']>[];
    };
    const site: Microsite = {
      ...row,
      catalog_product_types: row.catalog_product_types ?? null,
      manufacturer: Array.isArray(row.manufacturer) ? (row.manufacturer[0] ?? null) : (row.manufacturer ?? null),
    };

    // Only `live` sites are served. Pointing DNS at the app must not publish
    // a site whose copy nobody has reviewed.
    if (site.status !== 'live') return null;
    return site;
  }
);

/**
 * The catalog queries select only the image columns these pages render, so the
 * relation is narrower than ManufacturerProductImage. Omit the full relation
 * before redeclaring it rather than widening the shared type.
 */
export interface MicrositeProduct extends Omit<ManufacturerProduct, 'images'> {
  images?: { url: string; alt_text: string | null; is_primary: boolean | null }[];
}

/**
 * Keyed on the primitives the query actually uses, never on the Microsite
 * object: the object carries headline/colour/etc., so keying on it would drop
 * the catalog cache every time someone edited a word of copy.
 */
async function fetchProducts(
  manufacturerId: string | null,
  productTypes: string[],
  limit: number
): Promise<MicrositeProduct[]> {
  const supabase = createAdminClient();

    let query = supabase
      .from('manufacturer_products')
      .select(`
        id, name, slug, series, tagline, short_description, product_type,
        tonnage_min, tonnage_max, deck_height_inches, deck_length_feet,
        axle_count, gooseneck_type, gvwr_lbs, is_featured, sort_order,
        images:manufacturer_product_images(url, alt_text, is_primary),
        manufacturer:manufacturers(name, slug)
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(limit);

    // A brand site pins one maker; a category site spans all of them. One of
    // the two is always set — getMicrositeProducts returns early otherwise.
    if (manufacturerId) query = query.eq('manufacturer_id', manufacturerId);
    if (productTypes.length) query = query.in('product_type', productTypes);

    const { data, error } = await query;
    // Throw rather than returning []: unstable_cache stores whatever resolves,
    // so swallowing a transient failure here would pin an empty catalog on the
    // page for the full TTL. The caller logs and degrades for this request only.
    if (error) throw new Error(`microsite products query failed: ${error.message}`);
    return (data ?? []) as unknown as MicrositeProduct[];
}

/** Catalog products this microsite shows, most prominent first. */

export const getMicrositeProducts = cache(
  async (site: Microsite, limit = 24): Promise<MicrositeProduct[]> => {
    const { manufacturerId, productTypes } = catalogScope(site);
    if (!manufacturerId && !productTypes.length) return [];

    try {
      return await unstable_cache(
        () => fetchProducts(manufacturerId, productTypes, limit),
        ['microsite-products', manufacturerId ?? '', productTypes.join(','), String(limit)],
        { tags: [MICROSITES_CACHE_TAG], revalidate: CATALOG_TTL_SECONDS }
      )();
    } catch (error) {
      logger.error('Microsite products fetch failed', { error, manufacturerId, productTypes });
      return [];
    }
  }
);

async function fetchProduct(
  manufacturerId: string | null,
  productTypes: string[],
  slug: string
): Promise<MicrositeProduct | null> {
  const supabase = createAdminClient();
  let query = supabase
      .from('manufacturer_products')
      .select(`
        *,
        images:manufacturer_product_images(url, alt_text, is_primary, sort_order),
        specs:manufacturer_product_specs(spec_category, spec_key, spec_value, spec_unit, sort_order),
        manufacturer:manufacturers(name, slug)
      `)
      .eq('slug', slug)
      .eq('is_active', true);

  if (manufacturerId) query = query.eq('manufacturer_id', manufacturerId);
  if (productTypes.length) query = query.in('product_type', productTypes);

  // `slug` is unique per manufacturer, not globally, so a category site
  // spanning makers can match more than one row (today: "lowboy-trailers",
  // owned by both Globe and Etnyre). maybeSingle() would throw on that.
  // Order so the winner is stable across requests rather than whatever the
  // planner happens to return first.
  const { data, error } = await query
    .order('manufacturer_id', { ascending: true })
    .limit(1);

  if (error) throw new Error(`microsite product query failed: ${error.message}`);
  return (data?.[0] as unknown as MicrositeProduct) ?? null;
}

/** One catalog product on this microsite, by slug. */
export const getMicrositeProduct = cache(
  async (site: Microsite, slug: string): Promise<MicrositeProduct | null> => {
    const { manufacturerId, productTypes } = catalogScope(site);
    if (!manufacturerId && !productTypes.length) return null;

    try {
      return await unstable_cache(
        () => fetchProduct(manufacturerId, productTypes, slug),
        ['microsite-product', manufacturerId ?? '', productTypes.join(','), slug],
        { tags: [MICROSITES_CACHE_TAG], revalidate: CATALOG_TTL_SECONDS }
      )();
    } catch (error) {
      logger.error('Microsite product fetch failed', { error, manufacturerId, slug });
      return null;
    }
  }
);

export interface MicrositeListing {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  city: string | null;
  state: string | null;
  condition: string | null;
  images: { url: string }[] | null;
}

/**
 * Live marketplace inventory matching this site's niche. A microsite about XL
 * trailers is far more credible with real units on it than with a catalog
 * alone, and these are the listings a lead can actually be sold against.
 */
async function fetchListings(
  make: string,
  categories: string[],
  limit: number
): Promise<MicrositeListing[]> {
  const supabase = createAdminClient();

    // Filtering on a category slug requires the embed to be an INNER join —
    // a plain embed would return every listing with a null category rather
    // than restricting the set.
    const columns =
      'id, title, price, year, make, model, city, state, condition, images:listing_images(url, sort_order)';
    const select = categories.length
      ? `${columns}, category:categories!inner(slug)`
      : columns;

    let query = supabase
      .from('listings')
      .select(select)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false, nullsFirst: false })
      // Without this the embedded photos come back unordered and a card can
      // lead with a detail shot instead of the primary image.
      .order('sort_order', { referencedTable: 'listing_images', ascending: true })
      .limit(limit);

    if (make) query = query.ilike('make', `%${make}%`);
    if (categories.length) query = query.in('category.slug', categories);

    const { data, error } = await query;
    if (error) throw new Error(`microsite listings query failed: ${error.message}`);
    return (data ?? []) as unknown as MicrositeListing[];
}

export const getMicrositeListings = cache(
  async (site: Microsite, limit = 12): Promise<MicrositeListing[]> => {
    if (!site.show_listings) return [];

    const categories = site.listing_category_slugs ?? [];

    // A site built around a category is not built around a brand. Falling back
    // to the linked manufacturer's name would AND the two together and empty
    // the grid — tagtrailer.com shows Felling's catalog but must still list
    // Interstate, Talbert and Load King tag trailers. So the manufacturer
    // fallback applies only when no category filter is set; an explicitly
    // entered listing_make still narrows either way.
    const rawMake = categories.length
      ? site.listing_make || ''
      : site.listing_make || site.manufacturer?.name || '';
    // Admin-entered, but a stray % or _ in a make name silently turns this
    // into a much broader match than the admin asked for. Normalize before
    // it becomes part of the cache key, so two spellings can't key apart.
    const make = rawMake ? sanitizeSearchFilter(rawMake).replace(/[%_]/g, (c) => `\\${c}`) : '';

    // Sorted so two orderings of the same filter share one cache entry.
    const categoryKey = [...categories].sort().join(',');

    try {
      return await unstable_cache(
        () => fetchListings(make, categories, limit),
        ['microsite-listings', make, categoryKey, String(limit)],
        { tags: [MICROSITES_CACHE_TAG], revalidate: LISTINGS_TTL_SECONDS }
      )();
    } catch (error) {
      logger.error('Microsite listings fetch failed', { error, make, categories });
      return [];
    }
  }
);

/**
 * The affiliation disclosure. These domains are ours, not the manufacturer's,
 * so every page states that plainly. Editable per site; this is the fallback.
 */
export function disclaimerFor(site: Microsite): string {
  if (site.disclaimer) return site.disclaimer;
  const mfr = site.manufacturer?.name;
  if (mfr) {
    return `${site.name} is an independent marketplace operated by Axleyard. We are not affiliated with, endorsed by, or an authorized dealer for ${mfr}. All trademarks and product names are the property of their respective owners.`;
  }
  return `${site.name} is an independent marketplace operated by Axleyard. All trademarks and product names are the property of their respective owners.`;
}

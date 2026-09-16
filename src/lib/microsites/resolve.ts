import 'server-only';
import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ManufacturerProduct } from '@/types';
import { normalizeHost } from './config';

export type MicrositeStatus = 'draft' | 'live' | 'paused';

export interface Microsite {
  id: string;
  domain: string;
  name: string;
  status: MicrositeStatus;
  manufacturer_id: string | null;
  product_type: string | null;
  listing_make: string | null;
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

const SELECT = `
  id, domain, name, status, manufacturer_id, product_type, listing_make,
  show_listings, headline, subheadline, hero_image_url, accent_color, cta_label,
  phone, disclaimer, lead_recipient_email, assigned_user_id, meta_title,
  meta_description,
  manufacturer:manufacturers(id, name, slug, website, short_description)
`;

/**
 * Look up a microsite by host.
 *
 * Config is read with the service-role client: the table holds lead-routing
 * addresses and is not readable by anon, and this runs only on the server.
 * `cache()` dedupes the lookup across layout/page/metadata in one request.
 */
export const getMicrositeByHost = cache(
  async (rawHost: string): Promise<Microsite | null> => {
    const domain = normalizeHost(rawHost);
    if (!domain || !domain.includes('.')) return null;

    const supabase = createAdminClient();
    const { data } = await supabase
      .from('microsites')
      .select(SELECT)
      .eq('domain', domain)
      .maybeSingle();

    if (!data) return null;
    const site = data as unknown as Microsite;
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

/** Catalog products this microsite shows, most prominent first. */
export const getMicrositeProducts = cache(
  async (site: Microsite, limit = 24): Promise<MicrositeProduct[]> => {
    if (!site.manufacturer_id) return [];
    const supabase = createAdminClient();

    let query = supabase
      .from('manufacturer_products')
      .select(`
        id, name, slug, series, tagline, short_description, product_type,
        tonnage_min, tonnage_max, deck_height_inches, deck_length_feet,
        axle_count, gooseneck_type, gvwr_lbs, is_featured, sort_order,
        images:manufacturer_product_images(url, alt_text, is_primary)
      `)
      .eq('manufacturer_id', site.manufacturer_id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(limit);

    if (site.product_type) query = query.eq('product_type', site.product_type);

    const { data } = await query;
    return (data ?? []) as unknown as MicrositeProduct[];
  }
);

/** One catalog product on this microsite, by slug. */
export const getMicrositeProduct = cache(
  async (site: Microsite, slug: string): Promise<MicrositeProduct | null> => {
    if (!site.manufacturer_id) return null;
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('manufacturer_products')
      .select(`
        *,
        images:manufacturer_product_images(url, alt_text, is_primary, sort_order),
        specs:manufacturer_product_specs(spec_category, spec_key, spec_value, spec_unit, sort_order)
      `)
      .eq('manufacturer_id', site.manufacturer_id)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    return (data as unknown as MicrositeProduct) ?? null;
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
export const getMicrositeListings = cache(
  async (site: Microsite, limit = 12): Promise<MicrositeListing[]> => {
    if (!site.show_listings) return [];
    const supabase = createAdminClient();

    let query = supabase
      .from('listings')
      .select('id, title, price, year, make, model, city, state, condition, images:listing_images(url, sort_order)')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false, nullsFirst: false })
      // Without this the embedded photos come back unordered and a card can
      // lead with a detail shot instead of the primary image.
      .order('sort_order', { referencedTable: 'listing_images', ascending: true })
      .limit(limit);

    const make = site.listing_make || site.manufacturer?.name;
    if (make) query = query.ilike('make', `%${make}%`);

    const { data, error } = await query;
    if (error || !data) return [];
    return data as unknown as MicrositeListing[];
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

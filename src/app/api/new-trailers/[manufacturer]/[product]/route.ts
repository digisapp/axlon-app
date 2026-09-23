import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { CATALOG_CACHE_HEADERS } from '@/lib/api/cache-headers';
import { withBrandBannersLast } from '@/lib/images/catalog-junk-images';
import { cleanCopy, cleanProductName, correctedTonnage, isHiddenProduct } from '@/lib/catalog/quality';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Explicit columns: `*` shipped each product's search_vector tsvector, which
// roughly doubles the payload and is never used by clients.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ manufacturer: string; product: string }> }
) {
  try {
    const { manufacturer, product } = await params;

    const { data, error } = await supabase
      .from('manufacturer_products')
      .select(`
        id, manufacturer_id, name, slug, series, model_number, tagline, description, short_description, product_type, tonnage_min, tonnage_max, deck_height_inches, deck_length_feet, overall_length_feet, axle_count, gooseneck_type, empty_weight_lbs, gvwr_lbs, concentrated_capacity_lbs, msrp_low, msrp_high, source_url, last_scraped_at, is_active, is_featured, sort_order, created_at, updated_at,
        manufacturers!inner(id, name, slug, logo_url, website, description, short_description),
        manufacturer_product_images(id, url, alt_text, is_primary, sort_order),
        manufacturer_product_specs(id, spec_category, spec_key, spec_value, spec_unit, sort_order)
      `)
      .eq('slug', product)
      .eq('manufacturers.slug', manufacturer)
      .eq('is_active', true)
      .order('sort_order', { referencedTable: 'manufacturer_product_images', ascending: true })
      .order('spec_category', { referencedTable: 'manufacturer_product_specs', ascending: true })
      .order('sort_order', { referencedTable: 'manufacturer_product_specs', ascending: true })
      .single();

    if (error || !data || isHiddenProduct(data.id)) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ...data,
          name: cleanProductName(data.name),
          ...correctedTonnage(data),
          short_description: cleanCopy(data.short_description),
          description: cleanCopy(data.description),
          manufacturer_product_images: withBrandBannersLast(data.manufacturer_product_images),
        },
      },
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    logger.error('New trailer product detail API error', { error: error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

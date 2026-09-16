import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { CATALOG_CACHE_HEADERS } from '@/lib/api/cache-headers';

interface CategoryCount {
  category_id: string;
  name: string | null;
  slug: string | null;
  count: number;
}

interface CategoryCountRow {
  category_id: string | null;
  category: { name: string | null; slug: string | null } | { name: string | null; slug: string | null }[] | null;
}

/**
 * `?limit=abc` used to parse to NaN and reach .range(NaN, NaN), which PostgREST
 * rejects with a 500; an uncapped limit also let one request pull the whole table.
 */
function parseIntParam(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const listingsLimit = parseIntParam(searchParams.get('listings_limit'), 12, 1, 100);
    const listingsOffset = parseIntParam(searchParams.get('listings_offset'), 0, 0, 100_000);
    const category = searchParams.get('category');

    const supabase = await createClient();

    // Get manufacturer
    const { data: manufacturer, error: mfrError } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (mfrError || !manufacturer) {
      return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    }

    // Build listings query
    let listingsQuery = supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        year,
        make,
        model,
        condition,
        mileage,
        hours,
        city,
        state,
        is_featured,
        created_at,
        images:listing_images(id, url, thumbnail_url, is_primary)
      `, { count: 'exact' })
      .ilike('make', manufacturer.canonical_name)
      .eq('status', 'active');

    // Filter by category if provided
    if (category) {
      // Join with categories to filter by slug
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (cat) {
        listingsQuery = listingsQuery.eq('category_id', cat.id);
      }
    }

    // Order and paginate
    listingsQuery = listingsQuery
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(listingsOffset, listingsOffset + listingsLimit - 1);

    const { data: listings, count: listingCount, error: listingsError } = await listingsQuery;

    if (listingsError) {
      logger.error('Error fetching listings', { listingsError });
    }

    // Get listing count by category for this manufacturer. The
    // get_manufacturer_category_counts RPC this used to call does not exist in any
    // migration (PostgREST 404), so aggregate in JS from a capped row scan instead.
    const { data: categoryRows } = await supabase
      .from('listings')
      .select('category_id, category:categories!left(name, slug)')
      .ilike('make', manufacturer.canonical_name)
      .eq('status', 'active')
      .not('category_id', 'is', null)
      .limit(1000);

    const countsByCategory = new Map<string, CategoryCount>();
    for (const row of (categoryRows || []) as CategoryCountRow[]) {
      if (!row.category_id) continue;
      const existing = countsByCategory.get(row.category_id);
      if (existing) {
        existing.count += 1;
        continue;
      }
      const cat = Array.isArray(row.category) ? row.category[0] : row.category;
      countsByCategory.set(row.category_id, {
        category_id: row.category_id,
        name: cat?.name ?? null,
        slug: cat?.slug ?? null,
        count: 1,
      });
    }
    const categoryCounts = Array.from(countsByCategory.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json(
      {
        data: manufacturer,
        listings: listings || [],
        listing_count: listingCount || 0,
        category_counts: categoryCounts,
      },
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    logger.error('Manufacturer API error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

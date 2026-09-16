import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { CATALOG_CACHE_HEADERS } from '@/lib/api/cache-headers';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';

/**
 * `?limit=abc` used to parse to NaN and reach .range(NaN, NaN), which PostgREST
 * rejects with a 500; an uncapped limit also let one request pull the whole table.
 */
function parseIntParam(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const equipmentType = searchParams.get('equipment_type');
    const featuredOnly = searchParams.get('featured_only') === 'true';
    const limit = parseIntParam(searchParams.get('limit'), 50, 1, 100);
    const offset = parseIntParam(searchParams.get('offset'), 0, 0, 100_000);

    const supabase = await createClient();

    let query = supabase
      .from('manufacturers')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Search
    if (q) {
      const sq = sanitizeSearchFilter(q);
      query = query.or(`name.ilike.%${sq}%,canonical_name.ilike.%${sq}%`);
    }

    // Filter by equipment type
    if (equipmentType) {
      query = query.contains('equipment_types', [equipmentType]);
    }

    // Featured only
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    // Order: featured first, then by listing count, then alphabetically
    query = query
      .order('is_featured', { ascending: false })
      .order('feature_tier', { ascending: false })
      .order('listing_count', { ascending: false })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: manufacturers, count, error } = await query;

    if (error) {
      logger.error('Error fetching manufacturers', { error });
      return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
    }

    return NextResponse.json(
      {
        data: manufacturers,
        total: count || 0,
        limit,
        offset,
      },
      { headers: CATALOG_CACHE_HEADERS }
    );
  } catch (error) {
    logger.error('Manufacturers API error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Active-listing counts keyed by normalized make, for the manufacturer
 * directory. One paged read of `make` replaces a COUNT(*) per manufacturer.
 *
 * The result is memoized per server instance for a few minutes: the root
 * layout's nonce/CSP setup keeps every route dynamic, so without this the
 * aggregation would rerun on each request.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
// PostgREST caps any single response at 1,000 rows regardless of .range()
const PAGE_SIZE = 1000;
// Hard stop so a runaway catalog can't turn this into an unbounded scan
const MAX_PAGES = 20;

let cached: { value: Map<string, number>; expires: number } | null = null;

export function normalizeMake(make: string | null | undefined): string {
  return (make ?? '').trim().toLowerCase();
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createSupabaseClient(url, anonKey);
}

async function fetchCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const supabase = getAnonClient();
  if (!supabase) return counts;

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from('listings')
      .select('make')
      .eq('status', 'active')
      .not('make', 'is', null)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data) break;

    for (const row of data) {
      const key = normalizeMake(row.make);
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    if (data.length < PAGE_SIZE) break;
  }

  return counts;
}

export async function getActiveListingCountsByMake(): Promise<Map<string, number>> {
  if (cached && Date.now() < cached.expires) return cached.value;
  const value = await fetchCounts();
  cached = { value, expires: Date.now() + CACHE_TTL_MS };
  return value;
}

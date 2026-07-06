import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export interface HomeDeal {
  id: string;
  title: string;
  price: number;
  ai_price_estimate: number;
  discount_percent: number;
  savings: number;
  images?: { url: string; thumbnail_url?: string; is_primary?: boolean }[];
}

export interface HomeStats {
  activeListings: number | null;
  sellers: number | null;
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createSupabaseClient(url, anonKey);
}

// The root layout reads headers() (CSP nonce), which forces every route to
// render dynamically — so the homepage hits this on each request. A short
// in-memory TTL keeps the DB out of the hot path on warm instances.
const CACHE_TTL_MS = 5 * 60 * 1000;
const memoryCache = new Map<string, { value: unknown; expires: number }>();

async function withTtlCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = memoryCache.get(key);
  if (hit && Date.now() < hit.expires) return hit.value as T;
  const value = await fn();
  memoryCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

// Same deal logic as /api/deals (price below ai_price_estimate), run at render
// time so deals ship in the initial HTML instead of popping in client-side.
export async function getHomeDeals(limit = 4, minDiscount = 5): Promise<HomeDeal[]> {
  return withTtlCache(`home-deals:${limit}:${minDiscount}`, () =>
    fetchHomeDeals(limit, minDiscount)
  );
}

async function fetchHomeDeals(limit: number, minDiscount: number): Promise<HomeDeal[]> {
  const supabase = getAnonClient();
  if (!supabase) return [];

  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select(
        'id, title, price, ai_price_estimate, images:listing_images!left(url, thumbnail_url, is_primary)'
      )
      .eq('status', 'active')
      .not('price', 'is', null)
      .not('ai_price_estimate', 'is', null)
      .gt('ai_price_estimate', 0)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !listings) return [];

    const deals = listings
      .map((listing) => ({
        ...listing,
        discount_percent: Math.round(
          ((listing.ai_price_estimate - listing.price) / listing.ai_price_estimate) * 100
        ),
        savings: listing.ai_price_estimate - listing.price,
      }))
      .filter((listing) => listing.discount_percent >= minDiscount);

    // Fisher-Yates shuffle so revalidations rotate which deals are featured
    for (let i = deals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deals[i], deals[j]] = [deals[j], deals[i]];
    }

    return deals.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getHomeStats(): Promise<HomeStats> {
  return withTtlCache('home-stats', fetchHomeStats);
}

async function fetchHomeStats(): Promise<HomeStats> {
  const supabase = getAnonClient();
  if (!supabase) return { activeListings: null, sellers: null };

  const [listingsResult, sellersResult] = await Promise.allSettled([
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_business', true),
  ]);

  return {
    activeListings:
      listingsResult.status === 'fulfilled' && !listingsResult.value.error
        ? listingsResult.value.count
        : null,
    sellers:
      sellersResult.status === 'fulfilled' && !sellersResult.value.error
        ? sellersResult.value.count
        : null,
  };
}

// "5,234" reads as fake precision on a marketing page; "5,200+" reads as real scale.
export function roundStat(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 100) * 100}`;
  if (n >= 100) return `${Math.floor(n / 10) * 10}`;
  return `${n}`;
}

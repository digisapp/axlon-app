import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

/**
 * What a crawler sees on /search and /search?category=… .
 *
 * The interactive results grid fetches /api/listings in the browser, so the
 * HTML the server sends holds no listings at all — and AI crawlers
 * (OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot) don't run JavaScript.
 * "Lowboy Trailers for Sale" reached ChatGPT as an empty page. This loads the
 * same active inventory server-side so the page can render a summary and a
 * plain link to every unit in the category.
 */

// Supabase caps every response at 1,000 rows — page by at most that.
const PAGE_SIZE = 1000;
// Links rendered per page. Lowboys, the largest category, are ~400 today.
export const MAX_INDEXED_LISTINGS = 500;
const TTL_SECONDS = 600;

export interface InventoryItem {
  id: string;
  title: string;
  price: number | null;
  city: string | null;
  state: string | null;
}

export interface InventoryCategory {
  slug: string;
  name: string;
  count: number;
}

export interface SearchInventory {
  /** null on the all-listings page (/search). */
  category: { slug: string; name: string } | null;
  total: number;
  /** Newest first, capped at MAX_INDEXED_LISTINGS. */
  items: InventoryItem[];
  pricedCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  /** Most-listed makes first. */
  topMakes: string[];
  /** Most-listed states first. */
  topStates: string[];
  /** Stocked child categories (a parent's page) or every stocked category (/search). */
  subcategories: InventoryCategory[];
}

type CategoryRow = { id: string; slug: string; name: string; parent_id: string | null };
type ListingRow = InventoryItem & { make: string | null; category_id: string | null };

function anonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Words scraped into `make` that aren't brands ("Hydraulic Detachable
// Lowboy" → make "Hydraulic"). Never name them as makes.
const NOT_A_MAKE = new Set(['hydraulic', 'new', 'used', 'custom', 'other', 'unknown', 'trailer', 'truck', 'n/a']);

/**
 * Values sorted by how often they occur, most frequent first. Case variants
 * count as one ("KALYN SIEBERT" and "Kalyn Siebert" are the same make) and
 * show as their most common mixed-case spelling.
 */
function byFrequency(values: (string | null)[], limit: number, exclude?: Set<string>): string[] {
  const groups = new Map<string, { count: number; spellings: Map<string, number> }>();
  for (const raw of values) {
    const value = raw?.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (exclude?.has(key)) continue;
    const group = groups.get(key) ?? { count: 0, spellings: new Map<string, number>() };
    group.count += 1;
    group.spellings.set(value, (group.spellings.get(value) ?? 0) + 1);
    groups.set(key, group);
  }
  const display = (spellings: Map<string, number>) =>
    [...spellings.entries()].sort(
      (a, b) =>
        Number(a[0] === a[0].toUpperCase()) - Number(b[0] === b[0].toUpperCase()) || b[1] - a[1]
    )[0][0];
  return [...groups.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([, group]) => display(group.spellings));
}

// Throws rather than returning an empty result on a database error:
// unstable_cache stores whatever resolves, and a cached "0 listings" would
// noindex a stocked category for the whole TTL.
async function loadInventory(slug: string | null): Promise<SearchInventory | null> {
  const supabase = anonClient();

  const { data: categoryRows, error: categoryError } = await supabase
    .from('categories')
    .select('id, slug, name, parent_id');
  if (categoryError) throw new Error(`categories: ${categoryError.message}`);
  const categories = (categoryRows ?? []) as CategoryRow[];

  let category: CategoryRow | null = null;
  let categoryIds: string[] | null = null;
  if (slug) {
    category = categories.find((c) => c.slug === slug) ?? null;
    if (!category) return null;
    // Same scope as /api/listings: a parent category includes its children.
    categoryIds = category.parent_id
      ? [category.id]
      : [category.id, ...categories.filter((c) => c.parent_id === category!.id).map((c) => c.id)];
  }

  const rows: ListingRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase
      .from('listings')
      .select('id, title, price, city, state, make, category_id')
      .eq('status', 'active');
    if (categoryIds) query = query.in('category_id', categoryIds);
    const { data, error } = await query
      .order('created_at', { ascending: false })
      // Unique tiebreaker so rows can't shift between pages.
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`listings: ${error.message}`);
    rows.push(...((data ?? []) as ListingRow[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  const prices = rows.map((r) => r.price).filter((p): p is number => typeof p === 'number' && p > 0);

  // Child categories (or, on /search, every category) that have stock — a
  // parent's own count includes its children's.
  const ownCounts = new Map<string, number>();
  for (const row of rows) {
    if (row.category_id) ownCounts.set(row.category_id, (ownCounts.get(row.category_id) ?? 0) + 1);
  }
  const countWithChildren = (c: CategoryRow) =>
    (ownCounts.get(c.id) ?? 0) +
    (c.parent_id
      ? 0
      : categories.filter((k) => k.parent_id === c.id).reduce((sum, k) => sum + (ownCounts.get(k.id) ?? 0), 0));
  const candidates = category
    ? categories.filter((c) => c.parent_id === category!.id)
    : categories;
  const subcategories = candidates
    .map((c) => ({ slug: c.slug, name: c.name, count: countWithChildren(c) }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    category: category ? { slug: category.slug, name: category.name } : null,
    total: rows.length,
    items: rows.slice(0, MAX_INDEXED_LISTINGS).map(({ id, title, price, city, state }) => ({
      id,
      title,
      price,
      city,
      state,
    })),
    pricedCount: prices.length,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    topMakes: byFrequency(rows.map((r) => r.make), 6, NOT_A_MAKE),
    topStates: byFrequency(rows.map((r) => r.state), 10),
    subcategories,
  };
}

/**
 * Active inventory for a category slug (or every category when slug is null).
 * Returns null for an unknown category and undefined when the database read
 * failed — callers must not treat a failure as "this category is empty".
 * Cached across requests for TTL_SECONDS; deduped within a request so
 * generateMetadata and the page share one read.
 */
export const getSearchInventory = cache(
  async (slug: string | null): Promise<SearchInventory | null | undefined> => {
    try {
      return await unstable_cache(() => loadInventory(slug), ['search-inventory-v2', slug ?? ''], {
        revalidate: TTL_SECONDS,
      })();
    } catch (error) {
      logger.error('Search inventory fetch failed', { error, slug });
      return undefined;
    }
  }
);

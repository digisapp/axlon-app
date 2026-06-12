import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/resend';
import { escapeHtml, escapeAttribute } from '@/lib/utils/html-escape';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';

export const maxDuration = 300;

function verifyRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

const BATCH_SIZE = 50; // Saved searches processed per run
const MAX_LISTINGS_PER_EMAIL = 5;

// Filters are stored exactly as the search page's FilterValues (camelCase) —
// see SaveSearchButton / AdvancedFilters
interface SavedSearchFilters {
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  makes?: string[];
  conditions?: string[];
  states?: string[];
  category?: string; // slug
}

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  query: string | null;
  filters: SavedSearchFilters | null;
  notify_frequency: 'instant' | 'daily' | 'weekly';
  last_notified_at: string | null;
  created_at: string;
}

interface MatchedListing {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

// Minimum time between notifications per frequency (slightly under the
// nominal period so an hourly cron doesn't skip a cycle due to jitter)
const NOTIFY_INTERVAL_MS: Record<string, number> = {
  instant: 0,
  daily: 22 * 60 * 60 * 1000,
  weekly: 6.5 * 24 * 60 * 60 * 1000,
};

function isDue(search: SavedSearch, now: number): boolean {
  if (!search.last_notified_at) return true;
  const interval = NOTIFY_INTERVAL_MS[search.notify_frequency] ?? NOTIFY_INTERVAL_MS.daily;
  return now - new Date(search.last_notified_at).getTime() >= interval;
}

/** Resolve a category slug to the set of category ids it covers (parent → children) */
async function resolveCategoryIds(
  supabase: ReturnType<typeof createAdminClient>,
  slug: string,
  cache: Map<string, string[]>
): Promise<string[]> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const ids: string[] = [];
  const { data: category } = await supabase
    .from('categories')
    .select('id, parent_id')
    .eq('slug', slug)
    .single();

  if (category) {
    ids.push(category.id);
    if (!category.parent_id) {
      const { data: children } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', category.id);
      ids.push(...(children || []).map((c) => c.id));
    }
  }

  cache.set(slug, ids);
  return ids;
}

/** Find active listings created after `since` that match the saved search */
async function findNewMatches(
  supabase: ReturnType<typeof createAdminClient>,
  search: SavedSearch,
  since: string,
  categoryCache: Map<string, string[]>
): Promise<{ matches: MatchedListing[]; total: number }> {
  const f = search.filters || {};

  let query = supabase
    .from('listings')
    .select('id, title, price, year, make, model, city, state, created_at', { count: 'exact' })
    .eq('status', 'active')
    .gt('created_at', since);

  if (f.category) {
    const categoryIds = await resolveCategoryIds(supabase, f.category, categoryCache);
    if (categoryIds.length === 1) {
      query = query.eq('category_id', categoryIds[0]);
    } else if (categoryIds.length > 1) {
      query = query.in('category_id', categoryIds);
    } else {
      // Unknown category slug — nothing can match
      return { matches: [], total: 0 };
    }
  }

  if (f.priceMin) query = query.gte('price', f.priceMin);
  if (f.priceMax) query = query.lte('price', f.priceMax);
  if (f.yearMin) query = query.gte('year', f.yearMin);
  if (f.yearMax) query = query.lte('year', f.yearMax);
  if (f.mileageMax) query = query.lte('mileage', f.mileageMax);

  if (f.makes?.length) {
    const makes = f.makes.map((m) => sanitizeSearchFilter(String(m))).filter(Boolean);
    if (makes.length === 1) {
      query = query.ilike('make', `%${makes[0]}%`);
    } else if (makes.length > 1) {
      query = query.or(makes.map((m) => `make.ilike.%${m}%`).join(','));
    }
  }
  if (f.conditions?.length) query = query.in('condition', f.conditions.map(String));
  if (f.states?.length) query = query.in('state', f.states.map(String));

  // Mirror /api/listings: free-text query uses the search_vector index
  if (search.query) {
    query = query.textSearch('search_vector', search.query, {
      type: 'websearch',
      config: 'english',
    });
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .limit(MAX_LISTINGS_PER_EMAIL);

  if (error) {
    logger.error('Saved search match query failed', { searchId: search.id, error });
    return { matches: [], total: 0 };
  }

  return { matches: data || [], total: count || 0 };
}

function formatPrice(price: number | null): string {
  if (!price) return 'Call for Price';
  return `$${price.toLocaleString('en-US')}`;
}

function buildEmailHtml(
  search: SavedSearch,
  matches: MatchedListing[],
  total: number,
  baseUrl: string
): string {
  const rows = matches
    .map((l) => {
      const subtitle = [l.year, l.make, l.model].filter(Boolean).join(' ');
      const location = [l.city, l.state].filter(Boolean).join(', ');
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
            <a href="${escapeAttribute(`${baseUrl}/listing/${l.id}`)}" style="color:#111827;font-weight:600;text-decoration:none;font-size:15px;">
              ${escapeHtml(l.title)}
            </a>
            <div style="color:#6b7280;font-size:13px;margin-top:2px;">
              ${escapeHtml(subtitle)}${location ? ` &middot; ${escapeHtml(location)}` : ''}
            </div>
            <div style="color:#111827;font-weight:700;font-size:14px;margin-top:4px;">
              ${escapeHtml(formatPrice(l.price))}
            </div>
          </td>
        </tr>`;
    })
    .join('');

  const moreCount = total - matches.length;
  const searchUrl = search.query
    ? `${baseUrl}/search?q=${encodeURIComponent(search.query)}`
    : `${baseUrl}/search`;

  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h2 style="color:#111827;font-size:18px;margin:0 0 4px;">New matches for &ldquo;${escapeHtml(search.name)}&rdquo;</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 16px;">
      ${total} new listing${total === 1 ? '' : 's'} on AXLON match${total === 1 ? 'es' : ''} your saved search.
    </p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    ${
      moreCount > 0
        ? `<p style="margin:16px 0 0;"><a href="${escapeAttribute(searchUrl)}" style="color:#2563eb;font-size:14px;">View ${moreCount} more match${moreCount === 1 ? '' : 'es'} &rarr;</a></p>`
        : `<p style="margin:16px 0 0;"><a href="${escapeAttribute(searchUrl)}" style="color:#2563eb;font-size:14px;">View on AXLON &rarr;</a></p>`
    }
    <p style="color:#9ca3af;font-size:12px;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:12px;">
      You're receiving this because you saved this search with email alerts on.
      <a href="${escapeAttribute(`${baseUrl}/dashboard/saved`)}" style="color:#9ca3af;">Manage saved searches</a>
    </p>
  </div>`;
}

export async function GET(request: NextRequest) {
  if (!verifyRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const categoryCache = new Map<string, string[]>();

    // Oldest-checked first so every search eventually gets processed even if
    // a run hits the batch limit
    const { data: searches, error } = await supabase
      .from('saved_searches')
      .select('id, user_id, name, query, filters, notify_frequency, last_notified_at, created_at')
      .eq('notify_email', true)
      .order('last_checked_at', { ascending: true, nullsFirst: true })
      .limit(BATCH_SIZE);

    if (error) {
      logger.error('Failed to fetch saved searches', { error });
      return NextResponse.json({ error: 'Failed to fetch saved searches' }, { status: 500 });
    }

    let notified = 0;
    let checked = 0;
    let skipped = 0;

    for (const search of (searches || []) as SavedSearch[]) {
      checked++;

      if (!isDue(search, now)) {
        await supabase
          .from('saved_searches')
          .update({ last_checked_at: nowIso })
          .eq('id', search.id);
        skipped++;
        continue;
      }

      // Only listings created since the last notification (or since the
      // search was saved) — never the whole backlog
      const since = search.last_notified_at || search.created_at;
      const { matches, total } = await findNewMatches(supabase, search, since, categoryCache);

      if (total === 0) {
        await supabase
          .from('saved_searches')
          .update({ last_checked_at: nowIso })
          .eq('id', search.id);
        continue;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', search.user_id)
        .single();

      if (!profile?.email) {
        await supabase
          .from('saved_searches')
          .update({ last_checked_at: nowIso })
          .eq('id', search.id);
        continue;
      }

      try {
        await sendEmail({
          to: profile.email,
          subject: `${total} new match${total === 1 ? '' : 'es'} for "${search.name}" on AXLON`,
          html: buildEmailHtml(search, matches, total, baseUrl),
        });

        await supabase
          .from('saved_searches')
          .update({
            last_notified_at: nowIso,
            last_checked_at: nowIso,
            new_matches_count: total,
          })
          .eq('id', search.id);

        notified++;
      } catch (sendError) {
        // Leave last_notified_at untouched so the next run retries
        logger.error('Saved search alert email failed', { searchId: search.id, error: sendError });
        await supabase
          .from('saved_searches')
          .update({ last_checked_at: nowIso })
          .eq('id', search.id);
      }
    }

    logger.info('Saved search alerts run complete', { checked, notified, skipped });
    return NextResponse.json({ success: true, checked, notified, skipped });
  } catch (error) {
    logger.error('Saved search alerts cron error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

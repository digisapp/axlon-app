import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  translateListings,
  detectLanguage,
  needsTranslation,
  SUPPORTED_LANGUAGES,
  type TranslationLanguage,
} from '@/lib/translate';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

// Each listing triggers an xAI translation call — cap the batch so a single
// request can't multiply AI cost arbitrarily.
const MAX_LISTINGS = 50;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.ai,
      prefix: 'ratelimit:ai-translate',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { listings, listingIds, targetLang } = await request.json();

    const requested = Array.isArray(listingIds) ? listingIds : listings;
    if (!Array.isArray(requested)) {
      return NextResponse.json(
        { error: 'listings array is required' },
        { status: 400 }
      );
    }

    // Caller-supplied title/description are deliberately IGNORED: translations
    // are cached per listing id for 24h and served to every visitor, so
    // trusting client text let anyone overwrite the copy shown for any
    // listing. Only the ids are taken from the request; the text is read from
    // the DB below.
    const ids = Array.from(
      new Set(
        requested
          .map((entry: unknown) =>
            typeof entry === 'string' ? entry : (entry as { id?: unknown } | null)?.id
          )
          .filter((id: unknown): id is string => typeof id === 'string' && UUID_REGEX.test(id))
      )
    );

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'listings array is required' },
        { status: 400 }
      );
    }

    if (ids.length > MAX_LISTINGS) {
      return NextResponse.json(
        { error: `Too many listings; maximum ${MAX_LISTINGS} per request` },
        { status: 400 }
      );
    }

    // Use provided language or detect from header. Unknown codes are rejected
    // so they can't become arbitrary cache keys / prompt content.
    const language: TranslationLanguage =
      typeof targetLang === 'string'
        ? SUPPORTED_LANGUAGES.includes(targetLang as TranslationLanguage)
          ? (targetLang as TranslationLanguage)
          : 'en'
        : detectLanguage(request.headers.get('accept-language') || undefined);

    // Service-role read of public listing copy: only rows that are publicly
    // visible are translatable, and the anon client can't be trusted to tell
    // us what they contain.
    const supabase = createAdminClient();
    const { data: rows, error: lookupError } = await supabase
      .from('listings')
      .select('id, title, description')
      .in('id', ids)
      .eq('status', 'active')
      .is('deleted_at', null);

    if (lookupError) {
      logger.error('Translation listing lookup failed', { error: lookupError });
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }

    const dbListings = (rows || []) as Array<{ id: string; title: string; description: string | null }>;

    // If English, return original listings
    if (!needsTranslation(language)) {
      const result: Record<string, { title: string; description: string }> = {};
      dbListings.forEach((listing) => {
        result[listing.id] = {
          title: listing.title,
          description: listing.description || '',
        };
      });
      return NextResponse.json({ translations: result, language: 'en', fromCache: false });
    }

    // Translate the DB content
    const translations = await translateListings(
      dbListings.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
      })),
      language
    );

    // Convert Map to object for JSON response
    const result: Record<string, { title: string; description: string; fromCache: boolean }> = {};
    let allFromCache = true;

    translations.forEach((value, key) => {
      result[key] = value;
      if (!value.fromCache) allFromCache = false;
    });

    return NextResponse.json({
      translations: result,
      language,
      fromCache: allFromCache,
    });
  } catch (error) {
    logger.error('Translation API error', { error });
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

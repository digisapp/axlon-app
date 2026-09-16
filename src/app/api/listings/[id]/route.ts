import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { estimatePrice } from '@/lib/price-estimator';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateListingSchema } from '@/lib/validations/api';
import { syncListingToCollection, removeListingFromCollection } from '@/lib/ai/listing-sync';
import { cacheDelete, cacheDeletePattern, CACHE_KEYS } from '@/lib/cache';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { PUBLIC_LISTING_COLUMNS } from '@/lib/listings/public-columns';

// GET - Fetch a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      ${PUBLIC_LISTING_COLUMNS}, deleted_at,
      category:categories(id, name, slug),
      images:listing_images(id, url, thumbnail_url, is_primary, sort_order),
      user:profiles!listings_user_id_fkey(id, company_name, phone, email, avatar_url, is_business)
    `)
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Listing fetch error', { id, error: error.message });
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // RLS already hides soft-deleted listings from non-owners/non-admins,
  // but if somehow visible, return 410 Gone so clients know it was deleted
  if ((listing as Record<string, unknown>).deleted_at) {
    return NextResponse.json({ error: 'Listing has been deleted' }, { status: 410 });
  }

  return NextResponse.json({ data: listing });
}

// PUT - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const identifier = getClientIdentifier(request);
  const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.standard, prefix: 'ratelimit:listings-update' });
  if (!rl.success) return rateLimitResponse(rl);

  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify listing ownership and get current data
  const { data: existingListing } = await supabase
    .from('listings')
    .select('user_id, price, ai_price_estimate, deleted_at')
    .eq('id', id)
    .single();

  if (!existingListing || existingListing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (existingListing.deleted_at) {
    return NextResponse.json({ error: 'Listing has been deleted' }, { status: 410 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  let validatedData;
  try {
    validatedData = validateBody(updateListingSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  // Write ONLY the columns the client actually sent. The previous version
  // assigned every core column unconditionally, so a partial update nulled
  // price/make/model/... and an omitted `status` unpublished the listing.
  // ai_price_estimate / ai_price_confidence are absent on purpose: they are
  // computed below from the server's own estimator, never taken from the body
  // (a seller could otherwise fake a "below market value" deal badge).
  const WRITABLE_COLUMNS = [
    'title', 'description', 'price', 'price_type', 'year', 'make', 'model', 'vin',
    'mileage', 'hours', 'condition', 'category_id', 'city', 'state', 'zip_code',
    'stock_number', 'video_url', 'listing_type', 'rental_rate_daily',
    'rental_rate_weekly', 'rental_rate_monthly', 'publish_at', 'unpublish_at',
    'specs', 'status',
  ] as const;

  const validated = validatedData as Record<string, unknown>;
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const column of WRITABLE_COLUMNS) {
    if (body[column] !== undefined) {
      updateData[column] = validated[column] ?? null;
    }
  }
  if (updateData.specs === null) updateData.specs = {};

  // If publishing, stamp published_at (server clock, not client-supplied)
  if (validatedData.status === 'active') {
    updateData.published_at = new Date().toISOString();
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Listing update error', { id, error: error.message });
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }

  // Re-estimate price if price changed or no estimate exists
  const newPrice = validatedData.price ?? null;
  const priceChanged = newPrice !== existingListing.price;
  const needsEstimate = newPrice && newPrice > 0 && (priceChanged || !existingListing.ai_price_estimate);

  if (needsEstimate) {
    try {
      const estimate = await estimatePrice({
        id: listing.id,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        category_id: listing.category_id,
        mileage: listing.mileage,
        condition: listing.condition,
      });

      if (estimate.estimate !== null && estimate.confidence >= 0.3) {
        // Service role: ai_price_* are frozen against owner writes at the DB
        // level (migration 072) so they can only come from this estimator.
        await createAdminClient()
          .from('listings')
          .update({
            ai_price_estimate: estimate.estimate,
            ai_price_confidence: estimate.confidence,
          })
          .eq('id', id);

        // Include estimate in response
        listing.ai_price_estimate = estimate.estimate;
        listing.ai_price_confidence = estimate.confidence;
      }
    } catch (estimateError) {
      logger.error('Price estimate error', { estimateError });
      // Don't fail the request if estimation fails
    }
  }

  // Invalidate cached listing and search results
  await cacheDelete(`${CACHE_KEYS.LISTING}${id}`);
  await cacheDeletePattern(`${CACHE_KEYS.SEARCH}*`);

  // Fire-and-forget: sync to KB collection if active, or remove if no longer active
  if (listing.status === 'active') {
    syncListingToCollection(user.id, id).catch(e =>
      logger.error('KB sync after update failed', { error: e })
    );
  } else {
    removeListingFromCollection(user.id, id).catch(e =>
      logger.error('KB remove after status change failed', { error: e })
    );
  }

  return NextResponse.json({ data: listing });
}

// DELETE - Soft-delete a listing
// Sets deleted_at + status='deleted'; recoverable by admins via restore_listing().
// Hard deletion (storage cleanup) is deferred to a cron/admin action.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const identifier = getClientIdentifier(request);
  const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.standard, prefix: 'ratelimit:listings-delete' });
  if (!rl.success) return rateLimitResponse(rl);

  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify listing ownership (also confirms it isn't already deleted)
  const { data: listing } = await supabase
    .from('listings')
    .select('user_id, deleted_at')
    .eq('id', id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }
  if (listing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (listing.deleted_at) {
    return NextResponse.json({ error: 'Listing already deleted' }, { status: 410 });
  }

  // Soft-delete: mark as deleted rather than removing the row
  const { error } = await supabase
    .from('listings')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
      status: 'deleted',
    })
    .eq('id', id)
    .eq('user_id', user.id); // extra ownership guard at DB level

  if (error) {
    logger.error('Listing soft-delete error', { id, error: error.message });
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }

  // Invalidate caches after confirmed soft-delete
  await cacheDelete(`${CACHE_KEYS.LISTING}${id}`);
  await cacheDeletePattern(`${CACHE_KEYS.SEARCH}*`);

  // Fire-and-forget: remove from KB collection
  removeListingFromCollection(user.id, id).catch(e =>
    logger.error('KB remove after soft-delete failed', { error: e })
  );

  return NextResponse.json({ success: true });
}

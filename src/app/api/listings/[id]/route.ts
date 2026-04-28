import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { estimatePrice } from '@/lib/price-estimator';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateListingSchema } from '@/lib/validations/api';
import { syncListingToCollection, removeListingFromCollection } from '@/lib/ai/listing-sync';
import { cacheDelete, cacheDeletePattern, CACHE_KEYS } from '@/lib/cache';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';

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
      *,
      category:categories(id, name, slug),
      images:listing_images(id, url, thumbnail_url, is_primary, sort_order),
      user:profiles(id, company_name, phone, email, avatar_url, is_business)
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
    .select('user_id, price, ai_price_estimate')
    .eq('id', id)
    .single();

  if (!existingListing || existingListing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();

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

  const updateData: Record<string, unknown> = {
    title: validatedData.title,
    category_id: validatedData.category_id ?? null,
    price: validatedData.price != null ? parseFloat(String(validatedData.price)) : null,
    price_type: validatedData.price_type ?? null,
    condition: validatedData.condition ?? null,
    year: validatedData.year != null ? parseInt(String(validatedData.year)) : null,
    make: validatedData.make ?? null,
    model: validatedData.model ?? null,
    vin: validatedData.vin ?? null,
    mileage: validatedData.mileage != null ? parseInt(String(validatedData.mileage)) : null,
    hours: validatedData.hours != null ? parseInt(String(validatedData.hours)) : null,
    description: validatedData.description ?? null,
    status: validatedData.status,
    updated_at: new Date().toISOString(),
  };

  // Only overwrite these fields when the client explicitly sends them —
  // omitting them from the request body preserves the existing DB values.
  if (body.city !== undefined) updateData.city = validatedData.city ?? null;
  if (body.state !== undefined) updateData.state = validatedData.state ?? null;
  if (body.zip_code !== undefined) updateData.zip_code = validatedData.zip_code ?? null;
  if (body.specs !== undefined) updateData.specs = validatedData.specs ?? {};
  if (body.ai_price_estimate !== undefined) updateData.ai_price_estimate = body.ai_price_estimate ?? null;
  if (body.ai_price_confidence !== undefined) updateData.ai_price_confidence = body.ai_price_confidence ?? null;
  if (body.publish_at !== undefined) updateData.publish_at = body.publish_at ?? null;
  if (body.unpublish_at !== undefined) updateData.unpublish_at = body.unpublish_at ?? null;

  // If publishing for the first time, set published_at
  if (validatedData.status === 'active' && !body.published_at) {
    (updateData as Record<string, unknown>).published_at = new Date().toISOString();
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
  const newPrice = body.price ? parseFloat(body.price) : null;
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
        await supabase
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

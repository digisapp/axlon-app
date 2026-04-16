import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateBody, ValidationError, listingImagesSchema, updateImagesOrderSchema } from '@/lib/validations/api';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

// GET - Fetch images for a listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: images, error } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', id)
    .order('sort_order');

  if (error) {
    logger.error('Images fetch error', { id, error: error.message });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ data: images });
}

// POST - Add images to a listing
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.standard, prefix: 'ratelimit:listing-images' });
    if (!rl.success) return rateLimitResponse(rl);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify listing ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    let validatedData;
    try {
      validatedData = validateBody(listingImagesSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }
    const { images } = validatedData;

    // Get current max sort order
    const { data: existingImages } = await supabase
      .from('listing_images')
      .select('sort_order')
      .eq('listing_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const startOrder = existingImages?.[0]?.sort_order ?? -1;

    const imagesToInsert = images.map((img, index) => ({
      listing_id: id,
      url: img.url,
      thumbnail_url: img.thumbnail_url || null,
      is_primary: img.is_primary || false,
      sort_order: startOrder + index + 1,
      ai_analysis: img.ai_analysis || null,
    }));

    const { data: insertedImages, error } = await supabase
      .from('listing_images')
      .insert(imagesToInsert)
      .select();

    if (error) {
      logger.error('Images insert error', { id, error: error.message });
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    return NextResponse.json({ data: insertedImages });
  } catch (error) {
    logger.error('Images POST error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update image order or primary status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.standard, prefix: 'ratelimit:listing-images' });
    if (!rl.success) return rateLimitResponse(rl);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify listing ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    let validatedOrderData;
    try {
      validatedOrderData = validateBody(updateImagesOrderSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }
    const { images } = validatedOrderData;

    // Update all images in parallel (avoids sequential N+1)
    await Promise.all(
      images
        .filter((img: { id?: string }) => img.id)
        .map((img: { id: string; is_primary?: boolean; sort_order?: number }) =>
          supabase
            .from('listing_images')
            .update({
              is_primary: img.is_primary,
              sort_order: img.sort_order,
            })
            .eq('id', img.id)
            .eq('listing_id', id)
        )
    );

    const { data: updatedImages } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', id)
      .order('sort_order');

    return NextResponse.json({ data: updatedImages });
  } catch (error) {
    logger.error('Images PUT error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.standard, prefix: 'ratelimit:listing-images' });
    if (!rl.success) return rateLimitResponse(rl);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Verify listing ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get image URL before deleting (for storage cleanup)
    const { data: image } = await supabase
      .from('listing_images')
      .select('url')
      .eq('id', imageId)
      .eq('listing_id', id)
      .single();

    // Delete from DB first — if this fails, storage is untouched
    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', imageId)
      .eq('listing_id', id);

    if (error) {
      logger.error('Image delete error', { imageId, error: error.message });
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    // Storage cleanup after confirmed DB delete (fire-and-forget is fine here)
    if (image?.url) {
      const urlParts = image.url.split('/listing-images/');
      if (urlParts[1]) {
        supabase.storage.from('listing-images').remove([urlParts[1]]).catch((e) =>
          logger.error('Image storage delete failed', { imageId, error: e })
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Images DELETE error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

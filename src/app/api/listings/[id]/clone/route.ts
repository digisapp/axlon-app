import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const POST = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('listings') + 1];

  // Get the original listing
  const { data: original, error: fetchError } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(url, thumbnail_url, is_primary, sort_order)
    `)
    .eq('id', id)
    .single();

  if (fetchError || !original) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Verify ownership
  if (original.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized to clone this listing' }, { status: 403 });
  }

  // Create the cloned listing
  const {
    id: _originalId,
    created_at: _createdAt,
    updated_at: _updatedAt,
    views_count: _viewsCount,
    images: originalImages,
    status: _status,
    is_featured: _isFeatured,
    featured_until: _featuredUntil,
    ...listingData
  } = original;

  const { data: clonedListing, error: createError } = await supabase
    .from('listings')
    .insert({
      ...listingData,
      title: `${listingData.title} (Copy)`,
      status: 'draft', // Always start as draft
      views_count: 0,
      is_featured: false,
      featured_until: null,
    })
    .select()
    .single();

  if (createError || !clonedListing) {
    logger.error('Clone error', { createError });
    return NextResponse.json({ error: 'Failed to clone listing' }, { status: 500 });
  }

  // Clone images if any exist
  if (originalImages && originalImages.length > 0) {
    const imageInserts = originalImages.map((img: {
      url: string;
      thumbnail_url?: string;
      is_primary: boolean;
      sort_order: number;
    }) => ({
      listing_id: clonedListing.id,
      url: img.url,
      thumbnail_url: img.thumbnail_url,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }));

    await supabase.from('listing_images').insert(imageInserts);
  }

  // Clone industry associations
  const { data: industries } = await supabase
    .from('listing_industries')
    .select('industry_id')
    .eq('listing_id', id);

  if (industries && industries.length > 0) {
    const industryInserts = industries.map((i) => ({
      listing_id: clonedListing.id,
      industry_id: i.industry_id,
    }));

    await supabase.from('listing_industries').insert(industryInserts);
  }

  return NextResponse.json({
    data: clonedListing,
    message: 'Listing cloned successfully',
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:listings' } });

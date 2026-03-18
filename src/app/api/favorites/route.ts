import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { validateBody, ValidationError, favoriteSchema } from '@/lib/validations/api';

const rateLimitConfig = { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:favorites' } };

// GET - Fetch user's favorites
export const GET = withAuth(async (request, { user, supabase }) => {
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      created_at,
      listing:listings(
        id, title, price, price_type, condition, year, make, model,
        city, state, status, views_count, created_at,
        images:listing_images(id, url, thumbnail_url, is_primary)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  // Filter out any listings that no longer exist
  const validFavorites = favorites?.filter((f) => f.listing) || [];

  return NextResponse.json({ data: validFavorites });
}, rateLimitConfig);

// POST - Add a favorite
export const POST = withAuth(async (request, { user, supabase }) => {
  const body = await request.json();
  let validatedData;
  try {
    validatedData = validateBody(favoriteSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }
  const { listing_id } = validatedData;

  // Check if listing exists and is active
  const { data: listing } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listing_id)
    .eq('status', 'active')
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', user.id)
    .eq('listing_id', listing_id)
    .single();

  if (existing) {
    return NextResponse.json({ data: { already_exists: true } });
  }

  // Add favorite
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      listing_id,
    });

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ data: { success: true } });
}, rateLimitConfig);

// DELETE - Remove a favorite
export const DELETE = withAuth(async (request, { user, supabase }) => {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listing_id');

  if (!listingId) {
    return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId);

  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json({ data: { success: true } });
}, rateLimitConfig);

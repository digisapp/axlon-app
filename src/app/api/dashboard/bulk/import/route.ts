import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, createListingSchema } from '@/lib/validations/api';

export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'bulkImport');
  if (gateError) return gateError;

  const body = await request.json();

  let validatedData;
  try {
    validatedData = validateBody(createListingSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  const {
    title,
    price,
    condition,
    year,
    make,
    model,
    mileage,
    hours,
    vin,
    description,
    city,
    state,
    stock_number,
  } = validatedData;
  const category = typeof body.category === 'string' ? body.category.trim() : '';

  // acquisition_cost is not in createListingSchema; it was written straight
  // from the body, so a smart-import row like "$12,500" hit the DECIMAL column
  // and 500'd the whole row. Coerce it the same way the schema coerces price.
  let acquisition_cost: number | null = null;
  if (body.acquisition_cost !== undefined && body.acquisition_cost !== null && body.acquisition_cost !== '') {
    const n = typeof body.acquisition_cost === 'number'
      ? body.acquisition_cost
      : Number(String(body.acquisition_cost).replace(/[$,\s]/g, ''));
    if (!Number.isFinite(n) || n < 0 || n > 100000000) {
      return NextResponse.json(
        { error: 'Validation failed', details: [{ field: 'acquisition_cost', message: 'Invalid acquisition cost' }] },
        { status: 400 }
      );
    }
    acquisition_cost = n;
  }

  // Validate category is provided
  if (!category) {
    return NextResponse.json(
      { error: 'Category is required' },
      { status: 400 }
    );
  }

  // Get category ID from slug
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category)
    .maybeSingle();

  if (!categoryData) {
    return NextResponse.json(
      { error: `Category not found: ${category}` },
      { status: 400 }
    );
  }

  // Create the listing
  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      category_id: categoryData.id,
      title,
      price,
      condition,
      year,
      make,
      model,
      mileage,
      hours,
      vin,
      description,
      city,
      state,
      stock_number,
      acquisition_cost,
      status: 'draft', // Start as draft so user can review
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating listing', { error });
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }

  return NextResponse.json(listing, { status: 201 });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dashboard-bulk' } });

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, createListingSchema } from '@/lib/validations/api';

export const POST = withAuth(async (request, { user, supabase }) => {
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
    vin,
    description,
  } = validatedData;
  const category = body.category;
  const city = body.city;
  const state = body.state;
  const stock_number = body.stock_number;
  const acquisition_cost = body.acquisition_cost;

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
    .single();

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

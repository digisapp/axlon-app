/**
 * Columns of `listings` that are safe to return on public, unauthenticated
 * surfaces (/api/listings, /api/deals, storefronts, listing detail).
 *
 * `select('*')` on listings leaks dealer-internal fields to anyone with the
 * anon key: acquisition_cost / acquired_date (the dealer's cost basis and
 * margin), lot_location, scrape provenance (source_url / source_listing_id /
 * source_dealer_id), publish scheduling, soft-delete audit columns, and the
 * `search_vector` tsvector — which alone roughly doubled the search payload.
 *
 * Kept as a single string literal (not a joined array) so supabase-js's
 * compile-time select parser can still type the interpolated query.
 * Keep this list in sync with the public shape of `Listing` in src/types.
 */
export const PUBLIC_LISTING_COLUMNS =
  'id, user_id, category_id, title, description, price, price_type, condition, year, make, model, vin, mileage, hours, specs, city, state, zip_code, country, ai_price_estimate, ai_price_confidence, ai_description, ai_tags, status, is_featured, featured_until, views_count, created_at, updated_at, published_at, stock_number, quantity, video_url, axle_count, axle_configuration, gvwr, gawr_front, gawr_rear, payload_capacity, kingpin_weight, wheelbase, listing_type, ai_video_preview_url, ai_video_status' as const;

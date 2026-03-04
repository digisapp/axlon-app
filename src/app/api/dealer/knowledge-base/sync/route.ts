import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncAllListings, syncListingToCollection } from '@/lib/ai/listing-sync';
import { kbSyncSchema, validateBody, ValidationError } from '@/lib/validations/api';
import { checkRateLimit, getClientIdentifier, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

// POST - Manual sync (full or single listing)
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(identifier, {
    limit: 5,
    windowSeconds: 300, // 5 minutes
    prefix: 'ratelimit:kb-sync',
  });
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_dealer')
    .eq('id', user.id)
    .single();

  if (!profile?.is_dealer) {
    return NextResponse.json({ error: 'Dealer access required' }, { status: 403 });
  }

  // Verify KB is active
  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id, xai_collection_status, knowledge_base_enabled')
    .eq('dealer_id', user.id)
    .single();

  if (!settings?.knowledge_base_enabled || settings.xai_collection_status !== 'active') {
    return NextResponse.json({ error: 'Knowledge base not active' }, { status: 400 });
  }

  const body = await request.json();
  let validated;
  try {
    validated = validateBody(kbSyncSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    throw err;
  }

  if (validated.listing_id) {
    // Single listing sync
    try {
      await syncListingToCollection(user.id, validated.listing_id);
      return NextResponse.json({ message: 'Listing synced' });
    } catch (error) {
      logger.error('Single listing sync failed', { error, listingId: validated.listing_id });
      return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
  }

  // Full sync - fire and forget since it can be slow
  syncAllListings(user.id)
    .then(result => logger.info('Manual full sync completed', { dealerId: user.id, ...result }))
    .catch(e => logger.error('Manual full sync failed', { error: e, dealerId: user.id }));

  return NextResponse.json({ message: 'Full sync started' });
}

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { syncAllListings, syncListingToCollection } from '@/lib/ai/listing-sync';
import { kbSyncSchema, validateBody, ValidationError } from '@/lib/validations/api';
import { logger } from '@/lib/logger';
import { enforceFeature } from '@/lib/entitlements';

// POST - Manual sync (full or single listing)
export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiAssistant');
  if (gateError) return gateError;

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
    await syncListingToCollection(user.id, validated.listing_id);
    return NextResponse.json({ message: 'Listing synced' });
  }

  // Full sync - fire and forget since it can be slow
  syncAllListings(user.id)
    .then(result => logger.info('Manual full sync completed', { dealerId: user.id, ...result }))
    .catch(e => logger.error('Manual full sync failed', { error: e, dealerId: user.id }));

  return NextResponse.json({ message: 'Full sync started' });
}, { rateLimit: { limit: 5, windowSeconds: 300, prefix: 'ratelimit:kb-sync' } });

import { formatListingForCollection, computeContentHash } from './listing-formatter';
import { uploadFileToCollection, deleteFileFromCollection } from './collections';
import { logger } from '@/lib/logger';
import { createAdminClient } from '@/lib/supabase/admin';

function getServiceClient() {
  return createAdminClient();
}

/**
 * Sync a single listing to the dealer's xAI collection.
 * Skips upload if the content hash hasn't changed.
 */
export async function syncListingToCollection(
  dealerId: string,
  listingId: string
): Promise<void> {
  const supabase = getServiceClient();

  // Get dealer's collection ID
  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id, xai_collection_status, knowledge_base_enabled')
    .eq('dealer_id', dealerId)
    .single();

  if (!settings?.knowledge_base_enabled || settings.xai_collection_status !== 'active' || !settings.xai_collection_id) {
    return; // KB not active, skip silently
  }

  const collectionId = settings.xai_collection_id;

  // Fetch the listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select(`
      id, title, price, year, make, model, condition, city, state,
      mileage, hours, description, specs,
      category:categories!left(name)
    `)
    .eq('id', listingId)
    .eq('user_id', dealerId)
    .eq('status', 'active')
    .single();

  if (listingError || !listing) {
    logger.warn('Listing not found for KB sync', { dealerId, listingId });
    return;
  }

  // Format and hash
  const categoryRow = Array.isArray(listing.category) ? listing.category[0] : listing.category;
  const content = formatListingForCollection({
    ...listing,
    category_name: categoryRow?.name ?? null,
  });
  const hash = computeContentHash(content);

  // Check existing doc
  const { data: existing } = await supabase
    .from('dealer_kb_listing_docs')
    .select('id, xai_file_id, content_hash')
    .eq('dealer_id', dealerId)
    .eq('listing_id', listingId)
    .single();

  // Skip if content unchanged
  if (existing && existing.content_hash === hash) {
    return;
  }

  try {
    // Delete old file if exists
    if (existing?.xai_file_id) {
      try {
        await deleteFileFromCollection(collectionId, existing.xai_file_id);
      } catch (e) {
        logger.warn('Failed to delete old KB listing doc', { error: e, fileId: existing.xai_file_id });
      }
    }

    // Upload new version
    const filename = `listing-${listingId}.md`;
    const { file_id } = await uploadFileToCollection(collectionId, content, filename, 'text/markdown');

    // Upsert tracking row
    await supabase
      .from('dealer_kb_listing_docs')
      .upsert({
        dealer_id: dealerId,
        listing_id: listingId,
        xai_file_id: file_id,
        content_hash: hash,
        last_synced_at: new Date().toISOString(),
        sync_status: 'synced',
        sync_error: null,
      }, { onConflict: 'dealer_id,listing_id' });

    logger.info('KB listing synced', { dealerId, listingId, fileId: file_id });
  } catch (error) {
    logger.error('KB listing sync failed', { dealerId, listingId, error });

    // Record error
    if (existing) {
      await supabase
        .from('dealer_kb_listing_docs')
        .update({
          sync_status: 'error',
          sync_error: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', existing.id);
    }
  }
}

/**
 * Remove a listing from the dealer's xAI collection.
 */
export async function removeListingFromCollection(
  dealerId: string,
  listingId: string
): Promise<void> {
  const supabase = getServiceClient();

  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id, xai_collection_status, knowledge_base_enabled')
    .eq('dealer_id', dealerId)
    .single();

  if (!settings?.xai_collection_id) return;

  const { data: doc } = await supabase
    .from('dealer_kb_listing_docs')
    .select('id, xai_file_id')
    .eq('dealer_id', dealerId)
    .eq('listing_id', listingId)
    .single();

  if (!doc) return;

  try {
    if (doc.xai_file_id) {
      await deleteFileFromCollection(settings.xai_collection_id, doc.xai_file_id);
    }
  } catch (error) {
    logger.warn('Failed to delete KB listing from xAI', { error, listingId });
  }

  await supabase
    .from('dealer_kb_listing_docs')
    .delete()
    .eq('id', doc.id);

  logger.info('KB listing removed', { dealerId, listingId });
}

/**
 * Full sync: uploads all active listings for a dealer.
 * Processes sequentially to avoid rate limits.
 */
export async function syncAllListings(dealerId: string): Promise<{ synced: number; errors: number }> {
  const supabase = getServiceClient();

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id')
    .eq('user_id', dealerId)
    .eq('status', 'active');

  if (error || !listings) {
    logger.error('Failed to fetch listings for full sync', { dealerId, error });
    return { synced: 0, errors: 0 };
  }

  let synced = 0;
  let errors = 0;

  for (const listing of listings) {
    try {
      await syncListingToCollection(dealerId, listing.id);
      synced++;
    } catch (e) {
      errors++;
      logger.error('Failed to sync listing in full sync', { dealerId, listingId: listing.id, error: e });
    }
  }

  logger.info('Full KB sync completed', { dealerId, synced, errors, total: listings.length });
  return { synced, errors };
}

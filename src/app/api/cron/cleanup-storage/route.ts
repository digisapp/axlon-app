import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

const RETENTION_DAYS = 30;

function verifyRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  if (process.env.VERCEL && request.headers.get('x-vercel-cron') === '1') return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let totalDeleted = 0;
  let totalErrors = 0;

  try {
    // Find soft-deleted listings older than the retention window
    const { data: staleListing, error: fetchError } = await supabase
      .from('listings')
      .select('id')
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoff)
      .limit(100); // process in batches to stay within function timeout

    if (fetchError) {
      logger.error('Cleanup cron: failed to fetch stale listings', { error: fetchError });
      return NextResponse.json({ error: 'Failed to fetch stale listings' }, { status: 500 });
    }

    if (!staleListing || staleListing.length === 0) {
      logger.info('Cleanup cron: no stale listings to clean up');
      return NextResponse.json({ success: true, deleted: 0, errors: 0 });
    }

    const listingIds = staleListing.map(l => l.id);

    // For each listing, delete its storage files then hard-delete the DB row
    for (const listingId of listingIds) {
      try {
        // Fetch all image records for this listing
        const { data: images } = await supabase
          .from('listing_images')
          .select('url')
          .eq('listing_id', listingId);

        // Extract storage paths from URLs and delete from storage
        if (images && images.length > 0) {
          const storagePaths = images
            .map(img => {
              try {
                const url = new URL(img.url);
                // Supabase storage URLs are: /storage/v1/object/public/<bucket>/<path>
                const match = url.pathname.match(/\/storage\/v1\/object\/public\/listing-images\/(.+)/);
                return match ? match[1] : null;
              } catch {
                return null;
              }
            })
            .filter((p): p is string => p !== null);

          if (storagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
              .from('listing-images')
              .remove(storagePaths);

            if (storageError) {
              logger.warn('Cleanup cron: storage delete partial failure', { listingId, error: storageError });
            }
          }
        }

        // Hard-delete the listing row (cascades to listing_images, listing_views, etc.)
        const { error: deleteError } = await supabase
          .from('listings')
          .delete()
          .eq('id', listingId)
          .not('deleted_at', 'is', null); // safety: only hard-delete soft-deleted rows

        if (deleteError) {
          logger.error('Cleanup cron: hard delete failed', { listingId, error: deleteError });
          totalErrors++;
        } else {
          totalDeleted++;
        }
      } catch (err) {
        logger.error('Cleanup cron: error processing listing', { listingId, error: err });
        totalErrors++;
      }
    }

    logger.info('Cleanup cron: complete', { totalDeleted, totalErrors, cutoff });
    return NextResponse.json({ success: true, deleted: totalDeleted, errors: totalErrors });
  } catch (err) {
    logger.error('Cleanup cron: unexpected error', { error: err });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

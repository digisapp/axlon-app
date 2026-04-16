import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkIsAdmin, logAdminAction } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { cacheDelete, cacheDeletePattern, CACHE_KEYS } from '@/lib/cache';
import { removeListingFromCollection } from '@/lib/ai/listing-sync';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { requireCsrf } from '@/lib/security/csrf';

const actionSchema = z.object({
  action: z.enum(['restore', 'hard_delete']),
});

// PATCH /api/admin/listings/[id]
// action=restore    → clear deleted_at, set status=draft
// action=hard_delete → permanently delete row + storage images
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-listings',
    });
    if (!rl.success) return rateLimitResponse(rl);

    const { id } = await params;
    const { isAdmin, userId } = await checkIsAdmin();
    if (!isAdmin || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const body = await request.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    const { action } = parsed.data;

    const supabase = await createClient();

    // Fetch current listing state (RLS: admin can see soft-deleted)
    const { data: listing, error: fetchErr } = await supabase
      .from('listings')
      .select('id, title, user_id, deleted_at, status')
      .eq('id', id)
      .single();

    if (fetchErr || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (action === 'restore') {
      if (!listing.deleted_at) {
        return NextResponse.json({ error: 'Listing is not deleted' }, { status: 400 });
      }

      const { error } = await supabase
        .from('listings')
        .update({ deleted_at: null, deleted_by: null, status: 'draft' })
        .eq('id', id);

      if (error) {
        logger.error('Admin restore listing error', { id, error: error.message });
        return NextResponse.json({ error: 'Failed to restore listing' }, { status: 500 });
      }

      await cacheDelete(`${CACHE_KEYS.LISTING}${id}`);
      await cacheDeletePattern(`${CACHE_KEYS.SEARCH}*`);

      await logAdminAction(userId, 'restore_listing', 'listing', id, {
        title: listing.title,
        owner_id: listing.user_id,
      });

      return NextResponse.json({ success: true, message: 'Listing restored to draft' });
    }

    // hard_delete — permanent, with storage cleanup
    if (action === 'hard_delete') {
      // Use admin client to bypass RLS on already-soft-deleted rows
      const adminSupabase = createAdminClient();

      // Collect image paths before deleting
      const { data: images } = await adminSupabase
        .from('listing_images')
        .select('url')
        .eq('listing_id', id);

      // Delete storage files
      if (images && images.length > 0) {
        const paths = images
          .map((img) => img.url.split('/listing-images/')[1])
          .filter(Boolean);
        if (paths.length > 0) {
          await adminSupabase.storage.from('listing-images').remove(paths);
        }
      }

      // Hard-delete the row (cascade removes images, favorites, etc.)
      const { error } = await adminSupabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Admin hard-delete listing error', { id, error: error.message });
        return NextResponse.json({ error: 'Failed to permanently delete listing' }, { status: 500 });
      }

      await cacheDelete(`${CACHE_KEYS.LISTING}${id}`);
      await cacheDeletePattern(`${CACHE_KEYS.SEARCH}*`);

      // Remove from KB collection
      removeListingFromCollection(listing.user_id, id).catch((e) =>
        logger.error('KB remove after hard-delete failed', { error: e })
      );

      await logAdminAction(userId, 'hard_delete_listing', 'listing', id, {
        title: listing.title,
        owner_id: listing.user_id,
        images_deleted: images?.length ?? 0,
      });

      return NextResponse.json({ success: true, message: 'Listing permanently deleted' });
    }
  } catch (error) {
    logger.error('Admin listing action error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

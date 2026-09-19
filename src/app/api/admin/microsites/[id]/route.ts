import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { MICROSITES_CACHE_TAG } from '@/lib/microsites/resolve';
import { checkIsAdmin, logAdminAction } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';

const nullableText = (max: number) => z.string().trim().max(max).nullish();

/**
 * hero_image_url is rendered through next/image, whose remotePatterns allow
 * Supabase storage only. Anything else renders as a broken image at best, so
 * reject it here rather than storing a URL that can never display.
 */
const heroUrl = z
  .string()
  .trim()
  .max(1000)
  .nullish()
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
    } catch {
      return false;
    }
  }, 'Hero image must be an https URL on Supabase storage');

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  status: z.enum(['draft', 'live', 'paused']).optional(),
  manufacturer_id: z.string().uuid().nullish(),
  product_type: nullableText(60),
  listing_make: nullableText(120),
  listing_category_slugs: z
    .array(
      z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Category must be a slug like tag-trailers')
    )
    .max(20)
    .nullish()
    // The DB CHECK rejects an empty array, and an empty array would inner-join
    // to nothing and silently empty the grid. "None selected" means no filter.
    .transform((value) => (value && value.length > 0 ? value : null)),
  show_listings: z.boolean().optional(),
  headline: nullableText(200),
  subheadline: nullableText(500),
  hero_image_url: heroUrl,
  accent_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Accent colour must be a hex value like #1d4ed8')
    .optional(),
  cta_label: z.string().trim().min(1).max(40).optional(),
  phone: nullableText(30),
  disclaimer: nullableText(1000),
  lead_recipient_email: z.string().trim().email().max(200).nullish().or(z.literal(null)),
  meta_title: nullableText(200),
  meta_description: nullableText(400),
  notes: nullableText(2000),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin-microsites',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { isAdmin, userId } = await checkIsAdmin();
    if (!isAdmin || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: 'Invalid microsite id' }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    // Drop keys the client didn't send so a partial form can't blank columns it
    // doesn't render. `null` is a real value here (clear the field) and is kept.
    const updates = Object.fromEntries(
      Object.entries(parsed.data).filter(([, value]) => value !== undefined)
    );
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('microsites')
      .update(updates)
      .eq('id', id)
      .select('id, domain, status')
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Microsite not found' }, { status: 404 });

    await logAdminAction(userId, 'update', 'microsite', id, { fields: Object.keys(updates) });

    // The pages themselves render per request, but the catalog and listing
    // reads sit in the data cache behind a TTL. Drop them so an edit is
    // visible on the next request instead of up to ten minutes later.
    // Next 16 requires a cache-life profile; `{ expire: 0 }` is the explicit
    // "purge now". A bare revalidateTag(tag) still purges but logs a
    // deprecation warning on every admin save.
    revalidateTag(MICROSITES_CACHE_TAG, { expire: 0 });
    revalidatePath(`/sites/${data.domain}`, 'layout');

    return NextResponse.json({ success: true, microsite: data });
  } catch (error) {
    logger.error('Admin microsite update error', { error });
    return NextResponse.json({ error: 'Failed to update microsite' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { isAdmin, userId } = await checkIsAdmin();
    if (!isAdmin || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: 'Invalid microsite id' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Leads outlive the site that captured them (leads.microsite_id is ON
    // DELETE SET NULL), but deleting a site that has produced leads silently
    // orphans their attribution. Refuse and let the admin pause it instead.
    const { count } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('microsite_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `This microsite has ${count} lead${count === 1 ? '' : 's'} attributed to it. Set its status to paused instead of deleting it.`,
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('microsites')
      .delete()
      .eq('id', id)
      .select('id, domain')
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Microsite not found' }, { status: 404 });

    await logAdminAction(userId, 'delete', 'microsite', id, { domain: data.domain });

    revalidateTag(MICROSITES_CACHE_TAG, { expire: 0 });
    revalidatePath(`/sites/${data.domain}`, 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Admin microsite delete error', { error });
    return NextResponse.json({ error: 'Failed to delete microsite' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/auth/with-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyClaimToken } from '@/lib/claims/token';
import { isReservedSlug } from '@/lib/reserved-slugs';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

const bodySchema = z.object({
  sourceId: z.string().uuid(),
  token: z.string().min(20).max(80),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * POST /api/dealer/claim — attach the inventory scraped from a dealer's site
 * to the signed-in account.
 *
 * Authorization is the claim token: an HMAC of the dealer_sources id that we
 * only ever send to the dealer's own contact address. A source can be
 * claimed once; the claimant becomes the owner of every listing tagged with
 * that source, the profile is promoted to a business account (filled in
 * from the source record where empty) and given a storefront slug.
 */
export const POST = withAuth(
  async (request: NextRequest, { user }) => {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { sourceId, token } = parsed.data;

    if (!verifyClaimToken(sourceId, token)) {
      return NextResponse.json({ error: 'This claim link is not valid' }, { status: 403 });
    }

    // Writes touch rows owned by the admin account and privileged profile
    // columns (is_business is frozen for non-service-role updates), so the
    // service-role client is required after the checks above.
    const admin = createAdminClient();

    const { data: source } = await admin
      .from('dealer_sources')
      .select('id, name, website, contact_phone, contact_email, location_city, location_state, claimed_by, claimed_at')
      .eq('id', sourceId)
      .single();
    if (!source) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }
    if (source.claimed_by && source.claimed_by !== user.id) {
      return NextResponse.json({ error: 'This inventory has already been claimed by another account' }, { status: 409 });
    }

    // Take the claim atomically BEFORE moving anything: the guard on
    // claimed_by IS NULL means two accounts racing on the same link can't
    // both win, and a failure here leaves no half-transferred inventory.
    if (!source.claimed_by) {
      const { data: taken, error: claimError } = await admin
        .from('dealer_sources')
        .update({ claimed_by: user.id, claimed_at: new Date().toISOString() })
        .eq('id', sourceId)
        .is('claimed_by', null)
        .select('id');
      if (claimError) {
        logger.error('Claim: could not record claim', { userId: user.id, sourceId, error: claimError.message });
        return NextResponse.json({ error: 'Claiming is temporarily unavailable. Please try again shortly.' }, { status: 503 });
      }
      if (!taken || taken.length === 0) {
        return NextResponse.json({ error: 'This inventory has already been claimed by another account' }, { status: 409 });
      }
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('id, company_name, slug, website, phone, city, state, is_business')
      .eq('id', user.id)
      .single();

    // Storefront handle: keep an existing one, otherwise derive from the
    // dealer name and make it unique
    let slug = profile?.slug || null;
    if (!slug) {
      const base = slugify(source.name) || `dealer-${user.id.slice(0, 8)}`;
      let candidate = isReservedSlug(base) ? `${base}-dealer` : base;
      for (let i = 2; i < 50; i++) {
        const { data: taken } = await admin.from('profiles').select('id').eq('slug', candidate).neq('id', user.id).maybeSingle();
        if (!taken) break;
        candidate = `${base}-${i}`;
      }
      slug = candidate;
    }

    const { error: profileError } = await admin
      .from('profiles')
      .update({
        is_business: true,
        slug,
        company_name: profile?.company_name || source.name,
        website: profile?.website || source.website || null,
        phone: profile?.phone || source.contact_phone || null,
        city: profile?.city || source.location_city || null,
        state: profile?.state || source.location_state || null,
      })
      .eq('id', user.id);
    if (profileError) {
      logger.error('Claim: profile update failed', { userId: user.id, sourceId, error: profileError.message });
      return NextResponse.json({ error: 'Could not update your account' }, { status: 500 });
    }

    const { data: moved, error: moveError } = await admin
      .from('listings')
      .update({ user_id: user.id })
      .eq('source_dealer_id', sourceId)
      .neq('user_id', user.id)
      .select('id');
    if (moveError) {
      logger.error('Claim: listing transfer failed', { userId: user.id, sourceId, error: moveError.message });
      return NextResponse.json({ error: 'Could not transfer the listings' }, { status: 500 });
    }

    logger.info('Dealer claimed scraped inventory', { userId: user.id, sourceId, moved: moved?.length ?? 0 });
    return NextResponse.json({ claimed: moved?.length ?? 0, slug, dealerName: source.name });
  },
  { rateLimit: { ...RATE_LIMITS.auth, prefix: 'ratelimit:dealer-claim' } }
);

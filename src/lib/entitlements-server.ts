import { createAdminClient } from '@/lib/supabase/admin';
import {
  getEffectiveTier,
  isFeatureUnlocked,
  type FeatureKey,
  type PlanTier,
} from '@/lib/plans';

/**
 * Entitlement checks for paths that have no session client to read the profile
 * with — the public storefront chat widget and the cron jobs. src/lib/entitlements.ts
 * covers the authenticated dashboard routes; this module covers everything that
 * has to look a *dealer* up by id, which RLS on `profiles` would otherwise hide.
 *
 * Semantics match requireFeature(): free accounts inside their 30-day trial are
 * treated as 'pro' (getEffectiveTier) and admins bypass all gates.
 */

export interface ProfileTierRow {
  subscription_tier?: string | null;
  created_at?: string | null;
  is_admin?: boolean | null;
}

/** Effective tier for an already-loaded profile row (no extra query). */
export function effectiveTierForProfile(profile: ProfileTierRow | null | undefined): PlanTier {
  if (!profile) return 'free';
  if (profile.is_admin) return 'enterprise'; // admins bypass all gates
  return getEffectiveTier(profile.subscription_tier, profile.created_at);
}

/** Whether an already-loaded profile row unlocks `feature`. */
export function profileHasFeature(
  profile: ProfileTierRow | null | undefined,
  feature: FeatureKey
): boolean {
  return isFeatureUnlocked(feature, effectiveTierForProfile(profile));
}

/** Effective tier for a dealer id. Service role: RLS hides other dealers' profiles. */
export async function getDealerEffectiveTier(dealerId: string): Promise<PlanTier> {
  const { data: profile } = await createAdminClient()
    .from('profiles')
    .select('subscription_tier, created_at, is_admin')
    .eq('id', dealerId)
    .maybeSingle();

  return effectiveTierForProfile(profile);
}

/** Whether a dealer's effective tier unlocks `feature`. */
export async function dealerHasFeature(dealerId: string, feature: FeatureKey): Promise<boolean> {
  return isFeatureUnlocked(feature, await getDealerEffectiveTier(dealerId));
}

/**
 * Batch form for cron jobs: the subset of `dealerIds` whose effective tier
 * unlocks `feature`, in one query instead of one per dealer.
 */
export async function filterDealersWithFeature(
  dealerIds: string[],
  feature: FeatureKey
): Promise<Set<string>> {
  const unique = Array.from(new Set(dealerIds));
  if (unique.length === 0) return new Set();

  const { data: profiles } = await createAdminClient()
    .from('profiles')
    .select('id, subscription_tier, created_at, is_admin')
    .in('id', unique);

  const allowed = new Set<string>();
  for (const profile of (profiles ?? []) as (ProfileTierRow & { id: string })[]) {
    if (profileHasFeature(profile, feature)) allowed.add(profile.id);
  }
  return allowed;
}

import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getEffectiveTier,
  isFeatureUnlocked,
  type FeatureKey,
  type PlanTier,
} from '@/lib/plans';

export interface FeatureCheckResult {
  allowed: boolean;
  tier: PlanTier;
}

/**
 * Server-side plan entitlement check for API routes.
 *
 * Mirrors the exact semantics of <FeatureGate> (src/components/dashboard/FeatureGate.tsx):
 * - Admins bypass all gates.
 * - Free accounts within their 30-day trial are treated as 'pro' (getEffectiveTier).
 *
 * Use this in any API route whose corresponding dashboard area is wrapped in
 * <FeatureGate> — UI gating alone is not enforcement.
 */
export async function requireFeature(
  supabase: SupabaseClient,
  userId: string,
  feature: FeatureKey
): Promise<FeatureCheckResult> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, created_at, is_admin')
    .eq('id', userId)
    .single();

  const tier = getEffectiveTier(profile?.subscription_tier, profile?.created_at);

  if (profile?.is_admin) {
    return { allowed: true, tier };
  }

  return { allowed: isFeatureUnlocked(feature, tier), tier };
}

/** Machine-readable 403 the frontend can key off of to show an upgrade prompt. */
export function upgradeRequiredResponse(feature: FeatureKey): NextResponse {
  return NextResponse.json(
    { error: 'upgrade_required', feature },
    { status: 403 }
  );
}

/**
 * Convenience wrapper: returns a 403 upgrade_required response if the user's
 * plan does not unlock the feature, or null if the request may proceed.
 *
 *   const gateError = await enforceFeature(supabase, user.id, 'dealDesk');
 *   if (gateError) return gateError;
 */
export async function enforceFeature(
  supabase: SupabaseClient,
  userId: string,
  feature: FeatureKey
): Promise<NextResponse | null> {
  const { allowed } = await requireFeature(supabase, userId, feature);
  return allowed ? null : upgradeRequiredResponse(feature);
}

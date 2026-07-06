import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getEffectiveTier, isFeatureUnlocked, type FeatureKey } from '@/lib/plans';
import { UpgradePrompt } from './UpgradePrompt';

/**
 * Server-side plan gate. Wrap a dashboard route's layout with this to keep
 * paid features locked for free accounts (after their 30-day trial expires).
 */
export async function FeatureGate({
  feature,
  children,
}: {
  feature: FeatureKey;
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, created_at, is_admin')
    .eq('id', user.id)
    .single();

  if (profile?.is_admin) {
    return <>{children}</>;
  }

  const effectiveTier = getEffectiveTier(profile?.subscription_tier, profile?.created_at);

  if (!isFeatureUnlocked(feature, effectiveTier)) {
    return <UpgradePrompt feature={feature} />;
  }

  return <>{children}</>;
}

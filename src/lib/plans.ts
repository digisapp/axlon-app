// Subscription plan configuration
export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  listings: number;          // -1 = unlimited
  aiPriceEstimates: number;  // per month, -1 = unlimited
  featuredListings: number;  // per month
  aiAssistant: boolean;
  advancedAnalytics: boolean;
  customStorefront: boolean;
  bulkImport: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    listings: -1, // unlimited — marketplace is genuinely free
    aiPriceEstimates: 10,
    featuredListings: 0,
    aiAssistant: false,
    advancedAnalytics: false,
    customStorefront: false,
    bulkImport: false,
  },
  pro: {
    listings: -1,
    aiPriceEstimates: -1,
    featuredListings: 5,
    aiAssistant: true,
    advancedAnalytics: true,
    customStorefront: true,
    bulkImport: true,
  },
  enterprise: {
    listings: -1,
    aiPriceEstimates: -1,
    featuredListings: -1,
    aiAssistant: true,
    advancedAnalytics: true,
    customStorefront: true,
    bulkImport: true,
  },
};

export const PLAN_PRICES = {
  free: 0,
  pro: 499,           // Platform — replaces Salesforce + DMS + answering service
  voice_addon: 299,   // Voice Agent add-on
  bundle: 699,        // Platform + Voice bundle (save $99/mo)
  enterprise: null,   // AI Transformation — custom
} as const;

export function getPlanLimits(tier: string | null | undefined): PlanLimits {
  const validTier = (tier && tier in PLAN_LIMITS) ? tier as PlanTier : 'free';
  return PLAN_LIMITS[validTier];
}

export function canCreateListing(currentCount: number, tier: string | null | undefined): boolean {
  const limits = getPlanLimits(tier);
  return limits.listings === -1 || currentCount < limits.listings;
}

export function canUseFeature(
  feature: keyof Omit<PlanLimits, 'listings' | 'aiPriceEstimates' | 'featuredListings'>,
  tier: string | null | undefined
): boolean {
  const limits = getPlanLimits(tier);
  return limits[feature];
}

export function getRemainingListings(currentCount: number, tier: string | null | undefined): number | null {
  const limits = getPlanLimits(tier);
  if (limits.listings === -1) return null;
  return Math.max(0, limits.listings - currentCount);
}

// ---------------------------------------------------------------------------
// Feature entitlements — which dashboard features require a paid plan.
// Free accounts get full access during their 30-day trial (getEffectiveTier),
// then paid features lock until they upgrade.
// ---------------------------------------------------------------------------

export const TRIAL_DAYS = 30;

export type FeatureKey =
  | 'aiInbox'
  | 'aiAssistant'
  | 'voiceAgent'
  | 'crm'
  | 'dealDesk'
  | 'floorPlan'
  | 'marketIntel'
  | 'bulkImport';

export interface FeatureInfo {
  label: string;
  description: string;
  requiredTier: Exclude<PlanTier, 'free'>;
}

export const FEATURE_INFO: Record<FeatureKey, FeatureInfo> = {
  aiInbox: {
    label: 'AI Inbox',
    description: 'AI drafts a response to every lead within seconds — you review, approve, and send.',
    requiredTier: 'pro',
  },
  aiAssistant: {
    label: 'AI Sales Assistant',
    description: 'A 24/7 AI assistant on your storefront that answers buyers and captures qualified leads.',
    requiredTier: 'pro',
  },
  voiceAgent: {
    label: 'Voice Agent',
    description: 'A dedicated AI phone number that answers every call, searches your inventory, and logs leads.',
    requiredTier: 'pro',
  },
  crm: {
    label: 'CRM',
    description: 'Track every contact and deal through a pipeline built for equipment sales.',
    requiredTier: 'pro',
  },
  dealDesk: {
    label: 'Deal Desk',
    description: 'Quotes, line items, trade-ins, and financing — from first quote to closed deal.',
    requiredTier: 'pro',
  },
  floorPlan: {
    label: 'Floor Plan Tracking',
    description: 'Track floored units, interest accrual, and curtailment schedules across your credit lines.',
    requiredTier: 'pro',
  },
  marketIntel: {
    label: 'Market Intelligence',
    description: 'Weekly AI pricing analysis, competitor benchmarks, and inventory recommendations.',
    requiredTier: 'pro',
  },
  bulkImport: {
    label: 'Bulk Import',
    description: 'Move your whole inventory from TruckPaper, Salesforce, or spreadsheets in one drop.',
    requiredTier: 'pro',
  },
};

const TIER_RANK: Record<PlanTier, number> = { free: 0, pro: 1, enterprise: 2 };

/**
 * Trial-aware tier: free accounts within TRIAL_DAYS of signup are treated as
 * 'pro' so they experience the full platform before the paywall.
 */
export function getEffectiveTier(
  tier: string | null | undefined,
  profileCreatedAt: string | Date | null | undefined
): PlanTier {
  const actual: PlanTier = (tier && tier in PLAN_LIMITS) ? tier as PlanTier : 'free';
  if (actual !== 'free') return actual;
  if (!profileCreatedAt) return 'free';
  const start = new Date(profileCreatedAt).getTime();
  if (Number.isNaN(start)) return 'free';
  const trialEnd = start + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() < trialEnd ? 'pro' : 'free';
}

export function isFeatureUnlocked(feature: FeatureKey, effectiveTier: PlanTier): boolean {
  return TIER_RANK[effectiveTier] >= TIER_RANK[FEATURE_INFO[feature].requiredTier];
}

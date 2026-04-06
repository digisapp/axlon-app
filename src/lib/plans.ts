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

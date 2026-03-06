import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get instance() {
    return getStripe();
  }
};

// Product IDs (create these in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  FEATURED_LISTING_WEEK: 'price_featured_week', // $49/week
  FEATURED_LISTING_MONTH: 'price_featured_month', // $149/month
  BUMP_LISTING: 'price_bump', // $14.99 one-time
  PLATFORM_MONTHLY: 'price_platform_monthly', // $399/month
  PLATFORM_YEARLY: 'price_platform_yearly', // $3,990/year
  VOICE_ADDON_MONTHLY: 'price_voice_addon_monthly', // $499/month
  VOICE_ADDON_YEARLY: 'price_voice_addon_yearly', // $4,990/year
  VOICE_SETUP: 'price_voice_setup', // $499 one-time
  WHITE_GLOVE_SETUP: 'price_white_glove_setup', // $999 one-time
} as const;

export const PRICING = {
  FEATURED_LISTING_WEEK: {
    amount: 4900, // cents
    label: 'Featured Listing (1 Week)',
    description: 'Your listing appears at the top of search results for 7 days',
  },
  FEATURED_LISTING_MONTH: {
    amount: 14900,
    label: 'Featured Listing (1 Month)',
    description: 'Your listing appears at the top of search results for 30 days',
  },
  BUMP_LISTING: {
    amount: 1499,
    label: 'Bump Listing',
    description: 'Refresh your listing to appear as newly posted',
  },
  PLATFORM: {
    monthly: 39900,
    yearly: 399000,
    label: 'AXLON Platform',
    features: [
      'Unlimited listings on marketplace',
      'AI Sales Assistant (24/7 lead capture)',
      'AI Knowledge Base (trained on your inventory)',
      'CRM + Deal Desk + Quote PDF generation',
      'Floor Plan financing tracker',
      'AI price estimates & image analysis',
      'Custom branded storefront',
      'Advanced analytics & trends',
      'Staff management with permissions',
      'Smart Import (AI-powered data migration)',
    ],
  },
  VOICE_ADDON: {
    monthly: 49900,
    yearly: 499000,
    label: 'AXLON Voice',
    minutesIncluded: 500,
    overagePerMinute: 25, // cents
    features: [
      'Dedicated AI phone number',
      '24/7 inbound call handling',
      '500 minutes included/month',
      'Inventory search during calls',
      'Automatic lead capture from every call',
      'Call recording + AI transcription + summaries',
      'Staff PIN authentication',
      'Business hours routing + after-hours handling',
      'Call transfer to human',
    ],
  },
  VOICE_SETUP: {
    amount: 49900,
    label: 'Voice Setup',
    description: 'DID provisioning, voice personality configuration, testing, and go-live support',
  },
  WHITE_GLOVE_SETUP: {
    amount: 99900,
    label: 'White Glove Migration',
    description: 'Full data migration from your existing system, AI configuration, and team training',
  },
};

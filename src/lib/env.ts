/**
 * Environment variable validation.
 * Validated at module load time so misconfigured deploys fail loudly
 * instead of silently serving broken pages.
 */

type EnvVar = {
  key: string;
  required: boolean;
  description: string;
};

const ENV_VARS: EnvVar[] = [
  // Supabase
  { key: 'NEXT_PUBLIC_SUPABASE_URL', required: true, description: 'Supabase project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true, description: 'Supabase anon key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', required: true, description: 'Supabase service role key (server-only)' },

  // App
  { key: 'NEXT_PUBLIC_APP_URL', required: true, description: 'Public app URL (e.g. https://axlon.ai)' },

  // Stripe
  { key: 'STRIPE_SECRET_KEY', required: true, description: 'Stripe secret key' },
  { key: 'STRIPE_WEBHOOK_SECRET', required: true, description: 'Stripe webhook signing secret' },

  // Email
  { key: 'RESEND_API_KEY', required: true, description: 'Resend API key for transactional email' },

  // AI
  { key: 'XAI_API_KEY', required: true, description: 'xAI API key for AXLON AI assistant' },

  // Security
  { key: 'CRON_SECRET', required: true, description: 'Secret for authenticating cron job requests' },
  { key: 'INTERNAL_API_SECRET', required: true, description: 'Secret for internal service-to-service calls' },

  // Optional but warned
  { key: 'UPSTASH_REDIS_REST_URL', required: false, description: 'Upstash Redis URL (caching/view batching disabled without this)' },
  { key: 'UPSTASH_REDIS_REST_TOKEN', required: false, description: 'Upstash Redis token' },
];

function validateEnv(): void {
  // Only validate on the server side
  if (typeof window !== 'undefined') return;
  // Skip during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const missing: string[] = [];
  const warnings: string[] = [];

  for (const { key, required, description } of ENV_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      if (required) {
        missing.push(`  ✗ ${key} — ${description}`);
      } else {
        warnings.push(`  ⚠ ${key} — ${description}`);
      }
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn(
      `[env] Optional environment variables not set:\n${warnings.join('\n')}`
    );
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Check your .env.local file or deployment environment settings.'
    );
  }
}

// Run validation immediately on import (server-side only)
validateEnv();

// Typed accessors — these are safe to use after validation
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  resendApiKey: process.env.RESEND_API_KEY!,
  xaiApiKey: process.env.XAI_API_KEY!,
  cronSecret: process.env.CRON_SECRET!,
  internalApiSecret: process.env.INTERNAL_API_SECRET!,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  adminEmail: process.env.ADMIN_EMAIL ?? 'sales@axlon.ai',
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? 'noreply@axlon.ai',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

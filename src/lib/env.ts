/**
 * Environment variable validation.
 * Validated at module load time so misconfigured deploys fail loudly
 * instead of silently serving broken pages.
 */

type EnvVar = {
  key: string;
  /**
   * critical — every server route depends on it; missing means nothing works,
   *   so throw at module load.
   * required — a feature depends on it; missing means that feature fails, but
   *   throwing here would take down unrelated routes (env.ts is imported via
   *   supabase/server.ts by nearly every API route). Log loudly instead and
   *   let the feature fail at point of use.
   */
  level: 'critical' | 'required' | 'optional';
  description: string;
};

const ENV_VARS: EnvVar[] = [
  // Supabase — used by virtually every route
  { key: 'NEXT_PUBLIC_SUPABASE_URL', level: 'critical', description: 'Supabase project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', level: 'critical', description: 'Supabase anon key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', level: 'critical', description: 'Supabase service role key (server-only)' },

  // App
  { key: 'NEXT_PUBLIC_APP_URL', level: 'critical', description: 'Public app URL (e.g. https://axlon.ai)' },

  // Stripe
  { key: 'STRIPE_SECRET_KEY', level: 'required', description: 'Stripe secret key' },
  { key: 'STRIPE_WEBHOOK_SECRET', level: 'required', description: 'Stripe webhook signing secret' },

  // Email
  { key: 'RESEND_API_KEY', level: 'required', description: 'Resend API key for transactional email' },
  { key: 'RESEND_WEBHOOK_SECRET', level: 'required', description: 'Resend webhook signing secret (svix)' },

  // AI
  { key: 'XAI_API_KEY', level: 'required', description: 'xAI API key for AXLON AI assistant' },

  // Security
  { key: 'CRON_SECRET', level: 'required', description: 'Secret for authenticating cron job requests' },
  { key: 'INTERNAL_API_SECRET', level: 'required', description: 'Secret for internal service-to-service calls' },

  // Optional but warned
  { key: 'UNSUBSCRIBE_SECRET', level: 'optional', description: 'HMAC secret for email unsubscribe tokens (falls back to INTERNAL_API_SECRET, then CRON_SECRET)' },
  { key: 'UPSTASH_REDIS_REST_URL', level: 'optional', description: 'Upstash Redis URL (caching/view batching disabled without this)' },
  { key: 'UPSTASH_REDIS_REST_TOKEN', level: 'optional', description: 'Upstash Redis token' },
];

function validateEnv(): void {
  // Only validate on the server side
  if (typeof window !== 'undefined') return;
  // Skip during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const critical: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const { key, level, description } of ENV_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      if (level === 'critical') {
        critical.push(`  ✗ ${key} — ${description}`);
      } else if (level === 'required') {
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

  // Feature-specific vars: log an error but DON'T throw — throwing at module
  // load would 500 every route that imports the Supabase server client, even
  // ones that never touch the missing feature
  if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
    console.error(
      `[env] Missing required environment variables (dependent features WILL fail):\n${missing.join('\n')}\n\n` +
      'Check your .env.local file or deployment environment settings.'
    );
  }

  if (critical.length > 0) {
    throw new Error(
      `[env] Missing critical environment variables:\n${critical.join('\n')}\n\n` +
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
  resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
  xaiApiKey: process.env.XAI_API_KEY!,
  cronSecret: process.env.CRON_SECRET!,
  internalApiSecret: process.env.INTERNAL_API_SECRET!,
  unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  adminEmail: process.env.ADMIN_EMAIL ?? 'sales@axlon.ai',
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? 'noreply@axlon.ai',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

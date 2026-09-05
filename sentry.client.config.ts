import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance monitoring sample rate (10% of transactions)
  tracesSampleRate: 0.1,

  // Session replay for error debugging (capture 1% of sessions, 100% of error sessions)
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  // Don't send PII
  sendDefaultPii: false,

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
    /Loading chunk \d+ failed/,
    /Failed to fetch/,
  ],

  integrations: [],
});

// Session Replay is ~100KB gzipped but only 1% of sessions ever record —
// fetch it after idle instead of shipping it in every page's critical bundle.
// The sample rates above apply when the integration is added.
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const loadReplay = () =>
    Sentry.lazyLoadIntegration('replayIntegration')
      .then((replayIntegration) => {
        Sentry.addIntegration(replayIntegration());
      })
      .catch(() => {
        // Replay is a nice-to-have; never let its load failure surface
      });

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadReplay);
  } else {
    setTimeout(loadReplay, 3000);
  }
}

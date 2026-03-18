import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com", // unsafe-inline required by Next.js hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.upstash.io https://api.x.ai https://*.ingest.sentry.io",
      "frame-src 'self' https://js.stripe.com",
      "media-src 'self' https://*.supabase.co blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Supabase storage
      { protocol: 'https', hostname: '*.supabase.co' },
      // CDN providers
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: '*.azureedge.net' },
      { protocol: 'https', hostname: '*.bigcommerce.com' },
      { protocol: 'https', hostname: '*.website-files.com' },
      { protocol: 'https', hostname: '*.azurewebsites.net' },
      // Dealer & listing image sources
      { protocol: 'https', hostname: '*.haletrailer.com' },
      { protocol: 'https', hostname: '*.pinnacletrailers.com' },
      { protocol: 'https', hostname: '*.tecequipment.com' },
      { protocol: 'https', hostname: '*.soarr.com' },
      { protocol: 'https', hostname: '*.truckpaper.com' },
      { protocol: 'https', hostname: '*.sandhills.com' },
      { protocol: 'https', hostname: '*.imanpro.net' },
      { protocol: 'https', hostname: '*.lumbermenonline.com' },
      { protocol: 'https', hostname: '*.renostrailer.com' },
      { protocol: 'https', hostname: '*.semitrailers.net' },
      { protocol: 'https', hostname: 'semitrailers.net' },
      { protocol: 'https', hostname: 'royaltrailersales.com' },
      { protocol: 'https', hostname: 'midcosales.com' },
      { protocol: 'https', hostname: 'jhtt.com' },
      { protocol: 'https', hostname: '*.jhtt.com' },
      // Manufacturer product catalog images
      { protocol: 'https', hostname: '*.trailking.com' },
      { protocol: 'https', hostname: '*.fontainespecialized.com' },
      { protocol: 'https', hostname: '*.talbertmfg.com' },
      { protocol: 'https', hostname: '*.xlspecializedtrailer.com' },
      { protocol: 'https', hostname: '*.pittstrailers.com' },
      { protocol: 'https', hostname: '*.eagerbeavertrailers.com' },
      { protocol: 'https', hostname: '*.kaufmantrailers.com' },
      { protocol: 'https', hostname: '*.witzco.com' },
      { protocol: 'https', hostname: '*.globetrailers.com' },
      { protocol: 'https', hostname: '*.etnyre.com' },
      { protocol: 'https', hostname: '*.landoll.com' },
      { protocol: 'https', hostname: '*.maxtrailer.us' },
      { protocol: 'https', hostname: '*.faymonville.com' },
      { protocol: 'https', hostname: '*.loadstartrailers.com' },
      { protocol: 'https', hostname: '*.dorseymfg.com' },
      { protocol: 'https', hostname: '*.kalynsiebert.com' },
      { protocol: 'https', hostname: '*.smithcomfg.com' },
      { protocol: 'https', hostname: '*.macktrucks.com' },
      { protocol: 'https', hostname: '*.volvogroup.com' },
      { protocol: 'https', hostname: '*.felling.com' },
      // New dealer image sources
      { protocol: 'https', hostname: '*.thepetestore.com' },
      { protocol: 'https', hostname: '*.arrowtruck.com' },
      { protocol: 'https', hostname: '*.westerntruck.com' },
      { protocol: 'https', hostname: '*.tristatetrailer.com' },
      { protocol: 'https', hostname: '*.allroadskenworth.com' },
      { protocol: 'https', hostname: '*.petersandkeatts.net' },
      { protocol: 'https', hostname: '*.preferredlowboys.com' },
      { protocol: 'https', hostname: '*.mylittlesalesman.com' },
      { protocol: 'https', hostname: '*.lmitennessee.com' },
      { protocol: 'https', hostname: '*.brucknertruck.com' },
      { protocol: 'https', hostname: '*.jbpavelkainc.com' },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress source map upload warnings when SENTRY_AUTH_TOKEN is not set
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Upload source maps for better stack traces
  widenClientFileUpload: true,

  // Webpack-specific options (non-Turbopack)
  webpack: {
    // Tree-shake Sentry debug logging in production
    treeshake: {
      removeDebugLogging: true,
    },
    // Automatically instrument API routes and server components
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
  },
});

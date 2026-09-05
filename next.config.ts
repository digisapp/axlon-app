import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
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
  // CSP is set dynamically per-request in src/proxy.ts with a nonce
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
    formats: ['image/avif', 'image/webp'],
    // Listing/catalog images are immutable once re-hosted — keep optimized
    // variants cached for 31 days instead of the short default, which forced
    // frequent origin refetches from Supabase storage.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      // Supabase storage (all listing images are re-hosted here)
      { protocol: 'https', hostname: '*.supabase.co' },
      // Webflow CDN — used by manufacturer product images (not yet re-hosted)
      { protocol: 'https', hostname: '*.website-files.com' },
      // Hale Trailer WordPress media — used by manufacturer product images
      { protocol: 'https', hostname: '*.haletrailer.com' },
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
      // `*.example.com` matches exactly one subdomain, so bare apex hosts must
      // be listed separately. Every host below is present in
      // manufacturer_product_images today; a host missing here makes
      // /_next/image return 400 and the card falls back to a placeholder.
      { protocol: 'https', hostname: 'landoll.com' },
      { protocol: 'https', hostname: 'kalynsiebert.com' },
      { protocol: 'https', hostname: 'xlspecializedtrailer.com' },
      { protocol: 'https', hostname: 'loadstartrailers.com' },
      { protocol: 'https', hostname: 'talbertmfg.com' },
      { protocol: 'https', hostname: 'pittstrailers.com' },
      { protocol: 'https', hostname: 'etnyre.com' },
      { protocol: 'https', hostname: 'trailking.com' },
      { protocol: 'https', hostname: 'felling.com' },
      { protocol: 'https', hostname: 'globetrailers.com' },
      { protocol: 'https', hostname: 'witzco.com' },
      { protocol: 'https', hostname: 'kaufmantrailers.com' },
      { protocol: 'https', hostname: 'eagerbeavertrailers.com' },
      { protocol: 'https', hostname: 'fontainespecialized.com' },
      { protocol: 'https', hostname: 'faymonville.com' },
      { protocol: 'https', hostname: 'macktrucks.com' },
      { protocol: 'https', hostname: 'maxtrailer.us' },
      // Dorsey's catalog lives on dorseytrailer.net, not dorseymfg.com
      { protocol: 'https', hostname: '*.dorseytrailer.net' },
      { protocol: 'https', hostname: 'dorseytrailer.net' },
      // Jetpack/WordPress.com image CDN fronting several manufacturer sites
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'i1.wp.com' },
      { protocol: 'https', hostname: 'i2.wp.com' },
      // Vimeo poster frames used as product thumbnails
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
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

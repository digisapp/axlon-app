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
  // CSP is set dynamically per-request in src/middleware.ts with a nonce
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
      // Dealer & listing image platforms (covers SandHills, MyLittleSalesman, Soarr, etc.)
      { protocol: 'https', hostname: '*.soarr.com' },
      { protocol: 'https', hostname: '*.truckpaper.com' },
      { protocol: 'https', hostname: '*.sandhills.com' },
      { protocol: 'https', hostname: '*.imanpro.net' },
      { protocol: 'https', hostname: '*.mylittlesalesman.com' },
      // Dealer direct image sources
      { protocol: 'https', hostname: '*.haletrailer.com' },
      { protocol: 'https', hostname: '*.pinnacletrailers.com' },
      { protocol: 'https', hostname: '*.tecequipment.com' },
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

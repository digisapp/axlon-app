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

// The public app URL is interpolated into canonical links, sitemap entries,
// robots.txt, email links and OAuth redirects. Normalize it once at build
// time so stray whitespace or a trailing slash in the hosting env var can't
// corrupt every generated URL (a trailing newline shipped to prod once).
const publicAppUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/+$/, '');

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  env: {
    ...(publicAppUrl && { NEXT_PUBLIC_APP_URL: publicAppUrl }),
  },
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
      // Every image the app renders through next/image is re-hosted in
      // Supabase Storage: listing photos (dealer-imports/...) and the
      // manufacturer catalog (manufacturer-products/..., moved Sep 2026).
      // Scrapers re-host on insert, so no other host should ever appear
      // here. The one origin that cannot be re-hosted (Eager Beaver, behind
      // Cloudflare bot protection) is rendered `unoptimized` instead — see
      // src/lib/images/optimizer-blocked-hosts.ts.
      { protocol: 'https', hostname: '*.supabase.co' },
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

import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Hosts that serve the standalone AXLON experience instead of the marketplace.
const AXLON_HOSTS = new Set(['axlon.ai', 'www.axlon.ai']);
const CANONICAL_ORIGIN = 'https://axleyard.com';

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // nonce + strict-dynamic for modern browsers; unsafe-inline is ignored by them
    // but acts as a safe fallback for legacy browsers that don't support strict-dynamic
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com 'unsafe-inline'`,
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
  ].join('; ');
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // axlon.ai is the standalone AXLON surface: its root renders the /ask page
  // (anonymous, no session needed); every other path 308s to axleyard.com so
  // links indexed or emailed under the old domain keep resolving.
  const host = request.headers.get('host')?.toLowerCase().split(':')[0] ?? '';
  if (AXLON_HOSTS.has(host)) {
    const { pathname, search } = request.nextUrl;
    if (pathname === '/' || pathname === '/ask') {
      const askHeaders = new Headers(request.headers);
      askHeaders.set('x-nonce', nonce);
      const rewrite = NextResponse.rewrite(new URL('/ask', request.url), {
        request: { headers: askHeaders },
      });
      rewrite.headers.set('Content-Security-Policy', buildCsp(nonce));
      return rewrite;
    }
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308);
  }

  // Inject nonce into request headers so server components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  const noncedRequest = new NextRequest(request.nextUrl, {
    headers: requestHeaders,
    method: request.method,
  });

  const response = await updateSession(noncedRequest);
  response.headers.set('Content-Security-Policy', buildCsp(nonce));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - API routes (they handle their own auth; skipping middleware
     *   avoids an extra supabase.auth.getUser() round-trip per request)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

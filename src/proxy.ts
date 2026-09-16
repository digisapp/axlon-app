import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { MICROSITE_HOST_HEADER, isAppHost, isRewritableHost, normalizeHost } from '@/lib/microsites/config';

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
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.upstash.io https://api.x.ai https://*.ingest.sentry.io https://nominatim.openstreetmap.org",
    "frame-src 'self' https://js.stripe.com",
    "media-src 'self' https://*.supabase.co blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');
}

// Next.js 16 renamed the `middleware` file convention to `proxy` (same
// runtime contract; the old name is deprecated and warns on every build).
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // axlon.ai is the standalone AXLON surface: its root renders the /ask page
  // (anonymous, no session needed); every other path 308s to axleyard.com so
  // links indexed or emailed under the old domain keep resolving.
  const host = request.headers.get('host')?.toLowerCase().split(':')[0] ?? '';
  if (AXLON_HOSTS.has(host)) {
    const { pathname, search } = request.nextUrl;
    if (pathname === '/' || pathname === '/ask') {
      const askHeaders = new Headers(request.headers);
      askHeaders.delete(MICROSITE_HOST_HEADER);
      askHeaders.set('x-nonce', nonce);
      const rewrite = NextResponse.rewrite(new URL('/ask', request.url), {
        request: { headers: askHeaders },
      });
      rewrite.headers.set('Content-Security-Policy', buildCsp(nonce));
      return rewrite;
    }
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308);
  }

  // Any host that is not the app itself is a lead-gen microsite domain
  // (xltrailers.com, tagtrailers.com, ...). Rewrite it under /sites/<host> so
  // one Next app serves every domain; the page resolves the host to a row in
  // `microsites` and 404s if there isn't one, or it isn't live.
  //
  // The DB lookup deliberately does NOT happen here: proxy runs on every
  // request at the edge, and a query per request would cost more than the
  // page render it precedes.
  const siteHost = normalizeHost(host);

  // `isRewritableHost` is the guard, not a formality: the template below goes
  // through `new URL()`, which resolves `..` segments, so a forged
  // `Host: ../../admin` would otherwise escape /sites/ and rewrite to an
  // arbitrary internal route. A host that fails it falls through to the app.
  if (!isAppHost(host) && isRewritableHost(siteHost)) {
    const { pathname, search } = request.nextUrl;

    // Don't wrap paths the app owns regardless of host.
    if (!pathname.startsWith('/sites/') && !pathname.startsWith('/_next') && !pathname.startsWith('/api/')) {
      const siteHeaders = new Headers(request.headers);
      siteHeaders.set('x-nonce', nonce);
      // set() replaces any client-supplied value.
      siteHeaders.set(MICROSITE_HOST_HEADER, siteHost);

      const url = new URL(`/sites/${siteHost}${pathname === '/' ? '' : pathname}${search}`, request.url);
      const rewrite = NextResponse.rewrite(url, { request: { headers: siteHeaders } });
      rewrite.headers.set('Content-Security-Policy', buildCsp(nonce));
      return rewrite;
    }
  }

  // Inject nonce into request headers so server components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  // Everything downstream treats this header as proof the proxy rewrote a
  // microsite request. Any copy that arrives from the client is a forgery —
  // without this delete, `curl -H 'x-microsite-host: x' axleyard.com/sites/...`
  // walks straight past the app-host guards.
  requestHeaders.delete(MICROSITE_HOST_HEADER);
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

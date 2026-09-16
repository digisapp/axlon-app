/**
 * Hosts that belong to the marketplace / AXLON app itself. Anything NOT in
 * this set that reaches the app is treated as a microsite domain by
 * src/proxy.ts and rewritten to /sites/<host>.
 *
 * Preview and local hosts are matched by suffix in `isAppHost` rather than
 * listed here, since they vary per deploy.
 */
const APP_HOSTS = new Set([
  'axleyard.com',
  'www.axleyard.com',
  'axlon.ai',
  'www.axlon.ai',
  'localhost',
  '127.0.0.1',
]);

/** Normalize a Host header to a bare lowercase apex: no port, no `www.`. */
export function normalizeHost(rawHost: string | null | undefined): string {
  if (!rawHost) return '';
  let host = rawHost.toLowerCase().trim();
  // Strip port. IPv6 literals arrive bracketed ([::1]:3000) — take the host part.
  if (host.startsWith('[')) {
    host = host.slice(0, host.indexOf(']') + 1);
  } else {
    host = host.split(':')[0];
  }
  return host.replace(/^www\./, '');
}

/**
 * True when the host is the app itself rather than a microsite domain.
 *
 * Vercel preview deployments and local dev must never be mistaken for a
 * microsite, or every preview URL would 404 against the microsite table.
 */
export function isAppHost(rawHost: string | null | undefined): boolean {
  const host = normalizeHost(rawHost);
  if (!host) return true; // No Host header: fail closed to the app.
  if (APP_HOSTS.has(host) || APP_HOSTS.has(`www.${host}`)) return true;
  if (host.endsWith('.vercel.app')) return true;
  if (host.endsWith('.localhost') || host === 'localhost') return true;
  return false;
}

/**
 * Local-dev escape hatch: microsite domains don't resolve to localhost, so
 * `?__site=xltrailers.com` on the app host renders that microsite instead.
 * Honoured only outside production.
 */
export const SITE_PREVIEW_PARAM = '__site';

export function isPreviewAllowed(): boolean {
  return process.env.NODE_ENV !== 'production';
}

/**
 * Whether a normalized host is safe to interpolate into a rewrite path.
 *
 * The proxy builds `/sites/<host><pathname>` and hands it to `new URL()`,
 * which resolves `..` segments — so a forged `Host: ../../admin` would escape
 * the /sites/ prefix and rewrite to an arbitrary internal route. Only a
 * well-formed apex host may ever reach that template. Mirrors the
 * microsites_domain_format CHECK in migration 075.
 */
export function isRewritableHost(host: string): boolean {
  if (!host || host.length > 253) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(host);
}

/**
 * Header the proxy stamps on a microsite request so server components can
 * tell they are rendering a microsite rather than the marketplace.
 *
 * It is trusted, so the proxy MUST delete any client-supplied copy on every
 * path — otherwise anyone can set it and reach /sites/* under the marketplace
 * domain, which is exactly what the guards exist to prevent.
 */
export const MICROSITE_HOST_HEADER = 'x-microsite-host';

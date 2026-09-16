import 'server-only';
import { headers } from 'next/headers';
import { isAppHost } from './config';

/**
 * True when a /sites/* request did NOT arrive through the proxy's host
 * rewrite and is therefore someone poking the internal path directly on the
 * app host (axleyard.com/sites/xltrailers.com/...).
 *
 * The layout applies this to the pages, but route handlers do not run layouts
 * — robots.txt and sitemap.xml have to check for themselves, or every
 * microsite's SEO files are also served under the marketplace domain.
 */
export async function isDirectAppHostRequest(): Promise<boolean> {
  const headerList = await headers();
  if (headerList.get('x-microsite-host') !== null) return false;
  if (process.env.NODE_ENV !== 'production') return false;
  return isAppHost(headerList.get('host'));
}

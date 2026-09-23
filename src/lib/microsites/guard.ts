import 'server-only';
import { headers } from 'next/headers';
import { MICROSITE_HOST_HEADER } from './config';

/**
 * True when a /sites/* request did NOT arrive through the proxy's host
 * rewrite for this very domain, i.e. someone is requesting the internal path
 * directly: on the app host (axleyard.com/sites/xltrailers.com/...) or on
 * ANOTHER microsite's host (xltrailers.com/sites/tagtrailers.com/...). The
 * proxy passes /sites/* through unrewritten and strips the header, and the
 * old check only blocked app hosts, so every microsite was also served under
 * every other microsite domain.
 *
 * The layout applies this to the pages, but route handlers do not run layouts
 * — robots.txt and sitemap.xml have to check for themselves, or every
 * microsite's SEO files are also served under the marketplace domain.
 */
export async function isDirectAppHostRequest(domain?: string): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') return false;
  const headerList = await headers();
  const viaProxy = headerList.get(MICROSITE_HOST_HEADER);
  if (viaProxy === null) return true;
  if (domain !== undefined && viaProxy !== domain.toLowerCase()) return true;
  return false;
}

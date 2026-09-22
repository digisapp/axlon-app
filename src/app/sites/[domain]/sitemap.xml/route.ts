import { NextResponse } from 'next/server';
import { isDirectAppHostRequest } from '@/lib/microsites/guard';
import { getMicrositeByHost, getMicrositeCatalogUncached } from '@/lib/microsites/resolve';

// The proxy rewrites https://<domain>/sitemap.xml to /sites/<domain>/sitemap.xml,
// so each microsite serves its own sitemap at the conventional path.
function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  // Route handlers don't run the layout, so the app-host guard is repeated
  // here. Without it these files are served under axleyard.com too.
  if (await isDirectAppHostRequest()) {
    return new NextResponse('Not found', { status: 404 });
  }

  const { domain } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) return new NextResponse('Not found', { status: 404 });

  // Uncached on purpose — see getMicrositeCatalogUncached.
  const products = await getMicrositeCatalogUncached(site, 500);
  const base = `https://${site.domain}`;
  const today = new Date().toISOString().split('T')[0];

  // `slug` is unique per manufacturer, not globally, so a category site
  // spanning makers can carry the same slug twice. Both resolve to one URL —
  // emitting it twice would put duplicate <loc> entries in the sitemap.
  const productSlugs = [...new Set(products.map((p) => p.slug))];

  const urls = [
    { loc: `${base}/`, priority: '1.0' },
    ...productSlugs.map((slug) => ({ loc: `${base}/trailers/${slug}`, priority: '0.8' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Next rewrites Cache-Control on dynamic route handlers (this one reads
      // headers() for the app-host guard), so an s-maxage here never reached
      // the CDN — x-vercel-cache was MISS with the header set. Say what is true.
      'Cache-Control': 'public, max-age=0',
    },
  });
}

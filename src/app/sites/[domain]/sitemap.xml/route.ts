import { NextResponse } from 'next/server';
import { isDirectAppHostRequest } from '@/lib/microsites/guard';
import { getMicrositeByHost, getMicrositeProducts } from '@/lib/microsites/resolve';

// The proxy rewrites https://<domain>/sitemap.xml to /sites/<domain>/sitemap.xml,
// so each microsite serves its own sitemap at the conventional path.
export const revalidate = 3600;

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

  const products = await getMicrositeProducts(site, 500);
  const base = `https://${site.domain}`;
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${base}/`, priority: '1.0' },
    ...products.map((p) => ({ loc: `${base}/trailers/${p.slug}`, priority: '0.8' })),
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
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}

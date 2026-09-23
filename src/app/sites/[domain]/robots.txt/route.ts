import { NextResponse } from 'next/server';
import { isDirectAppHostRequest } from '@/lib/microsites/guard';
import { getMicrositeByHost } from '@/lib/microsites/resolve';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  // Route handlers don't run the layout, so the app-host guard is repeated
  // here. Without it these files are served under axleyard.com too.
  const { domain } = await params;
  if (await isDirectAppHostRequest(domain)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const site = await getMicrositeByHost(domain);

  // A domain with no live microsite must not be crawled at all — otherwise a
  // parked or half-configured host gets indexed as a 404 farm.
  if (!site) {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://${site.domain}/sitemap.xml
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}

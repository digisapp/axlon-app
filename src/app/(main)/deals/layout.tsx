import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deals - Below Market Price Trucks & Trailers',
  description: 'Find trucks, trailers, and equipment priced below market value. AI-analyzed deals with verified savings on commercial vehicles and heavy equipment.',
  openGraph: {
    title: 'Deals - Below Market Price Trucks & Trailers | AxlonAI',
    description: 'Find trucks, trailers, and equipment priced below market value. AI-analyzed deals with verified savings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deals - Below Market Price Trucks & Trailers | AxlonAI',
    description: 'AI-analyzed deals on trucks, trailers, and equipment priced below market value.',
  },
  alternates: {
    canonical: '/deals',
  },
};

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Deals - Below Market Price Trucks & Trailers',
            description: 'AI-analyzed deals on trucks, trailers, and equipment priced below market value.',
            url: 'https://axlon.ai/deals',
            isPartOf: { '@type': 'WebSite', name: 'AxlonAI', url: 'https://axlon.ai' },
          }),
        }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { jsonLdString } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Commercial Truck & Trailer Financing Calculator',
  description: 'Calculate monthly payments for commercial truck and trailer financing. Flexible terms from 24-84 months with competitive rates. Get pre-qualified today.',
  openGraph: {
    title: 'Commercial Truck & Trailer Financing | AXLON AI',
    description: 'Calculate monthly payments for truck and trailer financing. Flexible terms, competitive rates.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truck & Trailer Financing Calculator | AXLON AI',
    description: 'Calculate monthly payments for commercial truck and trailer financing. 24-84 month terms.',
  },
  alternates: {
    canonical: '/finance',
  },
};

export default async function FinanceLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <>
      {children}
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString({
            '@context': 'https://schema.org',
            '@type': 'FinancialService',
            name: 'AXLON AI Equipment Financing',
            description: 'Commercial truck and trailer financing with flexible terms from 24-84 months.',
            url: 'https://axlon.ai/finance',
            provider: { '@type': 'Organization', name: 'AXLON AI', url: 'https://axlon.ai' },
          }),
        }}
      />
    </>
  );
}

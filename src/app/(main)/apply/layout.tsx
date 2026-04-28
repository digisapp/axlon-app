import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to Join AXLON AI | Dealer Application',
  description: 'Apply to become a verified dealer on AXLON AI. Get your own AI-powered storefront, lead management tools, voice agent, and smart inventory management.',
  openGraph: {
    title: 'Apply to Join AXLON AI | Dealer Application',
    description: 'Get your AI-powered storefront, lead management, voice agent, and smart inventory tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealer Application | AXLON AI',
    description: 'Apply for AI-powered storefront, lead management, and inventory tools.',
  },
  alternates: {
    canonical: '/apply',
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

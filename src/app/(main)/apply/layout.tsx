import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Brand omitted — the root layout's "%s | Axleyard" template appends it.
  title: 'Dealer Application — Apply to Join',
  description: 'Apply to become a verified dealer on Axleyard. Get your own AI-powered storefront, lead management tools, voice agent, and smart inventory management.',
  openGraph: {
    title: 'Apply to Join Axleyard | Dealer Application',
    description: 'Get your AI-powered storefront, lead management, voice agent, and smart inventory tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealer Application | Axleyard',
    description: 'Apply for AI-powered storefront, lead management, and inventory tools.',
  },
  alternates: {
    canonical: '/apply',
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

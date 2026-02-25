import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Dealer',
  description: 'Join AxlonAI as a verified dealer. Get your own AI-powered storefront, lead management tools, inventory management, and more. Apply today.',
  openGraph: {
    title: 'Become a Dealer on AxlonAI',
    description: 'Get your own AI-powered storefront, lead management, and inventory tools. Join the future of equipment sales.',
  },
  alternates: {
    canonical: '/become-a-dealer',
  },
};

export default function BecomeADealerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

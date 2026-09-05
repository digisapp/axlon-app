import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Join Axleyard — the AI-powered platform for heavy equipment, crane, rigging, and transport companies. Get your own storefront, lead management, and AI tools.',
  openGraph: {
    title: 'Get Started on Axleyard',
    description: 'AI-powered storefront, lead management, and inventory tools. Join the future of heavy equipment sales.',
  },
  alternates: {
    canonical: '/get-started',
  },
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}

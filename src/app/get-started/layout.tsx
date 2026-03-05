import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started | AxlonAI',
  description: 'Join AxlonAI — the AI-powered platform for heavy equipment, crane, rigging, and transport companies. Get your own storefront, lead management, and AI tools.',
  openGraph: {
    title: 'Get Started on AxlonAI',
    description: 'AI-powered storefront, lead management, and inventory tools. Join the future of heavy equipment sales.',
  },
  alternates: {
    canonical: '/get-started',
  },
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}

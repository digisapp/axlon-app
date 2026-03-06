import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started | AXLON AI',
  alternates: {
    canonical: '/get-started',
  },
};

export default function BecomeADealerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Equipment Side-by-Side',
  description: 'Compare trucks, trailers, and heavy equipment side by side. View specs, pricing, and features to make the best purchasing decision.',
  openGraph: {
    title: 'Compare Equipment Side-by-Side | AXLON AI',
    description: 'Compare trucks, trailers, and equipment specs, pricing, and features side by side.',
  },
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

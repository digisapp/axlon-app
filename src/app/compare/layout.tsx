import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Compare Equipment Side-by-Side',
  description: 'Compare trucks, trailers, and heavy equipment side by side. View specs, pricing, and features to make the best purchasing decision.',
  openGraph: {
    title: 'Compare Equipment Side-by-Side | Axleyard',
    description: 'Compare trucks, trailers, and equipment specs, pricing, and features side by side.',
  },
  robots: { index: false, follow: true },
};

// Lives outside (main), so it brings the site chrome itself — without it the
// page (and its empty state) had no way back into the site but the back arrow.
export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

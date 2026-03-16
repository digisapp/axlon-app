export const dynamic = 'force-dynamic';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrailerFinderChat } from '@/components/agents/TrailerFinderChat';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <TrailerFinderChat variant="floating" />
    </div>
  );
}

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrailerFinderChatLazy } from '@/components/agents/TrailerFinderChatLazy';

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
      <TrailerFinderChatLazy variant="floating" />
    </div>
  );
}

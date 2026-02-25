import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TradeInForm = dynamic(
  () => import('@/components/trade-in/TradeInForm').then((mod) => mod.TradeInForm),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
    ),
  }
);

export const metadata = {
  title: 'Trade-In Your Equipment',
  description: 'Get a free valuation for your truck, trailer, or equipment. Submit a trade-in request and receive a response within 24-48 hours.',
  openGraph: {
    title: 'Trade-In Your Equipment | AxlonAI',
    description: 'Get a free valuation for your truck, trailer, or equipment. Fast response within 24-48 hours.',
  },
  twitter: {
    card: 'summary' as const,
    title: 'Trade-In Your Equipment | AxlonAI',
    description: 'Get a free valuation for your truck, trailer, or equipment.',
  },
  alternates: {
    canonical: '/trade-in',
  },
};

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Trade-In Your Equipment</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get a competitive offer for your truck, trailer, or equipment. Our network of dealers
            will review your request and provide a valuation within 24-48 hours.
          </p>
        </div>

        <TradeInForm />

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-background rounded-xl border">
            <div className="text-3xl font-bold text-primary mb-1">24hr</div>
            <p className="text-sm text-muted-foreground">Average response time</p>
          </div>
          <div className="p-6 bg-background rounded-xl border">
            <div className="text-3xl font-bold text-primary mb-1">Free</div>
            <p className="text-sm text-muted-foreground">No obligation quote</p>
          </div>
          <div className="p-6 bg-background rounded-xl border">
            <div className="text-3xl font-bold text-primary mb-1">500+</div>
            <p className="text-sm text-muted-foreground">Dealer network</p>
          </div>
        </div>
      </div>
    </div>
  );
}

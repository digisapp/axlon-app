import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Brand omitted — the root layout's "%s | Axleyard" template appends it.
  title: 'Apply for a Free AI Opportunity Assessment',
  description:
    'Apply for a free 45-minute AI Opportunity Assessment. We review every application personally and accept 3–4 heavy haul, equipment, and crane & rigging businesses into the AI Transformation Program each quarter.',
  openGraph: {
    title: 'Apply for a Free AI Opportunity Assessment | Axleyard',
    description:
      'A 2-minute application for a free 45-minute assessment of where AI fits your equipment or heavy haul operation.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Opportunity Assessment | Axleyard',
    description: 'Apply for a free 45-minute assessment — 3–4 new clients accepted per quarter.',
  },
  alternates: {
    canonical: '/apply',
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

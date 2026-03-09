import type { Metadata } from 'next';
import { HowItWorksContent } from '@/components/how-it-works/HowItWorksContent';

export const metadata: Metadata = {
  title: 'How It Works & Pricing | AXLON AI',
  description: 'See how AXLON AI works for buyers and dealers. AI-powered search, voice agents, CRM, and more. Platform $399/mo, Voice $499/mo.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}

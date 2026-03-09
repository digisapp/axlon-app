import type { Metadata } from 'next';
import { HowItWorksContent } from '@/components/how-it-works/HowItWorksContent';

export const metadata: Metadata = {
  title: 'Services & Pricing | AXLON AI',
  description: 'AXLON AI services for businesses. AI-powered sales assistants, voice agents, CRM, and more. Platform $399/mo, Voice $499/mo.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}

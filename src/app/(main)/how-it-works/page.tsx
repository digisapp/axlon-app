import type { Metadata } from 'next';
import { HowItWorksContent } from '@/components/how-it-works/HowItWorksContent';

export const metadata: Metadata = {
  title: 'AI Platform for Equipment Dealers | AXLON AI',
  description: 'The AI operating system for equipment dealers. Sales assistant, CRM, voice agents, and automation — all in one platform. Starting at $399/mo.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}

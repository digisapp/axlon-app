import type { Metadata } from 'next';
import { HowItWorksContent } from '@/components/how-it-works/HowItWorksContent';

export const metadata: Metadata = {
  title: 'AI Platform for Equipment Businesses | AXLON AI',
  description: 'The AI operating system for equipment businesses. Sales assistant, CRM, voice agents, and automation — all in one platform. Starting at $399/mo.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'AI Platform for Equipment Businesses | AXLON AI',
    description: 'The AI operating system for equipment businesses. Sales assistant, CRM, voice agents, and automation — all in one platform.',
    type: 'website',
    url: '/how-it-works',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Platform for Equipment Businesses | AXLON AI',
    description: 'Sales assistant, CRM, voice agents, and automation — all in one platform. Starting at $399/mo.',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}

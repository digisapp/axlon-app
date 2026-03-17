import type { Metadata } from 'next';
import { VoiceContent } from '@/components/voice/VoiceContent';

export const metadata: Metadata = {
  title: 'Voice Agent — Your Company\'s Voice & Brain | AXLON AI',
  description:
    'AI Voice Agent that knows your entire business — inventory, pricing, CRM, relationships. Answers calls in 30+ languages, captures leads, and gives your team instant intel with a PIN.',
  alternates: {
    canonical: '/voice',
  },
  openGraph: {
    title: 'Voice Agent — Your Company\'s Voice & Brain | AXLON AI',
    description: 'AI Voice Agent that knows your entire business — inventory, pricing, CRM, relationships. Answers calls in 30+ languages.',
    type: 'website',
    url: '/voice',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Agent | AXLON AI',
    description: 'Answers calls in 30+ languages, captures leads, and gives your team instant intel with a PIN.',
  },
};

export default function VoicePage() {
  return <VoiceContent />;
}

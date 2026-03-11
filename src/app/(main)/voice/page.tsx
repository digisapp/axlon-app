import type { Metadata } from 'next';
import { VoiceContent } from '@/components/voice/VoiceContent';

export const metadata: Metadata = {
  title: 'Voice Agents — 24/7 Phone AI | AXLON AI',
  description:
    'Conversational AI agent solutions — voice AI agents delivering real-time customer support, 24/7 automated call handling, and natural voice interactions.',
};

export default function VoicePage() {
  return <VoiceContent />;
}

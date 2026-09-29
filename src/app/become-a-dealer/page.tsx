import { permanentRedirect } from 'next/navigation';

export default function BecomeADealerPage() {
  // 308: the dealer pitch lives at /for-business; this alias must not be
  // indexed as a duplicate of it.
  permanentRedirect('/for-business');
}

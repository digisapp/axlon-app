'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { csrfFetch } from '@/lib/csrf-fetch';

interface ClaimStorefrontButtonProps {
  sourceId: string;
  token: string;
  listingCount: number;
}

export function ClaimStorefrontButton({ sourceId, token, listingCount }: ClaimStorefrontButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ claimed: number; slug: string } | null>(null);

  const claim = async () => {
    setState('working');
    setError('');
    try {
      const res = await csrfFetch('/api/dealer/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setState('idle');
        return;
      }
      setResult({ claimed: data.claimed ?? 0, slug: data.slug });
      setState('done');
      setTimeout(() => router.push('/dashboard/listings'), 1800);
    } catch {
      setError('Something went wrong. Please try again.');
      setState('idle');
    }
  };

  if (state === 'done' && result) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
        <p className="font-semibold">
          {result.claimed} {result.claimed === 1 ? 'listing is' : 'listings are'} now yours.
        </p>
        <p className="text-sm text-muted-foreground">Taking you to your inventory…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={claim} disabled={state === 'working'}>
        {state === 'working' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Claim {listingCount} {listingCount === 1 ? 'listing' : 'listings'}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { csrfFetch } from '@/lib/csrf-fetch';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await csrfFetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Could not open the billing portal.');
        setLoading(false);
      }
    } catch {
      setError('Could not open the billing portal. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={openPortal} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4 mr-2" />
        )}
        Manage billing
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

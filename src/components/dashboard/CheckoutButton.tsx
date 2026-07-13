'use client';

import { useState } from 'react';
import { csrfFetch } from '@/lib/csrf-fetch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type CheckoutProduct =
  | 'platform_monthly'
  | 'platform_yearly'
  | 'voice_addon_monthly'
  | 'voice_addon_yearly';

interface CheckoutButtonProps {
  product: CheckoutProduct;
  children: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
}

/**
 * Starts a Stripe Checkout session for a subscription product and redirects to
 * Stripe. The backend (/api/stripe/checkout) grants the plan via the webhook
 * after payment. Rendered only when NEXT_PUBLIC_ENABLE_SELF_SERVE_CHECKOUT is on.
 */
export function CheckoutButton({ product, children, className, variant }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const origin = window.location.origin;
      const res = await csrfFetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          successUrl: `${origin}/dashboard/billing?checkout=success`,
          cancelUrl: `${origin}/dashboard/billing?checkout=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error === 'upgrade_required' ? 'This plan is unavailable on your account.' : (data.error || 'Could not start checkout. Please try again.'));
        setLoading(false);
      }
    } catch {
      setError('Could not reach checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Button className={className} variant={variant} onClick={startCheckout} disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </Button>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}

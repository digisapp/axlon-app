'use client';

import { useState } from 'react';
import { csrfFetch } from '@/lib/csrf-fetch';
import { getSessionId, readAttribution } from '@/lib/microsites/attribution';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  micrositeId: string;
  ctaLabel: string;
  /** Pre-fills "which trailer" when the form sits on a product page. */
  productInterest?: string;
  productOptions?: string[];
  compact?: boolean;
}

const TIMEFRAMES = ['ASAP', 'Within 30 days', '1-3 months', 'Just researching'];

export function MicrositeLeadForm({
  micrositeId,
  ctaLabel,
  productInterest,
  productOptions = [],
  compact = false,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real visitor never fills a field they cannot see. Bots fill
    // every input. Silently "succeed" so the bot doesn't learn to adapt.
    if ((data.get('company_website') as string)?.trim()) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setError(null);

    try {
      const res = await csrfFetch('/api/microsites/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          microsite_id: micrositeId,
          buyer_name: (data.get('buyer_name') as string)?.trim(),
          buyer_email: (data.get('buyer_email') as string)?.trim(),
          buyer_phone: (data.get('buyer_phone') as string)?.trim() || null,
          message: (data.get('message') as string)?.trim() || null,
          product_interest:
            productInterest || (data.get('product_interest') as string) || null,
          timeframe: (data.get('timeframe') as string) || null,
          landing_path: window.location.pathname,
          referrer: document.referrer || null,
          session_id: getSessionId(),
          ...readAttribution(window.location.search, document.referrer),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong. Please try again.');
      }

      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-lg border bg-background p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: 'var(--ms-accent)' }} />
        <h3 className="mt-3 text-lg font-semibold">Request received</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A specialist will follow up shortly with pricing and availability.
        </p>
      </div>
    );
  }

  const field =
    'w-full rounded-md border bg-background px-3 py-2 text-base shadow-sm outline-none focus:ring-2 focus:ring-offset-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className={compact ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2'}>
        <div>
          <label htmlFor="ms-name" className="mb-1 block text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input id="ms-name" name="buyer_name" required maxLength={100} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="ms-email" className="mb-1 block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="ms-email" name="buyer_email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="ms-phone" className="mb-1 block text-sm font-medium">
            Phone
          </label>
          <input id="ms-phone" name="buyer_phone" type="tel" maxLength={20} autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="ms-timeframe" className="mb-1 block text-sm font-medium">
            Timeframe
          </label>
          <select id="ms-timeframe" name="timeframe" defaultValue="" className={field}>
            <option value="">Select…</option>
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!productInterest && productOptions.length > 0 && (
        <div>
          <label htmlFor="ms-product" className="mb-1 block text-sm font-medium">
            Trailer of interest
          </label>
          <select id="ms-product" name="product_interest" defaultValue="" className={field}>
            <option value="">Not sure yet</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="ms-message" className="mb-1 block text-sm font-medium">
          What are you hauling?
        </label>
        <textarea
          id="ms-message"
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Capacity, deck length, where you're located…"
          className={field}
        />
      </div>

      {/* Honeypot. Hidden from sighted users and from screen readers. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--ms-accent)' }}
      >
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'sending' ? 'Sending…' : ctaLabel}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No obligation. We&apos;ll only use your details to answer this request.
      </p>
    </form>
  );
}

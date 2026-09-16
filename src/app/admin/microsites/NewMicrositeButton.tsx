'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { csrfFetch } from '@/lib/csrf-fetch';
import { Plus, Loader2 } from 'lucide-react';

export function NewMicrositeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    try {
      const res = await csrfFetch('/api/admin/microsites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: (data.get('domain') as string)?.trim(),
          name: (data.get('name') as string)?.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Could not create microsite');
      setOpen(false);
      router.push(`/admin/microsites/${body.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create microsite');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add domain
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-3 rounded-lg border bg-card p-4 shadow-sm"
    >
      <div>
        <label htmlFor="domain" className="mb-1 block text-sm font-medium">
          Domain
        </label>
        <input
          id="domain"
          name="domain"
          required
          placeholder="xltrailers.com"
          className="w-full rounded-md border bg-background px-3 py-2 text-base"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Apex only — no https://, no www.
        </p>
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Site name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="XL Trailers"
          className="w-full rounded-md border bg-background px-3 py-2 text-base"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { csrfFetch } from '@/lib/csrf-fetch';
import { Loader2, Check } from 'lucide-react';

interface Manufacturer {
  id: string;
  name: string;
  slug: string;
}

// The subset of columns this form edits. Everything else on the row is
// managed elsewhere or not user-editable.
interface SiteRow {
  id: string;
  domain: string;
  name: string;
  status: string;
  manufacturer_id: string | null;
  product_type: string | null;
  listing_make: string | null;
  show_listings: boolean;
  headline: string | null;
  subheadline: string | null;
  hero_image_url: string | null;
  accent_color: string;
  cta_label: string;
  phone: string | null;
  disclaimer: string | null;
  lead_recipient_email: string | null;
  meta_title: string | null;
  meta_description: string | null;
  notes: string | null;
}

const input =
  'w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring';

export function MicrositeSettingsForm({
  site,
  manufacturers,
}: {
  site: SiteRow;
  manufacturers: Manufacturer[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const data = new FormData(e.currentTarget);
    const text = (key: string) => {
      const value = (data.get(key) as string | null)?.trim();
      return value ? value : null;
    };

    try {
      const res = await csrfFetch(`/api/admin/microsites/${site.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: text('name'),
          status: data.get('status'),
          manufacturer_id: text('manufacturer_id'),
          product_type: text('product_type'),
          listing_make: text('listing_make'),
          show_listings: data.get('show_listings') === 'on',
          headline: text('headline'),
          subheadline: text('subheadline'),
          hero_image_url: text('hero_image_url'),
          accent_color: data.get('accent_color'),
          cta_label: text('cta_label'),
          phone: text('phone'),
          disclaimer: text('disclaimer'),
          lead_recipient_email: text('lead_recipient_email'),
          meta_title: text('meta_title'),
          meta_description: text('meta_description'),
          notes: text('notes'),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Could not save');
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Content, routing and SEO for {site.domain}. A site only serves traffic while its
          status is <strong>live</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name" htmlFor="name">
              <input id="name" name="name" defaultValue={site.name} required className={input} />
            </Field>
            <Field label="Status" htmlFor="status">
              <select id="status" name="status" defaultValue={site.status} className={input}>
                <option value="draft">Draft — not served</option>
                <option value="live">Live — publicly served</option>
                <option value="paused">Paused — not served</option>
              </select>
            </Field>
          </section>

          <section className="space-y-4 border-t pt-5">
            <h3 className="text-sm font-semibold">What it shows</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Manufacturer catalog" htmlFor="manufacturer_id">
                <select
                  id="manufacturer_id"
                  name="manufacturer_id"
                  defaultValue={site.manufacturer_id ?? ''}
                  className={input}
                >
                  <option value="">None — listings only</option>
                  {manufacturers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Product type filter"
                htmlFor="product_type"
                hint="Optional, e.g. lowboy or extendable"
              >
                <input
                  id="product_type"
                  name="product_type"
                  defaultValue={site.product_type ?? ''}
                  className={input}
                />
              </Field>
              <Field
                label="Marketplace make filter"
                htmlFor="listing_make"
                hint="Matches listings whose make contains this"
              >
                <input
                  id="listing_make"
                  name="listing_make"
                  defaultValue={site.listing_make ?? ''}
                  className={input}
                />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <input
                  type="checkbox"
                  name="show_listings"
                  defaultChecked={site.show_listings}
                  className="h-4 w-4"
                />
                Show live marketplace inventory
              </label>
            </div>
          </section>

          <section className="space-y-4 border-t pt-5">
            <h3 className="text-sm font-semibold">Copy &amp; branding</h3>
            <Field label="Headline" htmlFor="headline">
              <input id="headline" name="headline" defaultValue={site.headline ?? ''} className={input} />
            </Field>
            <Field label="Sub-headline" htmlFor="subheadline">
              <textarea
                id="subheadline"
                name="subheadline"
                rows={2}
                defaultValue={site.subheadline ?? ''}
                className={input}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="CTA button" htmlFor="cta_label">
                <input id="cta_label" name="cta_label" defaultValue={site.cta_label} className={input} />
              </Field>
              <Field label="Accent colour" htmlFor="accent_color">
                <input
                  id="accent_color"
                  name="accent_color"
                  type="color"
                  defaultValue={site.accent_color}
                  className="h-10 w-full rounded-md border bg-background px-1"
                />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <input id="phone" name="phone" defaultValue={site.phone ?? ''} className={input} />
              </Field>
            </div>
            <Field label="Hero image URL" htmlFor="hero_image_url" hint="Must be a Supabase-hosted image">
              <input
                id="hero_image_url"
                name="hero_image_url"
                defaultValue={site.hero_image_url ?? ''}
                className={input}
              />
            </Field>
            <Field
              label="Affiliation disclaimer"
              htmlFor="disclaimer"
              hint="Shown in the footer of every page. Leave blank to use the generated wording."
            >
              <textarea
                id="disclaimer"
                name="disclaimer"
                rows={3}
                defaultValue={site.disclaimer ?? ''}
                className={input}
              />
            </Field>
          </section>

          <section className="space-y-4 border-t pt-5">
            <h3 className="text-sm font-semibold">Leads &amp; SEO</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Notify email"
                htmlFor="lead_recipient_email"
                hint="Where new leads are emailed"
              >
                <input
                  id="lead_recipient_email"
                  name="lead_recipient_email"
                  type="email"
                  defaultValue={site.lead_recipient_email ?? ''}
                  className={input}
                />
              </Field>
              <Field label="Meta title" htmlFor="meta_title">
                <input id="meta_title" name="meta_title" defaultValue={site.meta_title ?? ''} className={input} />
              </Field>
            </div>
            <Field label="Meta description" htmlFor="meta_description">
              <textarea
                id="meta_description"
                name="meta_description"
                rows={2}
                defaultValue={site.meta_description ?? ''}
                className={input}
              />
            </Field>
            <Field label="Internal notes" htmlFor="notes">
              <textarea id="notes" name="notes" rows={2} defaultValue={site.notes ?? ''} className={input} />
            </Field>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3 border-t pt-5">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
            {saved && !saving && (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

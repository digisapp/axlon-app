import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Truck } from 'lucide-react';
import {
  getMicrositeByHost,
  getMicrositeProduct,
  getMicrositeProducts,
} from '@/lib/microsites/resolve';
import { MicrositeLeadForm } from '@/components/microsites/MicrositeLeadForm';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';


interface PageProps {
  params: Promise<{ domain: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) return { robots: { index: false, follow: false } };

  const product = await getMicrositeProduct(site, slug);
  if (!product) return { robots: { index: false, follow: false } };

  const title = `${product.name} — Specs & Pricing | ${site.name}`;
  const description =
    product.short_description ||
    product.tagline ||
    `Specs, capacity and pricing for the ${product.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://${site.domain}/trailers/${product.slug}` },
    openGraph: { title, description, url: `https://${site.domain}/trailers/${product.slug}` },
  };
}

interface SpecRow {
  spec_category: string;
  spec_key: string;
  spec_value: string;
  spec_unit?: string | null;
  sort_order?: number | null;
}

export default async function MicrositeProductPage({ params }: PageProps) {
  const { domain, slug } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) notFound();

  const product = await getMicrositeProduct(site, slug);
  if (!product) notFound();

  const related = (await getMicrositeProducts(site, 7)).filter((p) => p.id !== product.id).slice(0, 3);

  const images = [...(product.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return 0;
  });
  const hero = images[0];

  const specs = ((product.specs ?? []) as unknown as SpecRow[]).slice().sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const specGroups = specs.reduce<Record<string, SpecRow[]>>((acc, s) => {
    (acc[s.spec_category] ||= []).push(s);
    return acc;
  }, {});

  const headline: [string, string | null][] = [
    ['Capacity', product.tonnage_max ? `${product.tonnage_max} ton` : null],
    ['Axles', product.axle_count ? String(product.axle_count) : null],
    ['Deck length', product.deck_length_feet ? `${product.deck_length_feet} ft` : null],
    ['Deck height', product.deck_height_inches ? `${product.deck_height_inches} in` : null],
    ['GVWR', product.gvwr_lbs ? `${product.gvwr_lbs.toLocaleString('en-US')} lb` : null],
  ];
  const headlineSpecs = headline.filter((row): row is [string, string] => row[1] !== null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All {site.manufacturer?.name ?? site.name} models
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            {hero ? (
              <Image
                src={hero.url}
                alt={hero.alt_text || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                unoptimized={isOptimizerBlockedImage(hero.url)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Truck className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img) => (
                <div key={img.url} className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={img.url}
                    alt={img.alt_text || product.name}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    unoptimized={isOptimizerBlockedImage(img.url)}
                  />
                </div>
              ))}
            </div>
          )}

          <h1 className="mt-8 text-3xl font-bold tracking-tight">{product.name}</h1>
          {product.tagline && <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>}

          {headlineSpecs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {headlineSpecs.map(([label, value]) => (
                <div key={label} className="rounded-lg border bg-card p-3">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {Object.keys(specGroups).length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="mt-4 space-y-6">
                {Object.entries(specGroups).map(([category, rows]) => (
                  <div key={category}>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {category}
                    </h3>
                    <dl className="divide-y rounded-lg border">
                      {rows.map((row) => (
                        <div key={`${category}-${row.spec_key}`} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                          <dt className="text-muted-foreground">{row.spec_key}</dt>
                          <dd className="text-right font-medium">
                            {row.spec_value}
                            {row.spec_unit ? ` ${row.spec_unit}` : ''}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quote form tracks alongside the specs on desktop. */}
        <aside>
          <div id="quote" className="scroll-mt-20 rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Get pricing on this trailer</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              We&apos;ll send availability and a real quote for the {product.name}.
            </p>
            <MicrositeLeadForm
              micrositeId={site.id}
              ctaLabel={site.cta_label}
              productInterest={product.name}
              compact
            />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="text-xl font-semibold">Other models</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {related.map((p) => {
              const img = p.images?.find((i) => i.is_primary) || p.images?.[0];
              return (
                <Link
                  key={p.id}
                  href={`/trailers/${p.slug}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={img.alt_text || p.name}
                        fill
                        sizes="33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={isOptimizerBlockedImage(img.url)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Truck className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold leading-tight group-hover:underline">{p.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

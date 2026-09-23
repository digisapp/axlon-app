import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  getMicrositeByHost,
  getMicrositeProduct,
  getMicrositeProducts,
} from '@/lib/microsites/resolve';
import { MicrositeLeadForm } from '@/components/microsites/MicrositeLeadForm';
import { JsonLd } from '@/components/microsites/JsonLd';
import { productJsonLd, productMetaDescription, productTypeExplainer } from '@/lib/microsites/content';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';
import { MicrositeProductCard, tonnageLabel } from '@/components/microsites/MicrositeProductCard';
import { TrailerArt } from '@/components/microsites/TrailerArt';


interface PageProps {
  params: Promise<{ domain: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) return { robots: { index: false, follow: false } };

  const product = await getMicrositeProduct(site, slug);
  if (!product) return { robots: { index: false, follow: false } };

  const maker = Array.isArray(product.manufacturer) ? product.manufacturer[0] : product.manufacturer;
  const title = `${product.name} — Specs & Pricing | ${site.name}`;
  // Previously short_description || tagline, which for a third of the catalog
  // was empty or a scraped two-word tagline ("Detachable Gooseneck") shown
  // under the search result. Built from what we actually know instead.
  const description = productMetaDescription(product, maker?.name, site.name);

  return {
    // Already ends in "| <site name>"; without `absolute` the root layout
    // appends its own suffix on top, producing "… | XL Trailers | Axleyard".
    title: { absolute: title },
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

  const maker = Array.isArray(product.manufacturer) ? product.manufacturer[0] : product.manufacturer;
  const explainer = productTypeExplainer(product.product_type);

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
      <JsonLd data={productJsonLd(site, product, maker?.name)} />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{site.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href="/#models" className="hover:text-foreground">Models</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-foreground" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          {/* contain, not cover: catalog shots are cut-outs, and cropping one
              to fill took the gooseneck or the axles off the trailer. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100">
            {hero ? (
              <Image
                src={hero.url}
                alt={hero.alt_text || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-4"
                unoptimized={isOptimizerBlockedImage(hero.url)}
              />
            ) : (
              <TrailerArt label={tonnageLabel(product.tonnage_min, product.tonnage_max)} />
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img) => (
                <div key={img.url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image
                    src={img.url}
                    alt={img.alt_text || product.name}
                    fill
                    sizes="25vw"
                    className="object-contain p-1.5"
                    unoptimized={isOptimizerBlockedImage(img.url)}
                  />
                </div>
              ))}
            </div>
          )}

          {maker?.name && !site.manufacturer_id && (
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--ms-accent)' }}>
              {maker.name}
            </p>
          )}
          <h1 className={`text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl ${maker?.name && !site.manufacturer_id ? 'mt-2' : 'mt-8'}`}>
            {product.name}
          </h1>
          {product.tagline && <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>}

          {headlineSpecs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {headlineSpecs.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                  style={{ borderTop: '3px solid var(--ms-accent)' }}
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
                  <dd className="mt-1 text-xl font-bold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Overview</h2>
              {/* The maker's own words, often in the first person. Say whose
                  they are, so "we" is never read as this site. */}
              {maker?.name && (
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  From {maker.name}
                </p>
              )}
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
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
                            {/* The scraper often left the unit in the value too
                                ("80,000 lbs" + "lbs", "10'" + "in"). Only a
                                bare number gets the unit appended. */}
                            {row.spec_unit && /^[\d.,\s-]+$/.test(row.spec_value) ? ` ${row.spec_unit}` : ''}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Substantive on every product, however little the scraper recovered.
              54% of the catalog has zero spec rows and 31% no description — a
              detail page that is title + photos + form is too thin to rank and
              reads as a doorway page. This section is about the trailer TYPE,
              so it is accurate for every product that carries the type. */}
          <section className="mt-10 rounded-xl border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold">About {explainer.plural}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{explainer.body}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Not sure this is the right type for your load?{' '}
              <a href="#quote" className="font-medium underline-offset-4 hover:underline" style={{ color: 'var(--ms-accent)' }}>
                Tell us what you are hauling
              </a>{' '}
              and we will recommend a capacity and deck.
            </p>
          </section>

        </div>

        {/* Quote form tracks alongside the specs on desktop. */}
        <aside>
          <div id="quote" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:sticky lg:top-24">
            <div className="h-1.5" style={{ backgroundColor: 'var(--ms-accent)' }} />
            <div className="p-5 sm:p-6">
            <h2 className="text-lg font-bold tracking-tight">Get pricing on this trailer</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              We&apos;ll send availability and a real quote for the {product.name}, usually within
              one business day.
            </p>
            <MicrositeLeadForm
              micrositeId={site.id}
              ctaLabel={site.cta_label}
              productInterest={product.name}
              compact
            />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Other models</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <MicrositeProductCard key={p.id} product={p} showMaker={!site.manufacturer_id} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

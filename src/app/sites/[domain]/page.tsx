import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck, ShieldCheck, Clock, Gauge, ArrowRight, MapPin } from 'lucide-react';
import {
  getMicrositeByHost,
  getMicrositeProducts,
  getMicrositeListings,
} from '@/lib/microsites/resolve';
import { MicrositeLeadForm } from '@/components/microsites/MicrositeLeadForm';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) return { robots: { index: false, follow: false } };

  const title = site.meta_title || site.headline || site.name;
  const description =
    site.meta_description ||
    site.subheadline ||
    `Compare trailers and request pricing from ${site.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://${site.domain}/` },
    openGraph: {
      title,
      description,
      url: `https://${site.domain}/`,
      siteName: site.name,
      type: 'website',
      ...(site.hero_image_url ? { images: [{ url: site.hero_image_url }] } : {}),
    },
  };
}

function formatPrice(price: number | null): string {
  if (!price) return 'Call for price';
  return `$${price.toLocaleString('en-US')}`;
}

function tonnage(min?: number | null, max?: number | null): string | null {
  if (min && max && min !== max) return `${min}-${max} Ton`;
  if (max) return `${max} Ton`;
  if (min) return `${min} Ton`;
  return null;
}

export default async function MicrositeLandingPage({ params }: PageProps) {
  const { domain } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) notFound();

  const [products, listings] = await Promise.all([
    getMicrositeProducts(site, 24),
    getMicrositeListings(site, 9),
  ]);

  const headline = site.headline || `${site.name} For Sale`;
  const subheadline =
    site.subheadline ||
    'Compare models, check specs and get pricing from dealers nationwide.';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {site.hero_image_url && (
          <>
            <Image
              src={site.hero_image_url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={isOptimizerBlockedImage(site.hero_image_url)}
            />
            <div className="absolute inset-0 bg-slate-950/70" />
          </>
        )}
        <div
          className={`relative mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_440px] lg:py-20 ${
            site.hero_image_url ? 'text-white' : ''
          }`}
        >
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {headline}
            </h1>
            <p
              className={`mt-4 max-w-xl text-lg ${
                site.hero_image_url ? 'text-slate-200' : 'text-muted-foreground'
              }`}
            >
              {subheadline}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Clock, label: 'Pricing within one business day' },
                { icon: ShieldCheck, label: 'Vetted dealer network' },
                { icon: Gauge, label: 'Specs compared side by side' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-2 text-sm">
                  <Icon
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: site.hero_image_url ? '#fff' : 'var(--ms-accent)' }}
                  />
                  <span className={site.hero_image_url ? 'text-slate-200' : 'text-muted-foreground'}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The form is above the fold on every screen size. This is a
              lead-gen page; the quote request is the primary content. */}
          <div id="quote" className="scroll-mt-20 rounded-xl border bg-background p-5 text-foreground shadow-xl sm:p-6">
            <h2 className="text-xl font-semibold">Request pricing</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Tell us what you need and we&apos;ll come back with real numbers.
            </p>
            <MicrositeLeadForm
              micrositeId={site.id}
              ctaLabel={site.cta_label}
              productOptions={products.map((p) => p.name)}
            />
          </div>
        </div>
      </section>

      {/* Catalog */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {site.manufacturer?.name ?? site.name} models
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {products.length} model{products.length === 1 ? '' : 's'} — tap any one for full specs and pricing.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const image =
                product.images?.find((i) => i.is_primary) || product.images?.[0];
              const ton = tonnage(product.tonnage_min, product.tonnage_max);
              return (
                <Link
                  key={product.id}
                  href={`/trailers/${product.slug}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt_text || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={isOptimizerBlockedImage(image.url)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Truck className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold leading-tight group-hover:underline">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {product.short_description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {ton && (
                        <span className="rounded bg-muted px-2 py-1 font-medium">{ton}</span>
                      )}
                      {product.axle_count && (
                        <span className="rounded bg-muted px-2 py-1 font-medium">
                          {product.axle_count} axle
                        </span>
                      )}
                      {product.deck_length_feet && (
                        <span className="rounded bg-muted px-2 py-1 font-medium">
                          {product.deck_length_feet}&apos; deck
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Live inventory */}
      {listings.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-bold tracking-tight">Available now</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Units currently listed for sale across our dealer network.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => {
                const image = listing.images?.[0];
                return (
                  <a
                    key={listing.id}
                    href={`https://axleyard.com/listing/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized={isOptimizerBlockedImage(image.url)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Truck className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold leading-tight group-hover:underline">
                        {listing.title}
                      </h3>
                      <p className="mt-2 text-lg font-bold" style={{ color: 'var(--ms-accent)' }}>
                        {formatPrice(listing.price)}
                      </p>
                      {(listing.city || listing.state) && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {[listing.city, listing.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Not sure which trailer fits your load?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us the weight, dimensions and where it&apos;s going. We&apos;ll come back
            with the models that work and what they cost.
          </p>
          <a
            href="#quote"
            className="mt-6 inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--ms-accent)' }}
          >
            {site.cta_label}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

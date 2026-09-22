import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck, Clock, Gauge, ArrowRight, MapPin, Phone } from 'lucide-react';
import {
  getMicrositeByHost,
  getMicrositeProducts,
  getMicrositeListings,
  getMarketplaceStats,
  catalogScope,
} from '@/lib/microsites/resolve';
import { landingFaqs, landingJsonLd } from '@/lib/microsites/content';
import { JsonLd } from '@/components/microsites/JsonLd';
import { MicrositeLeadForm } from '@/components/microsites/MicrositeLeadForm';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';


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
    // `absolute` escapes the root layout's "%s | Axleyard" template. A
    // microsite is not presented as Axleyard — it suppresses Axleyard's
    // JSON-LD for the same reason — and the suffix also pushed these titles
    // past the ~60 characters a search result will show, truncating the part
    // that was actually chosen for the snippet.
    title: { absolute: title },
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

  const [products, listings, stats] = await Promise.all([
    getMicrositeProducts(site, 24),
    getMicrositeListings(site, 9),
    getMarketplaceStats(),
  ]);
  const faqs = landingFaqs(site);
  const telHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, '')}` : null;

  // A category site draws from every manufacturer, so each card has to say
  // whose trailer it is — otherwise 16 makers' products read as one range.
  const { spansManufacturers } = catalogScope(site);

  const manufacturerCount = new Set(
    products
      .map((p) => (Array.isArray(p.manufacturer) ? p.manufacturer[0] : p.manufacturer)?.name)
      .filter(Boolean)
  ).size;

  const headline = site.headline || `${site.name} For Sale`;
  const subheadline =
    site.subheadline ||
    'Compare models, check specs and get pricing from dealers nationwide.';

  return (
    <>
      <JsonLd data={landingJsonLd(site, products, faqs)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {site.hero_image_url && (
          <>
            <Image
              src={site.hero_image_url}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
              unoptimized={isOptimizerBlockedImage(site.hero_image_url)}
            />
            <div className="absolute inset-0 bg-slate-950/70" />
          </>
        )}
        {/* Three grid children, ordered differently per breakpoint. On mobile
            the form comes second, straight after the headline — with the trust
            row above it the quote box started below the fold on a phone, which
            is where most of this traffic reads. On lg the form spans both rows
            of the right column, so the left column reads headline → trust row
            as before. */}
        <div
          className={`relative mx-auto grid max-w-6xl gap-x-10 gap-y-8 px-4 py-14 lg:grid-cols-[1.1fr_440px] lg:py-20 ${
            site.hero_image_url ? 'text-white' : ''
          }`}
        >
          <div className="order-1 flex flex-col justify-center lg:order-none">
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

            {telHref && (
              <p className={`mt-5 text-base ${site.hero_image_url ? 'text-slate-200' : 'text-muted-foreground'}`}>
                Prefer to talk?{' '}
                <a
                  href={telHref}
                  className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
                  style={{ color: site.hero_image_url ? '#fff' : 'var(--ms-accent)' }}
                >
                  <Phone className="h-4 w-4" />
                  {site.phone}
                </a>
              </p>
            )}
          </div>

          <ul className="order-3 grid gap-3 sm:grid-cols-3 lg:order-none lg:self-start">
              {[
                { icon: Clock, label: 'Pricing within one business day' },
                {
                  icon: MapPin,
                  // "Vetted dealer network" was here, with zero approved dealers
                  // behind it. Say something that is true and specific instead.
                  label: stats.states > 0 ? `Inventory across ${stats.states} states` : 'Dealer inventory nationwide',
                },
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

          {/* The form is above the fold on every screen size. This is a
              lead-gen page; the quote request is the primary content. */}
          <div
            id="quote"
            className="order-2 scroll-mt-20 rounded-xl border bg-background p-5 text-foreground shadow-xl sm:p-6 lg:order-none lg:row-span-2 lg:self-center"
          >
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

      {/* Numbers a buyer can check, not adjectives. Hidden entirely if the
          stats query failed rather than printing "0 trailers listed". */}
      {stats.listings > 0 && (
        <section className="border-b bg-muted/30">
          <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x px-4 py-5 text-center">
            {[
              { value: stats.listings.toLocaleString('en-US'), label: 'trailers listed' },
              { value: String(stats.manufacturers), label: 'manufacturers' },
              { value: String(stats.states), label: 'states' },
            ].map(({ value, label }) => (
              <div key={label} className="px-2">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tabular-nums sm:text-3xl" style={{ color: 'var(--ms-accent)' }}>
                    {value}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground sm:text-sm">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Catalog */}
      {products.length > 0 && (
        <section id="models" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {spansManufacturers ? 'Compare models' : `${site.manufacturer?.name ?? site.name} models`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {products.length} model{products.length === 1 ? '' : 's'}
                {spansManufacturers && manufacturerCount > 1
                  ? ` from ${manufacturerCount} manufacturers`
                  : ''}{' '}
                — tap any one for full specs and pricing.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const image =
                product.images?.find((i) => i.is_primary) || product.images?.[0];
              const ton = tonnage(product.tonnage_min, product.tonnage_max);
              const maker = Array.isArray(product.manufacturer)
                ? product.manufacturer[0]
                : product.manufacturer;
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
                    {spansManufacturers && maker?.name && (
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {maker.name}
                      </p>
                    )}
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
                  <div
                    key={listing.id}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
                  >
                    {/* Primary action is the quote, not the marketplace. A
                        visitor clicking a unit here is at peak intent; sending
                        them to axleyard.com in a new tab spent that intent on
                        a different domain and left this site with nothing. */}
                    <Link
                      href={`/?unit=${encodeURIComponent(listing.title)}#quote`}
                      className="flex flex-1 flex-col"
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
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t px-4 py-2.5">
                      <Link
                        href={`/?unit=${encodeURIComponent(listing.title)}#quote`}
                        className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                        style={{ color: 'var(--ms-accent)' }}
                      >
                        Get a price
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      {/* Kept, but secondary: some buyers want every photo and
                          spec before they'll talk to anyone. */}
                      <a
                        href={`https://axleyard.com/listing/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Full details
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ. Answers the objections that stop a form submission, and is
          emitted as FAQPage schema above for the same questions in search. */}
      {faqs.length > 0 && (
        <section className="border-t">
          <div className="mx-auto max-w-3xl px-4 py-14">
            <h2 className="text-2xl font-bold tracking-tight">Common questions</h2>
            <dl className="mt-6 divide-y">
              {faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-2 text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
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

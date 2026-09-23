import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Truck,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  Check,
  ClipboardList,
  Search,
  BadgeDollarSign,
  ChevronDown,
} from 'lucide-react';
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
import { MicrositeProductCard, primaryImage } from '@/components/microsites/MicrositeProductCard';
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

/** Models shown before "Show all" — three full rows on desktop. */
const MODELS_ABOVE_FOLD = 9;

function SectionHeading({
  eyebrow,
  title,
  children,
  center = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--ms-accent)' }}>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-base leading-relaxed text-slate-600">{children}</p>}
    </div>
  );
}

export default async function MicrositeLandingPage({ params }: PageProps) {
  const { domain } = await params;
  const site = await getMicrositeByHost(domain);
  if (!site) notFound();

  const [catalog, listings, stats] = await Promise.all([
    getMicrositeProducts(site, 24),
    getMicrositeListings(site, 9),
    getMarketplaceStats(),
  ]);
  const faqs = landingFaqs(site);
  const telHref = site.phone ? `tel:${site.phone.replace(/[^\d+]/g, '')}` : null;

  // Models with a real photo lead the grid. The catalog's own ranking is kept
  // within each half (stable sort) — this only stops a photo-less card from
  // being the first thing a visitor sees.
  const products = [...catalog].sort(
    (a, b) => Number(!primaryImage(a)) - Number(!primaryImage(b))
  );
  const leadModels = products.slice(0, MODELS_ABOVE_FOLD);
  const moreModels = products.slice(MODELS_ABOVE_FOLD);

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

  const trust = [
    'Real pricing within one business day',
    // "Vetted dealer network" was here, with zero approved dealers behind it.
    // Say something that is true and specific instead.
    stats.states > 0 ? `Dealer inventory across ${stats.states} states` : 'Dealer inventory nationwide',
    'No obligation — one request, no spam',
  ];

  return (
    <>
      <JsonLd data={landingJsonLd(site, products, faqs)} />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        {site.hero_image_url && (
          <Image
            src={site.hero_image_url}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="-z-20 object-cover"
            unoptimized={isOptimizerBlockedImage(site.hero_image_url)}
          />
        )}
        {/* Heavier on the text side so the headline holds up over any photo;
            the accent glow keeps a photo-less site from reading as a flat
            dark box. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 lg:bg-gradient-to-r lg:from-slate-950/95 lg:via-slate-950/80 lg:to-slate-950/40" />
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              'radial-gradient(60% 60% at 0% 100%, color-mix(in srgb, var(--ms-accent) 45%, transparent), transparent)',
          }}
        />

        {/* Three grid children, ordered per breakpoint. On mobile the form
            comes straight after the headline — with the trust list above it
            the quote box started below the fold on a phone, which is where
            most of this traffic reads. On lg the form spans both rows of the
            right column (placed explicitly: auto-flow put the form under the
            headline and the trust list beside it). */}
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-4 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1fr_440px] lg:pb-20 lg:pt-20">
          <div className="order-1 flex flex-col justify-end lg:col-start-1 lg:row-start-1">
            {products.length > 0 && (
              <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--ms-accent)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--ms-accent) 35%, transparent)' }} />
                {products.length} models
                {spansManufacturers && manufacturerCount > 1 ? ` · ${manufacturerCount} manufacturers` : ''}
                {listings.length > 0 ? ' · live dealer inventory' : ''}
              </p>
            )}
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{subheadline}</p>
          </div>

          <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start">
            <ul className="space-y-3">
              {trust.map((label) => (
                <li key={label} className="flex items-center gap-3 text-[15px] text-slate-200">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--ms-accent) 30%, transparent)' }}
                  >
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {telHref && (
              <a
                href={telHref}
                className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur transition hover:bg-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900">
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs text-slate-400">Prefer to talk?</span>
                  <span className="block text-base font-semibold tracking-wide">{site.phone}</span>
                </span>
              </a>
            )}
          </div>

          {/* The form is above the fold on every screen size. This is a
              lead-gen page; the quote request is the primary content. */}
          <div
            id="quote"
            className="order-2 scroll-mt-24 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
          >
            <div className="h-1.5" style={{ backgroundColor: 'var(--ms-accent)' }} />
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Request pricing</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tell us what you need — we&apos;ll come back with real numbers.
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <Clock className="h-3 w-3" />
                  1 business day
                </span>
              </div>
              <div className="mt-5">
                <MicrositeLeadForm
                  micrositeId={site.id}
                  ctaLabel={site.cta_label}
                  productOptions={products.map((p) => p.name)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Numbers a buyer can check, not adjectives. Hidden entirely if the
            stats query failed rather than printing "0 trailers listed". */}
        {stats.listings > 0 && (
          <div className="border-t border-white/10 bg-slate-950/60 backdrop-blur">
            <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10 px-4 py-6 text-center">
              {[
                { value: stats.listings.toLocaleString('en-US'), label: 'Trailers listed' },
                { value: String(stats.manufacturers), label: 'Manufacturers' },
                { value: String(stats.states), label: 'States' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col-reverse px-2">
                  <dt className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                    {label}
                  </dt>
                  <dd className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="How it works" title="One request. Real pricing." center>
            No sales funnel and no list prices that fall apart on the phone.
          </SectionHeading>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: 'Tell us the load',
                body: 'Weight, dimensions and how it loads. Name a model if you have one in mind — or don’t.',
              },
              {
                icon: Search,
                title: 'We match the trailer',
                body: 'A specialist picks the capacity, deck and neck type that fit, and finds who has it.',
              },
              {
                icon: BadgeDollarSign,
                title: 'Get a real quote',
                body: 'Pricing and availability from a dealer within one business day. No obligation to buy.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <span className="absolute right-5 top-4 text-5xl font-black tabular-nums text-slate-200">
                  {i + 1}
                </span>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: 'var(--ms-accent)' }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Catalog ──────────────────────────────────────────────────── */}
      {products.length > 0 && (
        <section id="models" className="scroll-mt-20 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Model catalog"
                title={spansManufacturers ? 'Compare models' : `${site.manufacturer?.name ?? site.name} models`}
              >
                {products.length} model{products.length === 1 ? '' : 's'}
                {spansManufacturers && manufacturerCount > 1
                  ? ` from ${manufacturerCount} manufacturers`
                  : ''}
                . Open any one for full specs, then ask for a price.
              </SectionHeading>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leadModels.map((product) => (
                <MicrositeProductCard key={product.id} product={product} showMaker={spansManufacturers} />
              ))}
            </div>

            {/* The rest of the catalog is one tap away rather than a
                24-card wall between the visitor and the inventory. Plain
                <details>: no client JS, and the links stay in the HTML for
                crawlers. */}
            {moreModels.length > 0 && (
              <details className="group mt-6">
                <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Show all {products.length} models</span>
                  <span className="hidden group-open:inline">Show fewer</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {moreModels.map((product) => (
                    <MicrositeProductCard key={product.id} product={product} showMaker={spansManufacturers} />
                  ))}
                </div>
              </details>
            )}
          </div>
        </section>
      )}

      {/* ─── Live inventory ───────────────────────────────────────────── */}
      {listings.length > 0 && (
        <section id="inventory" className="scroll-mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <SectionHeading eyebrow="In stock" title="Available now">
              Units currently listed for sale across our dealer network. Pick one and we&apos;ll
              confirm it&apos;s still there — and what it takes to buy it.
            </SectionHeading>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => {
                const image = listing.images?.[0];
                const hasPrice = Boolean(listing.price);
                return (
                  <div
                    key={listing.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {/* Primary action is the quote, not the marketplace. A
                        visitor clicking a unit here is at peak intent; sending
                        them to axleyard.com in a new tab spent that intent on
                        a different domain and left this site with nothing. */}
                    <Link
                      href={`/?unit=${encodeURIComponent(listing.title)}#quote`}
                      className="flex flex-1 flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={listing.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            unoptimized={isOptimizerBlockedImage(image.url)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Truck className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                        <span
                          className={`absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-sm font-bold shadow-lg ${
                            hasPrice ? 'bg-white text-slate-900' : 'bg-slate-900/80 text-white backdrop-blur'
                          }`}
                        >
                          {formatPrice(listing.price)}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900">
                          {listing.title}
                        </h3>
                        {(listing.city || listing.state) && (
                          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {[listing.city, listing.state].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
                      <Link
                        href={`/?unit=${encodeURIComponent(listing.title)}#quote`}
                        className="inline-flex items-center gap-1 text-sm font-semibold"
                        style={{ color: 'var(--ms-accent)' }}
                      >
                        Get a price
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      {/* Kept, but secondary: some buyers want every photo and
                          spec before they'll talk to anyone. */}
                      <a
                        href={`https://axleyard.com/listing/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
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

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      {/* Answers the objections that stop a form submission, and is emitted
          as FAQPage schema above for the same questions in search. <details>
          keeps every answer in the HTML, so the schema and the page match. */}
      {faqs.length > 0 && (
        <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <SectionHeading eyebrow="FAQ" title="Common questions">
                Straight answers on how this works. Anything else, just ask in the form.
              </SectionHeading>
              {telHref && (
                <a
                  href={telHref}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'var(--ms-accent)' }}
                >
                  <Phone className="h-4 w-4" />
                  Or call {site.phone}
                </a>
              )}
            </div>
            <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {faqs.map((f, i) => (
                <details key={f.q} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-900 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Closing CTA ──────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden" style={{ backgroundColor: 'var(--ms-accent)' }}>
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(80% 120% at 100% 0%, rgba(255,255,255,.18), transparent 60%)' }}
        />
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 text-white sm:py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Not sure which trailer fits your load?
            </h2>
            <p className="mt-2 text-white/85">
              Tell us the weight, dimensions and where it&apos;s going. We&apos;ll come back with
              the models that work and what they cost.
            </p>
          </div>
          <a
            href="#quote"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            {site.cta_label}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

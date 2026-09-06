import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Truck, ChevronRight, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/new-trailers/ProductCard';
import type { ManufacturerProduct } from '@/types';
import { jsonLdString } from '@/lib/seo/json-ld';

// The full catalog is ~390 products; rendering every card on the index made
// this a 2 MB page. Show a preview per manufacturer and link to the
// manufacturer's complete list (?manufacturer=slug), which renders all of
// its products on one page.
const PREVIEW_PER_MANUFACTURER = 8;

interface PageProps {
  searchParams: Promise<{ manufacturer?: string }>;
}

function createSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type ProductRow = ManufacturerProduct & {
  manufacturer: { id: string; name: string; slug: string } | null;
  images: { url: string; alt_text: string | null; is_primary: boolean | null }[] | null;
};

interface ManufacturerWithProducts {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  product_count: number | null;
  products: ManufacturerProduct[];
}

function slugOf(raw: string | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return /^[a-z0-9-]{1,80}$/.test(s) ? s : null;
}

async function fetchManufacturers(slug: string | null) {
  const supabase = createSupabase();
  let query = supabase
    .from('manufacturers')
    .select('id, name, slug, logo_url, short_description, product_count')
    .gt('product_count', 0)
    .eq('is_active', true)
    .order('name');
  if (slug) query = query.eq('slug', slug);
  const { data } = await query;
  return data ?? [];
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const slug = slugOf((await searchParams).manufacturer);
  if (slug) {
    const [mfr] = await fetchManufacturers(slug);
    if (mfr) {
      const title = `New ${mfr.name} Trailers`;
      const description = `Browse every new ${mfr.name} trailer and truck model in the Axleyard catalog. Compare tonnage, deck heights, axle counts, and gooseneck types.`;
      return {
        title,
        description,
        openGraph: { title: `${title} | Axleyard`, description },
        twitter: { card: 'summary_large_image', title: `${title} | Axleyard`, description },
        alternates: { canonical: `/new-trailers?manufacturer=${mfr.slug}` },
      };
    }
  }
  return {
    title: 'New Trailers | Browse Lowboy & Heavy Haul Trailers by Manufacturer',
    description: 'Browse new trucks, trailers, and heavy haul equipment from 18+ top manufacturers like Trail King, Fontaine, Talbert, Mack, Felling, and more. AI-powered comparison tools.',
    openGraph: {
      title: 'New Trailers & Trucks - Heavy Equipment Catalog | Axleyard',
      description: 'Browse new trailers and trucks from 18+ top manufacturers. Compare specs, tonnage, deck heights, and gooseneck types.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'New Trailers & Trucks - Heavy Equipment Catalog | Axleyard',
      description: 'Browse new trailers and trucks from 18+ manufacturers. Compare specs, tonnage, and deck heights.',
    },
    alternates: {
      canonical: '/new-trailers',
    },
  };
}

export default async function NewTrailersPage({ searchParams }: PageProps) {
  const slug = slugOf((await searchParams).manufacturer);
  const supabase = createSupabase();

  const manufacturers = await fetchManufacturers(slug);
  const manufacturerIds = manufacturers.map((m) => m.id);

  // Select only what ProductCard and the JSON-LD render — select('*')
  // shipped full descriptions/specs for every product. Only the primary
  // (or first) image per product is embedded.
  const { data: products } = manufacturerIds.length
    ? await supabase
        .from('manufacturer_products')
        .select(`
          id, name, slug, series, gooseneck_type, tonnage_min, tonnage_max,
          deck_height_inches, axle_count, sort_order,
          manufacturer:manufacturers!manufacturer_id(id, name, slug),
          images:manufacturer_product_images(url, alt_text, is_primary)
        `)
        .eq('is_active', true)
        .in('manufacturer_id', manufacturerIds)
        .order('is_primary', { referencedTable: 'images', ascending: false })
        .order('sort_order', { referencedTable: 'images', ascending: true })
        .limit(1, { referencedTable: 'images' })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
    : { data: [] };

  const productRows = (products ?? []) as unknown as ProductRow[];

  const grouped: ManufacturerWithProducts[] = [];
  for (const mfr of manufacturers) {
    const mfrProducts = productRows.filter((p) => p.manufacturer?.id === mfr.id);
    if (mfrProducts.length > 0) {
      grouped.push({ ...mfr, products: mfrProducts as ManufacturerProduct[] });
    }
  }

  const isSingle = !!slug;
  const totalProducts = productRows.length;
  const focused = isSingle ? grouped[0] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: focused ? `New ${focused.name} Trailers` : 'New Heavy Haul Trailers by Manufacturer',
    description: focused
      ? `Every new ${focused.name} model in the Axleyard catalog.`
      : 'Browse new lowboy trailers, heavy haul trailers, and specialized hauling equipment from top manufacturers.',
    numberOfItems: totalProducts,
    itemListElement: grouped.flatMap((mfr, mfrIndex) =>
      (isSingle ? mfr.products : mfr.products.slice(0, 5)).map((p, pIndex) => ({
        '@type': 'ListItem',
        position: mfrIndex * 5 + pIndex + 1,
        item: {
          '@type': 'Product',
          name: `${mfr.name} ${p.name}`,
          url: `https://axleyard.com/new-trailers/${mfr.slug}/${p.slug}`,
          brand: { '@type': 'Brand', name: mfr.name },
          image: p.images?.find((i) => i.is_primary)?.url || p.images?.[0]?.url || undefined,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {focused && (
            <Link
              href="/new-trailers"
              className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              All manufacturers
            </Link>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {focused ? `New ${focused.name} Trailers` : 'New Trailers'}
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            {focused
              ? focused.short_description ||
                `Every new ${focused.name} model in the catalog. Compare specs, tonnage ratings, deck heights, and more.`
              : "Browse the complete product catalog from America's top lowboy and heavy haul trailer manufacturers. Compare specs, tonnage ratings, deck heights, and more."}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            {!focused && (
              <>
                <span>{grouped.length} Manufacturers</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
              </>
            )}
            <span>{totalProducts} Products</span>
          </div>
        </div>
      </div>

      {/* Products by Manufacturer */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {grouped.length === 0 ? (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {isSingle ? 'Manufacturer not found' : 'No products yet'}
            </h2>
            <p className="text-muted-foreground">
              {isSingle ? (
                <Link href="/new-trailers" className="text-primary hover:underline">
                  Browse all manufacturers
                </Link>
              ) : (
                'Product catalog is being populated. Check back soon!'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map((mfr) => {
              const visible = isSingle ? mfr.products : mfr.products.slice(0, PREVIEW_PER_MANUFACTURER);
              const hidden = mfr.products.length - visible.length;
              return (
                <section key={mfr.id}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {isSingle ? (
                          `${mfr.products.length} models`
                        ) : (
                          <Link href={`/new-trailers?manufacturer=${mfr.slug}`} className="hover:text-primary">
                            {mfr.name}
                          </Link>
                        )}
                      </h2>
                      {!isSingle && mfr.short_description && (
                        <p className="text-sm text-muted-foreground mt-1 max-w-xl line-clamp-1">
                          {mfr.short_description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/manufacturers/${mfr.slug}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Manufacturer
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {visible.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {hidden > 0 && (
                    <div className="mt-4">
                      <Link
                        href={`/new-trailers?manufacturer=${mfr.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View all {mfr.products.length} {mfr.name} models
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

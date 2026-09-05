import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Truck, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/new-trailers/ProductCard';
import type { ManufacturerProduct } from '@/types';
import { jsonLdString } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
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

function createSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type ProductRow = ManufacturerProduct & {
  manufacturer: { id: string; name: string; slug: string; logo_url: string | null } | null;
  images: { id: string; url: string; alt_text: string | null; is_primary: boolean | null; sort_order: number | null }[] | null;
};

interface ManufacturerWithProducts {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  products: ManufacturerProduct[];
}

export default async function NewTrailersPage() {
  const supabase = createSupabase();

  // Fetch manufacturers and products in parallel. Every product row here is
  // serialized into the RSC payload, so select only what ProductCard and the
  // JSON-LD actually render — select('*') shipped full descriptions/specs for
  // every product and made this page a 4MB+ HTML document.
  const [{ data: manufacturers }, { data: products }] = await Promise.all([
    supabase
      .from('manufacturers')
      .select('id, name, slug, logo_url, short_description, product_count')
      .gt('product_count', 0)
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('manufacturer_products')
      .select(`
        id, name, slug, series, gooseneck_type, tonnage_min, tonnage_max,
        deck_height_inches, axle_count, sort_order,
        manufacturer:manufacturers!manufacturer_id(id, name, slug),
        images:manufacturer_product_images(url, alt_text, is_primary)
      `)
      .eq('is_active', true)
      // Only the primary (or first) image is rendered — products average ~14
      // images each, and shipping them all put ~5,600 image rows in the RSC
      // payload.
      .order('is_primary', { referencedTable: 'images', ascending: false })
      .order('sort_order', { referencedTable: 'images', ascending: true })
      .limit(1, { referencedTable: 'images' })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ]);

  // The narrowed select omits columns ManufacturerProduct declares (unused by
  // the card), and supabase-js types the to-one manufacturer embed as an
  // array; the runtime shape is what ProductCard reads, so cast once here.
  const productRows = (products ?? []) as unknown as ProductRow[];

  // Group products by manufacturer
  const groupedByManufacturer: ManufacturerWithProducts[] = [];
  if (manufacturers) {
    for (const mfr of manufacturers) {
      const mfrProducts = productRows.filter((p) => p.manufacturer?.id === mfr.id);
      if (mfrProducts.length > 0) {
        groupedByManufacturer.push({
          ...mfr,
          products: mfrProducts as ManufacturerProduct[],
        });
      }
    }
  }

  const totalProducts = productRows.length;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'New Heavy Haul Trailers by Manufacturer',
    description: 'Browse new lowboy trailers, heavy haul trailers, and specialized hauling equipment from top manufacturers.',
    numberOfItems: totalProducts,
    itemListElement: groupedByManufacturer.flatMap((mfr, mfrIndex) =>
      mfr.products.slice(0, 5).map((p, pIndex) => ({
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">New Trailers</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            Browse the complete product catalog from America&apos;s top lowboy and heavy haul trailer manufacturers.
            Compare specs, tonnage ratings, deck heights, and more.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span>{groupedByManufacturer.length} Manufacturers</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{totalProducts} Products</span>
          </div>
        </div>
      </div>

      {/* Products by Manufacturer */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {groupedByManufacturer.length === 0 ? (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products yet</h2>
            <p className="text-muted-foreground">
              Product catalog is being populated. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedByManufacturer.map((mfr) => (
              <section key={mfr.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{mfr.name}</h2>
                    {mfr.short_description && (
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
                  {mfr.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

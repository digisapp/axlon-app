import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Truck,
  Weight,
  Ruler,
  Layers,
  ExternalLink,
  MessageSquare,
  Search,
} from 'lucide-react';
import { jsonLdString } from '@/lib/seo/json-ld';

function createSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface PageProps {
  params: Promise<{ manufacturer: string; product: string }>;
}

interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
}

interface ProductSpec {
  id: string;
  spec_category: string;
  spec_key: string;
  spec_value: string;
  spec_unit: string | null;
  sort_order: number | null;
}

interface RelatedProductImage {
  url: string;
  alt_text: string | null;
  is_primary: boolean | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  series: string | null;
  product_type: string | null;
  tonnage_max: number | null;
  deck_height_inches: number | null;
  axle_count: number | null;
  images: RelatedProductImage[] | null;
}

async function getProduct(manufacturerSlug: string, productSlug: string) {
  const supabase = createSupabase();

  // First get the manufacturer
  const { data: manufacturer } = await supabase
    .from('manufacturers')
    .select('id, name, slug, logo_url, website, short_description, headquarters, founded_year')
    .eq('slug', manufacturerSlug)
    .eq('is_active', true)
    .single();

  if (!manufacturer) return null;

  // Then get the product
  const { data: product } = await supabase
    .from('manufacturer_products')
    .select(`
      *,
      images:manufacturer_product_images(id, url, alt_text, is_primary, sort_order),
      specs:manufacturer_product_specs(id, spec_category, spec_key, spec_value, spec_unit, sort_order)
    `)
    .eq('manufacturer_id', manufacturer.id)
    .eq('slug', productSlug)
    .eq('is_active', true)
    .single();

  if (!product) return null;

  // Get related products from same manufacturer
  const { data: relatedProducts } = await supabase
    .from('manufacturer_products')
    .select(`
      id, name, slug, series, product_type, tonnage_max, deck_height_inches, axle_count,
      images:manufacturer_product_images(url, alt_text, is_primary)
    `)
    .eq('manufacturer_id', manufacturer.id)
    .eq('is_active', true)
    .neq('id', product.id)
    .order('sort_order')
    .limit(4);

  return {
    ...product,
    manufacturer,
    relatedProducts: (relatedProducts || []).map((rp: RelatedProduct) => ({
      ...rp,
      manufacturer,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { manufacturer, product: productSlug } = await params;
  const product = await getProduct(manufacturer, productSlug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const specs = [
    product.tonnage_max ? `${product.tonnage_max} Ton` : null,
    product.deck_height_inches ? `${product.deck_height_inches}" Deck Height` : null,
    product.axle_count ? `${product.axle_count}-Axle` : null,
  ].filter(Boolean).join(' | ');

  return {
    // No brand suffix — the root layout's "%s | Axleyard" template appends it.
    title: `${product.name} by ${product.manufacturer.name} | New Trailers`,
    description: product.short_description || product.description || `${product.name} - ${specs}. View full specifications and details.`,
    openGraph: {
      title: `${product.name} - ${product.manufacturer.name}`,
      description: specs || product.short_description || undefined,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
    alternates: {
      canonical: `/new-trailers/${manufacturer}/${productSlug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { manufacturer: manufacturerSlug, product: productSlug } = await params;
  const product = await getProduct(manufacturerSlug, productSlug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.find((img: ProductImage) => img.is_primary) || product.images?.[0];
  const sortedImages = [...(product.images || [])].sort((a: ProductImage, b: ProductImage) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Group specs by category
  const specsByCategory: Record<string, ProductSpec[]> = {};
  if (product.specs) {
    for (const spec of product.specs) {
      if (!specsByCategory[spec.spec_category]) {
        specsByCategory[spec.spec_category] = [];
      }
      specsByCategory[spec.spec_category].push(spec);
    }
    for (const cat of Object.keys(specsByCategory)) {
      specsByCategory[cat].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
  }

  const gooseneckLabel = product.gooseneck_type
    ? product.gooseneck_type.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  const tonnageLabel = product.tonnage_min && product.tonnage_max && product.tonnage_min !== product.tonnage_max
    ? `${product.tonnage_min}-${product.tonnage_max} Ton`
    : product.tonnage_max
      ? `${product.tonnage_max} Ton`
      : null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.manufacturer.name} ${product.name}`,
    description: product.short_description || product.description || `${product.name} by ${product.manufacturer.name}`,
    image: sortedImages.map((img: ProductImage) => img.url),
    brand: {
      '@type': 'Brand',
      name: product.manufacturer.name,
    },
    category: 'Heavy Haul Trailers',
    ...(product.source_url && { url: product.source_url }),
    additionalProperty: [
      ...(tonnageLabel ? [{ '@type': 'PropertyValue', name: 'Capacity', value: tonnageLabel }] : []),
      ...(product.deck_height_inches ? [{ '@type': 'PropertyValue', name: 'Deck Height', value: `${product.deck_height_inches}"` }] : []),
      ...(product.axle_count ? [{ '@type': 'PropertyValue', name: 'Axles', value: `${product.axle_count}` }] : []),
      ...(gooseneckLabel ? [{ '@type': 'PropertyValue', name: 'Gooseneck Type', value: gooseneckLabel }] : []),
      ...(product.deck_length_feet ? [{ '@type': 'PropertyValue', name: 'Deck Length', value: `${product.deck_length_feet} ft` }] : []),
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'New Trailers', item: 'https://axleyard.com/new-trailers' },
      { '@type': 'ListItem', position: 2, name: product.manufacturer.name, item: `https://axleyard.com/manufacturers/${product.manufacturer.slug}` },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }} />
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/new-trailers" className="hover:text-foreground transition-colors">
              New Trailers
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/manufacturers/${product.manufacturer.slug}`} className="hover:text-foreground transition-colors">
              {product.manufacturer.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Gallery - Left */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-muted mb-4">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Truck className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sortedImages.map((img: ProductImage) => (
                  <div key={img.id} className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={img.url}
                      alt={img.alt_text || product.name}
                      fill
                      sizes="(max-width: 640px) 25vw, 120px"
                      className="object-cover"
                        />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <Badge variant="secondary" className="mb-3">
                {product.manufacturer.name}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              {product.series && (
                <p className="text-lg text-muted-foreground mb-1">{product.series} Series</p>
              )}
              {product.tagline && (
                <p className="text-muted-foreground italic mb-4">{product.tagline}</p>
              )}

              {/* Key Specs Cards */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {tonnageLabel && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <Weight className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-bold">{tonnageLabel}</p>
                    </CardContent>
                  </Card>
                )}
                {product.deck_height_inches && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Deck Height</p>
                      <p className="font-bold">{product.deck_height_inches}&quot;</p>
                    </CardContent>
                  </Card>
                )}
                {product.axle_count && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <Layers className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Axles</p>
                      <p className="font-bold">{product.axle_count}-Axle</p>
                    </CardContent>
                  </Card>
                )}
                {gooseneckLabel && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Gooseneck</p>
                      <p className="font-bold text-sm">{gooseneckLabel}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Additional quick specs */}
              <div className="mt-4 space-y-2 text-sm">
                {product.deck_length_feet && (
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Deck Length</span>
                    <span className="font-medium">{product.deck_length_feet} ft</span>
                  </div>
                )}
                {product.overall_length_feet && (
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Overall Length</span>
                    <span className="font-medium">{product.overall_length_feet} ft</span>
                  </div>
                )}
                {product.empty_weight_lbs && (
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Empty Weight</span>
                    <span className="font-medium">{product.empty_weight_lbs.toLocaleString()} lbs</span>
                  </div>
                )}
                {product.gvwr_lbs && (
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">GVWR</span>
                    <span className="font-medium">{product.gvwr_lbs.toLocaleString()} lbs</span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href={`/?q=Tell me about the ${product.manufacturer.name} ${product.name}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AXLON About This Trailer
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href={`/search?q=${encodeURIComponent(product.manufacturer.name + ' ' + (product.series || product.name))}`}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Used {product.name} For Sale
                  </Link>
                </Button>
                {product.source_url && (
                  <Button asChild variant="ghost" className="w-full" size="sm">
                    <a href={product.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on {product.manufacturer.name} Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">About This Trailer</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        )}

        {/* Full Specifications Table */}
        {Object.keys(specsByCategory).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Full Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(specsByCategory).map(([category, specs]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {specs.map((spec: ProductSpec) => (
                        <div key={spec.id} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">{spec.spec_key}</span>
                          <span className="text-sm font-medium text-right">
                            {spec.spec_value}{spec.spec_unit ? ` ${spec.spec_unit}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Manufacturer Info Card */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{product.manufacturer.name}</h3>
                  {product.manufacturer.short_description && (
                    <p className="text-sm text-muted-foreground mt-1">{product.manufacturer.short_description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    {product.manufacturer.headquarters && (
                      <span>{product.manufacturer.headquarters}</span>
                    )}
                    {product.manufacturer.founded_year && (
                      <span>Founded {product.manufacturer.founded_year}</span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/manufacturers/${product.manufacturer.slug}`}>View All Products</Link>
                    </Button>
                    {product.manufacturer.website && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={product.manufacturer.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">More from {product.manufacturer.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {product.relatedProducts.map((rp: RelatedProduct) => {
                const rpImage = rp.images?.find((i: RelatedProductImage) => i.is_primary) || rp.images?.[0];
                return (
                  <Link key={rp.id} href={`/new-trailers/${product.manufacturer.slug}/${rp.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="aspect-[4/3] relative bg-muted">
                        {rpImage ? (
                          <Image
                            src={rpImage.url}
                            alt={rpImage.alt_text || rp.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Truck className="w-10 h-10 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{rp.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[rp.tonnage_max ? `${rp.tonnage_max}T` : null, rp.deck_height_inches ? `${rp.deck_height_inches}"` : null, rp.axle_count ? `${rp.axle_count}-Axle` : null].filter(Boolean).join(' | ')}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

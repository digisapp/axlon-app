// Revalidate every 5 minutes - view tracking is client-side
export const revalidate = 300;

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Gauge,
  Shield,
  TrendingUp,
  Check,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { FavoriteButton } from '@/components/listings/FavoriteButton';
import { ContactSeller } from '@/components/listings/ContactSeller';
import { ShareButton } from '@/components/listings/ShareButton';
import { ImageGallery } from '@/components/listings/ImageGallery';
import { TrackViewClient } from '@/components/listings/TrackViewClient';
import { RecentlyViewed } from '@/components/listings/RecentlyViewed';
import { CompareButton } from '@/components/listings/CompareButton';
import { getImageSrc } from '@/lib/utils';
import { FinancingCalculator } from '@/components/listings/FinancingCalculator';
import { VideoPlayer } from '@/components/listings/VideoPlayer';
import { TranslatableTitle, TranslatableDescription } from '@/components/listings/TranslatableContent';
import { SimilarListingCard } from '@/components/listings/SimilarListingCard';
import { DealerAIChat } from '@/components/listings/DealerAIChat';
import { MobileContactCTA } from '@/components/listings/MobileContactCTA';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select(`
      title, description, price, year, make, model, condition, city, state,
      images:listing_images!left(url, is_primary)
    `)
    .eq('id', id)
    .single();

  if (!listing) {
    return {
      title: 'Listing Not Found',
      description: 'This listing is no longer available.',
    };
  }

  const primaryImage = listing.images?.find((img: { is_primary: boolean }) => img.is_primary) || listing.images?.[0];
  const imageUrl = primaryImage?.url || '/images/og-image.png';

  // Build descriptive title and description
  const titleParts = [listing.year, listing.make, listing.model].filter(Boolean);
  const metaTitle = titleParts.length > 0
    ? `${titleParts.join(' ')} for Sale`
    : listing.title;

  const priceText = listing.price ? `$${listing.price.toLocaleString()}` : 'Contact for price';
  const locationText = [listing.city, listing.state].filter(Boolean).join(', ');

  const conditionText = listing.condition ? `${listing.condition} ` : '';
  const metaDescription = listing.description
    ? listing.description.slice(0, 155) + (listing.description.length > 155 ? '...' : '')
    : `${conditionText}${metaTitle} - ${priceText}${locationText ? ` in ${locationText}` : ''}. Browse trucks, trailers, and equipment on AXLON AI.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/listing/${id}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      url: `${baseUrl}/listing/${id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

// JSON-LD Product Schema for rich search results
interface ListingUser {
  is_business?: boolean;
  company_name?: string;
}

interface ListingForSchema {
  title?: string;
  description?: string;
  year?: number;
  make?: string;
  model?: string;
  condition?: string;
  status?: string;
  price?: number;
  vin?: string;
  mileage?: number;
  images?: Array<{ url: string; is_primary?: boolean }>;
  user?: ListingUser;
  category?: { name?: string; slug?: string } | null;
}

function getConditionUrl(condition?: string): string {
  switch (condition) {
    case 'new': return 'https://schema.org/NewCondition';
    case 'used': return 'https://schema.org/UsedCondition';
    case 'certified': return 'https://schema.org/UsedCondition';
    case 'salvage': return 'https://schema.org/DamagedCondition';
    default: return 'https://schema.org/UsedCondition';
  }
}

function ProductJsonLd({ listing, url }: { listing: ListingForSchema; url: string }) {
  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0];
  const description = listing.description
    ? listing.description.slice(0, 500)
    : `${[listing.year, listing.make, listing.model].filter(Boolean).join(' ')}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description,
    image: primaryImage?.url,
    url: url,
    brand: listing.make ? {
      '@type': 'Brand',
      name: listing.make,
    } : undefined,
    model: listing.model,
    ...(listing.vin && { sku: listing.vin }),
    productionDate: listing.year?.toString(),
    itemCondition: getConditionUrl(listing.condition),
    offers: {
      '@type': 'Offer',
      price: listing.price || undefined,
      priceCurrency: 'USD',
      availability: listing.status === 'sold'
        ? 'https://schema.org/SoldOut'
        : listing.status === 'pending'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/InStock',
      url: url,
      seller: listing.user ? {
        '@type': listing.user.is_business ? 'Organization' : 'Person',
        name: listing.user.company_name || 'Private Seller',
      } : undefined,
    },
    ...(listing.vin && { vehicleIdentificationNumber: listing.vin }),
    ...(listing.mileage && { mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: listing.mileage,
      unitCode: 'SMI',
    }}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb JSON-LD for better search result display
function BreadcrumbJsonLd({ listing, baseUrl }: { listing: ListingForSchema; baseUrl: string }) {
  const items = [
    { name: 'Home', url: baseUrl },
    { name: 'Search', url: `${baseUrl}/search` },
  ];

  if (listing.category?.name && listing.category?.slug) {
    items.push({
      name: listing.category.name,
      url: `${baseUrl}/search?category=${listing.category.slug}`,
    });
  }

  items.push({
    name: listing.title || 'Listing',
    url: '',
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories!left(id, name, slug),
      images:listing_images!left(id, url, thumbnail_url, is_primary, sort_order, ai_analysis),
      user:profiles!listings_user_id_fkey(id, company_name, phone, email, avatar_url, is_business, created_at)
    `)
    .eq('id', id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // Capture current time once to avoid impure Date.now() calls during render.
  // eslint-disable-next-line react-hooks/purity -- server component: renders once per request
  const now = Date.now();

  // View counting is owned by TrackViewClient → /api/listings/[id]/view
  // (session-deduped, Redis-batched). Do not also increment here: every
  // request (bots, prefetches, the owner) would double-count.

  // Get similar listings — build the .or() only from non-null values
  // (category_id.eq.null fails the UUID cast and errors the whole query),
  // and escape make to keep it from corrupting the filter expression
  const similarConditions: string[] = [];
  if (listing.make) {
    const safeMake = String(listing.make).replace(/[\\(),."']/g, '');
    if (safeMake) similarConditions.push(`make.eq.${safeMake}`);
  }
  if (listing.category_id) {
    similarConditions.push(`category_id.eq.${listing.category_id}`);
  }

  let similarListings:
    | Array<{
        id: string;
        title: string;
        price: number | null;
        year: number | null;
        make: string | null;
        model: string | null;
        city: string | null;
        state: string | null;
        images: { url: string; is_primary?: boolean }[] | null;
      }>
    | null = null;
  if (similarConditions.length > 0) {
    const { data } = await supabase
      .from('listings')
      .select(`
        id, title, price, year, make, model, city, state,
        images:listing_images!left(url, is_primary)
      `)
      .eq('status', 'active')
      .neq('id', id)
      .or(similarConditions.join(','))
      .limit(4);
    similarListings = data;
  }

  // Sort images by sort_order, primary first
  const sortedImages = [...(listing.images || [])]
    .sort((a: { is_primary: boolean; sort_order: number }, b: { is_primary: boolean; sort_order: number }) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  // Prepare data for tracking
  const primaryImage = sortedImages[0];
  const trackingData = {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    year: listing.year,
    make: listing.make,
    model: listing.model,
    city: listing.city,
    state: listing.state,
    imageUrl: primaryImage?.url || null,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';
  const listingUrl = `${baseUrl}/listing/${id}`;

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Product + Breadcrumb Schema for SEO */}
      <ProductJsonLd listing={listing as ListingForSchema} url={listingUrl} />
      <BreadcrumbJsonLd listing={listing as ListingForSchema} baseUrl={baseUrl} />

      {/* Track view client-side */}
      <TrackViewClient listing={trackingData} />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-24 lg:pb-6">
        {/* Breadcrumb + Actions - Mobile */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <CompareButton
              listing={{
                id: listing.id,
                title: listing.title,
                price: listing.price,
                year: listing.year,
                make: listing.make,
                model: listing.model,
                mileage: listing.mileage,
                hours: listing.hours,
                condition: listing.condition,
                image_url: getImageSrc(sortedImages[0]) || undefined,
              }}
              variant="icon"
            />
            <FavoriteButton listingId={id} size="sm" />
            <ShareButton title={listing.title} size="sm" />
          </div>
        </div>

        {/* Breadcrumb + Actions - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <Breadcrumbs
            items={[
              { label: 'Search', href: '/search' },
              ...(listing.category?.name
                ? [{ label: listing.category.name, href: `/search?category=${listing.category?.slug || ''}` }]
                : []),
              { label: listing.title },
            ]}
          />
          <div className="flex items-center gap-2">
            <CompareButton
              listing={{
                id: listing.id,
                title: listing.title,
                price: listing.price,
                year: listing.year,
                make: listing.make,
                model: listing.model,
                mileage: listing.mileage,
                hours: listing.hours,
                condition: listing.condition,
                image_url: getImageSrc(sortedImages[0]) || undefined,
              }}
              variant="icon"
            />
            <FavoriteButton listingId={id} />
            <ShareButton title={listing.title} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <ImageGallery images={sortedImages} title={listing.title} />
              {listing.is_featured && (
                <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-secondary text-secondary-foreground z-10">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    <TranslatableTitle
                      listingId={listing.id}
                      originalTitle={listing.title}
                    />
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-sm text-muted-foreground">
                    {listing.year && <span>{listing.year}</span>}
                    {listing.make && <span>{listing.make}</span>}
                    {listing.model && <span>{listing.model}</span>}
                    {listing.condition && (
                      <Badge variant="outline" className="capitalize text-xs">
                        {listing.condition}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {listing.price ? `$${listing.price.toLocaleString()}` : 'Call for Price'}
                  </p>
                  {listing.price_type === 'negotiable' && (
                    <p className="text-sm text-muted-foreground">Negotiable</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Price Analysis */}
            {listing.ai_price_estimate && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Axlon&apos;s Price Analysis</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        Estimated market value:{' '}
                        <strong>${listing.ai_price_estimate.toLocaleString()}</strong>
                        {listing.ai_price_confidence && (
                          <span className="ml-2">
                            ({Math.round(listing.ai_price_confidence * 100)}% confidence)
                          </span>
                        )}
                      </p>
                      {listing.price && listing.ai_price_estimate && (
                        <p className="text-xs md:text-sm mt-1">
                          {listing.price < listing.ai_price_estimate * 0.95 ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3 md:w-4 md:h-4" />
                              Good deal - below market value
                            </span>
                          ) : listing.price > listing.ai_price_estimate * 1.05 ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                              Above estimated market value
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Fair market price
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {listing.year && (
                    <DetailRow icon={<Calendar className="w-4 h-4" />} label="Year" value={listing.year} />
                  )}
                  {listing.make && (
                    <DetailRow icon={null} label="Make" value={listing.make} />
                  )}
                  {listing.model && (
                    <DetailRow icon={null} label="Model" value={listing.model} />
                  )}
                  {listing.mileage && (
                    <DetailRow
                      icon={<Gauge className="w-4 h-4" />}
                      label="Mileage"
                      value={`${listing.mileage.toLocaleString()} mi`}
                    />
                  )}
                  {listing.hours && (
                    <DetailRow icon={null} label="Hours" value={listing.hours.toLocaleString()} />
                  )}
                  {listing.vin && (
                    <DetailRow icon={<Shield className="w-4 h-4" />} label="VIN" value={listing.vin} />
                  )}
                  {listing.condition && (
                    <DetailRow icon={null} label="Condition" value={listing.condition} />
                  )}
                  {(listing.city || listing.state) && (
                    <DetailRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Location"
                      value={[listing.city, listing.state].filter(Boolean).join(', ')}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-base md:text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {Object.entries(listing.specs).map(([key, value]) => (
                      <DetailRow
                        key={key}
                        icon={null}
                        label={key.replace(/_/g, ' ')}
                        value={String(value)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {listing.description && (
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-base md:text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <TranslatableDescription
                    listingId={listing.id}
                    originalTitle={listing.title}
                    originalDescription={listing.description}
                    className="text-sm md:text-base"
                  />
                </CardContent>
              </Card>
            )}

            {/* Video Walkaround */}
            {listing.video_url && (
              <VideoPlayer videoUrl={listing.video_url} title={listing.title} />
            )}
            {/* AI Video Preview - disabled until pricing improves
            {!listing.video_url && listing.ai_video_preview_url && (
              <VideoPlayer videoUrl={listing.ai_video_preview_url} title={listing.title} isAIPreview />
            )}
            */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form - Routes to AXLON AI */}
            <div id="contact-seller" className="scroll-mt-20">
              <ContactSeller
                listingId={id}
                sellerId={listing.user?.id || ''}
                listingTitle={listing.title}
              />
            </div>

            {/* AI Chat Widget */}
            {listing.user?.id && listing.user?.is_business && (
              <DealerAIChat
                dealerId={listing.user.id}
                dealerName={listing.user.company_name || 'Dealer'}
                listingId={id}
                listingTitle={listing.title}
              />
            )}

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{listing.views_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.floor((now - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-sm text-muted-foreground">Days Listed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financing Calculator */}
            {listing.price && listing.price > 0 && (
              <FinancingCalculator listingPrice={listing.price} />
            )}

          </div>
        </div>

        {/* Similar Listings */}
        {similarListings && similarListings.length > 0 && (
          <div className="mt-8 md:mt-12">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Similar Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {similarListings.map((item) => (
                <SimilarListingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <div className="mt-8 md:mt-12">
          <RecentlyViewed currentListingId={id} maxItems={6} />
        </div>

      </div>

      {/* Fixed bottom contact bar - mobile/tablet only */}
      <MobileContactCTA phone={listing.user?.phone || null} />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-muted-foreground capitalize">{label}</p>
        <p className="font-medium text-sm md:text-base truncate">{value}</p>
      </div>
    </div>
  );
}

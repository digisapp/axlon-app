'use client';

import { useState, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AISearchBar } from '@/components/search/AISearchBar';
import { useListingTranslations } from '@/hooks/useListingTranslations';
import { useSearchListings } from '@/hooks/useSearchListings';
import { useCategories } from '@/hooks/useCategories';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/search/MapView').then((mod) => mod.MapViewWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Loading map...</span>
      </div>
    ),
  }
);
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Grid3X3,
  List,
  Map,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  Truck,
  Clock,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { AdvancedFilters, FilterValues } from '@/components/search/AdvancedFilters';
import { SaveSearchButton } from '@/components/search/SaveSearchButton';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SearchListingCard } from '@/components/search/SearchListingCard';
import { QuickFilterChip } from '@/components/search/QuickFilterChip';

// Sort URL param to internal value mapping
const SORT_MAP: Record<string, string> = {
  price: 'price',
  price_desc: 'price_desc',
  year: 'year',
  mileage: 'mileage',
  created_at: 'created_at',
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const initialSort = SORT_MAP[searchParams.get('sort') || ''] || 'created_at';

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({});
  const [useInfiniteMode, setUseInfiniteMode] = useState(false);

  const categories = useCategories();

  const {
    listings,
    totalCount,
    totalPages,
    isLoading,
    isLoadingMore,
    totalWithoutPriceFilter,
    handleLoadMore,
  } = useSearchListings(query, category, page, sortBy, advancedFilters, searchParams.toString());

  // Memoize listing data for translation hook
  const translationInput = useMemo(
    () => listings.map((l) => ({ id: l.id, title: l.title, description: l.description })),
    [listings]
  );
  const { getTranslatedListing } = useListingTranslations(translationInput);

  const handlePageChange = useCallback((newPage: number) => {
    if (useInfiniteMode) setUseInfiniteMode(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [useInfiniteMode, searchParams, router]);

  const handleQuickFilter = useCallback((filter: FilterValues) => {
    setAdvancedFilters((prev) => {
      // Check if this exact filter is already active
      const isActive = Object.entries(filter).every(
        ([key, value]) => JSON.stringify(prev[key as keyof FilterValues]) === JSON.stringify(value)
      );
      return isActive ? {} : filter;
    });
  }, []);

  const activeFilterCount = Object.keys(advancedFilters).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Bar */}
      <div className="md:hidden sticky top-14 z-40 bg-background border-b px-4 py-3">
        <AISearchBar defaultValue={query} size="small" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Desktop Search Bar */}
        <div className="hidden md:block mb-6">
          <AISearchBar defaultValue={query} />
        </div>

        {/* Price filter fallback notice */}
        {totalWithoutPriceFilter !== null && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-xs md:text-sm text-amber-700 dark:text-amber-400">
              No listings found with that price range. Showing all {totalWithoutPriceFilter} matching listings (most are &quot;Call for Price&quot;).
            </p>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6 overflow-x-auto pb-1">
          <QuickFilterChip
            label="Under $50K"
            icon={<DollarSign className="w-3 h-3" />}
            isActive={advancedFilters.priceMax === 50000 && !advancedFilters.category}
            onClick={() => handleQuickFilter({ priceMax: 50000 })}
          />
          <QuickFilterChip
            label="Under $100K"
            icon={<DollarSign className="w-3 h-3" />}
            isActive={advancedFilters.priceMax === 100000 && !advancedFilters.category}
            onClick={() => handleQuickFilter({ priceMax: 100000 })}
          />
          <QuickFilterChip
            label="2020+"
            icon={<Clock className="w-3 h-3" />}
            isActive={advancedFilters.yearMin === 2020 && !advancedFilters.category}
            onClick={() => handleQuickFilter({ yearMin: 2020 })}
          />
          <QuickFilterChip
            label="Low Miles"
            icon={<Gauge className="w-3 h-3" />}
            isActive={advancedFilters.mileageMax === 200000 && !advancedFilters.category}
            onClick={() => handleQuickFilter({ mileageMax: 200000 })}
          />

          <div className="w-px h-6 bg-border self-center hidden sm:block" />

          <QuickFilterChip
            label="New Trucks"
            icon={<Sparkles className="w-3 h-3" />}
            isActive={advancedFilters.category === 'trucks' && (advancedFilters.conditions?.includes('new') || false)}
            onClick={() => handleQuickFilter({ category: 'trucks', conditions: ['new'] })}
          />
          <QuickFilterChip
            label="Used Trucks"
            icon={<Truck className="w-3 h-3" />}
            isActive={advancedFilters.category === 'trucks' && (advancedFilters.conditions?.includes('used') || false)}
            onClick={() => handleQuickFilter({ category: 'trucks', conditions: ['used'] })}
          />
          <QuickFilterChip
            label="Trailers"
            isActive={advancedFilters.category === 'trailers' && !advancedFilters.conditions?.length}
            onClick={() => handleQuickFilter({ category: 'trailers' })}
          />
          <QuickFilterChip
            label="New Trailers"
            icon={<Sparkles className="w-3 h-3" />}
            isActive={false}
            onClick={() => router.push('/new-trailers')}
          />
          <QuickFilterChip
            label="Equipment"
            isActive={advancedFilters.category === 'heavy-equipment'}
            onClick={() => handleQuickFilter({ category: 'heavy-equipment' })}
          />

          {activeFilterCount > 0 && (
            <button
              onClick={() => setAdvancedFilters({})}
              className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1.5"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold line-clamp-1">
              {query ? `Results for "${query}"` : category ? `${category.replace(/-/g, ' ')}` : 'All Listings'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalCount.toLocaleString()} listings found
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(query || activeFilterCount > 0) && (
              <SaveSearchButton
                query={query}
                filters={advancedFilters as Record<string, unknown>}
              />
            )}

            {/* Mobile Filter Button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 md:hidden">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <AdvancedFilters
                    filters={advancedFilters}
                    onFiltersChange={setAdvancedFilters}
                    categories={categories}
                    onClose={() => setFiltersOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hidden md:flex">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <AdvancedFilters
                    filters={advancedFilters}
                    onFiltersChange={setAdvancedFilters}
                    categories={categories}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 md:w-40 flex-shrink-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="year">Year: Newest</SelectItem>
                <SelectItem value="mileage">Mileage: Lowest</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex border rounded-lg overflow-hidden flex-shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('map')}
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Map Toggle */}
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'outline'}
              size="sm"
              className="sm:hidden flex-shrink-0"
              onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Results Grid / Map */}
        {viewMode === 'map' ? (
          <MapView
            listings={listings}
            isLoading={isLoading}
            onClose={() => setViewMode('grid')}
          />
        ) : isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4' : 'space-y-4'}>
            {[...Array(8)].map((_, i) => (
              <ListingCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold mb-2">Axlon couldn&apos;t find a match</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-md mx-auto">
              No listings match your search. Try different keywords or adjust your filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/search">Browse All Listings</Link>
              </Button>
              <Button asChild>
                <Link href="/">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask Axlon
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4' : 'space-y-4'}>
            {listings.map((listing) => {
              const translated = getTranslatedListing(listing);
              return (
                <SearchListingCard
                  key={listing.id}
                  listing={listing}
                  viewMode={viewMode}
                  translatedTitle={translated.title}
                  translatedDescription={translated.description}
                  isTranslated={translated.isTranslated}
                />
              );
            })}
          </div>
        )}

        {/* Pagination / Load More */}
        {totalPages > 1 && viewMode !== 'map' && (
          <div className="flex flex-col items-center gap-4 mt-6 md:mt-8">
            {page < totalPages && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {listings.length} of {totalCount.toLocaleString()} results
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setUseInfiniteMode(true); handleLoadMore(); }}
                  disabled={isLoadingMore}
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              <span className="text-sm text-muted-foreground px-2 md:px-4">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {(totalPages === 1 || page >= totalPages) && listings.length > 0 && viewMode !== 'map' && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Showing all {listings.length} results
          </p>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}

function ListingCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' | 'map' }) {
  if (viewMode === 'list') {
    return (
      <Card className="flex flex-col sm:flex-row overflow-hidden">
        <Skeleton className="w-full sm:w-48 md:w-64 h-48 sm:h-40 md:h-48" />
        <div className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3">
          <Skeleton className="h-5 md:h-6 w-3/4" />
          <Skeleton className="h-6 md:h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 hidden md:block" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-2 md:p-4 space-y-2 md:space-y-3">
        <Skeleton className="h-4 md:h-5 w-3/4" />
        <Skeleton className="h-5 md:h-6 w-24" />
        <Skeleton className="h-3 md:h-4 w-1/2" />
      </div>
    </Card>
  );
}

export default function SearchPageClient() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

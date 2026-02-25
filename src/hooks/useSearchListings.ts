import { useEffect, useState, useRef, useCallback } from 'react';
import type { Listing, AISearchResult } from '@/types';
import type { FilterValues } from '@/components/search/AdvancedFilters';
import { logger } from '@/lib/logger';

// Category keywords for fallback detection when AI search fails
const CATEGORY_KEYWORDS: Record<string, string> = {
  trailers: 'trailers',
  trailer: 'trailers',
  trucks: 'trucks',
  truck: 'trucks',
  equipment: 'heavy-equipment',
  'heavy equipment': 'heavy-equipment',
};

/** Build URLSearchParams from sort, category, filters, and AI filters */
export function buildSearchParams(opts: {
  page: number;
  sortBy: string;
  category: string;
  advancedFilters: FilterValues;
  aiFilters?: AISearchResult['filters'] | null;
  query?: string;
  detectedCategory?: string;
}): URLSearchParams {
  const { page, sortBy, category, advancedFilters, aiFilters, query, detectedCategory } = opts;
  const params = new URLSearchParams();

  params.set('page', page.toString());

  // Map client sort values to API sort + order params
  if (sortBy === 'price_desc') {
    params.set('sort', 'price');
    params.set('order', 'desc');
  } else if (sortBy === 'price') {
    params.set('sort', 'price');
    params.set('order', 'asc');
  } else {
    params.set('sort', sortBy);
  }

  if (category) params.set('category', category);

  // Add advanced filters
  if (advancedFilters.priceMin) params.set('min_price', advancedFilters.priceMin.toString());
  if (advancedFilters.priceMax) params.set('max_price', advancedFilters.priceMax.toString());
  if (advancedFilters.yearMin) params.set('min_year', advancedFilters.yearMin.toString());
  if (advancedFilters.yearMax) params.set('max_year', advancedFilters.yearMax.toString());
  if (advancedFilters.mileageMax) params.set('max_mileage', advancedFilters.mileageMax.toString());
  if (advancedFilters.makes?.length) params.set('make', advancedFilters.makes.join(','));
  if (advancedFilters.conditions?.length) params.set('condition', advancedFilters.conditions.join(','));
  if (advancedFilters.states?.length) params.set('state', advancedFilters.states.join(','));
  if (advancedFilters.category) params.set('category', advancedFilters.category);

  // Add AI-extracted filters (only where user hasn't set manual filters)
  if (aiFilters) {
    const f = aiFilters;
    if (!advancedFilters.category && !category && f.category_slug) params.set('category', f.category_slug);
    if (!advancedFilters.priceMin && f.min_price) params.set('min_price', f.min_price.toString());
    if (!advancedFilters.priceMax && f.max_price) params.set('max_price', f.max_price.toString());
    if (!advancedFilters.yearMin && f.min_year) params.set('min_year', f.min_year.toString());
    if (!advancedFilters.yearMax && f.max_year) params.set('max_year', f.max_year.toString());
    if (!advancedFilters.makes?.length && f.make) params.set('make', f.make);
    if (!advancedFilters.states?.length && f.state) params.set('state', f.state);
    if (!advancedFilters.mileageMax && f.max_mileage) params.set('max_mileage', f.max_mileage.toString());
    if (!advancedFilters.conditions?.length && f.condition) params.set('condition', f.condition.join(','));
  }

  // Only add text search if NO category filter exists
  const hasCategory =
    params.has('category') ||
    !!advancedFilters.category ||
    !!category ||
    !!aiFilters?.category_slug ||
    !!detectedCategory;

  if (query && !hasCategory) {
    params.set('q', query);
  } else {
    params.delete('q');
  }

  return params;
}

interface UseSearchListingsResult {
  listings: Listing[];
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  totalWithoutPriceFilter: number | null;
  handleLoadMore: () => Promise<void>;
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

export function useSearchListings(
  query: string,
  category: string,
  page: number,
  sortBy: string,
  advancedFilters: FilterValues,
  searchParamsString: string,
): UseSearchListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWithoutPriceFilter, setTotalWithoutPriceFilter] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Refs to prevent race conditions and duplicate fetches
  const fetchIdRef = useRef(0);
  const lastFetchParamsRef = useRef<string>('');

  // Main fetch effect
  useEffect(() => {
    const filterKey = JSON.stringify(advancedFilters);
    const paramsKey = `${query}|${category}|${page}|${sortBy}|${filterKey}`;

    if (paramsKey === lastFetchParamsRef.current) return;
    lastFetchParamsRef.current = paramsKey;

    const currentFetchId = ++fetchIdRef.current;

    const fetchListings = async () => {
      setIsLoading(true);

      try {
        const queryLower = query?.toLowerCase().trim() || '';
        const detectedCategory = CATEGORY_KEYWORDS[queryLower];

        // Parse natural language query with AI if applicable
        let currentAiFilters = null;
        if (query && !category) {
          try {
            const aiResponse = await fetch('/api/ai/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query }),
            });

            if (aiResponse.ok) {
              const { data } = await aiResponse.json();
              currentAiFilters = data?.filters;
            }
          } catch (aiError) {
            logger.error('AI search failed', { error: aiError });
          }

          // Fallback: use detected category if AI didn't provide one
          if (!currentAiFilters?.category_slug && detectedCategory) {
            currentAiFilters = { ...currentAiFilters, category_slug: detectedCategory };
          }
        }

        if (currentFetchId !== fetchIdRef.current) return;

        const params = buildSearchParams({
          page,
          sortBy,
          category,
          advancedFilters,
          aiFilters: currentAiFilters,
          query,
          detectedCategory,
        });

        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = await response.json();

        // If 0 results with AI price filters, retry without price constraints
        const hasPriceFilter = params.has('min_price') || params.has('max_price');
        const hasAIFilters = currentAiFilters && Object.keys(currentAiFilters).length > 0;

        if ((data.data?.length === 0 || data.total === 0) && hasAIFilters && hasPriceFilter) {
          const fallbackParams = new URLSearchParams(params);
          fallbackParams.delete('min_price');
          fallbackParams.delete('max_price');

          const fallbackResponse = await fetch(`/api/listings?${fallbackParams.toString()}`);
          const fallbackData = await fallbackResponse.json();

          if (currentFetchId === fetchIdRef.current) {
            if (fallbackData.total > 0) {
              setListings(fallbackData.data || []);
              setTotalCount(fallbackData.total || 0);
              setTotalPages(fallbackData.total_pages || 1);
              setTotalWithoutPriceFilter(fallbackData.total);
            } else {
              setListings([]);
              setTotalCount(0);
              setTotalPages(1);
              setTotalWithoutPriceFilter(null);
            }
          }
        } else {
          if (currentFetchId === fetchIdRef.current) {
            setListings(data.data || []);
            setTotalCount(data.total || 0);
            setTotalPages(data.total_pages || 1);
            setTotalWithoutPriceFilter(null);
          }
        }
      } catch (error) {
        logger.error('Search error', { error });
      } finally {
        if (currentFetchId === fetchIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchListings();
  }, [query, category, page, sortBy, advancedFilters]);

  // Load more for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const params = buildSearchParams({
        page: nextPage,
        sortBy,
        category,
        advancedFilters,
      });

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = await response.json();

      if (data.data?.length > 0) {
        setListings((prev) => [...prev, ...data.data]);
        const urlParams = new URLSearchParams(searchParamsString);
        urlParams.set('page', nextPage.toString());
        window.history.replaceState(null, '', `/search?${urlParams.toString()}`);
      }
    } catch (error) {
      logger.error('Load more error', { error });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, page, totalPages, sortBy, category, advancedFilters, searchParamsString]);

  return {
    listings,
    totalCount,
    totalPages,
    isLoading,
    isLoadingMore,
    totalWithoutPriceFilter,
    handleLoadMore,
    setListings,
  };
}

import type { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';
import { SearchInventoryIndex } from '@/components/search/SearchInventoryIndex';
import { getSearchInventory } from '@/lib/seo/search-inventory';

// Category-specific metadata for SEO — gives unique titles/descriptions
// when users land on /search?category=trucks etc.
const categoryMeta: Record<string, { title: string; description: string }> = {
  'lowboy-trailers': {
    title: 'Lowboy Trailers for Sale',
    description: 'Browse lowboy trailers for sale. Compare prices on detachable, fixed-neck, and hydraulic lowboy trailers from top manufacturers.',
  },
  'sleeper-trucks': {
    title: 'Sleeper Trucks for Sale',
    description: 'Find sleeper trucks for sale from Peterbilt, Freightliner, Kenworth, Volvo, and more. Compare prices, mileage, and specs.',
  },
  'flatbed-trailers': {
    title: 'Flatbed Trailers for Sale',
    description: 'Browse flatbed trailers for sale. Standard, step-deck, and extendable flatbeds from leading manufacturers.',
  },
  'day-cab-trucks': {
    title: 'Day Cab Trucks for Sale',
    description: 'Find day cab trucks for sale. Semi trucks for local and regional hauling from top brands.',
  },
  trucks: {
    title: 'Semi Trucks for Sale',
    description: 'Browse semi trucks for sale including sleeper trucks, day cabs, and vocational trucks from all major manufacturers.',
  },
  trailers: {
    title: 'Trailers for Sale',
    description: 'Find trailers for sale including lowboys, flatbeds, reefers, dry vans, and specialty trailers.',
  },
  'heavy-equipment': {
    title: 'Heavy Equipment for Sale',
    description: 'Browse heavy equipment for sale including excavators, loaders, bulldozers, and more.',
  },
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** A string search param, or '' when absent or repeated. */
function stringParam(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = stringParam(params.category);
  const query = stringParam(params.q);

  // Every category gets its own title — only these seven had one, so the
  // other 70-odd category pages shared "Search Trucks, Trailers & Equipment".
  const inventory = category ? await getSearchInventory(category) : undefined;
  const catMeta = category ? categoryMeta[category] : null;
  const categoryName = inventory?.category?.name;
  const makes = inventory?.topMakes.slice(0, 4) ?? [];

  const title = catMeta?.title
    || (categoryName ? `${categoryName} for Sale` : null)
    || (query ? `Results for "${query}"` : 'Search Trucks, Trailers & Equipment');
  const description = catMeta?.description
    || (categoryName && inventory
      ? `Browse ${inventory.total.toLocaleString()} ${categoryName.toLowerCase()} for sale on Axleyard${makes.length ? ` from ${makes.join(', ')} and more` : ''}. Compare prices, specs and locations, and contact the seller from any listing.`
      : null)
    || (query
      ? `Search results for "${query}" on Axleyard. Browse trucks, trailers, and equipment matching your search.`
      : 'Search thousands of trucks, trailers, and heavy equipment listings. Filter by price, year, make, condition, and location. AI-powered search understands natural language.');

  const canonical = category
    ? `/search?category=${category}`
    : '/search';

  // An unknown or empty category is a thin page: keep it out of the index
  // but let crawlers follow its links. `undefined` means the read failed —
  // never noindex a category on an error.
  const noindex = Boolean(category) && (inventory === null || inventory?.total === 0);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Axleyard`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Axleyard`,
      description,
    },
    alternates: {
      canonical,
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const category = stringParam(params.category);
  // The server-rendered index belongs to the canonical pages — /search and
  // /search?category=… — not to free-text query results.
  const inventory = stringParam(params.q) ? undefined : await getSearchInventory(category || null);

  return (
    <>
      <SearchPageClient />
      {inventory && <SearchInventoryIndex inventory={inventory} />}
    </>
  );
}

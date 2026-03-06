import type { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

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

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : '';
  const query = typeof params.q === 'string' ? params.q : '';

  const catMeta = category ? categoryMeta[category] : null;

  const title = catMeta?.title
    || (query ? `Results for "${query}"` : 'Search Trucks, Trailers & Equipment');
  const description = catMeta?.description
    || (query
      ? `Search results for "${query}" on AXLON AI. Browse trucks, trailers, and equipment matching your search.`
      : 'Search thousands of trucks, trailers, and heavy equipment listings. Filter by price, year, make, condition, and location. AI-powered search understands natural language.');

  const canonical = category
    ? `/search?category=${category}`
    : '/search';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | AXLON AI`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | AXLON AI`,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}

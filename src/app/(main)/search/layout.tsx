// Category-specific SEO descriptions for crawlable content
const categoryDescriptions: Record<string, { title: string; description: string }> = {
  'lowboy-trailers': {
    title: 'Lowboy Trailers for Sale',
    description: 'Browse lowboy trailers for sale. Compare prices on detachable, fixed-neck, and hydraulic lowboy trailers from top manufacturers.',
  },
  'sleeper-trucks': {
    title: 'Sleeper Trucks for Sale',
    description: 'Find sleeper trucks for sale from Peterbilt, Freightliner, Kenworth, Volvo, and more.',
  },
  'flatbed-trailers': {
    title: 'Flatbed Trailers for Sale',
    description: 'Browse flatbed trailers for sale. Standard, step-deck, and extendable flatbeds.',
  },
  'day-cab-trucks': {
    title: 'Day Cab Trucks for Sale',
    description: 'Find day cab trucks for sale. Semi trucks for local and regional hauling.',
  },
  trucks: {
    title: 'Semi Trucks for Sale',
    description: 'Browse semi trucks for sale including sleeper trucks, day cabs, and vocational trucks.',
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

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      {/* SEO: Crawlable content for search engines */}
      <section className="sr-only" aria-label="Search Information">
        <h2>Browse Equipment by Category</h2>
        <ul>
          {Object.entries(categoryDescriptions).map(([slug, meta]) => (
            <li key={slug}>
              <a href={`/search?category=${slug}`}>{meta.title}</a>
              <p>{meta.description}</p>
            </li>
          ))}
        </ul>
        <h2>Search Features</h2>
        <p>
          Axleyard uses artificial intelligence to understand your search queries in natural language.
          Search for trucks, trailers, and heavy equipment by make, model, year, price range,
          condition, and location. Get AI-powered price analysis to find the best deals.
        </p>
      </section>
    </>
  );
}

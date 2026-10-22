import Link from 'next/link';
import { jsonLdString } from '@/lib/seo/json-ld';
import type { SearchInventory } from '@/lib/seo/search-inventory';

// Items in the ItemList JSON-LD; the HTML list below links every indexed unit.
const JSON_LD_ITEMS = 100;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** "A", "A and B", "A, B and C" */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function locationOf(item: { city: string | null; state: string | null }): string {
  return [item.city, item.state].filter(Boolean).join(', ');
}

/**
 * Server-rendered inventory for /search and /search?category=… — a summary
 * and a plain link to each unit, in the HTML itself. The interactive grid
 * above it loads in the browser, which AI crawlers never run, so without
 * this the page reached them empty (see lib/seo/search-inventory.ts).
 */
export function SearchInventoryIndex({ inventory }: { inventory: SearchInventory }) {
  const { category, total, items } = inventory;
  if (total === 0) return null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com';
  const noun = category ? category.name : 'truck, trailer and heavy equipment listings';
  const heading = category ? `${category.name} for Sale on Axleyard` : 'Trucks, Trailers & Heavy Equipment for Sale on Axleyard';

  const sentences = [
    `Axleyard has ${total.toLocaleString()} ${total === 1 && category ? 'listing in this category' : noun} for sale right now` +
      (inventory.topMakes.length > 1 ? `, from makes including ${joinList(inventory.topMakes)}.` : '.'),
  ];
  if (inventory.pricedCount > 0 && inventory.minPrice !== null && inventory.maxPrice !== null) {
    const range =
      inventory.minPrice === inventory.maxPrice
        ? usd.format(inventory.minPrice)
        : `${usd.format(inventory.minPrice)} to ${usd.format(inventory.maxPrice)}`;
    sentences.push(
      inventory.pricedCount === total
        ? `Asking prices run ${range}.`
        : `${inventory.pricedCount.toLocaleString()} list an asking price, from ${range}; the rest are priced on request from the seller.`
    );
  }
  if (inventory.topStates.length > 0) {
    sentences.push(`Units are located in ${joinList(inventory.topStates)}.`);
  }
  sentences.push('Open any listing for its specs and to contact the seller.');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: heading,
    numberOfItems: total,
    itemListElement: items.slice(0, JSON_LD_ITEMS).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/listing/${item.id}`,
      name: item.title,
    })),
  };

  return (
    <section
      aria-labelledby="inventory-index-heading"
      className="max-w-7xl mx-auto px-4 pt-2 pb-24 md:pb-12"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(itemListSchema) }} />

      <div className="border-t pt-8">
        <h2 id="inventory-index-heading" className="text-lg md:text-xl font-semibold">
          {heading}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground leading-relaxed">{sentences.join(' ')}</p>

        {inventory.subcategories.length > 0 && (
          <nav aria-label="Categories" className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {inventory.subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/search?category=${sub.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {sub.name}
                    <span className="text-muted-foreground">{sub.count.toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
            {items.length < total
              ? `Newest ${items.length.toLocaleString()} of ${total.toLocaleString()} listings`
              : `All ${total.toLocaleString()} ${total === 1 ? 'listing' : 'listings'}`}
          </summary>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {items.map((item) => {
              const location = locationOf(item);
              return (
                <li key={item.id} className="min-w-0">
                  <Link href={`/listing/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                  <span className="text-muted-foreground">
                    {' — '}
                    {item.price && item.price > 0 ? usd.format(item.price) : 'Price on request'}
                    {location && ` · ${location}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </section>
  );
}

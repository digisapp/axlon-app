import { MetadataRoute } from 'next';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Use a simple client without cookies for sitemap generation
function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Re-generate the sitemap at most once per hour (otherwise it is frozen at build time)
export const revalidate = 3600;

const LISTINGS_PER_PAGE = 5000;

// Supabase caps un-ranged selects at 1,000 rows; page through to fetch everything.
const SUPABASE_PAGE_SIZE = 1000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/manufacturers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dealers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/new-trailers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/finance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trade-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voice`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/industries/transport`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/industries/crane`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/industries/rigging`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/transform`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/axle-weight-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic listing pages - fetch ALL active listings (paginated to avoid Supabase row limits)
  let listingPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createStaticClient();

    // First get total count
    const { count } = await supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    const totalListings = count || 0;
    const pages = Math.ceil(totalListings / LISTINGS_PER_PAGE);

    // Fetch all listings in batches
    for (let i = 0; i < pages; i++) {
      const { data: listings } = await supabase
        .from('listings')
        .select('id, updated_at')
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .range(i * LISTINGS_PER_PAGE, (i + 1) * LISTINGS_PER_PAGE - 1);

      if (listings) {
        listingPages = listingPages.concat(
          listings.map((listing) => ({
            url: `${baseUrl}/listing/${listing.id}`,
            lastModified: new Date(listing.updated_at),
            changeFrequency: 'daily' as const,
            priority: 0.7,
          }))
        );
      }
    }
  } catch (error) {
    console.error('Error generating sitemap listings:', error);
  }

  // Category pages
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createStaticClient();

    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (categories) {
      categoryPages = categories.map((cat) => ({
        url: `${baseUrl}/search?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap categories:', error);
  }

  // Manufacturer pages
  let manufacturerPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createStaticClient();

    // Fetch all manufacturers in batches (Supabase caps at 1,000 rows per query)
    let manufacturers: { slug: string; updated_at: string | null }[] = [];
    for (let i = 0; ; i++) {
      const { data: batch } = await supabase
        .from('manufacturers')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('name', { ascending: true })
        .range(i * SUPABASE_PAGE_SIZE, (i + 1) * SUPABASE_PAGE_SIZE - 1);

      if (!batch || batch.length === 0) break;
      manufacturers = manufacturers.concat(batch);
      if (batch.length < SUPABASE_PAGE_SIZE) break;
    }

    if (manufacturers.length > 0) {
      manufacturerPages = manufacturers.map((mfr) => ({
        url: `${baseUrl}/manufacturers/${mfr.slug}`,
        lastModified: mfr.updated_at ? new Date(mfr.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap manufacturers:', error);
  }

  // Dealer storefront pages
  let dealerPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createStaticClient();

    // Fetch all dealers in batches (Supabase caps at 1,000 rows per query)
    let dealers: { slug: string; updated_at: string | null }[] = [];
    for (let i = 0; ; i++) {
      const { data: batch } = await supabase
        .from('profiles')
        .select('slug, updated_at')
        .eq('is_business', true)
        .not('slug', 'is', null)
        .order('company_name', { ascending: true })
        .range(i * SUPABASE_PAGE_SIZE, (i + 1) * SUPABASE_PAGE_SIZE - 1);

      if (!batch || batch.length === 0) break;
      dealers = dealers.concat(batch);
      if (batch.length < SUPABASE_PAGE_SIZE) break;
    }

    if (dealers.length > 0) {
      dealerPages = dealers.map((dealer) => ({
        url: `${baseUrl}/${dealer.slug}`,
        lastModified: dealer.updated_at ? new Date(dealer.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap dealers:', error);
  }

  // Manufacturer product pages
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createStaticClient();

    // Fetch all products in batches (Supabase caps at 1,000 rows per query)
    type ProductRow = {
      slug: string;
      updated_at: string | null;
      manufacturers: { slug: string } | { slug: string }[];
    };
    let products: ProductRow[] = [];
    for (let i = 0; ; i++) {
      const { data: batch } = await supabase
        .from('manufacturer_products')
        .select('slug, updated_at, manufacturers!inner(slug)')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .range(i * SUPABASE_PAGE_SIZE, (i + 1) * SUPABASE_PAGE_SIZE - 1);

      if (!batch || batch.length === 0) break;
      products = products.concat(batch as ProductRow[]);
      if (batch.length < SUPABASE_PAGE_SIZE) break;
    }

    if (products.length > 0) {
      productPages = products.map((product) => ({
        url: `${baseUrl}/new-trailers/${(Array.isArray(product.manufacturers) ? product.manufacturers[0] : product.manufacturers).slug}/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap products:', error);
  }

  return [
    ...staticPages,
    ...listingPages,
    ...categoryPages,
    ...manufacturerPages,
    ...dealerPages,
    ...productPages,
  ];
}

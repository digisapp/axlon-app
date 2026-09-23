import { createClient } from '@/lib/supabase/server';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Factory,
  Star,
  Truck,
  Container,
  Cog,
} from 'lucide-react';
import { ManufacturerCard, type ManufacturerCardData } from '@/components/manufacturers/ManufacturerCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getActiveListingCountsByMake, normalizeMake } from '@/lib/listings/make-counts';

export const metadata = {
  title: 'Manufacturer Directory - Truck, Trailer & Equipment Brands',
  description: 'Browse leading truck, trailer, and equipment manufacturers including Trail King, Fontaine, Talbert, XL Specialized, Peterbilt, Freightliner, and more.',
  openGraph: {
    title: 'Manufacturer Directory | Axleyard',
    description: 'Research leading truck, trailer, and equipment manufacturers. Compare brands, specs, and product lines.',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Manufacturer Directory | Axleyard',
    description: 'Research leading truck, trailer, and equipment manufacturers.',
  },
  alternates: {
    canonical: '/manufacturers',
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

const EQUIPMENT_TYPES = [
  { value: 'trucks', label: 'Trucks', icon: Truck },
  { value: 'trailers', label: 'Trailers', icon: Container },
  { value: 'heavy-equipment', label: 'Heavy Equipment', icon: Cog },
];

export default async function ManufacturersPage({ searchParams }: PageProps) {
  const { q, type } = await searchParams;
  const supabase = await createClient();

  // Fetch manufacturers
  let query = supabase
    .from('manufacturers')
    .select('id, slug, name, canonical_name, logo_url, short_description, equipment_types, headquarters, founded_year, website, is_featured')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('feature_tier', { ascending: false })
    .order('listing_count', { ascending: false })
    .order('name', { ascending: true });

  // Apply search filter (sanitized)
  if (q) {
    const sanitized = sanitizeSearchFilter(q);
    if (sanitized) {
      query = query.or(`name.ilike.%${sanitized}%,canonical_name.ilike.%${sanitized}%`);
    }
  }

  // Apply equipment type filter
  if (type) {
    query = query.contains('equipment_types', [type]);
  }

  const [{ data: manufacturers }, countsByMake] = await Promise.all([
    query,
    getActiveListingCountsByMake(),
  ]);

  // Live per-brand counts come from one aggregated (and briefly cached) read
  // instead of a COUNT query per manufacturer — the previous fan-out issued
  // ~80 parallel round-trips and put this page at 1-3s TTFB.
  // Only the fields a card renders are passed to the (client) card.
  const updatedManufacturers: (ManufacturerCardData & { is_featured: boolean })[] = (manufacturers ?? []).map((mfr) => ({
    id: mfr.id,
    slug: mfr.slug,
    name: mfr.name,
    logo_url: mfr.logo_url ?? null,
    short_description: mfr.short_description ?? null,
    equipment_types: mfr.equipment_types ?? null,
    headquarters: mfr.headquarters ?? null,
    founded_year: mfr.founded_year ?? null,
    has_website: !!mfr.website,
    is_featured: !!mfr.is_featured,
    listing_count: countsByMake.get(normalizeMake(mfr.canonical_name)) ?? 0,
  }));

  // Separate featured and regular manufacturers
  const featuredManufacturers = updatedManufacturers.filter(m => m.is_featured);
  const regularManufacturers = updatedManufacturers.filter(m => !m.is_featured);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Manufacturer Directory</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">
            Research leading truck, trailer, and equipment manufacturers. Find equipment from the brands you trust.
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form className="flex-1 relative" action="/manufacturers">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              name="q"
              placeholder="Search manufacturers..."
              defaultValue={q}
              className="h-12 pl-12 pr-4 bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 transition-all shadow-sm"
            />
            {type && <input type="hidden" name="type" value={type} />}
          </form>

          {/* Equipment Type Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Link href="/manufacturers">
              <Badge
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !type
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 shadow-md'
                    : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300'
                }`}
              >
                All
              </Badge>
            </Link>
            {EQUIPMENT_TYPES.map((et) => (
              <Link key={et.value} href={`/manufacturers?type=${et.value}${q ? `&q=${encodeURIComponent(q)}` : ''}`}>
                <Badge
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    type === et.value
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 shadow-md'
                      : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300'
                  }`}
                >
                  <et.icon className="w-3.5 h-3.5" />
                  {et.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-slate-600 dark:text-zinc-400 mb-6">
          <span className="text-slate-900 dark:text-white font-semibold">{updatedManufacturers.length}</span> manufacturers found
          {q && ` matching "${q}"`}
          {type && ` in ${EQUIPMENT_TYPES.find(t => t.value === type)?.label || type}`}
        </p>

        {/* Featured Manufacturers */}
        {featuredManufacturers.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Featured Manufacturers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredManufacturers.map((manufacturer) => (
                <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Manufacturers Grid */}
        {regularManufacturers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regularManufacturers.map((manufacturer) => (
              <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
            ))}
          </div>
        ) : !featuredManufacturers.length ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Factory className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No manufacturers found</h2>
            <p className="text-slate-600 dark:text-zinc-400">
              {q ? `No results for "${q}"` : 'Check back soon for manufacturer listings'}
            </p>
          </div>
        ) : null}
      </div>
      </div>
      <Footer />
    </>
  );
}

import { createClient } from '@/lib/supabase/server';
import { sanitizeSearchFilter } from '@/lib/security/sanitize';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Phone,
  Package,
  Search,
  Store,
  ArrowRight,
  Shield,
  Building2,
  Bot,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Business Directory — Find Trusted Equipment Businesses',
  description: 'Browse verified truck and equipment businesses on Axleyard. Find trusted businesses near you with AI-powered storefronts, inventory, and direct messaging.',
  openGraph: {
    title: 'Business Directory | Axleyard',
    description: 'Find trusted truck and equipment businesses near you. Verified businesses with direct messaging.',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Business Directory | Axleyard',
    description: 'Find trusted truck and equipment businesses near you.',
  },
  alternates: {
    canonical: '/dealers',
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string; state?: string }>;
}

export default async function DealersPage({ searchParams }: PageProps) {
  const { q, state } = await searchParams;
  const supabase = await createClient();

  // Fetch dealers with storefronts
  let query = supabase
    .from('profiles')
    .select(`
      id,
      company_name,
      slug,
      tagline,
      avatar_url,
      city,
      state,
      phone,
      storefront_views
    `)
    .eq('is_business', true)
    .not('slug', 'is', null)
    .order('storefront_views', { ascending: false });

  // Apply search filter (sanitize to prevent filter injection)
  if (q) {
    const sanitized = sanitizeSearchFilter(q);
    if (sanitized) {
      query = query.or(`company_name.ilike.%${sanitized}%,city.ilike.%${sanitized}%,tagline.ilike.%${sanitized}%`);
    }
  }

  // Apply state filter
  if (state) {
    query = query.eq('state', state.toUpperCase());
  }

  const { data: dealers } = await query;

  // Get listing counts for each dealer
  const dealerIds = dealers?.map(d => d.id) || [];
  const { data: listingCounts } = await supabase
    .from('listings')
    .select('user_id')
    .in('user_id', dealerIds)
    .eq('status', 'active');

  // Count listings per dealer
  const countMap: Record<string, number> = {};
  listingCounts?.forEach(l => {
    countMap[l.user_id] = (countMap[l.user_id] || 0) + 1;
  });

  // Get unique states for filter
  const { data: statesData } = await supabase
    .from('profiles')
    .select('state')
    .eq('is_business', true)
    .not('slug', 'is', null)
    .not('state', 'is', null);

  const states = [...new Set(statesData?.map(s => s.state).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-muted/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Business Directory</h1>
              </div>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl">
                Browse verified truck and equipment businesses. Find quality inventory from trusted professionals.
              </p>
            </div>
            <Button className="rounded-full gap-2 group shrink-0 w-fit" asChild>
              <Link href="/get-started">
                <Bot className="w-4 h-4" />
                Join as a Business
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <form className="flex-1 relative" action="/dealers">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search businesses by name or location..."
              defaultValue={q}
              className="h-12 pl-12 pr-4 bg-background border rounded-xl placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-all shadow-sm"
            />
            {state && <input type="hidden" name="state" value={state} />}
          </form>

          {/* State Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Link href="/dealers">
              <Badge
                className={`cursor-pointer px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !state
                    ? 'bg-foreground text-background border-0 shadow-md'
                    : 'bg-background border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                All States
              </Badge>
            </Link>
            {states.slice(0, 10).map((s) => (
              <Link key={s} href={`/dealers?state=${s}${q ? `&q=${q}` : ''}`}>
                <Badge
                  className={`cursor-pointer px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    state === s
                      ? 'bg-foreground text-background border-0 shadow-md'
                      : 'bg-background border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {s}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          <span className="text-foreground font-semibold">{dealers?.length || 0}</span> businesses found
          {q && ` matching "${q}"`}
          {state && ` in ${state}`}
        </p>

        {/* Dealers Grid */}
        {dealers && dealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {dealers.map((dealer) => (
              <Link key={dealer.id} href={`/${dealer.slug}`} className="group">
                <div className="h-full bg-card border rounded-xl overflow-hidden hover:shadow-xl hover:border-border/80 transition-all duration-300">
                  {/* Dealer Header */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                        {dealer.avatar_url ? (
                          <Image
                            src={dealer.avatar_url}
                            alt={dealer.company_name || 'Business'}
                            width={56}
                            height={56}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-lg md:text-xl font-bold text-white">
                            {dealer.company_name?.charAt(0) || 'D'}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {dealer.company_name || 'Business'}
                          </h3>
                          <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        </div>
                        {dealer.tagline && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {dealer.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location & Phone */}
                    <div className="flex flex-wrap gap-3 mt-3 md:mt-4 text-sm text-muted-foreground">
                      {(dealer.city || dealer.state) && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {[dealer.city, dealer.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {dealer.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {dealer.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 md:px-5 py-3 bg-muted/50 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-700 flex items-center justify-center">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-foreground/80">
                        {countMap[dealer.id] || 0} listings
                      </span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      View Inventory
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <Store className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No businesses found</h2>
            <p className="text-muted-foreground">
              {q ? `No results for "${q}"` : 'No businesses have set up storefronts yet'}
            </p>
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-10 md:mt-12 mb-4 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-3">
                <Zap className="w-3 h-3" />
                AI-Powered Platform
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                Run your business with AI
              </h2>
              <p className="text-slate-400 max-w-lg text-sm md:text-base">
                Join AXLON and get an AI sales assistant, voice agent, CRM, and marketplace storefront — all in one platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button size="lg" className="rounded-full gap-2 group" asChild>
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-slate-600 text-slate-200 hover:bg-slate-800" asChild>
                <Link href="/contact?plan=demo">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

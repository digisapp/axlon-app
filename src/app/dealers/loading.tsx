import { Skeleton } from '@/components/ui/skeleton';

export default function DealersLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-700" />
                <Skeleton className="h-8 md:h-10 w-56 bg-slate-700" />
              </div>
              <Skeleton className="h-5 w-80 bg-slate-700/50" />
            </div>
            <Skeleton className="h-10 w-40 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-16 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Results count */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-xl overflow-hidden">
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3 md:gap-4">
                  <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="px-4 md:px-5 py-3 bg-muted/50 border-t flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

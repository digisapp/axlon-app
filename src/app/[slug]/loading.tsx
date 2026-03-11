import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DealerStorefrontLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-950">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative mt-4">
        <Skeleton className="h-48 md:h-64 lg:h-72 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* Dealer Info Card */}
      <div className="relative max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 pb-6">
        <div className="relative bg-card rounded-2xl shadow-xl border overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 md:px-8 py-4 border-t bg-muted/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Listings */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

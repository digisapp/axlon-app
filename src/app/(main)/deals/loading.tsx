import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DealsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Skeleton className="h-7 w-32 mb-3 bg-slate-700" />
              <Skeleton className="h-10 w-72 mb-2 bg-slate-700" />
              <Skeleton className="h-5 w-96 bg-slate-700/60" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg bg-slate-700" />
              <Skeleton className="h-9 w-9 rounded-lg bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-5 w-32 self-center ml-auto" />
        </div>

        {/* Deal cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              {/* Image */}
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-3 space-y-2">
                {/* Discount badge + title */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                {/* Price row */}
                <div className="flex items-baseline gap-2 pt-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* Savings badge */}
                <Skeleton className="h-7 w-full rounded-lg" />
                {/* Meta */}
                <div className="flex gap-3 pt-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

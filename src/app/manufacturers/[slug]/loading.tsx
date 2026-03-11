import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ManufacturerLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-6">
            <Skeleton className="h-4 w-4 bg-slate-700" />
            <Skeleton className="h-4 w-24 bg-slate-700" />
            <Skeleton className="h-4 w-4 bg-slate-700" />
            <Skeleton className="h-4 w-32 bg-slate-700" />
          </div>

          <div className="flex items-start gap-6">
            {/* Logo */}
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-700 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 md:h-10 w-48 bg-slate-700" />
              <Skeleton className="h-5 w-72 bg-slate-700/50" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-24 bg-slate-700/50" />
                <Skeleton className="h-4 w-20 bg-slate-700/50" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full bg-slate-700" />
                <Skeleton className="h-7 w-24 rounded-full bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 md:p-5">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-7 w-16" />
            </Card>
          ))}
        </div>

        {/* About */}
        <Card className="p-5 md:p-6 mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>

        {/* Listings */}
        <Skeleton className="h-7 w-40 mb-4" />
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

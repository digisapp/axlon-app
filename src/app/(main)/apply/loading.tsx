import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ApplyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-14 text-center">
          <Skeleton className="h-7 w-40 mx-auto mb-3 bg-slate-700" />
          <Skeleton className="h-10 w-3/4 mx-auto mb-3 bg-slate-700" />
          <Skeleton className="h-5 w-1/2 mx-auto bg-slate-700/60" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-full" />
          ))}
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Name + email row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Phone + company row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Business type */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-32 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Size dropdowns */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Pain point */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-40 rounded-lg" />
                ))}
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-lg mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

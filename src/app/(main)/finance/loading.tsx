import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function FinanceLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-14 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-3 bg-slate-700" />
          <Skeleton className="h-10 w-3/4 mx-auto mb-3 bg-slate-700" />
          <Skeleton className="h-5 w-1/2 mx-auto bg-slate-700/60" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Calculator inputs */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
              <Skeleton className="h-11 w-full rounded-lg mt-2" />
            </CardContent>
          </Card>

          {/* Results panel */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-36 mx-auto" />
                  <Skeleton className="h-14 w-48 mx-auto" />
                  <Skeleton className="h-4 w-28 mx-auto" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center space-y-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-5 w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature bullets */}
            <Card>
              <CardContent className="pt-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
                <Skeleton className="h-11 w-full rounded-lg mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const panel = 'rounded-xl border border-border/60 bg-card shadow-sm';

/** Mirrors the overview: greeting, four KPI tiles, the attention list, Ask AXLON. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Greeting */}
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${panel} p-4 md:p-5`}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Needs your attention */}
      <div className={panel}>
        <div className="flex items-center justify-between px-4 pt-4 md:px-5 md:pt-5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-1 px-2 pb-2 pt-2 md:px-3 md:pb-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Ask AXLON */}
      <div className={`${panel} p-4 md:p-5`}>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="mt-2 h-4 w-64" />
        <Skeleton className="mt-4 h-12 w-full rounded-lg" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

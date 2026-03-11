import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ListingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Image Gallery */}
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />

            {/* Title + Price */}
            <div>
              <Skeleton className="h-7 md:h-8 w-3/4 mb-2" />
              <Skeleton className="h-8 md:h-9 w-32 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            {/* Details Card */}
            <Card className="p-4 md:p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Description Card */}
            <Card className="p-4 md:p-6">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-4">
            {/* Seller Card */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md mb-3" />
              <Skeleton className="h-10 w-full rounded-md" />
            </Card>

            {/* Quick Stats */}
            <Card className="p-5">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Financing */}
            <Card className="p-5">
              <Skeleton className="h-5 w-36 mb-3" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

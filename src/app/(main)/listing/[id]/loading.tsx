export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="aspect-[16/10] bg-muted rounded-xl" />

            {/* Title and price */}
            <div>
              <div className="h-8 bg-muted rounded w-3/4 mb-2" />
              <div className="h-9 bg-muted rounded w-32 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16" />
                <div className="h-6 bg-muted rounded-full w-20" />
              </div>
            </div>

            {/* Details grid */}
            <div className="border border-border rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-24 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="border border-border rounded-lg p-6 space-y-2">
              <div className="h-6 bg-muted rounded w-28 mb-4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-4">
            <div className="border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-5 bg-muted rounded w-28" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
              <div className="h-10 bg-muted rounded w-full" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

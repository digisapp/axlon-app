export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {/* Breadcrumb */}
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-4" />
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-4" />
          <div className="h-4 bg-muted rounded w-40" />
        </div>

        {/* Title + badges */}
        <div className="space-y-3">
          <div className="h-9 bg-muted rounded w-2/3" />
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded-full w-20" />
            <div className="h-6 bg-muted rounded-full w-24" />
            <div className="h-6 bg-muted rounded-full w-16" />
          </div>
        </div>

        {/* Image gallery + specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

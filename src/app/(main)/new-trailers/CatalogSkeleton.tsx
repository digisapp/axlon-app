// Mirrors the catalog layout (dark hero, then a titled row of cards per
// manufacturer) so the page doesn't jump when the real content streams in.
export function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading catalog">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 animate-pulse space-y-4">
          <div className="h-10 bg-white/10 rounded w-1/3" />
          <div className="h-5 bg-white/10 rounded w-2/3 max-w-2xl" />
          <div className="h-4 bg-white/10 rounded w-40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-pulse space-y-10 sm:space-y-12">
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s}>
            <div className="h-7 bg-muted rounded w-48 mb-2" />
            <div className="h-4 bg-muted rounded w-80 max-w-full mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-border overflow-hidden ${i > 0 ? 'hidden sm:block' : ''} ${i === 3 ? 'lg:hidden xl:block' : ''}`}
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingDown } from 'lucide-react';
import type { HomeDeal } from '@/lib/home-data';

// Server-rendered: deals arrive in the initial HTML (no client fetch, no
// skeleton, no layout jump when the section is empty).
export function HomeDeals({ deals }: { deals: HomeDeal[] }) {
  if (deals.length === 0) return null;

  return (
    <div className="w-full max-w-4xl px-4 mb-8 md:mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Hot Deals
        </h2>
        <Link
          href="/deals"
          className="text-sm text-primary hover:underline"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: HomeDeal }) {
  const primaryImage = deal.images?.find((img) => img.is_primary) || deal.images?.[0];

  return (
    <Link href={`/listing/${deal.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
        <div className="relative aspect-[4/3]">
          {primaryImage?.url ? (
            <Image
              src={primaryImage.thumbnail_url && primaryImage.thumbnail_url.length > 0 ? primaryImage.thumbnail_url : primaryImage.url}
              alt={deal.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No Image</span>
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            {deal.discount_percent}% Off
          </Badge>
        </div>
        <div className="p-2 md:p-3">
          <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{deal.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm md:text-base font-bold text-primary">
              ${deal.price.toLocaleString()}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground line-through">
              ${deal.ai_price_estimate.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-green-600 dark:text-green-400 mt-0.5">
            Save ${deal.savings.toLocaleString()}
          </p>
        </div>
      </Card>
    </Link>
  );
}

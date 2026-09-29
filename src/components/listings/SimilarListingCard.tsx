'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useImageFallback } from '@/hooks/useImageFallback';
import { getImageSrc } from '@/lib/utils';

interface SimilarListingCardProps {
  item: {
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
    city?: string | null;
    state?: string | null;
    images: { url: string; thumbnail_url?: string | null; is_primary?: boolean }[] | null;
  };
}

export function SimilarListingCard({ item }: SimilarListingCardProps) {
  const { hasError, handleError } = useImageFallback();
  const itemImage = item.images?.find((img) => img.is_primary) || item.images?.[0];
  const itemImageSrc = getImageSrc(itemImage);
  const location = [item.city, item.state].filter(Boolean).join(', ');

  return (
    <Link href={`/listing/${item.id}`}>
      <Card className="gap-0 py-0 overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="relative aspect-[4/3] bg-muted">
          {itemImageSrc && !hasError ? (
            <Image
              src={itemImageSrc}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
              onError={handleError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-2 md:p-4">
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2lh]">{item.title}</h3>
          <p className="text-base md:text-lg font-bold text-primary mt-0.5 md:mt-1">
            {item.price ? `$${item.price.toLocaleString()}` : 'Call for Price'}
          </p>
          {/* The title already carries year/make/model — show where it is */}
          {location ? (
            <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {location}
            </p>
          ) : (
            <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">
              {[item.year, item.make].filter(Boolean).join(' ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

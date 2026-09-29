'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react';
import { isOptimizerBlockedImage } from '@/lib/images/optimizer-blocked-hosts';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  url: string;
  alt_text: string | null;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  /** Index of the photo to open on (the primary photo). */
  initialIndex?: number;
  productName: string;
}

// Main photo + thumbnail strip. The thumbnails used to be static images that
// looked clickable but did nothing; each one now switches the main photo.
export function ProductGallery({ images, initialIndex = 0, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(
    initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0
  );
  const main = images[selected];

  return (
    <div>
      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-muted mb-4">
        {main ? (
          <Image
            key={main.id}
            src={main.url}
            alt={main.alt_text || productName}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            preload={selected === initialIndex}
            unoptimized={isOptimizerBlockedImage(main.url)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="w-20 h-20 text-muted-foreground/20" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-pressed={i === selected}
              className={cn(
                'aspect-[4/3] relative rounded-lg overflow-hidden bg-muted ring-offset-background transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                i === selected ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="(max-width: 640px) 25vw, 120px"
                className="object-cover"
                unoptimized={isOptimizerBlockedImage(img.url)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

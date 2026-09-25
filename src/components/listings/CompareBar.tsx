'use client';

import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { X, Scale, ArrowRight } from 'lucide-react';
import { useImageFallback } from '@/hooks/useImageFallback';
import { usePublishedHeight } from '@/lib/mobile-chrome';

interface CompareBarItemProps {
  listing: {
    id: string;
    title: string;
    image_url: string | null;
  };
  onRemove: () => void;
}

function CompareBarItem({ listing, onRemove }: CompareBarItemProps) {
  const { hasError, handleError } = useImageFallback();
  const showImage = listing.image_url && !hasError;

  return (
    <div className="relative flex items-center gap-2 md:bg-muted md:rounded-lg md:pl-2 md:pr-1 md:py-1 flex-shrink-0">
      <div className="w-11 h-11 md:w-10 md:h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
        {showImage ? (
          <Image
            src={listing.image_url!}
            alt={listing.title}
            width={44}
            height={44}
            className="object-cover w-full h-full"
            sizes="44px"
            onError={handleError}
          />
        ) : (
          <Scale className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <span className="hidden md:inline text-sm font-medium truncate max-w-[120px]">
        {listing.title}
      </span>
      {/* Phone: a small badge on the thumbnail with a 40px hit area; desktop: inline button */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${listing.title} from compare`}
        className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow after:absolute after:-inset-2.5 after:content-[''] md:static md:size-6 md:bg-transparent md:text-foreground md:shadow-none md:after:hidden md:hover:bg-background touch-manipulation"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export function CompareBar() {
  const { listings, removeListing, clearAll } = useCompare();
  const barRef = usePublishedHeight('--compare-bar-h');

  if (listings.length === 0) return null;

  const ready = listings.length >= 2;
  const mobileLabel = ready ? `Compare (${listings.length})` : 'Add 1 more';

  return (
    // Sits on top of whatever bottom bar the page has (nav or contact bar)
    // instead of covering it — the listing page's Call/Contact CTA stays usable.
    <div
      ref={barRef}
      data-bottom-bar
      data-compare-bar
      className="fixed inset-x-0 bottom-above-bar z-50 border-t bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-safe-above-bar"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-medium">Compare ({listings.length}/4)</span>
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-2.5 md:gap-3 overflow-x-auto overscroll-x-contain pt-1.5 pr-1.5 pb-0.5 md:p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {listings.map((listing) => (
            <CompareBarItem
              key={listing.id}
              listing={listing}
              onRemove={() => removeListing(listing.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <Button variant="ghost" onClick={clearAll} className="px-2.5 md:px-3">
            Clear<span className="hidden md:inline">&nbsp;All</span>
          </Button>
          {ready ? (
            <Button asChild>
              <Link href="/compare">
                <span className="md:hidden">{mobileLabel}</span>
                <span className="hidden md:inline">Compare Now</span>
                <ArrowRight className="w-4 h-4 ml-1 md:ml-2" />
              </Link>
            </Button>
          ) : (
            <Button disabled>
              <span className="md:hidden">{mobileLabel}</span>
              <span className="hidden md:inline">Compare Now</span>
              <ArrowRight className="hidden md:block w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

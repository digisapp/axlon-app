'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { Scale, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Wins over any photo-overlay background a caller passes, so the selected
// state never washes out to a translucent box
const SELECTED_CLASS =
  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90';

interface CompareButtonProps {
  listing: {
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
    mileage: number | null;
    hours: number | null;
    condition: string | null;
    image_url?: string | null;
  };
  variant?: 'default' | 'icon';
  className?: string;
}

export function CompareButton({ listing, variant = 'default', className }: CompareButtonProps) {
  const router = useRouter();
  const { addListing, removeListing, isInCompare, canAddMore } = useCompare();

  const inCompare = isInCompare(listing.id);
  const isFull = !inCompare && !canAddMore;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeListing(listing.id);
    } else if (canAddMore) {
      addListing({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        year: listing.year,
        make: listing.make,
        model: listing.model,
        mileage: listing.mileage,
        hours: listing.hours,
        condition: listing.condition,
        image_url: listing.image_url || null,
      });
    } else {
      // Not `disabled`: touch users never see the title tooltip, and a
      // disabled button inside a listing-card link lets the tap fall through
      // to the link
      toast('Compare list is full', {
        id: 'compare-full',
        description: 'You can compare up to 4 listings. Remove one to add another.',
        action: { label: 'Compare', onClick: () => router.push('/compare') },
      });
    }
  };

  const getTitle = () => {
    if (inCompare) return 'Remove from compare';
    if (!canAddMore) return 'Compare list full (max 4 items)';
    return 'Add to compare';
  };

  if (variant === 'icon') {
    return (
      <Button
        variant={inCompare ? 'default' : 'outline'}
        size="icon"
        onClick={handleClick}
        aria-disabled={isFull || undefined}
        className={cn(
          'h-10 w-10 md:h-8 md:w-8 touch-manipulation',
          className,
          inCompare && SELECTED_CLASS,
          isFull && 'opacity-50'
        )}
        title={getTitle()}
        aria-label={getTitle()}
      >
        {inCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
      </Button>
    );
  }

  return (
    <Button
      variant={inCompare ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      aria-disabled={isFull || undefined}
      className={cn(className, inCompare && SELECTED_CLASS, isFull && 'opacity-50')}
      title={getTitle()}
    >
      {inCompare ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          In Compare
        </>
      ) : (
        <>
          <Scale className="w-4 h-4 mr-2" />
          Compare
        </>
      )}
    </Button>
  );
}

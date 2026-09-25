'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  /** Over photos, pass a backdrop (e.g. `bg-white/90`) — the ghost heart is invisible on its own */
  className?: string;
}

export function FavoriteButton({
  listingId,
  variant = 'ghost',
  size = 'sm',
  showText = true,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();

      setIsFavorited(!!data);
      setIsLoading(false);
    };

    checkFavorite();
  }, [listingId]);

  const handleToggle = async (e: React.MouseEvent) => {
    // Rendered inside listing-card <Link>s — without this, tapping the heart
    // navigates to the listing instead of saving it (mirrors CompareButton).
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return; // Prevent rapid double-clicks

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect=/listing/${listingId}`);
      return;
    }

    // Optimistic update - change state immediately
    const wasLiked = isFavorited;
    setIsFavorited(!wasLiked);
    setIsToggling(true);

    try {
      if (wasLiked) {
        // Remove favorite
        const response = await csrfFetch(`/api/favorites?listing_id=${listingId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Removed from saved listings');
        } else {
          // Revert on failure
          setIsFavorited(true);
          toast.error('Failed to remove from saved');
        }
      } else {
        // Add favorite
        const response = await csrfFetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: listingId }),
        });

        if (response.ok) {
          toast.success('Added to saved listings', {
            action: {
              label: 'View Saved',
              onClick: () => router.push('/dashboard/saved'),
            },
          });
        } else {
          // Revert on failure
          setIsFavorited(false);
          toast.error('Failed to save listing');
        }
      }
    } catch (error) {
      // Revert on error
      setIsFavorited(wasLiked);
      toast.error('Something went wrong');
      logger.error('Favorite toggle error', { error });
    } finally {
      setIsToggling(false);
    }
  };

  // aria-disabled rather than disabled: a disabled button ignores the tap, so
  // on a listing card it falls through to the card link and navigates away
  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        aria-disabled
        aria-label="Save listing"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      aria-busy={isToggling || undefined}
      aria-label={showText ? undefined : 'Save listing'}
      aria-pressed={isFavorited}
      className={cn(
        className,
        isFavorited && 'text-red-500 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400'
      )}
    >
      {isToggling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={`w-4 h-4 ${showText ? 'mr-2' : ''} ${isFavorited ? 'fill-current' : ''}`}
        />
      )}
      {showText && (isFavorited ? 'Saved' : 'Save')}
    </Button>
  );
}

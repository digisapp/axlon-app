'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Eye, ImageIcon, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { useImageFallback } from '@/hooks/useImageFallback';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf-fetch';

interface AdminListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number | null;
    status: string;
    views_count: number | null;
    created_at: string;
    deleted_at?: string | null;
  };
  imageUrl: string | null;
  sellerName: string;
  statusBadge: React.ReactNode;
}

export function AdminListingCard({ listing, imageUrl, sellerName, statusBadge }: AdminListingCardProps) {
  const { hasError, handleError } = useImageFallback();
  const [isActing, setIsActing] = useState(false);
  const isDeleted = !!listing.deleted_at;

  const handleAction = async (action: 'restore' | 'hard_delete') => {
    setIsActing(true);
    try {
      const res = await csrfFetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(data.message);
      // Reload to reflect the change
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsActing(false);
    }
  };

  return (
    <Card className={isDeleted ? 'border-red-200 bg-red-50/30' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {imageUrl && !hasError ? (
              <Image
                src={imageUrl}
                alt={listing.title}
                fill
                sizes="96px"
                className={`object-cover ${isDeleted ? 'opacity-50' : ''}`}
                onError={handleError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className={`font-semibold ${isDeleted ? 'line-through text-muted-foreground' : ''}`}>
                  {listing.title}
                </h3>
                <p className="text-lg font-bold text-primary">
                  {listing.price ? `$${listing.price.toLocaleString()}` : 'No price'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">by {sellerName}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {statusBadge}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {listing.views_count || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {!isDeleted && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listing/${listing.id}`} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>
              )}

              {isDeleted && (
                <>
                  {/* Restore */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isActing}
                    onClick={() => handleAction('restore')}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restore
                  </Button>

                  {/* Hard delete — requires confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isActing}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Forever
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Permanently delete this listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete <strong>{listing.title}</strong> and all its images from
                          storage. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleAction('hard_delete')}
                        >
                          Delete Forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <span className="text-xs text-red-500">
                    Deleted {new Date(listing.deleted_at!).toLocaleDateString()}
                  </span>
                </>
              )}

              {!isDeleted && (
                <span className="text-xs text-muted-foreground">
                  Created {new Date(listing.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

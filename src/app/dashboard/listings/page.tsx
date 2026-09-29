import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Plus,
  ImageIcon,
  Upload,
} from 'lucide-react';
import { DashboardListingCard } from '@/components/dashboard/DashboardListingCard';

export default async function ListingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/listings');
  }

  const { data: listings } = await supabase
    .from('listings')
    .select(`
      id, title, price, status, views_count, created_at, updated_at,
      images:listing_images(id, url, thumbnail_url, is_primary)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'sold':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPrimaryImage = (images: Array<{ id: string; url: string; thumbnail_url?: string | null; is_primary: boolean }>) => {
    const primary = images?.find((img) => img.is_primary) || images?.[0];
    if (!primary) return null;
    if (primary.thumbnail_url && primary.thumbnail_url.length > 0) return primary.thumbnail_url;
    return primary.url || null;
  };

  const count = listings?.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="My Listings"
        description={`${count} listing${count !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/bulk">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Link>
            </Button>
          </>
        }
      />

      <div>
        {listings && listings.length > 0 ? (
          <div className="grid gap-4">
            {listings.map((listing) => {
              const imageUrl = getPrimaryImage(listing.images || []);
              return (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  imageUrl={imageUrl}
                  statusBadgeClass={getStatusBadge(listing.status)}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first listing to start selling equipment, or bring your whole inventory over in one step.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <Button asChild>
                  <Link href="/dashboard/listings/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/bulk">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Inventory
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

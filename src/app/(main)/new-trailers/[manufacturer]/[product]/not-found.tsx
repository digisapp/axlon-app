import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Home, Truck } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This product may have been discontinued or the URL may be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/new-trailers">
              <Search className="w-4 h-4 mr-2" />
              Browse New Trailers
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Factory, Home } from 'lucide-react';

export default function ManufacturerNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Factory className="w-8 h-8 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-bold mb-2">Manufacturer Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This manufacturer page doesn&apos;t exist or may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/manufacturers">
              <Factory className="w-4 h-4 mr-2" />
              All Manufacturers
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

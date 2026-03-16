import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Home,
  Truck,
  Package,
  Building2,
  ArrowRight,
} from 'lucide-react';

const popularLinks = [
  { href: '/search', label: 'Browse All Equipment', icon: Search },
  { href: '/new-trailers', label: 'New Trailers', icon: Truck },
  { href: '/categories', label: 'Categories', icon: Package },
  { href: '/dealers', label: 'Business Directory', icon: Building2 },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Header */}
        <div className="text-8xl font-bold text-muted-foreground/20 mb-2">404</div>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Search Bar */}
        <form action="/search" className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search for equipment..."
            className="h-12 pl-12 pr-4 rounded-full bg-background border shadow-sm"
          />
        </form>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-card border hover:bg-muted transition-colors group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Home Button */}
        <Button asChild className="rounded-full gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

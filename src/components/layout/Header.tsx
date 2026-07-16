'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Heart,
  MessageSquare,
  Package,
  Settings,
  LogOut,
  Plus,
  LayoutDashboard,
  DollarSign,
  Headphones,
  ChevronDown,
  Bot,
  Search,
  Truck,
  Building2,
  LayoutGrid,
  Store,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface UserProfile {
  id: string;
  email: string;
  company_name?: string;
  avatar_url?: string;
}

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, company_name, avatar_url')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser(profile);
        }

        // Get unread message count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', authUser.id)
          .eq('is_read', false);

        setUnreadCount(count || 0);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/listings', label: 'My Listings', icon: Package },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { href: '/dashboard/saved', label: 'Saved', icon: Heart },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isMarketplaceActive = pathname.startsWith('/search') || pathname.startsWith('/new-trailers') || pathname.startsWith('/dealers') || pathname.startsWith('/categories');
  const isForDealersActive = pathname === '/how-it-works' || pathname === '/voice' || pathname === '/pricing' || pathname === '/transform' || pathname === '/get-started';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="Axleyard"
              width={40}
              height={40}
              className="h-8 w-8"
              priority
            />
            <span className="font-bold text-xl font-[family-name:var(--font-gunship)] tracking-wider">AXLE<span className="text-primary">YARD</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Marketplace Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isMarketplaceActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Marketplace
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuItem asChild>
                  <Link href="/search" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    Browse Equipment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/new-trailers" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    New Trailers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dealers" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    Directory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-4 h-4 text-primary" />
                    </div>
                    Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* For Dealers Dropdown — the single business journey */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isForDealersActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  For Dealers
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuItem asChild>
                  <Link href="/how-it-works" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">AI Platform</p>
                      <p className="text-xs text-muted-foreground">Sales assistant, CRM & automation</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/voice" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600/10 flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        Voice Agent
                        <span className="text-[10px] font-semibold bg-cyan-600 text-white px-1.5 py-0.5 rounded-full leading-none">24/7</span>
                      </p>
                      <p className="text-xs text-muted-foreground">AI answers every call, day or night</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Pricing</p>
                      <p className="text-xs text-muted-foreground">Free to list — Platform from $499/mo</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transform" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Done-For-You</p>
                      <p className="text-xs text-muted-foreground">We build & run it all for you</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/get-started" className="flex items-center gap-3 font-medium text-primary">
                    Get Started Free
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/listings/new">
                    <Plus className="w-4 h-4 mr-2" />
                    List Equipment
                  </Link>
                </Button>

                <ThemeToggle />
                <NotificationBell />

                <Link href="/dashboard/messages" className="relative">
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {(user.company_name || user.email)?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.company_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {userLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center">
                          <link.icon className="w-4 h-4 mr-2" />
                          {link.label}
                          {link.badge ? (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                              {link.badge}
                            </span>
                          ) : null}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/search" aria-label="Search listings">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {user && (
              <Link href="/dashboard/messages" className="relative">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/images/axlonai-logo.png"
                      alt="Axleyard"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                    <span className="font-bold text-xl font-[family-name:var(--font-gunship)] tracking-wider">AXLE<span className="text-primary">YARD</span></span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-4">
                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col gap-1">
                    {/* Marketplace Section */}
                    <p className="px-3 pt-1 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Marketplace
                    </p>
                    <Link
                      href="/search"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname.startsWith('/search')
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Search className="w-5 h-5" />
                      Browse Equipment
                    </Link>
                    <Link
                      href="/new-trailers"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname.startsWith('/new-trailers')
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      New Trailers
                    </Link>
                    <Link
                      href="/dealers"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname.startsWith('/dealers')
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      Directory
                    </Link>
                    <Link
                      href="/categories"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname.startsWith('/categories')
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                      Categories
                    </Link>
                  </nav>

                  <div className="h-px bg-border" />

                  <nav className="flex flex-col gap-1">
                    {/* For Dealers Section */}
                    <p className="px-3 pt-1 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      For Dealers
                    </p>
                    <Link
                      href="/how-it-works"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/how-it-works'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                      AI Platform
                    </Link>
                    <Link
                      href="/voice"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/voice'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Headphones className="w-5 h-5" />
                      <span className="flex items-center gap-2">
                        Voice Agent
                        <span className="text-[10px] font-semibold bg-cyan-600 text-white px-1.5 py-0.5 rounded-full leading-none">24/7</span>
                      </span>
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname === '/pricing'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      Pricing
                    </Link>
                    <Link
                      href="/transform"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted"
                    >
                      <Store className="w-5 h-5" />
                      Done-For-You
                    </Link>
                    <Link
                      href="/get-started"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                        pathname === '/get-started'
                          ? 'bg-primary/10 text-primary'
                          : 'text-primary hover:bg-muted'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                      Get Started Free
                    </Link>
                  </nav>

                  <div className="h-px bg-border" />

                  {/* User Info */}
                  {user && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {(user.company_name || user.email)?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.company_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* User Links */}
                  {user && (
                    <>
                      <div className="h-px bg-border" />
                      <nav className="flex flex-col gap-1">
                        {userLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              pathname === link.href
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                            {link.badge ? (
                              <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                {link.badge}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </nav>
                    </>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t flex flex-col gap-2">
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    {user ? (
                      <>
                        <Button asChild className="w-full">
                          <Link href="/dashboard/listings/new" onClick={() => setIsOpen(false)}>
                            <Plus className="w-4 h-4 mr-2" />
                            List Equipment
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleSignOut}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full">
                          <Link href="/signup" onClick={() => setIsOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

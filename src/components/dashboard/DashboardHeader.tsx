'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNavItems } from '@/lib/dashboard-nav';
import type { PlanTier } from '@/lib/plans';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileSidebar } from './MobileSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Plus,
  Bell,
  Store,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Search,
  Clock,
} from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    email: string;
    id: string;
  };
  profile?: {
    company_name?: string | null;
    avatar_url?: string | null;
  } | null;
  unreadMessages?: number;
  newLeads?: number;
  pendingAiInbox?: number;
  trialDaysRemaining?: number | null;
  /** Passed through to the mobile nav so it shows the same locks/upsell as desktop */
  subscriptionTier?: string;
  effectiveTier?: PlanTier;
}

export function DashboardHeader({
  user,
  profile,
  unreadMessages = 0,
  newLeads = 0,
  pendingAiInbox = 0,
  trialDaysRemaining,
  subscriptionTier,
  effectiveTier,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const displayName = profile?.company_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const totalNotifications = unreadMessages + newLeads + pendingAiInbox;
  // Current section name (longest matching nav href wins, e.g. /dashboard/listings/new → Listings)
  const sectionLabel =
    dashboardNavItems
      .filter((item) => (item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? 'Dashboard';

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Trigger */}
        <MobileSidebar
          unreadMessages={unreadMessages}
          newLeads={newLeads}
          pendingAiInbox={pendingAiInbox}
          subscriptionTier={subscriptionTier}
          effectiveTier={effectiveTier}
        />

        {/* Section name — not an <h1>: every page renders its own h1 via PageHeader */}
        <div className="hidden lg:block">
          <p className="text-lg font-semibold">{sectionLabel}</p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Primary Action Button */}
          <Button size="sm" className="gap-2" asChild>
            <Link href="/dashboard/listings/new" aria-label="New listing">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Listing</span>
            </Link>
          </Button>

          {/* Trial Countdown */}
          {trialDaysRemaining != null && trialDaysRemaining > 0 && (
            <Link
              href="/dashboard/billing"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                trialDaysRemaining <= 7
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-950/60'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Clock className="w-3 h-3" />
              Trial: {trialDaysRemaining}d remaining
            </Link>
          )}

          <ThemeToggle size="sm" />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={totalNotifications > 0 ? `Notifications (${totalNotifications} new)` : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalNotifications > 9 ? '9+' : totalNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadMessages > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/messages" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>{unreadMessages} new message{unreadMessages !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {newLeads > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/leads" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{newLeads} new lead{newLeads !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {pendingAiInbox > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/ai-inbox" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>{pendingAiInbox} AI draft{pendingAiInbox !== 1 ? 's' : ''} to review</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {totalNotifications === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{displayName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/storefront" className="cursor-pointer">
                  <Store className="w-4 h-4 mr-2" />
                  Storefront
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/contact" className="cursor-pointer">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

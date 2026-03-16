'use client';

import Link from 'next/link';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdminMobileSidebar } from './AdminMobileSidebar';
import {
  Bell,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import type { AdminNavSection } from '@/lib/admin-nav';

interface AdminHeaderProps {
  user: {
    email: string;
    id: string;
  };
  sections: AdminNavSection[];
  badges: {
    pendingBusinesses: number;
    newLeads: number;
    pendingTradeIns: number;
  };
}

export function AdminHeader({ user, sections, badges }: AdminHeaderProps) {
  const displayName = user.email?.split('@')[0] || 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();
  const totalNotifications = badges.pendingBusinesses + badges.newLeads + badges.pendingTradeIns;

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <AdminMobileSidebar sections={sections} />

        {/* Title - desktop only */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalNotifications > 9 ? '9+' : totalNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Action Items</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {badges.pendingBusinesses > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dealers" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>{badges.pendingBusinesses} business{badges.pendingBusinesses !== 1 ? 'es' : ''} awaiting verification</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {badges.newLeads > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/leads" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{badges.newLeads} new lead{badges.newLeads !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {badges.pendingTradeIns > 0 && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/trade-ins" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span>{badges.pendingTradeIns} pending trade-in{badges.pendingTradeIns !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
              {totalNotifications === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No action items
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-red-100 text-red-700">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{displayName}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Business Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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

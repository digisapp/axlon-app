'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import type { AdminNavSection } from '@/lib/admin-nav';

interface AdminMobileSidebarProps {
  sections: AdminNavSection[];
}

export function AdminMobileSidebar({ sections }: AdminMobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 border-b px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="AXLON AI"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <SheetTitle className="font-bold text-lg">AXLON AI</SheetTitle>
            <span className="text-[10px] font-medium bg-red-500 text-white px-1.5 py-0.5 rounded">
              ADMIN
            </span>
          </div>
        </SheetHeader>

        <nav className="p-3 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {sections.map((section, sectionIdx) => (
            <div key={section.label} className={cn(sectionIdx > 0 && 'mt-4')}>
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom - Back to Dealer Dashboard */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dealer Dashboard
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

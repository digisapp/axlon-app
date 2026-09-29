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
import { Menu, Lock } from 'lucide-react';
import { dashboardNavSections, getNavSectionsWithBadges } from '@/lib/dashboard-nav';
import { isFeatureUnlocked, type PlanTier } from '@/lib/plans';

interface MobileSidebarProps {
  unreadMessages?: number;
  newLeads?: number;
  pendingAiInbox?: number;
  /** Actual plan — drives the upsell card (same copy as the desktop Sidebar) */
  subscriptionTier?: string;
  /** Trial-aware tier — locked items show a padlock, as on desktop */
  effectiveTier?: PlanTier;
}

export function MobileSidebar({
  unreadMessages = 0,
  newLeads = 0,
  pendingAiInbox = 0,
  subscriptionTier,
  effectiveTier,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sections = getNavSectionsWithBadges(dashboardNavSections, unreadMessages, newLeads, pendingAiInbox);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open dashboard menu</span>
        </Button>
      </SheetTrigger>
      {/* Flex column: the nav scrolls, the upsell card sits below it. The old
          absolute-positioned card covered the last nav items (Account/Billing). */}
      <SheetContent side="left" className="w-72 p-0 flex flex-col gap-0">
        <SheetHeader className="h-16 shrink-0 border-b px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="AXLON AI"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <SheetTitle className="font-bold text-lg font-[family-name:var(--font-gunship)] tracking-wider">AXLON <span className="text-primary">AI</span></SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex-1 min-h-0 p-3 overflow-y-auto">
          {sections.map((section, sectionIdx) => (
            <div key={section.label} className={cn(sectionIdx > 0 && 'mt-4')}>
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href);
                  const isLocked =
                    !!effectiveTier && !!item.feature && !isFeatureUnlocked(item.feature, effectiveTier);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground/60" aria-label="Paid feature" />}
                      {!!item.badge && item.badge > 0 && (
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

        {/* Bottom Banner — same offer as the desktop Sidebar */}
        <div className="shrink-0 p-3 border-t bg-background pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {!subscriptionTier || subscriptionTier === 'free' ? (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3">
              <p className="font-medium text-sm mb-1">Unlock AI Tools</p>
              <p className="text-xs text-muted-foreground mb-2">
                AI lead response, CRM, analytics & more — $499/mo
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing" onClick={() => setOpen(false)}>
                  See Plans
                </Link>
              </Button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-lg p-3">
              <p className="font-medium text-sm mb-1">Add Voice Agent</p>
              <p className="text-xs text-muted-foreground mb-2">
                AI answers your calls 24/7 — $299/mo
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link href="/dashboard/billing" onClick={() => setOpen(false)}>
                  Add Voice
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

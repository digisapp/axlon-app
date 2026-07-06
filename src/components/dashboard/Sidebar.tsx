'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { dashboardNavSections, getNavSectionsWithBadges } from '@/lib/dashboard-nav';
import { isFeatureUnlocked, type PlanTier } from '@/lib/plans';

interface SidebarProps {
  unreadMessages?: number;
  newLeads?: number;
  pendingAiInbox?: number;
  subscriptionTier?: string;
  /** Trial-aware tier — free accounts in trial see everything unlocked */
  effectiveTier?: PlanTier;
}

export function Sidebar({ unreadMessages = 0, newLeads = 0, pendingAiInbox = 0, subscriptionTier = 'free', effectiveTier = 'free' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sections = getNavSectionsWithBadges(dashboardNavSections, unreadMessages, newLeads, pendingAiInbox);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/axlonai-logo.png"
              alt="AXLON AI"
              width={32}
              height={32}
              className="w-8 h-8 flex-shrink-0"
            />
            {!collapsed && (
              <span className="font-bold text-lg font-[family-name:var(--font-gunship)] tracking-wider">AXLON <span className="text-primary">AI</span></span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {sections.map((section, sectionIdx) => (
            <div key={section.label} className={cn(sectionIdx > 0 && 'mt-4')}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {section.label}
                </p>
              )}
              {collapsed && sectionIdx > 0 && (
                <div className="mx-2 mb-2 border-t border-border/50" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href);
                  const isLocked = !!item.feature && !isFeatureUnlocked(item.feature, effectiveTier);

                  const linkContent = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative text-sm',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {isLocked && (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
                          )}
                          {item.badge && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.label}
                          {item.badge && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Banner */}
        {!collapsed && (
          <div className="p-3 border-t">
            {subscriptionTier === 'free' ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4">
                <p className="font-medium text-sm mb-1">Unlock AI Tools</p>
                <p className="text-xs text-muted-foreground mb-3">
                  AI lead response, CRM, analytics & more — $499/mo
                </p>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/billing">See Plans</Link>
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-lg p-4">
                <p className="font-medium text-sm mb-1">Add Voice Agent</p>
                <p className="text-xs text-muted-foreground mb-3">
                  AI answers your calls 24/7 — $299/mo
                </p>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/billing">Add Voice</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('w-full', collapsed && 'px-2')}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function SidebarSpacer({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    />
  );
}

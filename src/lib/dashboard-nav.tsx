import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  Warehouse,
  Settings,
  MessageSquare,
  Store,
  Phone,
  PhoneIncoming,
  Handshake,
  Brain,
  Contact,
  Upload,
  CreditCard,
  TrendingUp,
  Sparkles,
  Heart,
  BotMessageSquare,
  DollarSign,
  Bot,
  Inbox,
} from 'lucide-react';

import type { FeatureKey } from '@/lib/plans';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  /** Plan-gated feature this item belongs to — Sidebar shows a lock when unavailable */
  feature?: FeatureKey;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Sidebar navigation. Five short sections instead of one long list: a new
 * dealer should be able to find Leads and Listings without reading 22 items.
 * Pages that exist but aren't listed here (Call Log, AI Chats, AI Leads,
 * Saved) are reached from their parent page or the account menu — see
 * `secondaryNavItems`.
 */
export const dashboardNavSections: NavSection[] = [
  {
    label: 'Main',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        href: '/dashboard/analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Equipment',
    items: [
      {
        href: '/dashboard/listings',
        label: 'Listings',
        icon: <Package className="w-5 h-5" />,
      },
      {
        href: '/dashboard/inventory',
        label: 'Inventory',
        icon: <Warehouse className="w-5 h-5" />,
      },
      {
        href: '/dashboard/bulk',
        feature: 'bulkImport',
        label: 'Bulk Import',
        icon: <Upload className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        href: '/dashboard/leads',
        label: 'Leads',
        icon: <Users className="w-5 h-5" />,
      },
      {
        href: '/dashboard/crm',
        feature: 'crm',
        label: 'CRM',
        icon: <Contact className="w-5 h-5" />,
      },
      {
        href: '/dashboard/deal-desk',
        feature: 'dealDesk',
        label: 'Deals',
        icon: <Handshake className="w-5 h-5" />,
      },
      {
        href: '/dashboard/messages',
        label: 'Messages',
        icon: <MessageSquare className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'AXLON AI',
    items: [
      {
        href: '/dashboard/ai-inbox',
        feature: 'aiInbox',
        label: 'AI Inbox',
        icon: <Inbox className="w-5 h-5" />,
      },
      {
        href: '/dashboard/voice-agent',
        feature: 'voiceAgent',
        label: 'Voice Agent',
        icon: <Phone className="w-5 h-5" />,
      },
      {
        href: '/dashboard/ai-assistant',
        feature: 'aiAssistant',
        label: 'AI Assistant',
        icon: <Brain className="w-5 h-5" />,
      },
      {
        href: '/dashboard/ai-performance',
        feature: 'aiAssistant',
        label: 'Performance',
        icon: <Bot className="w-5 h-5" />,
      },
      {
        href: '/dashboard/market-intel',
        feature: 'marketIntel',
        label: 'Market Intel',
        icon: <TrendingUp className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Business',
    items: [
      {
        href: '/dashboard/floor-plan',
        feature: 'floorPlan',
        label: 'Floor Plan',
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        href: '/dashboard/storefront',
        label: 'Storefront',
        icon: <Store className="w-5 h-5" />,
      },
      {
        href: '/dashboard/settings',
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
      },
      {
        href: '/dashboard/billing',
        label: 'Billing',
        icon: <CreditCard className="w-5 h-5" />,
      },
    ],
  },
];

/**
 * Pages reachable from inside another page rather than the sidebar. Listed so
 * the header can still name the section the dealer is on.
 */
export const secondaryNavItems: NavItem[] = [
  {
    href: '/dashboard/calls',
    label: 'Call Log',
    icon: <PhoneIncoming className="w-5 h-5" />,
  },
  {
    href: '/dashboard/conversations',
    label: 'AI Chats',
    icon: <BotMessageSquare className="w-5 h-5" />,
  },
  {
    href: '/dashboard/ai-leads',
    label: 'AI Leads',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    href: '/dashboard/saved',
    label: 'Saved Listings',
    icon: <Heart className="w-5 h-5" />,
  },
];

// Flat list for backward compatibility
export const dashboardNavItems: NavItem[] = dashboardNavSections.flatMap(s => s.items);

/** Every dashboard page with a nav label, sidebar or not. */
export const allDashboardNavItems: NavItem[] = [...dashboardNavItems, ...secondaryNavItems];

export function getNavItemsWithBadges(
  items: NavItem[],
  unreadMessages: number,
  newLeads: number,
  pendingAiInbox?: number,
): NavItem[] {
  return items.map((item) => {
    if (item.href === '/dashboard/messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    if (item.href === '/dashboard/leads' && newLeads > 0) {
      return { ...item, badge: newLeads };
    }
    if (item.href === '/dashboard/ai-inbox' && pendingAiInbox && pendingAiInbox > 0) {
      return { ...item, badge: pendingAiInbox };
    }
    return item;
  });
}

export function getNavSectionsWithBadges(
  sections: NavSection[],
  unreadMessages: number,
  newLeads: number,
  pendingAiInbox?: number,
): NavSection[] {
  return sections.map((section) => ({
    ...section,
    items: getNavItemsWithBadges(section.items, unreadMessages, newLeads, pendingAiInbox),
  }));
}

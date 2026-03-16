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
  UserCog,
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
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const dashboardNavSections: NavSection[] = [
  {
    label: 'Dashboard',
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
    label: 'Inventory',
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
        label: 'Bulk Import',
        icon: <Upload className="w-5 h-5" />,
      },
      {
        href: '/dashboard/floor-plan',
        label: 'Floor Plan',
        icon: <DollarSign className="w-5 h-5" />,
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
        label: 'CRM',
        icon: <Contact className="w-5 h-5" />,
      },
      {
        href: '/dashboard/deal-desk',
        label: 'Deal Desk',
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
    label: 'AI Tools',
    items: [
      {
        href: '/dashboard/ai-assistant',
        label: 'AI Assistant',
        icon: <Brain className="w-5 h-5" />,
      },
      {
        href: '/dashboard/voice-agent',
        label: 'Voice Agent',
        icon: <Phone className="w-5 h-5" />,
      },
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
        href: '/dashboard/market-intel',
        label: 'Market Intel',
        icon: <TrendingUp className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      {
        href: '/dashboard/storefront',
        label: 'Storefront',
        icon: <Store className="w-5 h-5" />,
      },
      {
        href: '/dashboard/saved',
        label: 'Saved',
        icon: <Heart className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Team',
    items: [
      {
        href: '/dashboard/staff',
        label: 'Staff Access',
        icon: <UserCog className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        href: '/dashboard/settings',
        label: 'Account',
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

// Flat list for backward compatibility
export const dashboardNavItems: NavItem[] = dashboardNavSections.flatMap(s => s.items);

export function getNavItemsWithBadges(
  items: NavItem[],
  unreadMessages: number,
  newLeads: number,
  newAiLeads?: number
): NavItem[] {
  return items.map((item) => {
    if (item.href === '/dashboard/messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    if (item.href === '/dashboard/leads' && newLeads > 0) {
      return { ...item, badge: newLeads };
    }
    return item;
  });
}

export function getNavSectionsWithBadges(
  sections: NavSection[],
  unreadMessages: number,
  newLeads: number,
): NavSection[] {
  return sections.map((section) => ({
    ...section,
    items: getNavItemsWithBadges(section.items, unreadMessages, newLeads),
  }));
}

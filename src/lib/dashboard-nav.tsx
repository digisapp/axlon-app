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
  UserCog,
  Handshake,
  Brain,
  Contact,
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
    label: 'Main',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
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
    ],
  },
  {
    label: 'AI',
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
    ],
  },
  {
    label: 'Marketing',
    items: [
      {
        href: '/dashboard/storefront',
        label: 'Storefront',
        icon: <Store className="w-5 h-5" />,
      },
      {
        href: '/dashboard/analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      {
        href: '/dashboard/staff',
        label: 'Staff Access',
        icon: <UserCog className="w-5 h-5" />,
      },
      {
        href: '/dashboard/messages',
        label: 'Messages',
        icon: <MessageSquare className="w-5 h-5" />,
      },
      {
        href: '/dashboard/settings',
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
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

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
  Package,
  Phone,
  PhoneCall,
  UserPlus,
  Mic,
  Key,
  DollarSign,
  ArrowUpRight,
  Megaphone,
  Factory,
  Bot,
  TrendingUp,
  Database,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

export const adminNavSections: AdminNavSection[] = [
  {
    label: 'Main',
    items: [
      {
        href: '/admin',
        label: 'Overview',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        href: '/admin/analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        href: '/admin/leads',
        label: 'Leads',
        icon: <PhoneCall className="w-5 h-5" />,
      },
      {
        href: '/admin/calls',
        label: 'Call Logs',
        icon: <Phone className="w-5 h-5" />,
      },
      {
        href: '/admin/trade-ins',
        label: 'Trade-Ins',
        icon: <ArrowUpRight className="w-5 h-5" />,
      },
      {
        href: '/admin/outreach',
        label: 'Outreach',
        icon: <Megaphone className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Businesses',
    items: [
      {
        href: '/admin/directory',
        label: 'Business Directory',
        icon: <Database className="w-5 h-5" />,
      },
      {
        href: '/admin/dealers',
        label: 'Verification',
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        href: '/admin/users',
        label: 'Users',
        icon: <Users className="w-5 h-5" />,
      },
      {
        href: '/admin/onboarding',
        label: 'Onboarding',
        icon: <UserPlus className="w-5 h-5" />,
      },
      {
        href: '/admin/staff',
        label: 'Staff',
        icon: <Key className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'AI & Voice',
    items: [
      {
        href: '/admin/ai-agent',
        label: 'Phone Agent',
        icon: <Bot className="w-5 h-5" />,
      },
      {
        href: '/admin/voice-agents',
        label: 'Business Agents',
        icon: <Mic className="w-5 h-5" />,
      },
      {
        href: '/admin/market-reports',
        label: 'Market Reports',
        icon: <TrendingUp className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        href: '/admin/listings',
        label: 'Listings',
        icon: <Package className="w-5 h-5" />,
      },
      {
        href: '/admin/manufacturers',
        label: 'Manufacturers',
        icon: <Factory className="w-5 h-5" />,
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        href: '/admin/settings',
        label: 'Billing',
        icon: <DollarSign className="w-5 h-5" />,
      },
    ],
  },
];

export function getAdminNavWithBadges(
  sections: AdminNavSection[],
  badges: Record<string, number>,
): AdminNavSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      badge: badges[item.href] || undefined,
    })),
  }));
}

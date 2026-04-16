'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
  Eye,
  ExternalLink,
  Truck,
  HardHat,
  DollarSign,
  User,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: 'trailer_dealer', label: 'Trailer Dealer', color: 'bg-blue-100 text-blue-700' },
  { value: 'crane_rigging', label: 'Crane & Rigging', color: 'bg-orange-100 text-orange-700' },
  { value: 'truck_manufacturer', label: 'Truck Mfr', color: 'bg-purple-100 text-purple-700' },
  { value: 'trailer_manufacturer', label: 'Trailer Mfr', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'transportation', label: 'Transportation', color: 'bg-green-100 text-green-700' },
  { value: 'equipment_dealer', label: 'Equipment Dealer', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'parts_supplier', label: 'Parts & Supplier', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'services', label: 'Services', color: 'bg-pink-100 text-pink-700' },
  { value: 'towing', label: 'Towing', color: 'bg-amber-100 text-amber-700' },
  { value: 'construction', label: 'Construction', color: 'bg-stone-100 text-stone-700' },
  { value: 'buyer_lead', label: 'Buyer Lead', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700' },
  { value: 'uncategorized', label: 'Uncategorized', color: 'bg-gray-100 text-gray-500' },
];

const SOURCES = [
  { value: 'scra', label: 'SCRA Directory' },
  { value: 'conexpo', label: 'ConExpo 2026' },
  { value: 'scraped', label: 'Scraped' },
  { value: 'manual', label: 'Manual' },
  { value: 'curated', label: 'Curated' },
  { value: 'equipment_radar', label: 'Equipment Radar' },
  { value: 'tow_trucking_list', label: 'Tow & Trucking' },
  { value: 'axe_ntda', label: 'AXE NTDA' },
  { value: 'axe_salesforce', label: 'AXE Salesforce' },
  { value: 'axe_salesforce_crm', label: 'AXE SF CRM' },
  { value: 'axe_conexpo_2017', label: 'AXE ConExpo 2017' },
  { value: 'axe_opportunities', label: 'AXE Opportunities' },
  { value: 'axe_projectsource', label: 'ProjectSource' },
  { value: 'axe_bluebook', label: 'BlueBook' },
  { value: 'axe_datacom', label: 'Data.com' },
  { value: 'axe_deals', label: 'AXE Deals' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

// Which sources belong to which tab
const BUYER_SOURCES = ['tow_trucking_list'];
const CONSTRUCTION_SOURCES = ['axe_projectsource', 'axe_bluebook', 'axe_datacom'];
const DEAL_SOURCES = ['axe_deals'];
const DIRECTORY_EXCLUDE = [...BUYER_SOURCES, ...CONSTRUCTION_SOURCES, ...DEAL_SOURCES];

type DirectoryTab = 'directory' | 'buyers' | 'construction' | 'deals';

const TAB_CONFIG: Record<DirectoryTab, {
  label: string;
  icon: typeof Database;
  subtitle: string;
  sources: string[] | null; // null = all (minus excluded)
  excludeSources: string[] | null;
  defaultCategory?: string;
}> = {
  directory: {
    label: 'Industry Directory',
    icon: Database,
    subtitle: 'Businesses, manufacturers & industry contacts for outreach',
    sources: null,
    excludeSources: DIRECTORY_EXCLUDE,
  },
  buyers: {
    label: 'Buyer Leads',
    icon: Truck,
    subtitle: 'Tow & trucking companies — sell trailers, reports, marketplace',
    sources: BUYER_SOURCES,
    excludeSources: null,
  },
  construction: {
    label: 'Construction Leads',
    icon: HardHat,
    subtitle: 'Construction companies from ProjectSource & BlueBook',
    sources: CONSTRUCTION_SOURCES,
    excludeSources: null,
    defaultCategory: 'construction',
  },
  deals: {
    label: 'Deal History',
    icon: DollarSign,
    subtitle: 'Historical AXE deal records — AI training data',
    sources: DEAL_SOURCES,
    excludeSources: null,
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Business {
  id: string;
  source: string;
  source_id: string;
  company_name: string;
  category: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  description: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  brands: string[] | null;
  equipment_types: string[] | null;
  tags: string[] | null;
  invite_status: string;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

interface DirStats {
  total?: number;
  with_email?: number;
  with_phone?: number;
  by_source?: Record<string, number>;
  by_category?: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCategoryBadge(category: string) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
}

function getSourceLabel(source: string) {
  return SOURCES.find(s => s.value === source)?.label || source;
}

function formatCurrency(val: unknown): string {
  const n = Number(val);
  if (!n || isNaN(n)) return '—';
  return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// ---------------------------------------------------------------------------
// Small helper components
// ---------------------------------------------------------------------------

function ExtraContacts({ rawData }: { rawData: Record<string, unknown> | null }) {
  if (!rawData?.extra_contacts || !Array.isArray(rawData.extra_contacts)) return null;
  const contacts = rawData.extra_contacts as Array<{name?: string; email?: string; title?: string}>;
  if (contacts.length === 0) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">Additional Contacts</p>
      <div className="space-y-1">
        {contacts.map((c, i) => (
          <div key={i} className="text-sm flex items-center gap-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <span>{c.name}</span>
            {c.title && <span className="text-muted-foreground text-xs">({c.title})</span>}
            {c.email && <a href={`mailto:${c.email}`} className="text-primary text-xs hover:underline">{c.email}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DealDetails({ business }: { business: Business }) {
  if (business.source !== 'axe_deals' || !business.raw_data) return null;
  const d = business.raw_data as Record<string, string | number | null>;
  const fields: [string, string | null][] = [
    ['Date', d.funding_date ? String(d.funding_date) : null],
    ['Funded', d.funding_amount ? formatCurrency(d.funding_amount) : null],
    ['Unit Cost', d.unit_cost ? formatCurrency(d.unit_cost) : null],
    ['FET', d.fet ? formatCurrency(d.fet) : null],
    ['Sales Tax', d.sales_tax ? formatCurrency(d.sales_tax) : null],
    ['Dealer Fee', d.dealer_fee ? formatCurrency(d.dealer_fee) : null],
    ['Points', d.points ? String(d.points) : null],
    ['Unit Profit', d.unit_profit ? formatCurrency(d.unit_profit) : null],
    ['Total Profit', d.total_profit ? formatCurrency(d.total_profit) : null],
    ['Rep', d.rep ? String(d.rep) : null],
  ];
  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Deal Details</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {fields.map(([label, val]) => val && (
          <div key={label}>
            <span className="text-muted-foreground">{label}:</span>{' '}
            <span className={label.includes('Profit') ? 'text-green-600 font-medium' : ''}>{val}</span>
          </div>
        ))}
        {d.notes && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Notes:</span> {String(d.notes)}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBadgeList({ label, items, variant, size }: {
  label: string;
  items: string[] | null;
  variant: 'secondary' | 'outline';
  size?: 'xs';
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <Badge key={item} variant={variant} className={size === 'xs' ? 'text-[10px]' : 'text-xs'}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminDirectoryPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  // Tab
  const [activeTab, setActiveTab] = useState<DirectoryTab>('directory');

  // Filters
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [contactFilter, setContactFilter] = useState(''); // 'hasEmail' | 'hasPhone' | 'hasBoth' | 'noEmail'

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Bulk action
  const [showBulkAction, setShowBulkAction] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Detail view
  const [detailBusiness, setDetailBusiness] = useState<Business | null>(null);

  // Stats
  const [stats, setStats] = useState<DirStats | null>(null);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (search) params.set('q', search);
      if (stateFilter) params.set('state', stateFilter);

      // Contact filter
      if (contactFilter === 'hasEmail') params.set('hasEmail', 'true');
      else if (contactFilter === 'hasPhone') params.set('hasPhone', 'true');
      else if (contactFilter === 'hasBoth') { params.set('hasEmail', 'true'); params.set('hasPhone', 'true'); }
      else if (contactFilter === 'noEmail') params.set('hasEmail', 'false');

      // Tab-based source/category filtering
      const tabCfg = TAB_CONFIG[activeTab];
      if (sourceFilter) {
        params.set('source', sourceFilter);
      } else if (tabCfg.sources) {
        // If tab has specific sources and only one, use source=
        if (tabCfg.sources.length === 1) {
          params.set('source', tabCfg.sources[0]);
        }
        // For multi-source tabs, we don't filter by source (they'll be filtered by category or excludeSources)
      }
      if (!sourceFilter && tabCfg.excludeSources && tabCfg.excludeSources.length > 0) {
        params.set('excludeSources', tabCfg.excludeSources.join(','));
      }

      if (categoryFilter) {
        params.set('category', categoryFilter);
      } else if (tabCfg.defaultCategory) {
        params.set('category', tabCfg.defaultCategory);
      }

      const res = await csrfFetch(`/api/admin/directory?${params}`);
      if (res.ok) {
        const json = await res.json();
        setBusinesses(json.data || []);
        setTotal(json.total || 0);
        if (json.stats) setStats(json.stats);
      }
    } catch (error) {
      logger.error('Error fetching directory', { error });
    }
    setIsLoading(false);
  }, [page, limit, search, sourceFilter, categoryFilter, stateFilter, contactFilter, activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [search, sourceFilter, categoryFilter, stateFilter, contactFilter, activeTab]);

  const switchTab = (tab: DirectoryTab) => {
    setActiveTab(tab);
    setSearch('');
    setSourceFilter('');
    setCategoryFilter('');
    setStateFilter('');
    setContactFilter('');
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  // ---------------------------------------------------------------------------
  // Selection & Bulk actions
  // ---------------------------------------------------------------------------

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(businesses.map(b => b.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkCategorize = async () => {
    if (!bulkCategory || selectedIds.size === 0) return;
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/admin/directory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), category: bulkCategory }),
      });
      if (res.ok) {
        setShowBulkAction(false);
        setBulkCategory('');
        setSelectedIds(new Set());
        setSelectAll(false);
        fetchData();
      }
    } catch (error) {
      logger.error('Bulk categorize error', { error });
    }
    setIsSaving(false);
  };

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------

  const totalPages = Math.ceil(total / limit);
  const tabCfg = TAB_CONFIG[activeTab];
  const bySource = stats?.by_source || {};
  const byCategory = stats?.by_category || {};

  // Sources available for the current tab's filter dropdown
  const tabSources = tabCfg.sources
    ? SOURCES.filter(s => tabCfg.sources!.includes(s.value))
    : SOURCES.filter(s => !DIRECTORY_EXCLUDE.includes(s.value));

  // Compute tab-specific totals from stats
  function getTabTotal(tab: DirectoryTab): number {
    const cfg = TAB_CONFIG[tab];
    if (cfg.sources) {
      return cfg.sources.reduce((sum, src) => sum + (bySource[src] || 0), 0);
    }
    // directory = total minus excluded sources
    const excluded = (cfg.excludeSources || []).reduce((sum, src) => sum + (bySource[src] || 0), 0);
    return (stats?.total || 0) - excluded;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {(stats?.total || 0).toLocaleString()} total contacts &middot;{' '}
            {(stats?.with_email || 0).toLocaleString()} emails
            {stats?.with_phone ? ` · ${stats.with_phone.toLocaleString()} phones` : ''}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {selectedIds.size} selected
            </Badge>
            <Button size="sm" onClick={() => setShowBulkAction(true)}>
              <Tag className="w-4 h-4 mr-1" />
              Set Category
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setSelectedIds(new Set()); setSelectAll(false); }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tabs with counts */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {(Object.entries(TAB_CONFIG) as [DirectoryTab, typeof TAB_CONFIG[DirectoryTab]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = getTabTotal(key);
          return (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === key ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab subtitle */}
      <p className="text-sm text-muted-foreground -mt-2">
        {total.toLocaleString()} results &middot; {tabCfg.subtitle}
      </p>

      {/* Category chips (clickable filter) */}
      {activeTab !== 'deals' && Object.keys(byCategory).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(byCategory)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([cat, count]) => {
              const catInfo = getCategoryBadge(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    categoryFilter === cat
                      ? 'ring-2 ring-primary ring-offset-1'
                      : 'opacity-80 hover:opacity-100'
                  } ${catInfo.color}`}
                >
                  {catInfo.label} ({(count as number).toLocaleString()})
                </button>
              );
            })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search company, city, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Source filter — only show if tab has multiple possible sources */}
        {tabSources.length > 1 && (
          <Select value={sourceFilter} onValueChange={v => setSourceFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {tabSources.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* State filter */}
        <Select value={stateFilter} onValueChange={v => setStateFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {US_STATES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Contact info filter */}
        <Select value={contactFilter} onValueChange={v => setContactFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Contact Info" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contacts</SelectItem>
            <SelectItem value="hasEmail">Has Email</SelectItem>
            <SelectItem value="hasPhone">Has Phone</SelectItem>
            <SelectItem value="hasBoth">Email + Phone</SelectItem>
            <SelectItem value="noEmail">No Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : activeTab === 'deals' ? (
            /* Deal History table — special columns */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Funding</th>
                    <th className="p-3 text-left hidden md:table-cell">Unit Cost</th>
                    <th className="p-3 text-left hidden md:table-cell">Unit Profit</th>
                    <th className="p-3 text-left hidden lg:table-cell">Total Profit</th>
                    <th className="p-3 text-left hidden lg:table-cell">Rep</th>
                    <th className="p-3 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {businesses.map(biz => {
                    const rd = (biz.raw_data || {}) as Record<string, string | number | null>;
                    return (
                      <tr key={biz.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{biz.company_name}</div>
                          {rd.funding_date && (
                            <p className="text-xs text-muted-foreground mt-0.5">{String(rd.funding_date)}</p>
                          )}
                        </td>
                        <td className="p-3 font-mono text-sm">
                          {formatCurrency(rd.funding_amount)}
                        </td>
                        <td className="p-3 hidden md:table-cell font-mono text-sm">
                          {formatCurrency(rd.unit_cost)}
                        </td>
                        <td className="p-3 hidden md:table-cell font-mono text-sm">
                          <span className={Number(rd.unit_profit) > 0 ? 'text-green-600' : ''}>
                            {formatCurrency(rd.unit_profit)}
                          </span>
                        </td>
                        <td className="p-3 hidden lg:table-cell font-mono text-sm">
                          <span className={Number(rd.total_profit) > 0 ? 'text-green-600' : ''}>
                            {formatCurrency(rd.total_profit)}
                          </span>
                        </td>
                        <td className="p-3 hidden lg:table-cell text-muted-foreground">
                          {String(rd.rep || '—')}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setDetailBusiness(biz)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Standard directory table */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left w-10">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left">Company</th>
                    <th className="p-3 text-left hidden md:table-cell">Category</th>
                    <th className="p-3 text-left hidden lg:table-cell">Location</th>
                    <th className="p-3 text-left hidden md:table-cell">Contact</th>
                    <th className="p-3 text-left hidden lg:table-cell">Phone</th>
                    <th className="p-3 text-left hidden xl:table-cell">Source</th>
                    <th className="p-3 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {businesses.map(biz => {
                    const catInfo = getCategoryBadge(biz.category);
                    return (
                      <tr
                        key={biz.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          selectedIds.has(biz.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={selectedIds.has(biz.id)}
                            onCheckedChange={() => toggleSelect(biz.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{biz.company_name}</div>
                          {biz.contact_name && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {biz.contact_name}
                              {biz.contact_title && <span className="opacity-60">· {biz.contact_title}</span>}
                            </p>
                          )}
                          {biz.description && !biz.contact_name && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[280px]">
                              {biz.description}
                            </p>
                          )}
                          <div className="md:hidden mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${catInfo.color}`}>
                              {catInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                        </td>
                        <td className="p-3 hidden lg:table-cell text-muted-foreground">
                          <div>{[biz.city, biz.state].filter(Boolean).join(', ') || '—'}</div>
                          {biz.zip && <div className="text-xs opacity-60">{biz.zip}</div>}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          {biz.email ? (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[180px]">{biz.email}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">no email</span>
                          )}
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          {biz.phone ? (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[140px]">{biz.phone}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </td>
                        <td className="p-3 hidden xl:table-cell">
                          <Badge variant="outline" className="text-[10px]">
                            {getSourceLabel(biz.source)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setDetailBusiness(biz)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages.toLocaleString()} ({total.toLocaleString()} results)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Categorize Dialog */}
      <Dialog open={showBulkAction} onOpenChange={setShowBulkAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorize {selectedIds.size} Businesses</DialogTitle>
            <DialogDescription>
              Set the category for all selected businesses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            {CATEGORIES.filter(c => c.value !== 'uncategorized').map(cat => (
              <button
                key={cat.value}
                onClick={() => setBulkCategory(cat.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  bulkCategory === cat.value
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:bg-muted'
                }`}
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cat.color}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkAction(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkCategorize} disabled={!bulkCategory || isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Apply to {selectedIds.size} businesses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailBusiness} onOpenChange={() => setDetailBusiness(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {detailBusiness?.company_name}
            </DialogTitle>
          </DialogHeader>
          {detailBusiness && (
            <div className="space-y-4">
              {/* Category + Source */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(detailBusiness.category).color}`}>
                  {getCategoryBadge(detailBusiness.category).label}
                </span>
                <Badge variant="outline" className="text-xs">
                  {getSourceLabel(detailBusiness.source)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {detailBusiness.invite_status || 'pending'}
                </Badge>
              </div>

              {/* Description */}
              {detailBusiness.description && (
                <p className="text-sm text-muted-foreground">{detailBusiness.description}</p>
              )}

              {/* Contact info grid */}
              <div className="space-y-2 text-sm">
                {detailBusiness.contact_name && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">{detailBusiness.contact_name}</span>
                      {detailBusiness.contact_title && (
                        <span className="text-muted-foreground ml-1">· {detailBusiness.contact_title}</span>
                      )}
                    </div>
                  </div>
                )}
                {detailBusiness.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${detailBusiness.email}`} className="text-primary hover:underline">
                      {detailBusiness.email}
                    </a>
                  </div>
                )}
                {detailBusiness.contact_email && detailBusiness.contact_email !== detailBusiness.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${detailBusiness.contact_email}`} className="text-primary hover:underline">
                      {detailBusiness.contact_email}
                      <span className="text-muted-foreground text-xs ml-1">(contact)</span>
                    </a>
                  </div>
                )}
                {detailBusiness.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${detailBusiness.phone}`} className="hover:underline">
                      {detailBusiness.phone}
                    </a>
                  </div>
                )}
                {(detailBusiness.address || detailBusiness.city || detailBusiness.state) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      {detailBusiness.address && <div>{detailBusiness.address}</div>}
                      <div>
                        {[detailBusiness.city, detailBusiness.state].filter(Boolean).join(', ')}
                        {detailBusiness.zip && ` ${detailBusiness.zip}`}
                      </div>
                    </div>
                  </div>
                )}
                {detailBusiness.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={detailBusiness.website.startsWith('http') ? detailBusiness.website : `https://${detailBusiness.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      {detailBusiness.website.replace(/^https?:\/\/(www\.)?/, '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Brands / Equipment / Tags */}
              <DetailBadgeList label="Brands" items={detailBusiness.brands} variant="secondary" />
              <DetailBadgeList label="Equipment Types" items={detailBusiness.equipment_types} variant="outline" />
              <DetailBadgeList label="Tags" items={detailBusiness.tags} variant="outline" size="xs" />

              {/* Deal data (for deals tab) */}
              <DealDetails business={detailBusiness} />

              {/* Extra contacts from raw_data */}
              <ExtraContacts rawData={detailBusiness.raw_data} />

              {/* Quick categorize */}
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">Change Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter(c => c.value !== 'uncategorized').map(cat => (
                    <button
                      key={cat.value}
                      onClick={async () => {
                        await csrfFetch('/api/admin/directory', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ids: [detailBusiness.id], category: cat.value }),
                        });
                        setDetailBusiness({ ...detailBusiness, category: cat.value });
                        fetchData();
                      }}
                      className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                        detailBusiness.category === cat.value
                          ? 'ring-2 ring-primary ring-offset-1'
                          : ''
                      } ${cat.color}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

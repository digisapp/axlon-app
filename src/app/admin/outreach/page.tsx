'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Megaphone,
  Search,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  Filter,
  X,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

// ─── Types ───────────────────────────────────────────────────

interface OutreachContact {
  id: string;
  name: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  fax: string | null;
  toll_free: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  source: string;
  source_id: string | null;
  service_codes: string[] | null;
  personnel: { name: string; title: string; email: string }[];
  status: string;
  notes: string | null;
  last_contacted_at: string | null;
  member_since: string | null;
  created_at: string;
}

interface OutreachStats {
  total: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'interested', label: 'Interested', color: 'bg-green-100 text-green-700' },
  { value: 'not_interested', label: 'Not Interested', color: 'bg-gray-100 text-gray-700' },
  { value: 'signed_up', label: 'Signed Up', color: 'bg-purple-100 text-purple-700' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-700' },
];

const SOURCE_LABELS: Record<string, string> = {
  scra: 'SC&RA',
  conexpo: 'CONEXPO',
  ntda: 'NTDA',
  manual: 'Manual',
};

// ─── Page ────────────────────────────────────────────────────

export default function OutreachPage() {
  const [contacts, setContacts] = useState<OutreachContact[]>([]);
  const [stats, setStats] = useState<OutreachStats | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Expanded rows
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchContacts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (sourceFilter) params.set('source', sourceFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (stateFilter) params.set('state', stateFilter);
      params.set('limit', String(LIMIT));
      params.set('offset', String(page * LIMIT));

      const res = await csrfFetch(`/api/admin/outreach?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
        setTotal(data.total || 0);
        setStats(data.stats || null);
      }
    } catch (error) {
      logger.error('Error fetching outreach contacts', { error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, sourceFilter, statusFilter, stateFilter, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
    setSelected(new Set());
    setSelectAll(false);
  };

  const debouncedSearch = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => handleSearch(value), 300);
  };

  // Clear any pending debounce on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await csrfFetch(`/api/admin/outreach/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          last_contacted_at: newStatus === 'contacted' ? new Date().toISOString() : undefined,
        }),
      });
      if (res.ok) {
        setContacts(prev =>
          prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      logger.error('Error updating status', { error });
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    const confirmed = window.confirm(`Delete ${selected.size} contact(s)?`);
    if (!confirmed) return;

    try {
      const res = await csrfFetch('/api/admin/outreach', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selected] }),
      });
      if (res.ok) {
        setSelected(new Set());
        setSelectAll(false);
        fetchContacts(true);
      }
    } catch (error) {
      logger.error('Error deleting contacts', { error });
    }
  };

  const handleDeleteOne = async (id: string) => {
    const confirmed = window.confirm('Delete this contact?');
    if (!confirmed) return;

    try {
      const res = await csrfFetch(`/api/admin/outreach/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchContacts(true);
      }
    } catch (error) {
      logger.error('Error deleting contact', { error });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      setSelected(new Set(contacts.map(c => c.id)));
      setSelectAll(true);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setSourceFilter('');
    setStatusFilter('');
    setStateFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || sourceFilter || statusFilter || stateFilter;

  const totalPages = Math.ceil(total / LIMIT);

  // Full skeleton only before the first load — remounting the page on every
  // refetch would blow away the search input's focus while typing
  if (loading && !stats) return <OutreachSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Megaphone className="w-8 h-8" />
            Outreach
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats?.total || 0} prospective companies from industry directories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchContacts(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selected.size})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Companies</div>
              <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            </CardContent>
          </Card>
          {Object.entries(stats.bySource).map(([src, count]) => (
            <Card
              key={src}
              className={`cursor-pointer transition-colors ${sourceFilter === src ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
              onClick={() => {
                setSourceFilter(sourceFilter === src ? '' : src);
                setPage(0);
              }}
            >
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  {SOURCE_LABELS[src] || src}
                </div>
                <div className="text-2xl font-bold">{count.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => {
              setStatusFilter(statusFilter === opt.value ? '' : opt.value);
              setPage(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === opt.value
                ? `${opt.color} ring-2 ring-offset-1 ring-current`
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {opt.label}
            {stats?.byStatus[opt.value] ? ` (${stats.byStatus[opt.value]})` : ''}
          </button>
        ))}
      </div>

      {/* Search + Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, city, state, phone..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setPage(0); }}
            className="h-10 px-3 rounded-md border border-input bg-background text-base md:text-sm"
          >
            <option value="">All States</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Count + Select All */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="rounded border-gray-300"
            />
            Select all on page
          </label>
          <span>
            Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center text-xs">
            Page {page + 1} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Contact List */}
      <div className="border rounded-lg divide-y">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No contacts found</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          contacts.map(contact => (
            <ContactRow
              key={contact.id}
              contact={contact}
              selected={selected.has(contact.id)}
              expanded={expandedId === contact.id}
              onToggleSelect={() => toggleSelect(contact.id)}
              onToggleExpand={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              onStatusChange={(status) => handleStatusUpdate(contact.id, status)}
              onDelete={() => handleDeleteOne(contact.id)}
            />
          ))
        )}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Contact Row ─────────────────────────────────────────────

function ContactRow({
  contact,
  selected,
  expanded,
  onToggleSelect,
  onToggleExpand,
  onStatusChange,
  onDelete,
}: {
  contact: OutreachContact;
  selected: boolean;
  expanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}) {
  const statusInfo = STATUS_OPTIONS.find(s => s.value === contact.status);

  return (
    <div className={`${selected ? 'bg-primary/5' : ''}`}>
      {/* Main Row */}
      <div className="flex items-center gap-3 p-3 hover:bg-muted/30 cursor-pointer" onClick={onToggleExpand}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => { e.stopPropagation(); onToggleSelect(); }}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-gray-300 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{contact.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
              {SOURCE_LABELS[contact.source] || contact.source}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            {contact.city && contact.state && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {contact.city}, {contact.state}
              </span>
            )}
            {!contact.city && contact.address && (
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="w-3 h-3" />
                {contact.address}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contact.phone}
              </span>
            )}
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {contact.email}
              </span>
            )}
          </div>
        </div>

        {/* Status Dropdown */}
        <select
          value={contact.status}
          onChange={(e) => { e.stopPropagation(); onStatusChange(e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${statusInfo?.color || 'bg-muted'}`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-10 pb-4 space-y-4 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Company Info</h4>
              <div className="text-sm space-y-1">
                {contact.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span>{contact.address}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a>
                  </div>
                )}
                {contact.toll_free && contact.toll_free !== contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{contact.toll_free} (toll-free)</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {contact.member_since && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span>Member since {contact.member_since}</span>
                  </div>
                )}
              </div>
              {contact.service_codes && contact.service_codes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {contact.service_codes.map((code, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Personnel */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-1">
                <Users className="w-4 h-4" />
                Key Contacts
              </h4>
              {contact.personnel && contact.personnel.length > 0 ? (
                <div className="space-y-2">
                  {contact.personnel
                    .filter((p) => p.name && p.name !== 'Member Get')
                    .map((person, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium">{person.name}</div>
                        {person.title && (
                          <div className="text-xs text-muted-foreground">{person.title}</div>
                        )}
                        {person.email && (
                          <a href={`mailto:${person.email}`} className="text-xs text-primary hover:underline">
                            {person.email}
                          </a>
                        )}
                      </div>
                    ))}
                  {contact.personnel.filter(p => p.name && p.name !== 'Member Get').length === 0 && (
                    <p className="text-xs text-muted-foreground">No contacts listed</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No contacts listed</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────

function OutreachSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="border rounded-lg divide-y">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="p-3 flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── US States ───────────────────────────────────────────────

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

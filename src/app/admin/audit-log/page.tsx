'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Shield, Search, X } from 'lucide-react';
import { logger } from '@/lib/logger';

interface AuditEntry {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  created_at: string;
  admin: {
    id: string;
    email: string;
    company_name: string | null;
  } | null;
}

const ACTION_COLORS: Record<string, string> = {
  approve_dealer:      'bg-green-100 text-green-700',
  reject_dealer:       'bg-red-100 text-red-700',
  suspend_user:        'bg-orange-100 text-orange-700',
  unsuspend_user:      'bg-blue-100 text-blue-700',
  make_admin:          'bg-purple-100 text-purple-700',
  remove_admin:        'bg-gray-100 text-gray-700',
  restore_listing:     'bg-teal-100 text-teal-700',
  hard_delete_listing: 'bg-red-100 text-red-700',
  create_manufacturer: 'bg-green-100 text-green-700',
  update_manufacturer: 'bg-yellow-100 text-yellow-700',
  delete_manufacturer: 'bg-red-100 text-red-700',
};

function actionLabel(action: string) {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function DetailsSummary({ details }: { details: Record<string, unknown> }) {
  const entries = Object.entries(details).filter(([, v]) => v !== null && v !== '');
  if (entries.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
      {entries.map(([k, v]) => (
        <span key={k} className="text-xs text-muted-foreground">
          <span className="font-medium">{k.replace(/_/g, ' ')}:</span>{' '}
          {typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v)}
        </span>
      ))}
    </div>
  );
}

const ALL_ACTIONS = [
  'approve_dealer', 'reject_dealer',
  'suspend_user', 'unsuspend_user', 'make_admin', 'remove_admin',
  'restore_listing', 'hard_delete_listing',
  'create_manufacturer', 'update_manufacturer', 'delete_manufacturer',
];
const ALL_TARGETS = ['user', 'listing', 'manufacturer'];
const PAGE_SIZE = 50;

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchLog = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (actionFilter) params.set('action', actionFilter);
      if (targetFilter) params.set('target_type', targetFilter);

      const res = await fetch(`/api/admin/audit-log?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // Client-side text search across admin email + details
      let rows: AuditEntry[] = data.data || [];
      if (search) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (e) =>
            e.admin?.email?.toLowerCase().includes(q) ||
            e.action.includes(q) ||
            JSON.stringify(e.details).toLowerCase().includes(q) ||
            e.target_id.includes(q)
        );
      }

      setEntries(rows);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      logger.error('Audit log fetch error', { error: err });
    } finally {
      setIsLoading(false);
    }
  }, [page, actionFilter, targetFilter, search]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [actionFilter, targetFilter, search]);

  const clearFilters = () => {
    setActionFilter('');
    setTargetFilter('');
    setSearch('');
    setSearchInput('');
  };
  const hasFilters = actionFilter || targetFilter || search;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Audit Log
        </h1>
        <p className="text-sm text-muted-foreground">
          All admin actions — {total.toLocaleString()} entries
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-8 w-64"
            placeholder="Search admin, details, ID…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSearch(searchInput);
            }}
          />
        </div>

        <Select value={actionFilter || 'all'} onValueChange={(v) => setActionFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ALL_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>{actionLabel(a)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={targetFilter || 'all'} onValueChange={(v) => setTargetFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All targets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All targets</SelectItem>
            {ALL_TARGETS.map((t) => (
              <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Log entries */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">Loading…</div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">No entries found</div>
          ) : (
            <div className="divide-y">
              {entries.map((entry) => (
                <div key={entry.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`text-xs font-medium ${ACTION_COLORS[entry.action] ?? 'bg-muted text-muted-foreground'} hover:${ACTION_COLORS[entry.action] ?? ''}`}
                        >
                          {actionLabel(entry.action)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          on{' '}
                          <span className="font-medium text-foreground capitalize">{entry.target_type}</span>
                        </span>
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                          {entry.target_id}
                        </span>
                      </div>
                      <DetailsSummary details={entry.details} />
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium">
                        {entry.admin?.company_name || entry.admin?.email || 'Unknown admin'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} — {total.toLocaleString()} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

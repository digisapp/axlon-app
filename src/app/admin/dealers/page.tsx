'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Eye,
  FileText,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { TONE } from '@/components/admin/tones';

const STATUS_CARDS = [
  { key: 'pending', label: 'Pending', icon: Clock, tone: TONE.yellow },
  { key: 'approved', label: 'Approved', icon: CheckCircle, tone: TONE.green },
  { key: 'rejected', label: 'Rejected', icon: XCircle, tone: TONE.red },
] as const;

interface Dealer {
  id: string;
  email: string;
  company_name: string | null;
  slug: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  is_business: boolean;
  business_status: string;
  business_applied_at: string | null;
  business_reviewed_at: string | null;
  business_rejection_reason: string | null;
  business_license: string | null;
  tax_id: string | null;
  created_at: string;
  avatar_url: string | null;
}

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDealers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await csrfFetch(`/api/admin/dealers?status=${statusFilter}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setDealers(data.data || []);
        setCounts(data.counts || { pending: 0, approved: 0, rejected: 0 });
      } else {
        toast.error('Could not load businesses');
      }
    } catch (error) {
      logger.error('Error fetching dealers', { error });
      toast.error('Could not load businesses');
    }
    setIsLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchDealers flips isLoading synchronously before awaiting; standard fetch-on-change pattern
    fetchDealers();
  }, [fetchDealers]);

  const handleAction = async () => {
    if (!selectedDealer || !actionType) return;

    setIsSubmitting(true);
    try {
      const response = await csrfFetch(`/api/admin/dealers/${selectedDealer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          rejection_reason: actionType === 'reject' ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        toast.success(
          `${selectedDealer.company_name || selectedDealer.email} ${actionType === 'approve' ? 'approved' : 'rejected'}`
        );
        setSelectedDealer(null);
        setActionType(null);
        setRejectionReason('');
        fetchDealers();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to update dealer');
      }
    } catch (error) {
      logger.error('Error updating dealer', { error });
      toast.error('Failed to update dealer');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Verification</h1>
        <p className="text-sm text-muted-foreground">Review and approve business applications</p>
      </div>

      {/* Stats Cards — double as the status filter */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4" role="group" aria-label="Filter by status">
        {STATUS_CARDS.map(({ key, label, icon: Icon, tone }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            aria-pressed={statusFilter === key}
            className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card
              className={`h-full transition-colors hover:bg-muted/50 ${
                statusFilter === key ? 'border-primary ring-1 ring-primary' : ''
              }`}
            >
              <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className={`hidden sm:block p-2 rounded-lg ${tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts[key]}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

        {/* Dealers List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === 'pending' && 'Pending Applications'}
              {statusFilter === 'approved' && 'Approved Businesses'}
              {statusFilter === 'rejected' && 'Rejected Applications'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : dealers.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No {statusFilter} applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarImage src={dealer.avatar_url || undefined} />
                        <AvatarFallback>
                          {(dealer.company_name || dealer.email)?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          {dealer.company_name || 'No Company Name'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 min-w-0 break-all">
                            <Mail className="w-3 h-3 shrink-0" />
                            {dealer.email}
                          </span>
                          {dealer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {dealer.phone}
                            </span>
                          )}
                          {(dealer.city || dealer.state) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {[dealer.city, dealer.state].filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                        {dealer.business_applied_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {new Date(dealer.business_applied_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      {dealer.business_license && (
                        <Badge variant="outline" className="gap-1">
                          <FileText className="w-3 h-3" />
                          License
                        </Badge>
                      )}

                      {statusFilter === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
                            onClick={() => {
                              setSelectedDealer(dealer);
                              setActionType('approve');
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                            onClick={() => {
                              setSelectedDealer(dealer);
                              setActionType('reject');
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {statusFilter === 'rejected' && dealer.business_rejection_reason && (
                        <Badge
                          variant="destructive"
                          className="max-w-[200px] truncate"
                          title={dealer.business_rejection_reason}
                        >
                          {dealer.business_rejection_reason}
                        </Badge>
                      )}

                      {dealer.slug && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/${dealer.slug}`} target="_blank" aria-label="View storefront">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedDealer && !!actionType}
        onOpenChange={() => {
          setSelectedDealer(null);
          setActionType(null);
          setRejectionReason('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Business' : 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve ${selectedDealer?.company_name || selectedDealer?.email} as a business?`
                : `Please provide a reason for rejecting ${selectedDealer?.company_name || selectedDealer?.email}'s application.`}
            </DialogDescription>
          </DialogHeader>

          {actionType === 'reject' && (
            <div className="py-4">
              <Textarea
                aria-label="Reason for rejection"
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDealer(null);
                setActionType(null);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleAction}
              disabled={isSubmitting || (actionType === 'reject' && !rejectionReason.trim())}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

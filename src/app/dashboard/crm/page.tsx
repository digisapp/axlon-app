'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  MessageSquare,
  TrendingUp,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  UserPlus,
  DollarSign,
  Target,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Handshake,
  CalendarDays,
  Send,
} from 'lucide-react';

interface Contact {
  id: string;
  dealer_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: string;
  notes: string | null;
  deal_value: number;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  contact_id: string;
  dealer_id: string;
  type: string;
  description: string;
  created_at: string;
}

interface CrmData {
  contacts: Contact[];
  pipeline: Record<string, number>;
  pipelineValues: Record<string, number>;
  stats: {
    totalContacts: number;
    totalValue: number;
    wonValue: number;
    conversionRate: number;
  };
}

const PIPELINE_STAGES = [
  { key: 'new', label: 'New Leads', color: 'bg-blue-500', icon: UserPlus },
  { key: 'contacted', label: 'Contacted', color: 'bg-yellow-500', icon: Phone },
  { key: 'qualified', label: 'Qualified', color: 'bg-purple-500', icon: Target },
  { key: 'proposal', label: 'Proposal', color: 'bg-orange-500', icon: DollarSign },
  { key: 'won', label: 'Won', color: 'bg-green-500', icon: CheckCircle2 },
  { key: 'lost', label: 'Lost', color: 'bg-red-500', icon: XCircle },
];

const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'ai_chat', label: 'AI Chat' },
  { value: 'website', label: 'Website' },
  { value: 'storefront', label: 'Storefront' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'referral', label: 'Referral' },
];

const ACTIVITY_TYPES = [
  { value: 'note', label: 'Note', icon: FileText },
  { value: 'call', label: 'Phone Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: CalendarDays },
  { value: 'deal_update', label: 'Deal Update', icon: DollarSign },
];

const STATUS_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'outline',
  contacted: 'secondary',
  qualified: 'secondary',
  proposal: 'default',
  won: 'default',
  lost: 'destructive',
};

export default function CRMPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [crmData, setCrmData] = useState<CrmData | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Expanded contact & activities
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Activity form
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityContactId, setActivityContactId] = useState<string | null>(null);
  const [activityType, setActivityType] = useState('note');
  const [activityDescription, setActivityDescription] = useState('');
  const [savingActivity, setSavingActivity] = useState(false);

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSource, setFormSource] = useState('manual');
  const [formDealValue, setFormDealValue] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchCrmData = useCallback(async (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (search) params.set('search', search);

    const res = await fetch(`/api/dashboard/crm?${params.toString()}`);
    if (!res.ok) return;

    const data = await res.json();
    setCrmData(data);
  }, []);

  const fetchActivities = useCallback(async (contactId: string) => {
    setLoadingActivities(true);
    const res = await fetch(`/api/dashboard/crm/activities?contact_id=${contactId}`);
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
    setLoadingActivities(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/dashboard/crm');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_dealer')
        .eq('id', user.id)
        .single();

      if (!profile?.is_dealer) {
        router.push('/get-started');
        return;
      }

      await fetchCrmData();
      setIsLoading(false);
    };

    init();
  }, [supabase, router, fetchCrmData]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      fetchCrmData(statusFilter, searchQuery);
    }, 300);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleToggleExpand = (contactId: string) => {
    if (expandedContactId === contactId) {
      setExpandedContactId(null);
      setActivities([]);
    } else {
      setExpandedContactId(contactId);
      fetchActivities(contactId);
    }
  };

  const handleAddContact = async () => {
    if (!formName.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/dashboard/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim() || undefined,
          phone: formPhone.trim() || undefined,
          company: formCompany.trim() || undefined,
          source: formSource,
          deal_value: formDealValue ? parseFloat(formDealValue) : 0,
          notes: formNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setAddDialogOpen(false);
        resetForm();
        await fetchCrmData(statusFilter, searchQuery);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogActivity = async () => {
    if (!activityContactId || !activityDescription.trim()) return;
    setSavingActivity(true);

    try {
      const res = await fetch('/api/dashboard/crm/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: activityContactId,
          type: activityType,
          description: activityDescription.trim(),
        }),
      });

      if (res.ok) {
        setActivityDialogOpen(false);
        setActivityDescription('');
        setActivityType('note');
        // Refresh activities and CRM data (last_contact_at updated)
        fetchActivities(activityContactId);
        fetchCrmData(statusFilter, searchQuery);
      }
    } finally {
      setSavingActivity(false);
    }
  };

  const handleUpdateStatus = async (contactId: string, newStatus: string) => {
    const res = await fetch(`/api/dashboard/crm/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      await fetchCrmData(statusFilter, searchQuery);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const res = await fetch(`/api/dashboard/crm/${contactId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      if (expandedContactId === contactId) setExpandedContactId(null);
      await fetchCrmData(statusFilter, searchQuery);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCompany('');
    setFormSource('manual');
    setFormDealValue('');
    setFormNotes('');
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const getActivityIcon = (type: string) => {
    const found = ACTIVITY_TYPES.find(a => a.value === type);
    if (!found) return <FileText className="w-3 h-3" />;
    const Icon = found.icon;
    return <Icon className="w-3 h-3" />;
  };

  const pipeline = crmData?.pipeline || {};
  const pipelineValues = crmData?.pipelineValues || {};
  const stats = crmData?.stats || { totalContacts: 0, totalValue: 0, wonValue: 0, conversionRate: 0 };
  const contacts = crmData?.contacts || [];

  const activePipelineValue = (pipelineValues['new'] || 0) + (pipelineValues['contacted'] || 0) +
    (pipelineValues['qualified'] || 0) + (pipelineValues['proposal'] || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI CRM</h1>
          <p className="text-muted-foreground">
            Manage contacts, track deals, and grow your pipeline with AI
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a contact to your CRM pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={formSource} onValueChange={setFormSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal_value">Deal Value ($)</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    min="0"
                    value={formDealValue}
                    onChange={(e) => setFormDealValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Any notes about this contact..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} disabled={!formName.trim() || isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Pipeline</p>
                <p className="text-2xl font-bold">{formatCurrency(activePipelineValue)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Won Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.wonValue)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales Pipeline</CardTitle>
          <CardDescription>
            Total pipeline value: ${stats.totalValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {PIPELINE_STAGES.map((stage) => {
              const count = pipeline[stage.key] || 0;
              const value = pipelineValues[stage.key] || 0;
              return (
                <button
                  key={stage.key}
                  onClick={() => setStatusFilter(statusFilter === stage.key ? 'all' : stage.key)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    statusFilter === stage.key
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center mx-auto mb-2`}>
                    <stage.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(value)}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter !== 'all' ? 'border-primary' : ''}
              >
                <Filter className="w-4 h-4 mr-1" />
                {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="rounded-lg border overflow-hidden">
                {/* Contact Row */}
                <div
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleToggleExpand(contact.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{contact.name}</h3>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={contact.status}
                          onValueChange={(val) => handleUpdateStatus(contact.id, val)}
                        >
                          <SelectTrigger className="h-6 w-auto border-0 p-0 focus:ring-0">
                            <Badge variant={STATUS_BADGE_VARIANT[contact.status] || 'outline'}>
                              {contact.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {PIPELINE_STAGES.map((s) => (
                              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {contact.source === 'ai_chat' && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-50 text-purple-600 border-purple-200">
                          AI
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {contact.company}
                        </span>
                      )}
                      {contact.email && (
                        <span className="hidden sm:flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deal Value & Actions */}
                  <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                    {contact.deal_value > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-semibold">${Number(contact.deal_value).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">deal value</p>
                      </div>
                    )}
                    <div className="text-right">
                      {contact.last_contact_at && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(contact.last_contact_at).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{contact.source}</p>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {contact.phone && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={`tel:${contact.phone}`}>
                            <Phone className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {contact.email && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={`mailto:${contact.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {expandedContactId === contact.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </div>

                {/* Expanded: Activity Log + Actions */}
                {expandedContactId === contact.id && (
                  <div className="border-t bg-muted/20 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold">Activity Log</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivityContactId(contact.id);
                            setActivityDialogOpen(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Log Activity
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/deal-desk?buyer_name=${encodeURIComponent(contact.name)}&buyer_email=${encodeURIComponent(contact.email || '')}&buyer_phone=${encodeURIComponent(contact.phone || '')}&buyer_company=${encodeURIComponent(contact.company || '')}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Handshake className="w-3 h-3 mr-1" />
                            Create Deal
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    {contact.notes && (
                      <div className="mb-3 p-2 rounded bg-muted/50 text-sm text-muted-foreground">
                        {contact.notes}
                      </div>
                    )}

                    {/* Activity Timeline */}
                    {loadingActivities ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : activities.length > 0 ? (
                      <div className="space-y-2">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p>{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {ACTIVITY_TYPES.find(a => a.value === activity.type)?.label || activity.type}
                                {' \u00b7 '}
                                {new Date(activity.created_at).toLocaleDateString()}{' '}
                                {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-3">
                        No activities logged yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {contacts.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No contacts found</p>
                <p className="text-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Add your first contact to get started'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Follow Up Needed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Contacts in &quot;new&quot; status haven&apos;t been reached out to. Responding quickly increases conversion by 400%.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-blue-600"
                onClick={() => setStatusFilter('new')}
              >
                View new leads <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Pipeline Health</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalContacts > 0
                  ? `${stats.conversionRate}% win rate with ${formatCurrency(stats.totalValue)} in total pipeline value.`
                  : 'Start adding contacts to build your sales pipeline.'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">AI Integration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Contacts from AI chats and your storefront automatically appear here with lead details captured.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
            <DialogDescription>
              Record an interaction with this contact.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((at) => (
                    <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description *</Label>
              <Input
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                placeholder="What happened?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogActivity} disabled={!activityDescription.trim() || savingActivity}>
              {savingActivity && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Send className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

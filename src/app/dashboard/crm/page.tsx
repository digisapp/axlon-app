'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  TrendingUp,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  MoreHorizontal,
  UserPlus,
  DollarSign,
  Target,
  Loader2,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  source: string;
  last_contact: string;
  notes: string;
  deal_value: number;
  created_at: string;
}

const PIPELINE_STAGES = [
  { key: 'new', label: 'New Leads', color: 'bg-blue-500', icon: UserPlus },
  { key: 'contacted', label: 'Contacted', color: 'bg-yellow-500', icon: Phone },
  { key: 'qualified', label: 'Qualified', color: 'bg-purple-500', icon: Target },
  { key: 'proposal', label: 'Proposal', color: 'bg-orange-500', icon: DollarSign },
  { key: 'won', label: 'Won', color: 'bg-green-500', icon: CheckCircle2 },
  { key: 'lost', label: 'Lost', color: 'bg-red-500', icon: XCircle },
];

// Mock data for initial CRM display
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'John Martinez',
    email: 'john@acmecrane.com',
    phone: '(555) 123-4567',
    company: 'Acme Crane Services',
    status: 'prospect',
    source: 'AI Chat',
    last_contact: '2026-03-02',
    notes: 'Interested in 200-ton crawler crane listing',
    deal_value: 185000,
    created_at: '2026-02-15',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@heavyhaulpro.com',
    phone: '(555) 234-5678',
    company: 'Heavy Haul Pro Transport',
    status: 'lead',
    source: 'Website Inquiry',
    last_contact: '2026-03-04',
    notes: 'Looking for 3-axle lowboy trailer',
    deal_value: 65000,
    created_at: '2026-03-01',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@riggingplus.com',
    phone: '(555) 345-6789',
    company: 'Rigging Plus LLC',
    status: 'customer',
    source: 'Storefront',
    last_contact: '2026-02-28',
    notes: 'Repeat customer — bought 2 trailers last year',
    deal_value: 320000,
    created_at: '2025-11-10',
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@westcoastlifting.com',
    phone: '(555) 456-7890',
    company: 'West Coast Lifting',
    status: 'prospect',
    source: 'SC&RA Outreach',
    last_contact: '2026-03-03',
    notes: 'Interested in AI storefront features',
    deal_value: 0,
    created_at: '2026-03-03',
  },
  {
    id: '5',
    name: 'Dave Thompson',
    email: 'dave@nationalrigging.com',
    phone: '(555) 567-8901',
    company: 'National Rigging & Transport',
    status: 'lead',
    source: 'AI Chat',
    last_contact: '2026-03-04',
    notes: 'Needs multiple flatbed trailers for Q2',
    deal_value: 150000,
    created_at: '2026-03-04',
  },
];

const MOCK_PIPELINE = {
  new: 12,
  contacted: 8,
  qualified: 5,
  proposal: 3,
  won: 15,
  lost: 4,
};

const MOCK_PIPELINE_VALUES = {
  new: 245000,
  contacted: 180000,
  qualified: 420000,
  proposal: 310000,
  won: 1250000,
  lost: 95000,
};

export default function CRMPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);

  useEffect(() => {
    const checkAuth = async () => {
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

      setIsLoading(false);
    };

    checkAuth();
  }, [supabase, router]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const totalPipelineValue = Object.values(MOCK_PIPELINE_VALUES).reduce((a, b) => a + b, 0);
  const activePipelineValue = MOCK_PIPELINE_VALUES.new + MOCK_PIPELINE_VALUES.contacted +
    MOCK_PIPELINE_VALUES.qualified + MOCK_PIPELINE_VALUES.proposal;

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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{Object.values(MOCK_PIPELINE).reduce((a, b) => a + b, 0)}</p>
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
                <p className="text-2xl font-bold">${(activePipelineValue / 1000).toFixed(0)}K</p>
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
                <p className="text-sm text-muted-foreground">Won This Month</p>
                <p className="text-2xl font-bold">${(MOCK_PIPELINE_VALUES.won / 1000).toFixed(0)}K</p>
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
                <p className="text-2xl font-bold">
                  {Math.round((MOCK_PIPELINE.won / (MOCK_PIPELINE.won + MOCK_PIPELINE.lost)) * 100)}%
                </p>
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
            Total pipeline value: ${totalPipelineValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {PIPELINE_STAGES.map((stage) => {
              const count = MOCK_PIPELINE[stage.key as keyof typeof MOCK_PIPELINE];
              const value = MOCK_PIPELINE_VALUES[stage.key as keyof typeof MOCK_PIPELINE_VALUES];
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
                  <p className="text-xs text-muted-foreground">${(value / 1000).toFixed(0)}K</p>
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
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{contact.name}</h3>
                    <Badge variant={
                      contact.status === 'customer' ? 'default' :
                      contact.status === 'prospect' ? 'secondary' :
                      contact.status === 'churned' ? 'destructive' : 'outline'
                    }>
                      {contact.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {contact.company}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </span>
                  </div>
                  {contact.notes && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">{contact.notes}</p>
                  )}
                </div>

                {/* Deal Value & Actions */}
                <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                  {contact.deal_value > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">${contact.deal_value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">deal value</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(contact.last_contact).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{contact.source}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredContacts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No contacts found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
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
                3 leads haven&apos;t been contacted in 5+ days. Responding quickly increases conversion by 400%.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                View leads <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Hot Lead</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dave Thompson from National Rigging has viewed your listings 8 times this week. High buying intent.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-green-600">
                View contact <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">AI Chat Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI assistant handled 23 conversations this week and captured 5 new leads automatically.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-purple-600">
                View chats <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

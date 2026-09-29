'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sparkles,
  Loader2,
  Users,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  X,
  ExternalLink,
  Bot,
  TrendingUp,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { csrfFetch } from '@/lib/csrf-fetch';
import { toast } from 'sonner';

interface Lead {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  equipment_interest: string | null;
  budget_range: string | null;
  timeline: string | null;
  lead_score: number;
  ai_summary: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes: string | null;
  created_at: string;
  contacted_at: string | null;
  conversation?: {
    id: string;
    created_at: string;
    listing?: { id: string; title: string } | null;
  } | null;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
}

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500', icon: Star },
  contacted: { label: 'Contacted', color: 'bg-yellow-500', icon: Phone },
  qualified: { label: 'Qualified', color: 'bg-purple-500', icon: CheckCircle },
  converted: { label: 'Converted', color: 'bg-green-500', icon: TrendingUp },
  lost: { label: 'Lost', color: 'bg-gray-500', icon: X },
};

const defaultStatusConfig = { label: 'Unknown', color: 'bg-gray-500', icon: Clock };

const getStatusConfig = (status: string) =>
  statusConfig[status as keyof typeof statusConfig] ?? defaultStatusConfig;

export default function AILeadsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, contacted: 0, qualified: 0, converted: 0 });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [activeTab]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.set('status', activeTab);
      }

      const response = await csrfFetch(`/api/dealer/ai-leads?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setStats(data.stats || { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0 });
      }
    } catch (error) {
      logger.error('Fetch leads error', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    setIsSaving(true);
    try {
      const response = await csrfFetch('/api/dealer/ai-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status }),
      });

      if (response.ok) {
        setLeads(prev =>
          prev.map(l =>
            l.id === leadId
              ? { ...l, status: status as Lead['status'], contacted_at: status === 'contacted' ? new Date().toISOString() : l.contacted_at }
              : l
          )
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: status as Lead['status'] } : null);
        }
        // Refresh stats
        fetchLeads();
      } else {
        toast.error('Failed to update lead status. Please try again.');
      }
    } catch (error) {
      logger.error('Update status error', { error });
      toast.error('Failed to update lead status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateLeadNotes = async (leadId: string, notes: string) => {
    try {
      const response = await csrfFetch('/api/dealer/ai-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, notes }),
      });

      if (response.ok) {
        setLeads(prev =>
          prev.map(l => (l.id === leadId ? { ...l, notes } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, notes } : null);
        }
        toast.success('Notes saved');
      } else {
        toast.error('Failed to save notes. Please try again.');
      }
    } catch (error) {
      logger.error('Update notes error', { error });
      toast.error('Failed to save notes. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    if (score >= 40) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        icon={<Sparkles />}
        title="AI Leads"
        description="Buyers your AI assistant qualified in storefront chats"
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/ai-assistant">Configure AI</Link>
          </Button>
        }
      />

      <div>
        {/* Stats Cards */}
        {/* Filter cards: 3-up on phones (5-up crushed each card to ~60px) */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
          <Card className={activeTab === 'all' ? 'border-primary' : ''}>
            <CardContent className="p-3 md:p-6 cursor-pointer" onClick={() => setActiveTab('all')}>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={activeTab === 'new' ? 'border-blue-500' : ''}>
            <CardContent className="p-3 md:p-6 cursor-pointer" onClick={() => setActiveTab('new')}>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-blue-500/10 rounded-lg">
                  <Star className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.new}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">New</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={activeTab === 'contacted' ? 'border-yellow-500' : ''}>
            <CardContent className="p-3 md:p-6 cursor-pointer" onClick={() => setActiveTab('contacted')}>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-yellow-500/10 rounded-lg">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.contacted}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Contacted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={activeTab === 'qualified' ? 'border-purple-500' : ''}>
            <CardContent className="p-3 md:p-6 cursor-pointer" onClick={() => setActiveTab('qualified')}>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-purple-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.qualified}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Qualified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={activeTab === 'converted' ? 'border-green-500' : ''}>
            <CardContent className="p-3 md:p-6 cursor-pointer" onClick={() => setActiveTab('converted')}>
              <div className="flex items-center gap-3">
                <div className="hidden lg:block p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.converted}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Converted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              Click on a lead to view details and update status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your AI assistant will capture leads from customer conversations
                </p>
                <Button asChild>
                  <Link href="/dashboard/ai-assistant">Configure AI Assistant</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {leads.map((lead) => {
                  const StatusIcon = getStatusConfig(lead.status).icon;
                  return (
                    <div
                      key={lead.id}
                      className="py-4 px-2 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className={`shrink-0 p-2 rounded-full ${getStatusConfig(lead.status).color}/10`}>
                            <StatusIcon className={`w-4 h-4 ${getStatusConfig(lead.status).color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {lead.visitor_name || lead.visitor_email || 'Anonymous'}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground break-all">
                              {lead.visitor_email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.visitor_email}
                                </span>
                              )}
                              {lead.visitor_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.visitor_phone}
                                </span>
                              )}
                            </div>
                            {lead.equipment_interest && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Interested in: {lead.equipment_interest}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 pl-12 sm:pl-0 shrink-0">
                          <Badge variant="secondary" className={getScoreColor(lead.lead_score)}>
                            {lead.lead_score}% match
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {lead.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(lead.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center justify-between gap-2 pr-6">
                  <span>{selectedLead.visitor_name || 'Lead Details'}</span>
                  <Badge className={`${getStatusConfig(selectedLead.status).color} text-white`}>
                    {getStatusConfig(selectedLead.status).label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Captured {new Date(selectedLead.created_at).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLead.visitor_email && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a href={`mailto:${selectedLead.visitor_email}`} className="font-medium text-primary hover:underline flex items-center gap-2 break-all">
                        <Mail className="w-4 h-4" />
                        {selectedLead.visitor_email}
                      </a>
                    </div>
                  )}
                  {selectedLead.visitor_phone && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <a href={`tel:${selectedLead.visitor_phone}`} className="font-medium text-primary hover:underline flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedLead.visitor_phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Interest */}
                {selectedLead.equipment_interest && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Equipment Interest</p>
                    <p className="font-medium">{selectedLead.equipment_interest}</p>
                  </div>
                )}

                {/* AI Summary */}
                {selectedLead.ai_summary && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      AI Conversation Summary
                    </p>
                    <p className="text-sm">{selectedLead.ai_summary}</p>
                  </div>
                )}

                {/* Related Listing */}
                {selectedLead.conversation?.listing && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Related Listing</p>
                    <Link
                      href={`/listing/${selectedLead.conversation.listing.id}`}
                      className="font-medium text-primary hover:underline flex items-center gap-2"
                      target="_blank"
                    >
                      {selectedLead.conversation.listing.title}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <Textarea
                    placeholder="Add notes about this lead..."
                    value={selectedLead.notes || ''}
                    onChange={(e) => {
                      setSelectedLead({ ...selectedLead, notes: e.target.value });
                    }}
                    onBlur={() => {
                      if (selectedLead.notes !== null) {
                        updateLeadNotes(selectedLead.id, selectedLead.notes);
                      }
                    }}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  {selectedLead.visitor_email && (
                    <Button asChild className="flex-1">
                      <a href={`mailto:${selectedLead.visitor_email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Lead
                      </a>
                    </Button>
                  )}
                  {selectedLead.visitor_phone && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={`tel:${selectedLead.visitor_phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Lead
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

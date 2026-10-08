'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Phone,
  Loader2,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Mic,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DealerVoiceAgent } from '@/types';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { TONE, formatEnum } from '@/components/admin/tones';

const VOICE_OPTIONS = [
  { value: 'Sal', label: 'Sal (Male)' },
  { value: 'Ash', label: 'Ash (Female)' },
  { value: 'Ballad', label: 'Ballad (Male)' },
  { value: 'Coral', label: 'Coral (Female)' },
  { value: 'Sage', label: 'Sage (Female)' },
  { value: 'Verse', label: 'Verse (Male)' },
];

const PLAN_TIERS = [
  { value: 'trial', label: 'Trial (30 min)', minutes: 30 },
  { value: 'starter', label: 'Starter (100 min)', minutes: 100 },
  { value: 'pro', label: 'Pro (500 min)', minutes: 500 },
  { value: 'unlimited', label: 'Unlimited', minutes: 99999 },
];

const PER_PAGE = 100;

interface DealerWithAgent extends DealerVoiceAgent {
  dealer?: {
    id: string;
    email: string;
    company_name: string | null;
    phone: string | null;
  };
  stats?: {
    total_calls: number;
    total_minutes: number;
  };
}

export default function AdminVoiceAgentsPage() {
  const [agents, setAgents] = useState<DealerWithAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DealerWithAgent | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<DealerWithAgent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit form state
  const [editForm, setEditForm] = useState({
    phone_number: '',
    agent_name: '',
    voice: 'Sal',
    greeting: '',
    business_name: '',
    business_description: '',
    instructions: '',
    plan_tier: 'starter',
    minutes_included: 100,
    is_active: false,
  });

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      // The API defaults to 20 per page — ask for a real page size and paginate,
      // otherwise only the first 20 agents are ever visible.
      let url = `/api/admin/dealer-voice-agents?status=${statusFilter}&page=${page}&per_page=${PER_PAGE}`;
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      const response = await csrfFetch(url);
      if (response.ok) {
        const data = await response.json();
        setAgents(data.data || []);
        setTotalPages(data.total_pages || 1);
        // data.total is the count for the current filter, so it is exact for the matching
        // card; the other card falls back to the rows on this page.
        const total = data.total || 0;
        const activeOnPage = (data.data || []).filter((a: DealerWithAgent) => a.is_active).length;
        setCounts({
          total,
          active: statusFilter === 'active' ? total : activeOnPage,
          inactive: statusFilter === 'inactive' ? total : total - activeOnPage,
        });
      } else {
        toast.error('Could not load voice agents');
      }
    } catch (error) {
      logger.error('Error fetching voice agents', { error });
      toast.error('Could not load voice agents');
    }
    setIsLoading(false);
  }, [statusFilter, debouncedSearch, page]);

  // Query only after typing pauses — per-keystroke fetches raced each other
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchAgents flips isLoading synchronously before awaiting; standard fetch-on-change pattern
    fetchAgents();
  }, [fetchAgents]);

  const openEditDialog = (agent: DealerWithAgent) => {
    setSelectedAgent(agent);
    setEditForm({
      phone_number: agent.phone_number || '',
      agent_name: agent.agent_name || 'AI Assistant',
      voice: agent.voice || 'Sal',
      greeting: agent.greeting || '',
      business_name: agent.business_name || '',
      business_description: agent.business_description || '',
      instructions: agent.instructions || '',
      plan_tier: agent.plan_tier || 'starter',
      minutes_included: agent.minutes_included || 100,
      is_active: agent.is_active || false,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedAgent) return;

    setIsSubmitting(true);
    try {
      const response = await csrfFetch(`/api/admin/dealer-voice-agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success('Voice agent saved');
        setIsEditing(false);
        setSelectedAgent(null);
        fetchAgents();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to save voice agent');
      }
    } catch (error) {
      logger.error('Error updating voice agent', { error });
      toast.error('Failed to save voice agent');
    }
    setIsSubmitting(false);
  };

  // Confirmed through the AlertDialog below (was a native confirm())
  const handleDelete = async (agent: DealerWithAgent) => {
    setDeleteTarget(null);
    try {
      const response = await csrfFetch(`/api/admin/dealer-voice-agents/${agent.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Voice agent deleted');
        fetchAgents();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to delete voice agent');
      }
    } catch (error) {
      logger.error('Error deleting voice agent', { error });
      toast.error('Failed to delete voice agent');
    }
  };

  const toggleActive = async (agent: DealerWithAgent) => {
    try {
      const response = await csrfFetch(`/api/admin/dealer-voice-agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !agent.is_active }),
      });

      if (response.ok) {
        toast.success(agent.is_active ? 'Voice agent turned off' : 'Voice agent turned on');
        fetchAgents();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to update voice agent');
      }
    } catch (error) {
      logger.error('Error toggling voice agent', { error });
      toast.error('Failed to update voice agent');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Voice Agents</h1>
        <p className="text-sm text-muted-foreground">Manage AI phone agents for businesses</p>
      </div>

      {/* Stats Cards — double as the status filter */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4" role="group" aria-label="Filter by status">
        {([
          { key: 'all', label: 'Total Agents', count: counts.total, icon: Phone, tone: TONE.blue },
          { key: 'active', label: 'Active', count: counts.active, icon: CheckCircle, tone: TONE.green },
          { key: 'inactive', label: 'Inactive', count: counts.inactive, icon: XCircle, tone: TONE.gray },
        ] as const).map(({ key, label, count, icon: Icon, tone }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setStatusFilter(key); setPage(1); }}
            aria-pressed={statusFilter === key}
            className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card
              className={`h-full transition-colors hover:bg-muted/50 ${
                statusFilter === key ? 'border-primary ring-1 ring-primary' : ''
              }`}
            >
              <CardContent className="p-3 sm:p-4 flex items-center gap-4">
                <div className={`hidden sm:block p-2 rounded-lg ${tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

        {/* Search */}
        <div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by business name or phone..."
              aria-label="Search voice agents"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Agents List */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Agents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No voice agents found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarFallback className={agent.is_active ? TONE.green : TONE.gray}>
                          <Phone className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="font-semibold flex flex-wrap items-center gap-2">
                          {agent.business_name || agent.dealer?.company_name || 'Unnamed Agent'}
                          <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                            {agent.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {agent.plan_tier && <Badge variant="outline">{formatEnum(agent.plan_tier)}</Badge>}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {agent.phone_number ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {agent.phone_number}
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">No phone assigned</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            {agent.voice}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {agent.plan_tier === 'unlimited'
                              ? `${agent.minutes_used || 0} min used`
                              : `${agent.minutes_used || 0}/${agent.minutes_included} min`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Account: {agent.dealer?.email || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      <Switch
                        checked={agent.is_active}
                        onCheckedChange={() => toggleActive(agent)}
                        disabled={!agent.phone_number}
                        aria-label={agent.is_active ? 'Turn agent off' : 'Turn agent on'}
                        title={agent.phone_number ? undefined : 'Assign a phone number before activating'}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(agent)}
                        aria-label="Edit agent"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        onClick={() => setDeleteTarget(agent)}
                        aria-label="Delete agent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} — {counts.total.toLocaleString()} agents
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Voice Agent</DialogTitle>
            <DialogDescription>
              Configure the AI voice agent settings for {selectedAgent?.business_name || selectedAgent?.dealer?.company_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number (DID)</Label>
                <Input
                  id="phone_number"
                  placeholder="+1-555-123-4567"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent_name">Agent Name</Label>
                <Input
                  id="agent_name"
                  placeholder="AI Assistant"
                  value={editForm.agent_name}
                  onChange={(e) => setEditForm({ ...editForm, agent_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select
                  value={editForm.voice}
                  onValueChange={(value) => setEditForm({ ...editForm, voice: value })}
                >
                  <SelectTrigger id="voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan_tier">Plan</Label>
                <Select
                  value={editForm.plan_tier}
                  onValueChange={(value) => {
                    const plan = PLAN_TIERS.find(p => p.value === value);
                    setEditForm({
                      ...editForm,
                      plan_tier: value,
                      minutes_included: plan?.minutes || 100,
                    });
                  }}
                >
                  <SelectTrigger id="plan_tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TIERS.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                placeholder="ABC Trucking"
                value={editForm.business_name}
                onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting Message</Label>
              <Textarea
                id="greeting"
                placeholder="Thanks for calling ABC Trucking! How can I help you today?"
                value={editForm.greeting}
                onChange={(e) => setEditForm({ ...editForm, greeting: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Textarea
                id="business_description"
                placeholder="We specialize in selling quality used trucks and trailers..."
                value={editForm.business_description}
                onChange={(e) => setEditForm({ ...editForm, business_description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Custom Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Additional instructions for the AI agent..."
                value={editForm.instructions}
                onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                disabled={!editForm.phone_number}
              />
              <Label htmlFor="is_active">
                Active {!editForm.phone_number && '(requires phone number)'}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this voice agent?</AlertDialogTitle>
            <AlertDialogDescription>
              The phone agent for{' '}
              <strong>{deleteTarget?.business_name || deleteTarget?.dealer?.company_name || 'this business'}</strong>{' '}
              will stop answering calls. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

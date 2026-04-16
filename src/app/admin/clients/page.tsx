'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Target,
  Plus,
  Bot,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  BarChart3,
  Loader2,
  X,
  Mail,
  Phone,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

const VERTICALS = [
  'Heavy Haul / Lowboy Carrier',
  'Equipment Dealer',
  'Crane & Rigging',
  'Regional Fleet Operator',
  'Equipment Rental',
  'Specialized Transport',
  'Other',
] as const;

const AI_SYSTEMS = [
  'AI Lead Response',
  'CRM Integration',
  'Document AI',
  'Dispatch Matching',
  'Quoting Engine',
  'Sales AI Assistant',
  'Marketplace Integration',
  'Analytics Dashboard',
  'Voice Agent',
];

const ACQUISITION_SOURCES = [
  { value: 'scra-outreach', label: 'SCRA Outreach' },
  { value: 'conexpo-outreach', label: 'CONEXPO Outreach' },
  { value: 'referral', label: 'Referral' },
  { value: 'inbound', label: 'Inbound (/apply)' },
  { value: 'cold-email', label: 'Cold Email' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

const PHASES = [
  { id: 1, label: 'Phase 1 — Foundation', months: 'Months 1–3', color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 2, label: 'Phase 2 — Core Automation', months: 'Months 4–7', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  { id: 3, label: 'Phase 3 — Optimization', months: 'Months 8–12', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
  { id: 4, label: 'Maintenance', months: 'Year 2+', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' },
];

const STATUS_COLORS: Record<string, string> = {
  prospect: 'bg-slate-100 text-slate-700',
  scoping: 'bg-yellow-100 text-yellow-700',
  active: 'bg-emerald-100 text-emerald-700',
  maintenance: 'bg-blue-100 text-blue-700',
  churned: 'bg-red-100 text-red-700',
};

type Client = {
  id: string;
  company_name: string;
  vertical: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_title: string | null;
  monthly_rate: number;
  contract_start: string;
  contract_end: string;
  scoping_fee: number;
  status: string;
  current_phase: number;
  ai_systems_live: string[];
  ai_systems_pending: string[];
  next_milestone: string | null;
  next_milestone_date: string | null;
  notes: string | null;
  acquisition_source: string | null;
  milestones: Array<{ id: string; title: string; status: string; due_date: string | null; phase: number }>;
};

type FormData = {
  company_name: string;
  vertical: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_title: string;
  monthly_rate: string;
  scoping_fee: string;
  contract_start: string;
  contract_end: string;
  status: string;
  current_phase: string;
  ai_systems_live: string[];
  ai_systems_pending: string[];
  next_milestone: string;
  next_milestone_date: string;
  notes: string;
  acquisition_source: string;
};

const EMPTY_FORM: FormData = {
  company_name: '',
  vertical: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  contact_title: '',
  monthly_rate: '7000',
  scoping_fee: '9500',
  contract_start: new Date().toISOString().split('T')[0],
  contract_end: (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  })(),
  status: 'active',
  current_phase: '1',
  ai_systems_live: [],
  ai_systems_pending: [],
  next_milestone: '',
  next_milestone_date: '',
  notes: '',
  acquisition_source: '',
};

export default function ActiveClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await csrfFetch('/api/admin/consulting-clients');
      if (res.ok) setClients(await res.json());
    } catch (err) {
      logger.error('Failed to load clients', { err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await csrfFetch('/api/admin/consulting-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthly_rate: parseInt(form.monthly_rate),
          scoping_fee: parseInt(form.scoping_fee) || 0,
          current_phase: parseInt(form.current_phase),
          contact_phone: form.contact_phone || null,
          contact_title: form.contact_title || null,
          next_milestone: form.next_milestone || null,
          next_milestone_date: form.next_milestone_date || null,
          notes: form.notes || null,
          acquisition_source: form.acquisition_source || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function updateMilestone(clientId: string, milestoneId: string, status: string) {
    await csrfFetch(`/api/admin/consulting-clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone_id: milestoneId, status }),
    });
    await load();
  }

  const totalMRR = clients.filter(c => c.status === 'active' || c.status === 'maintenance')
    .reduce((sum, c) => sum + c.monthly_rate, 0);
  const totalARR = totalMRR * 12;
  const activeCount = clients.filter(c => c.status === 'active').length;

  const toggleSystem = (field: 'ai_systems_live' | 'ai_systems_pending', sys: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(sys)
        ? prev[field].filter(s => s !== sys)
        : [...prev[field], sys],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Active Consulting Clients
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI Transformation Program — 12-month engagements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">MRR</span>
            </div>
            <p className="text-2xl font-bold">${totalMRR.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">ARR</span>
            </div>
            <p className="text-2xl font-bold">${totalARR.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Annual run rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Capacity</span>
            </div>
            <p className="text-2xl font-bold">{activeCount}<span className="text-lg text-muted-foreground">/15</span></p>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span className="text-xs text-muted-foreground">Target</span>
            </div>
            <p className="text-2xl font-bold">${((15 - activeCount) * 7000).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">MRR gap to capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Client list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No clients yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Add your first consulting client to start tracking their transformation.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/admin/applications">View Applications <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Client
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map(client => {
            const phase = PHASES.find(p => p.id === client.current_phase) || PHASES[0];
            const endDate = new Date(client.contract_end);
            const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            const renewingSoon = daysLeft <= 60 && client.status === 'active';
            const completedMilestones = client.milestones?.filter(m => m.status === 'complete').length || 0;
            const totalMilestones = client.milestones?.length || 0;

            return (
              <Card key={client.id} className={renewingSoon ? 'border-amber-500/50' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-base">{client.company_name}</h3>
                        <Badge variant="outline" className="text-xs">{client.vertical}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[client.status]}`}>
                          {client.status}
                        </span>
                        {renewingSoon && (
                          <Badge className="text-xs bg-amber-500 text-white">Renewing in {daysLeft}d</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                        <span>{client.contact_name}{client.contact_title ? ` · ${client.contact_title}` : ''}</span>
                        <a href={`mailto:${client.contact_email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="w-3 h-3" />{client.contact_email}
                        </a>
                        {client.contact_phone && (
                          <a href={`tel:${client.contact_phone}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone className="w-3 h-3" />{client.contact_phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold">${client.monthly_rate.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                      <p className="text-xs text-muted-foreground">${(client.monthly_rate * 12).toLocaleString()}/yr contract</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${phase.color}`}>
                      {phase.label}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{daysLeft} days remaining
                    </span>
                    {totalMilestones > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        {completedMilestones}/{totalMilestones} milestones
                      </span>
                    )}
                  </div>

                  {/* AI Systems live */}
                  {client.ai_systems_live.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {client.ai_systems_live.map(sys => (
                        <span key={sys} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bot className="w-3 h-3" />{sys}
                        </span>
                      ))}
                      {client.ai_systems_pending.map(sys => (
                        <span key={sys} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />{sys}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Milestones quick view */}
                  {client.milestones && client.milestones.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {client.milestones
                        .filter(m => m.status !== 'complete')
                        .slice(0, 3)
                        .map(m => (
                          <div key={m.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'in_progress' ? 'bg-amber-500' : 'bg-muted-foreground/40'}`} />
                              {m.title}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              {m.due_date && (
                                <span className="text-muted-foreground">{new Date(m.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                              )}
                              <button
                                onClick={() => updateMilestone(client.id, m.id, m.status === 'in_progress' ? 'complete' : 'in_progress')}
                                className="text-primary hover:underline"
                              >
                                {m.status === 'in_progress' ? 'Mark done' : 'Start'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {client.next_milestone && (
                        <span className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          Next: {client.next_milestone}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/clients/${client.id}`}>
                        Details <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Client Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Consulting Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Company Name *</label>
                <Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} required placeholder="Smith Heavy Haul LLC" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Vertical *</label>
                <Select value={form.vertical} onValueChange={v => setForm(p => ({ ...p, vertical: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select vertical" /></SelectTrigger>
                  <SelectContent>
                    {VERTICALS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Contact Name *</label>
                <Input value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} required placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contact Title</label>
                <Input value={form.contact_title} onChange={e => setForm(p => ({ ...p, contact_title: e.target.value }))} placeholder="Owner / CEO" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contact Email *</label>
                <Input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} required placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contact Phone</label>
                <Input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            {/* Contract */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Monthly Rate ($) *</label>
                <Input type="number" value={form.monthly_rate} onChange={e => setForm(p => ({ ...p, monthly_rate: e.target.value }))} required min="1000" step="500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Scoping Fee ($)</label>
                <Input type="number" value={form.scoping_fee} onChange={e => setForm(p => ({ ...p, scoping_fee: e.target.value }))} min="0" step="500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contract Start *</label>
                <Input type="date" value={form.contract_start} onChange={e => setForm(p => ({ ...p, contract_start: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contract End *</label>
                <Input type="date" value={form.contract_end} onChange={e => setForm(p => ({ ...p, contract_end: e.target.value }))} required />
              </div>
            </div>

            {/* Status & Phase */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['prospect','scoping','active','maintenance','churned'].map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Phase</label>
                <Select value={form.current_phase} onValueChange={v => setForm(p => ({ ...p, current_phase: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PHASES.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Source</label>
                <Select value={form.acquisition_source} onValueChange={v => setForm(p => ({ ...p, acquisition_source: v }))}>
                  <SelectTrigger><SelectValue placeholder="How did they find you?" /></SelectTrigger>
                  <SelectContent>
                    {ACQUISITION_SOURCES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Systems */}
            <div>
              <label className="block text-sm font-medium mb-2">AI Systems Live</label>
              <div className="flex flex-wrap gap-2">
                {AI_SYSTEMS.map(sys => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => toggleSystem('ai_systems_live', sys)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      form.ai_systems_live.includes(sys)
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                        : 'bg-muted text-muted-foreground border-border hover:border-foreground/30'
                    }`}
                  >
                    {form.ai_systems_live.includes(sys) ? '✓ ' : ''}{sys}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">AI Systems Pending</label>
              <div className="flex flex-wrap gap-2">
                {AI_SYSTEMS.filter(s => !form.ai_systems_live.includes(s)).map(sys => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => toggleSystem('ai_systems_pending', sys)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      form.ai_systems_pending.includes(sys)
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-muted text-muted-foreground border-border hover:border-foreground/30'
                    }`}
                  >
                    {form.ai_systems_pending.includes(sys) ? '~ ' : ''}{sys}
                  </button>
                ))}
              </div>
            </div>

            {/* Next milestone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Next Milestone</label>
                <Input value={form.next_milestone} onChange={e => setForm(p => ({ ...p, next_milestone: e.target.value }))} placeholder="e.g. Deploy AI Lead Response" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Due Date</label>
                <Input type="date" value={form.next_milestone_date} onChange={e => setForm(p => ({ ...p, next_milestone_date: e.target.value }))} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Internal Notes</label>
              <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Key context, preferences, history..." rows={3} />
            </div>

            {formError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {saving ? 'Saving...' : 'Add Client'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

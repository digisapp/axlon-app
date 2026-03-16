'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Loader2,
  Phone,
  Mic,
  MessageSquare,
  Clock,
  CheckCircle,
  Settings,
  PhoneCall,
  Shield,
  Zap,
  Building2,
  AlertTriangle,
  PhoneIncoming,
  PhoneMissed,
  Play,
  UserPlus,
  TrendingUp,
  Users,
  Plus,
  Mail,
  Key,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react';
import { DealerVoiceAgent } from '@/types';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// ─── Voice Agent Types ──────────────────────────────────────────────

interface CallLog {
  id: string;
  caller_phone: string;
  caller_name: string | null;
  duration_seconds: number | null;
  status: string;
  recording_url: string | null;
  interest: string | null;
  lead_id: string | null;
  started_at: string;
}

interface CallStats {
  totalCalls: number;
  totalMinutes: number;
  leadsCapture: number;
  avgDuration: number;
}

// ─── Staff Types ────────────────────────────────────────────────────

interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone_number: string | null;
  email: string | null;
  voice_pin: string;
  access_level: string;
  can_view_costs: boolean;
  can_view_margins: boolean;
  can_view_all_leads: boolean;
  can_modify_inventory: boolean;
  is_active: boolean;
  last_access_at: string | null;
  access_count: number;
  created_at: string;
}

// ─── Constants ──────────────────────────────────────────────────────

const VOICE_OPTIONS = [
  { value: 'Sal', label: 'Sal', description: 'Warm, professional male voice' },
  { value: 'Ash', label: 'Ash', description: 'Friendly female voice' },
  { value: 'Coral', label: 'Coral', description: 'Clear, articulate female voice' },
  { value: 'Sage', label: 'Sage', description: 'Calm, reassuring female voice' },
  { value: 'Ballad', label: 'Ballad', description: 'Deep, authoritative male voice' },
  { value: 'Verse', label: 'Verse', description: 'Energetic male voice' },
];

type TabKey = 'agent' | 'staff';

export default function VoiceAgentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialTab = (searchParams.get('tab') === 'staff' ? 'staff' : 'agent') as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // ─── Voice Agent State ──────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [agent, setAgent] = useState<DealerVoiceAgent | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [callStats, setCallStats] = useState<CallStats | null>(null);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);

  const [formData, setFormData] = useState({
    agent_name: 'AI Assistant',
    voice: 'Sal',
    greeting: 'Thanks for calling! How can I help you today?',
    business_name: '',
    business_description: '',
    instructions: '',
    after_hours_message: 'We are currently closed. Please leave your name and number and we will call you back.',
    can_search_inventory: true,
    can_capture_leads: true,
    can_transfer_calls: false,
    transfer_phone_number: '',
  });

  // ─── Staff State ────────────────────────────────────────────────
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showPin, setShowPin] = useState<string | null>(null);
  const [staffSaving, setStaffSaving] = useState(false);

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    role: 'sales',
    phone_number: '',
    email: '',
    voice_pin: '',
    access_level: 'standard',
    can_view_costs: false,
    can_view_margins: false,
    can_view_all_leads: true,
    can_modify_inventory: false,
  });

  // ─── Voice Agent Effects & Handlers ─────────────────────────────

  useEffect(() => {
    fetchVoiceAgent();
  }, []);

  useEffect(() => {
    if (agent) {
      fetchCallLogs();
    }
  }, [agent]);

  useEffect(() => {
    if (activeTab === 'staff' && staffLoading) {
      fetchStaff();
    }
  }, [activeTab]);

  const fetchCallLogs = async () => {
    setIsLoadingCalls(true);
    try {
      const response = await fetch('/api/dealer/call-logs?limit=10');
      if (response.ok) {
        const data = await response.json();
        setCallLogs(data.data || []);
        setCallStats(data.stats || null);
      }
    } catch (error) {
      logger.error('Error fetching call logs', { error });
    }
    setIsLoadingCalls(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'Unknown';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getUsagePercentage = () => {
    if (!agent) return 0;
    return Math.round((agent.minutes_used / agent.minutes_included) * 100);
  };

  const isNearingLimit = () => getUsagePercentage() >= 80;
  const isOverLimit = () => getUsagePercentage() >= 100;

  const fetchVoiceAgent = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/dashboard/voice-agent');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();

      const response = await fetch('/api/dealer/voice-agent');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setAgent(data.data);
          setFormData({
            agent_name: data.data.agent_name || 'AI Assistant',
            voice: data.data.voice || 'Sal',
            greeting: data.data.greeting || 'Thanks for calling! How can I help you today?',
            business_name: data.data.business_name || profile?.company_name || '',
            business_description: data.data.business_description || '',
            instructions: data.data.instructions || '',
            after_hours_message: data.data.after_hours_message || 'We are currently closed. Please leave your name and number and we will call you back.',
            can_search_inventory: data.data.can_search_inventory ?? true,
            can_capture_leads: data.data.can_capture_leads ?? true,
            can_transfer_calls: data.data.can_transfer_calls ?? false,
            transfer_phone_number: data.data.transfer_phone_number || '',
          });
        }
      }
    } catch (error) {
      logger.error('Error fetching voice agent', { error });
    }
    setIsLoading(false);
  };

  const handleSetup = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/dealer/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setAgent(data.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      logger.error('Error creating voice agent', { error });
    }
    setIsSaving(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/dealer/voice-agent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setAgent(data.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      logger.error('Error saving voice agent', { error });
    }
    setIsSaving(false);
  };

  // ─── Staff Handlers ─────────────────────────────────────────────

  async function fetchStaff() {
    try {
      const res = await fetch('/api/dealer/staff');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStaffList(data.data || []);
    } catch (error) {
      logger.error('Error fetching staff', { error });
      toast.error('Failed to load staff members');
    } finally {
      setStaffLoading(false);
    }
  }

  function resetStaffForm() {
    setStaffFormData({
      name: '',
      role: 'sales',
      phone_number: '',
      email: '',
      voice_pin: '',
      access_level: 'standard',
      can_view_costs: false,
      can_view_margins: false,
      can_view_all_leads: true,
      can_modify_inventory: false,
    });
  }

  function generatePin() {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setStaffFormData({ ...staffFormData, voice_pin: pin });
  }

  async function handleStaffSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStaffSaving(true);

    try {
      const url = editingStaff
        ? `/api/dealer/staff/${editingStaff.id}`
        : '/api/dealer/staff';
      const method = editingStaff ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffFormData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      toast.success(editingStaff ? 'Staff member updated' : 'Staff member added');
      setIsAddDialogOpen(false);
      setEditingStaff(null);
      resetStaffForm();
      fetchStaff();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save staff member');
    } finally {
      setStaffSaving(false);
    }
  }

  async function handleStaffDelete(staffId: string) {
    if (!confirm('Are you sure you want to remove this staff member?')) return;

    try {
      const res = await fetch(`/api/dealer/staff/${staffId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Staff member removed');
      fetchStaff();
    } catch {
      toast.error('Failed to remove staff member');
    }
  }

  async function toggleStaffActive(staffMember: StaffMember) {
    try {
      const res = await fetch(`/api/dealer/staff/${staffMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !staffMember.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchStaff();
    } catch {
      toast.error('Failed to update staff member');
    }
  }

  function openEditDialog(staffMember: StaffMember) {
    setEditingStaff(staffMember);
    setStaffFormData({
      name: staffMember.name,
      role: staffMember.role,
      phone_number: staffMember.phone_number || '',
      email: staffMember.email || '',
      voice_pin: '',
      access_level: staffMember.access_level,
      can_view_costs: staffMember.can_view_costs,
      can_view_margins: staffMember.can_view_margins,
      can_view_all_leads: staffMember.can_view_all_leads,
      can_modify_inventory: staffMember.can_modify_inventory,
    });
    setIsAddDialogOpen(true);
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-red-100 text-red-700';
      case 'service': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  // ─── Loading ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold">AI Voice Agent</h1>
              <p className="text-sm text-muted-foreground">
                Your personal AI receptionist for handling phone calls
              </p>
            </div>
            {agent && (
              <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                {agent.is_active ? 'Active' : 'Inactive'}
              </Badge>
            )}
          </div>

          {/* Tabs */}
          {agent && (
            <div className="flex gap-1 mt-4 -mb-4 border-b-0">
              <button
                onClick={() => setActiveTab('agent')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'agent'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Agent
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('staff');
                  if (staffLoading) fetchStaff();
                }}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'staff'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Staff Access
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {!agent ? (
          /* Setup Card */
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Get Your AI Voice Agent</CardTitle>
              <CardDescription>
                Never miss a call again. Your AI receptionist answers calls 24/7,
                searches your inventory, and captures leads for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mic className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Natural Conversations</p>
                    <p className="text-xs text-muted-foreground">
                      Sounds like a real person
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Instant Inventory Search</p>
                    <p className="text-xs text-muted-foreground">
                      Answers questions about your stock
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Lead Capture</p>
                    <p className="text-xs text-muted-foreground">
                      Collects caller info automatically
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Initial Setup Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    placeholder="ABC Truck Sales"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="Thanks for calling ABC Truck Sales! How can I help you today?"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <Select
                    value={formData.voice}
                    onValueChange={(value) => setFormData({ ...formData, voice: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_OPTIONS.map((voice) => (
                        <SelectItem key={voice.value} value={voice.value}>
                          <div>
                            <span className="font-medium">{voice.label}</span>
                            <span className="text-muted-foreground ml-2">- {voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSetup} disabled={isSaving} className="w-full">
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Start Free Trial (30 minutes)
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your trial includes 30 minutes of call time. Contact us to get a dedicated phone number.
              </p>
            </CardContent>
          </Card>
        ) : activeTab === 'agent' ? (
          /* ─── Agent Tab ──────────────────────────────────────────── */
          <>
            {/* Usage Alert */}
            {isNearingLimit() && (
              <Card className={isOverLimit() ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${isOverLimit() ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${isOverLimit() ? 'text-red-700' : 'text-yellow-700'}`}>
                        {isOverLimit()
                          ? 'You\'ve used all your minutes!'
                          : `You've used ${getUsagePercentage()}% of your minutes`}
                      </p>
                      <p className={`text-sm ${isOverLimit() ? 'text-red-600' : 'text-yellow-600'}`}>
                        {isOverLimit()
                          ? 'Upgrade now to continue receiving calls.'
                          : `${agent.minutes_included - agent.minutes_used} minutes remaining this billing cycle.`}
                      </p>
                    </div>
                    <Button size="sm" variant={isOverLimit() ? 'destructive' : 'outline'} asChild>
                      <Link href="/dashboard/billing">Upgrade Plan</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Card */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      agent.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Phone className={`w-6 h-6 ${agent.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {agent.phone_number || 'No phone number assigned'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.is_active
                          ? 'Your AI agent is answering calls'
                          : agent.phone_number
                            ? 'Agent is inactive'
                            : 'Contact us to get a dedicated number'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{agent.minutes_used || 0}</span>
                      <span className="text-muted-foreground">/ {agent.minutes_included} min</span>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverLimit() ? 'bg-red-500' : isNearingLimit() ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {agent.plan_tier} plan
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call Stats */}
            {callStats && callStats.totalCalls > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <PhoneIncoming className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{callStats.totalCalls}</p>
                        <p className="text-xs text-muted-foreground">Total Calls</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{callStats.totalMinutes}</p>
                        <p className="text-xs text-muted-foreground">Minutes Used</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{callStats.leadsCapture}</p>
                        <p className="text-xs text-muted-foreground">Leads Captured</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">{formatDuration(callStats.avgDuration)}</p>
                        <p className="text-xs text-muted-foreground">Avg Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Agent Settings
                </CardTitle>
                <CardDescription>
                  Customize how your AI agent handles calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agent_name">Agent Name</Label>
                    <Input
                      id="agent_name"
                      placeholder="AI Assistant"
                      value={formData.agent_name}
                      onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How the agent introduces itself
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="voice">Voice</Label>
                    <Select
                      value={formData.voice}
                      onValueChange={(value) => setFormData({ ...formData, voice: value })}
                    >
                      <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="business_name" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    placeholder="ABC Truck Sales"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="Thanks for calling! How can I help you today?"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The first thing callers hear when the agent answers
                  </p>
                </div>

                <div>
                  <Label htmlFor="business_description">Business Description</Label>
                  <Textarea
                    id="business_description"
                    placeholder="We specialize in quality used semi trucks and trailers..."
                    value={formData.business_description}
                    onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Helps the AI understand your business to answer questions better
                  </p>
                </div>

                <div>
                  <Label htmlFor="instructions">Custom Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Always mention our financing options. Direct warranty questions to the service department..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Special instructions for how the agent should behave
                  </p>
                </div>

                <div>
                  <Label htmlFor="after_hours_message">After-Hours Message</Label>
                  <Textarea
                    id="after_hours_message"
                    placeholder="We are currently closed. Please leave your name and number and we will call you back."
                    value={formData.after_hours_message}
                    onChange={(e) => setFormData({ ...formData, after_hours_message: e.target.value })}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Greeting message when calling outside business hours
                  </p>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-medium">Features</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Search Inventory</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow agent to search and describe your listings
                      </p>
                    </div>
                    <Switch
                      checked={formData.can_search_inventory}
                      onCheckedChange={(checked) => setFormData({ ...formData, can_search_inventory: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Capture Leads</Label>
                      <p className="text-sm text-muted-foreground">
                        Collect caller information for follow-up
                      </p>
                    </div>
                    <Switch
                      checked={formData.can_capture_leads}
                      onCheckedChange={(checked) => setFormData({ ...formData, can_capture_leads: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Call Transfer</Label>
                      <p className="text-sm text-muted-foreground">
                        Transfer calls to your phone on request
                      </p>
                    </div>
                    <Switch
                      checked={formData.can_transfer_calls}
                      onCheckedChange={(checked) => setFormData({ ...formData, can_transfer_calls: checked })}
                    />
                  </div>

                  {formData.can_transfer_calls && (
                    <div className="ml-4">
                      <Label htmlFor="transfer_phone_number">Transfer Number</Label>
                      <Input
                        id="transfer_phone_number"
                        type="tel"
                        placeholder="+1-555-123-4567"
                        value={formData.transfer_phone_number}
                        onChange={(e) => setFormData({ ...formData, transfer_phone_number: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>

            {/* Recent Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIncoming className="w-5 h-5" />
                  Recent Calls
                </CardTitle>
                <CardDescription>
                  Your last 10 incoming calls handled by the AI agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCalls ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : callLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No calls yet</p>
                    <p className="text-sm">Calls will appear here once your agent starts receiving them</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {callLogs.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            call.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {call.status === 'completed' ? (
                              <PhoneIncoming className="w-5 h-5 text-green-600" />
                            ) : (
                              <PhoneMissed className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {call.caller_name || formatPhoneNumber(call.caller_phone)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{new Date(call.started_at).toLocaleDateString()}</span>
                              <span>at</span>
                              <span>{new Date(call.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {call.lead_id && (
                                <Badge variant="secondary" className="text-xs">
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  Lead
                                </Badge>
                              )}
                            </div>
                            {call.interest && (
                              <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">
                                {call.interest}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">{formatDuration(call.duration_seconds)}</p>
                            <p className="text-xs text-muted-foreground">duration</p>
                          </div>
                          {call.recording_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => window.open(call.recording_url!, '_blank')}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {callLogs.length >= 10 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/dashboard/calls">View All Calls</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {agent.plan_tier === 'trial' && (
              <Card className="border-primary">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Upgrade Your Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Get more minutes and a dedicated phone number
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/billing">View Plans</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* ─── Staff Access Tab ────────────────────────────────────── */
          <>
            {/* Staff Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Staff Voice Access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage voice PIN access for your team to query AI internally
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setEditingStaff(null);
                  resetStaffForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingStaff
                        ? 'Update staff member details and permissions'
                        : 'Add a team member who can access internal data via voice PIN'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleStaffSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staff_name">Name *</Label>
                        <Input
                          id="staff_name"
                          value={staffFormData.name}
                          onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staff_role">Role</Label>
                        <Select
                          value={staffFormData.role}
                          onValueChange={(value) => setStaffFormData({ ...staffFormData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staff_voice_pin">Voice PIN *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="staff_voice_pin"
                          value={staffFormData.voice_pin}
                          onChange={(e) => setStaffFormData({ ...staffFormData, voice_pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          placeholder={editingStaff ? 'Leave blank to keep current' : '4-6 digit PIN'}
                          maxLength={6}
                          required={!editingStaff}
                        />
                        <Button type="button" variant="outline" onClick={generatePin}>
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Staff will say this PIN to authenticate when calling
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staff_phone">Phone (optional)</Label>
                        <Input
                          id="staff_phone"
                          value={staffFormData.phone_number}
                          onChange={(e) => setStaffFormData({ ...staffFormData, phone_number: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staff_email">Email (optional)</Label>
                        <Input
                          id="staff_email"
                          type="email"
                          value={staffFormData.email}
                          onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t">
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="staff_costs" className="text-sm font-normal">View acquisition costs</Label>
                          <Switch
                            id="staff_costs"
                            checked={staffFormData.can_view_costs}
                            onCheckedChange={(checked) => setStaffFormData({ ...staffFormData, can_view_costs: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="staff_margins" className="text-sm font-normal">View profit margins</Label>
                          <Switch
                            id="staff_margins"
                            checked={staffFormData.can_view_margins}
                            onCheckedChange={(checked) => setStaffFormData({ ...staffFormData, can_view_margins: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="staff_leads" className="text-sm font-normal">View all leads</Label>
                          <Switch
                            id="staff_leads"
                            checked={staffFormData.can_view_all_leads}
                            onCheckedChange={(checked) => setStaffFormData({ ...staffFormData, can_view_all_leads: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={staffSaving}>
                        {staffSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {editingStaff ? 'Update' : 'Add Staff Member'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* How it works */}
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      How Voice PIN Access Works
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-300">
                      <li>Staff calls your AI phone number</li>
                      <li>Says &quot;Internal access&quot; to trigger authentication</li>
                      <li>AI asks: &quot;Please say your name and access code&quot;</li>
                      <li>Staff says: &quot;John, 4521&quot;</li>
                      <li>AI verifies and unlocks internal database access</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff List */}
            {staffLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : staffList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No staff members yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add team members to give them voice access to internal data
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Staff Member
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {staffList.map((member) => (
                  <Card key={member.id} className={!member.is_active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{member.name}</h3>
                              <Badge className={getRoleBadgeColor(member.role)}>
                                {member.role}
                              </Badge>
                              {!member.is_active && (
                                <Badge variant="outline" className="text-muted-foreground">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Key className="w-3 h-3" />
                                PIN: {showPin === member.id ? member.voice_pin : '••••'}
                                <button
                                  onClick={() => setShowPin(showPin === member.id ? null : member.id)}
                                  className="hover:text-foreground"
                                >
                                  {showPin === member.id ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </button>
                              </span>
                              {member.phone_number && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {member.phone_number}
                                </span>
                              )}
                              {member.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {member.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {member.last_access_at
                                ? `Last access: ${new Date(member.last_access_at).toLocaleDateString()}`
                                : 'Never accessed'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.access_count} total accesses
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={member.is_active}
                              onCheckedChange={() => toggleStaffActive(member)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(member)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleStaffDelete(member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        {member.can_view_costs && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            View Costs
                          </Badge>
                        )}
                        {member.can_view_margins && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            View Margins
                          </Badge>
                        )}
                        {member.can_view_all_leads && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            All Leads
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

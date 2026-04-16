'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Loader2,
  Bot,
  CheckCircle,
  Plus,
  X,
  MessageCircle,
  Settings,
  HelpCircle,
  TrendingUp,
  Users,
  Sparkles,
  Lock,
  Crown,
  Database,
  RefreshCw,
  Upload,
  FileText,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

interface FAQ {
  question: string;
  answer: string;
}

interface AISettings {
  assistant_name: string;
  greeting_message: string;
  about_dealer: string;
  specialties: string[];
  value_propositions: string[];
  service_areas: string[];
  financing_info: string;
  warranty_info: string;
  faqs: FAQ[];
  tone: string;
  language_style: string;
  max_response_length: number;
  include_pricing: boolean;
  include_financing_cta: boolean;
  capture_leads: boolean;
  lead_capture_message: string;
  lead_notification_email: string;
  is_enabled: boolean;
  show_on_listings: boolean;
  show_on_storefront: boolean;
  market_reports_enabled: boolean;
  total_conversations: number;
  total_messages: number;
  total_leads_generated: number;
}

const defaultSettings: AISettings = {
  assistant_name: 'AI Sales Assistant',
  greeting_message: "Hi! I'm here to help you find the perfect equipment. What are you looking for today?",
  about_dealer: '',
  specialties: [],
  value_propositions: [],
  service_areas: [],
  financing_info: '',
  warranty_info: '',
  faqs: [],
  tone: 'professional',
  language_style: 'concise',
  max_response_length: 300,
  include_pricing: true,
  include_financing_cta: true,
  capture_leads: true,
  lead_capture_message: "I'd love to connect you with one of our team members. Could you share your contact info?",
  lead_notification_email: '',
  is_enabled: false,
  show_on_listings: true,
  show_on_storefront: true,
  market_reports_enabled: false,
  total_conversations: 0,
  total_messages: 0,
  total_leads_generated: 0,
};

function KBDocumentUploadForm({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File, title: string, docType: string) => Promise<boolean>;
  isUploading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('general');

  const handleSubmit = async () => {
    if (!file || !title.trim()) return;
    const success = await onUpload(file, title.trim(), docType);
    if (success) {
      setFile(null);
      setTitle('');
      setDocType('general');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="kb-file">File</Label>
        <Input
          id="kb-file"
          type="file"
          accept=".pdf,.txt,.md,.csv,.json,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground mt-1">
          PDF, Text, Markdown, CSV, JSON, DOCX (max 50MB)
        </p>
      </div>
      <div>
        <Label htmlFor="kb-title">Document Title</Label>
        <Input
          id="kb-title"
          placeholder="E.g., 2024 Price List, Warranty Policy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="kb-type">Document Type</Label>
        <Select value={docType} onValueChange={setDocType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="spec_sheet">Spec Sheet</SelectItem>
            <SelectItem value="warranty">Warranty</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="brochure">Brochure</SelectItem>
            <SelectItem value="price_list">Price List</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isUploading || !file || !title.trim()}
        className="w-full"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        Upload Document
      </Button>
    </div>
  );
}

export default function AIAssistantPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [dealerName, setDealerName] = useState<string>('');
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newValueProp, setNewValueProp] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');
  const [newFaq, setNewFaq] = useState<FAQ>({ question: '', answer: '' });

  // Knowledge Base state
  const [kbStatus, setKbStatus] = useState<{
    enabled: boolean;
    collection_status: string;
    collection_error: string | null;
    listing_docs: number;
    custom_docs: number;
    error_docs: number;
  } | null>(null);
  const [kbDocuments, setKbDocuments] = useState<Array<{
    id: string;
    title: string;
    document_type: string;
    file_name: string;
    file_size: number;
    upload_status: string;
    created_at: string;
  }>>([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbSyncing, setKbSyncing] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/dashboard/ai-assistant');
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSubscriptionTier(profile.subscription_tier || 'free');
        setDealerName(profile.company_name || '');
      }

      // Fetch AI settings
      const { data: aiSettings } = await supabase
        .from('dealer_ai_settings')
        .select('*')
        .eq('dealer_id', user.id)
        .single();

      if (aiSettings) {
        setSettings({
          assistant_name: aiSettings.assistant_name || defaultSettings.assistant_name,
          greeting_message: aiSettings.greeting_message || defaultSettings.greeting_message,
          about_dealer: aiSettings.about_dealer || '',
          specialties: aiSettings.specialties || [],
          value_propositions: aiSettings.value_propositions || [],
          service_areas: aiSettings.service_areas || [],
          financing_info: aiSettings.financing_info || '',
          warranty_info: aiSettings.warranty_info || '',
          faqs: aiSettings.faqs || [],
          tone: aiSettings.tone || 'professional',
          language_style: aiSettings.language_style || 'concise',
          max_response_length: aiSettings.max_response_length || 300,
          include_pricing: aiSettings.include_pricing !== false,
          include_financing_cta: aiSettings.include_financing_cta !== false,
          capture_leads: aiSettings.capture_leads !== false,
          lead_capture_message: aiSettings.lead_capture_message || defaultSettings.lead_capture_message,
          lead_notification_email: aiSettings.lead_notification_email || '',
          is_enabled: aiSettings.is_enabled || false,
          show_on_listings: aiSettings.show_on_listings !== false,
          show_on_storefront: aiSettings.show_on_storefront !== false,
          market_reports_enabled: aiSettings.market_reports_enabled || false,
          total_conversations: aiSettings.total_conversations || 0,
          total_messages: aiSettings.total_messages || 0,
          total_leads_generated: aiSettings.total_leads_generated || 0,
        });
      }

      setIsLoading(false);
    };

    fetchData();
  }, [router, supabase]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert AI settings
      const { error } = await supabase
        .from('dealer_ai_settings')
        .upsert({
          dealer_id: user.id,
          assistant_name: settings.assistant_name,
          greeting_message: settings.greeting_message,
          about_dealer: settings.about_dealer,
          specialties: settings.specialties,
          value_propositions: settings.value_propositions,
          service_areas: settings.service_areas,
          financing_info: settings.financing_info,
          warranty_info: settings.warranty_info,
          faqs: settings.faqs,
          tone: settings.tone,
          language_style: settings.language_style,
          max_response_length: settings.max_response_length,
          include_pricing: settings.include_pricing,
          include_financing_cta: settings.include_financing_cta,
          capture_leads: settings.capture_leads,
          lead_capture_message: settings.lead_capture_message,
          lead_notification_email: settings.lead_notification_email,
          is_enabled: settings.is_enabled,
          show_on_listings: settings.show_on_listings,
          show_on_storefront: settings.show_on_storefront,
          market_reports_enabled: settings.market_reports_enabled,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'dealer_id',
        });

      if (!error) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      logger.error('Save error', { error });
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSettings(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setSettings(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const addValueProp = () => {
    if (newValueProp.trim()) {
      setSettings(prev => ({
        ...prev,
        value_propositions: [...prev.value_propositions, newValueProp.trim()],
      }));
      setNewValueProp('');
    }
  };

  const removeValueProp = (index: number) => {
    setSettings(prev => ({
      ...prev,
      value_propositions: prev.value_propositions.filter((_, i) => i !== index),
    }));
  };

  const addServiceArea = () => {
    if (newServiceArea.trim()) {
      setSettings(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, newServiceArea.trim()],
      }));
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (index: number) => {
    setSettings(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setSettings(prev => ({
        ...prev,
        faqs: [...prev.faqs, { question: newFaq.question.trim(), answer: newFaq.answer.trim() }],
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index: number) => {
    setSettings(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Knowledge Base functions
  const fetchKBStatus = async () => {
    try {
      const res = await csrfFetch('/api/dealer/knowledge-base');
      if (res.ok) {
        const data = await res.json();
        setKbStatus(data);
      }
    } catch (e) {
      logger.error('Failed to fetch KB status', { error: e });
    }
  };

  const fetchKBDocuments = async () => {
    try {
      const res = await csrfFetch('/api/dealer/knowledge-base/documents');
      if (res.ok) {
        const data = await res.json();
        setKbDocuments(data.data || []);
      }
    } catch (e) {
      logger.error('Failed to fetch KB documents', { error: e });
    }
  };

  const toggleKB = async (enable: boolean) => {
    setKbLoading(true);
    try {
      const res = await csrfFetch('/api/dealer/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: enable ? 'enable' : 'disable' }),
      });
      if (res.ok) {
        await fetchKBStatus();
      }
    } catch (e) {
      logger.error('Failed to toggle KB', { error: e });
    } finally {
      setKbLoading(false);
    }
  };

  const syncAllKB = async () => {
    setKbSyncing(true);
    try {
      await csrfFetch('/api/dealer/knowledge-base/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      // Refresh status after a short delay to let sync start
      setTimeout(() => fetchKBStatus(), 2000);
    } catch (e) {
      logger.error('Failed to trigger KB sync', { error: e });
    } finally {
      setKbSyncing(false);
    }
  };

  const uploadKBDocument = async (file: File, title: string, docType: string) => {
    setKbUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('document_type', docType);

      const res = await csrfFetch('/api/dealer/knowledge-base/documents', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchKBDocuments();
        await fetchKBStatus();
        return true;
      }
      return false;
    } catch (e) {
      logger.error('Failed to upload KB document', { error: e });
      return false;
    } finally {
      setKbUploading(false);
    }
  };

  const deleteKBDocument = async (docId: string) => {
    try {
      const res = await csrfFetch(`/api/dealer/knowledge-base/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setKbDocuments(prev => prev.filter(d => d.id !== docId));
        await fetchKBStatus();
      }
    } catch (e) {
      logger.error('Failed to delete KB document', { error: e });
    }
  };

  // Fetch KB data when page loads
  useEffect(() => {
    if (!isLoading) {
      fetchKBStatus();
      fetchKBDocuments();
    }
  }, [isLoading]);

  const isPro = subscriptionTier === 'pro' || subscriptionTier === 'enterprise';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Gate AI Assistant behind Pro plan
  if (!isPro) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="bg-background border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-bold">AI Sales Assistant</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Pro Feature</CardTitle>
              <CardDescription>
                AI Sales Assistant is available on Pro and Enterprise plans.
                Upgrade to get your own AI that captures leads 24/7.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 text-left">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Bot className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">24/7 Lead Capture</p>
                    <p className="text-sm text-muted-foreground">AI answers questions and captures leads while you sleep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Knows Your Inventory</p>
                    <p className="text-sm text-muted-foreground">Trained on your listings, pricing, and business details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Qualify Leads Automatically</p>
                    <p className="text-sm text-muted-foreground">Captures contact info, budget, and timeline from visitors</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/dashboard/billing">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Pro - $79/mo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span>AI Assistant settings saved!</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Sales Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your 24/7 AI-powered salesperson
                </p>
              </div>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'} className="flex items-center gap-1">
              {isPro ? <Crown className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {subscriptionTier === 'enterprise' ? 'Enterprise' : isPro ? 'Pro' : 'Free'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{settings.total_conversations}</p>
                  <p className="text-sm text-muted-foreground">Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{settings.total_leads_generated}</p>
                  <p className="text-sm text-muted-foreground">Leads Captured</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{settings.total_messages}</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enable Toggle */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${settings.is_enabled ? 'bg-green-500' : 'bg-muted'}`}>
                  <Bot className={`w-6 h-6 ${settings.is_enabled ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {settings.is_enabled ? 'AI Assistant is Active' : 'AI Assistant is Disabled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {settings.is_enabled
                      ? 'Your AI is answering customer questions right now'
                      : 'Enable to start converting visitors into leads'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.is_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="identity">
              <Bot className="w-4 h-4 mr-2" />
              Identity
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <Sparkles className="w-4 h-4 mr-2" />
              Knowledge
            </TabsTrigger>
            <TabsTrigger value="knowledge-base">
              <Database className="w-4 h-4 mr-2" />
              KB
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Identity</CardTitle>
                <CardDescription>
                  How your AI introduces itself and greets customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assistant_name">Assistant Name</Label>
                  <Input
                    id="assistant_name"
                    placeholder="AI Sales Assistant"
                    value={settings.assistant_name}
                    onChange={(e) => setSettings({ ...settings, assistant_name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    E.g., &quot;{dealerName} Sales Bot&quot; or &quot;Alex from {dealerName}&quot;
                  </p>
                </div>

                <div>
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="Hi! I'm here to help you find the perfect equipment..."
                    value={settings.greeting_message}
                    onChange={(e) => setSettings({ ...settings, greeting_message: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    First message shown when customers open the chat
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={settings.tone}
                      onValueChange={(value) => setSettings({ ...settings, tone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="style">Response Style</Label>
                    <Select
                      value={settings.language_style}
                      onValueChange={(value) => setSettings({ ...settings, language_style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Your Business</CardTitle>
                <CardDescription>
                  Information the AI will use to tell customers about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about">Company Description</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell the AI about your company history, mission, what makes you different..."
                    value={settings.about_dealer}
                    onChange={(e) => setSettings({ ...settings, about_dealer: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Value Propositions</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    What makes your business special? The AI will highlight these.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.value_propositions.map((prop, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {prop}
                        <button onClick={() => removeValueProp(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="E.g., Family owned since 1985"
                      value={newValueProp}
                      onChange={(e) => setNewValueProp(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValueProp())}
                    />
                    <Button type="button" variant="outline" onClick={addValueProp}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Service Areas</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Where do you sell and deliver?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.service_areas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <button onClick={() => removeServiceArea(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="E.g., Texas, Oklahoma, Louisiana"
                      value={newServiceArea}
                      onChange={(e) => setNewServiceArea(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                    />
                    <Button type="button" variant="outline" onClick={addServiceArea}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Specialties</CardTitle>
                <CardDescription>
                  What types of equipment does your business specialize in?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {settings.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <button onClick={() => removeSpecialty(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="E.g., Lowboy trailers, Reefers, Day Cabs"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" variant="outline" onClick={addSpecialty}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  The AI will emphasize these when recommending equipment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financing Information</CardTitle>
                <CardDescription>
                  Tell the AI about your financing options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., We offer in-house financing with as low as 10% down. Rates starting at 6.9% APR for qualified buyers. We work with all credit types..."
                  value={settings.financing_info}
                  onChange={(e) => setSettings({ ...settings, financing_info: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warranty Information</CardTitle>
                <CardDescription>
                  What warranties do you offer?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., All used equipment comes with a 30-day powertrain warranty. Extended warranties available up to 3 years..."
                  value={settings.warranty_info}
                  onChange={(e) => setSettings({ ...settings, warranty_info: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge-base" className="space-y-6">
            {/* KB Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  AI Knowledge Base
                </CardTitle>
                <CardDescription>
                  Give your AI assistant deep knowledge of your entire inventory and custom documents.
                  When enabled, the AI searches your knowledge base semantically instead of using basic keyword matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${kbStatus?.collection_status === 'active' ? 'bg-green-500' : 'bg-muted'}`}>
                      <Database className={`w-5 h-5 ${kbStatus?.collection_status === 'active' ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {kbStatus?.collection_status === 'active'
                          ? 'Knowledge Base Active'
                          : kbStatus?.collection_status === 'creating'
                          ? 'Setting Up...'
                          : 'Knowledge Base Disabled'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {kbStatus?.collection_status === 'active'
                          ? `${kbStatus.listing_docs} listings synced, ${kbStatus.custom_docs} documents uploaded`
                          : 'Enable to give your AI deep knowledge of your inventory'}
                      </p>
                      {kbStatus?.collection_status === 'error' && kbStatus.collection_error && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          {kbStatus.collection_error}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={kbStatus?.enabled ? 'outline' : 'default'}
                    onClick={() => toggleKB(!kbStatus?.enabled)}
                    disabled={kbLoading || kbStatus?.collection_status === 'creating'}
                  >
                    {kbLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {kbStatus?.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                {kbStatus?.collection_status === 'active' && (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">{kbStatus.listing_docs}</p>
                        <p className="text-xs text-muted-foreground">Listings Synced</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">{kbStatus.custom_docs}</p>
                        <p className="text-xs text-muted-foreground">Custom Docs</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-destructive">{kbStatus.error_docs}</p>
                        <p className="text-xs text-muted-foreground">Sync Errors</p>
                      </div>
                    </div>

                    {/* Sync Button */}
                    <Button
                      variant="outline"
                      onClick={syncAllKB}
                      disabled={kbSyncing}
                      className="w-full"
                    >
                      {kbSyncing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Re-sync All Listings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Document Upload */}
            {kbStatus?.collection_status === 'active' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Documents
                  </CardTitle>
                  <CardDescription>
                    Upload spec sheets, warranty info, price lists, or other documents
                    to give your AI even more knowledge.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KBDocumentUploadForm
                    onUpload={uploadKBDocument}
                    isUploading={kbUploading}
                  />
                </CardContent>
              </Card>
            )}

            {/* Documents List */}
            {kbStatus?.collection_status === 'active' && kbDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {kbDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.file_name} &middot; {doc.document_type.replace(/_/g, ' ')}
                              {doc.file_size && ` \u00B7 ${(doc.file_size / 1024).toFixed(0)} KB`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={doc.upload_status === 'synced' ? 'default' : doc.upload_status === 'error' ? 'destructive' : 'secondary'}>
                            {doc.upload_status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteKBDocument(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom FAQs</CardTitle>
                <CardDescription>
                  Add common questions and answers. The AI will use these to respond accurately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.faqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg relative">
                    <button
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="font-medium mb-2">Q: {faq.question}</p>
                    <p className="text-sm text-muted-foreground">A: {faq.answer}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="new_question">Question</Label>
                    <Input
                      id="new_question"
                      placeholder="E.g., Do you offer delivery?"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new_answer">Answer</Label>
                    <Textarea
                      id="new_answer"
                      placeholder="E.g., Yes! We offer nationwide delivery. Delivery costs vary by distance..."
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={addFaq} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Where should your AI assistant appear?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Show on Your Listings</p>
                    <p className="text-sm text-muted-foreground">
                      Display chat widget on all your listing pages
                    </p>
                  </div>
                  <Switch
                    checked={settings.show_on_listings}
                    onCheckedChange={(checked) => setSettings({ ...settings, show_on_listings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Show on Storefront</p>
                    <p className="text-sm text-muted-foreground">
                      Display chat widget on your storefront page
                    </p>
                  </div>
                  <Switch
                    checked={settings.show_on_storefront}
                    onCheckedChange={(checked) => setSettings({ ...settings, show_on_storefront: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Market Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Receive AI-generated market intelligence reports every Sunday
                    </p>
                  </div>
                  <Switch
                    checked={settings.market_reports_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, market_reports_enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Settings</CardTitle>
                <CardDescription>
                  Control how the AI responds to customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Include Pricing</p>
                    <p className="text-sm text-muted-foreground">
                      AI can share equipment prices from your listings
                    </p>
                  </div>
                  <Switch
                    checked={settings.include_pricing}
                    onCheckedChange={(checked) => setSettings({ ...settings, include_pricing: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Financing CTA</p>
                    <p className="text-sm text-muted-foreground">
                      AI mentions financing options when discussing prices
                    </p>
                  </div>
                  <Switch
                    checked={settings.include_financing_cta}
                    onCheckedChange={(checked) => setSettings({ ...settings, include_financing_cta: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Capture</CardTitle>
                <CardDescription>
                  Convert conversations into leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Capture Leads</p>
                    <p className="text-sm text-muted-foreground">
                      AI will ask for contact info when customers show interest
                    </p>
                  </div>
                  <Switch
                    checked={settings.capture_leads}
                    onCheckedChange={(checked) => setSettings({ ...settings, capture_leads: checked })}
                  />
                </div>

                {settings.capture_leads && (
                  <>
                    <div>
                      <Label htmlFor="lead_message">Lead Capture Message</Label>
                      <Textarea
                        id="lead_message"
                        placeholder="I'd love to connect you with one of our team members..."
                        value={settings.lead_capture_message}
                        onChange={(e) => setSettings({ ...settings, lead_capture_message: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lead_email">Lead Notification Email</Label>
                      <Input
                        id="lead_email"
                        type="email"
                        placeholder="sales@yourcompany.com (leave blank to use account email)"
                        value={settings.lead_notification_email}
                        onChange={(e) => setSettings({ ...settings, lead_notification_email: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6 gap-4">
          <Link href="/dashboard/conversations">
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              View Conversations
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save AI Settings
          </Button>
        </div>

        {/* Upgrade Banner for Free Users */}
        {!isPro && (
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-full">
                    <Crown className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Upgrade to Pro</p>
                    <p className="text-sm text-muted-foreground">
                      Get unlimited conversations, advanced analytics, and priority support
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/billing">
                  <Button>
                    Upgrade Now - $49/mo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

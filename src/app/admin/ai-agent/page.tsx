'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Bot,
  MessageSquare,
  Settings2,
  Save,
  Loader2,
  Volume2,
} from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';
import { XAI_VOICES } from '@/lib/voice/xai-voices';
import { TONE } from '@/components/admin/tones';

interface AIAgentSettings {
  id: string;
  voice: string;
  agent_name: string;
  greeting_message: string;
  instructions: string;
  model: string;
  temperature: number;
  phone_number: string;
  is_active: boolean;
  updated_at: string;
}

const VOICE_OPTIONS = XAI_VOICES.map((v) => ({ ...v, label: v.value }));

export default function AIAgentSettingsPage() {
  const [settings, setSettings] = useState<AIAgentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await csrfFetch('/api/admin/ai-agent');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      logger.error('Error fetching settings', { error });
      toast.error('Failed to load AI agent settings');
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!settings) return;

    setSaving(true);
    try {
      const res = await csrfFetch('/api/admin/ai-agent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      const updated = await res.json();
      setSettings(updated);
      setHasChanges(false);
      toast.success('AI agent settings saved successfully');
    } catch (error) {
      logger.error('Error saving settings', { error });
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  function updateSetting<K extends keyof AIAgentSettings>(key: K, value: AIAgentSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  }

  const saveButton = (
    <div className="flex items-center gap-3">
      {hasChanges && !saving && (
        <span className="text-sm text-amber-600 dark:text-amber-400">Unsaved changes</span>
      )}
      <Button onClick={saveSettings} disabled={saving || !hasChanges}>
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button variant="outline" onClick={fetchSettings}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI Phone Agent</h1>
          <p className="text-sm text-muted-foreground">Configure your AI-powered phone assistant</p>
        </div>
        {saveButton}
      </div>

        {/* Status Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${settings.is_active ? TONE.green : TONE.gray}`}>
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Phone Agent Status</h2>
                  <p className="text-muted-foreground">
                    {settings.phone_number || 'No phone number configured'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {settings.is_active ? 'Active' : 'Inactive'}
                </span>
                <Switch
                  checked={settings.is_active}
                  onCheckedChange={(checked) => updateSetting('is_active', checked)}
                  aria-label="Phone agent active"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Settings
            </CardTitle>
            <CardDescription>
              Choose the voice and personality for your AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agent_name">Agent Name</Label>
              <Input
                id="agent_name"
                value={settings.agent_name}
                onChange={(e) => updateSetting('agent_name', e.target.value)}
                placeholder="e.g., Axleyard"
              />
              <p className="text-xs text-muted-foreground">
                The name the agent uses to identify itself
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={settings.voice}
                onValueChange={(value) => updateSetting('voice', value)}
              >
                <SelectTrigger id="voice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.label}</span>
                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                xAI Grok voices - each has a unique personality
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={settings.phone_number || ''}
                onChange={(e) => updateSetting('phone_number', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-muted-foreground">
                The LiveKit phone number for incoming calls
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Greeting Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Greeting Message
            </CardTitle>
            <CardDescription>
              The first thing the AI says when someone calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              aria-label="Greeting message"
              value={settings.greeting_message}
              onChange={(e) => updateSetting('greeting_message', e.target.value)}
              rows={3}
              placeholder="Hello! Thanks for calling..."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Keep it concise - this plays immediately when the call connects
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Instructions
            </CardTitle>
            <CardDescription>
              Define the agent&apos;s personality, knowledge, and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              aria-label="AI instructions"
              value={settings.instructions}
              onChange={(e) => updateSetting('instructions', e.target.value)}
              rows={15}
              placeholder="You are a helpful AI assistant..."
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This is the system prompt that guides the AI&apos;s responses. Include your business context,
              products/services, and how you want it to handle different situations.
            </p>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Advanced Settings
            </CardTitle>
            <CardDescription>
              Fine-tune the AI model behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={settings.model}
                onValueChange={(value) => updateSetting('model', value)}
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grok-4-1-fast-non-reasoning">Grok 4.1 Fast (Recommended)</SelectItem>
                  <SelectItem value="grok-4-1-fast-reasoning">Grok 4.1 Fast Reasoning</SelectItem>
                  <SelectItem value="grok-3-mini">Grok 3 Mini (Legacy)</SelectItem>
                  <SelectItem value="grok-2-public">Grok 2 (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Temperature: {settings.temperature}</Label>
                <span className="text-xs text-muted-foreground">
                  {settings.temperature < 0.3 ? 'More focused' : settings.temperature > 0.7 ? 'More creative' : 'Balanced'}
                </span>
              </div>
              <Slider
                aria-label="Temperature"
                value={[settings.temperature]}
                onValueChange={([value]) => updateSetting('temperature', value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower = more consistent responses, Higher = more varied/creative
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save again at the bottom — the header button is a long scroll away */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(settings.updated_at).toLocaleString()}
          </p>
          {saveButton}
        </div>
    </div>
  );
}

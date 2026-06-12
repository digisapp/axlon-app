'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { csrfFetch } from '@/lib/csrf-fetch';
import {
  Camera, Search, FileText, DollarSign,
  CheckCircle2, Loader2, AlertCircle, Edit3,
  ChevronRight, Sparkles,
} from 'lucide-react';

interface StepResult {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
}

interface ManufacturerMatch {
  name: string;
  manufacturer: string;
  category: string;
  subcategory: string | null;
  product_url: string;
}

interface ListingDraft {
  title: string;
  description: string;
  make: string;
  model: string;
  condition: string;
  specs: Record<string, string>;
  suggested_price: number;
  price_range: { low: number; high: number };
  market_trend: string;
  pricing_factors: string[];
  confidence: number;
  tags: string[];
  damage_detected: boolean;
  damage_areas: string[];
  manufacturer_match: ManufacturerMatch | null;
  image_urls: string[];
}

interface ListingWizardProps {
  onComplete?: (draft: ListingDraft) => void;
  onCancel?: () => void;
}

const STEP_CONFIG = [
  { key: 'analyze_images', label: 'Analyzing Photos', icon: Camera, description: 'Detecting equipment type, make, model, and condition' },
  { key: 'match_specs', label: 'Matching Specs', icon: Search, description: 'Finding manufacturer specs from our catalog' },
  { key: 'generate_description', label: 'Writing Description', icon: FileText, description: 'Creating a professional listing description' },
  { key: 'estimate_price', label: 'Estimating Price', icon: DollarSign, description: 'Analyzing market data for pricing' },
];

export function ListingWizard({ onComplete, onCancel }: ListingWizardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  const addImage = useCallback(() => {
    const url = imageInput.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls(prev => [...prev, url]);
      setImageInput('');
    }
  }, [imageInput, imageUrls]);

  const removeImage = useCallback((index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const startProcessing = useCallback(async () => {
    if (imageUrls.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setDraft(null);
    setSteps(STEP_CONFIG.map(s => ({ name: s.key, status: 'pending' as const })));

    // Simulate progressive step updates
    const updateStep = (index: number, status: StepResult['status']) => {
      setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
    };

    // Show steps progressing
    updateStep(0, 'running');

    try {
      const response = await csrfFetch('/api/agents/listing-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing draft');
      }

      const data = await response.json();

      // Update steps from response
      if (data.steps) {
        setSteps(data.steps);
      }

      if (data.success && data.draft) {
        setDraft(data.draft);
        setEditedTitle(data.draft.title);
        setEditedDescription(data.draft.description);
        setEditedPrice(data.draft.suggested_price.toString());
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrls]);

  const handlePublish = useCallback(() => {
    if (!draft) return;

    const finalDraft: ListingDraft = {
      ...draft,
      title: editedTitle || draft.title,
      description: editedDescription || draft.description,
      suggested_price: parseFloat(editedPrice) || draft.suggested_price,
    };

    onComplete?.(finalDraft);
  }, [draft, editedTitle, editedDescription, editedPrice, onComplete]);

  // ── Image Upload Phase ────────────────────────────────────────
  if (!isProcessing && !draft) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Smart Listing Creator</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Upload photos and our AI will detect the equipment, pull manufacturer specs,
            write a description, and suggest a price.
          </p>

          {/* Image URL Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              placeholder="Paste image URL..."
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={addImage} variant="outline" size="sm">
              Add
            </Button>
          </div>

          {/* Image Preview */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group aspect-video bg-muted rounded-lg overflow-hidden">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <Badge className="absolute bottom-2 left-2" variant="secondary">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={startProcessing}
              disabled={imageUrls.length === 0}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Listing ({imageUrls.length} photo{imageUrls.length !== 1 ? 's' : ''})
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Processing Phase ──────────────────────────────────────────
  if (isProcessing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Creating Your Listing...</h2>

          <div className="space-y-4">
            {STEP_CONFIG.map((config, i) => {
              const step = steps[i];
              const status = step?.status || 'pending';

              return (
                <div
                  key={config.key}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    status === 'running' ? 'border-primary bg-primary/5' :
                    status === 'completed' ? 'border-green-500/30 bg-green-50' :
                    status === 'failed' ? 'border-red-500/30 bg-red-50' :
                    'border-muted'
                  }`}
                >
                  <div className="mt-0.5">
                    {status === 'running' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                    {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {status === 'pending' && <config.icon className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className={`font-medium ${status === 'pending' ? 'text-muted-foreground' : ''}`}>
                      {config.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Draft Review Phase ────────────────────────────────────────
  if (draft) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Review Your Listing</h2>
            <Badge variant="outline" className="text-green-600 border-green-600">
              AI Generated
            </Badge>
          </div>

          {/* Steps Summary */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {STEP_CONFIG.map((config, i) => {
              const step = steps[i];
              return (
                <Badge
                  key={config.key}
                  variant={step?.status === 'completed' ? 'default' : 'destructive'}
                  className="whitespace-nowrap"
                >
                  {step?.status === 'completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Image Preview */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {draft.image_urls.map((url, i) => (
              <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
            ))}
          </div>

          {/* Editable Title */}
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Manufacturer Match */}
          {draft.manufacturer_match && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Matched to: {draft.manufacturer_match.name} by {draft.manufacturer_match.manufacturer}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {draft.manufacturer_match.category}
                {draft.manufacturer_match.subcategory && ` › ${draft.manufacturer_match.subcategory}`}
                {' · '}
                {Object.keys(draft.specs).length} specs auto-filled
              </p>
            </div>
          )}

          {/* Editable Description */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <button
                onClick={() => {
                  setEditingDescription(!editingDescription);
                  if (!editingDescription) setEditedDescription(draft.description);
                }}
                className="text-xs text-primary flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {editingDescription ? 'Done' : 'Edit'}
              </button>
            </div>
            {editingDescription ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                {editedDescription || draft.description}
              </p>
            )}
          </div>

          {/* Specs Grid */}
          {Object.keys(draft.specs).length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Specifications</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(draft.specs).slice(0, 12).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm bg-muted/50 px-3 py-1.5 rounded">
                    <span className="text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-muted-foreground">Suggested Price</label>
              <Badge variant="outline">
                {Math.round(draft.confidence * 100)}% confidence · Market {draft.market_trend}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-lg text-muted-foreground">$</span>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="text-2xl font-bold w-40 border-b-2 border-primary focus:outline-none bg-transparent"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                Range: ${draft.price_range.low.toLocaleString()} — ${draft.price_range.high.toLocaleString()}
              </span>
            </div>
            {draft.pricing_factors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {draft.pricing_factors.map((factor, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{factor}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Damage Warning */}
          {draft.damage_detected && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <p className="font-medium text-amber-800">Damage Detected</p>
              <p className="text-amber-700">{draft.damage_areas.join(', ')}</p>
            </div>
          )}

          {/* Tags */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-1">
              {draft.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handlePublish} className="flex-1">
              <ChevronRight className="w-4 h-4 mr-2" />
              Use This Draft
            </Button>
            <Button variant="outline" onClick={() => { setDraft(null); setSteps([]); }}>
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

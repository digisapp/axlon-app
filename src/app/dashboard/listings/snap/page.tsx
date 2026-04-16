'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { compressImage, formatFileSize } from '@/lib/upload-utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Camera,
  Images,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Sparkles,
  Check,
  RotateCcw,
  Video,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

// ─── Types ─────────────────────────────────────────

interface SnapPhoto {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'compressing' | 'uploading' | 'done' | 'error';
  progress: number;
  uploadedUrl?: string;
  error?: string;
  aiAnalysis?: {
    detected_type?: string;
    detected_make?: string;
    detected_model?: string;
    suggested_tags?: string[];
  };
}

type Step = 'capture' | 'processing' | 'details';

// ─── Page Component ────────────────────────────────

export default function SnapListPage() {
  const router = useRouter();
  const supabase = createClient();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('capture');
  const [photos, setPhotos] = useState<SnapPhoto[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // AI-detected details
  const [aiMake, setAiMake] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [aiType, setAiType] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('used');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const { location, loading: geoLoading, detect: detectLocation } = useGeolocation();

  // Auto-detect location on details step
  useEffect(() => {
    if (step === 'details' && !city && !state) {
      detectLocation();
    }
  }, [step]);

  // Fill in location when detected
  useEffect(() => {
    if (location) {
      if (!city) setCity(location.city);
      if (!state) setState(location.state);
      if (!zipCode) setZipCode(location.zip);
    }
  }, [location]);

  // Auto-generate title from AI detection
  useEffect(() => {
    if (step === 'details' && !title && (aiMake || aiModel || aiType)) {
      const parts = [year, aiMake, aiModel].filter(Boolean);
      if (parts.length > 0) {
        setTitle(parts.join(' '));
      } else if (aiType) {
        setTitle(aiType);
      }
    }
  }, [step, aiMake, aiModel, aiType, year]);

  // ─── Photo Capture ──────────────────────────────

  const addPhotos = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = 20 - photos.length;
    const toAdd = fileArray.slice(0, remaining);

    if (toAdd.length === 0) {
      toast.error('Maximum 20 photos');
      return;
    }

    const newPhotos: SnapPhoto[] = toAdd.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  }, [photos.length]);

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addPhotos(e.target.files);
    e.target.value = '';
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video must be under 500MB');
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  // ─── Process & Upload ──────────────────────────

  const processPhotos = async () => {
    if (photos.length === 0) {
      toast.error('Take at least one photo');
      return;
    }

    setStep('processing');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in');
      router.push('/login');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Process each photo: compress → upload → AI analyze
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];

      // Compress
      setPhotos(prev => prev.map(p =>
        p.id === photo.id ? { ...p, status: 'compressing' } : p
      ));

      let compressed: File;
      try {
        compressed = await compressImage(photo.file);
      } catch {
        compressed = photo.file;
      }

      // Upload with XHR
      setPhotos(prev => prev.map(p =>
        p.id === photo.id ? { ...p, status: 'uploading', progress: 0 } : p
      ));

      const ext = compressed.type === 'image/webp' ? 'webp' : (photo.file.name.split('.').pop() || 'jpg');
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/listing-images/${fileName}`;

      try {
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', uploadUrl, true);
          xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
          xhr.setRequestHeader('x-upsert', 'false');
          xhr.setRequestHeader('Cache-Control', '3600');

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setPhotos(prev => prev.map(p =>
                p.id === photo.id ? { ...p, progress: pct } : p
              ));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${fileName}`);
            } else {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(compressed);
        });

        setPhotos(prev => prev.map(p =>
          p.id === photo.id ? { ...p, status: 'done', progress: 100, uploadedUrl: url } : p
        ));

        // AI analyze first photo only (to get make/model/type)
        if (i === 0) {
          try {
            const aiRes = await csrfFetch('/api/ai/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: url }),
            });
            if (aiRes.ok) {
              const { data } = await aiRes.json();
              setAiMake(data.detected_make || '');
              setAiModel(data.detected_model || '');
              setAiType(data.detected_type || '');
              setPhotos(prev => prev.map(p =>
                p.id === photo.id ? { ...p, aiAnalysis: data } : p
              ));
            }
          } catch {
            // Non-fatal
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setPhotos(prev => prev.map(p =>
          p.id === photo.id ? { ...p, status: 'error', error: msg } : p
        ));
      }
    }

    // Move to details step
    setStep('details');
  };

  // ─── Publish Listing ──────────────────────────

  const handlePublish = async (status: 'active' | 'draft') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsPublishing(true);

    try {
      // Upload video if present
      let videoUrl = '';
      if (videoFile) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const ext = videoFile.name.split('.').pop() || 'mp4';
          const fileName = `videos/snap-${Date.now()}.${ext}`;
          const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/listings/${fileName}`;

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', uploadUrl, true);
            xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
            xhr.setRequestHeader('x-upsert', 'false');
            xhr.onload = () => xhr.status < 300 ? resolve() : reject();
            xhr.onerror = () => reject();
            xhr.send(videoFile);
          });

          const { data: urlData } = supabase.storage.from('listings').getPublicUrl(fileName);
          videoUrl = urlData.publicUrl;
        }
      }

      // Create listing
      const res = await csrfFetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          price: price ? parseFloat(price) : null,
          condition: condition || null,
          year: year ? parseInt(year) : null,
          make: aiMake || null,
          model: aiModel || null,
          description: description || null,
          city: city || null,
          state: state || null,
          zip_code: zipCode || null,
          video_url: videoUrl || null,
          listing_type: 'sale',
          status,
          published_at: status === 'active' ? new Date().toISOString() : null,
        }),
      });

      if (!res.ok) {
        toast.error('Failed to create listing');
        setIsPublishing(false);
        return;
      }

      const { data: listing } = await res.json();

      // Save images
      const uploadedPhotos = photos.filter(p => p.uploadedUrl);
      if (uploadedPhotos.length > 0) {
        await csrfFetch(`/api/listings/${listing.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: uploadedPhotos.map((p, i) => ({
              url: p.uploadedUrl,
              is_primary: i === 0,
              sort_order: i,
              ai_analysis: p.aiAnalysis || null,
            })),
          }),
        });
      }

      toast.success(status === 'active' ? 'Listing published!' : 'Draft saved!');
      router.push(`/dashboard/listings/${listing.id}/edit`);
    } catch (error) {
      logger.error('Snap & List publish error', { error });
      toast.error('Something went wrong');
    } finally {
      setIsPublishing(false);
    }
  };

  // ═══════════════════════════════════════════════════
  // STEP 1: CAPTURE
  // ═══════════════════════════════════════════════════

  if (step === 'capture') {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Snap & List</h1>
              <p className="text-xs text-muted-foreground">Take photos of your equipment</p>
            </div>
            {photos.length > 0 && (
              <Button onClick={processPhotos} className="gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Camera / Gallery Buttons */}
          <div className="flex gap-3">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleVideoInput}
              className="hidden"
            />

            <Button
              size="lg"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 h-16 gap-3 text-base"
            >
              <Camera className="w-6 h-6" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => galleryInputRef.current?.click()}
              className="flex-1 h-16 gap-3 text-base"
            >
              <Images className="w-6 h-6" />
              Gallery
            </Button>
          </div>

          {/* Video capture button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => videoInputRef.current?.click()}
            className="w-full h-14 gap-3"
          >
            <Video className="w-5 h-5" />
            {videoPreview ? 'Change Video' : 'Record Walk-Around Video'}
          </Button>

          {/* Video preview */}
          {videoPreview && (
            <div className="relative rounded-lg overflow-hidden">
              <video src={videoPreview} controls className="w-full aspect-video object-contain bg-black" preload="metadata" />
              <button
                onClick={() => { setVideoFile(null); if (videoPreview) URL.revokeObjectURL(videoPreview); setVideoPreview(null); }}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Photo Grid */}
          {photos.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">Tap X to remove</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={photo.previewUrl} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {photos.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Start snapping photos</h3>
                <p className="text-sm text-muted-foreground">
                  Walk around your equipment and take photos from all angles.
                  <br />We&apos;ll compress them automatically for fast upload.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // STEP 2: PROCESSING
  // ═══════════════════════════════════════════════════

  if (step === 'processing') {
    const doneCount = photos.filter(p => p.status === 'done').length;
    const totalProgress = photos.length > 0
      ? Math.round(photos.reduce((acc, p) => acc + (p.status === 'done' ? 100 : p.progress), 0) / photos.length)
      : 0;

    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <Sparkles className="w-10 h-10 absolute inset-0 m-auto text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Processing your photos</h2>
            <p className="text-sm text-muted-foreground">
              Compressing & uploading {doneCount}/{photos.length}
            </p>
          </div>
          <Progress value={totalProgress} className="h-2" />

          {/* Photo status grid */}
          <div className="grid grid-cols-5 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded overflow-hidden bg-muted">
                <Image src={photo.previewUrl} alt="" fill className="object-cover" unoptimized />
                <div className={`absolute inset-0 flex items-center justify-center ${
                  photo.status === 'done' ? 'bg-green-500/40' :
                  photo.status === 'error' ? 'bg-red-500/40' :
                  'bg-black/40'
                }`}>
                  {photo.status === 'done' && <Check className="w-5 h-5 text-white" />}
                  {photo.status === 'error' && <X className="w-5 h-5 text-white" />}
                  {(photo.status === 'compressing' || photo.status === 'uploading') && (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // STEP 3: QUICK DETAILS
  // ═══════════════════════════════════════════════════

  const successCount = photos.filter(p => p.uploadedUrl).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep('capture')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Listing Details</h1>
            <p className="text-xs text-muted-foreground">
              {successCount} photo{successCount !== 1 ? 's' : ''} ready
              {aiMake && ` · AI detected: ${aiMake} ${aiModel}`}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Photo strip */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.filter(p => p.uploadedUrl).map((photo, i) => (
            <div key={photo.id} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <Image src={photo.previewUrl} alt="" fill className="object-cover" unoptimized />
              {i === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-primary text-primary-foreground text-[9px] text-center py-0.5 font-medium">
                  Primary
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => setStep('capture')}
            className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] mt-1">Add more</span>
          </button>
        </div>

        {/* Quick form */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2019 Trail King TK110HDG Lowboy"
                required
              />
              {aiMake && !title && (
                <p className="text-xs text-muted-foreground mt-1">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI suggestion: {[year, aiMake, aiModel].filter(Boolean).join(' ') || aiType}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="certified">Certified Pre-Owned</SelectItem>
                  <SelectItem value="salvage">Salvage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your equipment..."
                rows={4}
              />
            </div>

            {/* Location with auto-detect */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Location</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={detectLocation}
                  disabled={geoLoading}
                  className="h-7 text-xs gap-1"
                >
                  {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                  Auto-detect
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  maxLength={2}
                />
                <Input
                  placeholder="ZIP"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publish buttons */}
        <div className="flex gap-3 pb-8">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handlePublish('draft')}
            disabled={isPublishing}
          >
            Save Draft
          </Button>
          <Button
            className="flex-1"
            onClick={() => handlePublish('active')}
            disabled={isPublishing || !title.trim()}
          >
            {isPublishing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
            ) : (
              'Publish Listing'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

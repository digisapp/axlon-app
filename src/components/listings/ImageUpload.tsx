'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { compressImage, formatFileSize } from '@/lib/upload-utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  X,
  Star,
  Loader2,
  ImageIcon,
  GripVertical,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Camera,
  Images,
  RotateCcw,
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface AIAnalysis {
  detected_type?: string;
  detected_make?: string;
  detected_model?: string;
  damage_detected: boolean;
  damage_areas?: string[];
  quality_score: number;
  suggested_tags: string[];
  is_valid_equipment_photo: boolean;
}

export interface UploadedImage {
  id?: string;
  url: string;
  thumbnail_url?: string;
  is_primary: boolean;
  sort_order: number;
  file?: File;
  uploading?: boolean;
  uploadProgress?: number;
  compressing?: boolean;
  error?: string;
  ai_analysis?: AIAnalysis;
  analyzing?: boolean;
}

interface ImageUploadProps {
  listingId?: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  onAIDetection?: (data: { make?: string; model?: string; type?: string; tags?: string[] }) => void;
  maxImages?: number;
}

const MAX_CONCURRENT = 3;

export function ImageUpload({
  listingId,
  images,
  onChange,
  onAIDetection,
  maxImages = 20,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const supabase = createClient();

  // ─── AI Analysis ────────────────────────────────────

  const analyzeImageWithAI = async (imageUrl: string, imageIndex: number) => {
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        const { data } = await response.json();

        onChange(images.map((img, idx) =>
          idx === imageIndex
            ? { ...img, ai_analysis: data, analyzing: false }
            : img
        ));

        if (imageIndex === 0 && onAIDetection) {
          onAIDetection({
            make: data.detected_make,
            model: data.detected_model,
            type: data.detected_type,
            tags: data.suggested_tags,
          });
        }
      }
    } catch (error) {
      logger.error('AI analysis failed', { error });
      onChange(images.map((img, idx) =>
        idx === imageIndex ? { ...img, analyzing: false } : img
      ));
    }
  };

  // ─── Upload Single Image with XHR Progress ─────────

  const uploadSingleImage = async (
    file: File,
    index: number,
    currentImages: UploadedImage[]
  ): Promise<UploadedImage[]> => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`"${file.name}" is not a supported format`);
      currentImages = currentImages.map((img, idx) =>
        idx === index ? { ...img, uploading: false, error: 'Unsupported format' } : img
      );
      onChange(currentImages);
      return currentImages;
    }

    // Step 1: Compress
    currentImages = currentImages.map((img, idx) =>
      idx === index ? { ...img, compressing: true, uploading: false } : img
    );
    onChange(currentImages);

    let compressed: File;
    try {
      compressed = await compressImage(file);
    } catch {
      compressed = file; // Fall back to original on compression failure
    }

    currentImages = currentImages.map((img, idx) =>
      idx === index ? { ...img, compressing: false, uploading: true, uploadProgress: 0 } : img
    );
    onChange(currentImages);

    // Step 2: Upload with XHR for progress
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      currentImages = currentImages.map((img, idx) =>
        idx === index ? { ...img, uploading: false, error: 'Not authenticated' } : img
      );
      onChange(currentImages);
      return currentImages;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      currentImages = currentImages.map((img, idx) =>
        idx === index ? { ...img, uploading: false, error: 'No session' } : img
      );
      onChange(currentImages);
      return currentImages;
    }

    const ext = compressed.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg');
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
            currentImages = currentImages.map((img, idx) =>
              idx === index ? { ...img, uploadProgress: pct } : img
            );
            onChange(currentImages);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${fileName}`;
            resolve(publicUrl);
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(compressed);
      });

      // Success — update with final URL
      URL.revokeObjectURL(currentImages[index].url);
      currentImages = currentImages.map((img, idx) =>
        idx === index
          ? { ...img, url, uploading: false, uploadProgress: 100, compressing: false, file: undefined, error: undefined, analyzing: true }
          : img
      );
      onChange(currentImages);

      // Trigger AI analysis (first 3 images only)
      if (index < 3) {
        analyzeImageWithAI(url, index);
      } else {
        currentImages = currentImages.map((img, idx) =>
          idx === index ? { ...img, analyzing: false } : img
        );
        onChange(currentImages);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      logger.error('Upload error', { error: err });
      currentImages = currentImages.map((img, idx) =>
        idx === index ? { ...img, uploading: false, compressing: false, error: msg } : img
      );
      onChange(currentImages);
    }

    return currentImages;
  };

  // ─── Handle Files (batch with concurrency) ─────────

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    if (filesToUpload.length < fileArray.length) {
      toast.info(`Only uploading ${filesToUpload.length} of ${fileArray.length} images (limit: ${maxImages})`);
    }

    // Create preview entries
    const newImages: UploadedImage[] = filesToUpload.map((file, i) => ({
      url: URL.createObjectURL(file),
      is_primary: images.length === 0 && i === 0,
      sort_order: images.length + i,
      file,
      uploading: true,
      uploadProgress: 0,
      compressing: false,
    }));

    let currentImages = [...images, ...newImages];
    onChange(currentImages);

    const totalSaved = filesToUpload.reduce((acc, f) => acc + f.size, 0);

    // Upload with concurrency control
    const startIdx = images.length;
    for (let i = 0; i < filesToUpload.length; i += MAX_CONCURRENT) {
      const batch = filesToUpload.slice(i, i + MAX_CONCURRENT);
      const promises = batch.map((file, j) =>
        uploadSingleImage(file, startIdx + i + j, currentImages)
      );
      const results = await Promise.all(promises);
      // Merge results — take the latest state
      if (results.length > 0) {
        currentImages = results[results.length - 1];
      }
    }

    const successCount = currentImages.filter((img, idx) => idx >= startIdx && !img.error && !img.uploading).length;
    if (successCount > 0) {
      toast.success(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded`);
    }
  }, [images, maxImages, onChange, supabase]);

  // ─── Retry Failed Upload ───────────────────────────

  const retryUpload = useCallback(async (index: number) => {
    const image = images[index];
    if (!image?.file) return;

    let currentImages = images.map((img, idx) =>
      idx === index ? { ...img, error: undefined, uploading: true, uploadProgress: 0 } : img
    );
    onChange(currentImages);
    await uploadSingleImage(image.file, index, currentImages);
  }, [images, onChange, supabase]);

  // ─── Drag & Drop Handlers ─────────────────────────

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [handleFiles]);

  // ─── Image Management ─────────────────────────────

  const removeImage = useCallback((index: number) => {
    let updated = images.filter((_, i) => i !== index);
    if (images[index]?.is_primary && updated.length > 0) {
      updated = updated.map((img, i) => ({ ...img, is_primary: i === 0 }));
    }
    onChange(updated.map((img, i) => ({ ...img, sort_order: i })));
  }, [images, onChange]);

  const setPrimary = useCallback((index: number) => {
    onChange(images.map((img, i) => ({ ...img, is_primary: i === index })));
  }, [images, onChange]);

  const atLimit = images.length >= maxImages;
  const uploadingCount = images.filter(i => i.uploading || i.compressing).length;

  return (
    <div className="space-y-4">
      {/* ─── Drop Zone ──────────────────────────────── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${atLimit ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={atLimit}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
          disabled={atLimit}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-muted rounded-full">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">
              {isDragging ? 'Drop images here' : 'Upload equipment photos'}
            </p>
            <p className="text-sm text-muted-foreground">
              {images.length}/{maxImages} images
              {uploadingCount > 0 && ` · ${uploadingCount} uploading`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {isMobile && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                disabled={atLimit}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>
            )}
            <Button
              type="button"
              variant={isMobile ? 'outline' : 'default'}
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={atLimit}
              className="gap-2"
            >
              <Images className="w-4 h-4" />
              {isMobile ? 'Choose from Gallery' : 'Browse Files'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Photos are auto-compressed for fast upload · JPEG, PNG, WebP, HEIC
          </p>
        </div>
      </div>

      {/* ─── Image Grid ─────────────────────────────── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id || image.url}
              className={`
                relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group
                ${image.is_primary ? 'ring-2 ring-primary' : ''}
                ${image.error ? 'ring-2 ring-destructive' : ''}
              `}
            >
              {/* Thumbnail */}
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                fill
                className={`object-cover ${(image.uploading || image.compressing || image.analyzing) ? 'opacity-50' : ''}`}
                unoptimized
              />

              {/* ─── Upload/Compress Progress Overlay ──── */}
              {(image.compressing || image.uploading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <Loader2 className="w-6 h-6 animate-spin text-white mb-2" />
                  <span className="text-xs text-white font-medium">
                    {image.compressing ? 'Compressing...' : `Uploading ${image.uploadProgress || 0}%`}
                  </span>
                  {image.uploading && (
                    <div className="w-3/4 mt-2">
                      <Progress value={image.uploadProgress || 0} className="h-1.5" />
                    </div>
                  )}
                </div>
              )}

              {/* ─── AI Analyzing Overlay ──────────────── */}
              {image.analyzing && !image.uploading && !image.compressing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  <span className="text-xs text-white mt-1">AI Analyzing...</span>
                </div>
              )}

              {/* ─── Error Overlay ─────────────────────── */}
              {image.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  <AlertTriangle className="w-6 h-6 text-destructive mb-1" />
                  <span className="text-xs text-white mb-2">{image.error}</span>
                  {image.file && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => retryUpload(index)}
                      className="h-7 text-xs gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Retry
                    </Button>
                  )}
                </div>
              )}

              {/* AI Analysis Badges */}
              {image.ai_analysis && !image.uploading && !image.analyzing && !image.error && (
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                  {image.ai_analysis.damage_detected && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      <AlertTriangle className="w-3 h-3 mr-0.5" />
                      Damage
                    </Badge>
                  )}
                  {image.ai_analysis.quality_score >= 0.8 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-0.5" />
                      HQ
                    </Badge>
                  )}
                  {image.ai_analysis.detected_make && index === 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      {image.ai_analysis.detected_make}
                    </Badge>
                  )}
                </div>
              )}

              {/* Hover Controls */}
              {!image.uploading && !image.compressing && !image.error && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setPrimary(index)}
                    title="Set as primary"
                  >
                    <Star className={`w-4 h-4 ${image.is_primary ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => removeImage(index)}
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Primary Badge */}
              {image.is_primary && !image.error && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Primary
                </div>
              )}

              {/* Sort Handle */}
              {!image.uploading && !image.compressing && !image.error && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 bg-white/80 rounded cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No images uploaded yet. Add photos to make your listing stand out!
          </p>
        </div>
      )}
    </div>
  );
}

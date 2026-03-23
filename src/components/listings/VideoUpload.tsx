'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/useIsMobile';
import { formatFileSize } from '@/lib/upload-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Upload,
  X,
  Link as LinkIcon,
  Loader2,
  Play,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  listingId?: string;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB (up from 100MB)
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

export function VideoUpload({ value, onChange, listingId }: VideoUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const supabase = createClient();

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
    setError(null);
  };

  const uploadVideo = async (file: File) => {
    setError(null);
    setFileSize(file.size);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload MP4, WebM, MOV, or AVI');
      return;
    }

    // Validate size
    if (file.size > MAX_VIDEO_SIZE) {
      setError(`Video must be under ${formatFileSize(MAX_VIDEO_SIZE)}. Your file is ${formatFileSize(file.size)}.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const fileName = `${listingId || 'temp'}-${Date.now()}.${ext}`;
      const filePath = `videos/${fileName}`;

      // Get auth for XHR upload with progress
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/listings/${filePath}`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl, true);
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.setRequestHeader('Cache-Control', '3600');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed (${xhr.status})`));
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(file);
      });

      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      setPreviewUrl(urlData.publicUrl);
      setUploadProgress(100);
    } catch (err) {
      logger.error('Video upload error', { error: err });
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadVideo(file);
    e.target.value = '';
  };

  const handleRemove = async () => {
    if (previewUrl && previewUrl.includes('supabase')) {
      try {
        const path = previewUrl.split('/listings/')[1];
        if (path) {
          await supabase.storage.from('listings').remove([path]);
        }
      } catch (err) {
        logger.error('Delete error', { error: err });
      }
    }

    onChange('');
    setPreviewUrl(null);
    setError(null);
    setFileSize(null);
  };

  const isEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className="flex-1"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          YouTube/Vimeo URL
        </Button>
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div>
          <Label htmlFor="video_url">Video URL</Label>
          <Input
            id="video_url"
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste a YouTube or Vimeo video link
          </p>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div>
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!previewUrl && !isUploading && (
            <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <Video className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">Record or upload a walk-around video</p>
              <p className="text-sm text-muted-foreground mb-4">
                MP4, WebM, MOV (max 500MB)
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {isMobile && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => cameraInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Record Video
                  </Button>
                )}
                <Button
                  type="button"
                  variant={isMobile ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isMobile ? 'Choose from Gallery' : 'Browse Files'}
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <Loader2 className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
              <p className="font-medium">Uploading video...</p>
              {fileSize && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(fileSize)} · {uploadProgress}%
                </p>
              )}
              <Progress value={uploadProgress} className="mt-4 max-w-xs mx-auto" />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Preview */}
      {previewUrl && !isUploading && (
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {isEmbeddable(previewUrl) ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {previewUrl.includes('youtube') ? 'YouTube' : 'Vimeo'} video linked
                  </p>
                </div>
              </div>
            ) : (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tips */}
      {!previewUrl && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-2">Video Tips</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>Keep it 30-60 seconds — walk around the equipment</li>
            <li>Show exterior, interior, engine, and any damage</li>
            <li>Good lighting and landscape orientation work best</li>
            <li>Videos are uploaded at full quality</li>
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage, formatFileSize } from '@/lib/upload-utils';

export type UploadStatus = 'pending' | 'compressing' | 'uploading' | 'done' | 'error';

export interface UploadItem {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  status: UploadStatus;
  progress: number; // 0-100
  url?: string;
  error?: string;
  previewUrl: string;
  retryCount: number;
}

interface UseUploadQueueOptions {
  bucket?: string;
  maxConcurrent?: number;
  maxRetries?: number;
  onFileUploaded?: (item: UploadItem) => void;
}

export function useUploadQueue(options: UseUploadQueueOptions = {}) {
  const {
    bucket = 'listing-images',
    maxConcurrent = 3,
    maxRetries = 3,
    onFileUploaded,
  } = options;

  const [items, setItems] = useState<UploadItem[]>([]);
  const activeCountRef = useRef(0);
  const queueRef = useRef<UploadItem[]>([]);
  const supabase = createClient();

  const updateItem = useCallback((id: string, updates: Partial<UploadItem>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const processNext = useCallback(async () => {
    if (activeCountRef.current >= maxConcurrent) return;

    const next = queueRef.current.find(i => i.status === 'pending');
    if (!next) return;

    // Claim the item synchronously before the first await — concurrent
    // processNext calls would otherwise all pick this same pending item and
    // upload it multiple times
    next.status = 'compressing';

    activeCountRef.current++;
    const itemId = next.id;

    try {
      // Step 1: Compress
      updateItem(itemId, { status: 'compressing', progress: 0 });

      const compressed = await compressImage(next.file);
      const compressedSize = compressed.size;

      updateItem(itemId, {
        status: 'uploading',
        progress: 0,
        compressedSize,
      });

      // Update queue ref
      const queueItem = queueRef.current.find(i => i.id === itemId);
      if (queueItem) queueItem.status = 'uploading';

      // Step 2: Get auth token for XHR upload
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Step 3: Upload with XHR for progress tracking
      const ext = compressed.type === 'image/webp' ? 'webp' : compressed.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0];
      const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`;

      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl, true);
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.setRequestHeader('Cache-Control', '3600');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            updateItem(itemId, { progress: pct });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
            resolve(publicUrl);
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(compressed);
      });

      // Success
      updateItem(itemId, { status: 'done', progress: 100, url });
      const qItem = queueRef.current.find(i => i.id === itemId);
      if (qItem) {
        qItem.status = 'done';
        qItem.url = url;
        onFileUploaded?.({ ...qItem, url, status: 'done', progress: 100 });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      updateItem(itemId, { status: 'error', error: msg });
      const qItem = queueRef.current.find(i => i.id === itemId);
      if (qItem) qItem.status = 'error';
    } finally {
      activeCountRef.current--;
      // Process next in queue
      processNext();
    }
  }, [bucket, maxConcurrent, supabase, updateItem, onFileUploaded]);

  const addFiles = useCallback((files: File[]) => {
    const newItems: UploadItem[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      file,
      originalSize: file.size,
      status: 'pending' as UploadStatus,
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      retryCount: 0,
    }));

    queueRef.current = [...queueRef.current, ...newItems];
    setItems(prev => [...prev, ...newItems]);

    // Kick off processing
    for (let i = 0; i < maxConcurrent; i++) {
      processNext();
    }
  }, [maxConcurrent, processNext]);

  const retryFile = useCallback((id: string) => {
    const item = queueRef.current.find(i => i.id === id);
    if (!item || item.retryCount >= maxRetries) return;

    item.status = 'pending';
    item.retryCount++;
    updateItem(id, { status: 'pending', progress: 0, error: undefined });
    processNext();
  }, [maxRetries, updateItem, processNext]);

  const removeFile = useCallback((id: string) => {
    const item = queueRef.current.find(i => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.previewUrl);
    }
    queueRef.current = queueRef.current.filter(i => i.id !== id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    queueRef.current = queueRef.current.filter(i => i.status !== 'done');
    setItems(prev => prev.filter(i => i.status !== 'done'));
  }, []);

  const isUploading = items.some(i => i.status === 'compressing' || i.status === 'uploading' || i.status === 'pending');
  const completedCount = items.filter(i => i.status === 'done').length;
  const errorCount = items.filter(i => i.status === 'error').length;

  return {
    items,
    addFiles,
    retryFile,
    removeFile,
    clearCompleted,
    isUploading,
    completedCount,
    errorCount,
    formatFileSize,
  };
}

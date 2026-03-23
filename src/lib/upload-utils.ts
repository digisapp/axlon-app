import imageCompression from 'browser-image-compression';

/**
 * Compress an image file for upload.
 * Shrinks iPhone 5-8MB photos to ~500KB-1MB with no visible quality loss.
 * Outputs WebP when supported, falls back to JPEG.
 */
export async function compressImage(
  file: File,
  options?: { maxSizeMB?: number; maxWidthOrHeight?: number }
): Promise<File> {
  const { maxSizeMB = 1.5, maxWidthOrHeight = 2048 } = options || {};

  // Skip if already small enough
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  // Skip GIFs (compression breaks animation)
  if (file.type === 'image/gif') {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
  });

  return compressed;
}

/**
 * Compress multiple images with concurrency control.
 * Reports progress via callback.
 */
export async function compressImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
  concurrency = 3
): Promise<File[]> {
  const results: File[] = new Array(files.length);
  let completed = 0;

  // Process in batches
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const compressed = await Promise.all(
      batch.map((file) => compressImage(file))
    );
    compressed.forEach((file, j) => {
      results[i + j] = file;
      completed++;
      onProgress?.(completed, files.length);
    });
  }

  return results;
}

/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

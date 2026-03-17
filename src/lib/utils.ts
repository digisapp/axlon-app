import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Return the best available image URL, preferring thumbnail over full URL.
 *  Handles empty-string thumbnail_url (truthy but invalid). */
export function getImageSrc(
  image: { url: string; thumbnail_url?: string | null } | null | undefined,
): string | null {
  if (!image) return null;
  if (image.thumbnail_url && image.thumbnail_url.length > 0) return image.thumbnail_url;
  if (image.url && image.url.length > 0) return image.url;
  return null;
}

/**
 * Image re-hosting helpers shared by all scrapers.
 *
 * Listing images must live in Supabase Storage, never hotlinked from dealer
 * sites — external hosts break silently (imanpro.net started 403-ing all
 * requests in July 2026 and killed 888 listing images at once).
 *
 * No puppeteer dependency so lightweight scrapers can import this directly.
 */
import crypto from 'crypto';

/**
 * Download an image and upload it to the listing-images bucket.
 * Returns the public URL, or null if the image can't be fetched/stored.
 */
export async function downloadAndStoreImage(supabase, imageUrl, listingId, index = 0) {
  try {
    const resp = await fetch(encodeURI(imageUrl.trim()), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': new URL(imageUrl).origin,
      },
    });

    if (!resp.ok) {
      console.warn(`  ⚠ Failed to download image: ${imageUrl} (${resp.status})`);
      return null;
    }

    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const buffer = Buffer.from(await resp.arrayBuffer());

    // Skip tiny images (likely tracking pixels)
    if (buffer.length < 5000) return null;

    const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
    const path = `dealer-imports/${listingId}/${index}-${hash}.${ext}`;

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(path, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn(`  ⚠ Failed to upload image: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(path);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn(`  ⚠ Image pipeline error: ${err.message}`);
    return null;
  }
}

/**
 * Re-host up to `max` images and insert listing_images rows pointing at
 * Supabase Storage. Unfetchable images are skipped (never hotlinked).
 * Returns the number of rows inserted.
 */
export async function insertRehostedImages(supabase, listingId, imageUrls, max = 10) {
  if (!imageUrls || imageUrls.length === 0) return 0;

  let inserted = 0;
  for (let i = 0; i < Math.min(imageUrls.length, max); i++) {
    const url = imageUrls[i];
    if (!url || !url.startsWith('http')) continue;

    const stored = await downloadAndStoreImage(supabase, url, listingId, i);
    if (!stored) continue;

    const { error } = await supabase.from('listing_images').insert({
      listing_id: listingId,
      url: stored,
      thumbnail_url: stored,
      is_primary: inserted === 0,
      sort_order: inserted,
    });

    if (error) {
      console.warn(`  ⚠ Failed to insert image row: ${error.message}`);
      continue;
    }
    inserted++;
  }
  return inserted;
}

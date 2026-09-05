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
    // Only encode if the URL isn't already percent-encoded — blindly running
    // encodeURI() over an already-encoded URL turns %20 into %2520 and 404s it.
    const trimmed = imageUrl.trim();
    const fetchUrl = /%[0-9A-Fa-f]{2}/.test(trimmed) ? trimmed : encodeURI(trimmed);

    // Abort hung dealer hosts instead of blocking the whole run for minutes.
    const resp = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': new URL(imageUrl).origin,
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (!resp.ok) {
      console.warn(`  ⚠ Failed to download image: ${imageUrl} (${resp.status})`);
      return null;
    }

    const contentType = resp.headers.get('content-type') || '';
    // Reject non-image responses (HTML error/challenge pages served with 200)
    // so we never store a text/html blob as a listing photo.
    if (!contentType.startsWith('image/')) {
      console.warn(`  ⚠ Skipping non-image response (${contentType || 'unknown'}): ${imageUrl}`);
      return null;
    }
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const buffer = Buffer.from(await resp.arrayBuffer());

    // Skip tiny images (likely tracking pixels) and absurdly large files.
    if (buffer.length < 5000) return null;
    if (buffer.length > 15_000_000) {
      console.warn(`  ⚠ Skipping oversized image (${buffer.length} bytes): ${imageUrl}`);
      return null;
    }

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

/**
 * Manufacturer catalog images live in the same bucket under
 * manufacturer-products/<productId>/<index>-<hash>.<ext>.
 *
 * Same rules as listing images: browser-like headers, image content-type
 * only, tracking-pixel and oversize guards. Returns the public URL or null.
 * `fetchBuffer` can be swapped for a headless-browser fetcher when an origin
 * refuses plain HTTP clients.
 */
export async function downloadAndStoreManufacturerImage(
  supabase,
  imageUrl,
  productId,
  index = 0,
  { fetchBuffer } = {}
) {
  try {
    const trimmed = imageUrl.trim();
    const fetchUrl = /%[0-9A-Fa-f]{2}/.test(trimmed) ? trimmed : encodeURI(trimmed);

    let buffer;
    let contentType;
    if (fetchBuffer) {
      const result = await fetchBuffer(fetchUrl);
      if (!result) return null;
      ({ buffer, contentType } = result);
    } else {
      const resp = await fetch(fetchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Referer: new URL(fetchUrl).origin,
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(20_000),
      });
      if (!resp.ok) {
        console.warn(`  ⚠ Failed to download image: ${imageUrl} (${resp.status})`);
        return null;
      }
      contentType = resp.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        console.warn(`  ⚠ Skipping non-image response (${contentType || 'unknown'}): ${imageUrl}`);
        return null;
      }
      buffer = Buffer.from(await resp.arrayBuffer());
    }

    if (buffer.length < 5000) return null;
    if (buffer.length > 15_000_000) {
      console.warn(`  ⚠ Skipping oversized image (${buffer.length} bytes): ${imageUrl}`);
      return null;
    }

    const ext = contentType.includes('png')
      ? 'png'
      : contentType.includes('webp')
        ? 'webp'
        : contentType.includes('gif')
          ? 'gif'
          : 'jpg';
    const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
    const path = `manufacturer-products/${productId}/${index}-${hash}.${ext}`;

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(path, buffer, { contentType, upsert: true });
    if (error) {
      console.warn(`  ⚠ Failed to upload image: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path);
    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn(`  ⚠ Image pipeline error: ${err.message}`);
    return null;
  }
}

export function isSupabaseStorageUrl(url) {
  try {
    return new URL(url).hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

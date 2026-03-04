import { createHash } from 'crypto';

interface ListingForFormat {
  id: string;
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  condition: string | null;
  city: string | null;
  state: string | null;
  mileage: number | null;
  hours: number | null;
  description: string | null;
  specs?: Record<string, string | number | boolean | undefined>;
  category_name?: string | null;
}

/**
 * Converts a listing row to a structured markdown document
 * suitable for uploading to an xAI Collection.
 */
export function formatListingForCollection(listing: ListingForFormat): string {
  const lines: string[] = [];

  lines.push(`# ${listing.title}`);
  lines.push('');

  // Core details
  const details: string[] = [];
  if (listing.year || listing.make || listing.model) {
    details.push(`**Equipment:** ${[listing.year, listing.make, listing.model].filter(Boolean).join(' ')}`);
  }
  if (listing.price) {
    details.push(`**Price:** $${listing.price.toLocaleString()}`);
  } else {
    details.push('**Price:** Call for price');
  }
  if (listing.condition) {
    details.push(`**Condition:** ${listing.condition}`);
  }
  if (listing.category_name) {
    details.push(`**Category:** ${listing.category_name}`);
  }
  if (listing.mileage) {
    details.push(`**Mileage:** ${listing.mileage.toLocaleString()} miles`);
  }
  if (listing.hours) {
    details.push(`**Hours:** ${listing.hours.toLocaleString()}`);
  }
  if (listing.city || listing.state) {
    details.push(`**Location:** ${[listing.city, listing.state].filter(Boolean).join(', ')}`);
  }

  lines.push(details.join('\n'));
  lines.push('');

  // Specs
  if (listing.specs && Object.keys(listing.specs).length > 0) {
    lines.push('## Specifications');
    for (const [key, value] of Object.entries(listing.specs)) {
      if (value !== undefined && value !== null && value !== '') {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        lines.push(`- **${label}:** ${value}`);
      }
    }
    lines.push('');
  }

  // Description
  if (listing.description) {
    lines.push('## Description');
    lines.push(listing.description);
    lines.push('');
  }

  // Link
  lines.push(`**View listing:** https://axlon.ai/listing/${listing.id}`);

  return lines.join('\n');
}

/**
 * Computes an MD5 hash of the formatted content for change detection.
 */
export function computeContentHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

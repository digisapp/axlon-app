import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

interface ManufacturerProduct {
  id: string;
  manufacturer_slug: string;
  product_slug: string;
  name: string;
  manufacturer_name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  specs: Array<{ spec_key: string; spec_value: string }>;
}

interface MatchResult {
  product: ManufacturerProduct;
  score: number;
  matchedOn: string[];
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Match detected equipment (from vision AI) to our manufacturer product catalog.
 * Returns top matches with confidence scores.
 */
export async function matchToManufacturerProduct(
  detected: {
    type?: string;
    make?: string;
    model?: string;
    tags?: string[];
  }
): Promise<MatchResult[]> {
  const supabase = getSupabase();

  if (!detected.make && !detected.model && !detected.type) {
    return [];
  }

  // Step 1: Try exact manufacturer match
  let query = supabase
    .from('manufacturer_products')
    .select(`
      id, manufacturer_slug, product_slug, name, manufacturer_name,
      category, subcategory, description,
      specs:manufacturer_product_specs(spec_key, spec_value)
    `)
    .eq('is_active', true);

  // Filter by manufacturer if make is detected
  if (detected.make) {
    const normalizedMake = normalizeMake(detected.make);
    query = query.ilike('manufacturer_name', `%${normalizedMake}%`);
  }

  const { data: products, error } = await query.limit(50);

  if (error) {
    logger.error('Spec matcher query error', { error });
    return [];
  }

  if (!products || products.length === 0) {
    // Fallback: try category-based search
    return matchByCategory(detected);
  }

  // Step 2: Score each product against detected info
  const results: MatchResult[] = products.map(product => {
    const { score, matchedOn } = calculateMatchScore(product as ManufacturerProduct, detected);
    return { product: product as ManufacturerProduct, score, matchedOn };
  });

  // Sort by score descending, return top 5
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function calculateMatchScore(
  product: ManufacturerProduct,
  detected: { type?: string; make?: string; model?: string; tags?: string[] }
): { score: number; matchedOn: string[] } {
  let score = 0;
  const matchedOn: string[] = [];

  // Manufacturer match (40 points)
  if (detected.make) {
    const normalizedMake = normalizeMake(detected.make).toLowerCase();
    const productMfr = product.manufacturer_name.toLowerCase();
    if (productMfr.includes(normalizedMake) || normalizedMake.includes(productMfr)) {
      score += 40;
      matchedOn.push('manufacturer');
    }
  }

  // Model match (40 points for exact, 20 for partial)
  if (detected.model) {
    const normalizedModel = detected.model.toLowerCase().replace(/[^a-z0-9]/g, '');
    const productName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const productSlug = product.product_slug.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (productName.includes(normalizedModel) || productSlug.includes(normalizedModel)) {
      score += 40;
      matchedOn.push('model');
    } else if (fuzzyMatch(normalizedModel, productName) > 0.6) {
      score += 20;
      matchedOn.push('model (partial)');
    }
  }

  // Category/type match (15 points)
  if (detected.type) {
    const normalizedType = detected.type.toLowerCase();
    const productCategory = product.category.toLowerCase();
    const productSubcategory = (product.subcategory || '').toLowerCase();

    const typeKeywords = normalizedType.split(/[\s-]+/);
    for (const keyword of typeKeywords) {
      if (productCategory.includes(keyword) || productSubcategory.includes(keyword) || product.name.toLowerCase().includes(keyword)) {
        score += 15;
        matchedOn.push('category');
        break;
      }
    }
  }

  // Tag overlap (5 points per matching tag, max 15)
  if (detected.tags && detected.tags.length > 0) {
    const productText = `${product.name} ${product.category} ${product.subcategory || ''} ${product.description || ''}`.toLowerCase();
    let tagScore = 0;
    for (const tag of detected.tags) {
      if (productText.includes(tag.toLowerCase())) {
        tagScore += 5;
        if (tagScore <= 15) matchedOn.push(`tag:${tag}`);
      }
    }
    score += Math.min(tagScore, 15);
  }

  return { score, matchedOn };
}

async function matchByCategory(
  detected: { type?: string; make?: string; model?: string; tags?: string[] }
): Promise<MatchResult[]> {
  if (!detected.type) return [];

  const supabase = getSupabase();
  const typeKeywords = detected.type.toLowerCase().split(/[\s-]+/);

  const { data: products, error } = await supabase
    .from('manufacturer_products')
    .select(`
      id, manufacturer_slug, product_slug, name, manufacturer_name,
      category, subcategory, description,
      specs:manufacturer_product_specs(spec_key, spec_value)
    `)
    .eq('is_active', true)
    .or(typeKeywords.map(k => `category.ilike.%${k}%`).join(','))
    .limit(20);

  if (error || !products) return [];

  return products
    .map(product => {
      const { score, matchedOn } = calculateMatchScore(product as ManufacturerProduct, detected);
      return { product: product as ManufacturerProduct, score, matchedOn };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Simple fuzzy match returning 0-1 similarity score
 */
function fuzzyMatch(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  // Check if one contains the other
  if (b.includes(a)) return 0.8;
  if (a.includes(b)) return 0.7;

  // Bigram overlap
  const getBigrams = (s: string): Set<string> => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.slice(i, i + 2));
    }
    return bigrams;
  };

  const aBigrams = getBigrams(a);
  const bBigrams = getBigrams(b);
  let intersect = 0;
  for (const bigram of aBigrams) {
    if (bBigrams.has(bigram)) intersect++;
  }

  return (2 * intersect) / (aBigrams.size + bBigrams.size);
}

/**
 * Normalize make names to match our manufacturer catalog
 */
function normalizeMake(make: string): string {
  const aliases: Record<string, string> = {
    'trailking': 'Trail King',
    'trail king': 'Trail King',
    'xl': 'XL Specialized',
    'xl specialized': 'XL Specialized',
    'eager beaver': 'Eager Beaver',
    'eaglebeaver': 'Eager Beaver',
    'fontaine trailer': 'Fontaine',
    'fontaine heavy haul': 'Fontaine',
    'talbert manufacturing': 'Talbert',
    'pitts trailers': 'Pitts',
    'pitts industries': 'Pitts',
    'kaufman trailers': 'Kaufman',
    'witzco challenger': 'Witzco',
    'globe trailers': 'Globe',
    'etnyre': 'Etnyre',
    'e.d. etnyre': 'Etnyre',
    'landoll corporation': 'Landoll',
    'faymonville': 'Faymonville',
    'loadstar trailers': 'Loadstar',
  };

  const lower = make.toLowerCase().trim();
  return aliases[lower] || make;
}

/**
 * Format matched specs into a clean object for listing creation
 */
export function formatSpecsForListing(
  specs: Array<{ spec_key: string; spec_value: string }>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const spec of specs) {
    result[spec.spec_key] = spec.spec_value;
  }
  return result;
}

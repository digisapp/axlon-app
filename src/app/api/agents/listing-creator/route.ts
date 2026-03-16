import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeImage, generateListingDescription } from '@/lib/ai/vision';
import { matchToManufacturerProduct, formatSpecsForListing } from '@/lib/ai/spec-matcher';
import { estimatePrice } from '@/lib/ai/pricing';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

interface Step {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}

/**
 * Smart Listing Creator Agent
 * Chains: Image Analysis → Spec Match → Description → Pricing
 * Returns a complete listing draft ready for dealer review.
 */
export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.ai,
      prefix: 'ratelimit:ai-listing-creator',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();

    // Verify authenticated dealer
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrls, manualSpecs } = body as {
      imageUrls: string[];
      manualSpecs?: Record<string, string>;
    };

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'At least one image URL is required' }, { status: 400 });
    }

    const steps: Step[] = [
      { name: 'analyze_images', status: 'pending' },
      { name: 'match_specs', status: 'pending' },
      { name: 'generate_description', status: 'pending' },
      { name: 'estimate_price', status: 'pending' },
    ];

    // ── Step 1: Analyze Images ─────────────────────────────────────
    steps[0].status = 'running';

    // Analyze up to 4 images in parallel
    const analysisPromises = imageUrls.slice(0, 4).map(url => analyzeImage(url));
    const analyses = await Promise.allSettled(analysisPromises);

    const successfulAnalyses = analyses
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof analyzeImage>>> => r.status === 'fulfilled')
      .map(r => r.value);

    if (successfulAnalyses.length === 0) {
      steps[0].status = 'failed';
      steps[0].error = 'Failed to analyze any images';
      return NextResponse.json({ error: 'Image analysis failed', steps }, { status: 500 });
    }

    // Merge analyses — take the most confident detection
    const primaryAnalysis = successfulAnalyses.reduce((best, current) => {
      if (current.detected_make && !best.detected_make) return current;
      if (current.detected_model && !best.detected_model) return current;
      if ((current.quality_score || 0) > (best.quality_score || 0)) return current;
      return best;
    });

    // Collect all unique tags
    const allTags = [...new Set(successfulAnalyses.flatMap(a => a.suggested_tags || []))];
    const hasDamage = successfulAnalyses.some(a => a.damage_detected);
    const damageAreas = [...new Set(successfulAnalyses.flatMap(a => a.damage_areas || []))];

    steps[0].status = 'completed';
    steps[0].result = {
      detected_type: primaryAnalysis.detected_type,
      detected_make: primaryAnalysis.detected_make,
      detected_model: primaryAnalysis.detected_model,
      damage_detected: hasDamage,
      damage_areas: damageAreas,
      tags: allTags,
      images_analyzed: successfulAnalyses.length,
    };

    // ── Step 2: Match to Manufacturer Specs ────────────────────────
    steps[1].status = 'running';

    const matches = await matchToManufacturerProduct({
      type: primaryAnalysis.detected_type,
      make: primaryAnalysis.detected_make,
      model: primaryAnalysis.detected_model,
      tags: allTags,
    });

    const topMatch = matches[0] || null;
    const matchedSpecs = topMatch
      ? formatSpecsForListing(topMatch.product.specs)
      : {};

    // Merge matched specs with any manual specs (manual takes priority)
    const finalSpecs = { ...matchedSpecs, ...(manualSpecs || {}) };

    steps[1].status = 'completed';
    steps[1].result = {
      top_match: topMatch ? {
        name: topMatch.product.name,
        manufacturer: topMatch.product.manufacturer_name,
        category: topMatch.product.category,
        score: topMatch.score,
        matched_on: topMatch.matchedOn,
        product_url: `/new-trailers/${topMatch.product.manufacturer_slug}/${topMatch.product.product_slug}`,
      } : null,
      all_matches: matches.slice(0, 3).map(m => ({
        name: m.product.name,
        manufacturer: m.product.manufacturer_name,
        score: m.score,
      })),
      specs: finalSpecs,
      spec_count: Object.keys(finalSpecs).length,
    };

    // ── Step 3: Generate Description ───────────────────────────────
    steps[2].status = 'running';

    const descriptionSpecs = {
      type: primaryAnalysis.detected_type,
      make: primaryAnalysis.detected_make,
      model: primaryAnalysis.detected_model,
      condition: hasDamage ? 'used' : 'new',
      damage: hasDamage ? damageAreas.join(', ') : 'None visible',
      ...(topMatch ? {
        manufacturer_product: topMatch.product.name,
        category: topMatch.product.category,
      } : {}),
      ...finalSpecs,
    };

    const description = await generateListingDescription(imageUrls, descriptionSpecs);

    steps[2].status = 'completed';
    steps[2].result = { description, word_count: description.split(/\s+/).length };

    // ── Step 4: Estimate Price ─────────────────────────────────────
    steps[3].status = 'running';

    const priceEstimate = await estimatePrice({
      make: primaryAnalysis.detected_make || undefined,
      model: primaryAnalysis.detected_model || undefined,
      condition: hasDamage ? 'used' : 'new',
      specs: finalSpecs,
      description,
    });

    steps[3].status = 'completed';
    steps[3].result = priceEstimate;

    // ── Build the listing draft ────────────────────────────────────
    const make = primaryAnalysis.detected_make || '';
    const model = primaryAnalysis.detected_model || '';
    const type = primaryAnalysis.detected_type || 'Equipment';

    const title = [make, model].filter(Boolean).join(' ') || type;

    const listingDraft = {
      title,
      description,
      make,
      model,
      condition: hasDamage ? 'used' : 'excellent',
      specs: finalSpecs,
      suggested_price: priceEstimate.estimated_price,
      price_range: priceEstimate.price_range,
      market_trend: priceEstimate.market_trend,
      pricing_factors: priceEstimate.factors,
      confidence: priceEstimate.confidence,
      tags: allTags,
      damage_detected: hasDamage,
      damage_areas: damageAreas,
      manufacturer_match: topMatch ? {
        name: topMatch.product.name,
        manufacturer: topMatch.product.manufacturer_name,
        category: topMatch.product.category,
        subcategory: topMatch.product.subcategory,
        product_url: `/new-trailers/${topMatch.product.manufacturer_slug}/${topMatch.product.product_slug}`,
      } : null,
      image_urls: imageUrls,
    };

    return NextResponse.json({
      success: true,
      draft: listingDraft,
      steps,
    });
  } catch (error) {
    logger.error('Listing creator agent error', { error });
    return NextResponse.json(
      { error: 'Failed to create listing draft' },
      { status: 500 }
    );
  }
}

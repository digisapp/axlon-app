import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateListingDescription } from '@/lib/ai/vision';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Cost-bearing xAI vision endpoint — its only caller is the dashboard
    // listing editor, so require a session like /api/ai/analyze and
    // /api/ai/price do. Unauthenticated it let anyone burn vision credits
    // (up to 10 images per call) against arbitrary URLs.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.ai,
      prefix: 'ratelimit:ai-describe',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.slice(0, 10) : [];
    const specs = body.specs && typeof body.specs === 'object' ? body.specs : {};

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI description generation not configured' },
        { status: 503 }
      );
    }

    const description = await generateListingDescription(imageUrls, specs || {});

    return NextResponse.json({ data: { description } });
  } catch (error) {
    logger.error('Description generation error', { error });
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}

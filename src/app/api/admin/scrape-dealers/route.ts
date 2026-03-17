import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/admin/check-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';

/**
 * GET /api/admin/scrape-dealers — List dealer sources and their status
 */
export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:admin:scrape-dealers',
    });
    if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const supabase = await createClient();

    // Get all dealer sources
    const { data: dealers, error } = await supabase
      .from('dealer_sources')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    // Get listing counts per source
    const { data: listingCounts } = await supabase
      .from('listings')
      .select('source_dealer_id')
      .not('source_dealer_id', 'is', null);

    const countMap: Record<string, number> = {};
    (listingCounts || []).forEach((l) => {
      const id = l.source_dealer_id as string;
      countMap[id] = (countMap[id] || 0) + 1;
    });

    const enriched = (dealers || []).map((d) => ({
      ...d,
      active_listings: countMap[d.id] || 0,
    }));

    return NextResponse.json({ dealers: enriched });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/scrape-dealers — Trigger a scrape run via GitHub Actions
 */
export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.auth,
      prefix: 'ratelimit:admin:scrape-trigger',
    });
    if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

    const { isAdmin } = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    const dealer = body.dealer || '';

    const githubToken = process.env.GITHUB_PAT;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GITHUB_PAT not configured. Add it to your environment variables to enable scrape triggering.' },
        { status: 503 }
      );
    }

    // Trigger GitHub Actions workflow_dispatch
    const resp = await fetch(
      'https://api.github.com/repos/digisapp/axlon-app/actions/workflows/scrape-dealers.yml/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: { dealer },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: `GitHub API error: ${resp.status} ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: dealer
        ? `Scrape triggered for "${dealer}"`
        : 'Full scrape triggered for all dealers',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

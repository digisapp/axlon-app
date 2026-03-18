import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Verify the request is from Vercel Cron or has correct secret
import { logger } from '@/lib/logger'
function verifyRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }

  // Check for Vercel internal cron (only accept in Vercel environment)
  if (process.env.VERCEL && request.headers.get('x-vercel-cron') === '1') {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Publish scheduled listings
    const { data: publishedCount, error: publishError } = await supabase
      .rpc('publish_scheduled_listings');

    if (publishError) {
      logger.error('Error publishing scheduled listings', { publishError });
    }

    // Unpublish expired listings
    const { data: unpublishedCount, error: unpublishError } = await supabase
      .rpc('unpublish_expired_listings');

    if (unpublishError) {
      logger.error('Error unpublishing expired listings', { unpublishError });
    }

    return NextResponse.json({
      success: true,
      published: publishedCount || 0,
      unpublished: unpublishedCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Scheduled listings cron error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

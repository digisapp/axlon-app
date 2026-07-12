import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyCronRequest } from '@/lib/security/cron-auth';

import { logger } from '@/lib/logger'

// Allow the full serverless window for batch processing (Vercel default is short).
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
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

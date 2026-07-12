import { NextRequest, NextResponse } from 'next/server';
import { flushAllViewBatches } from '@/lib/cache';
import { verifyCronRequest } from '@/lib/security/cron-auth';

import { logger } from '@/lib/logger'

// Allow the full serverless window for batch processing (Vercel default is short).
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Verify the request is authorized
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await flushAllViewBatches();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Cron flush views error', { error });
    return NextResponse.json(
      { error: 'Failed to flush views' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}

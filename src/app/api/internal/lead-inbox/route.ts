import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyInternalRequest } from '@/lib/security/internal-auth';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { recordLeadInInbox } from '@/lib/email/lead-inbox';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const bodySchema = z.object({ lead_id: z.string().uuid() });

/**
 * POST /api/internal/lead-inbox
 *
 * Files a lead in /admin/email the way the web forms do, for callers outside
 * the app: the phone agent (agent/) writes its leads straight to the database,
 * so without this a caller who left an email never became a conversation
 * you could answer from the inbox.
 *
 * recordLeadInInbox() decides what belongs there: it skips leads with no valid
 * email (most phone leads, which live in /admin/leads and /admin/calls) and
 * dealer leads, never auto-replies, and is idempotent per lead.
 *
 * Auth is the HMAC v2 internal signature bound to this method and path.
 */
export async function POST(request: NextRequest) {
  try {
    if (!verifyInternalRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = await checkRateLimit(getClientIdentifier(request), {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:internal-lead-inbox',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'lead_id must be a UUID' }, { status: 400 });
    }

    const threadId = await recordLeadInInbox(parsed.data.lead_id);
    return NextResponse.json({ recorded: Boolean(threadId), thread_id: threadId });
  } catch (error) {
    logger.error('Internal lead-inbox failed', { error });
    return NextResponse.json({ error: 'Could not record the lead' }, { status: 500 });
  }
}

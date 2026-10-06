import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { isUuid } from '@/lib/email/admin-inbox';
import { redraftLatest } from '@/lib/email/lead-inbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// One model call, bounded at 30 s inside the classifier.
export const maxDuration = 60;

/**
 * POST /api/admin/inbox/[id]/draft — write a fresh suggested reply to the
 * newest message from the other person ("New draft"). Nothing is sent.
 */
export const POST = withAdmin(
  async (_request: NextRequest, { params }: AuthContext) => {
    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const result = await redraftLatest(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ email: result.email });
  },
  { rateLimit: { ...RATE_LIMITS.ai, prefix: 'ratelimit:admin:inbox:draft' } }
);

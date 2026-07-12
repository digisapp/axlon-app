import { NextResponse } from 'next/server';
import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const bodySchema = z.object({
  question: z.string().trim().min(1).max(500),
});

function getXai() {
  if (!process.env.XAI_API_KEY) return null;
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

/**
 * Dealer-facing "Ask Axlon AI" business assistant. Answers questions about the
 * dealer's OWN inventory and leads using their data as context. Gated to the
 * aiAssistant feature, AI-rate-limited, token-capped, and timed out.
 */
export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'aiAssistant');
  if (gateError) return gateError;

  const rl = await checkRateLimit(getClientIdentifier(request), {
    ...RATE_LIMITS.ai,
    prefix: 'ratelimit:dash-assistant',
  });
  if (!rl.success) return rateLimitResponse(rl);

  let question: string;
  try {
    const parsed = bodySchema.parse(await request.json());
    question = parsed.question;
  } catch {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }

  const xai = getXai();
  if (!xai) {
    return NextResponse.json(
      { error: 'The assistant is temporarily unavailable.' },
      { status: 503 }
    );
  }

  // Pull a compact snapshot of the dealer's own data for grounding.
  const [{ data: listings }, { data: leads }] = await Promise.all([
    supabase
      .from('listings')
      .select('title, price, status, views_count, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('views_count', { ascending: false })
      .limit(40),
    supabase
      .from('leads')
      .select('buyer_name, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(40),
  ]);

  const inventorySummary = (listings || [])
    .map(
      (l) =>
        `- ${l.title} | ${l.price ? '$' + l.price.toLocaleString() : 'Call for price'} | ${l.status} | ${l.views_count || 0} views`
    )
    .join('\n') || 'No active listings.';

  // Open = not yet resolved. 'won' and 'lost' are the terminal states
  // (leads.status is new|contacted|qualified|won|lost — there is no 'closed').
  const activeLeads = (leads || []).filter(
    (l) => l.status !== 'won' && l.status !== 'lost'
  );
  const leadsSummary = activeLeads
    .map((l) => `- ${l.buyer_name || 'Unnamed'} | ${l.status}`)
    .join('\n') || 'No open leads.';

  try {
    const { text } = await generateText({
      model: xai('grok-4-1-fast-non-reasoning'),
      system: `You are AXLON AI, a business assistant for a heavy-equipment dealer. Answer the dealer's question using ONLY the inventory and leads data provided. Be concise (2-4 sentences), specific, and action-oriented — reference actual listings/leads by name where relevant. If the data doesn't contain the answer, say so plainly and suggest where in the dashboard to look. Never invent numbers.`,
      prompt: `DEALER INVENTORY (top by views):
${inventorySummary}

OPEN LEADS:
${leadsSummary}

DEALER'S QUESTION: "${question.replace(/\n/g, ' ')}"

Answer:`,
      maxOutputTokens: 500,
      abortSignal: AbortSignal.timeout(30_000),
    });

    return NextResponse.json({ answer: text.trim() });
  } catch (error) {
    logger.error('Dashboard assistant error', { error });
    return NextResponse.json(
      { error: 'The assistant could not answer right now. Please try again.' },
      { status: 502 }
    );
  }
});

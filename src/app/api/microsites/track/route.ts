import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIdentifier, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

const trackSchema = z.object({
  microsite_id: z.string().uuid(),
  session_id: z.string().min(8).max(64),
  path: z.string().min(1).max(512),
  referrer: z.string().max(1000).nullish(),
  utm_source: z.string().max(200).nullish(),
  utm_medium: z.string().max(200).nullish(),
  utm_campaign: z.string().max(200).nullish(),
  utm_term: z.string().max(200).nullish(),
  utm_content: z.string().max(200).nullish(),
});

/**
 * Crawlers and monitors would otherwise dominate the traffic numbers the
 * dashboard reports. They rarely run JS at all, but the ones that do (headless
 * Chrome, preview bots) are worth excluding explicitly.
 */
const BOT_UA = /bot|crawler|spider|crawling|slurp|bingpreview|headlesschrome|phantomjs|puppeteer|playwright|lighthouse|gtmetrix|pingdom|uptimerobot|semrush|ahrefs|mj12|dotbot|petalbot/i;

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

function deviceFrom(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').slice(0, 253);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Aggressive because a single visitor legitimately fires a handful of
    // these; anything beyond that is inflation, not browsing.
    const identifier = getClientIdentifier(request);
    const limit = await checkRateLimit(identifier, {
      limit: 60,
      windowSeconds: 60,
      prefix: 'ratelimit:ms-track',
    });
    if (!limit.success) return rateLimitResponse(limit);

    const userAgent = request.headers.get('user-agent') || '';
    if (BOT_UA.test(userAgent)) {
      return NextResponse.json({ tracked: false, reason: 'bot' });
    }

    // sendBeacon cannot set custom headers, so this endpoint is deliberately
    // exempt from CSRF. It writes nothing but an analytics row, the microsite
    // id must already exist, and the write is rate-limited per IP.
    const body = await request.json().catch(() => null);
    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const input = parsed.data;

    const supabase = createAdminClient();

    // Reject unknown or unpublished sites so the table can't be stuffed with
    // rows for ids that don't exist.
    const { data: site } = await supabase
      .from('microsites')
      .select('id, status')
      .eq('id', input.microsite_id)
      .maybeSingle();

    if (!site || site.status !== 'live') {
      return NextResponse.json({ tracked: false, reason: 'unknown_site' });
    }

    const referrerHost = hostOf(input.referrer);

    const { error } = await supabase.from('microsite_visits').insert({
      microsite_id: site.id,
      session_id: input.session_id,
      path: input.path.slice(0, 512),
      referrer: input.referrer?.slice(0, 1000) ?? null,
      referrer_host: referrerHost,
      utm_source: input.utm_source ?? null,
      utm_medium: input.utm_medium ?? null,
      utm_campaign: input.utm_campaign ?? null,
      utm_term: input.utm_term ?? null,
      utm_content: input.utm_content ?? null,
      device: deviceFrom(userAgent),
      country: request.headers.get('x-vercel-ip-country') || null,
      ip_hash: hashIp(identifier),
      user_agent: userAgent.slice(0, 500),
    });

    if (error) {
      logger.error('Microsite visit insert failed', { error });
      return NextResponse.json({ tracked: false }, { status: 500 });
    }

    return NextResponse.json({ tracked: true });
  } catch (error) {
    logger.error('Microsite track error', { error });
    // Analytics must never surface an error to the visitor's page.
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}

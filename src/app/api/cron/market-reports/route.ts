import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/resend';
import { generateMarketReport, buildMarketReportEmail } from '@/lib/ai/market-intelligence';
import { verifyCronRequest } from '@/lib/security/cron-auth';

// Report generation runs xAI + email per dealer; give the run headroom.
export const maxDuration = 300;

const DEALER_BATCH_SIZE = 100;

/**
 * Start (UTC) of the current weekly report period. The cron runs every Sunday
 * at 8am UTC, so the period boundary is the most recent Sunday 00:00 UTC. Any
 * dealer who already has a report row on/after this boundary is considered
 * already-sent for this period, making retries / manual re-runs idempotent.
 */
function currentPeriodStart(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay()); // back up to Sunday
  return d;
}

/**
 * Weekly market report cron
 * Generates personalized market intelligence for subscribed dealers
 * Run every Sunday at 8am UTC
 */
export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Only send to dealers who explicitly opted into market reports
    const { data: dealers, error: dealersError } = await supabase
      .from('dealer_ai_settings')
      .select('dealer_id')
      .eq('is_enabled', true)
      .eq('market_reports_enabled', true)
      .limit(DEALER_BATCH_SIZE);

    if (dealersError) {
      logger.error('Error fetching dealers for market reports', { error: dealersError });
      return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
    }

    if (!dealers || dealers.length === 0) {
      return NextResponse.json({ success: true, reports: 0, message: 'No subscribed dealers' });
    }

    // Idempotency: dealers who already received a report this period are skipped
    // so a retry or manual re-run never re-emails the whole dealer base.
    const periodStart = currentPeriodStart(new Date()).toISOString();
    const { data: existingReports } = await supabase
      .from('dealer_market_reports')
      .select('dealer_id')
      .gte('created_at', periodStart)
      .in('dealer_id', dealers.map((d) => d.dealer_id));

    const alreadySent = new Set((existingReports || []).map((r) => r.dealer_id));

    let sent = 0;
    let failed = 0;
    let alreadySentCount = 0;

    for (const dealer of dealers) {
      if (alreadySent.has(dealer.dealer_id)) {
        alreadySentCount++;
        continue;
      }
      try {
        // Generate the report
        const report = await generateMarketReport(dealer.dealer_id);
        if (!report) {
          logger.warn('Could not generate report for dealer', { dealerId: dealer.dealer_id });
          continue;
        }

        // Skip if dealer has no listings (report would be useless)
        if (report.inventory_stats.totalListings === 0) {
          continue;
        }

        // Get dealer email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', dealer.dealer_id)
          .single();

        if (!profile?.email) continue;

        // Build and send the email
        const { subject, html } = buildMarketReportEmail(report);

        await sendEmail({ to: profile.email, subject, html, category: 'marketing' });

        // Store the report for dashboard access
        await supabase
          .from('dealer_market_reports')
          .insert({
            dealer_id: dealer.dealer_id,
            report_data: report,
            report_html: html,
          });

        sent++;
        logger.info('Market report sent', { dealerId: dealer.dealer_id });
      } catch (error) {
        logger.error('Failed to generate/send market report', {
          dealerId: dealer.dealer_id,
          error,
        });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      dealers: dealers.length,
      sent,
      failed,
      alreadySent: alreadySentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Cron market-reports error', { error });
    return NextResponse.json({ error: 'Failed to process market reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

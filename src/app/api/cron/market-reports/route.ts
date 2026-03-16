import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/resend';
import { generateMarketReport, buildMarketReportEmail } from '@/lib/ai/market-intelligence';

function verifyRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  if (process.env.VERCEL && request.headers.get('x-vercel-cron') === '1') {
    return true;
  }
  return false;
}

/**
 * Weekly market report cron
 * Generates personalized market intelligence for subscribed dealers
 * Run every Sunday at 8am UTC
 */
export async function GET(request: NextRequest) {
  if (!verifyRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all dealers with active AI settings (they've opted into AI features)
    // In the future, add a specific market_reports_enabled flag
    const { data: dealers, error: dealersError } = await supabase
      .from('dealer_ai_settings')
      .select('dealer_id')
      .eq('is_enabled', true);

    if (dealersError) {
      logger.error('Error fetching dealers for market reports', { error: dealersError });
      return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
    }

    if (!dealers || dealers.length === 0) {
      return NextResponse.json({ success: true, reports: 0, message: 'No subscribed dealers' });
    }

    let sent = 0;
    let failed = 0;

    for (const dealer of dealers) {
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

        await sendEmail({ to: profile.email, subject, html });

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

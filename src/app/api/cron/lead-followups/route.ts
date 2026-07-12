import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/resend';
import { generateFollowUpEmail, type FollowUpContext } from '@/lib/ai/lead-nurture';
import { escapeHtml, escapeAttribute } from '@/lib/utils/html-escape';
import { verifyCronRequest } from '@/lib/security/cron-auth';

// Slow per-run work (queries + xAI generate + Resend). Give it Vercel's max.
export const maxDuration = 300;

const BATCH_SIZE = 10; // Process up to 10 follow-ups per cron run
const STALE_SENDING_MS = 15 * 60 * 1000; // recover rows stuck in 'sending' > 15 min

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    const now = new Date().toISOString();

    // Recover rows a prior run stranded in 'sending' (e.g. function timeout).
    // Without this the fetch below — which only picks 'pending' — would never
    // see them again and the buyer would silently drop out of the sequence.
    const staleCutoff = new Date(Date.now() - STALE_SENDING_MS).toISOString();
    await supabase
      .from('lead_followup_queue')
      .update({ status: 'pending' })
      .eq('status', 'sending')
      .lt('updated_at', staleCutoff);

    // Fetch pending follow-ups that are due
    const { data: pendingFollowups, error: fetchError } = await supabase
      .from('lead_followup_queue')
      .select(`
        id, lead_id, dealer_id, conversation_id, step,
        scheduled_at, email_to, equipment_interest,
        listing_ids, conversation_summary
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      logger.error('Error fetching pending follow-ups', { error: fetchError });
      return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
    }

    if (!pendingFollowups || pendingFollowups.length === 0) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const followup of pendingFollowups) {
      try {
        // Atomically claim this row: only the run whose UPDATE actually flips
        // 'pending'→'sending' may process it. A concurrent/overlapping run will
        // get zero rows back and skip, preventing double-emailing the buyer.
        const { data: claimed } = await supabase
          .from('lead_followup_queue')
          .update({ status: 'sending' })
          .eq('id', followup.id)
          .eq('status', 'pending')
          .select('id');

        if (!claimed || claimed.length === 0) {
          // Another run already claimed it (or it changed status) — skip.
          continue;
        }

        // Check if the lead has been contacted/converted already
        const { data: lead } = await supabase
          .from('dealer_ai_leads')
          .select('status, visitor_name, visitor_email')
          .eq('id', followup.lead_id)
          .single();

        if (!lead || lead.status === 'contacted' || lead.status === 'converted' || lead.status === 'lost') {
          await supabase
            .from('lead_followup_queue')
            .update({ status: 'skipped' })
            .eq('id', followup.id);
          // Cancel remaining follow-ups for this lead
          await supabase.rpc('cancel_lead_followups', { p_lead_id: followup.lead_id });
          skipped++;
          continue;
        }

        // Check if a prior step was already cancelled/skipped (buyer may have responded)
        if (followup.step > 1) {
          const { data: priorSteps } = await supabase
            .from('lead_followup_queue')
            .select('status')
            .eq('lead_id', followup.lead_id)
            .lt('step', followup.step)
            .in('status', ['cancelled', 'skipped']);

          if (priorSteps && priorSteps.length > 0) {
            await supabase
              .from('lead_followup_queue')
              .update({ status: 'cancelled' })
              .eq('id', followup.id);
            skipped++;
            continue;
          }
        }

        // Fetch dealer info
        const { data: dealer } = await supabase
          .from('profiles')
          .select('company_name, email, phone, city, state')
          .eq('id', followup.dealer_id)
          .single();

        if (!dealer) {
          throw new Error(`Dealer ${followup.dealer_id} not found`);
        }

        // Fetch dealer AI settings for specialties
        const { data: aiSettings } = await supabase
          .from('dealer_ai_settings')
          .select('specialties')
          .eq('dealer_id', followup.dealer_id)
          .single();

        // Fetch the original listings the buyer was looking at
        let listings: FollowUpContext['listings'] = [];
        if (followup.listing_ids && followup.listing_ids.length > 0) {
          const { data: listingData } = await supabase
            .from('listings')
            .select('id, title, price, year, make, model, condition')
            .in('id', followup.listing_ids)
            .eq('status', 'active');
          if (listingData) {
            listings = listingData;
          }
        }

        // For steps 2+, find similar listings to suggest
        let similarListings: FollowUpContext['similarListings'] = [];
        if (followup.step >= 2 && followup.equipment_interest) {
          const { data: similar } = await supabase
            .from('listings')
            .select('id, title, price, year, make, model')
            .eq('user_id', followup.dealer_id)
            .eq('status', 'active')
            .not('id', 'in', `(${(followup.listing_ids || []).join(',')})`)
            .textSearch('title', followup.equipment_interest.split(' ').join(' | '), { type: 'websearch' })
            .limit(3);
          if (similar) {
            similarListings = similar;
          }
        }

        // Generate the email
        const context: FollowUpContext = {
          step: followup.step,
          buyerName: lead.visitor_name || '',
          buyerEmail: followup.email_to,
          dealerName: dealer.company_name || 'Dealer',
          dealerPhone: dealer.phone,
          dealerEmail: dealer.email,
          dealerCity: dealer.city,
          dealerState: dealer.state,
          dealerSpecialties: aiSettings?.specialties || [],
          equipmentInterest: followup.equipment_interest,
          conversationSummary: followup.conversation_summary,
          listings,
          similarListings,
        };

        const email = await generateFollowUpEmail(context);

        // Send the email (marketing drip — honors the suppression list)
        const result = await sendEmail({
          to: followup.email_to,
          subject: email.subject,
          html: email.html,
          category: 'marketing',
        });

        // Mark as sent
        await supabase
          .from('lead_followup_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            email_subject: email.subject,
            email_html: email.html,
            resend_email_id: result?.id || null,
          })
          .eq('id', followup.id);

        sent++;
        logger.info('Follow-up email sent', {
          followupId: followup.id,
          step: followup.step,
          dealerId: followup.dealer_id,
        });
      } catch (error) {
        logger.error('Failed to process follow-up', {
          followupId: followup.id,
          error,
        });

        await supabase
          .from('lead_followup_queue')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', followup.id);

        failed++;
      }
    }

    // Also notify dealers of new leads (step 1 only) — send dealer alert
    const step1Sent = pendingFollowups.filter(f => f.step === 1);
    for (const followup of step1Sent) {
      try {
        const { data: dealer } = await supabase
          .from('profiles')
          .select('email, company_name')
          .eq('id', followup.dealer_id)
          .single();

        const { data: lead } = await supabase
          .from('dealer_ai_leads')
          .select('visitor_name, visitor_email, visitor_phone, equipment_interest, ai_summary')
          .eq('id', followup.lead_id)
          .single();

        if (dealer && lead) {
          await sendEmail({
            to: dealer.email,
            subject: `New Lead: ${lead.visitor_name || 'Anonymous'} — ${lead.equipment_interest || 'Equipment inquiry'}`,
            html: buildDealerAlertHtml(dealer.company_name || 'Your company', lead, followup.conversation_summary),
          });
        }
      } catch (error) {
        // Don't fail the whole cron if dealer notification fails
        logger.error('Failed to send dealer lead alert', { error, followupId: followup.id });
      }
    }

    return NextResponse.json({
      success: true,
      processed: pendingFollowups.length,
      sent,
      failed,
      skipped,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Cron lead-followups error', { error });
    return NextResponse.json({ error: 'Failed to process follow-ups' }, { status: 500 });
  }
}

function buildDealerAlertHtml(
  dealerName: string,
  lead: { visitor_name: string | null; visitor_email: string | null; visitor_phone: string | null; equipment_interest: string | null; ai_summary: string | null },
  conversationSummary: string | null
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <div style="border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px;">
    <strong style="font-size: 18px; color: #059669;">New Lead Alert</strong>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px 12px; background: #f9fafb; font-weight: 600; width: 140px;">Name</td>
      <td style="padding: 8px 12px; background: #f9fafb;">${escapeHtml(lead.visitor_name) || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: 600;">Email</td>
      <td style="padding: 8px 12px;"><a href="mailto:${escapeAttribute(lead.visitor_email)}" style="color: #2563eb;">${escapeHtml(lead.visitor_email) || 'N/A'}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; background: #f9fafb; font-weight: 600;">Phone</td>
      <td style="padding: 8px 12px; background: #f9fafb;">${lead.visitor_phone ? `<a href="tel:${escapeAttribute(lead.visitor_phone)}" style="color: #2563eb;">${escapeHtml(lead.visitor_phone)}</a>` : 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: 600;">Looking for</td>
      <td style="padding: 8px 12px;">${escapeHtml(lead.equipment_interest) || 'General inquiry'}</td>
    </tr>
  </table>

  ${lead.ai_summary ? `
  <div style="margin-bottom: 20px;">
    <strong>AI Summary:</strong>
    <p style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 8px; line-height: 1.5;">${escapeHtml(lead.ai_summary)}</p>
  </div>
  ` : ''}

  ${conversationSummary ? `
  <div style="margin-bottom: 20px;">
    <strong>Conversation:</strong>
    <pre style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 8px; font-family: inherit; white-space: pre-wrap; line-height: 1.5; font-size: 13px;">${escapeHtml(conversationSummary.substring(0, 1000))}</pre>
  </div>
  ` : ''}

  <div style="background: #ecfdf5; border: 1px solid #059669; border-radius: 8px; padding: 16px; text-align: center;">
    <p style="margin: 0 0 8px 0; font-weight: 600;">An automated follow-up has been sent to the buyer.</p>
    <p style="margin: 0; font-size: 14px; color: #6b7280;">We recommend reaching out directly within 24 hours for the best conversion rate.</p>
  </div>

  <div style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
    <p>AXLON Lead Follow-Up Agent — automated lead nurturing for ${escapeHtml(dealerName)}</p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  return GET(request);
}

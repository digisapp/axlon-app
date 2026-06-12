import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { calculateLeadScoreWithAI } from '@/lib/leads/scoring';
import { generateLeadAutoReply } from '@/lib/ai/lead-auto-reply';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { escapeHtml } from '@/lib/utils/html-escape';
import { getResend } from '@/lib/email/resend';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const AXLONAI_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@axlon.ai';

// Validation schema for lead creation
const createLeadSchema = z.object({
  listing_id: z.string().uuid().optional().nullable(),
  seller_id: z.string().uuid().optional().nullable(),
  buyer_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  buyer_email: z.string().email('Invalid email format'),
  buyer_phone: z.string().max(20).optional().nullable(),
  message: z.string().max(2000, 'Message too long').optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent spam (10 leads per minute per IP)
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.leads,
      prefix: 'ratelimit:leads',
    });

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const supabase = await createClient();
    const body = await request.json();

    // Validate input with Zod
    const parseResult = createLeadSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const {
      listing_id,
      seller_id,
      buyer_name,
      buyer_email,
      buyer_phone,
      message,
    } = parseResult.data;

    // Check if routing to AXLON AI (no seller specified)
    const isAxlonAILead = !seller_id;

    // Get listing info for scoring
    let listingState: string | null = null;
    let listingTitle: string | null = null;
    if (listing_id) {
      const { data: listing } = await supabase
        .from('listings')
        .select('title, state')
        .eq('id', listing_id)
        .single();
      if (listing) {
        listingState = listing.state;
        listingTitle = listing.title;
      }
    }

    // Calculate lead score with AI
    const { score, factors, priority } = await calculateLeadScoreWithAI({
      buyerEmail: buyer_email,
      buyerPhone: buyer_phone,
      message: message,
      listingState: listingState,
      listingTitle: listingTitle || undefined,
    });

    // Create the lead with score
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        listing_id: listing_id || null,
        user_id: seller_id || null, // null for AXLON AI leads
        buyer_name,
        buyer_email,
        buyer_phone: buyer_phone || null,
        message: message || null,
        status: 'new',
        priority: priority,
        score: score,
        score_factors: factors,
        source: isAxlonAILead ? 'axlonai_contact' : 'contact_form',
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating lead', { error });
      return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
    }

    // Use listing title from earlier fetch, or fallback
    const emailListingTitle = listingTitle || 'a listing';

    // Determine notification recipient + collect seller context for auto-reply
    let notificationEmail: string | null = null;
    let sellerCompanyName: string | null = null;
    let sellerPhone: string | null = null;
    let sellerEmail: string | null = null;
    let sellerCity: string | null = null;
    let sellerState: string | null = null;
    let sellerSpecialties: string[] = [];

    if (isAxlonAILead) {
      notificationEmail = AXLONAI_ADMIN_EMAIL;
      sellerCompanyName = 'AXLON AI';
      sellerEmail = AXLONAI_ADMIN_EMAIL;
    } else if (seller_id) {
      const { data: seller } = await supabase
        .from('profiles')
        .select('email, company_name, phone, city, state')
        .eq('id', seller_id)
        .single();
      if (seller) {
        notificationEmail = seller.email || null;
        sellerEmail = seller.email || null;
        sellerCompanyName = seller.company_name || null;
        sellerPhone = seller.phone || null;
        sellerCity = seller.city || null;
        sellerState = seller.state || null;
      }

      // Fetch dealer AI settings for specialties
      const { data: aiSettings } = await supabase
        .from('dealer_ai_settings')
        .select('specialties')
        .eq('dealer_id', seller_id)
        .single();
      if (aiSettings?.specialties) {
        sellerSpecialties = aiSettings.specialties;
      }
    }

    // Send dealer notification + AI buyer auto-reply in parallel
    if (process.env.RESEND_API_KEY) {
      const dashboardUrl = isAxlonAILead
        ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/leads`
        : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/leads`;

      const dealerNotificationHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Lead — ${escapeHtml(priority.toUpperCase())} Priority (Score: ${score})</h2>
          <p>New inquiry about <strong>${escapeHtml(emailListingTitle)}</strong>.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${escapeHtml(buyer_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(buyer_email)}">${escapeHtml(buyer_email)}</a></p>
            ${buyer_phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(buyer_phone)}">${escapeHtml(buyer_phone)}</a></p>` : ''}
          </div>

          ${message ? `
          <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Their Message</h3>
            <p>${escapeHtml(message)}</p>
          </div>
          ` : ''}

          <p style="background: #e8f5e9; padding: 12px 16px; border-radius: 6px; color: #2e7d32; font-size: 14px;">
            ✓ AI drafted a response — review it in your AI Inbox
          </p>

          <p>
            <a href="${dashboardUrl}"
               style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View in ${isAxlonAILead ? 'Admin Panel' : 'Dashboard'}
            </a>
          </p>
        </div>
      `;

      try {
        const emailPromises: Promise<unknown>[] = [];

        // 1. Dealer notification
        if (notificationEmail) {
          emailPromises.push(
            getResend().emails.send({
              from: 'AXLON AI <leads@axlon.ai>',
              to: notificationEmail,
              subject: `New ${priority} lead: ${escapeHtml(buyer_name)} — ${escapeHtml(emailListingTitle)}`,
              html: dealerNotificationHtml,
            })
          );
        }

        // 2. AI auto-reply to buyer — confidence-gated
        if (sellerEmail && sellerCompanyName && !isAxlonAILead) {
          const autoReply = await generateLeadAutoReply({
            buyerName: buyer_name,
            buyerEmail: buyer_email,
            message: message || null,
            listingTitle: listingTitle || null,
            businessName: sellerCompanyName,
            businessPhone: sellerPhone,
            businessEmail: sellerEmail,
            businessSpecialties: sellerSpecialties,
            businessCity: sellerCity,
            businessState: sellerState,
            leadPriority: priority,
          });

          // Always save to AI inbox for full audit trail
          await supabase.from('ai_inbox_items').insert({
            dealer_id: seller_id,
            lead_id: lead.id,
            channel: 'form',
            from_name: buyer_name,
            from_email: buyer_email,
            from_phone: buyer_phone || null,
            inquiry_text: message || `Inquiry about ${emailListingTitle}`,
            ai_subject: autoReply.subject,
            ai_draft: autoReply.plainText,
            ai_draft_html: autoReply.html,
            confidence: autoReply.confidence,
            confidence_reasons: autoReply.confidenceReasons,
            status: autoReply.autoSend ? 'approved' : 'pending',
          });

          if (autoReply.autoSend) {
            // High confidence — send immediately
            emailPromises.push(
              getResend().emails.send({
                from: `${sellerCompanyName} via AXLON <leads@axlon.ai>`,
                to: buyer_email,
                replyTo: sellerEmail,
                subject: autoReply.subject,
                html: autoReply.html,
              })
            );
          }
          // else: queued in ai_inbox_items with status='pending' for dealer approval
        }

        await Promise.allSettled(emailPromises);
      } catch (emailError) {
        logger.error('Failed to send lead emails', { error: emailError });
      }
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/leads', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

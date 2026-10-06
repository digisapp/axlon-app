import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse, after } from 'next/server';
import { calculateLeadScoreWithAI } from '@/lib/leads/scoring';
import { generateLeadAutoReply } from '@/lib/ai/lead-auto-reply';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { escapeHtml } from '@/lib/utils/html-escape';
import { getResend } from '@/lib/email/resend';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { recordLeadInInbox, redraftLatest } from '@/lib/email/lead-inbox';
import { AdminInboxService } from '@/lib/email/admin-inbox';
import { getInboundAddress, threadReplyAddress } from '@/lib/email/inbound-address';
import { instantReplyBlockedReason } from '@/lib/leads/instant-reply-guard';
import { botSignals } from '@/lib/leads/form-guard';

// Trimmed: a value pasted into the host's env UI can carry a trailing newline.
const AXLONAI_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'sales@axlon.ai').trim();
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://axleyard.com').replace(/\/+$/, '');

// Scoring, the instant reply and (after the response) the inbox draft are
// three model calls; give them room.
export const maxDuration = 90;

// Validation schema for lead creation
const createLeadSchema = z.object({
  listing_id: z.string().uuid().optional().nullable(),
  seller_id: z.string().uuid().optional().nullable(),
  buyer_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  buyer_email: z.string().email('Invalid email format'),
  buyer_phone: z.string().max(20).optional().nullable(),
  message: z.string().max(2000, 'Message too long').optional().nullable(),
  /** Honeypot: real people never see this field. */
  website: z.string().max(200).optional().nullable(),
  /** Date.now() when the form was first shown. */
  startedAt: z.number().int().nonnegative().optional().nullable(),
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

    // Service-role client: the caller is an anonymous buyer, but every DB
    // operation here touches rows owned by OTHER users (the seller's lead,
    // the dealer's AI inbox), which anon RLS rightly blocks — including the
    // RETURNING read-back on the insert. Input is rate-limited + CSRF-checked
    // + Zod-validated above/below.
    const supabase = createAdminClient();
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

    // The contact-form bot moved here in October 2026 (random two-word name,
    // random token for a message, a stranger's address) once the contact form
    // stopped mailing strangers. This form can mail the buyer too — the
    // instant reply — so a submission that looks automated is acknowledged
    // and dropped: no lead, no dealer alert, no reply, and nothing for the
    // bot to learn from.
    const signals = botSignals({
      name: buyer_name,
      message,
      email: buyer_email,
      honeypot: parseResult.data.website,
      startedAt: parseResult.data.startedAt,
    });
    if (signals.length > 0) {
      logger.warn('Listing inquiry dropped as automated', { signals, listingId: listing_id ?? null });
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Get listing info for scoring
    let listingState: string | null = null;
    let listingTitle: string | null = null;
    let listingPrice: number | null = null;
    let sourceDealerId: string | null = null;
    // The seller is NEVER taken from the request body — a caller-supplied
    // seller_id would let anyone inject leads into another dealer's inbox and
    // relay AXLON-branded email through their account. It is either derived
    // from the listing's owner or validated as a real business profile below.
    let sellerId: string | null = null;

    if (listing_id) {
      const { data: listing } = await supabase
        .from('listings')
        .select('user_id, title, state, price, source_dealer_id')
        .eq('id', listing_id)
        .single();

      if (!listing) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 400 });
      }

      listingState = listing.state;
      listingTitle = listing.title;
      listingPrice = listing.price;
      sourceDealerId = listing.source_dealer_id;
      sellerId = listing.user_id || null;

      if (seller_id && seller_id !== sellerId) {
        return NextResponse.json(
          { error: 'seller_id does not match the listing owner' },
          { status: 400 }
        );
      }
    } else if (seller_id) {
      // No listing to derive ownership from: only an existing business profile
      // may be addressed directly.
      const { data: sellerProfile } = await supabase
        .from('profiles')
        .select('id, is_business')
        .eq('id', seller_id)
        .maybeSingle();

      if (!sellerProfile?.is_business) {
        return NextResponse.json({ error: 'Invalid seller' }, { status: 400 });
      }
      sellerId = sellerProfile.id;
    }

    // Routing to AXLON AI when no seller could be validated
    const isAxlonAILead = !sellerId;

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
        user_id: sellerId, // null for AXLON AI leads
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

    // Claim-your-storefront trigger: a buyer inquiring about scraped inventory
    // is warm outreach ammo — record the demand against the dealer source so
    // /admin/outreach surfaces "we have a buyer for your equipment" dealers.
    if (sourceDealerId) {
      await recordBuyerDemandForDealerSource({
        sourceDealerId,
        listingTitle: listingTitle || 'a listing',
        listingPrice,
        buyerMessage: message || null,
      });
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
    // Axleyard's own listings are owned by an admin account, whose login
    // address (admin@axlon.ai) receives no mail. Those leads are worked in the
    // admin inbox like AXLON AI leads.
    let sellerIsAdmin = false;

    if (isAxlonAILead) {
      notificationEmail = AXLONAI_ADMIN_EMAIL;
      sellerCompanyName = 'AXLON AI';
      sellerEmail = AXLONAI_ADMIN_EMAIL;
    } else if (sellerId) {
      const { data: seller } = await supabase
        .from('profiles')
        .select('email, company_name, phone, city, state, is_admin')
        .eq('id', sellerId)
        .single();
      if (seller) {
        sellerIsAdmin = seller.is_admin === true;
        notificationEmail = sellerIsAdmin ? AXLONAI_ADMIN_EMAIL : seller.email || null;
        sellerEmail = seller.email || null;
        sellerCompanyName = sellerIsAdmin ? 'Axleyard' : seller.company_name || null;
        sellerPhone = seller.phone || null;
        sellerCity = seller.city || null;
        sellerState = seller.state || null;
      }

      // Fetch dealer AI settings for specialties
      const { data: aiSettings } = await supabase
        .from('dealer_ai_settings')
        .select('specialties')
        .eq('dealer_id', sellerId)
        .single();
      if (aiSettings?.specialties) {
        sellerSpecialties = aiSettings.specialties;
      }
    }

    // A platform lead becomes a conversation in /admin/email before anything
    // is sent, so the instant reply below can carry that conversation's
    // Reply-To and the person's answer lands in the same thread.
    const platformLead = isAxlonAILead || sellerIsAdmin;
    const inboxThreadId = platformLead ? await recordLeadInInbox(lead.id, { draft: false }) : null;
    const buyerReplyTo = sellerIsAdmin
      ? (inboxThreadId ? threadReplyAddress(inboxThreadId) : getInboundAddress())
      : sellerEmail;
    let instantReplySent = false;

    // Send dealer notification + AI buyer auto-reply in parallel
    if (process.env.RESEND_API_KEY) {
      // Platform leads are worked in the admin inbox: link straight to the
      // conversation. Dealer leads go to the dealer's dashboard as before.
      const dashboardUrl = platformLead
        ? (inboxThreadId ? `${APP_URL}/admin/email?thread=${inboxThreadId}` : `${APP_URL}/admin/leads`)
        : `${APP_URL}/dashboard/leads`;

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
            ${platformLead ? '✓ It is in the admin inbox with a suggested reply' : '✓ AI drafted a response — review it in your AI Inbox'}
          </p>

          <p>
            <a href="${dashboardUrl}"
               style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              ${platformLead ? 'Answer it in the inbox' : 'View in Dashboard'}
            </a>
          </p>
        </div>
      `;

      try {
        // The Resend SDK resolves with { error } instead of throwing, so each
        // send is tracked with its recipient and inspected after settling.
        const emailTasks: Array<{
          kind: string;
          recipient: string;
          promise: Promise<{ error: unknown }>;
        }> = [];

        // 1. Dealer notification
        if (notificationEmail) {
          emailTasks.push({
            kind: 'dealer_notification',
            recipient: notificationEmail,
            promise: getResend().emails.send({
              from: 'AXLON AI <leads@axlon.ai>',
              to: notificationEmail,
              subject: `New ${priority} lead: ${escapeHtml(buyer_name)} — ${escapeHtml(emailListingTitle)}`,
              html: dealerNotificationHtml,
            }),
          });
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
            // Printed in the reply body: the plain inbox address for our own
            // listings (the per-conversation address goes in Reply-To only).
            businessEmail: sellerIsAdmin ? getInboundAddress() : sellerEmail,
            businessSpecialties: sellerSpecialties,
            businessCity: sellerCity,
            businessState: sellerState,
            leadPriority: priority,
          });

          // Dealer leads: save to the dealer's AI inbox for the audit trail
          // and approval. Axleyard's own listings are worked in the admin
          // inbox instead; a pending item here would let the same buyer be
          // answered a second time, with a Reply-To that receives nothing.
          if (!sellerIsAdmin) await supabase.from('ai_inbox_items').insert({
            dealer_id: sellerId,
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

          // The reply goes to whatever address the form carried, so nobody
          // may be made to receive it on demand: one per address per day,
          // never an automated or SMS-gateway address, never with a link.
          const blocked = autoReply.autoSend
            ? await instantReplyBlockedReason({ to: buyer_email, message: message || null, excludeLeadId: lead.id })
            : null;
          if (blocked) logger.info('Instant reply withheld', { leadId: lead.id, reason: blocked });

          if (autoReply.autoSend && !blocked) {
            // High confidence — send immediately
            emailTasks.push({
              kind: 'buyer_auto_reply',
              recipient: buyer_email,
              promise: getResend().emails.send({
                from: `${sellerCompanyName} via AXLON <leads@axlon.ai>`,
                to: buyer_email,
                replyTo: buyerReplyTo || sellerEmail,
                subject: autoReply.subject,
                html: autoReply.html,
              }).then(async (res) => {
                // Show the instant reply in the admin conversation, so nobody
                // answers the same inquiry a second time.
                if (!res.error && inboxThreadId) {
                  instantReplySent = true;
                  await AdminInboxService.recordSentReply({
                    threadId: inboxThreadId,
                    to: buyer_email,
                    subject: autoReply.subject,
                    text: autoReply.plainText || null,
                    html: autoReply.html || null,
                    resendId: res.data?.id ?? null,
                    fromName: `${sellerCompanyName} via AXLON`,
                    fromAddress: 'leads@axlon.ai',
                    replyTo: buyerReplyTo || getInboundAddress(),
                  });
                }
                return res;
              }),
            });
          }
          // else: queued in ai_inbox_items with status='pending' for dealer approval
        }

        const results = await Promise.allSettled(emailTasks.map(t => t.promise));
        results.forEach((result, i) => {
          const { kind, recipient } = emailTasks[i];
          if (result.status === 'rejected') {
            logger.error('Lead email send threw', {
              leadId: lead.id,
              kind,
              recipient,
              error: result.reason,
            });
          } else if (result.value?.error) {
            logger.error('Lead email send failed', {
              leadId: lead.id,
              kind,
              recipient,
              error: result.value.error,
            });
          }
        });
      } catch (emailError) {
        logger.error('Failed to send lead emails', { error: emailError, leadId: lead.id });
      }
    }

    // A suggested reply for the admin conversation, written after the
    // response so the buyer isn't kept waiting (skipped when the instant
    // reply already answered them).
    if (inboxThreadId && !instantReplySent) {
      after(async () => {
        const drafted = await redraftLatest(inboxThreadId).catch((err) => ({ ok: false as const, error: String(err), status: 503 as const }));
        if (!drafted.ok) logger.warn('Lead inbox draft not written', { leadId: lead.id, reason: drafted.error });
      });
    }

    // Anonymous buyer response: return only the id — the full row carries the
    // seller's user_id and internal scoring (score, score_factors, priority).
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/leads', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Records buyer demand against a scraped dealer source in outreach_contacts.
 * Uses the service-role client (outreach tables are admin-only under RLS).
 * Never throws — outreach tracking must not break lead creation.
 */
async function recordBuyerDemandForDealerSource({
  sourceDealerId,
  listingTitle,
  listingPrice,
  buyerMessage,
}: {
  sourceDealerId: string;
  listingTitle: string;
  listingPrice: number | null;
  buyerMessage: string | null;
}) {
  try {
    const admin = createAdminClient();

    const { data: source } = await admin
      .from('dealer_sources')
      .select('id, name, website, contact_name, contact_phone, contact_email, location_city, location_state')
      .eq('id', sourceDealerId)
      .single();

    if (!source) return;

    const priceLabel = listingPrice ? ` ($${Math.round(listingPrice).toLocaleString()})` : '';
    const demandNote = `[${new Date().toISOString().slice(0, 10)}] Buyer inquiry on "${listingTitle}"${priceLabel}${
      buyerMessage ? ` — "${buyerMessage.slice(0, 200)}"` : ''
    }`;

    const { data: existing } = await admin
      .from('outreach_contacts')
      .select('id, notes')
      .eq('source', 'buyer_demand')
      .eq('source_id', source.id)
      .maybeSingle();

    if (existing) {
      // Append the new demand signal, keeping the most recent ~4000 chars
      const notes = `${demandNote}\n${existing.notes || ''}`.slice(0, 4000);
      await admin
        .from('outreach_contacts')
        .update({ notes })
        .eq('id', existing.id);
    } else {
      await admin.from('outreach_contacts').insert({
        name: source.name,
        website: source.website,
        email: source.contact_email,
        phone: source.contact_phone,
        city: source.location_city,
        state: source.location_state,
        source: 'buyer_demand',
        source_id: source.id,
        status: 'new',
        personnel: source.contact_name ? [{ name: source.contact_name }] : [],
        notes: demandNote,
      });
    }
  } catch (err) {
    logger.error('Failed to record buyer demand for dealer source', { error: err, sourceDealerId });
  }
}

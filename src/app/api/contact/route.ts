import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { requireCsrf } from '@/lib/security/csrf';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, contactFormSchema } from '@/lib/validations/api';
import { escapeHtml } from '@/lib/utils/html-escape';
import { botSignals } from '@/lib/leads/form-guard';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@axlon.ai';

const subjectLabels: Record<string, string> = {
  demo: 'Demo Request',
  voice: 'Voice Agent Inquiry',
  pricing: 'Pricing Question',
  support: 'Technical Support',
  partnership: 'Partnership Inquiry',
  claim: 'Storefront Claim Request',
  other: 'General Inquiry',
};

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.auth,
      prefix: 'ratelimit:contact',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const supabase = await createClient();
    const body = await request.json();

    let validatedData;
    try {
      validatedData = validateBody(contactFormSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    // Bots have been using this form to make the site email third parties
    // (a random name, a number for a message, somebody else's address). A
    // submission that looks like that is acknowledged and dropped: nothing is
    // stored, nobody is emailed, and the bot learns nothing.
    const signals = botSignals({
      name: validatedData.name,
      message: validatedData.message,
      email: validatedData.email,
      honeypot: validatedData.website,
      startedAt: validatedData.startedAt,
    });
    if (signals.length > 0) {
      logger.warn('Contact form submission dropped as automated', { signals, subject: validatedData.subject || null });
      return NextResponse.json({ success: true });
    }

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Service-role insert: the submitter is usually anonymous and SELECT on
    // contact_submissions is admin-only, so `INSERT ... RETURNING` (the
    // .select() below) fails with 42501 under the session client and every
    // public submission 500'd before the admin email went out. Input is already
    // rate-limited, CSRF-checked and Zod-validated above (same as /api/trade-in).
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('contact_submissions')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        subject: validatedData.subject || null,
        message: validatedData.message,
        plan: validatedData.plan || null,
        user_id: user?.id || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification to admin
    const subjectLine = validatedData.subject
      ? subjectLabels[validatedData.subject] || validatedData.subject
      : 'New Contact Form Submission';

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      // Resend resolves with { error } instead of throwing — inspect it
      const { error: adminEmailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>',
        to: ADMIN_EMAIL,
        subject: `${subjectLine} from ${validatedData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0066cc; padding: 20px; text-align: center;">
              <img src="https://axleyard.com/images/axlonai-logo.png" alt="AXLON AI" height="40" />
            </div>
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #333; margin-bottom: 20px;">${escapeHtml(subjectLine)}</h2>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Contact Details</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${escapeHtml(validatedData.name)}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(validatedData.email)}">${escapeHtml(validatedData.email)}</a></p>
                ${validatedData.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${escapeHtml(validatedData.phone)}">${escapeHtml(validatedData.phone)}</a></p>` : ''}
                ${validatedData.company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${escapeHtml(validatedData.company)}</p>` : ''}
                ${validatedData.plan ? `<p style="margin: 5px 0;"><strong>Plan Interest:</strong> ${escapeHtml(validatedData.plan)}</p>` : ''}
              </div>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Message</h3>
                <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(validatedData.message)}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${escapeHtml(validatedData.email)}?subject=Re: ${encodeURIComponent(subjectLine)}"
                   style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Reply to ${escapeHtml(validatedData.name)}
                </a>
              </div>
            </div>
            <div style="padding: 20px; background: #f9f9f9; text-align: center; color: #888; font-size: 12px;">
              <p>This is an automated notification from AXLON AI</p>
            </div>
          </div>
        `,
      });
      if (adminEmailError) {
        logger.error('Failed to send contact admin notification', {
          error: adminEmailError,
          recipient: ADMIN_EMAIL,
          submissionId: data?.id,
        });
      }
      // No automatic reply to the submitter. It was the one email on the
      // site anyone could aim at any address, and it was used for exactly
      // that. A person who writes in gets an answer from the inbox.
    } catch (emailError) {
      logger.error('Failed to send contact notification email', {
        error: emailError,
        recipient: ADMIN_EMAIL,
        submissionId: data?.id,
      });
    }

    return NextResponse.json({ data, message: 'Message sent successfully' });
  } catch (error) {
    logger.error('Error processing contact form', { error });
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

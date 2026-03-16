import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, contactFormSchema } from '@/lib/validations/api';
import { escapeHtml } from '@/lib/utils/html-escape';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@axlon.ai';

const subjectLabels: Record<string, string> = {
  demo: 'Demo Request',
  voice: 'Voice Agent Inquiry',
  pricing: 'Pricing Question',
  support: 'Technical Support',
  partnership: 'Partnership Inquiry',
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

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
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
      await resend.emails.send({
        from: 'AXLON AI <noreply@axlon.ai>',
        to: ADMIN_EMAIL,
        subject: `${subjectLine} from ${validatedData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0066cc; padding: 20px; text-align: center;">
              <img src="https://axlon.ai/images/axlonai-logo.png" alt="AXLON AI" height="40" />
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
      // Send auto-reply to the submitter
      await resend.emails.send({
        from: 'AXLON AI <noreply@axlon.ai>',
        to: validatedData.email,
        subject: `We received your message — AXLON AI`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0066cc; padding: 20px; text-align: center;">
              <img src="https://axlon.ai/images/axlonai-logo.png" alt="AXLON AI" height="40" />
            </div>
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #333; margin-bottom: 10px;">Thanks for reaching out, ${escapeHtml(validatedData.name.split(' ')[0])}!</h2>
              <p style="color: #555; line-height: 1.6;">
                We received your message and will get back to you within 24 hours. If you need immediate assistance, you can reply directly to this email.
              </p>

              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">Your message:</h3>
                <p style="margin: 0; color: #555; white-space: pre-wrap; font-size: 14px;">${escapeHtml(validatedData.message)}</p>
              </div>

              <p style="color: #555; line-height: 1.6; margin-bottom: 0;">
                In the meantime, you can explore our platform:
              </p>
              <ul style="color: #555; line-height: 1.8;">
                <li><a href="https://axlon.ai/search" style="color: #0066cc;">Browse equipment</a></li>
                <li><a href="https://axlon.ai/how-it-works" style="color: #0066cc;">See how AXLON works</a></li>
                <li><a href="https://axlon.ai/get-started" style="color: #0066cc;">Learn about our business platform</a></li>
              </ul>
            </div>
            <div style="padding: 20px; background: #f9f9f9; text-align: center; color: #888; font-size: 12px;">
              <p>AXLON AI &mdash; The AI platform for equipment businesses</p>
              <p style="margin-top: 5px;"><a href="https://axlon.ai/privacy" style="color: #888;">Privacy Policy</a> &middot; <a href="https://axlon.ai/terms" style="color: #888;">Terms of Service</a></p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      logger.error('Failed to send contact notification email', { error: emailError });
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

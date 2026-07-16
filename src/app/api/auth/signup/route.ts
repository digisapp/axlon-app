import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { confirmEmailTemplate } from '@/lib/email/templates';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email').max(254, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  companyName: z.string().min(1, 'Company name is required').max(200, 'Company name too long'),
});

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rl = await checkRateLimit(identifier, { ...RATE_LIMITS.auth, prefix: 'ratelimit:signup' });
    if (!rl.success) return rateLimitResponse(rl);

    const body = await request.json().catch(() => ({}));
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const { email, password, companyName } = parsed.data;

    const supabase = createAdminClient();

    // Generate signup link without Supabase sending its own email
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          is_business: true,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com'}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: 'Unable to create account. Please try again or use a different email.' },
        { status: 400 }
      );
    }

    // Extract the confirmation URL from the generated link
    const confirmationUrl = data.properties?.action_link;

    if (!confirmationUrl) {
      return NextResponse.json(
        { error: 'Failed to generate confirmation link' },
        { status: 500 }
      );
    }

    // Send branded confirmation email via Resend
    await sendEmail({
      to: email,
      subject: 'Confirm your AXLON AI account',
      html: confirmEmailTemplate({ companyName, confirmationUrl }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('Signup error:', { error: err });
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

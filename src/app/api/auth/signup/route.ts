import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { confirmEmailTemplate } from '@/lib/email/templates';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, companyName } = await request.json();

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Email, password, and company name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

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
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai'}/auth/callback`,
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
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

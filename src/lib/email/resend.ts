import { Resend } from 'resend';
import { logger } from '@/lib/logger';

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export async function sendEmail(template: EmailTemplate) {
  const resend = getResend();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://axlon.ai';

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'AXLON AI <noreply@axlon.ai>',
    to: template.to,
    subject: template.subject,
    html: template.html,
    headers: {
      'List-Unsubscribe': `<${baseUrl}/unsubscribe?email=${encodeURIComponent(template.to)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      ...template.headers,
    },
  });

  if (error) {
    logger.error('Email send error', { error });
    throw error;
  }

  return data;
}

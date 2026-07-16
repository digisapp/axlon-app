import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { logger } from '@/lib/logger';

function getXai() {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

// ─── Types ──────────────────────────────────────────────

export interface EmailClassification {
  category: string;
  confidence: number;
  summary: string;
  draftHtml: string;
  draftText: string;
  autoSendable: boolean;
}

// Categories tailored to heavy haul / trailer marketplace
const CATEGORIES = [
  'purchase_inquiry',    // Wants to buy a trailer/truck
  'selling_inquiry',     // Wants to list/sell equipment
  'financing_question',  // Financing, payment plans, floor plan
  'trade_in_request',    // Trade-in valuation
  'transport_quote',     // Shipping/transport questions
  'parts_inquiry',       // Parts, maintenance, service
  'appraisal_request',   // Equipment valuation
  'dealer_onboarding',   // Dealer wants to sign up / list inventory
  'general_inquiry',     // General questions about Axlon
  'support',             // Account issues, technical problems
  'partnership',         // Business partnership proposals
  'feedback',            // Reviews, complaints, suggestions
  'personal',            // Personal messages to staff
  'spam',                // Junk, marketing, scams
  'other',               // Doesn't fit any category
] as const;

// Categories safe for auto-reply (routine business inquiries)
const AUTO_SEND_CATEGORIES = [
  'purchase_inquiry',
  'selling_inquiry',
  'financing_question',
  'trade_in_request',
  'transport_quote',
  'parts_inquiry',
  'appraisal_request',
  'dealer_onboarding',
  'general_inquiry',
];

const AUTO_SEND_CONFIDENCE_THRESHOLD = 0.85;

// ─── Classification ─────────────────────────────────────

export async function classifyAndDraftReply(email: {
  fromEmail: string;
  fromName: string | null;
  subject: string;
  bodyText: string | null;
  bodyHtml: string | null;
}): Promise<EmailClassification> {
  const xai = getXai();

  // Strip HTML tags for classification
  const bodyContent = email.bodyText
    || email.bodyHtml?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    || '';

  const truncatedBody = bodyContent.slice(0, 3000);

  const { text } = await generateText({
    model: xai('grok-3-mini-fast'),
    system: `You are the AI email assistant for AXLON — a heavy haul trailer and semi truck marketplace (axleyard.com). You classify inbound emails and draft professional replies.

AXLON helps dealers list and sell lowboy trailers, flatbeds, step decks, semi trucks, and other heavy haul equipment. Services include: equipment listings, AI-powered search, dealer storefronts, financing tools, trade-in valuations, and transport coordination.

CATEGORIES (pick exactly one):
${CATEGORIES.map(c => `- ${c}`).join('\n')}

RULES:
- Be warm, professional, and helpful in drafts
- Never make up pricing, inventory, or availability — say "our team will get back to you with specific details"
- For purchase inquiries, mention they can browse listings at axleyard.com
- For dealer onboarding, mention free listing and AI-powered tools
- Keep drafts concise (2-3 paragraphs max)
- Sign off as "The AXLON Team"

Respond in EXACTLY this JSON format (no markdown, no code fences):
{
  "category": "one_of_the_categories",
  "confidence": 0.95,
  "summary": "1-2 sentence summary of what this email is about",
  "draftHtml": "<p>HTML formatted reply</p>",
  "draftText": "Plain text version of the reply"
}`,
    prompt: `Classify this email and draft a reply:

FROM: ${email.fromName || email.fromEmail} <${email.fromEmail}>
SUBJECT: ${email.subject}
BODY:
${truncatedBody}`,
    temperature: 0.3,
    maxOutputTokens: 1500,
  });

  try {
    // Parse JSON — handle potential code fences
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);

    const category = CATEGORIES.includes(result.category) ? result.category : 'other';
    const confidence = Math.max(0, Math.min(1, Number(result.confidence) || 0));

    return {
      category,
      confidence,
      summary: String(result.summary || '').slice(0, 500),
      draftHtml: String(result.draftHtml || ''),
      draftText: String(result.draftText || ''),
      autoSendable: AUTO_SEND_CATEGORIES.includes(category) && confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD,
    };
  } catch (parseError) {
    logger.error('Failed to parse AI classification', { error: parseError, rawText: text });
    return {
      category: 'other',
      confidence: 0,
      summary: 'Could not classify this email',
      draftHtml: '',
      draftText: '',
      autoSendable: false,
    };
  }
}

// ─── Branded Email Template ─────────────────────────────

export function wrapInBrandedTemplate(bodyHtml: string, quotedOriginal?: string): string {
  const quoted = quotedOriginal
    ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
        <p style="font-size:12px;color:#9ca3af;margin:0 0 8px 0">Original message:</p>
        <div style="border-left:3px solid #e5e7eb;padding-left:12px;color:#6b7280;font-size:13px">
          ${quotedOriginal}
        </div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%);border-radius:12px 12px 0 0;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px">AXLON</h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:13px">Heavy Haul Equipment Marketplace</p>
    </div>
    <!-- Body -->
    <div style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      ${bodyHtml}
      ${quoted}
    </div>
    <!-- Footer -->
    <div style="background:#f8fafc;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border:1px solid #e5e7eb;border-top:0">
      <p style="margin:0;color:#64748b;font-size:13px">
        <a href="https://axleyard.com" style="color:#2563eb;text-decoration:none;font-weight:600">axleyard.com</a>
        &nbsp;&middot;&nbsp; sales@axlon.ai
      </p>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:11px">
        &copy; ${new Date().getFullYear()} AXLON AI. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

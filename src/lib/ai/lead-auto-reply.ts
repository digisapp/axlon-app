import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { logger } from '@/lib/logger';

function getXai() {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

export interface LeadAutoReplyContext {
  buyerName: string;
  buyerEmail: string;
  message: string | null;
  listingTitle: string | null;
  businessName: string;
  businessPhone: string | null;
  businessEmail: string;
  businessSpecialties: string[];
  businessCity: string | null;
  businessState: string | null;
  leadPriority: 'low' | 'medium' | 'high';
}

export interface GeneratedAutoReply {
  subject: string;
  html: string;
  plainText: string;
  confidence: number;          // 0.0–1.0
  confidenceReasons: string[]; // explains the score
  autoSend: boolean;           // true if confidence >= 0.80
}

// ─── Confidence scoring ───────────────────────────────────────────────────────
// Scores the incoming inquiry so we know how safe it is to auto-send

function scoreConfidence(context: LeadAutoReplyContext): {
  confidence: number;
  reasons: string[];
} {
  let score = 0.50; // base
  const reasons: string[] = [];

  const msg = (context.message || '').toLowerCase();
  const wordCount = msg.split(/\s+/).filter(Boolean).length;

  // Message quality
  if (wordCount >= 20) { score += 0.12; reasons.push('Detailed message — AI can respond specifically'); }
  else if (wordCount >= 8) { score += 0.06; reasons.push('Adequate message length'); }
  else { score -= 0.10; reasons.push('Short message — less context for AI'); }

  // Has specific equipment mention
  const equipmentTerms = ['lowboy', 'trailer', 'crane', 'rigging', 'truck', 'loader', 'excavat',
    'bulldoz', 'equipment', 'fleet', 'haul', 'transport', 'capacity', 'ton', 'axle', 'flatbed'];
  const hasEquipmentTerm = equipmentTerms.some(t => msg.includes(t));
  if (hasEquipmentTerm) { score += 0.10; reasons.push('Equipment terms detected — response can be specific'); }

  // Has a listing title to reference
  if (context.listingTitle) { score += 0.10; reasons.push(`Linked to listing: "${context.listingTitle}"`); }

  // Business has specialties configured (better context for AI)
  if (context.businessSpecialties.length >= 2) {
    score += 0.08;
    reasons.push('Business knowledge base configured');
  } else if (context.businessSpecialties.length === 0) {
    score -= 0.08;
    reasons.push('No business specialties set — response is more generic');
  }

  // High priority lead = more likely to be real and specific
  if (context.leadPriority === 'high') { score += 0.08; reasons.push('High-priority lead'); }
  else if (context.leadPriority === 'low') { score -= 0.05; reasons.push('Low-priority lead'); }

  // Ambiguous or problematic signals
  const ambiguousPatterns = ['asap', 'urgent', 'legal', 'lawsuit', 'complaint', 'refund', 'broken',
    'scam', 'fraud', 'attorney', 'court'];
  if (ambiguousPatterns.some(p => msg.includes(p))) {
    score -= 0.25;
    reasons.push('Escalation keywords detected — human review recommended');
  }

  // Pricing-sensitive questions (risky to auto-answer)
  const pricingPatterns = ['how much', 'price', 'cost', 'quote', 'rate', 'fee', 'charge'];
  const hasPricingQuestion = pricingPatterns.some(p => msg.includes(p));
  if (hasPricingQuestion && !context.listingTitle) {
    score -= 0.12;
    reasons.push('Pricing question without inventory context — human review safer');
  }

  // Cap between 0.10 and 0.97
  const confidence = Math.min(0.97, Math.max(0.10, score));
  return { confidence: Math.round(confidence * 100) / 100, reasons };
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function buildAutoReplyHtml(opts: {
  body: string;
  businessName: string;
  businessPhone: string | null;
  businessEmail: string;
}): string {
  const bodyHtml = opts.body
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return '<br>';
      return `<p style="margin: 0 0 10px 0; line-height: 1.6; color: #1f2937;">${line}</p>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #ffffff; color: #1f2937;">

  <div style="border-bottom: 2px solid #111827; padding-bottom: 14px; margin-bottom: 24px;">
    <strong style="font-size: 17px; color: #111827;">${opts.businessName}</strong>
  </div>

  <div style="font-size: 15px;">
    ${bodyHtml}
  </div>

  <div style="margin-top: 28px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Direct Contact</p>
    ${opts.businessPhone
      ? `<p style="margin: 0 0 4px 0; font-size: 14px;"><a href="tel:${opts.businessPhone}" style="color: #111827; text-decoration: none; font-weight: 600;">${opts.businessPhone}</a></p>`
      : ''}
    <p style="margin: 0; font-size: 14px;"><a href="mailto:${opts.businessEmail}" style="color: #2563eb;">${opts.businessEmail}</a></p>
  </div>

  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
    <p style="margin: 0;">Powered by <a href="https://axlon.ai" style="color: #9ca3af; text-decoration: none;">AXLON AI</a> on behalf of ${opts.businessName}</p>
  </div>
</body>
</html>`;
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function generateFallbackReply(
  context: LeadAutoReplyContext,
  responseWindow: string,
  confidence: number,
  confidenceReasons: string[]
): GeneratedAutoReply {
  const firstName = context.buyerName.split(' ')[0];
  const equipment = context.listingTitle || context.businessSpecialties[0] || 'equipment';

  const body = `Hi ${firstName},

Thanks for reaching out about the ${equipment}. We received your inquiry and someone from our team will follow up ${responseWindow}.

If you need to reach us sooner, feel free to call or email directly.

${context.businessPhone ? `Phone: ${context.businessPhone}` : ''}
Email: ${context.businessEmail}

${context.businessName} Team`;

  return {
    subject: `Your inquiry — ${context.businessName}`,
    html: buildAutoReplyHtml({
      body,
      businessName: context.businessName,
      businessPhone: context.businessPhone,
      businessEmail: context.businessEmail,
    }),
    plainText: body,
    confidence,
    confidenceReasons,
    autoSend: confidence >= 0.80,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateLeadAutoReply(
  context: LeadAutoReplyContext
): Promise<GeneratedAutoReply> {
  const responseWindow =
    context.leadPriority === 'high'
      ? 'within the next hour'
      : context.leadPriority === 'medium'
      ? 'within a few hours'
      : 'by end of business today';

  const { confidence, reasons: confidenceReasons } = scoreConfidence(context);

  const systemPrompt = `You are an AI that writes instant lead response emails on behalf of heavy haul and equipment businesses.

RULES:
- Write like a real person from the business, not a bot
- Keep the email under 120 words — working people don't read long emails
- Be specific about what they asked about — reference their message or the equipment by name
- NO emojis, NO "Excited to connect!", NO corporate filler phrases
- DO NOT say "AI" or "automated" anywhere
- Do NOT promise things you cannot know (availability, exact pricing, etc.)
- Set a specific, honest expectation for when they will hear back
- End with a direct line to reach the team (phone or email)
- Return ONLY valid JSON with "subject" (under 55 chars) and "body" (plain text with line breaks) fields`;

  const userPrompt = `Write an instant response email for this lead:

BUYER: ${context.buyerName}
THEIR MESSAGE: ${context.message || `Inquiry about ${context.listingTitle || 'equipment'}`}
EQUIPMENT OF INTEREST: ${context.listingTitle || context.businessSpecialties[0] || 'heavy equipment'}

BUSINESS:
- Name: ${context.businessName}
- Phone: ${context.businessPhone || 'not provided'}
- Email: ${context.businessEmail}
- Location: ${[context.businessCity, context.businessState].filter(Boolean).join(', ') || 'N/A'}
${context.businessSpecialties.length > 0 ? `- Specialties: ${context.businessSpecialties.join(', ')}` : ''}

RESPONSE WINDOW: Someone from the team will personally follow up ${responseWindow}.

Return JSON: {"subject": "...", "body": "..."}`;

  try {
    const xai = getXai();
    const { text } = await generateText({
      model: xai('grok-4-1-fast-non-reasoning'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as { subject: string; body: string };

    return {
      subject: parsed.subject,
      html: buildAutoReplyHtml({
        body: parsed.body,
        businessName: context.businessName,
        businessPhone: context.businessPhone,
        businessEmail: context.businessEmail,
      }),
      plainText: parsed.body,
      confidence,
      confidenceReasons,
      autoSend: confidence >= 0.80,
    };
  } catch (error) {
    logger.error('Failed to generate lead auto-reply', { error });
    return generateFallbackReply(context, responseWindow, confidence, confidenceReasons);
  }
}

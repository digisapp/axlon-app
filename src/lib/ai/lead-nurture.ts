import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { logger } from '@/lib/logger';

function getXai() {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

export interface FollowUpContext {
  step: number; // 1-4
  buyerName: string;
  buyerEmail: string;
  dealerName: string;
  dealerPhone: string | null;
  dealerEmail: string;
  dealerCity: string | null;
  dealerState: string | null;
  dealerSpecialties: string[];
  equipmentInterest: string | null;
  conversationSummary: string | null;
  listings: Array<{
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
    condition: string | null;
  }>;
  similarListings: Array<{
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
  }>;
}

interface GeneratedEmail {
  subject: string;
  html: string;
}

const STEP_CONFIGS = {
  1: {
    name: 'immediate',
    goal: 'Thank the buyer for their interest, recap what they were looking at, and provide value (spec sheet, key details). Make them feel heard.',
    tone: 'Warm and helpful. Not salesy.',
  },
  2: {
    name: 'day1',
    goal: 'Check in casually. Surface 1-2 similar listings they might not have seen. Add value, not pressure.',
    tone: 'Friendly, low-pressure. Like a helpful follow-up from someone who remembered what you were looking for.',
  },
  3: {
    name: 'day3',
    goal: 'Provide genuinely useful content — a spec comparison, financing estimate, or market insight relevant to their search. Position the dealer as knowledgeable.',
    tone: 'Informative and consultative. Show expertise.',
  },
  4: {
    name: 'day7',
    goal: 'Final touchpoint. Mention any price changes, new inventory, or market movement. Offer a direct line to the sales team. Leave the door open without being pushy.',
    tone: 'Respectful, final-touch. Acknowledge they may have moved on, but you are here if they need anything.',
  },
} as const;

export async function generateFollowUpEmail(context: FollowUpContext): Promise<GeneratedEmail> {
  const stepConfig = STEP_CONFIGS[context.step as keyof typeof STEP_CONFIGS];
  if (!stepConfig) {
    throw new Error(`Invalid follow-up step: ${context.step}`);
  }

  const xai = getXai();

  const listingContext = context.listings.length > 0
    ? context.listings.map(l =>
        `- ${l.title} | ${l.price ? '$' + l.price.toLocaleString() : 'Call for price'} | ${l.condition || 'N/A'} | axlon.ai/listing/${l.id}`
      ).join('\n')
    : 'No specific listings viewed.';

  const similarContext = context.similarListings.length > 0
    ? context.similarListings.map(l =>
        `- ${l.title} | ${l.price ? '$' + l.price.toLocaleString() : 'Call for price'} | axlon.ai/listing/${l.id}`
      ).join('\n')
    : '';

  const systemPrompt = `You are an AI email copywriter for heavy equipment dealers on AXLON, a trailer and truck marketplace.

RULES:
- Write short, scannable emails (under 150 words for body text)
- Use plain, direct language — these are working people buying equipment, not reading marketing copy
- NO emojis, NO excessive exclamation marks, NO "Hey there!" openers
- Always include specific equipment details (make, model, price) when available
- Include clickable links to listings as plain URLs
- The email comes FROM the dealer, not from AXLON — write as if the dealer's team is sending it
- Include an unsubscribe line at the bottom: "Don't want these updates? Reply STOP and we'll remove you."
- Return ONLY valid JSON with "subject" and "body" fields. The "body" should be plain text with line breaks.
- Subject lines should be under 60 characters, specific, and not clickbaity`;

  const userPrompt = `Generate a follow-up email for step ${context.step} (${stepConfig.name}).

GOAL: ${stepConfig.goal}
TONE: ${stepConfig.tone}

BUYER INFO:
- Name: ${context.buyerName || 'there'}
- Interest: ${context.equipmentInterest || 'heavy equipment'}

DEALER INFO:
- Company: ${context.dealerName}
- Phone: ${context.dealerPhone || 'N/A'}
- Email: ${context.dealerEmail}
- Location: ${[context.dealerCity, context.dealerState].filter(Boolean).join(', ') || 'N/A'}
${context.dealerSpecialties.length > 0 ? `- Specialties: ${context.dealerSpecialties.join(', ')}` : ''}

LISTINGS BUYER LOOKED AT:
${listingContext}

${similarContext ? `SIMILAR LISTINGS TO SUGGEST:\n${similarContext}` : ''}

${context.conversationSummary ? `CONVERSATION SUMMARY:\n${context.conversationSummary}` : ''}

Return JSON: {"subject": "...", "body": "..."}`;

  try {
    const { text } = await generateText({
      model: xai('grok-4-1-fast-non-reasoning'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Parse the AI response
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned) as { subject: string; body: string };

    // Convert plain text body to HTML email
    const html = buildEmailHtml({
      dealerName: context.dealerName,
      body: parsed.body,
      listings: context.step === 1 ? context.listings : context.similarListings,
    });

    return {
      subject: parsed.subject,
      html,
    };
  } catch (error) {
    logger.error('Failed to generate follow-up email', { error, step: context.step });

    // Fallback email if AI fails
    return generateFallbackEmail(context);
  }
}

function buildEmailHtml(opts: {
  dealerName: string;
  body: string;
  listings: Array<{ id: string; title: string; price: number | null }>;
}): string {
  const bodyHtml = opts.body
    .split('\n')
    .map(line => {
      if (line.trim() === '') return '<br>';
      // Convert URLs to clickable links
      const withLinks = line.replace(
        /(https?:\/\/[^\s]+|axlon\.ai\/[^\s]+)/g,
        (url) => {
          const href = url.startsWith('http') ? url : `https://${url}`;
          return `<a href="${href}" style="color: #2563eb; text-decoration: underline;">${url}</a>`;
        }
      );
      return `<p style="margin: 0 0 8px 0; line-height: 1.5;">${withLinks}</p>`;
    })
    .join('');

  const listingCards = opts.listings.length > 0
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
        ${opts.listings.slice(0, 3).map(l => `
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
              <a href="https://axlon.ai/listing/${l.id}" style="color: #111; text-decoration: none; font-weight: 600;">
                ${l.title}
              </a>
              <br>
              <span style="color: #059669; font-weight: 600;">${l.price ? '$' + l.price.toLocaleString() : 'Call for price'}</span>
            </td>
          </tr>
        `).join('')}
      </table>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937; background: #ffffff;">
  <div style="border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px;">
    <strong style="font-size: 16px;">${opts.dealerName}</strong>
    <span style="color: #6b7280; font-size: 13px; margin-left: 8px;">via AXLON</span>
  </div>
  <div style="font-size: 15px;">
    ${bodyHtml}
  </div>
  ${listingCards}
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
    <p>Sent via <a href="https://axlon.ai" style="color: #6b7280;">AXLON</a> on behalf of ${opts.dealerName}</p>
    <p>Don't want these updates? Reply STOP and we'll remove you.</p>
  </div>
</body>
</html>`;
}

function generateFallbackEmail(context: FollowUpContext): GeneratedEmail {
  const name = context.buyerName || 'there';
  const equipment = context.equipmentInterest || 'equipment';
  const dealer = context.dealerName;

  const fallbacks: Record<number, { subject: string; body: string }> = {
    1: {
      subject: `Thanks for your interest — ${dealer}`,
      body: `Hi ${name},\n\nThanks for reaching out about ${equipment}. We wanted to make sure you have everything you need.\n\nIf you have any questions about specs, pricing, or availability, just reply to this email or call us${context.dealerPhone ? ` at ${context.dealerPhone}` : ''}.\n\nWe're here to help.\n\n${dealer} Team`,
    },
    2: {
      subject: `Still looking at ${equipment}?`,
      body: `Hi ${name},\n\nJust checking in — are you still in the market for ${equipment}?\n\nWe have some units available that might be a good fit. Take a look at our current inventory at axlon.ai and let us know if anything catches your eye.\n\n${dealer} Team`,
    },
    3: {
      subject: `${equipment} — specs and pricing info`,
      body: `Hi ${name},\n\nWanted to share some additional details on the ${equipment} you were looking at.\n\nIf you'd like a spec comparison or financing estimate, just reply and we'll put that together for you.\n\n${dealer} Team`,
    },
    4: {
      subject: `Quick update from ${dealer}`,
      body: `Hi ${name},\n\nJust a final check-in. If you're still looking for ${equipment}, we'd love to help.\n\nOur inventory changes regularly, so if you didn't find the right fit before, it's worth another look.\n\nFeel free to reach out anytime${context.dealerPhone ? ` — ${context.dealerPhone}` : ''}.\n\nAll the best,\n${dealer} Team`,
    },
  };

  const fallback = fallbacks[context.step] || fallbacks[1];

  return {
    subject: fallback.subject,
    html: buildEmailHtml({
      dealerName: context.dealerName,
      body: fallback.body,
      listings: context.listings,
    }),
  };
}

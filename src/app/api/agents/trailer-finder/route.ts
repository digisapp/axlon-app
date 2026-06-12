import { NextRequest, NextResponse } from 'next/server';
import { createXai } from '@ai-sdk/xai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import {
  searchListings,
  searchNewTrailers,
  getProductSpecs,
  calculateFinancing,
  lookupEquipmentWeight,
} from '@/lib/agents/trailer-finder-tools';

function getXai() {
  if (!process.env.XAI_API_KEY) throw new Error('XAI_API_KEY is not configured');
  return createXai({ apiKey: process.env.XAI_API_KEY });
}

const SYSTEM_PROMPT = `You are the AXLON Trailer Finder, an expert AI assistant for the heavy haul trailer and equipment marketplace.

YOUR ROLE:
You help buyers find the right trailer for their job. You understand heavy haul, lowboy trailers, RGNs, flatbeds, step decks, and all commercial trailer types. You know the major manufacturers (Trail King, Fontaine, Talbert, XL Specialized, Pitts, Eager Beaver, Kaufman, Witzco, and more).

HOW TO HELP:
1. When a buyer describes what they need to haul → recommend trailers with sufficient capacity
2. When a buyer asks about specific trailers → reference listings and manufacturer catalog
3. When a buyer wants to compare → provide specs side by side
4. When a buyer asks about pricing → provide market info + financing estimates
5. When asked technical questions → use your knowledge of trailer specs, axle configurations

RESPONSE STYLE:
- Be direct and knowledgeable — you are talking to working professionals
- Include specific numbers: weights, capacities, prices, dimensions
- Format listing results clearly with title, price, and link (axlon.ai/listing/[id])
- Format new trailer results with manufacturer, model, and link (axlon.ai/new-trailers/[mfr]/[product])
- When recommending a trailer capacity, always add a safety buffer (at minimum 5 tons above the load weight)
- Keep responses concise — these people are busy
- Don't use markdown formatting like ** or ## — use plain text with line breaks
- Don't make up data — only reference real results provided in the CONTEXT section`;

// Step 1: Determine what tools to call based on the user's message
const planSchema = z.object({
  intent: z.enum([
    'search_used', 'search_new', 'compare', 'specs',
    'financing', 'equipment_weight', 'general', 'multi',
  ]).describe('Primary intent of the user message'),
  search_used: z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    state: z.string().optional(),
  }).optional().describe('Parameters for marketplace search'),
  search_new: z.object({
    query: z.string().optional(),
    manufacturer: z.string().optional(),
    category: z.string().optional(),
    minTonnage: z.number().optional(),
  }).optional().describe('Parameters for new trailer catalog search'),
  specs: z.object({
    manufacturer: z.string(),
    product: z.string(),
  }).optional().describe('Parameters for specific product specs'),
  financing: z.object({
    price: z.number(),
    downPaymentPercent: z.number().optional(),
    termMonths: z.number().optional(),
  }).optional().describe('Financing calculation parameters'),
  equipment_query: z.string().optional().describe('Equipment name to look up weight for'),
});

// Bound the request body — an uncapped message/history drives unbounded
// model token usage
const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000),
      })
    )
    .max(20)
    .optional(),
});

const MODEL_TIMEOUT_MS = 30_000;

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.ai,
      prefix: 'ratelimit:ai-trailer-finder',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }
    const { message, conversationHistory = [] } = parsed.data;

    const xai = getXai();

    // Step 1: Plan — determine what tools to call
    const { object: plan } = await generateObject({
      model: xai('grok-4-1-fast-non-reasoning'),
      schema: planSchema,
      abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      prompt: `Analyze this user message and determine what data we need to fetch.

Recent conversation context:
${conversationHistory.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

User message: ${message}

Determine the intent and extract relevant parameters. Available intents:
- search_used: buyer wants to find used trailers/trucks on the marketplace
- search_new: buyer wants to see new trailer models from manufacturers
- compare: buyer wants to compare specific models
- specs: buyer wants detailed specs on a specific product
- financing: buyer wants payment/financing info
- equipment_weight: buyer mentions specific equipment they need to haul
- general: general question that doesn't need data lookup
- multi: needs multiple lookups (e.g., equipment weight + trailer search)`,
    });

    // Step 2: Execute tools based on plan
    const toolResults: Array<{ tool: string; data: unknown }> = [];

    if (plan.equipment_query || plan.intent === 'equipment_weight') {
      const result = lookupEquipmentWeight(plan.equipment_query || message);
      toolResults.push({ tool: 'equipment_weight', data: result });

      // If we found equipment weight, also search for matching trailers
      if (result.found && result.recommended_trailer_capacity_tons) {
        const [usedResults, newResults] = await Promise.all([
          searchListings({
            category: 'lowboy',
            limit: 5,
          }),
          searchNewTrailers({
            category: 'lowboy',
            minTonnage: result.recommended_trailer_capacity_tons,
            limit: 5,
          }),
        ]);
        toolResults.push({ tool: 'search_listings', data: usedResults });
        toolResults.push({ tool: 'search_new_trailers', data: newResults });
      }
    }

    if (plan.intent === 'search_used' || plan.intent === 'multi') {
      if (plan.search_used) {
        const result = await searchListings(plan.search_used);
        toolResults.push({ tool: 'search_listings', data: result });
      }
    }

    if (plan.intent === 'search_new' || plan.intent === 'multi') {
      if (plan.search_new) {
        const result = await searchNewTrailers(plan.search_new);
        toolResults.push({ tool: 'search_new_trailers', data: result });
      }
    }

    if (plan.intent === 'specs' && plan.specs) {
      const result = await getProductSpecs(plan.specs);
      toolResults.push({ tool: 'product_specs', data: result });
    }

    if (plan.intent === 'financing' || plan.financing) {
      if (plan.financing) {
        const result = calculateFinancing(plan.financing);
        toolResults.push({ tool: 'financing', data: result });
      }
    }

    // Step 3: Generate final response with context
    const contextBlock = toolResults.length > 0
      ? `\n\nCONTEXT (real data from our database — reference this in your response):\n${toolResults.map(r => `[${r.tool}]: ${JSON.stringify(r.data, null, 2)}`).join('\n\n')}`
      : '';

    const messages = [
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message + contextBlock },
    ];

    const { text } = await generateText({
      model: xai('grok-4-1-fast-non-reasoning'),
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 2048,
      abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
    });

    return NextResponse.json({
      response: text,
      toolsUsed: toolResults.map(r => ({ tool: r.tool })),
      hasToolCalls: toolResults.length > 0,
    });
  } catch (error) {
    logger.error('Trailer finder agent error', { error });
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

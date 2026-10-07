import { NextRequest, NextResponse } from 'next/server';
import { createXai } from '@ai-sdk/xai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
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

const SYSTEM_PROMPT = `You are AXLON, Axleyard's AI — the expert assistant for the heavy haul trailer and equipment marketplace at axleyard.com.

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
- Format listing results clearly with title, price, and link (axleyard.com/listing/[id])
- Format new trailer results with manufacturer, model, and link (axleyard.com/new-trailers/[mfr]/[product])
- When recommending a trailer capacity, always add a safety buffer (at minimum 5 tons above the load weight)
- Keep responses concise — these people are busy
- Don't use markdown formatting like ** or ## — use plain text with line breaks
- Don't make up data — only reference real results provided in the CONTEXT section`;

/**
 * What the visitor has on screen: the listing page they opened the chat from,
 * and who is selling it. Loaded server-side from the id — the client is not
 * trusted for any of it.
 */
interface ListingContext {
  listing: {
    id: string;
    title: string;
    price: number | null;
    year: number | null;
    make: string | null;
    model: string | null;
    condition: string | null;
    city: string | null;
    state: string | null;
    mileage: number | null;
    hours: number | null;
    description: string | null;
    ai_price_estimate: number | null;
    axle_count: number | null;
    gvwr: number | null;
    payload_capacity: number | null;
    category: { name: string } | { name: string }[] | null;
  };
  seller: {
    id: string;
    company_name: string | null;
    is_business: boolean | null;
    city: string | null;
    state: string | null;
    phone: string | null;
  } | null;
  dealerInfo: {
    about_dealer: string | null;
    specialties: string[] | null;
    service_areas: string[] | null;
    financing_info: string | null;
    warranty_info: string | null;
    faqs: Array<{ question: string; answer: string }> | null;
  } | null;
}

async function loadListingContext(listingId: string): Promise<ListingContext | null> {
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select(
      'id, user_id, title, price, year, make, model, condition, city, state, mileage, hours, description, ai_price_estimate, axle_count, gvwr, payload_capacity, category:categories!left(name)'
    )
    .eq('id', listingId)
    .eq('status', 'active')
    .maybeSingle();
  if (!listing) return null;

  let seller: ListingContext['seller'] = null;
  let dealerInfo: ListingContext['dealerInfo'] = null;
  if (listing.user_id) {
    // The same public profile fields the listing page itself shows.
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, company_name, is_business, city, state, phone')
      .eq('id', listing.user_id)
      .maybeSingle();
    seller = profile ?? null;

    // A dealer who set up their AI assistant wrote this for buyers to hear;
    // RLS only exposes it while is_enabled.
    if (profile?.is_business) {
      const { data: settings } = await supabase
        .from('dealer_ai_settings')
        .select('about_dealer, specialties, service_areas, financing_info, warranty_info, faqs')
        .eq('dealer_id', profile.id)
        .eq('is_enabled', true)
        .maybeSingle();
      dealerInfo = settings ?? null;
    }
  }

  return { listing, seller, dealerInfo };
}

function money(n: number | null | undefined): string {
  return typeof n === 'number' && n > 0 ? `$${n.toLocaleString()}` : 'not listed';
}

/** The CURRENT LISTING block for the system prompt. */
function describeListingContext(ctx: ListingContext): string {
  const { listing: l, seller, dealerInfo } = ctx;
  const category = Array.isArray(l.category) ? l.category[0]?.name : l.category?.name;
  const lines: string[] = [
    `CURRENT LISTING — the buyer is looking at this page right now. "This trailer", "it", "the price" and similar refer to it. Answer from these facts; say when something isn't listed rather than guessing:`,
    `Title: ${l.title}`,
    `Link: axleyard.com/listing/${l.id}`,
    `Asking price: ${money(l.price)}`,
    `${[l.year, l.make, l.model].filter(Boolean).join(' ') || 'Year/make/model not listed'}${category ? ` · ${category}` : ''}`,
    `Condition: ${l.condition || 'not listed'}`,
    `Location: ${[l.city, l.state].filter(Boolean).join(', ') || 'not listed'}`,
  ];
  if (l.axle_count) lines.push(`Axles: ${l.axle_count}`);
  if (l.gvwr) lines.push(`GVWR: ${l.gvwr.toLocaleString()} lbs`);
  if (l.payload_capacity) lines.push(`Payload capacity: ${l.payload_capacity.toLocaleString()} lbs`);
  if (l.mileage) lines.push(`Mileage: ${l.mileage.toLocaleString()} miles`);
  if (l.hours) lines.push(`Hours: ${l.hours.toLocaleString()}`);
  if (l.description) lines.push(`Description: ${l.description.replace(/\s+/g, ' ').slice(0, 1200)}`);
  if (l.ai_price_estimate && l.price) {
    const diff = Math.round(((l.ai_price_estimate - l.price) / l.ai_price_estimate) * 100);
    lines.push(
      `AXLON market estimate: ${money(l.ai_price_estimate)} (asking price is about ${Math.abs(diff)}% ${diff >= 0 ? 'below' : 'above'} it). Describe this only as a market estimate — never as a previous, original or "was" price.`
    );
  }

  if (seller) {
    const who = seller.is_business ? (seller.company_name || 'a dealer') : 'a private seller';
    lines.push(
      `SELLER: ${who}${[seller.city, seller.state].filter(Boolean).length ? `, ${[seller.city, seller.state].filter(Boolean).join(', ')}` : ''}${seller.phone ? ` · phone ${seller.phone}` : ''}`
    );
  } else {
    lines.push(`SELLER: this unit is listed through Axleyard; Axleyard's team handles buyer inquiries for it.`);
  }
  if (dealerInfo) {
    if (dealerInfo.about_dealer) lines.push(`About the seller: ${dealerInfo.about_dealer.slice(0, 600)}`);
    if (dealerInfo.specialties?.length) lines.push(`Seller specializes in: ${dealerInfo.specialties.join(', ')}`);
    if (dealerInfo.service_areas?.length) lines.push(`Seller service areas: ${dealerInfo.service_areas.join(', ')}`);
    if (dealerInfo.financing_info) lines.push(`Seller financing: ${dealerInfo.financing_info.slice(0, 400)}`);
    if (dealerInfo.warranty_info) lines.push(`Seller warranty: ${dealerInfo.warranty_info.slice(0, 400)}`);
    if (dealerInfo.faqs?.length) {
      lines.push('Seller FAQ:');
      for (const faq of dealerInfo.faqs.slice(0, 8)) lines.push(`Q: ${faq.question} A: ${faq.answer}`);
    }
  }

  lines.push(
    `PRICING: judge the asking price only from the AXLON market estimate above and any comparable listings in CONTEXT. With neither, say you don't have comparable sales for it rather than inventing a range.`
  );
  lines.push(
    `SELLER HANDOFF: you can pass the buyer's contact details and this conversation to the seller. Offer it when they want a quote, want to negotiate, ask about availability, delivery or a visit, or ask something only the seller can answer. Say it in one short sentence — a form appears under your reply for their name and email. Never ask them to type contact details into the chat.`
  );
  return lines.join('\n');
}

// Buying signals that mean "put me in touch", in case the planner misses them.
const CONTACT_SIGNALS = [
  'quote', 'contact the seller', 'contact seller', 'talk to the seller', 'reach the seller',
  'call me', 'email me', 'contact me', 'reach me', 'get in touch', 'make an offer', 'best price',
  'lowest price', 'negotiate', 'still available', 'is it available', 'come see', 'schedule',
  'appointment', 'inspect', 'delivery', 'ship it', 'ready to buy', 'want to buy', 'i\'ll take it',
];

const PRICE_WORDS = /\b(price|priced|fair|worth|value|deal|overpriced|cheap|expensive|market|negotiable)\b/i;

function wantsSellerContact(message: string): boolean {
  const m = message.toLowerCase();
  return CONTACT_SIGNALS.some((s) => m.includes(s));
}

// Step 1: Determine what tools to call based on the user's message
const planSchema = z.object({
  intent: z.enum([
    'search_used', 'search_new', 'compare', 'specs',
    'financing', 'equipment_weight', 'general', 'multi',
    'seller_inventory', 'contact_seller',
  ]).describe('Primary intent of the user message'),
  wants_seller_contact: z.boolean().optional().describe(
    'True when the buyer wants to reach the seller of the current listing: a quote, an offer, availability, delivery, a visit, or to be contacted'
  ),
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
  compare: z.array(z.object({
    manufacturer: z.string(),
    product: z.string(),
  })).min(2).max(4).optional().describe('The models to compare, for the compare intent'),
  financing: z.object({
    price: z.number(),
    downPaymentPercent: z.number().optional(),
    termMonths: z.number().optional(),
  }).optional().describe('Financing calculation parameters'),
  equipment_query: z.string().optional().describe('Equipment name to look up weight for'),
});

// Bound the request body — an uncapped message/history drives unbounded
// model token usage
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CONTENT = 4000;

const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        // Truncate an over-long turn instead of rejecting the whole request.
        content: z.string().transform(c => c.slice(0, MAX_HISTORY_CONTENT)),
      })
    )
    // Accept a long transcript and trim to the most recent turns below; the old
    // .max(20) here 400'd the widget after ~10 exchanges.
    .max(200)
    .optional(),
  // The listing page the chat was opened on, if any.
  context: z
    .object({ listingId: z.string().uuid() })
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
    const { message, conversationHistory: history = [], context } = parsed.data;
    // Only the most recent turns are sent to the model, so token usage stays bounded.
    const conversationHistory = history.slice(-MAX_HISTORY_MESSAGES);

    const xai = getXai();

    // An unknown or inactive listing id just means no page context.
    const listingContext = context?.listingId ? await loadListingContext(context.listingId) : null;
    const listingHint = listingContext
      ? `\nThe buyer is currently viewing this listing: "${listingContext.listing.title}" (${[listingContext.listing.year, listingContext.listing.make, listingContext.listing.model].filter(Boolean).join(' ')}, ${money(listingContext.listing.price)}). "This trailer", "it" and "the price" refer to it. Questions about it that need no lookup are 'general'. "What else does this seller have" is 'seller_inventory'. Wanting a quote, an offer, availability, delivery, a visit, or to be contacted is 'contact_seller'.\n`
      : '';

    // Step 1: Plan — determine what tools to call
    const { object: plan } = await generateObject({
      model: xai('grok-4-1-fast-non-reasoning'),
      schema: planSchema,
      abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      prompt: `Analyze this user message and determine what data we need to fetch.

Recent conversation context:
${conversationHistory.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}
${listingHint}
User message: ${message}

Determine the intent and extract relevant parameters. Available intents:
- search_used: buyer wants to find used trailers/trucks on the marketplace
- search_new: buyer wants to see new trailer models from manufacturers
- compare: buyer wants to compare specific models
- specs: buyer wants detailed specs on a specific product
- financing: buyer wants payment/financing info
- equipment_weight: buyer mentions specific equipment they need to haul
- general: general question that doesn't need data lookup
- multi: needs multiple lookups (e.g., equipment weight + trailer search)
- seller_inventory: buyer asks what else the seller of the current listing has
- contact_seller: buyer wants to reach the seller of the current listing`,
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

    // Compare: specs for each named model, side by side. (The example prompt
    // offered this for months while the intent had no handler.)
    if (plan.intent === 'compare' && plan.compare) {
      const results = await Promise.all(plan.compare.map((p) => getProductSpecs(p)));
      // Only when the catalog knew at least one of them; a badge that says
      // "Comparing models" over an empty lookup is noise.
      if (results.some((r) => r.product)) {
        toolResults.push({ tool: 'compare_products', data: results });
      }
    }

    // A price question about the listing on screen gets real comparables from
    // the marketplace — without them the model invented a "comparable range".
    const hasListingSearch = toolResults.some((r) => r.tool === 'search_listings');
    if (listingContext && !hasListingSearch && PRICE_WORDS.test(message)) {
      const l = listingContext.listing;
      let comps = await searchListings({ make: l.make ?? undefined, model: l.model ?? undefined, limit: 7 });
      if (comps.listings.length <= 1 && l.model) {
        comps = await searchListings({ make: l.make ?? undefined, limit: 7 });
      }
      const others = comps.listings.filter((c) => c.id !== l.id);
      if (others.length > 0) {
        toolResults.push({ tool: 'search_listings', data: { comparable_listings: others, total: comps.total } });
      }
    }

    if (plan.intent === 'seller_inventory' && listingContext?.seller) {
      const result = await searchListings({ sellerId: listingContext.seller.id, limit: 8 });
      toolResults.push({ tool: 'seller_inventory', data: result });
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

    const offerContact = Boolean(listingContext) && (
      plan.intent === 'contact_seller' || plan.wants_seller_contact === true || wantsSellerContact(message)
    );

    const system = listingContext
      ? `${SYSTEM_PROMPT}\n\n${describeListingContext(listingContext)}${
          offerContact
            ? '\n\nTHIS TURN: the buyer wants to reach the seller. Answer what you can, then tell them in one sentence that you can send their details and this conversation to the seller — the form is right below your reply.'
            : ''
        }`
      : SYSTEM_PROMPT;

    const { text } = await generateText({
      model: xai('grok-4-1-fast-non-reasoning'),
      system,
      messages,
      maxOutputTokens: 2048,
      abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
    });

    return NextResponse.json({
      response: text,
      toolsUsed: toolResults.map(r => ({ tool: r.tool })),
      hasToolCalls: toolResults.length > 0,
      // The widget shows the seller-handoff form on this.
      offerContact,
    });
  } catch (error) {
    logger.error('Trailer finder agent error', { error });
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

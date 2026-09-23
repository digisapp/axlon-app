import { z } from 'zod';

// Common validation schemas

export const uuidSchema = z.string().uuid('Invalid ID format');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// ─── Listing validation ────────────────────────────────────────────────────
// The listing forms (new / edit / Snap & List / bulk import / smart import)
// submit every field as a string and use '' for "not set". These fields
// therefore coerce instead of rejecting: `price: "85000"` and
// `category_id: ""` used to fail validation, so "Save Changes" on the edit
// page returned 400 for every dealer with no indication why.
//
// `undefined` is passed through untouched so a partial update can tell
// "omitted" from "explicitly cleared".
const coerceEmpty = (v: unknown) => (v === undefined ? undefined : v === '' || v === null ? null : v);

const optionalNumber = (inner: z.ZodNumber) =>
  z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === '' || v === null) return null;
    if (typeof v === 'string') {
      const n = Number(v.replace(/,/g, '').trim());
      return Number.isNaN(n) ? v : n;
    }
    return v;
  }, inner.nullable().optional());

const optionalText = (max: number) =>
  z.preprocess(coerceEmpty, z.string().max(max).nullable().optional());

const optionalUuid = z.preprocess(coerceEmpty, uuidSchema.nullable().optional());

const optionalTimestamp = z.preprocess(coerceEmpty, z.string().max(40).nullable().optional());

// The DB CHECK allows fixed|negotiable|auction|call and the forms send 'call';
// 'contact' was an older spelling that the DB rejects, so normalize it here
// rather than 500ing on insert.
const priceTypeField = z.preprocess(
  (v) => (v === 'contact' ? 'call' : coerceEmpty(v)),
  z.enum(['fixed', 'negotiable', 'auction', 'call']).nullable().optional()
);

const conditionField = z.preprocess(
  coerceEmpty,
  z.enum(['new', 'used', 'certified', 'salvage']).nullable().optional()
);

const listingTypeField = z.preprocess(
  coerceEmpty,
  z.enum(['sale', 'rent', 'sale_or_rent']).nullable().optional()
);

const listingStatusValues = ['draft', 'active', 'sold', 'expired'] as const;

// Fields a client may write. ai_price_estimate, ai_price_confidence,
// is_featured, featured_until and views_count are deliberately absent: they
// are server-owned. A seller who could set ai_price_estimate would be able to
// fake a "90% below market value" badge and top the /deals page.
const listingWritableFields = {
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: optionalText(10000),
  price: optionalNumber(z.number().min(0, 'Price cannot be negative').max(100000000, 'Price too high')),
  price_type: priceTypeField,
  // DB CHECK is `year > 1900`, so 1900 itself must be rejected here.
  year: optionalNumber(z.number().int().min(1901).max(new Date().getFullYear() + 2)),
  make: optionalText(100),
  model: optionalText(100),
  vin: optionalText(17),
  mileage: optionalNumber(z.number().int().min(0).max(10000000)),
  hours: optionalNumber(z.number().int().min(0).max(1000000)),
  condition: conditionField,
  category_id: optionalUuid,
  city: optionalText(100),
  state: optionalText(100),
  zip_code: optionalText(20),
  stock_number: optionalText(100),
  // Previously missing from the schema, so the create/update routes silently
  // dropped them: a dealer could pick "For Rent", enter rates and a video and
  // get a sale listing with neither.
  video_url: optionalText(2000),
  listing_type: listingTypeField,
  rental_rate_daily: optionalNumber(z.number().min(0).max(10000000)),
  rental_rate_weekly: optionalNumber(z.number().min(0).max(10000000)),
  rental_rate_monthly: optionalNumber(z.number().min(0).max(10000000)),
  publish_at: optionalTimestamp,
  unpublish_at: optionalTimestamp,
  industries: z.array(uuidSchema).optional(),
  specs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
};

export const createListingSchema = z.object({
  ...listingWritableFields,
  status: z.enum(listingStatusValues).default('draft'),
});

// Built from the field map rather than `createListingSchema.partial()`: in
// Zod 4 `.partial()` KEEPS `.default()`, so an update that omitted `status`
// came back as 'draft' and silently unpublished the listing.
export const updateListingSchema = z
  .object({
    ...listingWritableFields,
    status: z.enum(listingStatusValues).optional(),
  })
  .partial();

// Lead validation
export const createLeadSchema = z.object({
  listing_id: uuidSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  message: z.string().max(2000, 'Message too long').optional().nullable(),
  source: z.string().max(50).optional(),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Either email or phone is required' }
);

export const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  notes: z.string().max(5000).optional().nullable(),
});

// Message validation
export const createMessageSchema = z.object({
  listing_id: uuidSchema,
  recipient_id: uuidSchema,
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
});

// Staff PIN validation
export const verifyPinSchema = z.object({
  dealer_id: uuidSchema,
  pin: z.string().regex(/^\d{4,6}$/, 'PIN must be 4-6 digits'),
  name: z.string().max(100).optional(),
  caller_phone: z.string().max(20).optional(),
});

// Conversation ID validation (format: listingId-userId)
export const conversationIdSchema = z.string().refine(
  (val) => {
    const parts = val.split('-');
    // UUID format: 8-4-4-4-12 characters
    // So conversationId should have at least 10 parts (5 for each UUID)
    if (parts.length < 10) return false;

    // Reconstruct UUIDs
    const listingId = parts.slice(0, 5).join('-');
    const userId = parts.slice(5, 10).join('-');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(listingId) && uuidRegex.test(userId);
  },
  { message: 'Invalid conversation ID format' }
);

// Helper to parse conversation ID
export function parseConversationId(conversationId: string): { listingId: string; userId: string } | null {
  const parts = conversationId.split('-');
  if (parts.length < 10) return null;

  const listingId = parts.slice(0, 5).join('-');
  const userId = parts.slice(5, 10).join('-');

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(listingId) || !uuidRegex.test(userId)) return null;

  return { listingId, userId };
}

// Trade-in validation
export const tradeInSchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  vin: z.string().max(17).optional(),
  mileage: z.number().int().min(0).max(10000000).optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(2000).optional(),
});

// AI Search query validation
export const aiSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500, 'Query too long'),
  context: z.object({
    category: z.string().optional(),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
});

// Stripe checkout validation
export const stripeCheckoutSchema = z.object({
  product: z.enum([
    'featured_week', 'featured_month', 'bump',
    'platform_monthly', 'platform_yearly',
    'voice_addon_monthly', 'voice_addon_yearly',
    'guided_setup', 'enterprise_onboarding',
  ]),
  listingId: z.string().uuid().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// Chat message validation
export const chatMessageSchema = z.object({
  dealerId: z.string().uuid(),
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  // The storefront widget has no conversation yet on the first message and
  // sends null; rejecting null 400'd EVERY message, so the widget could never
  // start a conversation at all.
  conversationId: z.string().nullish(),
  chatSettings: z.record(z.string(), z.unknown()).optional(),
});

// Chat lead capture validation
export const chatLeadSchema = z.object({
  dealerId: z.string().uuid(),
  conversationId: z.string().nullish(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
});

// Dealer AI conversation create/update (PUT /api/ai/dealer-chat)
export const dealerAiConversationSchema = z.object({
  dealerId: z.string().uuid(),
  conversationId: z.string().uuid().optional().nullable(),
  visitorName: z.string().max(100).optional().nullable(),
  visitorEmail: z.string().email().max(254).or(z.literal('')).optional().nullable(),
  visitorPhone: z.string().max(20).optional().nullable(),
  visitorIntent: z.string().max(1000).optional().nullable(),
  listingId: z.string().uuid().optional().nullable(),
});

// Favorite validation
export const favoriteSchema = z.object({
  listing_id: z.string().uuid(),
});

// Saved search validation
export const savedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  query: z.string().max(500).optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  notify_email: z.boolean().optional(),
  // DB CHECK (migration 008) allows only these; anything else 500'd on insert.
  notify_frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

export const updateSavedSearchSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  notify_email: z.boolean().optional(),
  notify_frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

// Dealer staff validation
export const createStaffSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().max(20).optional().nullable(),
  role: z.string().max(50).optional(),
  voice_pin: z.string().regex(/^\d{4,6}$/, 'PIN must be 4-6 digits'),
  access_level: z.string().max(50).optional(),
  can_view_costs: z.boolean().optional(),
  can_view_margins: z.boolean().optional(),
  can_view_all_leads: z.boolean().optional(),
  can_modify_inventory: z.boolean().optional(),
});

export const updateStaffSchema = createStaffSchema.partial();

// Dealer voice agent validation
export const voiceAgentSchema = z.object({
  agent_name: z.string().min(1).max(100).optional(),
  business_name: z.string().max(200).optional(),
  business_description: z.string().max(5000).optional(),
  greeting: z.string().max(500).optional(),
  instructions: z.string().max(5000).optional(),
  voice: z.string().max(50).optional(),
  is_active: z.boolean().optional(),
  business_hours: z.record(z.string(), z.unknown()).optional().nullable(),
  after_hours_message: z.string().max(500).optional(),
  can_search_inventory: z.boolean().optional(),
  can_capture_leads: z.boolean().optional(),
  can_transfer_calls: z.boolean().optional(),
  transfer_phone_number: z.string().max(20).optional().nullable(),
});

// Admin dealer action validation
export const adminDealerActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejection_reason: z.string().max(1000).optional(),
});

// Admin user action validation
export const adminUserActionSchema = z.object({
  action: z.enum(['suspend', 'unsuspend', 'make_admin', 'remove_admin']),
  reason: z.string().max(1000).optional(),
});

// Admin manufacturer validation
export const manufacturerSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  logo_url: z.string().url().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  website: z.string().url().optional().nullable(),
  country: z.string().max(100).optional(),
  headquarters: z.string().max(200).optional().nullable(),
  founded_year: z.number().int().min(1800).max(2100).optional().nullable(),
  equipment_types: z.array(z.string()).optional(),
  canonical_name: z.string().min(1).max(100),
  name_variations: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  feature_tier: z.string().max(50).optional(),
  feature_expires_at: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

// Trade-in offer validation
export const tradeInOfferSchema = z.object({
  offer_amount: z.number().min(0),
  message: z.string().max(5000).optional(),
  email: z.string().email(),
});

// Listing images validation
// Only allow images hosted on our Supabase storage domain to prevent XSS via malicious URLs
function isTrustedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://localhost').hostname;
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === supabaseHost || parsed.hostname.endsWith('.supabase.co'))
    );
  } catch {
    return false;
  }
}

const trustedImageUrl = z.string().url().refine(isTrustedImageUrl, {
  message: 'Image URL must be hosted on trusted storage',
});

export const listingImagesSchema = z.object({
  images: z.array(z.object({
    url: trustedImageUrl,
    thumbnail_url: trustedImageUrl.optional().nullable(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
    // /api/ai/analyze returns an object and both upload paths forward it
    // verbatim into a JSONB column; demanding a string here rejected the whole
    // images array, so photos were never attached whenever analysis succeeded.
    ai_analysis: z
      .union([z.string().max(4000), z.record(z.string(), z.unknown())])
      .nullable()
      .optional(),
  })).min(1).max(50),
});

export const updateImagesOrderSchema = z.object({
  images: z.array(z.object({
    id: z.string().uuid(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional(),
  })).min(1),
});

// Conversation reply validation
export const conversationReplySchema = z.object({
  message: z.string().min(1, 'Reply cannot be empty').max(5000, 'Reply too long'),
});

// Dashboard lead creation (different from public createLeadSchema)
export const dashboardCreateLeadSchema = z.object({
  listing_id: uuidSchema.optional(),
  // Optional and ignored: the route forces the authenticated user's id.
  // Trusting the body let any account create leads in another dealer's pipeline.
  user_id: uuidSchema.optional(),
  buyer_name: z.string().min(1, 'Name is required').max(100),
  buyer_email: z.string().email('Invalid email address'),
  buyer_phone: z.string().max(20).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

// AI lead update validation
export const aiLeadUpdateSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  notes: z.string().max(5000).optional(),
});

// AI lead notification validation (internal)
export const aiLeadNotificationSchema = z.object({
  dealerId: z.string().uuid(),
  leadId: z.string().uuid(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  subject: z.string().max(100).optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  plan: z.string().max(50).optional().or(z.literal('')),
});

// Trade-in request validation
export const tradeInRequestSchema = z.object({
  contact_name: z.string().min(1).max(100),
  contact_email: z.string().email(),
  contact_phone: z.string().max(20).optional().nullable(),
  equipment_year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
  equipment_make: z.string().min(1).max(100),
  equipment_model: z.string().min(1).max(100),
  equipment_vin: z.string().max(17).optional().nullable(),
  equipment_mileage: z.number().int().min(0).optional().nullable(),
  equipment_hours: z.number().int().min(0).optional().nullable(),
  // The form initialises these to '' — which is neither undefined nor null —
  // so every /trade-in submission was rejected with 400.
  equipment_condition: z.preprocess(
    coerceEmpty,
    z.enum(['excellent', 'good', 'fair', 'poor']).nullable().optional()
  ),
  equipment_description: optionalText(5000),
  photos: z.array(z.string().url()).optional(),
  interested_listing_id: optionalUuid,
  interested_category_id: optionalUuid,
  purchase_timeline: optionalText(100),
});

// Admin voice agent create (includes dealer_id)
export const adminVoiceAgentCreateSchema = z.object({
  dealer_id: z.string().uuid(),
  phone_number: z.string().max(20).optional().nullable(),
  phone_number_id: z.string().max(100).optional().nullable(),
  agent_name: z.string().max(100).optional(),
  voice: z.string().max(50).optional(),
  greeting: z.string().max(500).optional(),
  instructions: z.string().max(5000).optional().nullable(),
  business_name: z.string().max(200).optional(),
  business_description: z.string().max(5000).optional().nullable(),
  business_hours: z.record(z.string(), z.unknown()).optional().nullable(),
  after_hours_message: z.string().max(500).optional().nullable(),
  can_search_inventory: z.boolean().optional(),
  can_capture_leads: z.boolean().optional(),
  can_transfer_calls: z.boolean().optional(),
  transfer_phone_number: z.string().max(20).optional().nullable(),
  plan_tier: z.string().max(50).optional(),
  minutes_included: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

// Admin voice agent update (all fields optional, including admin-only fields)
export const adminVoiceAgentUpdateSchema = z.object({
  phone_number: z.string().max(20).optional().nullable(),
  phone_number_id: z.string().max(100).optional().nullable(),
  agent_name: z.string().max(100).optional(),
  voice: z.string().max(50).optional(),
  greeting: z.string().max(500).optional(),
  instructions: z.string().max(5000).optional().nullable(),
  business_name: z.string().max(200).optional(),
  business_description: z.string().max(5000).optional().nullable(),
  business_hours: z.record(z.string(), z.unknown()).optional().nullable(),
  after_hours_message: z.string().max(500).optional().nullable(),
  can_search_inventory: z.boolean().optional(),
  can_capture_leads: z.boolean().optional(),
  can_transfer_calls: z.boolean().optional(),
  transfer_phone_number: z.string().max(20).optional().nullable(),
  plan_tier: z.string().max(50).optional(),
  minutes_included: z.number().int().min(0).optional(),
  minutes_used: z.number().int().min(0).optional(),
  billing_cycle_start: z.string().optional().nullable(),
  stripe_subscription_id: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  is_provisioned: z.boolean().optional(),
  activated_at: z.string().optional().nullable(),
});

// Admin dealer staff PATCH (action-based or field updates)
export const adminStaffPatchSchema = z.object({
  action: z.enum(['unlock', 'reset_pin', 'disable', 'enable']).optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.string().max(50).optional(),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().max(20).optional().nullable(),
  access_level: z.string().max(50).optional(),
  can_view_costs: z.boolean().optional(),
  can_view_margins: z.boolean().optional(),
  can_view_all_leads: z.boolean().optional(),
  can_modify_inventory: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// New trailers query validation
export const newTrailersQuerySchema = z.object({
  manufacturer: z.string().optional(),
  type: z.string().optional(),
  tonnage_min: z.coerce.number().int().min(0).optional(),
  tonnage_max: z.coerce.number().int().max(500).optional(),
  deck_height_max: z.coerce.number().optional(),
  axle_count: z.coerce.number().int().optional(),
  gooseneck: z.string().optional(),
  q: z.string().max(500).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  sort: z.enum(['name', 'tonnage', 'deck_height', 'newest', 'manufacturer']).default('manufacturer'),
});

// Knowledge Base validation
export const kbActionSchema = z.object({
  action: z.enum(['enable', 'disable']),
});

export const kbSyncSchema = z.object({
  listing_id: z.string().uuid().optional(),
});

export const kbDocumentUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000).optional(),
  document_type: z.enum(['spec_sheet', 'warranty', 'policy', 'brochure', 'price_list', 'general']).default('general'),
});

// CRM Contact validation
export const createCrmContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email').max(254).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).default('new'),
  source: z.enum(['manual', 'ai_chat', 'website', 'storefront', 'outreach', 'referral']).default('manual'),
  notes: z.string().max(5000).optional().or(z.literal('')),
  deal_value: z.coerce.number().min(0).max(999999999999).default(0),
});

// NOT `createCrmContactSchema.partial()`: Zod 4 keeps `.default()` through
// `.partial()`, so a kanban drag that sent only `{status}` also wrote
// deal_value 0 and source 'manual' — wiping the value and provenance of the
// contact it was moving.
export const updateCrmContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).optional(),
  email: z.string().email('Invalid email').max(254).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional(),
  source: z.enum(['manual', 'ai_chat', 'website', 'storefront', 'outreach', 'referral']).optional(),
  notes: z.string().max(5000).optional().or(z.literal('')),
  deal_value: z.coerce.number().min(0).max(999999999999).optional(),
});

export const createCrmActivitySchema = z.object({
  contact_id: z.string().uuid(),
  type: z.enum(['note', 'call', 'email', 'meeting', 'deal_update']),
  description: z.string().min(1, 'Description is required').max(5000),
});

/**
 * Helper to validate request body with Zod schema
 * Returns parsed data or throws formatted error
 */
export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    throw new ValidationError('Validation failed', errors);
  }

  return result.data;
}

export class ValidationError extends Error {
  public errors: Array<{ field: string; message: string }>;

  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

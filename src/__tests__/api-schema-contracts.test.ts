import { describe, it, expect } from 'vitest';
import {
  createListingSchema,
  updateListingSchema,
  chatMessageSchema,
  chatLeadSchema,
  tradeInRequestSchema,
  listingImagesSchema,
  updateCrmContactSchema,
} from '@/lib/validations/api';

/**
 * These schemas sit between forms that submit strings and a database with real
 * types. Every case below is a bug that shipped to production and was silent
 * from the user's side: the request 400'd and the UI only said "failed".
 *
 * They are contract tests, not validation trivia — each one pins the exact
 * payload a real screen sends.
 */

describe('listing schemas accept what the listing forms actually send', () => {
  // src/app/dashboard/listings/[id]/edit/page.tsx keeps every field as form
  // state, so numbers arrive as strings and unset selects as ''.
  const editFormPayload = {
    title: '2020 Trail King TK80 Lowboy',
    category_id: '',
    price: '85000',
    price_type: 'call',
    condition: '',
    year: '2020',
    make: 'Trail King',
    model: 'TK80',
    vin: '',
    mileage: '',
    hours: '1200',
    description: 'Clean unit.',
    city: 'Dallas',
    state: 'TX',
    zip_code: '75201',
    video_url: '',
    status: 'active' as const,
    specs: { axles: '3' },
    publish_at: '',
    unpublish_at: '',
  };

  it('saves an edit-form payload with stringified numbers and empty selects', () => {
    const result = updateListingSchema.safeParse(editFormPayload);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.price).toBe(85000);
    expect(result.data.year).toBe(2020);
    expect(result.data.hours).toBe(1200);
    // '' means "not set", not "invalid uuid"
    expect(result.data.category_id).toBeNull();
    expect(result.data.condition).toBeNull();
    expect(result.data.mileage).toBeNull();
  });

  it('accepts "Call for Price", which the DB spells `call`', () => {
    const parsed = createListingSchema.parse({ title: 'A lowboy trailer', price_type: 'call' });
    expect(parsed.price_type).toBe('call');
  });

  it('normalizes the legacy `contact` price type the DB would reject', () => {
    const parsed = createListingSchema.parse({ title: 'A lowboy trailer', price_type: 'contact' });
    expect(parsed.price_type).toBe('call');
  });

  it('keeps rental and video fields instead of dropping them', () => {
    const parsed = createListingSchema.parse({
      title: 'A rental lowboy',
      listing_type: 'rent',
      rental_rate_daily: '450',
      rental_rate_weekly: '2200',
      rental_rate_monthly: '7500',
      video_url: 'https://example.com/walkaround.mp4',
    });
    expect(parsed.listing_type).toBe('rent');
    expect(parsed.rental_rate_daily).toBe(450);
    expect(parsed.rental_rate_weekly).toBe(2200);
    expect(parsed.rental_rate_monthly).toBe(7500);
    expect(parsed.video_url).toBe('https://example.com/walkaround.mp4');
  });

  it('does not default status on a partial update', () => {
    // Zod's .partial() keeps .default(), which silently unpublished a listing
    // whenever an update omitted `status`.
    const parsed = updateListingSchema.parse({ title: 'Just a title change' });
    expect('status' in parsed ? parsed.status : undefined).toBeUndefined();
  });

  it('rejects a year the DB CHECK would reject', () => {
    expect(createListingSchema.safeParse({ title: 'Old trailer', year: 1900 }).success).toBe(false);
  });

  it('accepts a null description, which bulk CSV import sends', () => {
    expect(createListingSchema.safeParse({ title: 'A trailer', description: null }).success).toBe(true);
  });

  it('never lets a client set server-owned pricing or placement fields', () => {
    const parsed = createListingSchema.parse({
      title: 'A trailer',
      ai_price_estimate: 999999,
      ai_price_confidence: 1,
      is_featured: true,
      views_count: 5000,
    } as Record<string, unknown>);
    expect(parsed).not.toHaveProperty('ai_price_estimate');
    expect(parsed).not.toHaveProperty('ai_price_confidence');
    expect(parsed).not.toHaveProperty('is_featured');
    expect(parsed).not.toHaveProperty('views_count');
  });
});

describe('storefront chat', () => {
  // src/components/storefront/ChatWidget.tsx has no conversation yet on the
  // first message and posts conversationId: null. Rejecting null 400'd every
  // message, so the widget could never start a conversation at all.
  it('accepts a null conversationId on the first message', () => {
    const result = chatMessageSchema.safeParse({
      dealerId: '3d03c1b8-48d4-4aa2-a829-fb83cf0d082f',
      message: 'Do you have a 55-ton lowboy?',
      conversationId: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a null conversationId when capturing the lead', () => {
    const result = chatLeadSchema.safeParse({
      dealerId: '3d03c1b8-48d4-4aa2-a829-fb83cf0d082f',
      conversationId: null,
      name: 'Sam Rivera',
      email: 'sam@example.com',
    });
    expect(result.success).toBe(true);
  });
});

describe('trade-in request', () => {
  it('accepts the form payload where optional ids and condition are empty', () => {
    const result = tradeInRequestSchema.safeParse({
      contact_name: 'Sam Rivera',
      contact_email: 'sam@example.com',
      contact_phone: '',
      equipment_make: 'Trail King',
      equipment_model: 'TK80',
      equipment_vin: '',
      equipment_condition: '',
      interested_listing_id: '',
      interested_category_id: '',
      purchase_timeline: '',
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.interested_listing_id).toBeNull();
    expect(result.data.equipment_condition).toBeNull();
  });
});

describe('listing images', () => {
  const url = 'https://example.supabase.co/storage/v1/object/public/listing-images/u/1.jpg';

  it('accepts the AI analysis object both upload paths send', () => {
    const result = listingImagesSchema.safeParse({
      images: [{ url, is_primary: true, sort_order: 0, ai_analysis: { detected_make: 'Trail King' } }],
    });
    expect(result.success).toBe(true);
  });

  it('still accepts a plain string analysis', () => {
    const result = listingImagesSchema.safeParse({ images: [{ url, ai_analysis: 'a lowboy trailer' }] });
    expect(result.success).toBe(true);
  });
});

describe('CRM contact update', () => {
  it('writes only the field the kanban moved', () => {
    // .partial() on a schema with .default() re-sent deal_value 0 and
    // source 'manual', wiping the value and provenance of every contact
    // dragged between columns.
    const parsed = updateCrmContactSchema.parse({ status: 'won' });
    expect(parsed).toEqual({ status: 'won' });
  });
});

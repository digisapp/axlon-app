import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCollection } from '@/lib/ai/collections';
import { syncAllListings } from '@/lib/ai/listing-sync';
import { kbActionSchema, validateBody, ValidationError } from '@/lib/validations/api';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

// GET - Knowledge base status
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get KB settings
  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id, xai_collection_status, xai_collection_error, knowledge_base_enabled')
    .eq('dealer_id', user.id)
    .single();

  // Count synced listing docs
  const { count: listingDocCount } = await supabase
    .from('dealer_kb_listing_docs')
    .select('id', { count: 'exact', head: true })
    .eq('dealer_id', user.id);

  // Count custom documents
  const { count: customDocCount } = await supabase
    .from('dealer_kb_documents')
    .select('id', { count: 'exact', head: true })
    .eq('dealer_id', user.id);

  // Count error docs
  const { count: errorCount } = await supabase
    .from('dealer_kb_listing_docs')
    .select('id', { count: 'exact', head: true })
    .eq('dealer_id', user.id)
    .eq('sync_status', 'error');

  return NextResponse.json({
    enabled: settings?.knowledge_base_enabled ?? false,
    collection_status: settings?.xai_collection_status ?? 'none',
    collection_error: settings?.xai_collection_error ?? null,
    listing_docs: listingDocCount ?? 0,
    custom_docs: customDocCount ?? 0,
    error_docs: errorCount ?? 0,
  });
}

// POST - Enable or disable KB
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(identifier, {
    ...RATE_LIMITS.standard,
    prefix: 'ratelimit:kb-action',
  });
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name')
    .eq('id', user.id)
    .single();

  const body = await request.json();
  let validated;
  try {
    validated = validateBody(kbActionSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    throw err;
  }

  if (validated.action === 'enable') {
    // Check if already active
    const { data: existing } = await supabase
      .from('dealer_ai_settings')
      .select('xai_collection_id, xai_collection_status')
      .eq('dealer_id', user.id)
      .single();

    if (existing?.xai_collection_status === 'active') {
      return NextResponse.json({ message: 'Knowledge base already active' });
    }

    // Mark as creating
    await supabase
      .from('dealer_ai_settings')
      .update({
        xai_collection_status: 'creating',
        knowledge_base_enabled: true,
        xai_collection_error: null,
      })
      .eq('dealer_id', user.id);

    try {
      const collectionName = `${profile.company_name || 'Dealer'} - ${user.id.slice(0, 8)}`;
      const { collection_id } = await createCollection(
        collectionName,
        `Knowledge base for dealer ${profile.company_name || user.id}`
      );

      await supabase
        .from('dealer_ai_settings')
        .update({
          xai_collection_id: collection_id,
          xai_collection_status: 'active',
        })
        .eq('dealer_id', user.id);

      // Fire-and-forget: initial sync of all listings
      syncAllListings(user.id).catch(e =>
        logger.error('Initial KB sync failed', { error: e, dealerId: user.id })
      );

      return NextResponse.json({
        message: 'Knowledge base enabled',
        collection_id,
        status: 'active',
      });
    } catch (error) {
      logger.error('Failed to create xAI collection', { error, dealerId: user.id });
      await supabase
        .from('dealer_ai_settings')
        .update({
          xai_collection_status: 'error',
          xai_collection_error: error instanceof Error ? error.message : 'Failed to create collection',
        })
        .eq('dealer_id', user.id);

      return NextResponse.json({ error: 'Failed to create knowledge base' }, { status: 500 });
    }
  }

  if (validated.action === 'disable') {
    await supabase
      .from('dealer_ai_settings')
      .update({
        knowledge_base_enabled: false,
      })
      .eq('dealer_id', user.id);

    return NextResponse.json({ message: 'Knowledge base disabled' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

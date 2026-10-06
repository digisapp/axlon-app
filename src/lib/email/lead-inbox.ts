/**
 * Leads in the admin inbox.
 *
 * - recordLeadInInbox(): every new platform lead (AXLON AI inquiries,
 *   microsite forms, chat leads, inquiries on Axleyard's own listings) is
 *   written into /admin/email as a conversation with the person, flagged
 *   "New lead", with a suggested reply. Answering it is answering them.
 * - loadLeadContext(): what the lead card shows next to a conversation.
 * - draftContextFor() / redraftLatest(): the facts an AI draft may use.
 *
 * Dealer leads never come here; see lead-link.ts for the ownership rule.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';
import { classifyAndDraftReply, type DraftContext } from '@/lib/ai/email-classifier';
import { AdminInboxService, type EmailMetadata, type EmailRow } from './admin-inbox';
import { getInboundAddress, isValidEmail } from './inbound-address';
import { exactIlike, isPlatformLeadOwner, sameAddress } from './lead-link';
import { isLikelySpam } from './spam';

export interface LeadContext {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  sourceLabel: string;
  message: string | null;
  productInterest: string | null;
  createdAt: string;
  listing: {
    id: string;
    title: string | null;
    price: number | null;
    priceType: string | null;
    location: string | null;
    status: string | null;
    url: string;
  } | null;
  site: { name: string; domain: string } | null;
}

interface LeadRow {
  id: string;
  user_id: string | null;
  listing_id: string | null;
  microsite_id: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  message: string | null;
  status: string;
  source: string | null;
  product_interest: string | null;
  created_at: string;
}

interface ListingRow {
  id: string;
  title: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  price: number | null;
  price_type: string | null;
  condition: string | null;
  city: string | null;
  state: string | null;
  mileage: number | null;
  hours: number | null;
  stock_number: string | null;
  status: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Listing inquiry',
  axlonai_contact: 'AXLON AI inquiry',
  microsite: 'Microsite form',
  chat: 'Chat widget',
  website: 'Website',
  phone_call: 'Phone call',
};

export function leadSourceLabel(source: string | null | undefined): string {
  return (source && SOURCE_LABELS[source]) || (source ? source.replace(/_/g, ' ') : 'Website');
}

function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://axleyard.com').replace(/\/+$/, '');
}

function location(l: Pick<ListingRow, 'city' | 'state'> | null): string | null {
  return l ? [l.city, l.state].filter(Boolean).join(', ') || null : null;
}

async function loadLead(leadId: string): Promise<{ lead: LeadRow; listing: ListingRow | null; site: { name: string; domain: string } | null } | null> {
  const supabase = createAdminClient();
  const { data: lead } = await supabase
    .from('leads')
    .select('id, user_id, listing_id, microsite_id, buyer_name, buyer_email, buyer_phone, message, status, source, product_interest, created_at')
    .eq('id', leadId)
    .maybeSingle();
  if (!lead) return null;
  const [{ data: listing }, { data: site }] = await Promise.all([
    lead.listing_id
      ? supabase
          .from('listings')
          .select('id, title, year, make, model, price, price_type, condition, city, state, mileage, hours, stock_number, status')
          .eq('id', lead.listing_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    lead.microsite_id
      ? supabase.from('microsites').select('name, domain').eq('id', lead.microsite_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  return { lead: lead as LeadRow, listing: (listing as ListingRow | null) ?? null, site: (site as { name: string; domain: string } | null) ?? null };
}

/** The lead card's data, or null when the lead is gone or is a dealer's. */
export async function loadLeadContext(leadId: string): Promise<LeadContext | null> {
  const loaded = await loadLead(leadId);
  if (!loaded || !(await isPlatformLeadOwner(loaded.lead.user_id))) return null;
  const { lead, listing, site } = loaded;
  return {
    id: lead.id,
    name: lead.buyer_name,
    email: lead.buyer_email,
    phone: lead.buyer_phone,
    status: lead.status,
    source: lead.source,
    sourceLabel: leadSourceLabel(lead.source),
    message: lead.message,
    productInterest: lead.product_interest,
    createdAt: lead.created_at,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title || [listing.year, listing.make, listing.model].filter(Boolean).join(' ') || null,
          price: listing.price,
          priceType: listing.price_type,
          location: location(listing),
          status: listing.status,
          url: `${appUrl()}/listing/${listing.id}`,
        }
      : null,
    site,
  };
}

/** What an AI draft for a conversation with this lead may rely on. */
export async function draftContextFor(leadId: string | null | undefined): Promise<DraftContext | null> {
  if (!leadId) return null;
  const loaded = await loadLead(leadId).catch(() => null);
  if (!loaded || !(await isPlatformLeadOwner(loaded.lead.user_id))) return null;
  const { lead, listing, site } = loaded;
  return {
    lead: {
      name: lead.buyer_name,
      phoneOnFile: !!lead.buyer_phone?.trim(),
      source: leadSourceLabel(lead.source),
      site: site ? `${site.name} (${site.domain})` : null,
      productInterest: lead.product_interest,
      message: lead.message,
    },
    listing: listing
      ? {
          title: listing.title,
          year: listing.year,
          make: listing.make,
          model: listing.model,
          price: listing.price,
          priceType: listing.price_type,
          condition: listing.condition,
          location: location(listing),
          mileage: listing.mileage,
          hours: listing.hours,
          stockNumber: listing.stock_number,
          status: listing.status,
          url: `${appUrl()}/listing/${listing.id}`,
        }
      : null,
  };
}

/**
 * The lead alert as stored: the subject the person will see when answered
 * ("Re: <subject>"), and a text body that leads with their own words so the
 * inbox preview shows what they said. Pure.
 */
export function buildLeadAlert(input: {
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  source: string | null;
  productInterest: string | null;
  listing: { title: string | null; price: number | null; url: string } | null;
  site: { name: string; domain: string } | null;
}): { subject: string; text: string } {
  const listingTitle = input.listing?.title?.trim() || null;
  const subject = (listingTitle || input.productInterest?.trim() || (input.site ? `Your ${input.site.name} inquiry` : 'Your Axleyard inquiry'))
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 200);
  const price = typeof input.listing?.price === 'number' && input.listing.price > 0 ? `$${Math.round(input.listing.price).toLocaleString('en-US')}` : null;
  const details: Array<[string, string | null]> = [
    ['Name', input.name?.trim() || null],
    ['Email', input.email],
    ['Phone', input.phone?.trim() || null],
    ['Interested in', input.productInterest?.trim() || null],
    ['Listing', input.listing ? [listingTitle, price, input.listing.url].filter(Boolean).join(' · ') : null],
    ['Site', input.site ? `${input.site.name} (${input.site.domain})` : null],
  ];
  const own = input.message?.trim() || '(No message — they only left their details.)';
  const text = [
    own,
    '',
    `New lead · ${leadSourceLabel(input.source)}`,
    ...details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
  ].join('\n');
  return { subject, text };
}

/**
 * Write a new platform lead into the admin inbox. Idempotent per lead, best
 * effort (a failure is logged, never thrown at the lead form), and never
 * auto-replies: a web form proves nothing about who typed the address.
 */
export async function recordLeadInInbox(leadId: string, opts: { draft?: boolean } = {}): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const loaded = await loadLead(leadId);
    if (!loaded) return null;
    const { lead, listing, site } = loaded;
    const email = (lead.buyer_email || '').trim().toLowerCase();
    if (!isValidEmail(email)) return null;
    if (!(await isPlatformLeadOwner(lead.user_id))) return null;

    const { data: existing } = await supabase
      .from('emails')
      .select('thread_id')
      .contains('metadata', { kind: 'lead_alert', lead_id: lead.id })
      .limit(1);
    if (existing && existing.length > 0) return existing[0].thread_id as string;

    const alert = buildLeadAlert({
      name: lead.buyer_name,
      email,
      phone: lead.buyer_phone,
      message: lead.message,
      source: lead.source,
      productInterest: lead.product_interest,
      listing: listing
        ? { title: listing.title || [listing.year, listing.make, listing.model].filter(Boolean).join(' ') || null, price: listing.price, url: `${appUrl()}/listing/${listing.id}` }
        : null,
      site,
    });
    const spam = isLikelySpam({ from: email, subject: alert.subject, text: lead.message }).spam;

    const ownerId = await AdminInboxService.inboxOwnerId();
    if (!ownerId) {
      logger.error('Inbox: no admin profile to own lead alert', { leadId });
      return null;
    }
    const { data: profiles } = email.includes('*')
      ? { data: [] as Array<{ id: string; email: string }> }
      : await supabase.from('profiles').select('id, email').ilike('email', exactIlike(email)).limit(5);
    const profile = (profiles ?? []).find((p) => sameAddress(p.email as string, email)) ?? null;

    const { data: thread, error: threadError } = await supabase
      .from('email_threads')
      .insert({
        subject: alert.subject,
        owner_id: ownerId,
        participant_email: email,
        participant_name: lead.buyer_name?.replace(/[\r\n<>"]+/g, ' ').trim().slice(0, 120) || null,
        status: 'received',
        is_unread: true,
        is_spam: spam,
        lead_id: lead.id,
        listing_id: lead.listing_id,
        linked_profile_id: (profile?.id as string | undefined) ?? null,
      })
      .select('id')
      .single();
    if (threadError || !thread) {
      logger.error('Inbox: could not create lead-alert thread', { error: threadError, leadId });
      return null;
    }

    const metadata: EmailMetadata & { message: string | null } = {
      kind: 'lead_alert',
      lead_id: lead.id,
      source: lead.source,
      message: lead.message?.slice(0, 4000) ?? null,
    };
    const { data: row, error: emailError } = await supabase
      .from('emails')
      .insert({
        thread_id: thread.id,
        direction: 'inbound',
        from_email: email,
        from_name: lead.buyer_name,
        to_email: getInboundAddress(),
        subject: alert.subject,
        text_body: alert.text,
        status: 'received',
        is_read: false,
        headers: {},
        metadata,
        created_at: lead.created_at,
      })
      .select('id')
      .single();
    if (emailError || !row) {
      logger.error('Inbox: could not store lead alert', { error: emailError, leadId });
      await supabase.from('email_threads').delete().eq('id', thread.id);
      return null;
    }

    if (opts.draft !== false && !spam && process.env.XAI_API_KEY) {
      try {
        const context = await draftContextFor(lead.id);
        const result = await classifyAndDraftReply(
          { fromEmail: email, fromName: lead.buyer_name, subject: alert.subject, bodyText: lead.message || '(they left only their contact details)', bodyHtml: null },
          context,
        );
        await AdminInboxService.updateAiFields(row.id as string, {
          ai_category: result.category,
          ai_confidence: result.confidence,
          ai_summary: result.summary,
          ai_draft_html: result.draftHtml || null,
          ai_draft_text: result.draftText || null,
        });
      } catch (err) {
        logger.error('Inbox: lead-alert draft failed', { error: err, leadId });
      }
    }
    return thread.id as string;
  } catch (err) {
    logger.error('Inbox: recordLeadInInbox failed', { error: err, leadId });
    return null;
  }
}

/**
 * Write a fresh AI draft for the newest message in a conversation ("New
 * draft" in the UI). Returns the updated email, or an error message.
 */
export async function redraftLatest(threadId: string): Promise<{ ok: true; email: EmailRow } | { ok: false; error: string; status: 404 | 409 | 503 }> {
  if (!process.env.XAI_API_KEY) return { ok: false, error: 'AI drafts are off: XAI_API_KEY is not set', status: 503 };
  const data = await AdminInboxService.getThread(threadId);
  if (!data) return { ok: false, error: 'Conversation not found', status: 404 };
  const latest = [...data.emails].reverse().find((e) => e.direction === 'inbound');
  if (!latest) return { ok: false, error: 'There is no message from them to answer yet', status: 409 };
  if (data.thread.is_spam) return { ok: false, error: 'This conversation is in Spam', status: 409 };

  const alert = latest.metadata?.kind === 'lead_alert';
  const ownWords = alert ? ((latest.metadata as { message?: string | null } | null)?.message || '(they left only their contact details)') : latest.text_body;
  const result = await classifyAndDraftReply(
    { fromEmail: latest.from_email, fromName: latest.from_name, subject: latest.subject, bodyText: ownWords, bodyHtml: alert ? null : latest.html_body },
    await draftContextFor(data.thread.lead_id),
  );
  if (!result.draftText) return { ok: false, error: 'The AI could not write a draft this time. Try again.', status: 503 };
  await AdminInboxService.updateAiFields(latest.id, {
    ai_category: result.category,
    ai_confidence: result.confidence,
    ai_summary: result.summary,
    ai_draft_html: result.draftHtml,
    ai_draft_text: result.draftText,
  });
  const email = await AdminInboxService.getEmail(latest.id);
  return email ? { ok: true, email } : { ok: false, error: 'Conversation not found', status: 404 };
}

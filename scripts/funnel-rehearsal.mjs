#!/usr/bin/env node
/**
 * End-to-end rehearsal of the dealer lead-capture funnel against PRODUCTION.
 *
 * Creates a throwaway dealer whose email is Resend's `delivered@resend.dev`
 * sink (every notification really sends but is delivered nowhere), then drives:
 *   1. storefront chat  → POST /api/chat
 *   2. lead capture     → PUT /api/ai/dealer-chat   (dealer_ai_leads + 4-step drip queued)
 *   3. contact form     → POST /api/leads           (leads + AI inbox draft + dealer email)
 *   4. follow-up drip   → GET /api/cron/lead-followups on a LOCAL `next start`
 *                         (needs CRON_SECRET in .env.local; prod's cron is inert
 *                          until the same secret is set in Vercel)
 * and verifies each step in the database. Everything it created is deleted
 * at the end unless --keep is passed.
 *
 *   PORT=3111 npm run start &            # for step 4 (optional; step is skipped if unreachable)
 *   node scripts/funnel-rehearsal.mjs                # target https://axleyard.com
 *   node scripts/funnel-rehearsal.mjs --base http://localhost:3111
 *   node scripts/funnel-rehearsal.mjs --keep         # leave the test dealer in place
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });
dotenv.config();

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i !== -1 ? argv[i + 1] : d; };
const BASE = arg('--base', 'https://axleyard.com');
const CRON_BASE = arg('--cron-base', 'http://localhost:3111');
const KEEP = argv.includes('--keep');
const SINK = 'delivered@resend.dev';
const NIL = '00000000-0000-0000-0000-000000000000';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const results = [];
const step = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

// Minimal cookie jar so the visitor fingerprint cookie from /api/chat is sent
// back on the lead-capture PUT, exactly as the browser widget does.
const jar = new Map();
const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
function absorbCookies(res) {
  const raw = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  for (const c of raw) {
    const [pair] = c.split(';');
    const eq = pair.indexOf('=');
    if (eq > 0) jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}
async function call(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader(), ...(init.headers || {}) },
  });
  absorbCookies(res);
  let body = null;
  try { body = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, body };
}

const created = { userId: null, listingId: null, leadIds: [], aiLeadIds: [], conversationIds: [] };
const slug = `rehearsal-${randomUUID().slice(0, 8)}`;

try {
  // ── 0. Test dealer ────────────────────────────────────────────────────
  const { data: existing } = await db.from('profiles').select('id').eq('email', SINK).maybeSingle();
  if (existing) {
    console.log('reusing existing sink profile', existing.id);
    created.userId = existing.id;
  } else {
    const { data: u, error } = await db.auth.admin.createUser({
      email: SINK,
      password: randomUUID(),
      email_confirm: true,
      user_metadata: { company_name: 'Axleyard Rehearsal Dealer', is_business: true },
    });
    if (error) throw new Error(`createUser: ${error.message}`);
    created.userId = u.user.id;
  }
  const dealerId = created.userId;

  const { error: pErr } = await db.from('profiles').upsert(
    {
      id: dealerId, email: SINK, company_name: 'Axleyard Rehearsal Dealer', slug, is_business: true,
      chat_enabled: true, phone: '+1 469 555 0100', city: 'Dallas', state: 'TX',
    },
    { onConflict: 'id' }
  );
  step('create test dealer profile', !pErr, pErr?.message || dealerId);

  const { error: sErr } = await db
    .from('dealer_ai_settings')
    .upsert({ dealer_id: dealerId, is_enabled: true, specialties: ['lowboy trailers'] }, { onConflict: 'dealer_id' });
  step('enable dealer AI settings', !sErr, sErr?.message || '');

  const { data: listing, error: lErr } = await db
    .from('listings')
    .insert({
      user_id: dealerId, title: 'Rehearsal 2024 Trail King TK110HDG 55 Ton Lowboy', price: 89500,
      price_type: 'negotiable', condition: 'used', year: 2024, make: 'Trail King', model: 'TK110HDG',
      city: 'Dallas', state: 'TX', status: 'active',
      description: 'Rehearsal listing created by scripts/funnel-rehearsal.mjs — deleted automatically.',
    })
    .select('id')
    .single();
  step('create test listing', !lErr, lErr?.message || listing?.id);
  created.listingId = listing?.id ?? null;

  // ── 1. Storefront chat ────────────────────────────────────────────────
  const chat = await call('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ dealerId, message: 'Do you have any 55 ton lowboys in stock?' }),
  });
  const convId = chat.body?.conversationId;
  if (convId) created.conversationIds.push(convId);
  step(
    'POST /api/chat answers and opens a conversation',
    chat.status === 200 && !!convId && !!chat.body?.response,
    `status ${chat.status}${chat.body?.response ? ' · "' + chat.body.response.slice(0, 70) + '…"' : ' · ' + JSON.stringify(chat.body).slice(0, 120)}`
  );
  step('visitor cookie set', jar.has('axlon_chat_visitor'));

  // ── 2. Lead capture from the chat widget ──────────────────────────────
  const lead = await call('/api/ai/dealer-chat', {
    method: 'PUT',
    body: JSON.stringify({
      dealerId, conversationId: convId, visitorName: 'Rehearsal Buyer', visitorEmail: SINK,
      visitorPhone: '+1 214 555 0199', visitorIntent: '55 ton lowboy',
    }),
  });
  step(
    'PUT /api/ai/dealer-chat captures the lead',
    lead.status === 200 && lead.body?.leadCaptured === true && !!lead.body?.leadId,
    `status ${lead.status} · ${JSON.stringify(lead.body).slice(0, 120)}`
  );
  if (lead.body?.leadId) created.aiLeadIds.push(lead.body.leadId);

  const { data: aiLead } = await db
    .from('dealer_ai_leads').select('id, visitor_email, status').eq('id', lead.body?.leadId ?? NIL).maybeSingle();
  step('dealer_ai_leads row exists', !!aiLead, aiLead ? `status=${aiLead.status}` : 'missing');

  const { data: queue } = await db
    .from('lead_followup_queue').select('id, step, status, scheduled_at').eq('lead_id', aiLead?.id ?? NIL).order('step');
  step(
    '4-step follow-up drip queued by trigger',
    (queue?.length ?? 0) === 4,
    `${queue?.length ?? 0} rows: ${(queue || []).map((q) => `step${q.step}=${q.status}`).join(', ')}`
  );

  const dup = await call('/api/ai/dealer-chat', {
    method: 'PUT',
    body: JSON.stringify({ dealerId, conversationId: convId, visitorName: 'Rehearsal Buyer', visitorEmail: SINK }),
  });
  step(
    'repeat submission reuses the lead (no second drip)',
    dup.body?.leadId === lead.body?.leadId,
    `leadId ${dup.body?.leadId === lead.body?.leadId ? 'unchanged' : 'DIFFERENT'}`
  );

  // ── 3. Contact Seller form → /api/leads ───────────────────────────────
  const csrf = await call('/api/csrf');
  step('GET /api/csrf issues a token', csrf.status === 200 && !!csrf.body?.csrfToken);

  const inquiry = await call('/api/leads', {
    method: 'POST',
    headers: { 'x-csrf-token': csrf.body?.csrfToken || '' },
    body: JSON.stringify({
      listing_id: created.listingId, seller_id: dealerId, buyer_name: 'Rehearsal Buyer', buyer_email: SINK,
      buyer_phone: '+1 214 555 0199',
      message: 'Is the TK110HDG still available? I can pay cash this week and would like to inspect it.',
    }),
  });
  step(
    'POST /api/leads returns 201 (was a 500 in prod for months)',
    inquiry.status === 201 && !!inquiry.body?.id,
    `status ${inquiry.status} · ${JSON.stringify(inquiry.body).slice(0, 140)}`
  );
  if (inquiry.body?.id) created.leadIds.push(inquiry.body.id);

  const { data: inbox } = await db
    .from('ai_inbox_items').select('id, status, confidence, ai_subject').eq('lead_id', inquiry.body?.id ?? NIL).maybeSingle();
  step(
    'AI inbox draft created for the dealer',
    !!inbox,
    inbox ? `status=${inbox.status} confidence=${inbox.confidence} subject="${(inbox.ai_subject || '').slice(0, 60)}"` : 'missing'
  );

  // ── 4. Follow-up drip via the cron handler on a local server ──────────
  if (queue?.length) {
    await db.from('lead_followup_queue').update({ scheduled_at: new Date(Date.now() - 60_000).toISOString() }).eq('id', queue[0].id);
    const cron = await fetch(`${CRON_BASE}/api/cron/lead-followups`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET || ''}` },
    })
      .then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }))
      .catch((e) => ({ status: 0, body: { error: e.message } }));
    if (cron.status === 0) {
      console.log(`SKIP  cron step — no server at ${CRON_BASE} (start one with PORT=3111 npm run start)`);
    } else {
      step(
        'cron lead-followups processes the due step',
        cron.status === 200 && (cron.body?.sent ?? 0) >= 1,
        `status ${cron.status} · ${JSON.stringify(cron.body).slice(0, 120)}`
      );
      const { data: sentRow } = await db
        .from('lead_followup_queue').select('status, resend_email_id, dealer_alerted_at, email_subject').eq('id', queue[0].id).single();
      step(
        'step 1 marked sent with a Resend id + dealer alerted',
        sentRow?.status === 'sent' && !!sentRow?.resend_email_id && !!sentRow?.dealer_alerted_at,
        `status=${sentRow?.status} resend=${sentRow?.resend_email_id ? 'yes' : 'no'} alerted=${sentRow?.dealer_alerted_at ? 'yes' : 'no'} subject="${(sentRow?.email_subject || '').slice(0, 50)}"`
      );
    }
  }

  // ── 5. Storefront renders ─────────────────────────────────────────────
  const page = await fetch(`${BASE}/${slug}`);
  step('storefront page renders for the test dealer', page.status === 200, `GET /${slug} → ${page.status}`);
} catch (err) {
  step('unexpected error', false, err.message);
} finally {
  if (!KEEP && created.userId) {
    if (created.aiLeadIds.length) {
      await db.from('lead_followup_queue').delete().in('lead_id', created.aiLeadIds);
      await db.from('dealer_ai_leads').delete().in('id', created.aiLeadIds);
    }
    if (created.conversationIds.length) {
      await db.from('chat_messages').delete().in('conversation_id', created.conversationIds);
      await db.from('chat_conversations').delete().in('id', created.conversationIds);
    }
    await db.from('ai_inbox_items').delete().eq('dealer_id', created.userId);
    await db.from('leads').delete().eq('user_id', created.userId);
    if (created.listingId) await db.from('listings').delete().eq('id', created.listingId);
    await db.from('dealer_ai_settings').delete().eq('dealer_id', created.userId);
    const { error } = await db.auth.admin.deleteUser(created.userId);
    console.log(error ? `cleanup: deleteUser failed: ${error.message}` : 'cleanup: test dealer and all rows removed');
  } else if (created.userId) {
    console.log(`kept test dealer ${created.userId} (slug ${slug})`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} steps passed`);
  process.exit(failed ? 1 : 0);
}

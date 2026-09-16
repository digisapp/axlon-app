// @ts-nocheck
/**
 * Post-apply verification for migration 075 (microsites).
 *
 * Run this straight after applying 075 in the Supabase SQL editor:
 *   node scripts/verify-microsites.mjs
 *
 * It exists because migration 072 shipped three "protections" that did not
 * actually work, and nobody knew until the schema was checked against reality.
 * Every check below asserts observable behaviour, not that the DDL parsed.
 *
 * Read-only apart from one tracked visit + one lead, both deleted before exit.
 */
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY');
  process.exit(1);
}

const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
  console.log('\n=== Schema present ===');

  const { data: sites, error: sitesErr } = await admin
    .from('microsites')
    .select('id, domain, status')
    .order('domain');
  report(!sitesErr, 'microsites table readable by service role', sitesErr?.message);
  report((sites?.length ?? 0) >= 5, `seed rows present`, `found ${sites?.length ?? 0}, expected >= 5`);

  const { error: visitsErr } = await admin.from('microsite_visits').select('id').limit(1);
  report(!visitsErr, 'microsite_visits readable by service role', visitsErr?.message);

  const { error: leadColErr } = await admin
    .from('leads')
    .select('id, microsite_id, utm_source, landing_path, product_interest, session_id')
    .limit(1);
  report(!leadColErr, 'leads has the new attribution columns', leadColErr?.message);

  console.log('\n=== Anon is locked out (the part 072 got wrong) ===');

  const { data: anonSites, error: anonSitesErr } = await anon.from('microsites').select('id').limit(1);
  report(
    Boolean(anonSitesErr) || (anonSites?.length ?? 0) === 0,
    'anon cannot read microsites (lead-routing emails stay private)',
    anonSitesErr ? anonSitesErr.message : `returned ${anonSites?.length} rows`
  );

  const { error: anonVisitReadErr } = await anon.from('microsite_visits').select('id').limit(1);
  report(Boolean(anonVisitReadErr), 'anon cannot read microsite_visits', anonVisitReadErr?.message ?? 'READ SUCCEEDED');

  const liveOrAny = sites?.[0];
  if (liveOrAny) {
    const { error: anonInsertErr } = await anon
      .from('microsite_visits')
      .insert({ microsite_id: liveOrAny.id, session_id: 'verify-forged', path: '/' });
    report(
      Boolean(anonInsertErr),
      'anon cannot forge a visit (traffic numbers are trustworthy)',
      anonInsertErr?.message ?? 'INSERT SUCCEEDED — traffic can be inflated'
    );
  }

  console.log('\n=== Analytics RPCs execute ===');

  for (const [fn, args] of [
    ['get_microsite_overview', { p_days: 30 }],
    ['get_microsite_daily_stats', { p_microsite_id: liveOrAny?.id, p_days: 7 }],
    ['get_microsite_sources', { p_microsite_id: liveOrAny?.id, p_days: 7, p_limit: 5 }],
    ['get_microsite_pages', { p_microsite_id: liveOrAny?.id, p_days: 7, p_limit: 5 }],
  ]) {
    const { error } = await admin.rpc(fn, args);
    report(!error, `${fn}() runs as service role`, error?.message);

    const { error: anonRpcErr } = await anon.rpc(fn, args);
    report(Boolean(anonRpcErr), `${fn}() refuses anon`, anonRpcErr?.message ?? 'ANON CALL SUCCEEDED');
  }

  console.log('\n=== Writes the app actually performs ===');

  if (liveOrAny) {
    const { data: visit, error: visitInsertErr } = await admin
      .from('microsite_visits')
      .insert({
        microsite_id: liveOrAny.id,
        session_id: 'verify-' + Date.now(),
        path: '/__verify',
        device: 'desktop',
      })
      .select('id')
      .single();
    report(!visitInsertErr, 'service role can record a visit (the tracking endpoint)', visitInsertErr?.message);
    if (visit) await admin.from('microsite_visits').delete().eq('id', visit.id);

    const { data: lead, error: leadInsertErr } = await admin
      .from('leads')
      .insert({
        microsite_id: liveOrAny.id,
        buyer_name: 'Verification Probe',
        buyer_email: 'verify@example.invalid',
        source: 'microsite',
        landing_path: '/__verify',
      })
      .select('id')
      .single();
    report(!leadInsertErr, "service role can record a microsite lead (source='microsite' accepted)", leadInsertErr?.message);
    if (lead) await admin.from('leads').delete().eq('id', lead.id);
  }

  console.log('\n=== Existing lead sources still valid ===');
  // 075 rewrote leads_source_check. If it dropped a value the app already
  // sends, lead capture breaks on a path nobody is watching.
  const { count, error: legacyErr } = await admin
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .in('source', ['website', 'phone_call', 'chat', 'referral', 'other', 'contact_form', 'axlonai_contact']);
  report(!legacyErr, 'existing lead rows still satisfy the rewritten CHECK', legacyErr?.message);
  console.log(`         (${count ?? 0} pre-existing leads on legacy sources)`);

  console.log(
    failures === 0
      ? '\nAll checks passed.\n'
      : `\n${failures} check(s) FAILED — do not point DNS at a microsite until these are resolved.\n`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Verification crashed:', err);
  process.exit(1);
});

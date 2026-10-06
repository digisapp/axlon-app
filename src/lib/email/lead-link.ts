/**
 * The admin inbox's view of `leads`: which leads are the platform's own (as
 * opposed to a dealer's), finding the lead behind an email address, and the
 * small status changes the inbox makes.
 *
 * A lead is the platform's when nobody owns it (AXLON AI inquiries, microsite
 * forms with no assigned dealer) or an admin account owns it (Axleyard's own
 * listings). Dealer leads stay in the dealer's dashboard and never show here.
 *
 * Service role; callers are the signed webhook, the lead routes after their
 * own validation, and withAdmin routes.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

import { isLeadStatus, LEAD_STATUSES, type LeadStatus } from './compose';

export { isLeadStatus, LEAD_STATUSES, type LeadStatus };

/**
 * An ilike pattern for a case-insensitive lookup by address: %, _ and \ are
 * escaped. PostgREST also reads * as a wildcard and has no escape for it, so
 * callers refuse addresses containing * and still compare the rows they get
 * back exactly (see sameAddress).
 */
export function exactIlike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Case-insensitive equality of two addresses. */
export function sameAddress(a: string | null | undefined, b: string | null | undefined): boolean {
  return !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Owner ids (non-null) that are admin accounts. */
async function adminOwnerIds(ownerIds: string[]): Promise<Set<string>> {
  const ids = Array.from(new Set(ownerIds.filter(Boolean)));
  if (ids.length === 0) return new Set();
  const { data } = await createAdminClient().from('profiles').select('id').in('id', ids).eq('is_admin', true);
  return new Set((data ?? []).map((p) => p.id as string));
}

export async function isPlatformLeadOwner(ownerId: string | null): Promise<boolean> {
  if (!ownerId) return true;
  return (await adminOwnerIds([ownerId])).has(ownerId);
}

/** The newest platform lead from this address, or null. */
export async function findPlatformLeadIdByEmail(email: string): Promise<string | null> {
  const address = email.trim().toLowerCase();
  if (!address.includes('@') || address.includes('*')) return null;
  const { data, error } = await createAdminClient()
    .from('leads')
    .select('id, user_id, buyer_email')
    .ilike('buyer_email', exactIlike(address))
    .order('created_at', { ascending: false })
    .limit(10);
  if (error || !data?.length) return null;
  const exact = data.filter((l) => sameAddress(l.buyer_email as string, address));
  const admins = await adminOwnerIds(exact.map((l) => l.user_id as string));
  const match = exact.find((l) => !l.user_id || admins.has(l.user_id as string));
  return (match?.id as string) ?? null;
}

/**
 * A reply went out in a conversation with this lead: stamp the contact, and a
 * lead still marked "new" becomes "contacted". Best effort — the mail is
 * already sent.
 */
export async function markLeadContacted(leadId: string): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from('leads').update({ last_contacted_at: now, updated_at: now }).eq('id', leadId);
  if (error) {
    logger.error('Inbox: could not stamp lead contact', { error, leadId });
    return;
  }
  await supabase.from('leads').update({ status: 'contacted' }).eq('id', leadId).eq('status', 'new');
  await clearLeadAlertsIfHandled(leadId);
}

/**
 * Change a lead's status from the inbox's lead card. Returns false when the
 * lead does not exist or is not a platform lead.
 */
export async function setLeadStatus(leadId: string, status: LeadStatus): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: lead } = await supabase.from('leads').select('id, user_id, status').eq('id', leadId).maybeSingle();
  if (!lead || !(await isPlatformLeadOwner((lead.user_id as string) ?? null))) return false;
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status, updated_at: now };
  if (status === 'contacted' && lead.status === 'new') patch.last_contacted_at = now;
  const { error } = await supabase.from('leads').update(patch).eq('id', leadId);
  if (error) throw error;
  if (status !== 'new') await clearLeadAlertsIfHandled(leadId);
  return true;
}

/**
 * A "new lead" alert is a to-do. Once its lead has moved past "new", the
 * conversation stops counting as unread — unless the person has written
 * since, which is real mail still waiting.
 */
export async function clearLeadAlertsIfHandled(leadId: string): Promise<void> {
  const supabase = createAdminClient();
  const { data: threads } = await supabase
    .from('email_threads')
    .select('id')
    .eq('lead_id', leadId)
    .eq('is_unread', true);
  for (const t of threads ?? []) {
    const { data: latest } = await supabase
      .from('emails')
      .select('metadata')
      .eq('thread_id', t.id)
      .eq('direction', 'inbound')
      .order('created_at', { ascending: false })
      .limit(1);
    const kind = (latest?.[0]?.metadata as { kind?: string } | null)?.kind;
    if (kind === 'lead_alert') {
      await supabase.from('email_threads').update({ is_unread: false }).eq('id', t.id);
      await supabase.from('email_threads').update({ status: 'read' }).eq('id', t.id).eq('status', 'received');
    }
  }
}

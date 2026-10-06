/**
 * May the instant AI reply to a listing inquiry go to this buyer?
 *
 * The reply is the selling point (a buyer hears back in seconds, day or
 * night), so it stays — but nobody can be made to receive it on demand:
 * one address gets at most one instant reply a day, never an automated or
 * SMS-gateway address, never when the inquiry carries a link, and never our
 * own domains. Everything else about the inquiry is unchanged (the dealer is
 * still notified, the lead is still saved).
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { isOurInboundAddress } from '@/lib/email/inbound-address';
import { exactIlike } from '@/lib/email/lead-link';
import { autoMailBlockedReason } from './form-guard';

export const INSTANT_REPLY_WINDOW_HOURS = 24;

export async function instantReplyBlockedReason(args: {
  to: string;
  message: string | null;
  /** The lead just created, excluded from the "already got one" check. */
  excludeLeadId?: string | null;
}): Promise<string | null> {
  const to = args.to.trim().toLowerCase();
  const basic = autoMailBlockedReason(to, args.message);
  if (basic) return basic;
  if (isOurInboundAddress(to)) return 'our own domain';
  if (to.includes('*')) return 'wildcard in address';

  const since = new Date(Date.now() - INSTANT_REPLY_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  let query = createAdminClient()
    .from('leads')
    .select('id, buyer_email')
    .ilike('buyer_email', exactIlike(to))
    .gte('created_at', since)
    .limit(5);
  if (args.excludeLeadId) query = query.neq('id', args.excludeLeadId);
  const { data, error } = await query;
  // Fail closed: if the check can't run, the dealer still gets the lead and
  // answers it; the buyer just doesn't get the automatic line.
  if (error) return 'rate check failed';
  if ((data ?? []).some((l) => String(l.buyer_email).trim().toLowerCase() === to)) {
    return `already wrote in within ${INSTANT_REPLY_WINDOW_HOURS}h`;
  }
  return null;
}

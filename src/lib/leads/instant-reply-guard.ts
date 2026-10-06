/**
 * May the instant AI reply to a listing inquiry go to this buyer?
 *
 * The reply is the selling point (a buyer hears back in seconds, day or
 * night), so it stays — but nobody can be made to receive it on demand:
 * one inbox gets at most one instant reply a day, never an automated or
 * SMS-gateway address, never a Gmail address spelt with extra dots, never
 * when the inquiry carries a link, and never our own domains. Everything
 * else about the inquiry is unchanged (the dealer is still notified, the
 * lead is still saved).
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { isOurInboundAddress } from '@/lib/email/inbound-address';
import { autoMailBlockedReason, canonicalEmail, isDottedGmail } from './form-guard';

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
  if (isDottedGmail(to)) return 'dotted gmail address';

  // The cap is per inbox, not per spelling: "j.o.hn@gmail.com" and
  // "john+2@gmail.com" count against john@gmail.com. That comparison can't be
  // pushed into the query, so the window's leads are read and compared here;
  // a day of inquiries is a few hundred rows at most.
  const inbox = canonicalEmail(to);
  const since = new Date(Date.now() - INSTANT_REPLY_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  let query = createAdminClient()
    .from('leads')
    .select('id, buyer_email')
    .gte('created_at', since)
    .limit(1000);
  if (args.excludeLeadId) query = query.neq('id', args.excludeLeadId);
  const { data, error } = await query;
  // Fail closed: if the check can't run, the dealer still gets the lead and
  // answers it; the buyer just doesn't get the automatic line.
  if (error) return 'rate check failed';
  if ((data ?? []).some((l) => canonicalEmail(String(l.buyer_email ?? '')) === inbox)) {
    return `already wrote in within ${INSTANT_REPLY_WINDOW_HOURS}h`;
  }
  return null;
}

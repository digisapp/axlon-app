import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

/**
 * Returns true if the address has opted out of marketing email. Fails OPEN
 * (returns false) if the suppression table isn't reachable — a lookup outage
 * must not silently drop transactional-adjacent mail; the send path decides.
 */
export async function isEmailSuppressed(email: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    // Suppressions are always stored lowercased (see suppressEmail), so an exact
    // match on the lowercased input is both correct and free of LIKE-wildcard
    // pitfalls (an address may legitimately contain _ or %).
    const { data, error } = await supabase
      .from('email_suppressions')
      .select('email')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();
    if (error) {
      logger.warn('Email suppression lookup failed', { error });
      return false;
    }
    return Boolean(data);
  } catch (error) {
    logger.warn('Email suppression lookup threw', { error });
    return false;
  }
}

/** Add an address to the suppression list (idempotent). */
export async function suppressEmail(email: string, reason = 'unsubscribe'): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('email_suppressions')
    .upsert({ email: email.trim().toLowerCase(), reason }, { onConflict: 'email' });
  if (error) {
    logger.error('Failed to add email suppression', { error });
  }
}

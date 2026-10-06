/**
 * The main Axleyard phone line. The voice agent in agent/ answers it 24/7,
 * so it is safe to show anywhere a buyer might want to talk.
 */
export const SALES_PHONE_E164 = '+14694213536';
export const SALES_PHONE_DISPLAY = '(469) 421-3536';

/**
 * The address the public is told to write to. It is the admin inbox's
 * receiving mailbox (ADMIN_EMAIL_ADDRESS's default), so mail sent here lands
 * in /admin/email. sales@axlon.ai, used before, has no MX record, so every
 * message to it bounced.
 *
 * A constant rather than the env value because client pages show it too;
 * change both together if the inbox address ever moves.
 */
export const SUPPORT_EMAIL = 'support@axleyard.com';

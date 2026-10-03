import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthContext } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logAdminAction } from '@/lib/admin/check-admin';
import { AdminInboxService, isInboxSettingKey } from '@/lib/email/admin-inbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Only the inbox's own keys (see INBOX_SETTING_KEYS) — this is not a general
// platform_settings editor.

/** GET /api/admin/inbox/settings?key=ai_auto_reply_enabled */
export const GET = withAdmin(
  async (request: NextRequest) => {
    const key = new URL(request.url).searchParams.get('key');
    if (!isInboxSettingKey(key)) return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
    const value = await AdminInboxService.getSetting(key);
    return NextResponse.json({ key, value: value === true });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:settings:get' } }
);

/** PUT /api/admin/inbox/settings { key, value: boolean } */
export const PUT = withAdmin(
  async (request: NextRequest, { user }: AuthContext) => {
    const body = await request.json().catch(() => ({}));
    if (!isInboxSettingKey(body.key)) return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
    if (typeof body.value !== 'boolean') return NextResponse.json({ error: 'value must be true or false' }, { status: 400 });
    await AdminInboxService.setSetting(body.key, body.value);
    // target_id is a UUID column: the acting admin, with the key in details.
    logAdminAction(user.id, 'inbox_setting', 'platform_setting', user.id, { key: body.key, value: body.value }).catch(() => {});
    return NextResponse.json({ success: true, key: body.key, value: body.value });
  },
  { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:admin:inbox:settings:put' } }
);

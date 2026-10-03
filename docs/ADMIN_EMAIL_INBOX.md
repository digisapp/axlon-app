# Admin email inbox (`/admin/email`)

The email channel for Axleyard. Mail to the support address lands in the
admin dashboard; admins read and answer it there; everything goes through
Resend. No Google Workspace mailbox is involved (neither axleyard.com nor
axlon.ai has an MX record today).

## How it works

```
sender ──► support@axleyard.com  (or any address on the receiving domain)
             │  (MX → Resend receiving)
             ▼
   Resend fires `email.received` ──► POST https://axleyard.com/api/webhooks/resend
             │  svix signature, then GET /emails/receiving/{id} for body + headers
             ▼
   email_threads + emails (direction=inbound) ──► /admin/email
             │  after(): Grok classifies + drafts (XAI_API_KEY); auto-sends only
             │  if platform_settings.ai_auto_reply_enabled = true
             ▼
   admin replies ──► Resend send, From "Axleyard Support <support@axleyard.com>",
                     Reply-To support+<threadId>@axleyard.com
                     (the plus tag threads the answer when it comes back)
```

Code: `src/lib/email/admin-inbox.ts` (service), `inbound-address.ts` (pure
addressing helpers, unit tested), `inbox-status.ts` (readiness check),
`auto-reply.ts` (guards + send), `spam.ts`, `src/lib/ai/email-classifier.ts`
(Grok), `src/app/api/webhooks/resend/route.ts` (webhook),
`src/app/api/admin/inbox/*` (admin API), `src/hooks/useAdminInbox.ts` +
`src/components/admin-inbox/*` (UI). Tables: `email_threads`, `emails`
(migrations 050, 051, 081).

## Environment (Vercel → Production)

| Var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sending + fetching received mail. Full-access key (not send-only). |
| `RESEND_WEBHOOK_SECRET` | Svix signing secret of the Resend webhook. Every call is rejected without it. |
| `ADMIN_EMAIL_ADDRESS` | The receiving mailbox. Default `support@axleyard.com`. Its **domain** is what must receive in Resend. |
| `ADMIN_EMAIL_FROM` | Optional. From on admin replies; default `Axleyard Support <support@axleyard.com>`. Must be on a verified sending domain. |
| `INBOUND_EMAIL_DOMAINS` | Optional extra domains (comma separated) whose mail counts as ours. axleyard.com and axlon.ai always do. |
| `ADMIN_EMAIL` | Where **Send me a test** goes (the admin's real mailbox; falls back to the login address). |
| `XAI_API_KEY` | Optional. AI summary + suggested reply. Mail still arrives without it. |

## Is it working? (check this first, not the UI)

`/admin/email` shows a yellow **"This inbox can't receive mail yet"** card
until everything below is true. The same data is at
`GET /api/admin/inbox/status` and from `npx tsx scripts/check-admin-inbox.ts`.
"Inbox is empty" with a green bar at the top means there is genuinely no mail.

Ready means all of:

1. Public DNS has an MX for `ADMIN_EMAIL_ADDRESS`'s domain pointing at
   Resend (`inbound-smtp.<region>.amazonaws.com`), and that Resend domain is
   **verified** with **receiving enabled**. As of Oct 3 2026 both
   `axleyard.com` and `axlon.ai` are verified for sending, have receiving
   **disabled**, and have no MX at all.
2. The Resend webhook endpoint is exactly `https://axleyard.com/api/webhooks/resend`
   (`www.axleyard.com` 308s to the bare domain and Svix treats 3xx as failure),
   enabled, subscribed to `email.received` (+ `email.delivered`,
   `email.bounced`, `email.complained`, `email.failed` for status). The
   existing webhook already points there.
3. `RESEND_WEBHOOK_SECRET` set in prod (it is).

Resend webhooks are **account-wide**: every receiving domain on the account
(Digis, EXA, Mayells, Cannes Swim Week, Staycio…) fires at this endpoint too.
The webhook keeps only mail with a recipient on axleyard.com / axlon.ai (or
their subdomains) and acknowledges the rest with `ignored: "not our domain"`.

## One-time setup at the registrar (GoDaddy, axleyard.com zone)

Two ways to receive. Pick one.

**A. Apex (default, `ADMIN_EMAIL_ADDRESS=support@axleyard.com`).** Nothing
receives mail on axleyard.com today, so there is nothing to break:

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | `@` | `inbound-smtp.us-east-1.amazonaws.com` | 10 |

Then open `/admin/email`. Once the record is visible in public DNS the setup
card shows a **Turn on receiving** button, which enables Receiving on the
domain in Resend and asks it to verify (same as Resend → Domains →
axleyard.com → Receiving). The button is refused until the MX is live: the
same domain sends all of our transactional mail, so it is never left waiting
on a record that is not there. Every `@axleyard.com` address (support@,
sales@, anything) then lands in the inbox. The setup card shows the exact
value Resend wants for the region.

**B. Subdomain (`ADMIN_EMAIL_ADDRESS=inbox@inbound.axleyard.com`).** Add
`inbound.axleyard.com` as a new domain in Resend with receiving enabled and
add the records the setup card lists (`MX inbound`, `TXT resend._domainkey.inbound`,
`MX send.inbound`, `TXT send.inbound`). Use this if the apex MX is ever
needed for a real mailbox provider. The code supports both without changes.

## Testing the loop

1. `/admin/email` → **Send me a test** (or `POST /api/admin/inbox/test`). It
   emails the signed-in admin through the normal reply path (support From,
   per-conversation Reply-To) and shows in **Sent** with a "Test" badge.
2. Reply to it from that mailbox. Within a minute the reply must appear in
   **Inbox**, inside the same conversation. If it doesn't, receiving is the
   broken half — see the setup card.
3. Reply from the inbox; check the sender's client groups it in the thread.

Webhook deliveries and their responses are visible in Resend → Webhooks → the
axleyard.com endpoint. A 401 there means `RESEND_WEBHOOK_SECRET` doesn't match
the webhook's signing secret (editing the endpoint URL keeps the secret;
creating a new webhook rotates it).

## Folders and actions

Inbox (conversations with inbound mail), Unread, Starred, Sent
(conversations we have written in), Spam. Spam is filed, never dropped, so a
false positive can be rescued with **Not spam**. Bulk: read / unread / star /
unstar / spam / not spam / delete (confirm first). Attachments open through
`/api/admin/inbox/[id]/attachments/[aid]`, which redirects to Resend's signed
download URL — bytes never touch our storage. The inbox is shared between all
admins (it used to be filtered to the signed-in admin's own threads).

## AI auto-reply

Off unless an admin turns it on (toggle on the page, with confirmation;
`platform_settings.ai_auto_reply_enabled`). With it off the AI still
summarises and drafts; nothing is sent without an admin. On, it auto-sends
only for purchase / selling / financing / trade-in / transport / parts /
appraisal / dealer-onboarding / general inquiries at ≥ 85 % confidence, never
twice in 24 h per conversation, never to automated senders (no-reply,
mailer-daemon, notifications, list mail, `Auto-Submitted`), never to our own
domains, never to spam, and **only to senders that pass DMARC**. From is
trivially forged and a reply to a forged From lands on a third party — the
same trick bots used on `/api/contact`. A message that fails DMARC also shows
a red "Sender not verified" chip in the thread.

What gets mailed is never HTML from the inbound email or from the model:
replies (typed, AI draft, auto-reply) are rebuilt from plain text into our
own template, and the quoted original underneath is escaped text.

## Related

- Transactional mail (`sendEmail` in `src/lib/email/resend.ts`) now defaults
  Reply-To to `ADMIN_EMAIL_ADDRESS`, so "just reply to this email" in the
  welcome / lead mails lands here once receiving is on. Pass `replyTo: null`
  to send without one. `category: 'conversation'` skips the List-Unsubscribe
  headers that would otherwise show an "Unsubscribe" link on a support reply.
- `/api/contact` and the lead forms are separate inbound channels; they are
  not routed through this inbox.

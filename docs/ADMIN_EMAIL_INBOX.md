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
`src/components/admin-inbox/*` (UI), `lead-inbox.ts` + `lead-link.ts`
(leads), `compose.ts` (attachments, greeting, sign-off), `plain-shell.ts`
(the reply email), `src/components/admin-inbox/email-srcdoc.ts` (how a
message is rendered). Tables: `email_threads`, `emails` (migrations 050,
051, 081, 082, 083), linked to `leads`.

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

A conversation is with one address: mail only joins a thread when it comes
from that thread's participant (by plus tag, References or subject). The same
subject from someone else starts its own conversation, so a reply can never
be steered to a third party.

Inbox (conversations with inbound mail), Unread, Starred, Sent
(conversations we have written in), Spam. Spam is filed, never dropped, so a
false positive can be rescued with **Not spam**. Bulk: read / unread / star /
unstar / spam / not spam / delete (confirm first). Attachments open through
`/api/admin/inbox/[id]/attachments/[aid]`, which redirects to Resend's signed
download URL — bytes never touch our storage. The inbox is shared between all
admins (it used to be filtered to the signed-in admin's own threads).

## Leads

The inbox is where platform leads are worked. A lead is the platform's when
nobody owns it (AXLON AI inquiries, microsite forms with no assigned dealer)
or an admin account owns it (Axleyard's own listings). Dealer leads stay in
the dealer's dashboard and never appear here.

- **New lead alerts.** Every new platform lead (`/api/leads`,
  `/api/microsites/lead`, `/api/chat/lead`) becomes a conversation with the
  person, marked **New lead**, with a suggested reply. Its subject is what
  they asked about, so answering it reads "Re: 2021 Fontaine Magnitude…" to
  them. The email notification to `ADMIN_EMAIL` still goes out as before.
  (Leads on Axleyard's own listings used to notify admin@axlon.ai, which
  receives no mail.)
- **Lead card** above each conversation with a lead: what they asked about
  (listing, price, location, microsite), Call and Text buttons, and the
  status. Replying moves a **new** lead to **contacted** by itself; once a
  lead is past new, its alert stops counting as unread, unless they have
  written since.
- **Linking.** Any conversation with someone who filled in a form is linked
  to their newest platform lead, whichever side wrote first.
- **Instant replies.** On Axleyard's own listings the existing instant AI
  reply to the buyer still goes out (24/7 response is the point). Its
  Reply-To is that lead's conversation, and the reply is shown in the thread
  as **Auto-sent**, so nobody answers twice.

## Writing replies

- Replies open as "Hi <first name>, … Best, The Axleyard Team" with the caret
  in between. The email itself is plain: white, system font, no logo or
  footer, so it reads like a person wrote it. The message being answered is
  quoted underneath as a cite block, which mail apps fold.
- **Suggested replies** know the lead's own form answers and the facts of the
  listing they asked about, and may state only those facts (no guessed
  prices, no "available" for a sold unit, a request for a phone number when
  none is on file). **New draft** writes a fresh one; **Suggest a reply**
  appears when there is none yet.
- **Attachments:** up to 5 files, 3 MB in total (PDFs, photos, text, Office
  files), checked on both sides. They show on the sent message; Resend keeps
  no copy we can serve back.
- Messages render in the admin's light or dark theme when typed, on white
  when designed. Quoted history folds behind **•••**. Nothing in an email can
  run: no scripts, forms, frames or redirects survive, and the frame allows
  no script at all.
- `/admin/email?thread=<id>` opens a conversation directly; the browser tab
  shows the unread count.

## AI auto-reply

Off unless an admin turns it on (toggle on the page, with confirmation;
`platform_settings.ai_auto_reply_enabled`). Migration 051 had seeded it
`true` back when no mail could arrive; 081 turns that seed off once, and
never touches the value again after the first inbound email exists. With it off the AI still
summarises and drafts; nothing is sent without an admin. On, it auto-sends
only for purchase / selling / financing / trade-in / transport / parts /
appraisal / dealer-onboarding / general inquiries at ≥ 85 % confidence, never
twice in 24 h per conversation, never to automated senders (no-reply,
mailer-daemon, notifications, list mail, `Auto-Submitted`), never to our own
domains, never to spam, only when the sender is the conversation's own
participant, and **only to senders that pass DMARC** (as reported by the
receiving server's own `Authentication-Results`, not one the sender wrote). From is
trivially forged and a reply to a forged From lands on a third party — the
same trick bots used on `/api/contact`. A message that fails DMARC also shows
a red "Sender not verified" chip in the thread.

What gets mailed is never HTML from the inbound email or from the model:
replies (typed, AI draft, auto-reply) are rebuilt from plain text into the
plain shell, and the quoted original underneath is escaped text. Lead alerts
are never auto-answered: a web form proves nothing about who typed the
address.

## Related

- Transactional mail (`sendEmail` in `src/lib/email/resend.ts`) now defaults
  Reply-To to `ADMIN_EMAIL_ADDRESS`, so "just reply to this email" in the
  welcome / lead mails lands here once receiving is on. Pass `replyTo: null`
  to send without one. `category: 'conversation'` skips the List-Unsubscribe
  headers that would otherwise show an "Unsubscribe" link on a support reply.
- `/api/contact` (the demo / consulting form) is not routed through this
  inbox: its submissions have been bots.
- Public pages (Contact, Apply, Unsubscribe, Billing, site metadata) now
  give `support@axleyard.com` (`SUPPORT_EMAIL` in `src/lib/contact.ts`), so
  mail people write lands here. They used to say sales@axlon.ai, which has no
  MX record.
- `npx tsx scripts/inbox-e2e.ts` exercises all of it against the real
  database and Resend's sink addresses, and cleans up after itself.

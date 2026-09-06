# Claim-your-storefront flow

Scraped dealer inventory (`listings.source_dealer_id` set, owned by the admin
account) is the bait for the outreach motion: "your units are already on
Axleyard — claim them." This is how a dealer takes ownership.

## What a claim does

`POST /api/dealer/claim` with `{ sourceId, token }` from a signed-in account:

1. Verifies the token (HMAC of the `dealer_sources.id` under
   `INTERNAL_API_SECRET`, see `src/lib/claims/token.ts`).
2. Records the claim atomically (`dealer_sources.claimed_by / claimed_at`,
   guarded by `claimed_by IS NULL`, so two accounts can't both win and a
   failure moves nothing).
3. Promotes the account to a business profile, filling company name,
   website, phone, city and state from the dealer source where empty, and
   assigns a unique storefront slug.
4. Transfers every listing tagged with that source to the account.

From then on the dealer scrapers insert new units for that source under the
claiming dealer (`scripts/lib/dealer-scraper-utils.mjs`).

## Sending a claim link

**The link is the key.** Anyone holding it can claim that dealer's inventory,
so it only ever goes to the dealer's own contact address (the one on
`dealer_sources.contact_email` or a verified address you have for them).
Never publish it on a page or in a mass mailing.

1. Admin → Dealer Sources → **Claim link** on the dealer's card (copies
   `https://axleyard.com/claim?source=<id>&t=<token>`).
2. Email it to the dealer. The page shows them how many units are live and
   walks them through signup (or login) and back to a one-click claim.
3. Once claimed the card shows a **Claimed** badge and the link is no longer
   offered.

## Dealers who find their own inventory

Scraped listing pages carry an "Is this your dealership?" link to the
contact form with the subject preset to a storefront claim request. Verify
the person actually represents the dealer (call the number on the dealer's
own website), then send them the claim link from the admin page.

## Requirements

- Migration `071_dealer_source_claims.sql` applied.
- `INTERNAL_API_SECRET` set in the environment (already set in Vercel).
- Tokens are deterministic per source: rotating `INTERNAL_API_SECRET`
  invalidates every unsent claim link.

# Lead-gen microsites

Each domain we own (`xltrailers.com`, `tagtrailers.com`, …) is served by this
same Next app. There is no separate deploy, repo or hosting account per site —
one row in the `microsites` table is the whole site.

## How a request flows

```
visitor → https://xltrailers.com/trailers/xl-tag
  ↓  Vercel serves it (domain is aliased to this project)
  ↓  src/proxy.ts: host is not an app host → rewrite
  ↓  /sites/xltrailers.com/trailers/xl-tag
  ↓  src/app/sites/[domain]/… resolves the row, renders, 404s if not `live`
```

`src/lib/microsites/config.ts` holds the list of hosts that are the *app*
(axleyard.com, axlon.ai, `*.vercel.app`, localhost). Anything else is treated
as a microsite. Add new app hosts there, never new microsite hosts — those
live in the database.

`/api/*` and `/_next/*` are excluded from the rewrite, so the lead form, the
CSRF endpoint and static assets work identically on every domain.

Two things the proxy is strict about, both load-bearing:

- **The host is validated before it is interpolated into a path.** The rewrite
  builds `/sites/<host><pathname>` and hands it to `new URL()`, which resolves
  `..` segments — so `Host: ../../admin` would otherwise escape the prefix and
  rewrite to an internal route. `isRewritableHost()` refuses anything that is
  not a well-formed apex host, and such a request falls through to the app.
- **`x-microsite-host` is deleted from every inbound request.** Downstream code
  treats that header as proof the proxy rewrote a microsite request; if a
  client could set it, `curl -H 'x-microsite-host: x' axleyard.com/sites/...`
  would walk straight past the app-host guards and serve a microsite under the
  marketplace domain.

## Adding a domain

1. **Vercel** → project → Settings → Domains → add the apex (`xltrailers.com`)
   and `www.xltrailers.com`. Vercel shows the records it wants.
2. **Registrar DNS** — same shape as axleyard.com:

   | Type  | Name | Value                |
   |-------|------|----------------------|
   | A     | @    | 76.76.21.21          |
   | CNAME | www  | cname.vercel-dns.com |

   Delete any parked A records the registrar ships first.
3. **Admin** → `/admin/microsites` → **Add domain**. Enter the apex only — no
   `https://`, no `www.`. The DB rejects anything else, because the resolver
   strips `www.` before matching and would never find such a row.
4. Fill in Settings: manufacturer catalog, headline, accent colour, notify
   email. Leave the disclaimer blank to use the generated wording.
5. Flip **status → live**, in the admin UI or straight in SQL — either takes
   effect on the next request. Microsite pages render dynamically (the root
   layout reads `headers()` for the CSP nonce, which opts the whole route tree
   out of static rendering), so there is no cache standing between a status
   change and what visitors see.

Until a site is live it redirects to axleyard.com and its `robots.txt` returns
`Disallow: /`, so pointing DNS early never publishes a half-built page or gets
a parked host indexed.

## What a site renders

| Setting | Effect |
|---|---|
| Manufacturer catalog | Model grid + a detail page per model, from `manufacturer_products` (images already re-hosted in Supabase) |
| Product type filter | Narrows the catalog, e.g. `lowboy` |
| Show live inventory | Adds an "Available now" grid of active marketplace listings |
| Marketplace make filter | Which listings count as this site's niche (`ILIKE %make%`) |
| Marketplace categories | `listing_category_slugs`, e.g. `{tag-trailers,tilt-trailers}` — inner-joins listings to `categories.slug` |

A site is built around **either a brand or a category**, and the two filters
behave accordingly:

- `listing_make` alone — a manufacturer site. If it is blank the linked
  manufacturer's name is used, so xltrailers.com lists XL Specialized units
  without anyone typing the make twice.
- `listing_category_slugs` — a category site. "Tag trailer" is a kind of
  trailer, not a brand, so no value of `listing_make` can express it. When
  categories are set the manufacturer fallback is **switched off**: otherwise
  tagtrailer.com, which shows Felling's catalog, would AND `make ILIKE
  '%Felling%'` onto the category filter and list almost nothing — when what it
  should show is every make of tag trailer, Interstate and Talbert included.
  An explicitly entered `listing_make` still narrows the set.

Both are ANDed when both are set. An empty array is rejected by a CHECK
constraint, because it would inner-join to nothing and empty the grid with no
error — the exact failure this replaced.

Category slugs are not foreign keys (Postgres cannot FK an array element), so a
typo yields an empty grid rather than an error. Migration 076 guards its own
slugs with a `DO` block that raises on an unknown one; do the same in any
migration that sets them, and prefer picking from `categories` in the admin UI
over typing a slug by hand.

Every page carries a quote form above the fold, plus its own
`/sitemap.xml` and `/robots.txt` at the conventional paths.

## Leads

`POST /api/microsites/lead` writes to the shared `leads` table with
`source = 'microsite'` and `microsite_id` set, so microsite leads appear in
`/admin/leads` alongside phone and marketplace leads and can be filtered to one
domain. The row also carries `landing_path`, `referrer`, `session_id` and the
UTM triple, so a lead can be traced back to the campaign that produced it.

Routing:
- **Notify email** — where the lead notification is sent (falls back to
  `ADMIN_EMAIL`).
- **assigned_user_id** — optional; set it to hand leads from a site to a
  specific dealer profile. Left null, leads are unassigned and admin-only.

Protections: per-IP rate limit, CSRF (same-origin double-submit — the cookie is
set on the microsite's own domain), Zod validation, and a honeypot field.

## Analytics

`MicrositeTracker` beacons one row per page view to
`POST /api/microsites/track`. It runs client-side so that a bfcache restore or
a client-side navigation still counts, and so the tracker keeps working if
these pages are ever made cacheable.

Known bot user-agents are dropped, the endpoint is rate-limited, and only a
`live` microsite id is accepted. Writes go through the service role — visitors
have no direct insert grant on `microsite_visits`, so nobody can inflate the
numbers the dashboard reports.

Aggregation happens in Postgres (`get_microsite_daily_stats`,
`get_microsite_overview`, `get_microsite_sources`, `get_microsite_pages`), each
admin-gated inside the function body.

Session ids live in `sessionStorage`, are per-tab and are never shared across
domains, so "unique visitors" means unique sessions, not tracked individuals.

## Trademark posture

These domains are ours; the manufacturers whose equipment they list have not
endorsed them. Every page renders an affiliation disclaimer in the footer
(`disclaimerFor()` generates one naming the manufacturer; the Settings form
overrides it per site), and the microsite hosts do not emit Axleyard's
Organization/WebSite JSON-LD.

Keep it that way: a site must never present itself *as* the manufacturer — no
manufacturer logo as the site logo, no "official", no copied brand styling.
Descriptive, factual use of a maker's name to say what is being sold is the
line this stays on.


## Caching

Microsite pages render per request — static rendering is not available while
the root layout reads `headers()` for the CSP nonce. So the *data* is cached
rather than the page:

| Read | Cached | TTL |
|---|---|---|
| Resolve host → microsite row | **No** | — |
| Manufacturer catalog (grid + detail) | Yes | 10 min |
| Live marketplace listings | Yes | 60 s |

The host resolver is deliberately uncached. That row carries `status`, and a
TTL on it would mean flipping a site live takes effect minutes later. It is
also the cheapest of the three — one unique-index hit on `domain`.

Saving a microsite in the admin calls `revalidateTag(MICROSITES_CACHE_TAG,
{ expire: 0 })`, so an edit shows up on the next request rather than after the
TTL. Next 16 requires that second cache-life argument; a bare
`revalidateTag(tag)` still purges but logs a deprecation warning every time.

Failed queries are thrown, not swallowed, so a transient database error can't
be stored as an empty catalog for the whole TTL. The caller logs it and
degrades for that request only.

If a domain starts ranking, the next step is CDN-caching the HTML with
`s-maxage`. That requires dropping the per-request CSP nonce on `/sites/*`,
because a nonce shared across cached responses is not a nonce. It is a real
security tradeoff — make it deliberately, not by default.

## Previewing before you publish

A draft site redirects to the marketplace, so there is no preview mode. You do
not need one: until DNS points at Vercel the domain is unreachable regardless
of status. Add the domain in Vercel, flip the site live, open it directly to
review the copy, and only then point DNS.

## What each page carries (Sep 2026 audit)

Landing page, top to bottom: header with click-to-call → hero (headline,
sub-headline, phone, quote form above the fold on every breakpoint) → three
true trust bullets → live stats strip (trailers listed / manufacturers /
states) → model grid → "Available now" inventory, priced units first → FAQ →
closing CTA → footer with the affiliation disclaimer.

Structured data is emitted on both templates via `JsonLd` and built in
`src/lib/microsites/content.ts` (pure, unit-tested):

| Page | Schema |
|---|---|
| Landing | `WebSite` (publisher: Axleyard — never the manufacturer), `ItemList` of models, `FAQPage` |
| Detail | `Product` (brand, images, category, specs as `PropertyValue`; **no `offers`** — prices are quoted per deal), `BreadcrumbList` |

Detail pages always render an "About <type> trailers" section from
`productTypeExplainer`. This is deliberate: 54% of catalog products have zero
spec rows and 31% no description, and a page that is title + photos + form is
too thin to rank. The explainer is about the trailer *type*, so it is accurate
for every product carrying that type regardless of what the scraper found.

Things the audit fixed that are easy to regress:

- The root layout only mounts `NotificationProvider`, `CompareProvider`,
  `KeyboardShortcuts` and `PWACleanup` off microsite hosts. They opened two
  realtime channels and called `auth.getUser()` on every anonymous page view.
- `metadata.manifest` was removed from the root layout: no manifest exists
  anywhere, so it 404'd on every page (marketplace included) and cost
  Best-Practices points.
- The hero image sets `fetchPriority="high"` explicitly. `priority` alone
  emitted the preload but no priority hint; mobile LCP was 3.5s.
- Trust bullets must be true. "Vetted dealer network" was removed because zero
  dealers were approved at the time; the replacement reads live state counts.
- Copy in `short_description` is shown on cards. Four XL products carried
  wheel-marketing boilerplate ("Aluminum Durabright Wheels…") and were nulled.

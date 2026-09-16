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
5. Flip **status → live**. Until then the domain 404s and its `robots.txt`
   returns `Disallow: /`, so pointing DNS early never publishes a half-built
   page or gets a parked host indexed.

## What a site renders

| Setting | Effect |
|---|---|
| Manufacturer catalog | Model grid + a detail page per model, from `manufacturer_products` (images already re-hosted in Supabase) |
| Product type filter | Narrows the catalog, e.g. `lowboy` |
| Show live inventory | Adds an "Available now" grid of active marketplace listings |
| Marketplace make filter | Which listings count as this site's niche (`ILIKE %make%`) |

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
`POST /api/microsites/track`. It runs client-side on purpose: the pages are
cached for an hour, so a server-side counter would only fire on cache misses.

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

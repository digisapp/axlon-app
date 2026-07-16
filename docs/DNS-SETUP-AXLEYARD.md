# axleyard.com DNS setup (GoDaddy)

One-time records to add in GoDaddy → axleyard.com → DNS. Everything else
(Vercel domains, env vars, Supabase auth, Resend domain) is already configured.

## 1. Point the site at Vercel

| Type  | Name | Value                 |
|-------|------|-----------------------|
| A     | @    | 76.76.21.21           |
| CNAME | www  | cname.vercel-dns.com  |

GoDaddy ships parked A records on `@` — delete those first. Vercel emails a
confirmation once it verifies (it re-checks automatically).

## 2. Resend email sending (status: pending verification)

| Type | Name               | Value | Priority |
|------|--------------------|-------|----------|
| TXT  | resend._domainkey  | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4OHtBLCUvw5uVizzei6/rDIRBSD3yqr9vZNCAdN/2GN21xE4WDb1ln+0gX/XQamm2rHsGP330HXLOBmO3SHpt2RAjoeZSSNt+UD2vsnpfWX9KUxgdN5fy1JCfZtKy3V83xaHONhQQUU/qsIQXtGRgJ2k0v0d5zjo1f9YZP1LXLwIDAQAB` | — |
| MX   | send               | feedback-smtp.us-east-1.amazonses.com | 10 |
| TXT  | send               | `v=spf1 include:amazonses.com ~all` | — |

After these resolve, Resend auto-verifies (or click Verify in the Resend
dashboard). Only THEN flip the sending addresses:
set `RESEND_FROM_EMAIL="Axleyard <noreply@axleyard.com>"` and
`ADMIN_EMAIL=sales@axleyard.com` in Vercel env — several API routes also have
hardcoded `noreply@axlon.ai` from-strings that need a code sweep at that point.

## 3. Deploy sequencing (IMPORTANT)

Do NOT merge `rebrand/axleyard` to main until the records in section 1 resolve
(check with `dig +short axleyard.com` → 76.76.21.21). The branch 308-redirects
all axlon.ai traffic to axleyard.com; deploying before DNS is live would send
visitors to a dead domain.

## 4. Google Search Console (manual, needs your Google login)

1. https://search.google.com/search-console → Add property → Domain →
   `axleyard.com`. It gives you a TXT record for the `@` name — add it in
   GoDaddy alongside the records above.
2. After the rebrand is deployed and axleyard.com is live: open the old
   axlon.ai property → Settings → Change of address → select axleyard.com.
   (Requires the 308 redirects to be live, which they will be.)
3. Submit https://axleyard.com/sitemap.xml in the new property.

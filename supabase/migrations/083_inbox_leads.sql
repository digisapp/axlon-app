-- Admin inbox ↔ leads.
--
-- 050 pointed email_threads.lead_id at dealer_ai_leads, a table nothing in the
-- inbox uses (it is empty in production). The leads people actually work are
-- in `leads`. Repoint the foreign key there, so a conversation can carry its
-- lead: the lead card on /admin/email, "new lead" alerts written into the
-- inbox, and "replying marks a new lead contacted".
--
-- Additive and idempotent. The old constraint is found by what it references,
-- never by a guessed name. Any thread still pointing at a dealer_ai_leads row
-- (none in production) has the link cleared rather than failing the new FK.

DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT con.conname
      FROM pg_constraint con
     WHERE con.conrelid = 'public.email_threads'::regclass
       AND con.contype = 'f'
       AND con.confrelid = 'public.dealer_ai_leads'::regclass
  LOOP
    EXECUTE format('ALTER TABLE public.email_threads DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

UPDATE public.email_threads t
   SET lead_id = NULL
 WHERE lead_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM public.leads l WHERE l.id = t.lead_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conrelid = 'public.email_threads'::regclass
       AND contype = 'f'
       AND confrelid = 'public.leads'::regclass
  ) THEN
    ALTER TABLE public.email_threads
      ADD CONSTRAINT email_threads_lead_id_fkey
      FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_threads_lead ON public.email_threads(lead_id) WHERE lead_id IS NOT NULL;

-- ─── Preview text ──────────────────────────────────────

-- Also drop HTML comments before extracting text. Outlook wraps layout in
-- <!--[if mso]> … <![endif]--> blocks whose contents (e.g. a PixelsPerInch
-- "96") otherwise showed up as the first word of a preview.
CREATE OR REPLACE FUNCTION email_preview_text(text_body TEXT, html_body TEXT)
RETURNS TEXT AS $$
  SELECT NULLIF(btrim(left(regexp_replace(
    COALESCE(
      NULLIF(btrim(text_body), ''),
      replace(replace(replace(replace(replace(replace(
        regexp_replace(
          -- One pattern per element, without a backreference: with \1 the
          -- Postgres engine ignores the non-greedy .*? and strips from the
          -- first <style> to the last </style>, taking the text between.
          regexp_replace(regexp_replace(regexp_replace(regexp_replace(
            regexp_replace(COALESCE(html_body, ''), '<!--.*?-->', ' ', 'g'),
            '<style[^>]*?>.*?</style>', ' ', 'gi'),
            '<script[^>]*?>.*?</script>', ' ', 'gi'),
            '<head[^>]*?>.*?</head>', ' ', 'gi'),
            '<title[^>]*?>.*?</title>', ' ', 'gi'),
          '<[^>]+>', ' ', 'g'),
        '&nbsp;', ' '), '&amp;', '&'), '&lt;', '<'), '&gt;', '>'), '&quot;', '"'), '&#39;', '''')
    ),
    '\s+', ' ', 'g'), 200)), '');
$$ LANGUAGE sql IMMUTABLE SET search_path = public;

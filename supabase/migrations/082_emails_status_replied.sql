-- emails.status must allow 'replied'.
--
-- 050 in this repo lists it, but the production table was created from an
-- earlier draft whose CHECK stops at 'received'. Marking an inbound email as
-- answered therefore failed the constraint — silently, because nothing read
-- the error — so an answered message kept its "New" badge and its AI draft.
-- Found by scripts/inbox-e2e.ts on Oct 4 2026.
--
-- Rebuilds the status CHECK with the full list. Whatever the old constraint
-- is called, it is found by what it constrains rather than by a guessed name.
-- Widening only: every existing row already satisfies the new list.

DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'public.emails'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.emails DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.emails
  ADD CONSTRAINT emails_status_check
  CHECK (status IN (
    'queued', 'sent', 'delivered', 'opened', 'clicked',
    'bounced', 'complained', 'failed', 'received', 'replied'
  ));

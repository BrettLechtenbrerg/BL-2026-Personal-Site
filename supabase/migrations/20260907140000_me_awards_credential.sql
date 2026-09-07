--------------------------------------------------------------------------------
-- Academy — third-party verifiable credential (Certifier) on the Black Belt
-- badge. credential_url is the public verification page; null = not yet
-- issued (issuance is retried by src/lib/certifier.ts on the next check).
--
-- Apply: paste into Supabase SQL editor. Idempotent — safe to re-run.
--------------------------------------------------------------------------------
ALTER TABLE me_awards
  ADD COLUMN IF NOT EXISTS credential_url TEXT;

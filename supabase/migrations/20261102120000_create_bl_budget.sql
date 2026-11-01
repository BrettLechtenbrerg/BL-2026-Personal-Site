--==============================================================================
-- BL POWER HUB — BUDGET & SALES (brettlechtenberg.com/hub/budget) — Nov 2026
--==============================================================================
-- NEW tables only. Nothing existing is changed. Additive + idempotent (safe
-- to re-run). All names start with bl_budget_ so they can never clash with the
-- Academy (me_*), Comms Hub (hub_*) or CRM tables in this shared project.
--
-- bl_budget_months        one row per month: who set it up and when
-- bl_budget_goals         Brett's estimate per income line: how many × price
--                         (for Hourly Consulting "how many" = hours)
-- bl_budget_entries       the ledger: one row per payment (Stripe, check, cash,
--                         bank transfer, other). Never deleted: hand-entered rows
--                         are VOIDED (voided_at); Stripe rows can only be
--                         re-filed. received_at = check/transfer seen in the bank.
-- bl_budget_settings      small key/value (Stripe sync status, reminders on/off)
-- bl_budget_reminder_log  one row per reminder email sent (no double sends)
--
-- Money = integer cents. Service role only (RLS on, no policies, anon +
-- authenticated revoked), same lockdown as hub_messages. Grants for
-- service_role are explicit (Supabase no longer adds them automatically).
--==============================================================================

CREATE TABLE IF NOT EXISTS public.bl_budget_months (
  month       text PRIMARY KEY CHECK (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  note        text CHECK (note IS NULL OR char_length(note) <= 300),
  prepared_by text CHECK (prepared_by IS NULL OR char_length(prepared_by) BETWEEN 1 AND 40),
  prepared_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bl_budget_goals (
  month            text NOT NULL REFERENCES public.bl_budget_months(month) ON DELETE RESTRICT,
  line_key         text NOT NULL CHECK (line_key ~ '^[a-z_]{2,40}$'),
  est_count        integer NOT NULL DEFAULT 0 CHECK (est_count BETWEEN 0 AND 9999),
  unit_price_cents integer NOT NULL DEFAULT 0 CHECK (unit_price_cents BETWEEN 0 AND 100000000),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (month, line_key)
);

CREATE TABLE IF NOT EXISTS public.bl_budget_entries (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paid_on            date NOT NULL,
  source             text NOT NULL CHECK (source IN ('stripe', 'check', 'cash', 'transfer', 'other')),
  amount_cents       integer NOT NULL CHECK (amount_cents <> 0 AND amount_cents BETWEEN -100000000 AND 100000000),
  quantity           integer NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 999),
  hours              numeric(7,2) CHECK (hours IS NULL OR (hours > 0 AND hours <= 9999)),
  line_key           text CHECK (line_key IS NULL OR line_key ~ '^[a-z_]{2,40}$'),
  line_set_by        text CHECK (line_set_by IS NULL OR char_length(line_set_by) BETWEEN 1 AND 40),
  item               text CHECK (item IS NULL OR char_length(item) <= 200),
  payer              text CHECK (payer IS NULL OR char_length(payer) <= 120),
  reference          text CHECK (reference IS NULL OR char_length(reference) <= 60),
  note               text CHECK (note IS NULL OR char_length(note) <= 300),
  received_at        timestamptz,
  stripe_id          text UNIQUE CHECK (stripe_id IS NULL OR stripe_id ~ '^(ch|re|py)_[A-Za-z0-9]{6,100}$'),
  stripe_charge_id   text CHECK (stripe_charge_id IS NULL OR char_length(stripe_charge_id) <= 120),
  stripe_description text CHECK (stripe_description IS NULL OR char_length(stripe_description) <= 500),
  stripe_created_at  timestamptz,
  entered_by         text CHECK (entered_by IS NULL OR char_length(entered_by) BETWEEN 1 AND 40),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  voided_at          timestamptz,
  voided_by          text CHECK (voided_by IS NULL OR char_length(voided_by) BETWEEN 1 AND 40),
  void_reason        text CHECK (void_reason IS NULL OR char_length(void_reason) <= 200),
  CHECK ((source = 'stripe') = (stripe_id IS NOT NULL)),
  CHECK (source <> 'stripe' OR voided_at IS NULL),
  CHECK ((voided_at IS NULL) = (voided_by IS NULL))
);
CREATE INDEX IF NOT EXISTS bl_budget_entries_paid_on_idx ON public.bl_budget_entries (paid_on);

CREATE TABLE IF NOT EXISTS public.bl_budget_settings (
  key        text PRIMARY KEY CHECK (key ~ '^[a-z_]{2,40}$'),
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bl_budget_reminder_log (
  target_month text NOT NULL CHECK (target_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  reminder_day smallint NOT NULL CHECK (reminder_day IN (19, 20)),
  sent_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (target_month, reminder_day)
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['bl_budget_months','bl_budget_goals','bl_budget_entries',
                           'bl_budget_settings','bl_budget_reminder_log']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- Check (should return 5 rows, all rowsecurity = true):
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename LIKE 'bl\_budget\_%' ORDER BY 1;

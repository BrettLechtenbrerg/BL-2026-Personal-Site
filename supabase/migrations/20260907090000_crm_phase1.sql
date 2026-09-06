--------------------------------------------------------------------------------
-- CRM PHASE 1 — messaging rails off GHL (docs/crm/04-PHASE1-PLAN.md)
--
-- 1. hub_messages: provider-neutral columns. contact_id = Twenty person id.
--    The ghl_* columns stay (nullable) until the Phase 5 cutover drop.
-- 2. contact_consent: per-contact marketing consent + opt-out timestamps.
--    Source of truth for "may we send marketing?" — fail-closed: no row = no.
--
-- Apply: paste into Supabase SQL editor (same as the July hub_messages
-- migration). Idempotent — safe to re-run.
--------------------------------------------------------------------------------

-- 1. hub_messages ---------------------------------------------------------------
ALTER TABLE hub_messages
  ADD COLUMN IF NOT EXISTS contact_id TEXT,
  ADD COLUMN IF NOT EXISTS provider TEXT
    CHECK (provider IS NULL OR provider IN ('resend', 'twilio')),
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT,
  ADD COLUMN IF NOT EXISTS direction TEXT NOT NULL DEFAULT 'outbound'
    CHECK (direction IN ('inbound', 'outbound')),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS complained_at TIMESTAMPTZ;

-- New skip reason for the paused SMS channel.
ALTER TABLE hub_messages DROP CONSTRAINT IF EXISTS hub_messages_skip_reason_check;
ALTER TABLE hub_messages ADD CONSTRAINT hub_messages_skip_reason_check
  CHECK (skip_reason IS NULL OR skip_reason IN ('no_contact', 'no_consent', 'sms_paused'));

CREATE INDEX IF NOT EXISTS hub_messages_contact_idx
  ON hub_messages (contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS hub_messages_provider_msg_idx
  ON hub_messages (provider_message_id);

-- Webhooks need to UPDATE delivery status. Scope the grant to those columns
-- only — body/recipient/status stay immutable (append-only audit intent).
GRANT UPDATE (delivered_at, bounced_at, complained_at) ON hub_messages TO service_role;

-- 2. contact_consent ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_consent (
  contact_id TEXT PRIMARY KEY,
  email_marketing BOOLEAN NOT NULL DEFAULT false,
  sms_marketing BOOLEAN NOT NULL DEFAULT false,
  email_unsubscribed_at TIMESTAMPTZ,
  sms_stopped_at TIMESTAMPTZ,
  -- Where the consent came from: 'form:<form_id>', 'hub', 'unsubscribe_link', 'bounce'
  source TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE contact_consent ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON contact_consent FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON contact_consent TO service_role;

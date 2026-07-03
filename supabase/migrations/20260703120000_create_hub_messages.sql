--==============================================================================
-- Comms Hub Messaging — append-only send log
--==============================================================================
-- Backs the Comms Hub (/hub/messaging): pick leads, compose an SMS or email,
-- send it through GHL's Conversations API (GHL stays the carrier). This table
-- is the audit ledger — ONE row per send attempt (sent / skipped / failed).
-- Nothing is ever deleted, so communication history is always reconstructable
-- without logging into GHL.
--
-- The message BODY is stored exactly as rendered + sent (merge tags already
-- resolved) so the log is a faithful record of what each person received.
--
-- Adapted from PMMA's power_hub_messages migration with two changes:
--   1. No student_id column — this site has no roster (Leads-only audience).
--   2. Lockdown posture applied from day one (PMMA's June-26 pattern):
--      RLS ON, ZERO policies, anon/authenticated revoked. Only the
--      service-role key (server-side API routes) can touch this table.
--
-- ⚠️ DEPLOY ORDER: run this in the Supabase SQL editor BEFORE using the hub.
-- Fully idempotent — safe to re-run.
--==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS hub_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Denormalized recipient name for the log view.
  recipient_name TEXT,

  -- Which rail. Drives icon + columns in the log.
  channel TEXT NOT NULL
    CHECK (channel IN ('sms', 'email')),

  -- The phone or email actually targeted (what we asked GHL to message).
  to_value TEXT,

  -- The GHL contact we sent to.
  ghl_contact_id TEXT,

  -- Email only. NULL for SMS.
  subject TEXT,

  -- The rendered body, exactly as sent (merge tags resolved).
  body TEXT,

  -- Outcome of the attempt.
  status TEXT NOT NULL
    CHECK (status IN ('sent', 'skipped', 'failed')),

  -- Why a recipient was skipped (no usable contact, missing consent).
  -- NULL for sent/failed.
  skip_reason TEXT
    CHECK (skip_reason IS NULL OR skip_reason IN ('no_contact', 'no_consent')),

  -- GHL's message id, returned on a successful send.
  ghl_message_id TEXT,

  -- Error detail when status = 'failed'.
  error TEXT,

  -- Typed name of whoever sent it (from the hub UI).
  sent_by TEXT,

  -- Groups every row from a single bulk send so the log can collapse a blast.
  batch_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes that match the queries the log view runs: newest-first feed and
-- per-batch lookups.
CREATE INDEX IF NOT EXISTS hub_messages_created_at_idx
  ON hub_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS hub_messages_batch_idx
  ON hub_messages (batch_id);

--------------------------------------------------------------------------------
-- LOCKDOWN — service-role only (PMMA June-26 posture, applied from day one).
-- RLS on with zero policies means anon/authenticated get nothing even via
-- PostgREST; the REVOKEs close the direct-grant path too. The API routes use
-- the service-role key, which bypasses RLS by design.
--------------------------------------------------------------------------------
ALTER TABLE hub_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON hub_messages FROM anon, authenticated;

-- Intentionally NO update or delete grants/policies for anyone — the log is
-- append-only; a send record can never be altered or removed after the fact.

-- Service-role grant — required because the project was created with
-- "Automatically expose new tables" disabled, which also skips service_role's
-- default privileges. RLS stays ON with zero policies; anon/authenticated
-- stay revoked. (Added after live deploy hit: permission denied for table
-- hub_messages.)
GRANT SELECT, INSERT ON hub_messages TO service_role;

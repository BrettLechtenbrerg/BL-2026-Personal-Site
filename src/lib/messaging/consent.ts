//==============================================================================
// CRM — marketing consent (Supabase `contact_consent`)
//==============================================================================
// Fail-closed: no row, no column, or any error ⇒ "no consent".
// Transactional mail (replies, confirmations) does NOT consult this; only
// sends flagged `marketing` do. Unsubscribe links land in setEmailMarketing().
//==============================================================================

import { createHmac, timingSafeEqual } from "crypto";
import { getServiceSupabase } from "@/lib/supabase-admin";

export type Channel = "sms" | "email";

export async function hasMarketingConsent(contactId: string, channel: Channel): Promise<boolean> {
  const col = channel === "sms" ? "sms_marketing" : "email_marketing";
  const { data, error } = await getServiceSupabase()
    .from("contact_consent")
    .select(col)
    .eq("contact_id", contactId)
    .maybeSingle();
  if (error || !data) return false;
  return (data as Record<string, unknown>)[col] === true;
}

export async function setMarketingConsent(args: {
  contactId: string;
  channel: Channel;
  granted: boolean;
  source: string;
}): Promise<void> {
  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    contact_id: args.contactId,
    source: args.source,
    updated_at: now,
  };
  if (args.channel === "email") {
    row.email_marketing = args.granted;
    row.email_unsubscribed_at = args.granted ? null : now;
  } else {
    row.sms_marketing = args.granted;
    row.sms_stopped_at = args.granted ? null : now;
  }
  const { error } = await getServiceSupabase()
    .from("contact_consent")
    .upsert(row, { onConflict: "contact_id" });
  if (error) throw new Error(`contact_consent upsert failed: ${error.message}`);
}

//------------------------------------------------------------------------------
// Unsubscribe tokens — HMAC(contact_id) so the link can't be forged to
// unsubscribe someone else, and carries no PII.
//------------------------------------------------------------------------------

function secret(): string {
  const s = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!s) throw new Error("UNSUBSCRIBE_HMAC_SECRET not set.");
  return s;
}

export function unsubscribeToken(contactId: string): string {
  const sig = createHmac("sha256", secret()).update(contactId).digest("base64url");
  return `${contactId}.${sig}`;
}

/** Returns the contact id when the token is valid, else null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const contactId = token.slice(0, dot);
  const given = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(contactId).digest("base64url");
  if (given.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected)) ? contactId : null;
}

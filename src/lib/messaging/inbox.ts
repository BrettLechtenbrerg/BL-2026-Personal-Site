//==============================================================================
// CRM — Inbox (threads from hub_messages)
//==============================================================================
// One thread per contact, built from the hub_messages ledger. Phase 1 is
// outbound-only (replies go to Brett's Gmail → Twenty sync); inbound rows
// arrive in Phase 5 when Resend receiving is enabled. Shapes match what the
// /hub Inbox tab already renders (was ghl-conversations.ts).
//==============================================================================

import { getServiceSupabase } from "@/lib/supabase-admin";

export interface InboxConversation {
  /** Thread key = contact id (one thread per person). */
  conversation_id: string;
  contact_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  last_message_body: string;
  last_message_at: string | null;
  last_message_channel: "sms" | "email" | "other";
  last_message_direction: "inbound" | "outbound" | "unknown";
  unread_count: number;
}

export interface ConversationMessage {
  id: string;
  direction: "inbound" | "outbound";
  channel: "sms" | "email" | "other";
  body: string;
  date_added: string | null;
  status: string | null;
}

interface Row {
  id: string;
  contact_id: string | null;
  recipient_name: string | null;
  channel: "sms" | "email";
  to_value: string | null;
  body: string | null;
  status: string;
  direction: "inbound" | "outbound";
  created_at: string;
}

const COLS = "id, contact_id, recipient_name, channel, to_value, body, status, direction, created_at";

/** Most recent thread per contact (delivered/attempted sends only). */
export async function listConversations(limit = 50): Promise<InboxConversation[]> {
  const { data, error } = await getServiceSupabase()
    .from("hub_messages")
    .select(COLS)
    .not("contact_id", "is", null)
    .in("status", ["sent", "failed"])
    .order("created_at", { ascending: false })
    .limit(limit * 6); // simplification: over-fetch then group in memory; fine at hub scale
  if (error) throw new Error(error.message);

  const byContact = new Map<string, InboxConversation>();
  for (const r of (data ?? []) as Row[]) {
    const id = r.contact_id!;
    if (byContact.has(id)) continue;
    byContact.set(id, {
      conversation_id: id,
      contact_id: id,
      name: r.recipient_name || r.to_value || "Lead",
      email: r.channel === "email" ? r.to_value : null,
      phone: r.channel === "sms" ? r.to_value : null,
      last_message_body: r.body ?? "",
      last_message_at: r.created_at,
      last_message_channel: r.channel,
      last_message_direction: r.direction,
      unread_count: 0,
    });
    if (byContact.size >= limit) break;
  }
  return [...byContact.values()];
}

/** Every message to/from one contact, oldest first. */
export async function getConversation(contactId: string): Promise<ConversationMessage[]> {
  const { data, error } = await getServiceSupabase()
    .from("hub_messages")
    .select(COLS)
    .eq("contact_id", contactId)
    .in("status", ["sent", "failed"])
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw new Error(error.message);
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    direction: r.direction,
    channel: r.channel,
    body: r.body ?? "",
    date_added: r.created_at,
    status: r.status,
  }));
}

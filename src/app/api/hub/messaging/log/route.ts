//==============================================================================
// COMMS HUB — Messaging send log
//==============================================================================
// GET /api/hub/messaging/log
//   ?limit=100      — how many recent rows (default 100, max 500)
//   ?batch_id=...   — only rows from one bulk send
//   → { messages: HubMessageRow[] }
//
// Read-only feed over the append-only hub_messages ledger, newest first.
// Powers the "Log" tab on the Messaging page. Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { getServiceSupabase } from "@/lib/supabase-admin";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

export async function GET(request: Request) {
  const denied = await requireHubSession();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit"));
    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_LIMIT)
        : DEFAULT_LIMIT;
    const batchId = searchParams.get("batch_id");

    const supabase = getServiceSupabase();
    let query = supabase
      .from("hub_messages")
      .select(
        "id, recipient_name, channel, to_value, ghl_contact_id, subject, body, status, skip_reason, ghl_message_id, error, sent_by, batch_id, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (batchId) query = query.eq("batch_id", batchId);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (err) {
    console.error("GET /api/hub/messaging/log failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

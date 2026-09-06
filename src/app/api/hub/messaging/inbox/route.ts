//==============================================================================
// COMMS HUB — Inbox (recent threads)
//==============================================================================
// GET /api/hub/messaging/inbox
//   → { conversations: InboxConversation[] } — one thread per contact from
//     the hub_messages ledger, newest activity first. Phase 1 is outbound
//     only; replies land in Brett's Gmail (Reply-To) and sync into Twenty.
//
// Read-only. Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { listConversations } from "@/lib/messaging/inbox";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireHubSession();
  if (denied) return denied;

  try {
    return NextResponse.json({ conversations: await listConversations(50) });
  } catch (err) {
    console.error("GET /api/hub/messaging/inbox failed:", err);
    return NextResponse.json({ error: "Failed to load the inbox." }, { status: 500 });
  }
}

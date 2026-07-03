//==============================================================================
// COMMS HUB — Inbox (recent GHL conversations)
//==============================================================================
// GET /api/hub/messaging/inbox
//   → { conversations: InboxConversation[] } — the location's most recent
//     conversations (newest activity first) with last-message preview,
//     channel, direction, and unread count. See replies without opening GHL.
//
// Read-only. Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { searchConversations } from "@/lib/ghl-conversations";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireHubSession();
  if (denied) return denied;

  const result = await searchConversations(50);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error ?? "Failed to load the inbox.",
        scope_error: result.scopeError ?? false,
      },
      { status: 502 }
    );
  }
  return NextResponse.json({ conversations: result.conversations });
}

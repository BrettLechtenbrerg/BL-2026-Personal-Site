//==============================================================================
// COMMS HUB — Inbox thread + reply
//==============================================================================
// GET /api/hub/messaging/inbox/[conversationId]
//   → { messages: ConversationMessage[] } — the full thread, oldest first.
//     conversationId = contact id (one thread per person).
//
// POST /api/hub/messaging/inbox/[conversationId]
//   Body: { contact_id, channel: 'sms'|'email', body, subject?, sent_by?,
//           recipient_name?, to_value? }
//   → sends the reply through sendMessage() (same rails as Compose) and logs
//     it to hub_messages. Transactional — no consent gate, no merge tags.
//
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { getConversation } from "@/lib/messaging/inbox";
import { sendMessage } from "@/lib/messaging/send";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  const { conversationId } = await params;
  try {
    return NextResponse.json({ messages: await getConversation(conversationId) });
  } catch (err) {
    console.error("GET /api/hub/messaging/inbox/[conversationId] failed:", err);
    return NextResponse.json({ error: "Failed to load the thread." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  await params; // thread key == contact_id; the body carries it explicitly.

  let payload: {
    contact_id?: string;
    channel?: string;
    body?: string;
    subject?: string;
    sent_by?: string;
    recipient_name?: string;
    to_value?: string;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const contactId = (payload.contact_id ?? "").trim();
  if (!contactId) {
    return NextResponse.json({ error: "Missing contact_id." }, { status: 400 });
  }
  const channel = payload.channel === "email" ? "email" : "sms";
  const body = (payload.body ?? "").trim();
  if (!body) {
    return NextResponse.json({ error: "Reply is empty." }, { status: 400 });
  }
  const toValue = (payload.to_value ?? "").trim() || null;

  try {
    const r = await sendMessage({
      channel,
      to: {
        contact_id: contactId,
        name: (payload.recipient_name ?? "").trim() || undefined,
        email: channel === "email" ? toValue : null,
        phone: channel === "sms" ? toValue : null,
      },
      // Replies are literal — escape braces so nothing is treated as a merge tag.
      body: body.replace(/\{\{/g, "{ {"),
      subject: (payload.subject ?? "").trim() || "Re: Brett Lechtenberg",
      sentBy: (payload.sent_by ?? "").trim() || null,
    });

    if (r.status !== "sent") {
      return NextResponse.json(
        { error: r.error ?? "Send failed.", skip_reason: r.skip_reason },
        { status: r.skip_reason === "sms_paused" ? 409 : 502 }
      );
    }
    return NextResponse.json({ sent: true, provider_message_id: r.provider_message_id ?? null });
  } catch (err) {
    console.error("POST /api/hub/messaging/inbox/[conversationId] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

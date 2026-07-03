//==============================================================================
// COMMS HUB — Inbox thread + reply
//==============================================================================
// GET /api/hub/messaging/inbox/[conversationId]
//   → { messages: ConversationMessage[] } — the full thread, oldest first.
//     Needs the `conversations/message.readonly` PIT scope; until it's added
//     this returns { scope_error: true } and the UI shows a banner (the reply
//     path below is unaffected — it uses the write scope).
//
// POST /api/hub/messaging/inbox/[conversationId]
//   Body: { contact_id, channel: 'sms'|'email', body, subject?, sent_by?,
//           recipient_name?, to_value? }
//   → sends the reply through GHL (same rails as Compose) and logs it to
//     hub_messages. No merge tags — a reply is written to one known person.
//
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireHubSession } from "@/lib/hub-session";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { getConversationMessages } from "@/lib/ghl-conversations";
import { sendGhlMessage } from "@/lib/ghl-messaging";
import { textToEmailHtml } from "@/lib/messaging-render";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  const { conversationId } = await params;
  const result = await getConversationMessages(conversationId);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error ?? "Failed to load the thread.",
        scope_error: result.scopeError ?? false,
      },
      { status: result.scopeError ? 200 : 502 }
    );
  }
  return NextResponse.json({ messages: result.messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  await params; // conversationId not needed for the send — GHL routes by contact.

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
  const subject = (payload.subject ?? "").trim() || "Re: Brett Lechtenberg";
  const sentBy = (payload.sent_by ?? "").trim() || null;
  const recipientName = (payload.recipient_name ?? "").trim() || null;
  const toValue = (payload.to_value ?? "").trim() || null;

  try {
    const sendResult =
      channel === "sms"
        ? await sendGhlMessage({ type: "SMS", contactId, message: body })
        : await sendGhlMessage({
            type: "Email",
            contactId,
            subject,
            html: textToEmailHtml(body),
          });

    // Audit — same append-only table as every Compose send.
    const supabase = getServiceSupabase();
    await supabase.from("hub_messages").insert({
      recipient_name: recipientName,
      channel,
      to_value: toValue,
      ghl_contact_id: contactId,
      subject: channel === "email" ? subject : null,
      body,
      status: sendResult.ok ? "sent" : "failed",
      ghl_message_id: sendResult.messageId ?? null,
      error: sendResult.ok ? null : (sendResult.error ?? "Send failed."),
      sent_by: sentBy,
      batch_id: randomUUID(),
    });

    if (!sendResult.ok) {
      return NextResponse.json(
        {
          error: sendResult.error ?? "Send failed.",
          scope_error: sendResult.scopeError ?? false,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ sent: true, ghl_message_id: sendResult.messageId ?? null });
  } catch (err) {
    console.error("POST /api/hub/messaging/inbox/[conversationId] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

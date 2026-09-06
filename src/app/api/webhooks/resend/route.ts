//==============================================================================
// CRM — Resend webhook (delivery events)
//==============================================================================
// POST /api/webhooks/resend   (configure in Resend → Webhooks; secret →
// RESEND_WEBHOOK_SECRET). Svix-signed; raw body verified before parsing.
//
// Updates delivery timestamps on the matching hub_messages row and, on a
// hard bounce or spam complaint, revokes that contact's email marketing
// consent so we never send marketing to a dead/angry address again.
// Always 200 after verification so Resend stops retrying.
//==============================================================================

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { setMarketingConsent } from "@/lib/messaging/consent";

export const dynamic = "force-dynamic";

const STAMP: Record<string, "delivered_at" | "bounced_at" | "complained_at"> = {
  "email.delivered": "delivered_at",
  "email.bounced": "bounced_at",
  "email.complained": "complained_at",
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });

  const payload = await request.text();
  let event: {
    type: string;
    created_at: string;
    data: { email_id?: string; bounce?: { type?: string } };
  };
  try {
    event = new Resend("unused").webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    }) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const column = STAMP[event.type];
  const emailId = event.data?.email_id;
  if (!column || !emailId) return NextResponse.json({ ignored: event.type });

  const supabase = getServiceSupabase();
  const { data: row, error } = await supabase
    .from("hub_messages")
    .update({ [column]: event.created_at })
    .eq("provider", "resend")
    .eq("provider_message_id", emailId)
    .select("contact_id")
    .maybeSingle();
  if (error) {
    console.error("[resend-webhook] hub_messages update failed:", error.message);
    return NextResponse.json({ error: "Store failed." }, { status: 500 }); // Resend retries
  }

  // Revoke marketing consent on a spam complaint or a *permanent* bounce.
  // Transient bounces (full mailbox, greylisting) keep consent.
  const revoke =
    column === "complained_at" ||
    (column === "bounced_at" && /permanent/i.test(event.data.bounce?.type ?? ""));
  if (row?.contact_id && revoke) {
    await setMarketingConsent({
      contactId: row.contact_id,
      channel: "email",
      granted: false,
      source: column === "bounced_at" ? "bounce" : "complaint",
    }).catch((err) => console.error("[resend-webhook] consent revoke failed:", err));
  }

  return NextResponse.json({ ok: true, matched: Boolean(row) });
}

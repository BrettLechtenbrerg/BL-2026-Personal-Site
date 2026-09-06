//==============================================================================
// CRM — single send entry point
//==============================================================================
// sendMessage() is the ONLY way anything on this site sends a message:
//   hub Compose / Inbox reply today, Vercel Workflows in Phase 3.
// It: resolves the recipient → consent gate (marketing only) → renders merge
// tags → provider → writes exactly ONE hub_messages row (sent/skipped/failed).
//==============================================================================

import { randomUUID } from "crypto";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { renderMessage, mergeVarsForLead, textToEmailHtml } from "@/lib/messaging-render";
import { hasMarketingConsent, unsubscribeToken, type Channel } from "./consent";
import { sendEmail } from "./resend";
import { sendSms, SMS_PAUSED } from "./sms";

export type Status = "sent" | "skipped" | "failed";
export type SkipReason = "no_contact" | "no_consent" | "sms_paused";

export interface Recipient {
  contact_id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
}

export interface SendMessageArgs {
  channel: Channel;
  to: Recipient;
  /** Body with merge tags ({{first_name}} …). */
  body: string;
  /** Email only. */
  subject?: string;
  /** Enforce consent + add unsubscribe link. */
  marketing?: boolean;
  sentBy?: string | null;
  batchId?: string;
  /** Render + log 'skipped', send nothing. */
  dryRun?: boolean;
}

export interface SendMessageResult {
  hub_message_id: string;
  status: Status;
  skip_reason?: SkipReason;
  provider_message_id?: string;
  rendered_body: string;
  error?: string;
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.brettlechtenberg.com";
}

export async function sendMessage(args: SendMessageArgs): Promise<SendMessageResult> {
  const { channel, to } = args;
  const hubMessageId = randomUUID();
  const batchId = args.batchId ?? randomUUID();
  const toValue = (channel === "sms" ? to.phone : to.email)?.trim() || null;
  const recipientName =
    to.name?.trim() || [to.first_name, to.last_name].filter(Boolean).join(" ").trim() || null;

  const vars = mergeVarsForLead({ first_name: to.first_name, last_name: to.last_name });
  const renderedBody = renderMessage(args.body, vars);
  const renderedSubject = channel === "email" ? renderMessage(args.subject ?? "", vars) : null;

  const record = async (
    status: Status,
    extra: { skip_reason?: SkipReason; provider_message_id?: string; error?: string }
  ): Promise<SendMessageResult> => {
    const { error } = await getServiceSupabase().from("hub_messages").insert({
      id: hubMessageId,
      recipient_name: recipientName,
      channel,
      to_value: toValue,
      contact_id: to.contact_id,
      provider: status === "sent" ? (channel === "email" ? "resend" : "twilio") : null,
      provider_message_id: extra.provider_message_id ?? null,
      direction: "outbound",
      subject: renderedSubject,
      body: renderedBody,
      status,
      skip_reason: extra.skip_reason ?? null,
      error: extra.error ?? null,
      sent_by: args.sentBy ?? null,
      batch_id: batchId,
    });
    if (error) console.error("[sendMessage] hub_messages insert failed:", error.message);
    return {
      hub_message_id: hubMessageId,
      status,
      skip_reason: extra.skip_reason,
      provider_message_id: extra.provider_message_id,
      rendered_body: renderedBody,
      error: extra.error,
    };
  };

  if (!toValue) {
    return record("skipped", {
      skip_reason: "no_contact",
      error: channel === "sms" ? "No phone on file." : "No email on file.",
    });
  }
  if (channel === "sms" && SMS_PAUSED) {
    return record("skipped", { skip_reason: "sms_paused", error: "SMS is paused (Phase 6)." });
  }
  if (args.marketing && !(await hasMarketingConsent(to.contact_id, channel))) {
    return record("skipped", {
      skip_reason: "no_consent",
      error: `Marketing ${channel} requires recorded consent.`,
    });
  }
  if (args.dryRun) {
    return record("skipped", { error: "dry_run — not sent." });
  }

  if (channel === "sms") {
    const r = await sendSms({ to: toValue, body: renderedBody, hubMessageId });
    return r.ok
      ? record("sent", { provider_message_id: r.providerMessageId })
      : record("failed", { error: r.error ?? "Send failed." });
  }

  let unsubscribeUrl: string | undefined;
  if (args.marketing) {
    try {
      unsubscribeUrl = `${siteUrl()}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken(to.contact_id))}`;
    } catch (err) {
      // Never send marketing without a working unsubscribe link.
      return record("failed", { error: err instanceof Error ? err.message : "Unsubscribe link unavailable." });
    }
  }
  const html =
    textToEmailHtml(renderedBody) +
    (unsubscribeUrl
      ? `<p style="margin-top:24px;font-size:12px;color:#888"><a href="${unsubscribeUrl}">Unsubscribe</a></p>`
      : "");
  const r = await sendEmail({
    to: toValue,
    subject: renderedSubject || "Message from Brett Lechtenberg",
    html,
    hubMessageId,
    unsubscribeUrl,
  });
  return r.ok
    ? record("sent", { provider_message_id: r.providerMessageId })
    : record("failed", { error: r.error ?? "Send failed." });
}

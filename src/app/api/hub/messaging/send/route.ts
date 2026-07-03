//==============================================================================
// COMMS HUB — Messaging send + log
//==============================================================================
// POST /api/hub/messaging/send
//   Body: {
//     channel: 'sms' | 'email',
//     leads: LeadRecipient[],         // { contact_id, first_name?, last_name?,
//                                     //   name?, email?, phone? } straight from
//                                     //   GET /api/hub/messaging/leads
//     body: string,                   // SMS text OR email body (merge tags ok)
//     subject?: string,               // email only
//     marketing?: boolean,            // true ⇒ enforce SMS marketing consent
//     sent_by?: string,               // sender name (audit)
//     dry_run?: boolean               // render + log 'skipped', send nothing
//   }
//   → { batch_id, results: PerRecipientResult[], summary: {...} }
//
// Leads-only trim of PMMA's send route (this site has no student roster).
// For each selected lead this route:
//   1. for marketing SMS, enforces the contact's sms_consent_marketing flag,
//   2. renders the body per-lead (merge tags),
//   3. dedupes identical messages to the same contact within the batch,
//   4. sends through GHL Conversations (sequentially, with a small throttle),
//   5. writes ONE hub_messages row per attempt (sent / skipped / failed).
//
// GHL stays the carrier — replies + STOP/HELP opt-outs are handled by GHL.
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireHubSession } from "@/lib/hub-session";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { getContactSmsConsent } from "@/lib/ghl-contacts";
import { sendGhlMessage } from "@/lib/ghl-messaging";
import { renderMessage, mergeVarsForLead, textToEmailHtml } from "@/lib/messaging-render";

// Conservative bulk cap + throttle (respect GHL rate limits).
const MAX_BATCH = 200;
const THROTTLE_MS = 350;

type Channel = "sms" | "email";
type Status = "sent" | "skipped" | "failed";
type SkipReason = "no_contact" | "no_consent";

interface LeadRecipient {
  contact_id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface PerRecipientResult {
  contact_id: string;
  recipient_name: string;
  status: Status;
  skip_reason?: SkipReason;
  ghl_message_id?: string;
  error?: string;
}

/** Sanitize the client-supplied leads array (shape from GET /messaging/leads). */
function parseLeads(raw: unknown): LeadRecipient[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: LeadRecipient[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const contactId = typeof o.contact_id === "string" ? o.contact_id.trim() : "";
    if (!contactId || seen.has(contactId)) continue;
    seen.add(contactId);
    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    out.push({
      contact_id: contactId,
      first_name: str(o.first_name),
      last_name: str(o.last_name),
      name: str(o.name) || [str(o.first_name), str(o.last_name)].filter(Boolean).join(" ") || "Lead",
      email: str(o.email) || null,
      phone: str(o.phone) || null,
    });
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const denied = await requireHubSession();
  if (denied) return denied;

  let payload: {
    channel?: string;
    leads?: unknown;
    body?: string;
    subject?: string;
    marketing?: boolean;
    sent_by?: string;
    dry_run?: boolean;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const channel = payload.channel as Channel;
  if (channel !== "sms" && channel !== "email") {
    return NextResponse.json({ error: "channel must be 'sms' or 'email'." }, { status: 400 });
  }

  const leads = parseLeads(payload.leads);
  if (leads.length === 0) {
    return NextResponse.json({ error: "No recipients selected." }, { status: 400 });
  }
  if (leads.length > MAX_BATCH) {
    return NextResponse.json(
      { error: `Too many recipients (${leads.length}). Max ${MAX_BATCH} per send.` },
      { status: 400 }
    );
  }

  const messageBody = (payload.body ?? "").trim();
  if (!messageBody) {
    return NextResponse.json({ error: "Message body is empty." }, { status: 400 });
  }
  const subject = (payload.subject ?? "").trim();
  if (channel === "email" && !subject) {
    return NextResponse.json({ error: "Email subject is required." }, { status: 400 });
  }

  const marketing = Boolean(payload.marketing);
  const dryRun = Boolean(payload.dry_run);
  const sentBy = (payload.sent_by ?? "").trim() || null;
  const batchId = randomUUID();

  try {
    const supabase = getServiceSupabase();

    const results: PerRecipientResult[] = [];
    let scopeErrorHit = false;

    // Contact dedupe — an identical rendered message to the same contact in
    // one batch is sent ONCE (parseLeads already dropped duplicate ids; this
    // also collapses distinct rows that would render identically).
    const sentKeys = new Set<string>();
    let duplicateCount = 0;

    // Sequential send so we respect GHL rate limits and can throttle.
    for (const lead of leads) {
      const record = async (
        status: Status,
        extra: {
          skip_reason?: SkipReason;
          to_value?: string | null;
          ghl_message_id?: string | null;
          error?: string | null;
          body?: string | null;
        }
      ) => {
        await supabase.from("hub_messages").insert({
          recipient_name: lead.name || null,
          channel,
          to_value: extra.to_value ?? null,
          ghl_contact_id: lead.contact_id,
          subject: channel === "email" ? subject : null,
          body: extra.body ?? null,
          status,
          skip_reason: extra.skip_reason ?? null,
          ghl_message_id: extra.ghl_message_id ?? null,
          error: extra.error ?? null,
          sent_by: sentBy,
          batch_id: batchId,
        });
        results.push({
          contact_id: lead.contact_id,
          recipient_name: lead.name,
          status,
          skip_reason: extra.skip_reason,
          ghl_message_id: extra.ghl_message_id ?? undefined,
          error: extra.error ?? undefined,
        });
      };

      const toValue = channel === "sms" ? lead.phone : lead.email;
      if (!toValue) {
        await record("skipped", {
          skip_reason: "no_contact",
          error: channel === "sms" ? "No phone on file." : "No email on file.",
        });
        continue;
      }

      const vars = mergeVarsForLead(lead);
      const renderedBody = renderMessage(messageBody, vars);
      const renderedSubject = channel === "email" ? renderMessage(subject, vars) : undefined;

      const dedupeKey = `${lead.contact_id}::${channel}::${renderedSubject ?? ""}::${renderedBody}`;
      if (sentKeys.has(dedupeKey)) {
        duplicateCount++;
        await record("skipped", {
          to_value: toValue,
          body: renderedBody,
          error: "Duplicate — identical message already going to this contact in this batch.",
        });
        continue;
      }

      // Marketing SMS consent gate — fail safe (null/unknown ⇒ skip).
      if (marketing && channel === "sms") {
        const consent = await getContactSmsConsent(lead.contact_id);
        if (consent.marketing !== true) {
          await record("skipped", {
            skip_reason: "no_consent",
            to_value: toValue,
            error: "Marketing SMS requires sms_consent_marketing = true.",
          });
          continue;
        }
      }

      // Dry run: log as skipped (proves rendering, sends nothing). Claim the
      // dedupe key so the preview mirrors a real send.
      if (dryRun) {
        sentKeys.add(dedupeKey);
        await record("skipped", {
          to_value: toValue,
          body: renderedBody,
          error: "dry_run — not sent.",
        });
        continue;
      }

      const sendResult =
        channel === "sms"
          ? await sendGhlMessage({ type: "SMS", contactId: lead.contact_id, message: renderedBody })
          : await sendGhlMessage({
              type: "Email",
              contactId: lead.contact_id,
              subject: renderedSubject || subject,
              html: textToEmailHtml(renderedBody),
            });

      if (sendResult.ok) {
        // Only claim the dedupe key on a real, successful send.
        sentKeys.add(dedupeKey);
        await record("sent", {
          to_value: toValue,
          ghl_message_id: sendResult.messageId ?? null,
          body: renderedBody,
        });
      } else {
        if (sendResult.scopeError) scopeErrorHit = true;
        await record("failed", {
          to_value: toValue,
          body: renderedBody,
          error: sendResult.error ?? "Send failed.",
        });
      }

      // Throttle between live sends only.
      if (!dryRun) await sleep(THROTTLE_MS);
    }

    const summary = {
      total: results.length,
      sent: results.filter((r) => r.status === "sent").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      failed: results.filter((r) => r.status === "failed").length,
      duplicates_collapsed: duplicateCount,
    };

    return NextResponse.json({
      batch_id: batchId,
      dry_run: dryRun,
      scope_error: scopeErrorHit,
      summary,
      results,
    });
  } catch (err) {
    console.error("POST /api/hub/messaging/send failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

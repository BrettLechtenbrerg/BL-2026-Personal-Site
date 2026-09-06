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
//     marketing?: boolean,            // true ⇒ enforce marketing consent + add unsubscribe
//     sent_by?: string,               // sender name (audit)
//     dry_run?: boolean               // render + log 'skipped', send nothing
//   }
//   → { batch_id, results: PerRecipientResult[], summary: {...} }
//
// Thin loop over sendMessage() (src/lib/messaging/send.ts), which owns the
// consent gate, rendering, provider call and the hub_messages row. This route
// only validates input, dedupes contact_ids within the batch, and throttles.
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireHubSession } from "@/lib/hub-session";
import { sendMessage, type Recipient, type SkipReason, type Status } from "@/lib/messaging/send";
import { SMS_PAUSED } from "@/lib/messaging/sms";

const MAX_BATCH = 200;
const THROTTLE_MS = 350; // Resend Free: 2 req/s.
const DAILY_CAP_WARN = 80; // Resend Free = 100/day, shared with Speaker's Edge auth mail.

type Channel = "sms" | "email";

interface PerRecipientResult {
  contact_id: string;
  recipient_name: string;
  status: Status;
  skip_reason?: SkipReason;
  provider_message_id?: string;
  error?: string;
}

/** Sanitize the client-supplied leads array (shape from GET /messaging/leads). */
function parseLeads(raw: unknown): Required<Recipient>[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Required<Recipient>[] = [];
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
  if (channel === "sms" && SMS_PAUSED) {
    return NextResponse.json(
      { error: "SMS is paused until Phase 6 — nothing was sent." },
      { status: 409 }
    );
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
  if (channel === "email" && leads.length > DAILY_CAP_WARN && !payload.dry_run) {
    return NextResponse.json(
      {
        error: `Resend Free allows 100 emails/day (shared with Speaker's Edge). Keep a batch under ${DAILY_CAP_WARN} until the plan is upgraded.`,
      },
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
    const results: PerRecipientResult[] = [];

    // parseLeads() already collapsed duplicate contact_ids, so one send per lead.
    for (const lead of leads) {
      const r = await sendMessage({
        channel,
        to: lead,
        body: messageBody,
        subject,
        marketing,
        sentBy,
        batchId,
        dryRun,
      });
      results.push({
        contact_id: lead.contact_id,
        recipient_name: lead.name,
        status: r.status,
        skip_reason: r.skip_reason,
        provider_message_id: r.provider_message_id,
        error: r.error,
      });

      if (!dryRun && r.status === "sent") await sleep(THROTTLE_MS);
    }

    const summary = {
      total: results.length,
      sent: results.filter((r) => r.status === "sent").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      failed: results.filter((r) => r.status === "failed").length,
    };

    return NextResponse.json({ batch_id: batchId, dry_run: dryRun, summary, results });
  } catch (err) {
    console.error("POST /api/hub/messaging/send failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

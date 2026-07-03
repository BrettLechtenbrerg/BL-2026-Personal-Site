/**
 * Server-only GHL Conversations helper — send an SMS or email THROUGH GHL so
 * GHL stays the carrier. Replies still land in the GHL inbox and STOP/HELP
 * opt-outs are still handled automatically by GHL/Twilio. The Comms Hub never
 * has to log into Go High Level.
 *
 * Ported verbatim from PMMA's lib/ghl-messaging.ts (proven live July 2026).
 *
 * Endpoint (verified against the GHL Conversations API):
 *   POST https://services.leadconnectorhq.com/conversations/messages
 *   Authorization: Bearer ${GHL_PIT_TOKEN}
 *   Version: 2021-04-15   ← conversations uses 2021-04-15, NOT 2021-07-28
 *                            (that version is for the contacts API).
 *
 *   SMS:    { type: 'SMS',   contactId, message }
 *   Email:  { type: 'Email', contactId, subject, html, attachments? }
 *
 * `attachments` is an array of HTTPS file URLs (GHL fetches them server-side;
 * local paths / base64 are not supported). 20 MB email cap.
 *
 * Required PIT scope: `conversations/message.write`.
 *
 * Best-effort: never throws. Returns { ok, messageId?, conversationId?, error? }.
 */

const API = "https://services.leadconnectorhq.com";

/** Conversations API version — deliberately different from the contacts API. */
const CONVERSATIONS_VERSION = "2021-04-15";

export type GhlMessageChannel = "SMS" | "Email";

export interface SendGhlMessageArgs {
  type: GhlMessageChannel;
  contactId: string;
  /** SMS body. Required for type 'SMS'. */
  message?: string;
  /** Email subject. Required for type 'Email'. */
  subject?: string;
  /** Email HTML body. Required for type 'Email'. */
  html?: string;
  /** HTTPS file URLs to attach (Email). GHL fetches them; 20 MB email cap. */
  attachments?: string[];
}

export interface SendGhlMessageResult {
  ok: boolean;
  messageId?: string;
  conversationId?: string;
  /** True when the failure was specifically a missing-scope / auth problem. */
  scopeError?: boolean;
  error?: string;
}

function authHeaders(): Record<string, string> | null {
  const token = process.env.GHL_PIT_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Version: CONVERSATIONS_VERSION,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

/**
 * Send a single message via GHL Conversations. Validates the channel-specific
 * payload, posts to the API, and normalizes the response.
 */
export async function sendGhlMessage(
  args: SendGhlMessageArgs
): Promise<SendGhlMessageResult> {
  const headers = authHeaders();
  if (!headers) {
    return { ok: false, error: "GHL_PIT_TOKEN not set — cannot send messages." };
  }
  if (!args.contactId) {
    return { ok: false, error: "Missing GHL contactId." };
  }

  let body: Record<string, unknown>;
  if (args.type === "SMS") {
    if (!args.message || !args.message.trim()) {
      return { ok: false, error: "SMS message body is empty." };
    }
    body = { type: "SMS", contactId: args.contactId, message: args.message };
  } else {
    if (!args.subject || !args.subject.trim()) {
      return { ok: false, error: "Email subject is empty." };
    }
    if (!args.html || !args.html.trim()) {
      return { ok: false, error: "Email body is empty." };
    }
    body = {
      type: "Email",
      contactId: args.contactId,
      subject: args.subject,
      html: args.html,
    };
    // Only attach valid HTTPS URLs (GHL rejects local paths / base64). Drop
    // anything else rather than fail the whole send.
    const validAttachments = (args.attachments ?? [])
      .filter((u) => typeof u === "string" && /^https:\/\//i.test(u.trim()))
      .map((u) => u.trim());
    if (validAttachments.length > 0) {
      body.attachments = validAttachments;
    }
  }

  try {
    const res = await fetch(`${API}/conversations/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        messageId?: string;
        conversationId?: string;
        msg?: string;
      };
      return {
        ok: true,
        messageId: data.messageId,
        conversationId: data.conversationId,
      };
    }

    const text = await res.text().catch(() => "");
    // 401/403 from GHL on this endpoint almost always means the PIT token is
    // missing the conversations/message.write scope.
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        scopeError: true,
        error:
          "GHL messaging scope not enabled. Add the `conversations/message.write` scope to the Private Integration token, then update GHL_PIT_TOKEN in Vercel if the token was regenerated.",
      };
    }
    return {
      ok: false,
      error: `GHL send failed (${res.status}): ${text || res.statusText}`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error sending GHL message.",
    };
  }
}

/**
 * Server-only GHL Conversations reader — powers the Comms Hub Inbox so Brett
 * (or team) can see replies and full threads without logging into GHL.
 *
 * Ported verbatim from PMMA's lib/ghl-conversations.ts (proven live July 2026).
 *
 * Endpoints:
 *   GET /conversations/search?locationId=&limit=     Version: 2021-04-15
 *     → { conversations: [...], total }
 *     Scope: conversations.readonly
 *
 *   GET /conversations/{id}/messages?limit=           Version: 2021-04-15
 *     → { messages: { lastMessageId, nextPage, messages: [...] } }
 *     Scope: conversations/message.readonly
 *     ⚠️ "View Conversations" vs "View Conversation Messages" are DIFFERENT
 *     scopes in GHL's picker — the token needs BOTH "View" scopes.
 *
 * Best-effort: never throws.
 */

const API = "https://services.leadconnectorhq.com";
const CONVERSATIONS_VERSION = "2021-04-15";

export interface InboxConversation {
  conversation_id: string;
  contact_id: string;
  /** Contact display name, falling back to email/phone. */
  name: string;
  email: string | null;
  phone: string | null;
  last_message_body: string;
  /** ISO timestamp of the last message (null if GHL omitted it). */
  last_message_at: string | null;
  /** 'sms' | 'email' | 'other' — derived from GHL's TYPE_* constant. */
  last_message_channel: "sms" | "email" | "other";
  /** 'inbound' = the contact wrote last (needs a reply). */
  last_message_direction: "inbound" | "outbound" | "unknown";
  unread_count: number;
}

export interface ConversationMessage {
  id: string;
  direction: "inbound" | "outbound";
  channel: "sms" | "email" | "other";
  body: string;
  date_added: string | null;
  status: string | null;
}

function authHeaders(): Record<string, string> | null {
  const token = process.env.GHL_PIT_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Version: CONVERSATIONS_VERSION,
    Accept: "application/json",
  };
}

function channelFromType(t: unknown): "sms" | "email" | "other" {
  const s = String(t ?? "").toUpperCase();
  if (s.includes("SMS")) return "sms";
  if (s.includes("EMAIL")) return "email";
  return "other";
}

function toIso(v: unknown): string | null {
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v).toISOString();
  if (typeof v === "string" && v) {
    const t = Date.parse(v);
    return Number.isFinite(t) ? new Date(t).toISOString() : null;
  }
  return null;
}

/**
 * Most recent conversations for the location (GHL returns newest-activity
 * first). `limit` capped at 100 by GHL.
 */
export async function searchConversations(limit = 50): Promise<{
  ok: boolean;
  conversations: InboxConversation[];
  scopeError?: boolean;
  error?: string;
}> {
  const headers = authHeaders();
  const locationId = process.env.GHL_LOCATION_ID || null;
  if (!headers || !locationId) {
    return {
      ok: false,
      conversations: [],
      error: "GHL_PIT_TOKEN or GHL_LOCATION_ID not set — cannot load the inbox.",
    };
  }

  try {
    const res = await fetch(
      `${API}/conversations/search?locationId=${encodeURIComponent(locationId)}&limit=${Math.min(limit, 100)}`,
      { headers }
    );
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        conversations: [],
        scopeError: true,
        error:
          "GHL inbox scope not enabled. Add `conversations.readonly` (View Conversations) to the Private Integration token.",
      };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        conversations: [],
        error: `GHL conversation search failed (${res.status}): ${text || res.statusText}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as {
      conversations?: Array<Record<string, unknown>>;
    };
    const conversations = (data.conversations ?? [])
      .map((c): InboxConversation | null => {
        const id = String(c.id ?? "").trim();
        const contactId = String(c.contactId ?? "").trim();
        if (!id || !contactId) return null;
        const email = String(c.email ?? "").trim() || null;
        const phone = String(c.phone ?? "").trim() || null;
        const name =
          String(c.fullName ?? "").trim() ||
          String(c.contactName ?? "").trim() ||
          email ||
          phone ||
          "Unknown contact";
        const direction = String(c.lastMessageDirection ?? "").toLowerCase();
        return {
          conversation_id: id,
          contact_id: contactId,
          name,
          email,
          phone,
          last_message_body: String(c.lastMessageBody ?? ""),
          last_message_at: toIso(c.lastMessageDate),
          last_message_channel: channelFromType(c.lastMessageType),
          last_message_direction:
            direction === "inbound" || direction === "outbound" ? direction : "unknown",
          unread_count: Number(c.unreadCount ?? 0) || 0,
        };
      })
      .filter((c): c is InboxConversation => c !== null);
    return { ok: true, conversations };
  } catch (err) {
    return {
      ok: false,
      conversations: [],
      error: err instanceof Error ? err.message : "Network error loading the inbox.",
    };
  }
}

/** Full message thread for one conversation, oldest first. */
export async function getConversationMessages(conversationId: string): Promise<{
  ok: boolean;
  messages: ConversationMessage[];
  scopeError?: boolean;
  error?: string;
}> {
  const headers = authHeaders();
  if (!headers) {
    return { ok: false, messages: [], error: "GHL_PIT_TOKEN not set." };
  }
  const clean = conversationId.trim();
  if (!/^[A-Za-z0-9]{10,40}$/.test(clean)) {
    return { ok: false, messages: [], error: "Invalid conversation id." };
  }

  try {
    const res = await fetch(
      `${API}/conversations/${encodeURIComponent(clean)}/messages?limit=100`,
      { headers }
    );
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        messages: [],
        scopeError: true,
        error:
          "GHL thread scope not enabled. Add `conversations/message.readonly` (View Conversation Messages) to the Private Integration token. (The reply box below still works — sending uses a different scope.)",
      };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        messages: [],
        error: `GHL thread fetch failed (${res.status}): ${text || res.statusText}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as {
      messages?: { messages?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
    };
    const raw = Array.isArray(data.messages)
      ? data.messages
      : (data.messages?.messages ?? []);
    const messages = raw
      .map((m): ConversationMessage | null => {
        const id = String(m.id ?? "").trim();
        if (!id) return null;
        const direction = String(m.direction ?? "").toLowerCase();
        return {
          id,
          direction: direction === "inbound" ? "inbound" : "outbound",
          channel: channelFromType(m.messageType),
          body: String(m.body ?? ""),
          date_added: toIso(m.dateAdded),
          status: String(m.status ?? "") || null,
        };
      })
      .filter((m): m is ConversationMessage => m !== null)
      // GHL returns newest first; the thread view wants oldest first.
      .sort((a, b) => (a.date_added ?? "").localeCompare(b.date_added ?? ""));
    return { ok: true, messages };
  } catch (err) {
    return {
      ok: false,
      messages: [],
      error: err instanceof Error ? err.message : "Network error loading the thread.",
    };
  }
}

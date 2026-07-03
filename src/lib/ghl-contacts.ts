/**
 * Server-only GHL contact helpers — the slice of PMMA's lib/ghl-admin.ts the
 * Comms Hub needs: consent reads, plus create/delete for the hub's lead
 * management (requires the `contacts.write` scope on the PIT token).
 *
 * Required env (server-only — DO NOT expose to the browser):
 *   GHL_PIT_TOKEN     Private Integration token starting with `pit-`
 *   GHL_LOCATION_ID   Your GHL Location ID
 */

const API = "https://services.leadconnectorhq.com";

function authHeaders(): Record<string, string> | null {
  const token = process.env.GHL_PIT_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    Accept: "application/json",
  };
}

function locationId(): string | null {
  return process.env.GHL_LOCATION_ID || null;
}

/** Cached key→id map for custom fields, refreshed on cold start. */
let _fieldCache: { keyToId: Record<string, string>; loadedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getFieldKeyToIdMap(): Promise<Record<string, string>> {
  if (_fieldCache && Date.now() - _fieldCache.loadedAt < CACHE_TTL_MS) {
    return _fieldCache.keyToId;
  }
  const headers = authHeaders();
  const loc = locationId();
  if (!headers || !loc) return {};

  const res = await fetch(`${API}/locations/${loc}/customFields`, { headers });
  if (!res.ok) {
    console.warn("[ghl-contacts] listCustomFields failed:", res.status);
    return {};
  }
  const data = (await res.json()) as {
    customFields?: Array<{ id?: string; fieldKey?: string }>;
  };
  const keyToId: Record<string, string> = {};
  for (const f of data.customFields || []) {
    if (!f.id || !f.fieldKey) continue;
    const key = f.fieldKey.replace(/^contact\./, "");
    keyToId[key] = f.id;
  }
  _fieldCache = { keyToId, loadedAt: Date.now() };
  return keyToId;
}

/**
 * Read a contact's marketing-SMS consent flag from GHL.
 *
 * Returns true/false when the `sms_consent_marketing` custom field is present
 * and parseable, or null when we can't determine it (missing env, API error,
 * field not set on the contact). Callers enforcing a marketing-consent gate
 * should treat null as "do NOT send" (fail safe).
 */
export async function getContactSmsConsent(
  contactId: string
): Promise<{ marketing: boolean | null }> {
  const headers = authHeaders();
  if (!headers || !contactId) return { marketing: null };

  const res = await fetch(`${API}/contacts/${contactId}`, { headers });
  if (!res.ok) {
    console.warn("[ghl-contacts] getContactSmsConsent fetch failed:", res.status);
    return { marketing: null };
  }
  const data = (await res.json().catch(() => ({}))) as {
    contact?: { customFields?: Array<{ id?: string; value?: unknown }> };
  };
  const fields = data.contact?.customFields ?? [];
  if (fields.length === 0) return { marketing: null };

  const keyToId = await getFieldKeyToIdMap();
  const consentId = keyToId["sms_consent_marketing"];
  if (!consentId) return { marketing: null };

  const field = fields.find((f) => f.id === consentId);
  if (!field || field.value === undefined || field.value === null || field.value === "") {
    return { marketing: null };
  }
  const v = String(field.value).toLowerCase();
  const truthy = v === "true" || v === "yes" || v === "1" || v === "on";
  return { marketing: truthy };
}

//------------------------------------------------------------------------------
// Create / delete — the hub's lead management. Both need `contacts.write`.
// Best-effort: never throw; surface scopeError on 401/403 so the UI can
// explain the missing scope instead of a generic failure.
//------------------------------------------------------------------------------

export interface ContactWriteResult {
  ok: boolean;
  contactId?: string;
  scopeError?: boolean;
  /** True when GHL reports the contact already exists (duplicate email/phone). */
  duplicate?: boolean;
  error?: string;
}

/** Create a contact in the location. Tags are auto-created by GHL. */
export async function createContact(args: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
}): Promise<ContactWriteResult> {
  const headers = authHeaders();
  const loc = locationId();
  if (!headers || !loc) {
    return { ok: false, error: "GHL_PIT_TOKEN or GHL_LOCATION_ID not set." };
  }

  try {
    const res = await fetch(`${API}/contacts/`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId: loc,
        firstName: args.firstName,
        ...(args.lastName ? { lastName: args.lastName } : {}),
        ...(args.email ? { email: args.email } : {}),
        ...(args.phone ? { phone: args.phone } : {}),
        ...(args.tags && args.tags.length > 0 ? { tags: args.tags } : {}),
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        scopeError: true,
        error:
          "GHL contact-write scope not enabled. Add `Edit Contacts - contacts.write` to the BL Coms Hub Private Integration (save without regenerating).",
      };
    }
    const data = (await res.json().catch(() => ({}))) as {
      contact?: { id?: string };
      message?: string;
      meta?: { contactId?: string };
    };
    if (res.ok) {
      return { ok: true, contactId: data.contact?.id };
    }
    // GHL returns 400 with a duplicate message + the existing contact id when
    // the email/phone already exists.
    const msg = String(data.message ?? "");
    if (/duplicat/i.test(msg)) {
      return {
        ok: false,
        duplicate: true,
        contactId: data.meta?.contactId,
        error: msg || "A contact with this email or phone already exists.",
      };
    }
    return { ok: false, error: `GHL create failed (${res.status}): ${msg || res.statusText}` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error creating contact.",
    };
  }
}

/** Permanently delete a contact from the location. */
export async function deleteContact(contactId: string): Promise<ContactWriteResult> {
  const headers = authHeaders();
  if (!headers) {
    return { ok: false, error: "GHL_PIT_TOKEN not set." };
  }
  const clean = contactId.trim();
  if (!/^[A-Za-z0-9]{10,40}$/.test(clean)) {
    return { ok: false, error: "Invalid contact id." };
  }

  try {
    const res = await fetch(`${API}/contacts/${encodeURIComponent(clean)}`, {
      method: "DELETE",
      headers,
    });
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        scopeError: true,
        error:
          "GHL contact-write scope not enabled. Add `Edit Contacts - contacts.write` to the BL Coms Hub Private Integration (save without regenerating).",
      };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `GHL delete failed (${res.status}): ${text || res.statusText}` };
    }
    return { ok: true, contactId: clean };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error deleting contact.",
    };
  }
}

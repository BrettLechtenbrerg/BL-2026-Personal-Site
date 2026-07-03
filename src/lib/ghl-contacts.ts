/**
 * Server-only GHL contact helpers — the slice of PMMA's lib/ghl-admin.ts the
 * Comms Hub needs: reading a contact's marketing-SMS consent flag so the
 * marketing gate can fail safe.
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

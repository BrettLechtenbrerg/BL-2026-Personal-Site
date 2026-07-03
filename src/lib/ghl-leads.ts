/**
 * Server-only GHL leads reader — the ENTIRE audience for this site's Comms
 * Hub. brettlechtenberg.com has no roster; every contact in Brett's personal
 * GHL location (speaking inquiries, workbook leads, Master's Edge
 * applications, book-brett requests) is a "lead" here.
 *
 * Ported verbatim from PMMA's lib/ghl-leads.ts (proven live July 2026).
 *
 * Endpoint:
 *   POST https://services.leadconnectorhq.com/contacts/search
 *   Version: 2021-07-28
 *   Body:     { locationId, pageLimit, filters: [], searchAfter? }
 *   Response: { contacts: [...], total, traceId }   — NO meta object.
 *   ⚠️ Pagination: each contact carries its own `searchAfter` cursor array;
 *   pass the LAST contact's searchAfter as the next request's searchAfter.
 *   This is correct — do NOT "fix" it to read a meta cursor (that bug cost
 *   the PMMA build a debugging session).
 *
 * We deliberately do NOT use GHL's tag filter operators (their advanced-filter
 * syntax is poorly documented and easy to get silently wrong). Instead we page
 * through recent contacts with an empty filter and group by tag server-side.
 *
 * Required env: GHL_PIT_TOKEN + GHL_LOCATION_ID. Scope: contacts.readonly.
 */

const API = "https://services.leadconnectorhq.com";
const CONTACTS_VERSION = "2021-07-28";

const PAGE_LIMIT = 100;
/** Hard cap on how many contacts one refresh pulls (10 pages). */
const MAX_CONTACTS = 1000;
/** Keep the picker snappy without hammering GHL on every page load. */
const CACHE_TTL_MS = 60 * 1000;

export interface GhlLead {
  contact_id: string;
  first_name: string;
  last_name: string;
  /** Display name — first + last, falling back to email/phone. */
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  /** ISO timestamp when the contact was added to GHL (may be null). */
  date_added: string | null;
}

export interface GhlLeadsResult {
  ok: boolean;
  leads: GhlLead[];
  /** Distinct tags across the returned leads, with counts, most common first. */
  tags: Array<{ tag: string; count: number }>;
  /** True when the pull stopped at MAX_CONTACTS (older contacts not shown). */
  truncated: boolean;
  error?: string;
}

interface RawContact {
  id?: string;
  firstName?: string;
  lastName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  tags?: unknown;
  dateAdded?: string;
  /** Pagination cursor — pass the last contact's value as the next request's searchAfter. */
  searchAfter?: unknown[];
}

function authHeaders(): Record<string, string> | null {
  const token = process.env.GHL_PIT_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Version: CONTACTS_VERSION,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function toLead(raw: RawContact): GhlLead | null {
  const id = (raw.id ?? "").trim();
  if (!id) return null;
  const first = (raw.firstName ?? "").trim();
  const last = (raw.lastName ?? "").trim();
  const email = (raw.email ?? "").trim() || null;
  const phone = (raw.phone ?? "").trim() || null;
  const name =
    [first, last].filter(Boolean).join(" ") ||
    (raw.contactName ?? "").trim() ||
    email ||
    phone ||
    "Unnamed contact";
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === "string" && t.trim() !== "")
    : [];
  return {
    contact_id: id,
    first_name: first,
    last_name: last,
    name,
    email,
    phone,
    tags,
    date_added: raw.dateAdded ?? null,
  };
}

/** Page through GHL contacts (newest-first-ish; GHL's default order). */
async function fetchAllContacts(): Promise<{
  contacts: GhlLead[];
  truncated: boolean;
  error?: string;
}> {
  const headers = authHeaders();
  const locationId = process.env.GHL_LOCATION_ID || null;
  if (!headers || !locationId) {
    return {
      contacts: [],
      truncated: false,
      error: "GHL_PIT_TOKEN or GHL_LOCATION_ID not set — cannot load leads.",
    };
  }

  const out: GhlLead[] = [];
  let searchAfter: unknown[] | undefined;

  for (let page = 0; page < MAX_CONTACTS / PAGE_LIMIT; page++) {
    const res = await fetch(`${API}/contacts/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        pageLimit: PAGE_LIMIT,
        filters: [],
        ...(searchAfter ? { searchAfter } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        contacts: out,
        truncated: false,
        error: `GHL contact search failed (${res.status}): ${text || res.statusText}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as {
      contacts?: RawContact[];
      total?: number;
    };
    const raw = data.contacts ?? [];
    const batch = raw.map(toLead).filter((l): l is GhlLead => l !== null);
    out.push(...batch);

    // Last page: short batch, or no cursor on the last contact to continue from.
    if (raw.length < PAGE_LIMIT) return { contacts: out, truncated: false };
    const cursor = raw[raw.length - 1]?.searchAfter;
    if (!Array.isArray(cursor) || cursor.length === 0) {
      return { contacts: out, truncated: false };
    }
    searchAfter = cursor;
  }

  return { contacts: out, truncated: true };
}

// Module-level cache — per serverless instance, refreshed after CACHE_TTL_MS.
let cache: { result: GhlLeadsResult; loadedAt: number } | null = null;

/** Drop the cached pull so the next fetch hits GHL — call after create/delete. */
export function clearLeadsCache(): void {
  cache = null;
}

/**
 * Fetch all GHL contacts, grouped with their tags. No roster exclusion on
 * this site — the location's contacts ARE the audience. Best-effort: never
 * throws.
 */
export async function fetchGhlLeads(): Promise<GhlLeadsResult> {
  let leads: GhlLead[];
  let truncated: boolean;

  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    leads = cache.result.leads;
    truncated = cache.result.truncated;
  } else {
    const pulled = await fetchAllContacts();
    if (pulled.error) {
      return { ok: false, leads: [], tags: [], truncated: false, error: pulled.error };
    }
    leads = pulled.contacts;
    truncated = pulled.truncated;
    cache = {
      result: { ok: true, leads, tags: [], truncated },
      loadedAt: Date.now(),
    };
  }

  const tagCounts = new Map<string, number>();
  for (const lead of leads) {
    for (const tag of lead.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const tags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return { ok: true, leads, tags, truncated };
}

//==============================================================================
// CRM — Twenty client (People only, for now)
//==============================================================================
// Server-only. Talks to the Twenty Cloud REST API for this workspace:
//   https://brettlechtenberg.twenty.com/rest
// Auth: Bearer TWENTY_API_KEY (Vercel env, sensitive).
//
// Shapes are mapped to the hub's existing `HubLead` / `ContactWriteResult`
// types so the /hub routes and page keep their contracts (they used to come
// from src/lib/ghl-*.ts). Best-effort: never throws — returns { ok:false }.
//
// Field shapes verified against twentyhq/twenty main (Sept 2026):
//   name:   { firstName, lastName }
//   emails: { primaryEmail, additionalEmails }
//   phones: { primaryPhoneNumber, primaryPhoneCallingCode, primaryPhoneCountryCode }
// List envelope: { data: { people: [...] }, pageInfo: { endCursor, hasNextPage }, totalCount }
// Filter syntax: ?filter=emails.primaryEmail[eq]:"x"   Duplicate create ⇒ 400 "A duplicate entry was detected".
//==============================================================================

const BASE = process.env.TWENTY_API_URL ?? "https://brettlechtenberg.twenty.com/rest";
const PAGE_LIMIT = 60;
const MAX_PAGES = 20; // 1,200 people — plenty for this site; truncated flag past that.

export interface HubLead {
  contact_id: string;
  first_name: string;
  last_name: string;
  /** Display name — first + last, falling back to email/phone. */
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  /** ISO timestamp when the person was created. */
  date_added: string | null;
}

export interface HubLeadsResult {
  ok: boolean;
  leads: HubLead[];
  tags: Array<{ tag: string; count: number }>;
  truncated: boolean;
  error?: string;
}

export interface ContactWriteResult {
  ok: boolean;
  contactId?: string;
  /** True when Twenty reports a duplicate email/phone. */
  duplicate?: boolean;
  error?: string;
}

interface TwentyPerson {
  id: string;
  createdAt?: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  emails?: { primaryEmail?: string | null } | null;
  phones?: {
    primaryPhoneNumber?: string | null;
    primaryPhoneCallingCode?: string | null;
  } | null;
  jobTitle?: string | null;
}

function headers(): Record<string, string> | null {
  const key = process.env.TWENTY_API_KEY;
  if (!key) return null;
  return {
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

/** null ⇒ no API key or network failure (logged). Never throws. */
async function twentyFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const h = headers();
  if (!h) return null;
  const go = () => fetch(`${BASE}${path}`, { ...init, headers: { ...h, ...(init?.headers ?? {}) } });
  try {
    const res = await go();
    // Single retry on rate limit — Twenty Cloud is ~100 req/min per workspace.
    if (res.status !== 429) return res;
    await new Promise((r) => setTimeout(r, 1500));
    return await go();
  } catch (err) {
    console.error("[twenty] fetch failed:", path, err instanceof Error ? err.message : err);
    return null;
  }
}

function toLead(p: TwentyPerson): HubLead | null {
  if (!p.id) return null;
  const first = (p.name?.firstName ?? "").trim();
  const last = (p.name?.lastName ?? "").trim();
  const email = (p.emails?.primaryEmail ?? "").trim() || null;
  const rawPhone = (p.phones?.primaryPhoneNumber ?? "").trim();
  const code = (p.phones?.primaryPhoneCallingCode ?? "").trim();
  const phone = rawPhone ? (rawPhone.startsWith("+") ? rawPhone : `${code}${rawPhone}`) : null;
  const name = [first, last].filter(Boolean).join(" ") || email || phone || "Lead";
  return {
    contact_id: p.id,
    first_name: first,
    last_name: last,
    name,
    email,
    phone,
    // simplification: tags are not modelled in Twenty People yet; the hub's
    // tag filter shows empty until a "tags" multi-select field is added.
    tags: [],
    date_added: p.createdAt ?? null,
  };
}

const q = (s: string) => `"${s.replace(/["\\]/g, "")}"`;

//------------------------------------------------------------------------------
// Read
//------------------------------------------------------------------------------

let cache: { result: HubLeadsResult; loadedAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

/** Drop the cached pull so the next fetch hits Twenty — call after create/delete. */
export function clearLeadsCache(): void {
  cache = null;
}

/** Every person in the workspace, newest first. */
export async function fetchLeads(): Promise<HubLeadsResult> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.result;

  const leads: HubLead[] = [];
  let cursor: string | null = null;
  let truncated = false;

  for (let page = 0; page < MAX_PAGES; page++) {
    const qs = new URLSearchParams({
      limit: String(PAGE_LIMIT),
      order_by: "createdAt[DescNullsLast]",
      depth: "0",
    });
    if (cursor) qs.set("starting_after", cursor);

    const res = await twentyFetch(`/people?${qs}`);
    if (!res) {
      return { ok: false, leads: [], tags: [], truncated: false, error: "CRM unreachable or TWENTY_API_KEY not set." };
    }
    if (!res.ok) {
      return {
        ok: false,
        leads: [],
        tags: [],
        truncated: false,
        error: `Twenty people fetch failed (${res.status}).`,
      };
    }
    const body = (await res.json().catch(() => ({}))) as {
      data?: { people?: TwentyPerson[] };
      pageInfo?: { endCursor?: string | null; hasNextPage?: boolean };
    };
    for (const p of body.data?.people ?? []) {
      const lead = toLead(p);
      if (lead) leads.push(lead);
    }
    if (!body.pageInfo?.hasNextPage || !body.pageInfo.endCursor) break;
    cursor = body.pageInfo.endCursor;
    if (page === MAX_PAGES - 1) truncated = true;
  }

  const result: HubLeadsResult = { ok: true, leads, tags: [], truncated };
  cache = { result, loadedAt: Date.now() };
  return result;
}

/** First person matching an email or phone — used for dedupe before create. */
export async function findLead(args: { email?: string; phone?: string }): Promise<HubLead | null> {
  const clauses: string[] = [];
  if (args.email) clauses.push(`emails.primaryEmail[eq]:${q(args.email.toLowerCase())}`);
  if (args.phone) clauses.push(`phones.primaryPhoneNumber[eq]:${q(args.phone)}`);
  if (clauses.length === 0) return null;
  const filter = clauses.length === 1 ? clauses[0] : `or(${clauses.join(",")})`;
  const res = await twentyFetch(`/people?limit=1&depth=0&filter=${encodeURIComponent(filter)}`);
  if (!res?.ok) return null;
  const body = (await res.json().catch(() => ({}))) as { data?: { people?: TwentyPerson[] } };
  const first = body.data?.people?.[0];
  return first ? toLead(first) : null;
}

//------------------------------------------------------------------------------
// Write
//------------------------------------------------------------------------------

export async function createLead(args: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<ContactWriteResult> {
  const existing = await findLead({ email: args.email, phone: args.phone });
  if (existing) {
    return {
      ok: false,
      duplicate: true,
      contactId: existing.contact_id,
      error: "A contact with this email or phone already exists.",
    };
  }

  const body: Record<string, unknown> = {
    name: { firstName: args.firstName, lastName: args.lastName ?? "" },
  };
  if (args.email) body.emails = { primaryEmail: args.email.toLowerCase(), additionalEmails: [] };
  if (args.phone) {
    // Store E.164 as given; Twenty splits calling code itself when it can.
    body.phones = { primaryPhoneNumber: args.phone, additionalPhones: [] };
  }

  const res = await twentyFetch("/people", { method: "POST", body: JSON.stringify(body) });
  if (!res) return { ok: false, error: "CRM unreachable or TWENTY_API_KEY not set." };
  const data = (await res.json().catch(() => ({}))) as {
    data?: { createPerson?: { id?: string } };
    messages?: string[];
    error?: string;
  };
  if (res.ok) {
    clearLeadsCache();
    return { ok: true, contactId: data.data?.createPerson?.id };
  }
  const msg = data.messages?.join(" ") ?? data.error ?? res.statusText;
  if (/duplicate/i.test(msg)) {
    return { ok: false, duplicate: true, error: "A contact with this email or phone already exists." };
  }
  return { ok: false, error: `Twenty create failed (${res.status}): ${msg}` };
}

export async function deleteLead(contactId: string): Promise<ContactWriteResult> {
  if (!/^[0-9a-f-]{36}$/i.test(contactId)) return { ok: false, error: "Invalid contact id." };
  const res = await twentyFetch(`/people/${contactId}`, { method: "DELETE" });
  if (!res) return { ok: false, error: "CRM unreachable or TWENTY_API_KEY not set." };
  if (res.ok) {
    clearLeadsCache();
    return { ok: true, contactId };
  }
  return { ok: false, error: `Twenty delete failed (${res.status}).` };
}

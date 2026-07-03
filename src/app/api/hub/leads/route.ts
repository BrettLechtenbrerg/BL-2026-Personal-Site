//==============================================================================
// COMMS HUB — Create a lead (GHL contact)
//==============================================================================
// POST /api/hub/leads
//   Body: { first_name, last_name?, email?, phone?, tags?: string[] }
//   → { contact_id } on success.
//   Requires the `contacts.write` scope on the PIT token; without it GHL
//   returns 401/403 and this surfaces { scope_error: true }.
//
// At least one of email/phone is required (a contact with neither is
// unreachable on both hub channels). Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { createContact } from "@/lib/ghl-contacts";
import { clearLeadsCache } from "@/lib/ghl-leads";

export async function POST(request: Request) {
  const denied = await requireHubSession();
  if (denied) return denied;

  let payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    tags?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = (payload.first_name ?? "").trim();
  const lastName = (payload.last_name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const phone = (payload.phone ?? "").trim();
  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((t): t is string => typeof t === "string" && t.trim() !== "").map((t) => t.trim())
    : [];

  if (!firstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: "At least one of email or phone is required." },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email doesn't look valid." }, { status: 400 });
  }

  const result = await createContact({
    firstName,
    lastName: lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    tags,
  });

  if (!result.ok) {
    if (result.duplicate) {
      return NextResponse.json(
        {
          error: result.error ?? "A contact with this email or phone already exists.",
          duplicate: true,
          contact_id: result.contactId ?? null,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: result.error ?? "Failed to create the contact.", scope_error: result.scopeError ?? false },
      { status: 502 }
    );
  }

  clearLeadsCache();
  return NextResponse.json({ contact_id: result.contactId ?? null });
}

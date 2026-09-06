//==============================================================================
// COMMS HUB — Create a lead (Twenty person)
//==============================================================================
// POST /api/hub/leads
//   Body: { first_name, last_name?, email?, phone?, tags?: string[] }
//   → { contact_id } on success; 409 + { duplicate: true } if email/phone
//     already exists in Twenty. `tags` accepted but not stored yet (see
//     src/lib/crm/twenty.ts).
//
// At least one of email/phone is required (a contact with neither is
// unreachable on both hub channels). Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { createLead } from "@/lib/crm/twenty";

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

  const result = await createLead({
    firstName,
    lastName: lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
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
      { error: result.error ?? "Failed to create the contact." },
      { status: 502 }
    );
  }

  return NextResponse.json({ contact_id: result.contactId ?? null });
}

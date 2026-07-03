//==============================================================================
// COMMS HUB — Delete a lead (GHL contact)
//==============================================================================
// DELETE /api/hub/leads/[contactId]
//   → { deleted: true } on success.
//   ⚠️ PERMANENTLY deletes the contact from GHL (the UI double-confirms with
//   the lead's name before calling this). Requires `contacts.write`.
//
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { deleteContact } from "@/lib/ghl-contacts";
import { clearLeadsCache } from "@/lib/ghl-leads";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  const { contactId } = await params;
  const result = await deleteContact(contactId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Failed to delete the contact.", scope_error: result.scopeError ?? false },
      { status: 502 }
    );
  }

  clearLeadsCache();
  return NextResponse.json({ deleted: true });
}

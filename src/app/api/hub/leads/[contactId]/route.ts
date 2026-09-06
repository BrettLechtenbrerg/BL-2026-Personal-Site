//==============================================================================
// COMMS HUB — Delete a lead (Twenty person)
//==============================================================================
// DELETE /api/hub/leads/[contactId]
//   → { deleted: true } on success.
//   ⚠️ Deletes the person from Twenty (soft-delete there; restorable from
//   Twenty's trash). The UI double-confirms with the lead's name first.
//
// Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { deleteLead } from "@/lib/crm/twenty";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const denied = await requireHubSession();
  if (denied) return denied;

  const { contactId } = await params;
  const result = await deleteLead(contactId);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Failed to delete the contact." },
      { status: 502 }
    );
  }
  return NextResponse.json({ deleted: true });
}

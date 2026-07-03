//==============================================================================
// COMMS HUB — Messaging leads picker (all GHL contacts)
//==============================================================================
// GET /api/hub/messaging/leads
//   → the audience for the Comms Hub: every contact in Brett's personal GHL
//     location (speaking inquiries, workbook leads, Master's Edge
//     applications), newest first. No roster exclusion — this site has no
//     roster; the contacts ARE the audience.
//
//   Response: {
//     leads: GhlLead[],                       // newest first
//     tags:  [{ tag, count }],                // for the tag filter dropdown
//     truncated: boolean                      // pull stopped at the cap
//   }
//
// Read-only. Sends nothing. Access: hub session only.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { fetchGhlLeads } from "@/lib/ghl-leads";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireHubSession();
  if (denied) return denied;

  try {
    const result = await fetchGhlLeads();
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Failed to load leads from GHL." },
        { status: 502 }
      );
    }

    // Newest first so fresh inquiries surface at the top.
    const leads = [...result.leads].sort((a, b) => {
      const ta = a.date_added ? Date.parse(a.date_added) : 0;
      const tb = b.date_added ? Date.parse(b.date_added) : 0;
      return tb - ta;
    });

    return NextResponse.json({
      leads,
      tags: result.tags,
      truncated: result.truncated,
    });
  } catch (err) {
    console.error("GET /api/hub/messaging/leads failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

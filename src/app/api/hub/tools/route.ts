//==============================================================================
// POWER HUB — My tools status (hub-session-gated; Brett only)
//==============================================================================
// GET → { checkedAt, status: { [url]: { up, code, ms } } } for the fixed
// dashboard list in src/lib/my-tools.ts. Checked live from the server each time.
//==============================================================================

import { NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { checkAll } from "@/lib/my-tools";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireHubSession();
  if (denied) return denied;

  const status = await checkAll();
  return NextResponse.json(
    { checkedAt: new Date().toISOString(), status },
    { headers: { "Cache-Control": "no-store" } }
  );
}

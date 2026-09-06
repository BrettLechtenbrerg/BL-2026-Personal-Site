//==============================================================================
// CRON — Supabase keep-alive + auto-restore
//==============================================================================
// Vercel Cron (daily, vercel.json) + GitHub Actions (2×/day,
// .github/workflows/supabase-keepalive.yml) hit this and run a trivial
// query so the free-tier Supabase project never pauses from inactivity.
//
// If the ping fails AND SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF are set,
// it asks the Supabase Management API to restore (un-pause) the project, so a
// pause self-heals within ~12h instead of waiting for a human.
//
// Auth: when CRON_SECRET is set in Vercel, requests must carry
// `Authorization: Bearer <CRON_SECRET>` (Vercel Cron sends this automatically).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

async function ping(): Promise<number> {
  const { count, error } = await getServiceSupabase()
    .from("me_users")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Project status after a restore attempt, or null when not configured. */
async function restoreIfPaused(): Promise<string | null> {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!token || !ref) return null;
  const headers = { Authorization: `Bearer ${token}` };
  const base = `https://api.supabase.com/v1/projects/${encodeURIComponent(ref)}`;

  const status = await fetch(base, { headers })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j?.status as string | undefined) ?? "UNKNOWN");
  if (status !== "INACTIVE") return status;

  const res = await fetch(`${base}/restore`, { method: "POST", headers });
  return res.ok ? "RESTORING" : `RESTORE_FAILED_${res.status}`;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const members = await ping();
    console.log(`[keepalive] Supabase ping OK (${members} members)`);
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive] Supabase ping FAILED:", err);
    const status = await restoreIfPaused().catch((e) => `RESTORE_ERROR_${String(e)}`);
    console.log(`[keepalive] restore attempt → ${status ?? "not configured"}`);
    return NextResponse.json({ ok: false, restore: status }, { status: 500 });
  }
}

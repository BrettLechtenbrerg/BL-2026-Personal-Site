//==============================================================================
// CRON — Supabase keep-alive + auto-restore (Academy engine)
//==============================================================================
// Free-tier Supabase pauses a project after ~7 days without activity. Two
// schedulers hit this route so that never happens:
//   • Vercel Cron  — daily (vercel.json; Hobby plans allow once/day)
//   • GitHub Actions — 2×/day (.github/workflows/supabase-keepalive.yml)
// Each hit runs a trivial `me_users` count. If the ping fails AND the site has
// SUPABASE_ACCESS_TOKEN set, it asks the Management API to restore (un-pause)
// the project so a pause self-heals within ~12h instead of waiting for a human.
//
// Auth: when CRON_SECRET is set, requests must carry
// `Authorization: Bearer <CRON_SECRET>` (Vercel Cron sends it automatically;
// the GitHub workflow reads it from the repo secret of the same name).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAcademySupabase } from "@/lib/academy-supabase";
import { academyConfig } from "@/content/academy.config";

export const dynamic = "force-dynamic";

async function ping(): Promise<number> {
  const { count, error } = await getAcademySupabase()
    .from("me_users")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Project status after a restore attempt, or null when not configured. */
async function restoreIfPaused(): Promise<string | null> {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF || academyConfig.supabase.project;
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

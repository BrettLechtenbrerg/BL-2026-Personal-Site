//==============================================================================
// CRON — Supabase keep-alive
//==============================================================================
// Vercel Cron hits this twice a week (see vercel.json) and runs a trivial
// query so the free-tier Supabase project never pauses from inactivity.
//
// Auth: when CRON_SECRET is set in Vercel, requests must carry
// `Authorization: Bearer <CRON_SECRET>` (Vercel Cron sends this automatically).
// Without the secret configured it still runs — the endpoint only performs a
// harmless count and leaks nothing.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { count, error } = await getServiceSupabase()
      .from("me_users")
      .select("id", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    console.log(`[keepalive] Supabase ping OK (${count ?? 0} members)`);
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive] Supabase ping FAILED:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

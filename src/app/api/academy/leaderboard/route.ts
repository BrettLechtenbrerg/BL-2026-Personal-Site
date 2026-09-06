//==============================================================================
// ACADEMY — Leaderboard API (public fields only).
// Returns every member with all-time XP plus XP earned in the last 7 and 30
// days (summed from the me_xp_events ledger). Ranking happens client-side.
//==============================================================================

import { NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db } from "@/lib/academy-db";

const DAY = 24 * 60 * 60 * 1000;

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  const since30 = new Date(Date.now() - 30 * DAY).toISOString();
  const since7 = Date.now() - 7 * DAY;
  const [{ data: users }, { data: certified }, { data: recent }] = await Promise.all([
    supabase.from("me_users").select("id, name, avatar, xp").order("xp", { ascending: false }).limit(500),
    supabase.from("me_awards").select("user_id").eq("badge_slug", "certified-masters-edge"),
    // simplification: 30-day ledger read into memory; fine until ~100k events.
    supabase.from("me_xp_events").select("user_id, points, created_at").gte("created_at", since30),
  ]);

  const xp7: Record<string, number> = {};
  const xp30: Record<string, number> = {};
  for (const e of recent ?? []) {
    const uid = e.user_id as string;
    xp30[uid] = (xp30[uid] ?? 0) + e.points;
    if (new Date(e.created_at).getTime() >= since7) xp7[uid] = (xp7[uid] ?? 0) + e.points;
  }

  const certifiedIds = new Set((certified ?? []).map((r) => r.user_id as string));
  return NextResponse.json({
    members: (users ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      xp7: xp7[u.id as string] ?? 0,
      xp30: xp30[u.id as string] ?? 0,
      certified: certifiedIds.has(u.id as string),
    })),
    me: auth,
  });
}

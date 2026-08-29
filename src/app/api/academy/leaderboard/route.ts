//==============================================================================
// ACADEMY — Leaderboard API (top members by XP; public fields only)
//==============================================================================

import { NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db } from "@/lib/academy-db";

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  const [{ data: users }, { data: certified }] = await Promise.all([
    supabase
      .from("me_users")
      .select("id, name, avatar, xp")
      .order("xp", { ascending: false })
      .limit(50),
    supabase.from("me_awards").select("user_id").eq("badge_slug", "certified-masters-edge"),
  ]);

  const certifiedIds = new Set((certified ?? []).map((r) => r.user_id as string));
  return NextResponse.json({
    members: (users ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      certified: certifiedIds.has(u.id as string),
    })),
    me: auth,
  });
}

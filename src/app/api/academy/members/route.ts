//==============================================================================
// ACADEMY — Members directory API (members only; public fields only — no
// email, no role beyond an admin flag).
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
      .select("id, name, avatar, xp, role, bio, last_seen_at, created_at")
      .order("last_seen_at", { ascending: false, nullsFirst: false })
      .limit(500),
    supabase.from("me_awards").select("user_id").eq("badge_slug", "certified-masters-edge"),
  ]);

  const certifiedIds = new Set((certified ?? []).map((r) => r.user_id as string));
  return NextResponse.json({
    me: auth,
    members: (users ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      admin: u.role === "admin",
      bio: u.bio,
      lastSeenAt: u.last_seen_at,
      joinedAt: u.created_at,
      certified: certifiedIds.has(u.id as string),
    })),
  });
}

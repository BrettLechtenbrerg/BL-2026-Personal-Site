//==============================================================================
// ACADEMY — sidebar stats: post count per channel + member/post totals.
// Members only. Cheap enough to call on every academy page load.
//==============================================================================

import { NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db } from "@/lib/academy-db";

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  const [{ data: rows }, { count: members }] = await Promise.all([
    // simplification: counts computed in JS from one column read; fine until
    // thousands of posts — upgrade path is a SQL group-by RPC.
    supabase.from("me_posts").select("channel"),
    supabase.from("me_users").select("id", { count: "exact", head: true }),
  ]);
  const counts: Record<string, number> = {};
  for (const row of rows ?? []) {
    const c = row.channel as string;
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return NextResponse.json({ counts, members: members ?? 0, posts: (rows ?? []).length });
}

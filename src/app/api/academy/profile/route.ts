//==============================================================================
// ACADEMY — Profile API. POST { name?, avatar?, bio? } updates the member's own row.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db } from "@/lib/academy-db";

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const updates: { name?: string; avatar?: string; bio?: string | null } = {};

  if (body?.name !== undefined) {
    const name = String(body.name).trim().slice(0, 80);
    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    updates.name = name;
  }
  if (body?.avatar !== undefined) {
    updates.avatar = String(body.avatar).slice(0, 8);
  }
  if (body?.bio !== undefined) {
    updates.bio = String(body.bio).trim().slice(0, 140) || null;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { error } = await db().from("me_users").update(updates).eq("id", auth);
  if (error) {
    console.error("[academy-profile] update failed:", error.message);
    return NextResponse.json({ error: "Could not save profile." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

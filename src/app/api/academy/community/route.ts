//==============================================================================
// ACADEMY — Community API (posts, comments, reactions) — members only
//==============================================================================
// GET  → latest 50 posts with authors, comments, reaction counts.
// POST { action: "post", body }        → new post (+10 XP)
// POST { action: "comment", postId, body } → new comment (+5 XP)
// POST { action: "react", postId, emoji }  → toggle reaction (allowlisted emoji)
// All bodies are length-capped and rendered as plain text client-side.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, awardXp, awardBadge } from "@/lib/academy-db";

const MAX_BODY = 2000;
const REACTION_EMOJI = ["👊", "🔥", "💡", "👏"];
const UUID_RE = /^[0-9a-f-]{36}$/i;

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  const { data: posts } = await supabase
    .from("me_posts")
    .select("id, body, module_slug, created_at, me_users!me_posts_user_id_fkey(id, name, avatar)")
    .order("created_at", { ascending: false })
    .limit(50);

  const postIds = (posts ?? []).map((p) => p.id as string);
  const [{ data: comments }, { data: reactions }] = await Promise.all([
    postIds.length
      ? supabase
          .from("me_comments")
          .select("id, post_id, body, created_at, me_users!me_comments_user_id_fkey(id, name, avatar)")
          .in("post_id", postIds)
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    postIds.length
      ? supabase.from("me_reactions").select("post_id, user_id, emoji").in("post_id", postIds)
      : Promise.resolve({ data: [] }),
  ]);

  return NextResponse.json({
    me: auth,
    posts: posts ?? [],
    comments: comments ?? [],
    reactions: reactions ?? [],
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const payload = await request.json().catch(() => ({}));
  const action = String(payload?.action || "");
  const supabase = db();

  if (action === "post") {
    const body = String(payload?.body || "").trim().slice(0, MAX_BODY);
    if (body.length < 1) {
      return NextResponse.json({ error: "Write something first." }, { status: 400 });
    }
    const { data: post, error } = await supabase
      .from("me_posts")
      .insert({ user_id: auth, body })
      .select("id")
      .single();
    if (error || !post) {
      return NextResponse.json({ error: "Could not post." }, { status: 500 });
    }
    const xpAwarded = await awardXp(auth, "post", post.id as string);

    // Community Contributor badge at 5 posts.
    const { count } = await supabase
      .from("me_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth);
    if ((count ?? 0) >= 5) await awardBadge(auth, "community-contributor");

    return NextResponse.json({ success: true, xpAwarded });
  }

  if (action === "comment") {
    const postId = String(payload?.postId || "");
    const body = String(payload?.body || "").trim().slice(0, MAX_BODY);
    if (!UUID_RE.test(postId) || body.length < 1) {
      return NextResponse.json({ error: "Invalid comment." }, { status: 400 });
    }
    const { data: comment, error } = await supabase
      .from("me_comments")
      .insert({ post_id: postId, user_id: auth, body })
      .select("id")
      .single();
    if (error || !comment) {
      return NextResponse.json({ error: "Could not comment." }, { status: 500 });
    }
    const xpAwarded = await awardXp(auth, "comment", comment.id as string);
    return NextResponse.json({ success: true, xpAwarded });
  }

  if (action === "react") {
    const postId = String(payload?.postId || "");
    const emoji = String(payload?.emoji || "");
    if (!UUID_RE.test(postId) || !REACTION_EMOJI.includes(emoji)) {
      return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
    }
    // Toggle: delete if exists, else insert.
    const { data: existing } = await supabase
      .from("me_reactions")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", auth)
      .eq("emoji", emoji)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("me_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", auth)
        .eq("emoji", emoji);
      return NextResponse.json({ success: true, reacted: false });
    }
    const { error } = await supabase
      .from("me_reactions")
      .insert({ post_id: postId, user_id: auth, emoji });
    if (error) {
      return NextResponse.json({ error: "Could not react." }, { status: 500 });
    }
    return NextResponse.json({ success: true, reacted: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

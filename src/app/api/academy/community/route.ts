//==============================================================================
// ACADEMY — Community API (posts, comments, reactions) — members only
//==============================================================================
// GET  ?channel=<slug> → latest 50 posts in that channel (pinned first; omit
//       channel for all), plus channel post counts, authors, comments, reactions.
// POST { action: "post", body, channel?, title? } → new post (+10 XP);
//       adminOnly channels require me_users.role = 'admin'.
// POST { action: "pin", postId, pinned }  → admin only
// POST { action: "comment", postId, body } → new comment (+5 XP)
// POST { action: "react", postId, emoji }  → toggle reaction (allowlisted emoji)
// All bodies are length-capped and rendered as plain text client-side.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, awardXp, awardBadge, getUserById } from "@/lib/academy-db";
import { channelBySlug, DEFAULT_CHANNEL } from "@/content/academy/channels";

const MAX_BODY = 2000;
const MAX_TITLE = 120;
const REACTION_EMOJI = ["👊", "🔥", "💡", "👏"];
const UUID_RE = /^[0-9a-f-]{36}$/i;

async function isAdmin(userId: string): Promise<boolean> {
  return (await getUserById(userId))?.role === "admin";
}

export async function GET(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const channel = request.nextUrl.searchParams.get("channel") ?? "";
  const supabase = db();
  let query = supabase
    .from("me_posts")
    .select(
      "id, body, title, channel, pinned, module_slug, created_at, me_users!me_posts_user_id_fkey(id, name, avatar)"
    )
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
  if (channelBySlug(channel)) query = query.eq("channel", channel);
  const { data: posts } = await query;

  const postIds = (posts ?? []).map((p) => p.id as string);
  const [{ data: comments }, { data: reactions }, { data: allChannels }, { count: memberCount }] =
    await Promise.all([
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
    // simplification: counts computed in JS from one column read; fine until
    // thousands of posts — upgrade path is a SQL group-by RPC.
    supabase.from("me_posts").select("channel"),
    supabase.from("me_users").select("id", { count: "exact", head: true }),
  ]);
  const counts: Record<string, number> = {};
  for (const row of allChannels ?? []) {
    const c = row.channel as string;
    counts[c] = (counts[c] ?? 0) + 1;
  }

  return NextResponse.json({
    me: auth,
    posts: posts ?? [],
    comments: comments ?? [],
    reactions: reactions ?? [],
    counts,
    stats: { members: memberCount ?? 0, posts: (allChannels ?? []).length },
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
    const title = String(payload?.title || "").trim().slice(0, MAX_TITLE) || null;
    const channel = channelBySlug(String(payload?.channel || DEFAULT_CHANNEL));
    if (body.length < 1 || !channel) {
      return NextResponse.json({ error: "Write something first." }, { status: 400 });
    }
    if (channel.adminOnly && !(await isAdmin(auth))) {
      return NextResponse.json({ error: "Only Brett can post here." }, { status: 403 });
    }
    const { data: post, error } = await supabase
      .from("me_posts")
      .insert({ user_id: auth, body, title, channel: channel.slug })
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

  if (action === "pin") {
    const postId = String(payload?.postId || "");
    if (!UUID_RE.test(postId)) {
      return NextResponse.json({ error: "Invalid post." }, { status: 400 });
    }
    if (!(await isAdmin(auth))) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 });
    }
    const { error } = await supabase
      .from("me_posts")
      .update({ pinned: Boolean(payload?.pinned) })
      .eq("id", postId);
    if (error) return NextResponse.json({ error: "Could not pin." }, { status: 500 });
    return NextResponse.json({ success: true });
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

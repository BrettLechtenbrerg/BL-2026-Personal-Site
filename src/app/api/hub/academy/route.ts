//==============================================================================
// COMMS HUB — Academy admin API (hub-session-gated; Brett only)
//==============================================================================
// GET  → members (with progress + badges) and all submissions, newest first.
// POST { submissionId, status: "approved" | "revise", feedback? } → review a
//        submission; approving both project + exam certifies the member.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireHubSession } from "@/lib/hub-session";
import { db, maybeCertify } from "@/lib/academy-db";
import { orderedModules } from "@/content/academy/modules";

const UUID_RE = /^[0-9a-f-]{36}$/i;

export async function GET() {
  const denied = await requireHubSession();
  if (denied) return denied;

  const supabase = db();
  const [{ data: members }, { data: submissions }, { data: progress }, { data: awards }] =
    await Promise.all([
      supabase
        .from("me_users")
        .select("id, name, email, avatar, xp, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("me_submissions")
        .select("*, me_users(id, name, email, avatar)")
        .order("created_at", { ascending: false }),
      supabase.from("me_progress").select("user_id, module_slug, passed"),
      supabase.from("me_awards").select("user_id, badge_slug"),
    ]);

  return NextResponse.json({
    members: members ?? [],
    submissions: submissions ?? [],
    progress: progress ?? [],
    awards: awards ?? [],
    moduleCount: orderedModules().length,
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireHubSession();
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const submissionId = String(body?.submissionId || "");
  const status = String(body?.status || "");
  const feedback = String(body?.feedback || "").trim().slice(0, 2000);

  if (!UUID_RE.test(submissionId) || !["approved", "revise"].includes(status)) {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }

  const supabase = db();
  const { data: submission, error } = await supabase
    .from("me_submissions")
    .update({ status, feedback: feedback || null })
    .eq("id", submissionId)
    .select("user_id")
    .single();
  if (error || !submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const certified = await maybeCertify(submission.user_id as string);
  return NextResponse.json({ success: true, certified });
}

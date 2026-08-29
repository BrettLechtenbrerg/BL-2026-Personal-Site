//==============================================================================
// Master's Edge Academy — typed Supabase helpers (service role, server only)
//==============================================================================
// All me_ tables are RLS-locked with zero policies — only these server-side
// helpers (via the service-role key) can reach them. Never import from client
// components.
//==============================================================================

import { getServiceSupabase } from "./supabase-admin";

//------------------------------------------------------------------------------
// Row types
//------------------------------------------------------------------------------
export interface MeUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar: string;
  xp: number;
  created_at: string;
}

/** The shape safe to send to the browser (no email/hash of other members). */
export interface PublicMember {
  id: string;
  name: string;
  avatar: string;
  xp: number;
}

export interface MeProgress {
  user_id: string;
  module_slug: string;
  lesson_done: boolean;
  quiz_score: number | null;
  passed: boolean;
  passed_at: string | null;
}

export interface MeSubmission {
  id: string;
  user_id: string;
  kind: "project" | "exam";
  body: string | null;
  link: string | null;
  status: "pending" | "approved" | "revise";
  feedback: string | null;
  created_at: string;
}

export type XpKind =
  | "lesson_complete"
  | "quiz_pass"
  | "perfect_score"
  | "post"
  | "comment"
  | "daily_visit";

/** XP awarded per event kind. */
export const XP_POINTS: Record<XpKind, number> = {
  lesson_complete: 50,
  quiz_pass: 100,
  perfect_score: 25,
  post: 10,
  comment: 5,
  daily_visit: 5,
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

export function db() {
  return getServiceSupabase();
}

export async function getUserById(userId: string): Promise<MeUser | null> {
  const { data } = await db().from("me_users").select("*").eq("id", userId).maybeSingle();
  return (data as MeUser) ?? null;
}

/**
 * Record an XP event in the ledger and bump the cached me_users.xp.
 * Pass `ref` (e.g. module slug or post id) to dedupe: if an event with the
 * same (user, kind, ref) already exists, nothing is awarded (returns 0).
 * simplification: read-then-write, not a DB transaction — worst case a rare
 * double-click double-awards a few XP; upgrade path is a Postgres function.
 */
export async function awardXp(
  userId: string,
  kind: XpKind,
  ref?: string
): Promise<number> {
  const supabase = db();
  if (ref) {
    const { data: existing } = await supabase
      .from("me_xp_events")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", kind)
      .eq("ref", ref)
      .limit(1);
    if (existing && existing.length > 0) return 0;
  }
  const points = XP_POINTS[kind];
  const { error } = await supabase
    .from("me_xp_events")
    .insert({ user_id: userId, kind, points, ref: ref ?? null });
  if (error) return 0;

  const user = await getUserById(userId);
  if (user) {
    await supabase.from("me_users").update({ xp: user.xp + points }).eq("id", userId);
  }
  return points;
}

/** Idempotent badge award (PK on user_id + badge_slug). Returns true if new. */
export async function awardBadge(userId: string, badgeSlug: string): Promise<boolean> {
  const { error } = await db()
    .from("me_awards")
    .insert({ user_id: userId, badge_slug: badgeSlug });
  return !error; // duplicate PK → error → already had it
}

export async function getProgress(userId: string): Promise<MeProgress[]> {
  const { data } = await db().from("me_progress").select("*").eq("user_id", userId);
  return (data as MeProgress[]) ?? [];
}

export async function getBadges(userId: string): Promise<string[]> {
  const { data } = await db()
    .from("me_awards")
    .select("badge_slug")
    .eq("user_id", userId);
  return (data ?? []).map((r) => r.badge_slug as string);
}

export async function latestSubmission(
  userId: string,
  kind: "project" | "exam"
): Promise<MeSubmission | null> {
  const { data } = await db()
    .from("me_submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as MeSubmission) ?? null;
}

/**
 * Award the Black Belt badge when both the latest project and latest exam
 * submissions are approved. Idempotent. Returns whether the member is certified.
 */
export async function maybeCertify(userId: string): Promise<boolean> {
  const [project, exam] = await Promise.all([
    latestSubmission(userId, "project"),
    latestSubmission(userId, "exam"),
  ]);
  const certified = project?.status === "approved" && exam?.status === "approved";
  if (certified) await awardBadge(userId, "certified-masters-edge");
  return certified;
}

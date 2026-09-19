//==============================================================================
// Academy — typed Supabase helpers (service role, server only)
//==============================================================================
// All me_ tables are RLS-locked with zero policies — only these server-side
// helpers (via the service-role key) can reach them. Never import from client
// components.
//==============================================================================

import { getAcademySupabase } from "./academy-supabase";
import { completedCourses, type AcademyCourse } from "@/content/academy/modules";
import { TOP_BADGE_SLUG } from "@/content/academy/badges";

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
  role: "member" | "admin";
  bio: string | null;
  photo_url: string | null;
  last_seen_at: string | null;
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
  return getAcademySupabase();
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

//------------------------------------------------------------------------------
// Course certificates — one per fully-passed course, stored as the badge
// `course-<id>` in me_awards (awarded_at = certificate date). System-generated
// and printable at /academy/certificate. The full top-rank credential
// (Certifier) is separate and only for the entire package.
//------------------------------------------------------------------------------
export interface CourseCertificate {
  courseId: string;
  title: string;
  emoji: string;
  awardedAt: string;
}

/**
 * Award any course certificates the member has earned but not yet received.
 * Idempotent (PK user_id + badge_slug) — safe to call on every quiz pass and
 * on progress reads, which also back-fills members who finished a course
 * before this existed. Returns the slugs newly awarded.
 */
export async function awardCourseCertificates(
  userId: string,
  passed: Set<string>,
  already: Iterable<string>
): Promise<string[]> {
  const have = new Set(already);
  const fresh: string[] = [];
  for (const course of completedCourses(passed)) {
    const slug = `course-${course.id}`;
    if (have.has(slug)) continue;
    if (await awardBadge(userId, slug)) fresh.push(slug);
  }
  return fresh;
}

/** Certificates already earned, newest first, joined to course metadata. */
export async function getCourseCertificates(
  userId: string,
  courses: AcademyCourse[]
): Promise<CourseCertificate[]> {
  const { data } = await db()
    .from("me_awards")
    .select("badge_slug, awarded_at")
    .eq("user_id", userId)
    .like("badge_slug", "course-%")
    .order("awarded_at", { ascending: false });
  const out: CourseCertificate[] = [];
  for (const row of data ?? []) {
    const id = String(row.badge_slug).slice("course-".length);
    const course = courses.find((c) => c.id === id);
    if (!course) continue; // course removed/renamed — don't show a dangling certificate
    out.push({ courseId: id, title: course.title, emoji: course.emoji, awardedAt: String(row.awarded_at) });
  }
  return out;
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
 * Award the top-rank badge when both the latest project and latest exam
 * submissions are approved. Idempotent. Returns whether the member is certified.
 */
export async function maybeCertify(userId: string): Promise<boolean> {
  const [project, exam] = await Promise.all([
    latestSubmission(userId, "project"),
    latestSubmission(userId, "exam"),
  ]);
  const certified = project?.status === "approved" && exam?.status === "approved";
  if (certified) await awardBadge(userId, TOP_BADGE_SLUG);
  return certified;
}

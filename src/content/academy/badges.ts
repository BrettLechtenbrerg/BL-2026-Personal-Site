//==============================================================================
// Academy — badges + rank levels (safe to import client-side)
//==============================================================================
// Rank names, the top credential and its badge come from academy.config so
// each brand (belts / levels / milestones) shares this one file. The
// `belt*` export names are kept for compatibility — "belt" = "rank".
//==============================================================================

import { academyConfig } from "@/content/academy.config";
import { moduleBadgeMeta, courseMeta } from "@/content/academy/badge-meta";

export interface Badge {
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

/** Special badges. Module-completion badges are generated: module-<slug>. */
export const specialBadges: Badge[] = [
  { slug: "first-steps", name: "First Steps", emoji: "👣", description: "Enrolled in the Academy" },
  { slug: "perfect-score", name: "Perfect Score", emoji: "💯", description: "Scored 100% on a quiz" },
  { slug: "seven-day-streak", name: "7-Day Streak", emoji: "🔥", description: "Visited 7 days in a row" },
  { slug: "community-contributor", name: "Community Contributor", emoji: "🤝", description: "Posted 5 times in the community" },
  {
    slug: academyConfig.ranks.top.badgeSlug,
    name: academyConfig.ranks.top.badgeName,
    emoji: academyConfig.ranks.top.badgeEmoji,
    description: academyConfig.ranks.top.badgeDescription,
  },
];

/** me_awards.badge_slug of the top credential (was hard-coded 'certified-masters-edge'). */
export const TOP_BADGE_SLUG = academyConfig.ranks.top.badgeSlug;

export function moduleBadge(moduleSlug: string, moduleTitle?: string): Badge {
  const meta = moduleBadgeMeta[moduleSlug];
  return {
    slug: `module-${moduleSlug}`,
    name: meta?.name ?? `${moduleTitle ?? moduleSlug} Master`,
    emoji: meta?.emoji ?? "🎖️",
    description: `Passed ${moduleTitle ?? moduleSlug}`,
  };
}


/** Course-completion badge: course-<id>. Doubles as the course certificate record in me_awards. */
export function courseBadge(courseId: string, courseTitle?: string, emoji?: string): Badge {
  const meta = courseMeta[courseId];
  const title = courseTitle ?? meta?.title ?? courseId;
  return {
    slug: `course-${courseId}`,
    name: `${title} — Certified`,
    emoji: emoji ?? meta?.emoji ?? "📜",
    description: `Completed every module in ${title}`,
  };
}

/** Look up any badge (special, module or course) by slug. */
export function badgeBySlug(slug: string): Badge {
  const special = specialBadges.find((b) => b.slug === slug);
  if (special) return special;
  if (slug.startsWith("module-")) return moduleBadge(slug.slice("module-".length));
  if (slug.startsWith("course-")) return courseBadge(slug.slice("course-".length));
  return { slug, name: slug, emoji: "🎖️", description: "" };
}

//------------------------------------------------------------------------------
// Rank levels (belts / levels / milestones — driven by academy.config)
//------------------------------------------------------------------------------
export interface BeltLevel {
  name: string;
  minXp: number;
  /** Tailwind-safe hex for the rank swatch. */
  color: string;
}

/** Ordered low → high. The last rank is awarded by certification approval, not
 *  XP alone — beltFor() caps at the second-to-last unless `certified` is true. */
export const beltLevels: BeltLevel[] = academyConfig.ranks.levels.map((l) => ({
  name: l.name,
  minXp: l.minXp ?? Infinity,
  color: l.color,
}));

/** Compact rank label (e.g. "Yellow" for "Yellow Belt"). */
export function shortRankName(name: string): string {
  const suffix = academyConfig.ranks.shortSuffix;
  return suffix && name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
}

export function beltFor(xp: number, certified = false): BeltLevel {
  if (certified) return beltLevels[beltLevels.length - 1];
  let belt = beltLevels[0];
  for (const b of beltLevels) {
    if (Number.isFinite(b.minXp) && xp >= b.minXp) belt = b;
  }
  return belt;
}

/** Next rank after the current one (null at the top). */
export function nextBelt(xp: number): BeltLevel | null {
  for (const b of beltLevels) {
    if (Number.isFinite(b.minXp) && xp < b.minXp) return b;
  }
  return null;
}

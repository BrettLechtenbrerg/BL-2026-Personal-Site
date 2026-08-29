//==============================================================================
// Master's Edge Academy — badges + belt levels (safe to import client-side)
//==============================================================================

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
  { slug: "certified-masters-edge", name: "Certified Master's Edge", emoji: "🏆", description: "Completed the full certification" },
];

const moduleBadgeMeta: Record<string, { name: string; emoji: string }> = {
  "fire-yourself": { name: "Role Evolver", emoji: "🔥" },
  "ideal-week": { name: "Time Architect", emoji: "📅" },
  "decision-journal": { name: "Clear Thinker", emoji: "🧭" },
};

export function moduleBadge(moduleSlug: string, moduleTitle?: string): Badge {
  const meta = moduleBadgeMeta[moduleSlug];
  return {
    slug: `module-${moduleSlug}`,
    name: meta?.name ?? `${moduleTitle ?? moduleSlug} Master`,
    emoji: meta?.emoji ?? "🎖️",
    description: `Passed ${moduleTitle ?? moduleSlug}`,
  };
}

/** Look up any badge (special or module) by slug. */
export function badgeBySlug(slug: string): Badge {
  const special = specialBadges.find((b) => b.slug === slug);
  if (special) return special;
  if (slug.startsWith("module-")) return moduleBadge(slug.slice("module-".length));
  return { slug, name: slug, emoji: "🎖️", description: "" };
}

//------------------------------------------------------------------------------
// Belt levels (martial-arts themed XP ranks)
//------------------------------------------------------------------------------
export interface BeltLevel {
  name: string;
  minXp: number;
  /** Tailwind-safe hex for the belt swatch. */
  color: string;
}

export const beltLevels: BeltLevel[] = [
  { name: "White Belt", minXp: 0, color: "#F5F5F5" },
  { name: "Yellow Belt", minXp: 100, color: "#FACC15" },
  { name: "Orange Belt", minXp: 250, color: "#FB923C" },
  { name: "Green Belt", minXp: 450, color: "#22C55E" },
  { name: "Blue Belt", minXp: 700, color: "#3B82F6" },
  { name: "Purple Belt", minXp: 1000, color: "#A855F7" },
  { name: "Brown Belt", minXp: 1400, color: "#92400E" },
  { name: "Red Belt", minXp: 1900, color: "#DC2626" },
  // Black Belt is awarded by certification approval, not XP alone —
  // beltFor() caps at Red unless `certified` is true.
  { name: "Black Belt", minXp: Infinity, color: "#1A1A1A" },
];

export function beltFor(xp: number, certified = false): BeltLevel {
  if (certified) return beltLevels[beltLevels.length - 1];
  let belt = beltLevels[0];
  for (const b of beltLevels) {
    if (Number.isFinite(b.minXp) && xp >= b.minXp) belt = b;
  }
  return belt;
}

/** Next belt after the current one (null at the top). */
export function nextBelt(xp: number): BeltLevel | null {
  for (const b of beltLevels) {
    if (Number.isFinite(b.minXp) && xp < b.minXp) return b;
  }
  return null;
}

//==============================================================================
// Academy — SITE-OWNED badge metadata (never overwritten by install.sh)
//==============================================================================
// Names + emoji for module badges and the client-side mirror of course
// title/emoji. `academy-lesson.mjs add` appends here. The engine's badges.ts
// imports these maps; keep both objects and their `const` names — the Lesson
// Forge finds them by name.
//==============================================================================

export const moduleBadgeMeta: Record<string, { name: string; emoji: string }> = {
  "fire-yourself": { name: "Role Evolver", emoji: "🔥" },
  "ideal-week": { name: "Time Architect", emoji: "📅" },
  "decision-journal": { name: "Clear Thinker", emoji: "🧭" },
  // Reclaiming the Clock track
  "time-maze": { name: "Maze Solver", emoji: "🌀" },
  "mapping-values": { name: "Values Mapper", emoji: "🗺️" },
  "daily-dozen": { name: "Morning Champion", emoji: "🌅" },
  "five-percent": { name: "5% Master", emoji: "💎" },
  "rules-of-freedom": { name: "Freedom Keeper", emoji: "🕊️" },
  "laws-of-maximization": { name: "Maximizer", emoji: "⚡" },
  "harmony-acceptance": { name: "Harmony Holder", emoji: "☸️" },
  "tools-and-stick": { name: "Clock Reclaimer", emoji: "⏰" },
  // The Master's Edge Book track
  "sword-in-shrine": { name: "Edge Keeper", emoji: "⚔️" },
  "acceptance-catapult": { name: "Catapult Rider", emoji: "🎯" },
  "masters-garden": { name: "Garden Tender", emoji: "🌱" },
  "two-beliefs": { name: "Growth Chooser", emoji: "🧠" },
  "burned-dojo": { name: "Rebuilder", emoji: "🌅" },
  "bamboo-warrior": { name: "Bamboo Bender", emoji: "🎍" },
  "swordsmiths-fire": { name: "Forged in Fire", emoji: "🔨" },
  "one-mountain": { name: "Mountain Climber", emoji: "⛰️" },
  "calm-river": { name: "Calm River", emoji: "🌊" },
  "warriors-ledger": { name: "Ledger Keeper", emoji: "📖" },
  "twin-tigers": { name: "Tiger Tamer", emoji: "🐯" },
  "garden-of-words": { name: "Word Gardener", emoji: "🌸" },
  "stone-steps": { name: "Step Cutter", emoji: "🪨" },
  "consistent-warrior": { name: "Consistent Warrior", emoji: "🔁" },
  "lantern-bearer": { name: "Lantern Bearer", emoji: "🏮" },
  "trust-trinity": { name: "Trust Builder", emoji: "🤝" },
  "masters-state": { name: "Flow Engineer", emoji: "🌀" },
  "unseen-belt": { name: "Unseen Belt", emoji: "🥋" },
  "six-pillars": { name: "Pillar Builder", emoji: "🏛️" },
  // Free giveaway course
  "masters-edge-framework": { name: "Framework Holder", emoji: "🎁" },
  "rockstar-team": { name: "Team Builder", emoji: "🎸" },
};

/**
 * Course title/emoji for client-side badge chips. Mirrors `academyCourses` in
 * modules.ts (kept here so this file stays import-free and light for the
 * browser). `academy-lesson.mjs add` appends new courses.
 */
export const courseMeta: Record<string, { title: string; emoji: string }> = {
  "framework": { title: "The Master's Edge Framework", emoji: "🎁" },
  "business-tools": { title: "Master's Edge Business Tools", emoji: "🛠️" },
  "reclaiming-the-clock": { title: "Reclaiming the Clock", emoji: "⏰" },
  "masters-edge-book": { title: "The Master's Edge Book", emoji: "⚔️" },
  "rockstar-teams": { title: "Rockstar Teams", emoji: "🎸" },
};

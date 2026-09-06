//==============================================================================
// Academy — per-module media sidecars installed by scripts/academy-install.mjs.
// Server-only. Flashcards live in
//   src/content/academy/flashcards/<slug>.json   [{ front, back }]
// so a 5,000-line modules.ts never has to be machine-edited for study decks.
// NOT under /public: Next traces fs reads into the serverless bundle, and
// /public/academy holds hundreds of MB of audio/video (Vercel cap: 250 MB).
//==============================================================================

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Flashcard } from "@/components/academy/Flashcards";

const DECKS = path.join(process.cwd(), "src", "content", "academy", "flashcards");
const SLUG_RE = /^[a-z0-9-]+$/;

export async function loadFlashcards(slug: string): Promise<Flashcard[] | undefined> {
  if (!SLUG_RE.test(slug)) return undefined;
  try {
    const raw = await readFile(path.join(DECKS, `${slug}.json`), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    const cards = parsed
      .filter((c): c is Flashcard => typeof c?.front === "string" && typeof c?.back === "string")
      .map((c) => ({ front: c.front.slice(0, 1000), back: c.back.slice(0, 2000) }));
    return cards.length ? cards : undefined;
  } catch {
    return undefined; // no deck installed
  }
}

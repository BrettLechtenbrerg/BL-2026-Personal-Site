#!/usr/bin/env node
//==============================================================================
// Academy — unattended batch: generate NotebookLM media for ONE module that is
// still missing audio / video / flashcards, install it, deploy. Designed to be
// fired repeatedly by launchd (see scripts/academy-batch.plist) until every
// module is done; it then unloads its own LaunchAgent.
//
//   node scripts/academy-batch.mjs            # one module, then exit
//   node scripts/academy-batch.mjs --status   # what's left, no work
//
// State: .notebooklm/batch-state.json  { attempts: { <slug>: n }, pausedUntil }
// A module is skipped after MAX_ATTEMPTS failed runs so one bad lesson can't
// block the queue. A quota/rate-limit failure doesn't count as an attempt — it
// pauses the batch for QUOTA_PAUSE_MIN instead. Log: .notebooklm/batch.log
//==============================================================================

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, appendFileSync, statSync } from "node:fs";
import path from "node:path";

if (!process.execArgv.includes("--experimental-strip-types")) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", ...process.argv.slice(1)], {
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const WORK = path.join(ROOT, ".notebooklm");
const LOCK = path.join(WORK, "batch.lock");
const STATE = path.join(WORK, "batch-state.json");
const LOG = path.join(WORK, "batch.log");
const LAUNCHD_LABEL = "com.brettlechtenberg.academy-notebooklm";
const MAX_ATTEMPTS = 3;
const QUOTA_PAUSE_MIN = 60;
const QUOTA_RE = /quota|rate.?limit|too many|429|daily limit|limit reached/i;
const NEEDED = [
  { kind: "audio", file: "deep-dive.m4a" },
  { kind: "video", file: "video-overview.mp4" },
  { kind: "flashcards", file: "flashcards.json" },
];

mkdirSync(WORK, { recursive: true });
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  appendFileSync(LOG, line + "\n");
};

const { academyModules } = await import(path.join(ROOT, "src/content/academy/modules.ts"));
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : { attempts: {} };

const queue = academyModules
  .map((m) => ({
    slug: m.slug,
    missing: NEEDED.filter((n) => !existsSync(path.join(ROOT, "public/academy", m.slug, n.file))).map((n) => n.kind),
  }))
  .filter((m) => m.missing.length > 0);
const runnable = queue.filter((m) => (state.attempts[m.slug] ?? 0) < MAX_ATTEMPTS);
const givenUp = queue.filter((m) => (state.attempts[m.slug] ?? 0) >= MAX_ATTEMPTS);

if (process.argv.includes("--status")) {
  console.log(`${academyModules.length - queue.length}/${academyModules.length} modules complete.`);
  for (const m of runnable) console.log(`  todo  ${m.slug}  (${m.missing.join(", ")})`);
  for (const m of givenUp) console.log(`  GAVE UP  ${m.slug}  (${m.missing.join(", ")}) — ${MAX_ATTEMPTS} failures; fix by hand`);
  process.exit(0);
}

if (state.pausedUntil && Date.now() < state.pausedUntil) {
  log(`Paused for quota until ${new Date(state.pausedUntil).toLocaleTimeString()}; skipping this tick.`);
  process.exit(0);
}

if (runnable.length === 0) {
  log(givenUp.length ? `Queue empty; ${givenUp.length} module(s) gave up — see --status.` : "All modules complete. 🎉");
  log("Unloading LaunchAgent.");
  spawnSync("launchctl", ["bootout", `gui/${process.getuid()}/${LAUNCHD_LABEL}`], { stdio: "ignore" });
  process.exit(0);
}

// One run at a time — launchd may fire while the previous tick is still generating.
// A lock older than the longest possible run is stale (crash / power loss) and is reclaimed.
const LOCK_STALE_MS = 75 * 60 * 1000;
try {
  if (existsSync(LOCK) && Date.now() - statSync(LOCK).mtimeMs > LOCK_STALE_MS) {
    log("Reclaiming stale lock.");
    rmSync(LOCK, { recursive: true, force: true });
  }
  mkdirSync(LOCK);
} catch {
  log("Another batch run is in progress; skipping this tick.");
  process.exit(0);
}
process.on("exit", () => rmSync(LOCK, { recursive: true, force: true }));

const next = runnable[0];
log(`Starting ${next.slug} (${next.missing.join(", ")}) — ${runnable.length} module(s) remaining.`);

const r = spawnSync(
  process.execPath,
  [path.join(ROOT, "scripts/academy-notebooklm.mjs"), next.slug, "--only", next.missing.join(","), "--deploy"],
  { stdio: ["ignore", "pipe", "pipe"], cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
);
appendFileSync(LOG, r.stdout ?? "");
appendFileSync(LOG, r.stderr ?? "");

const stillMissing = NEEDED.filter((n) => !existsSync(path.join(ROOT, "public/academy", next.slug, n.file))).map((n) => n.kind);
if (stillMissing.length === 0) {
  delete state.attempts[next.slug];
  log(`✓ ${next.slug} complete.`);
} else if (QUOTA_RE.test(`${r.stdout}\n${r.stderr}`)) {
  state.pausedUntil = Date.now() + QUOTA_PAUSE_MIN * 60 * 1000;
  log(`⏸ quota hit on ${next.slug} (still missing ${stillMissing.join(", ")}). Pausing ${QUOTA_PAUSE_MIN} min; not counted as a failure.`);
} else {
  state.attempts[next.slug] = (state.attempts[next.slug] ?? 0) + 1;
  log(`⚠ ${next.slug} still missing ${stillMissing.join(", ")} (attempt ${state.attempts[next.slug]}/${MAX_ATTEMPTS}; exit ${r.status}). See batch.log.`);
}
writeFileSync(STATE, JSON.stringify(state, null, 2));

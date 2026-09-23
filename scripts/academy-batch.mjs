#!/usr/bin/env node
//==============================================================================
// Academy Forge — unattended NotebookLM batch. Each run generates the missing
// NotebookLM pieces (Deep Dive audio, video overview, flashcards) for ONE module,
// installs them, then exits. launchd fires it every 20 min (academy-batch-ctl.sh)
// until every module is complete, then it unloads its own LaunchAgent.
//
//   node scripts/academy-batch.mjs            # one module, then exit
//   node scripts/academy-batch.mjs --status   # what's left, no work
//   node scripts/academy-batch.mjs --deploy   # also commit + publish each finished
//                                             # module (the brand's deploy rule)
//
// NotebookLM limits bursts, not a small daily count: BL.com made 23 videos in one
// day this way. So: one module at a time ACROSS ALL ACADEMIES (every brand shares
// one NotebookLM account — the lock and the pause live in ~/.academy-forge/), and a
// rate-limit answer pauses every academy's batch for 60 min without counting as a
// failure. A module is given up after 3 real failures so one bad lesson can't block
// the queue. Per-site state/log: .notebooklm/batch-state.json, .notebooklm/batch.log
//==============================================================================
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, appendFileSync, statSync } from "node:fs";
import { register } from "node:module";
import os from "node:os";
import path from "node:path";

if (!process.execArgv.includes("--experimental-strip-types")) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", ...process.argv.slice(1)], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}
// Split per-lesson module files (GIFT CONNECT: `import { read } from "./habits/read"`).
register("data:text/javascript," + encodeURIComponent(`export async function resolve(s, c, next) {
  try { return await next(s, c); } catch (err) {
    if (!/^\\.{1,2}\\//.test(s) || /\\.[cm]?[jt]sx?$/.test(s)) throw err;
    for (const ext of [".ts", "/index.ts"]) { try { return await next(s + ext, c); } catch {} }
    throw err;
  }
}`));

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = ["src", ""].map((d) => path.join(ROOT, d)).find((d) => existsSync(path.join(d, "content", "academy.config.ts"))) ?? path.join(ROOT, "src");
const SITE = (() => {
  const m = readFileSync(path.join(SRC, "content", "academy.config.ts"), "utf8").match(/academyConfig: AcademyConfig = (\{[\s\S]*\});\s*$/);
  if (!m) throw new Error("academy.config.ts not found or unreadable — run install.sh for this brand first");
  return JSON.parse(m[1]);
})();

const WORK = path.join(ROOT, ".notebooklm");
const STATE = path.join(WORK, "batch-state.json");
const LOG = path.join(WORK, "batch.log");
const SHARED = path.join(os.homedir(), ".academy-forge"); // one NotebookLM account for every academy
const LOCK = path.join(SHARED, "notebooklm-batch.lock");
const PAUSE = path.join(SHARED, "notebooklm-pause.json");
const LAUNCHD_LABEL = `com.brettlechtenberg.academy-batch.${SITE.slug}`;
const MAX_ATTEMPTS = 3;
const PAUSE_MIN = 60;
const LOCK_STALE_MS = 75 * 60 * 1000; // longer than the longest possible run
const RATE_RE = /RateLimitError|rate.?limit|quota|too many|429|daily limit|limit reached/i;
const DEPLOY = process.argv.includes("--deploy");
const NEEDED = [
  { kind: "audio", file: (slug) => path.join(ROOT, "public/academy", slug, "deep-dive.m4a") },
  { kind: "video", file: (slug) => path.join(ROOT, "public/academy", slug, "video-overview.mp4") },
  { kind: "flashcards", file: (slug) => path.join(SRC, "content/academy/flashcards", `${slug}.json`) },
];

mkdirSync(WORK, { recursive: true });
mkdirSync(SHARED, { recursive: true });
const log = (msg) => {
  const line = `[${new Date().toISOString()}] [${SITE.slug}] ${msg}`;
  console.log(line);
  appendFileSync(LOG, line + "\n");
};
const readJson = (f, fallback) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch { return fallback; } };

const { academyModules } = await import(path.join(SRC, "content/academy/modules.ts"));
const state = readJson(STATE, { attempts: {} });
state.attempts ??= {};

const queue = academyModules
  .map((m) => ({ slug: m.slug, missing: NEEDED.filter((n) => !existsSync(n.file(m.slug))).map((n) => n.kind) }))
  .filter((m) => m.missing.length > 0);
const runnable = queue.filter((m) => (state.attempts[m.slug] ?? 0) < MAX_ATTEMPTS);
const givenUp = queue.filter((m) => (state.attempts[m.slug] ?? 0) >= MAX_ATTEMPTS);
const pausedUntil = readJson(PAUSE, {}).until ?? 0;

if (process.argv.includes("--status")) {
  console.log(`${SITE.slug}: ${academyModules.length - queue.length}/${academyModules.length} modules have NotebookLM audio + video + flashcards.`);
  if (pausedUntil > Date.now()) console.log(`  NotebookLM paused (all academies) until ${new Date(pausedUntil).toLocaleTimeString()}`);
  for (const m of runnable) console.log(`  todo      ${m.slug}  (${m.missing.join(", ")})`);
  for (const m of givenUp) console.log(`  GAVE UP   ${m.slug}  (${m.missing.join(", ")}) — ${MAX_ATTEMPTS} failures; fix by hand, then delete it from .notebooklm/batch-state.json`);
  process.exit(0);
}

if (pausedUntil > Date.now()) {
  log(`NotebookLM paused until ${new Date(pausedUntil).toLocaleTimeString()} (rate limit); skipping this tick.`);
  process.exit(0);
}

if (runnable.length === 0) {
  log(givenUp.length ? `Queue empty; ${givenUp.length} module(s) gave up — see --status.` : "All modules complete.");
  log("Unloading LaunchAgent.");
  spawnSync("launchctl", ["bootout", `gui/${process.getuid()}/${LAUNCHD_LABEL}`], { stdio: "ignore" });
  process.exit(0);
}

// One NotebookLM run at a time on this Mac, whichever academy asks.
try {
  if (existsSync(LOCK) && Date.now() - statSync(LOCK).mtimeMs > LOCK_STALE_MS) {
    log("Reclaiming stale NotebookLM lock.");
    rmSync(LOCK, { recursive: true, force: true });
  }
  mkdirSync(LOCK);
} catch {
  log("Another NotebookLM batch run is in progress (this or another academy); skipping this tick.");
  process.exit(0);
}
writeFileSync(path.join(LOCK, "owner"), `${SITE.slug} ${process.pid}\n`);
process.on("exit", () => rmSync(LOCK, { recursive: true, force: true }));

const next = runnable[0];
log(`Starting ${next.slug} (${next.missing.join(", ")}) — ${runnable.length} module(s) remaining.`);
const r = spawnSync(
  process.execPath,
  [path.join(ROOT, "scripts/academy-notebooklm.mjs"), next.slug, "--only", next.missing.join(","), ...(DEPLOY ? ["--deploy"] : [])],
  { stdio: ["ignore", "pipe", "pipe"], cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
appendFileSync(LOG, r.stdout ?? "");
appendFileSync(LOG, r.stderr ?? "");

const stillMissing = NEEDED.filter((n) => !existsSync(n.file(next.slug))).map((n) => n.kind);
if (stillMissing.length === 0) {
  delete state.attempts[next.slug];
  log(`✓ ${next.slug} complete.${DEPLOY ? "" : " Not published (run without --deploy): review, commit and publish by hand."}`);
} else if (RATE_RE.test(`${r.stdout}\n${r.stderr}`)) {
  writeFileSync(PAUSE, JSON.stringify({ until: Date.now() + PAUSE_MIN * 60 * 1000, by: SITE.slug, module: next.slug }, null, 2));
  log(`⏸ NotebookLM rate limit on ${next.slug} (still missing ${stillMissing.join(", ")}). Pausing every academy's batch ${PAUSE_MIN} min; not counted as a failure.`);
} else {
  state.attempts[next.slug] = (state.attempts[next.slug] ?? 0) + 1;
  log(`⚠ ${next.slug} still missing ${stillMissing.join(", ")} (attempt ${state.attempts[next.slug]}/${MAX_ATTEMPTS}; exit ${r.status}). See batch.log.`);
}
writeFileSync(STATE, JSON.stringify(state, null, 2));

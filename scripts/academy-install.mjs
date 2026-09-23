#!/usr/bin/env node
//==============================================================================
// Academy — install a NotebookLM artifact onto a module.
//
//   node scripts/academy-install.mjs <module-slug> <file> [--label "…"] [--deploy]
//
// Accepts whatever you downloaded from NotebookLM:
//   flashcards  .csv (NotebookLM "Download") or .json (notebooklm-py)
//   quiz        .json (notebooklm-py)  → printed as TS for you to paste into
//                                        the module's quiz[] (never auto-edited)
//   audio       .m4a .mp3 .wav         → public/academy/<slug>/, "Listen" block
//   video       .mp4 .webm             → public/academy/<slug>/, "Video Overview"
//
// Flashcards are written to <srcDir>/content/academy/flashcards/<slug>.json (read
// at request time — modules.ts untouched). Audio/video insert ONE entry into the
// module's audio[]/videoFiles[] in <srcDir>/content/academy/modules.ts, or in the
// module's own file when a site splits lessons out (GIFT CONNECT: habits/<slug>.ts).
// --deploy runs: git add, commit, push, then vercel --prod (cli brands) or nothing more (git-push brands).
//==============================================================================

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync, readdirSync, renameSync, rmSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
// srcDir ("src" or "") comes from the generated Academy Forge config.
const SRC = ["src", ""].map((d) => path.join(ROOT, d)).find((d) => existsSync(path.join(d, "content", "academy.config.ts"))) ?? path.join(ROOT, "src");
const SRC_REL = path.relative(ROOT, SRC);
const MODULES_TS = path.join(SRC, "content/academy/modules.ts");
const MAX_REPO_MEDIA_MB = 90; // above this, Vercel/Git get unhappy — use Supabase Storage
// Deploy rule from the generated config: "cli" → vercel --prod; "git-push" → push only (PMMA, GC).
const SITE_CFG = (() => {
  try {
    const m = readFileSync(path.join(SRC, "content", "academy.config.ts"), "utf8").match(/academyConfig: AcademyConfig = (\{[\s\S]*\});\s*$/);
    return m ? JSON.parse(m[1]) : {};
  } catch { return {}; }
})();
const SITE_DEPLOY = { mode: SITE_CFG.site?.deploy ?? "cli", branch: SITE_CFG.site?.gitBranch ?? "main" };
// Optional Forge-profile `media.compress` (GIFT CONNECT: true): re-encode .m4a/.mp4 before they
// enter git — speech audio 64 kbps mono AAC; slide video x264 CRF 28 stillimage (SSIM ~0.99).
const COMPRESS = (() => {
  const f = path.join(os.homedir(), "dev/academy-forge/brands", String(SITE_CFG.slug ?? ""), "academy.json");
  try { return JSON.parse(readFileSync(f, "utf8")).media?.compress === true; } catch { return false; }
})();

const args = process.argv.slice(2);
const flags = { label: "", deploy: false };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--label") flags.label = args[++i] ?? "";
  else if (args[i] === "--deploy") flags.deploy = true;
  else positional.push(args[i]);
}
const [slug, file] = positional;
if (!slug || !file) {
  console.error('Usage: node scripts/academy-install.mjs <module-slug> <file> [--label "…"] [--deploy]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) die(`Bad slug "${slug}" — lowercase letters, digits, dashes only.`);
if (!existsSync(file)) die(`File not found: ${file}`);

// The module lives in modules.ts, or in a split per-lesson file under content/academy/
// (GIFT CONNECT: habits/<slug>.ts). Match the slug line at whatever indent it has.
const MODULE_FILE = moduleFileFor(slug);
if (!MODULE_FILE) die(`No module with slug "${slug}" in modules.ts (or a file under content/academy/).`);
const modulesSrc = readFileSync(MODULE_FILE, "utf8");
const slugAnchor = modulesSrc.match(new RegExp(`^[ \\t]*slug: "${slug}",\\n`, "m"))[0];

const ext = path.extname(file).toLowerCase();
const outDir = path.join(ROOT, "public/academy", slug);
const changed = [];

if (ext === ".csv" || (ext === ".json" && looksLikeFlashcards(file))) {
  const cards = (ext === ".csv" ? parseCsvCards(readFileSync(file, "utf8")) : parseJsonCards(file))
    .map((c) => ({ ...c, front: plainMath(c.front), back: plainMath(c.back) }));
  if (cards.length === 0) die("No flashcards found in that file.");
  const deckDir = path.join(SRC, "content/academy/flashcards");
  mkdirSync(deckDir, { recursive: true });
  const out = path.join(deckDir, `${slug}.json`);
  writeFileSync(out, JSON.stringify(cards, null, 2) + "\n");
  changed.push(out);
  console.log(`✓ ${cards.length} flashcards → ${rel(out)}`);
} else if (ext === ".json") {
  printQuizAsTs(file);
} else if ([".m4a", ".mp3", ".wav", ".mp4", ".webm"].includes(ext)) {
  const isAudio = [".m4a", ".mp3", ".wav"].includes(ext);
  const name = path.basename(file).toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, name);
  if (!(COMPRESS && [".m4a", ".mp4"].includes(ext) && compressMedia(file, dest, isAudio))) copyFileSync(file, dest);
  const mb = statSync(dest).size / 1024 / 1024;
  if (mb > MAX_REPO_MEDIA_MB) {
    rmSync(dest, { force: true });
    die(`${mb.toFixed(0)} MB is too big for the repo (limit ${MAX_REPO_MEDIA_MB} MB). Upload to Supabase Storage and add the URL to modules.ts by hand.`);
  }
  const href = `/academy/${slug}/${name}`;
  const label = flags.label || (isAudio ? "Deep Dive (NotebookLM audio overview)" : "Video Overview (NotebookLM)");
  const key = isAudio ? "audio" : "videoFiles";
  writeFileSync(MODULE_FILE, insertMedia(modulesSrc, slugAnchor, key, label, href));
  changed.push(dest, MODULE_FILE);
  console.log(`✓ ${isAudio ? "audio" : "video"} → ${rel(dest)} (${mb.toFixed(1)} MB), wired into ${rel(MODULE_FILE)} as ${key}[]`);
} else {
  die(`Don't know what to do with "${ext}" files.`);
}

if (flags.deploy && changed.length) {
  run("npx", ["tsc", "--noEmit"]);
  run("git", ["add", ...changed]);
  run("git", ["commit", "-m", `Academy: install ${path.basename(file)} on ${slug}`]);
  run("git", ["push", "origin", SITE_DEPLOY.branch]);
  if (SITE_DEPLOY.mode === "git-push") console.log("✓ pushed — Vercel auto-deploys (git-push brand; never bare vercel)");
  else { run("npx", ["vercel", "--prod", "--yes"]); console.log("✓ deployed"); }
} else if (changed.length) {
  console.log("\nNext: review with `git diff`, then commit and publish the way this brand deploys (or re-run with --deploy).");
}

//------------------------------------------------------------------------------

function looksLikeFlashcards(f) {
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    return Array.isArray(j) || Array.isArray(j?.cards) || Array.isArray(j?.flashcards);
  } catch {
    return false;
  }
}

/** notebooklm-py: {cards:[{front,back}]}; raw NotebookLM: {flashcards:[{f,b}]}; or a bare array. */
function parseJsonCards(f) {
  const j = JSON.parse(readFileSync(f, "utf8"));
  const list = Array.isArray(j) ? j : (j.cards ?? j.flashcards ?? []);
  return list
    .map((c) => ({ front: String(c.front ?? c.f ?? c.question ?? "").trim(), back: String(c.back ?? c.b ?? c.answer ?? "").trim() }))
    .filter((c) => c.front && c.back);
}

/** RFC-4180-ish CSV: quoted fields, doubled quotes, newlines inside quotes. First two columns = front, back. */
function parseCsvCards(text) {
  const rows = [];
  let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cell += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const cards = rows
    .filter((r) => r.length >= 2)
    .map((r) => ({ front: r[0].trim(), back: r[1].trim() }))
    .filter((c) => c.front && c.back);
  // Drop a header row like "front,back" / "Question,Answer" / "term,definition".
  if (cards.length && /^(front|question|term|prompt)$/i.test(cards[0].front)) cards.shift();
  return cards;
}

/** notebooklm-py quiz JSON → TS snippet matching the module's QuizQuestion shape. */
function printQuizAsTs(f) {
  const j = JSON.parse(readFileSync(f, "utf8"));
  const qs = j.questions ?? j.quiz ?? [];
  if (!Array.isArray(qs) || !qs.length) die("No quiz questions found in that file.");
  const q = (s) => JSON.stringify(String(s ?? "").trim());
  console.log(`// Paste into the "${slug}" module's quiz: [ … ] in ${path.join(SRC_REL, "content/academy/modules.ts")}\n`);
  for (const item of qs) {
    const opts = item.answerOptions ?? item.options ?? [];
    const correct = Math.max(0, opts.findIndex((o) => o.isCorrect));
    const explanation = opts[correct]?.rationale ?? item.explanation ?? "";
    console.log(`      {
        question: ${q(item.question)},
        options: [${opts.map((o) => q(o.text ?? o)).join(", ")}],
        correctIndex: ${correct},
        explanation: ${q(explanation)},
      },`);
  }
  console.log(`\n(${qs.length} questions — not written to disk; quizzes stay hand-reviewed.)`);
}

// NotebookLM writes numbers as inline TeX ("$80\\%$", "$1$ to $2$"); the deck renders plain
// text, so unwrap $…$ spans and TeX escapes. Money survives: "$20 to $25" has a space before
// the second "$", and "$99-$149" has a digit after it, so neither is read as a span.
function plainMath(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/\$(\S(?:[^$]*\S)?)\$(?!\d)/g, (m, inner) => (/^[\d\s.,%+\-–×/=^()\\{}a-z]*$/i.test(inner) && /\d/.test(inner) ? inner : m))
    .replace(/\\([%$&#_])/g, "$1")
    .replace(/\\times/g, "×")
    .replace(/\\,/g, "");
}

/** Re-encode into dest; true only if ffmpeg succeeded and the duration survived (±1.5 s). */
function compressMedia(src, dest, isAudio) {
  const tmp = `${dest}.compressing${path.extname(dest)}`;
  const enc = isAudio
    ? ["-map", "0:a:0", "-c:a", "aac_at", "-b:a", "64k", "-ac", "1"]
    : ["-c:v", "libx264", "-preset", "slow", "-crf", "28", "-tune", "stillimage", "-pix_fmt", "yuv420p", "-c:a", "aac_at", "-b:a", "64k", "-ac", "1"];
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", src, ...enc, "-movflags", "+faststart", tmp], { stdio: ["ignore", "ignore", "inherit"] });
  const dur = (f) => Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).stdout.trim());
  if (r.status === 0 && existsSync(tmp) && Math.abs(dur(src) - dur(tmp)) <= 1.5) {
    renameSync(tmp, dest);
    console.log(`  compressed ${(statSync(src).size / 1048576).toFixed(1)} → ${(statSync(dest).size / 1048576).toFixed(1)} MB (profile media.compress)`);
    return true;
  }
  rmSync(tmp, { force: true });
  console.warn("⚠ compression failed or changed the duration — installing the original file");
  return false;
}

function moduleFileFor(s) {
  const anchor = new RegExp(`^[ \\t]*slug: "${s}",$`, "m");
  const files = [MODULES_TS];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".ts") && p !== MODULES_TS) files.push(p);
    }
  };
  walk(path.dirname(MODULES_TS));
  return files.find((f) => anchor.test(readFileSync(f, "utf8"))) ?? null;
}

function insertMedia(src, anchor, key, label, href) {
  const ind = anchor.match(/^[ \t]*/)[0]; // property indent inside the module object
  const item = `{ label: ${JSON.stringify(label)}, href: ${JSON.stringify(href)} }`;
  const entry = `${ind}  ${item},\n`;
  const start = src.indexOf(anchor);
  const close = src.slice(start).search(new RegExp(`\\n${ind.slice(2)}\\}[,;]?\\n`)); // end of this module object
  const block = src.slice(start, close === -1 ? undefined : start + close);
  if (block.includes(JSON.stringify(href))) {
    console.log(`  (${rel(MODULE_FILE)} already lists ${href} — file replaced, entry unchanged)`);
    return src;
  }
  const multi = `\n${ind}${key}: [\n`;
  const keyIdx = block.indexOf(multi);
  if (keyIdx !== -1) {
    // Append to the existing multi-line array.
    const insertAt = start + keyIdx + multi.length;
    return src.slice(0, insertAt) + entry + src.slice(insertAt);
  }
  const inline = `\n${ind}${key}: [`;
  const inlineIdx = block.indexOf(inline);
  if (inlineIdx !== -1) {
    // Single-line array (`audio: [{ … }],` or `audio: [],`) — prepend inline.
    const insertAt = start + inlineIdx + inline.length;
    const empty = src[insertAt] === "]";
    return src.slice(0, insertAt) + item + (empty ? "" : ", ") + src.slice(insertAt);
  }
  // Add a new array right after the slug line.
  const insertAt = start + anchor.length;
  return src.slice(0, insertAt) + `${ind}${key}: [\n${entry}${ind}],\n` + src.slice(insertAt);
}

function run(cmd, cmdArgs) {
  console.log(`$ ${cmd} ${cmdArgs.join(" ")}`);
  execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit" });
}
function rel(p) { return path.relative(ROOT, p); }
function die(msg) { console.error(`✗ ${msg}`); process.exit(1); }

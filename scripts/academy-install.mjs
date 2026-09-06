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
// Flashcards are written to src/content/academy/flashcards/<slug>.json (read
// at request time — modules.ts untouched). Audio/video insert ONE entry into the
// module's audio[]/videoFiles[] in src/content/academy/modules.ts.
// --deploy runs: git add, commit, push, vercel --prod.
//==============================================================================

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MODULES_TS = path.join(ROOT, "src/content/academy/modules.ts");
const MAX_REPO_MEDIA_MB = 90; // above this, Vercel/Git get unhappy — use Supabase Storage

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

const modulesSrc = readFileSync(MODULES_TS, "utf8");
const slugAnchor = `    slug: "${slug}",\n`;
if (!modulesSrc.includes(slugAnchor)) die(`No module with slug "${slug}" in modules.ts.`);

const ext = path.extname(file).toLowerCase();
const outDir = path.join(ROOT, "public/academy", slug);
const changed = [];

if (ext === ".csv" || (ext === ".json" && looksLikeFlashcards(file))) {
  const cards = ext === ".csv" ? parseCsvCards(readFileSync(file, "utf8")) : parseJsonCards(file);
  if (cards.length === 0) die("No flashcards found in that file.");
  const deckDir = path.join(ROOT, "src/content/academy/flashcards");
  mkdirSync(deckDir, { recursive: true });
  const out = path.join(deckDir, `${slug}.json`);
  writeFileSync(out, JSON.stringify(cards, null, 2) + "\n");
  changed.push(out);
  console.log(`✓ ${cards.length} flashcards → ${rel(out)}`);
} else if (ext === ".json") {
  printQuizAsTs(file);
} else if ([".m4a", ".mp3", ".wav", ".mp4", ".webm"].includes(ext)) {
  const mb = statSync(file).size / 1024 / 1024;
  if (mb > MAX_REPO_MEDIA_MB) {
    die(`${mb.toFixed(0)} MB is too big for the repo (limit ${MAX_REPO_MEDIA_MB} MB). Upload to Supabase Storage and add the URL to modules.ts by hand.`);
  }
  const isAudio = [".m4a", ".mp3", ".wav"].includes(ext);
  const name = path.basename(file).toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, name);
  copyFileSync(file, dest);
  const href = `/academy/${slug}/${name}`;
  const label = flags.label || (isAudio ? "Deep Dive (NotebookLM audio overview)" : "Video Overview (NotebookLM)");
  const key = isAudio ? "audio" : "videoFiles";
  writeFileSync(MODULES_TS, insertMedia(modulesSrc, slugAnchor, key, label, href));
  changed.push(dest, MODULES_TS);
  console.log(`✓ ${isAudio ? "audio" : "video"} → ${rel(dest)} (${mb.toFixed(1)} MB), wired into modules.ts as ${key}[]`);
} else {
  die(`Don't know what to do with "${ext}" files.`);
}

if (flags.deploy && changed.length) {
  run("npx", ["tsc", "--noEmit"]);
  run("git", ["add", ...changed]);
  run("git", ["commit", "-m", `Academy: install ${path.basename(file)} on ${slug}`]);
  run("git", ["push", "origin", "main"]);
  run("npx", ["vercel", "--prod", "--yes"]);
  console.log("✓ deployed");
} else if (changed.length) {
  console.log("\nNext: review with `git diff`, then commit + `npx vercel --prod --yes` (or re-run with --deploy).");
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
  console.log(`// Paste into the "${slug}" module's quiz: [ … ] in src/content/academy/modules.ts\n`);
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

function insertMedia(src, anchor, key, label, href) {
  const entry = `      { label: ${JSON.stringify(label)}, href: ${JSON.stringify(href)} },\n`;
  const start = src.indexOf(anchor);
  const blockEnd = src.indexOf("\n  },\n", start); // end of this module object
  const block = src.slice(start, blockEnd);
  if (block.includes(JSON.stringify(href))) {
    console.log(`  (modules.ts already lists ${href} — file replaced, entry unchanged)`);
    return src;
  }
  const keyIdx = block.indexOf(`\n    ${key}: [\n`);
  if (keyIdx !== -1) {
    // Append to the existing array.
    const insertAt = start + keyIdx + `\n    ${key}: [\n`.length;
    return src.slice(0, insertAt) + entry + src.slice(insertAt);
  }
  // Add a new array right after the slug line.
  const insertAt = start + anchor.length;
  return src.slice(0, insertAt) + `    ${key}: [\n${entry}    ],\n` + src.slice(insertAt);
}

function run(cmd, cmdArgs) {
  console.log(`$ ${cmd} ${cmdArgs.join(" ")}`);
  execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit" });
}
function rel(p) { return path.relative(ROOT, p); }
function die(msg) { console.error(`✗ ${msg}`); process.exit(1); }

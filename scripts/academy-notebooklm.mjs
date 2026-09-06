#!/usr/bin/env node
//==============================================================================
// Academy — Layer 2: generate NotebookLM artifacts for a module and install
// them. Wraps the unofficial `notebooklm` CLI (notebooklm-py); it rides your
// Google session, so it can break whenever Google changes NotebookLM. Nothing
// on the site depends on it — it only produces files for academy-install.mjs.
//
//   node scripts/academy-notebooklm.mjs <module-slug> [--only audio,video,flashcards,quiz]
//                                       [--keep] [--deploy]
//
// Steps: lesson → Markdown → new notebook → generate (audio + video + flash-
// cards + quiz) → download to .notebooklm/<slug>/ → academy-install.mjs each.
// The notebook is deleted afterwards unless --keep.
//
// One-time setup:
//   uv tool install "notebooklm-py[browser]"     (or pipx install …)
//   notebooklm login                              (Google sign-in in a browser)
// Free tier: ~3 audio + 3 video per day → run one module at a time.
//==============================================================================

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

// modules.ts is plain TS with no imports — Node 22 can load it once type
// stripping is on. Re-exec with the flag so the command stays `node scripts/…`.
if (!process.execArgv.includes("--experimental-strip-types")) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", ...process.argv.slice(1)], {
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const WORK = path.join(ROOT, ".notebooklm");
const ALL = ["audio", "video", "flashcards", "quiz"];

// --- args --------------------------------------------------------------------
const args = process.argv.slice(2);
const flags = { only: ALL, keep: false, deploy: false };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--only") flags.only = (args[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  else if (args[i] === "--keep") flags.keep = true;
  else if (args[i] === "--deploy") flags.deploy = true;
  else positional.push(args[i]);
}
const [slug] = positional;
if (!slug || !/^[a-z0-9-]+$/.test(slug)) die("Usage: node scripts/academy-notebooklm.mjs <module-slug> [--only audio,video,flashcards,quiz] [--keep] [--deploy]");
const bad = flags.only.filter((k) => !ALL.includes(k));
if (bad.length) die(`Unknown --only value(s): ${bad.join(", ")}. Choose from ${ALL.join(", ")}.`);

// --- preflight ---------------------------------------------------------------
if (spawnSync("notebooklm", ["--version"], { stdio: "ignore" }).status !== 0) {
  die('notebooklm CLI not found. Install: uv tool install "notebooklm-py[browser]"  then: notebooklm login');
}
if (spawnSync("notebooklm", ["auth", "check"], { stdio: "ignore" }).status !== 0) {
  die("Not signed in to NotebookLM. Run: notebooklm login");
}

// --- lesson → markdown -------------------------------------------------------
const { academyModules } = await import(path.join(ROOT, "src/content/academy/modules.ts"));
const mod = academyModules.find((m) => m.slug === slug);
if (!mod) die(`No module with slug "${slug}".`);

const outDir = path.join(WORK, slug);
mkdirSync(outDir, { recursive: true });
const lessonMd = path.join(outDir, "lesson.md");
writeFileSync(lessonMd, lessonToMarkdown(mod));
console.log(`✓ lesson → ${rel(lessonMd)} (${mod.lesson.length} sections)`);

// --- notebook ----------------------------------------------------------------
const created = nlmJson(["create", `Academy: ${mod.title}`, "--json"]);
const notebookId = created.notebook?.id ?? created.id ?? created.notebook_id;
if (!notebookId) die(`Could not read notebook id from: ${JSON.stringify(created)}`);
console.log(`✓ notebook ${notebookId}`);
const nb = ["-n", notebookId];

try {
  const src = nlmJson(["source", "add", lessonMd, "--title", mod.title, "--json", ...nb]);
  const srcId = src.source?.id ?? src.id ?? src.source_id;
  if (srcId) spawnSync("notebooklm", ["source", "wait", srcId, "--timeout", "300", ...nb], { stdio: "ignore" });
  console.log("✓ lesson added as source");

  const jobs = {
    audio: {
      gen: ["generate", "audio", audioPrompt(mod), "--format", "deep-dive", "--retry", "3", ...nb],
      dl: ["download", "audio", path.join(outDir, "deep-dive.m4a"), "--force", ...nb],
      file: "deep-dive.m4a",
      label: `Deep Dive: ${mod.title} (NotebookLM audio overview)`,
    },
    video: {
      gen: ["generate", "video", videoPrompt(mod), "--format", "explainer", "--retry", "3", ...nb],
      dl: ["download", "video", path.join(outDir, "video-overview.mp4"), "--force", ...nb],
      file: "video-overview.mp4",
      label: `${mod.title} (NotebookLM video overview)`,
    },
    flashcards: {
      gen: ["generate", "flashcards", "--quantity", "standard", "--retry", "3", ...nb],
      dl: ["download", "flashcards", path.join(outDir, "flashcards.json"), "--format", "json", "--force", ...nb],
      file: "flashcards.json",
    },
    quiz: {
      gen: ["generate", "quiz", "--difficulty", "medium", "--retry", "3", ...nb],
      dl: ["download", "quiz", path.join(outDir, "quiz.json"), "--format", "json", "--force", ...nb],
      file: "quiz.json",
    },
  };

  // Start every generation first (NotebookLM runs them in parallel server-side),
  // then wait on each in turn.
  const started = [];
  for (const kind of flags.only) {
    let res;
    try {
      res = JSON.parse(nlm([...jobs[kind].gen, "--json"]));
    } catch (err) {
      console.warn(`⚠ ${kind}: could not start (${String(err.message ?? err).slice(0, 200)}) — daily quota?`);
      continue;
    }
    const taskId = res.task_id ?? res.artifact_id ?? res.id;
    if (!taskId) {
      console.warn(`⚠ ${kind}: could not start (${JSON.stringify(res).slice(0, 200)})`);
      continue;
    }
    started.push({ kind, taskId });
    console.log(`… ${kind} generating (${taskId})`);
  }

  const installed = [];
  for (const { kind, taskId } of started) {
    const j = jobs[kind];
    const timeout = kind === "video" ? "1800" : kind === "audio" ? "1200" : "300";
    const waited = spawnSync("notebooklm", ["artifact", "wait", taskId, "--timeout", timeout, ...nb], { stdio: "inherit" });
    if (waited.status !== 0) {
      console.warn(`⚠ ${kind}: generation failed or timed out — skipping`);
      continue;
    }
    if (spawnSync("notebooklm", j.dl, { stdio: "inherit" }).status !== 0) {
      console.warn(`⚠ ${kind}: download failed — skipping`);
      continue;
    }
    const file = path.join(outDir, j.file);
    if (!existsSync(file)) {
      console.warn(`⚠ ${kind}: ${rel(file)} missing after download — skipping`);
      continue;
    }
    console.log(`✓ ${kind} → ${rel(file)}`);
    const installArgs = [path.join(ROOT, "scripts/academy-install.mjs"), slug, file];
    if (j.label) installArgs.push("--label", j.label);
    const inst = spawnSync("node", installArgs, { stdio: "inherit" });
    if (inst.status === 0) installed.push(kind);
  }

  console.log(`\nInstalled: ${installed.length ? installed.join(", ") : "nothing"}.`);
  if (installed.includes("quiz")) console.log("Quiz printed above — paste into modules.ts if you want it.");

  if (flags.deploy && installed.some((k) => k !== "quiz")) {
    run("npx", ["tsc", "--noEmit"]);
    run("git", ["add", "src/content/academy/modules.ts", `public/academy/${slug}`, "src/content/academy/flashcards"]);
    run("git", ["commit", "-m", `Academy: NotebookLM ${installed.filter((k) => k !== "quiz").join("+")} for ${slug}`]);
    run("git", ["push", "origin", "main"]);
    run("npx", ["vercel", "--prod", "--yes"]);
    console.log("✓ deployed");
  } else if (installed.length) {
    console.log("Next: review with `git diff`, then commit + `npx vercel --prod --yes` (or re-run with --deploy).");
  }
} finally {
  if (flags.keep) {
    console.log(`Notebook kept: ${notebookId} (notebooklm use ${notebookId})`);
  } else {
    spawnSync("notebooklm", ["delete", "-n", notebookId, "-y"], { stdio: "ignore" });
    console.log("✓ notebook deleted (use --keep to retain it)");
  }
}

//------------------------------------------------------------------------------

function lessonToMarkdown(m) {
  const lines = [`# ${m.title}`, "", `_${m.tagline}_`, "", m.description, ""];
  for (const s of m.lesson) {
    lines.push(`## ${s.heading}`, "");
    for (const p of s.paragraphs) lines.push(p, "");
    if (s.bullets?.length) {
      for (const b of s.bullets) lines.push(`- ${b}`);
      lines.push("");
    }
  }
  lines.push("## Key Points", "");
  for (const k of m.keyPoints) lines.push(`- ${k}`);
  lines.push("");
  return lines.join("\n");
}

function audioPrompt(m) {
  return `This is a lesson from Brett Lechtenberg's Master's Edge Academy for business owners and leaders. Two hosts discuss "${m.title}" as a practical deep dive: what it is, why it matters, how to apply it this week. Stay strictly within the source. Refer to the author as Brett.`;
}

function videoPrompt(m) {
  return `Explainer video for business owners on "${m.title}" from Brett Lechtenberg's Master's Edge Academy. Cover every section of the source in order, end with the key points. Stay strictly within the source.`;
}

function nlm(argv) {
  return execFileSync("notebooklm", argv, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

function nlmJson(argv) {
  const out = nlm(argv);
  try {
    return JSON.parse(out);
  } catch {
    die(`Expected JSON from notebooklm ${argv[0]} ${argv[1] ?? ""}: ${out.slice(0, 300)}`);
  }
}

function run(cmd, argv) {
  const r = spawnSync(cmd, argv, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) die(`${cmd} ${argv.join(" ")} failed`);
}

function rel(p) {
  return path.relative(ROOT, p);
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

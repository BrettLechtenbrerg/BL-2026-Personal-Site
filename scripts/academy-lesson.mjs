#!/usr/bin/env node
//==============================================================================
// Academy Lesson Forge — one lesson.json → a live Master's Edge Academy module.
//
//   node scripts/academy-lesson.mjs <command> …
//
//   init "<Lesson Title>" [--source <file|folder>]…   scaffold ~/Desktop/LMS - <Title>/
//   validate <lesson.json>                             schema + authoring rules; prints the gate summary
//   add      <lesson.json> [--allow-dirty]             write modules.ts + badges.ts (+ new course), copy PDFs, tsc
//   price    <course-id> --usd 99 [--dry-run]          Stripe Product + Price → Vercel env + .env.local
//   produce  <slug> [--only audio,video,flashcards,quiz,narration] [--force]
//   narrate  <slug>                                    lesson → Kokoro (am_michael) → "Read Aloud" audio[]
//   ship     <slug> [--no-deploy]                      tsc, next build, commit, push, vercel --prod, URL check
//   status   <slug | lesson.json>                      what is done / pending / failed
//   run      <lesson.json> [--go | --no-review] [--only …] [--allow-dirty]
//            validate → add → [gate] → price? → produce → ship
//
// Every command is idempotent; progress lives in <project>/.state.json so a
// dead run resumes where it stopped. The project folder is the Desktop folder
// that holds lesson.json (see docs/lms/SKILL.md). Only the CONFIG block below
// is site-specific — clone it for PMMA / TSAI later.
//==============================================================================

import { spawnSync, execFileSync } from "node:child_process";
import {
  readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync, readdirSync, cpSync, appendFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

// modules.ts is plain TS with no imports — Node 22 loads it with type stripping.
if (!process.execArgv.includes("--experimental-strip-types")) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", ...process.argv.slice(1)], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}

//------------------------------------------------------------------------------
// CONFIG — the only site-specific block. Copy + edit for another site.
//------------------------------------------------------------------------------
const ROOT = path.resolve(import.meta.dirname, "..");
const HOME = os.homedir();
const CONFIG = {
  site: "bl",
  siteUrl: "https://brettlechtenberg.com",
  modulePath: (slug) => `/academy/modules/${slug}`,
  repoRoot: ROOT,
  modulesTs: path.join(ROOT, "src/content/academy/modules.ts"),
  badgesTs: path.join(ROOT, "src/content/academy/badges.ts"),
  flashcardsDir: path.join(ROOT, "src/content/academy/flashcards"),
  publicAcademy: path.join(ROOT, "public/academy"),
  envFile: path.join(ROOT, ".env.local"),
  notebooklmScript: path.join(ROOT, "scripts/academy-notebooklm.mjs"),
  installScript: path.join(ROOT, "scripts/academy-install.mjs"),
  narrateScript: path.join(HOME, "dev/audiobook-studio/narrate.sh"),
  narrationVoice: "am_michael",
  narrationLabel: (title) => `Read Aloud: ${title} (narrated lesson)`,
  narrationFile: "read-aloud.m4a",
  gitBranch: "main",
  deployCmd: ["npx", "vercel", "--prod", "--yes"],
  projectsDir: path.join(HOME, "Desktop"),
  projectPrefix: "LMS - ",
  backupsDir: path.join(HOME, "Backups"),
  stripePriceEnvPrefix: "STRIPE_PRICE_",
  stripeProductPrefix: "Master's Edge Academy — ",
  maxPdfMb: 25,
  words: { min: 900, max: 2500 },
};
const PIECES = ["audio", "video", "flashcards", "quiz", "narration"];
const NLM_PIECES = ["audio", "video", "flashcards", "quiz"];
const TEMPLATES_DIR = path.join(ROOT, "docs/lms/templates");
const STOP = new Set("about above after again their there these those which while would could should other where being through before because between under until".split(" "));

//------------------------------------------------------------------------------
// CLI
//------------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flags = { only: null, allowDirty: false, dryRun: false, force: false, go: false, noReview: false, noDeploy: false, usd: null, source: [] };
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--only") flags.only = String(argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  else if (a === "--allow-dirty") flags.allowDirty = true;
  else if (a === "--dry-run") flags.dryRun = true;
  else if (a === "--force") flags.force = true;
  else if (a === "--go") flags.go = true;
  else if (a === "--no-review") flags.noReview = true;
  else if (a === "--no-deploy") flags.noDeploy = true;
  else if (a === "--usd") flags.usd = Number(argv[++i]);
  else if (a === "--source") flags.source.push(String(argv[++i] ?? ""));
  else if (a.startsWith("--")) die(`Unknown flag ${a}`);
  else positional.push(a);
}
const [command, target] = positional;

const commands = { init, validate, add, price, produce, narrate, ship, status, run };
if (!command || !commands[command]) {
  console.error(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 21).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(command ? 1 : 0);
}
await commands[command](target);

//==============================================================================
// init — scaffold the Desktop project folder
//==============================================================================
async function init(title) {
  if (!title) die('Usage: init "<Lesson Title>" [--source <file|folder>]…');
  const dir = path.join(CONFIG.projectsDir, `${CONFIG.projectPrefix}${title.replace(/[/:]/g, "-")}`);
  mkdirSync(path.join(dir, "source"), { recursive: true });
  for (const src of flags.source) {
    const abs = path.resolve(src);
    if (!existsSync(abs)) die(`Source not found: ${src}`);
    if (isDataless(abs)) die(`${src} is an iCloud placeholder (not downloaded). Open it in Finder first, then retry.`);
    cpSync(abs, path.join(dir, "source", path.basename(abs)), { recursive: true });
    console.log(`✓ source → ${rel(path.join(dir, "source", path.basename(abs)), dir)}`);
  }
  const slugGuess = slugify(title);
  const files = {
    "lesson.json": JSON.stringify({
      slug: slugGuess, title, tagline: "", description: "", course: "business-tools", videoUrl: null, pdfs: [],
      keyPoints: ["", "", "", "", ""],
      lesson: [{ heading: "", paragraphs: ["", ""] }],
      quiz: [], badge: { name: "", emoji: "" }, produce: PIECES,
    }, null, 2) + "\n",
    "PROJECT-STATUS.md": template("PROJECT-STATUS.md", { title, slug: slugGuess, dir }),
    "RESUME-PROMPT.md": template("RESUME-PROMPT.md", { title, slug: slugGuess, dir }),
    "FEEDBACK.md": template("FEEDBACK.md", { title, slug: slugGuess, dir }),
  };
  for (const [name, body] of Object.entries(files)) {
    const p = path.join(dir, name);
    if (existsSync(p)) { console.log(`  (kept existing ${name})`); continue; }
    writeFileSync(p, body);
    console.log(`✓ ${name}`);
  }
  saveState(dir, { slug: slugGuess, title, created: today() });
  console.log(`\nProject: ${dir}\nNext: fill lesson.json, then  node scripts/academy-lesson.mjs validate "${path.join(dir, "lesson.json")}"`);
}

//==============================================================================
// validate — schema + authoring rules, fail closed, plain-English errors
//==============================================================================
async function validate(file, { quiet = false } = {}) {
  const { lesson, dir } = loadLesson(file);
  const st = loadState(dir);
  if (st.add?.done && st.slug === lesson.slug) lesson._existing = true; // already inserted by `add`
  const { errors, warnings, stats } = await checkLesson(lesson, dir);
  if (!quiet) {
    for (const w of warnings) console.log(`⚠ ${w}`);
    for (const e of errors) console.log(`✗ ${e}`);
    if (errors.length) { console.log(`\n${errors.length} problem(s) — fix lesson.json and re-run validate.`); process.exit(1); }
    console.log(gateSummary(lesson, stats, await courseTable(), st.add?.done && st.slug === lesson.slug ? st.add : null));
  }
  if (errors.length && quiet) die(`lesson.json has ${errors.length} problem(s) — run: validate "${file}"`);
  return { lesson, dir, stats, warnings };
}

async function checkLesson(L, dir) {
  const errors = [], warnings = [];
  const str = (v) => typeof v === "string" && v.trim().length > 0;
  const arr = (v) => Array.isArray(v);
  const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const modulesSrc = readFileSync(CONFIG.modulesTs, "utf8");
  const { academyModules, academyCourses } = await loadModules();

  if (!str(L.slug) || !SLUG.test(L.slug)) errors.push(`slug: must be lowercase letters, digits and dashes (got ${JSON.stringify(L.slug)})`);
  else if (academyModules.some((m) => m.slug === L.slug) && !L._existing) errors.push(`slug "${L.slug}" is already used by an existing module — pick another.`);
  if (!str(L.title)) errors.push("title: required");
  if (!str(L.tagline)) errors.push("tagline: required (2–4 words, e.g. \"Strategic Thinking\")");
  if (!str(L.description) || L.description.length < 80) errors.push("description: required, at least 80 characters (it is the card blurb).");

  // course
  let courseTitle = null;
  if (typeof L.course === "string") {
    const c = academyCourses.find((c) => c.id === L.course);
    if (!c) errors.push(`course: "${L.course}" does not exist. Use one of ${academyCourses.map((c) => c.id).join(", ")} — or {"new": {…}}.`);
    else courseTitle = c.title;
  } else if (L.course && typeof L.course === "object" && L.course.new) {
    const n = L.course.new;
    if (!str(n.id) || !SLUG.test(n.id)) errors.push("course.new.id: lowercase-dashes id required");
    else if (academyCourses.some((c) => c.id === n.id) && !L._existing) errors.push(`course.new.id "${n.id}" already exists — use course: "${n.id}" instead.`);
    if (!str(n.title)) errors.push("course.new.title: required");
    if (!str(n.emoji)) errors.push("course.new.emoji: required");
    if (!str(n.description) || n.description.length < 40) errors.push("course.new.description: required, at least 40 characters");
    if (typeof n.priceUsd !== "number" || n.priceUsd < 0) errors.push("course.new.priceUsd: number required (0 = free)");
    courseTitle = n.title;
  } else errors.push('course: required — an existing course id or {"new": {"id","title","emoji","description","priceUsd"}}');

  // video
  if (L.videoUrl != null) {
    if (!str(L.videoUrl) || !/^https:\/\/(www\.youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(L.videoUrl)) {
      errors.push("videoUrl: must be an EMBED url (https://www.youtube.com/embed/<id> or https://player.vimeo.com/video/<id>) or null for the placeholder.");
    }
  }

  // pdfs
  const pdfs = L.pdfs ?? [];
  if (!arr(pdfs)) errors.push("pdfs: must be an array");
  else pdfs.forEach((p, i) => {
    if (!str(p?.label)) errors.push(`pdfs[${i}].label: required`);
    if (!str(p?.file)) { errors.push(`pdfs[${i}].file: required`); return; }
    const abs = path.resolve(dir, p.file);
    if (!existsSync(abs)) errors.push(`pdfs[${i}]: file not found: ${p.file}`);
    else {
      if (path.extname(abs).toLowerCase() !== ".pdf") errors.push(`pdfs[${i}]: ${p.file} is not a .pdf`);
      const mb = statSync(abs).size / 1024 / 1024;
      if (mb > CONFIG.maxPdfMb) errors.push(`pdfs[${i}]: ${p.file} is ${mb.toFixed(1)} MB — limit ${CONFIG.maxPdfMb} MB`);
    }
  });

  // key points
  if (!arr(L.keyPoints) || L.keyPoints.length !== 5) errors.push(`keyPoints: exactly 5 required (got ${arr(L.keyPoints) ? L.keyPoints.length : "none"})`);
  else L.keyPoints.forEach((k, i) => { if (!str(k) || k.length < 20) errors.push(`keyPoints[${i}]: too short — a full, specific sentence`); });

  // lesson sections
  let words = 0;
  const lessonText = [];
  if (!arr(L.lesson) || L.lesson.length < 4 || L.lesson.length > 6) errors.push(`lesson: 4–6 sections required (got ${arr(L.lesson) ? L.lesson.length : "none"})`);
  else L.lesson.forEach((s, i) => {
    if (!str(s?.heading)) errors.push(`lesson[${i}].heading: required`);
    if (!arr(s?.paragraphs) || s.paragraphs.length < 2) errors.push(`lesson[${i}] "${s?.heading ?? ""}": at least 2 paragraphs required`);
    else s.paragraphs.forEach((p, j) => { if (!str(p) || p.length < 40) errors.push(`lesson[${i}].paragraphs[${j}]: too short`); else { words += wc(p); lessonText.push(p); } });
    if (s?.bullets != null) {
      if (!arr(s.bullets)) errors.push(`lesson[${i}].bullets: must be an array of strings`);
      else s.bullets.forEach((b) => { if (str(b)) { words += wc(b); lessonText.push(b); } });
    }
  });
  if (arr(L.lesson) && L.lesson.length) {
    if (words < CONFIG.words.min) errors.push(`lesson: ${words} words — needs at least ${CONFIG.words.min} (a real lesson, not a summary)`);
    if (words > CONFIG.words.max) errors.push(`lesson: ${words} words — over the ${CONFIG.words.max} cap (split into two lessons)`);
  }

  // quiz
  const lessonLower = lessonText.join(" ").toLowerCase() + " " + (L.keyPoints ?? []).join(" ").toLowerCase();
  if (!arr(L.quiz) || L.quiz.length !== 10) errors.push(`quiz: exactly 10 questions required (got ${arr(L.quiz) ? L.quiz.length : "none"})`);
  else {
    const seen = new Set();
    L.quiz.forEach((q, i) => {
      const tag = `quiz[${i}]`;
      if (!str(q?.question)) { errors.push(`${tag}.question: required`); return; }
      const norm = q.question.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      if (seen.has(norm)) errors.push(`${tag}: duplicate question "${q.question.slice(0, 60)}"`);
      seen.add(norm);
      if (!arr(q.options) || q.options.length !== 4) errors.push(`${tag}: exactly 4 options required`);
      else {
        q.options.forEach((o, j) => { if (!str(o)) errors.push(`${tag}.options[${j}]: empty`); });
        if (new Set(q.options.map((o) => String(o).trim().toLowerCase())).size !== 4) errors.push(`${tag}: options must be distinct`);
      }
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) errors.push(`${tag}.correctIndex: must be 0–3`);
      if (!str(q.explanation) || q.explanation.length < 20) errors.push(`${tag}.explanation: required (one or two sentences, shown after scoring)`);
      // Heuristic: the correct answer should be findable in the lesson text.
      if (arr(q.options) && Number.isInteger(q.correctIndex) && q.options[q.correctIndex]) {
        const kws = keywords(q.options[q.correctIndex]);
        if (kws.length && !kws.some((k) => lessonLower.includes(k))) {
          warnings.push(`${tag}: the correct answer ("${String(q.options[q.correctIndex]).slice(0, 50)}…") shares no key word with the lesson — make sure the lesson teaches it.`);
        }
      }
    });
    // Answer-position bias: a learner notices when "B" is right seven times.
    const counts = [0, 0, 0, 0];
    for (const qq of L.quiz) if (Number.isInteger(qq?.correctIndex) && qq.correctIndex >= 0 && qq.correctIndex <= 3) counts[qq.correctIndex]++;
    const top = Math.max(...counts);
    if (top > 4) warnings.push(`quiz: correctIndex ${counts.indexOf(top)} is the answer ${top} times out of 10 — reorder options so answers are spread across 0–3.`);
  }

  // leftovers
  const junk = /\[VERIFY\]|\bTODO\b|\bXXX\b|\bTBD\b|lorem ipsum/i;
  walkStrings(L, (s, where) => { if (junk.test(s)) errors.push(`${where}: unfinished marker left in text (${s.match(junk)[0]})`); });

  // badge / produce
  if (L.badge != null) {
    if (!str(L.badge.name) || !str(L.badge.emoji)) errors.push("badge: needs both name and emoji (or remove the badge key to use the default)");
    else if (L.badge.name.length > 30) errors.push("badge.name: keep it under 30 characters");
  }
  if (L.produce != null) {
    if (!arr(L.produce)) errors.push("produce: must be an array");
    else L.produce.forEach((p) => { if (!PIECES.includes(p)) errors.push(`produce: unknown piece "${p}" — choose from ${PIECES.join(", ")}`); });
  }
  const known = ["slug", "title", "tagline", "description", "course", "videoUrl", "pdfs", "keyPoints", "lesson", "quiz", "badge", "produce", "_existing"];
  for (const k of Object.keys(L)) if (!known.includes(k)) warnings.push(`unknown key "${k}" will be ignored`);

  // badge slug clash
  if (!errors.length && str(L.slug) && readFileSync(CONFIG.badgesTs, "utf8").includes(`"${L.slug}":`) && !L._existing) {
    warnings.push(`badges.ts already has an entry for "${L.slug}" — add will keep the existing one.`);
  }

  return { errors, warnings, stats: { words, sections: L.lesson?.length ?? 0, quiz: L.quiz?.length ?? 0, courseTitle, pdfs: pdfs.length, modulesSrcHasSlug: modulesSrc.includes(`slug: "${L.slug}"`) } };
}

function gateSummary(L, stats, courses, added = null) {
  const isNew = typeof L.course === "object";
  const course = isNew ? L.course.new : courses.find((c) => c.id === L.course);
  const maxOrder = courses.reduce((m, c) => Math.max(m, c.toOrder), 0);
  // Before `add`: predict the slot. After: report what was written.
  const order = added ? added.order : isNew ? maxOrder + 1 : course.toOrder + 1;
  const shifted = added ? added.shifted : isNew ? 0 : maxOrder - order + 1;
  const total = added ? maxOrder : maxOrder + 1;
  const produce = L.produce ?? PIECES;
  const nlm = produce.filter((p) => NLM_PIECES.includes(p));
  const badge = L.badge ? `${L.badge.emoji} ${L.badge.name}` : `🎖️ ${L.title} Master (default)`;
  const needs = [];
  if (isNew && course.priceUsd > 0) needs.push(`Stripe price $${course.priceUsd} for "${course.title}" will be created`);
  if (isNew && course.priceUsd === 0) needs.push(`new FREE course "${course.title}"`);
  if (!L.videoUrl) needs.push("YouTube link (placeholder video for now)");
  return [
    `LESSON READY FOR REVIEW — ${L.title} → ${course.title} (module ${order}${shifted ? `; ${order}–${total - 1} renumbered to ${order + 1}–${total}` : ""})`,
    `Key points (5): ${L.keyPoints.map((k) => k.split(/[.:—]/)[0].trim()).join(" · ")}`,
    `Sections (${stats.sections}, ${stats.words} words): ${L.lesson.map((s) => s.heading).join(" · ")}`,
    `Quiz: ${stats.quiz} q   Badge: ${badge}   PDFs: ${stats.pdfs}`,
    `Will produce: ${nlm.length ? `NotebookLM ${nlm.join(" + ")} (uses today's quota)` : "no NotebookLM pieces"}${produce.includes("narration") ? `, narration (${CONFIG.narrationVoice}, ~${Math.max(1, Math.round(stats.words / 330))} min render, ~${Math.max(1, Math.round(stats.words / 126))} min of audio)` : ""}`,
    `Needs from you: ${needs.length ? needs.join("; ") : "none"}`,
    `Note: certification will require ${total} modules.`,
    `Reply "go" (or "go, no video" / edits).`,
  ].join("\n");
}

//==============================================================================
// add — write modules.ts + badges.ts, copy PDFs, tsc
//==============================================================================
async function add(file) {
  const { lesson: L, dir } = await validate(file, { quiet: true });
  const state = loadState(dir);
  if (state.add?.done && !flags.force) {
    console.log(`✓ add already done (module ${state.add.order}) — use --force to redo`);
    return state.add;
  }
  if (!flags.allowDirty) {
    const dirty = git(["status", "--porcelain", "--untracked-files=no", "--", rel(CONFIG.modulesTs), rel(CONFIG.badgesTs)]).trim();
    if (dirty) die(`modules.ts / badges.ts have uncommitted changes:\n${dirty}\nCommit or stash them first (or pass --allow-dirty).`);
  }

  const courses = await courseTable();
  const isNew = typeof L.course === "object";
  const courseId = isNew ? L.course.new.id : L.course;
  const maxOrder = courses.reduce((m, c) => Math.max(m, c.toOrder), 0);
  const order = isNew ? maxOrder + 1 : courses.find((c) => c.id === courseId).toOrder + 1;

  const origModules = readFileSync(CONFIG.modulesTs, "utf8");
  const origBadges = readFileSync(CONFIG.badgesTs, "utf8");
  let src = origModules;

  // 1. Renumber everything at or after the new slot (+1). Data is slug-keyed, so
  //    this is cosmetic ("Module N" labels) — but course ranges must follow.
  let shifted = 0;
  if (order <= maxOrder) {
    const bump = (n) => (n >= order ? n + 1 : n);
    src = src.replace(/^(    order: )(\d+)(,)$/gm, (_, a, n, c) => { if (+n >= order) shifted++; return `${a}${bump(+n)}${c}`; });
    src = src.replace(/PLACEHOLDER_VIDEO\((\d+)\)/g, (_, n) => `PLACEHOLDER_VIDEO(${bump(+n)})`);
    src = src.replace(/^(  \/\/ Module )(\d+)( —)/gm, (_, a, n, c) => `${a}${bump(+n)}${c}`);
    const cStart = src.indexOf("export const academyCourses");
    const cEnd = src.indexOf("\n];", cStart);
    if (cStart === -1 || cEnd === -1) die("add: could not find the academyCourses array in modules.ts");
    let block = src.slice(cStart, cEnd);
    block = block.replace(/^(    fromOrder: )(\d+)(,)$/gm, (_, a, n, c) => `${a}${bump(+n)}${c}`);
    // The target course grows by one (its toOrder == order-1, so bump() leaves it alone).
    block = block.replace(/^(    toOrder: )(\d+)(,)$/gm, (_, a, n, c) => `${a}${+n === order - 1 ? +n + 1 : bump(+n)}${c}`);
    src = src.slice(0, cStart) + block + src.slice(cEnd);
    if (shifted !== maxOrder - order + 1) die(`add: expected to renumber ${maxOrder - order + 1} modules but matched ${shifted} — modules.ts formatting changed; aborting (nothing written).`);
  }

  // 2. New course → append to academyCourses.
  if (isNew) {
    const n = L.course.new;
    const cStart = src.indexOf("export const academyCourses");
    const cEnd = src.indexOf("\n];", cStart);
    const priceEnv = n.priceUsd > 0 ? `${CONFIG.stripePriceEnvPrefix}${n.id.toUpperCase().replace(/-/g, "_")}` : null;
    const entry = [
      "  {",
      `    id: ${q(n.id)},`,
      `    title: ${q(n.title)},`,
      `    emoji: ${q(n.emoji)},`,
      `    description:`,
      `      ${q(n.description)},`,
      `    fromOrder: ${order},`,
      `    toOrder: ${order},`,
      ...(n.cover ? [`    cover: ${q(n.cover)},`] : []),
      ...(priceEnv ? [`    priceEnv: ${q(priceEnv)},`] : []),
      "  },",
    ].join("\n");
    src = src.slice(0, cEnd) + "\n" + entry + src.slice(cEnd);
  }

  // 3. Insert the module. Preferred spot: right after the module with order-1 so
  //    the file reads in sequence; fallback: before the `];` that closes
  //    academyModules (anchored on finalExam). The app sorts by `order` anyway.
  const examIdx = src.indexOf("export const finalExam");
  if (examIdx === -1) die("add: `export const finalExam` anchor not found in modules.ts");
  const closeIdx = src.lastIndexOf("\n];", examIdx);
  const between = src.slice(closeIdx + 3, examIdx);
  if (closeIdx === -1 || !/^[\s/=A-Za-z(),'-]*$/.test(between)) die("add: unexpected text between the end of academyModules and finalExam — aborting.");
  if (src.includes(`slug: ${q(L.slug)}`)) die(`add: slug "${L.slug}" already in modules.ts`);
  let insertAt = closeIdx;
  const prevIdx = src.indexOf(`\n    order: ${order - 1},\n`);
  if (prevIdx !== -1 && prevIdx < closeIdx) {
    const prevEnd = src.indexOf("\n  },\n", prevIdx);
    if (prevEnd !== -1 && prevEnd < closeIdx) insertAt = prevEnd + "\n  },".length;
  }
  src = src.slice(0, insertAt) + "\n" + moduleToTs(L, order) + src.slice(insertAt);

  // 4. Badge.
  let badges = origBadges;
  if (L.badge && !badges.includes(`"${L.slug}":`)) {
    const bStart = badges.indexOf("const moduleBadgeMeta");
    const bEnd = badges.indexOf("\n};", bStart);
    if (bStart === -1 || bEnd === -1) die("add: moduleBadgeMeta not found in badges.ts");
    badges = badges.slice(0, bEnd) + `\n  ${q(L.slug)}: { name: ${q(L.badge.name)}, emoji: ${q(L.badge.emoji)} },` + badges.slice(bEnd);
  }

  // 5. PDFs → public/academy/<slug>/.
  const pdfDir = path.join(CONFIG.publicAcademy, L.slug);
  const copied = [];
  for (const p of L.pdfs ?? []) {
    mkdirSync(pdfDir, { recursive: true });
    const dest = path.join(pdfDir, pdfName(p.file));
    copyFileSync(path.resolve(dir, p.file), dest);
    copied.push(rel(dest));
  }

  // 6. Write, type-check, roll back on failure.
  writeFileSync(CONFIG.modulesTs, src);
  writeFileSync(CONFIG.badgesTs, badges);
  const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, encoding: "utf8" });
  if (tsc.status !== 0) {
    writeFileSync(CONFIG.modulesTs, origModules);
    writeFileSync(CONFIG.badgesTs, origBadges);
    die(`add: tsc failed — modules.ts/badges.ts restored.\n${(tsc.stdout + tsc.stderr).slice(0, 2000)}`);
  }
  // Sanity: the module loads and lands in the right course.
  const { academyModules, courseForModule } = await loadModules();
  const m = academyModules.find((x) => x.slug === L.slug);
  if (!m || courseForModule(m)?.id !== courseId) {
    writeFileSync(CONFIG.modulesTs, origModules);
    writeFileSync(CONFIG.badgesTs, origBadges);
    die(`add: module did not land in course "${courseId}" after insert — restored.`);
  }

  const result = { done: true, order, shifted, courseId, newCourse: isNew ? L.course.new : null, pdfs: copied, at: new Date().toISOString() };
  saveState(dir, { slug: L.slug, title: L.title, add: result });
  updateStatusDoc(dir);
  backup(dir, L.slug);
  console.log(`✓ ${L.title} added as module ${order} in ${courseId}${shifted ? ` (${shifted} later modules renumbered)` : ""}${isNew ? " — new course appended" : ""}`);
  if (L.badge) console.log(`✓ badge ${L.badge.emoji} ${L.badge.name}`);
  for (const c of copied) console.log(`✓ pdf → ${c}`);
  console.log("✓ tsc clean");
  return result;
}

/** Module object as TS source, matching the hand-written style in modules.ts. */
function moduleToTs(L, order) {
  const ind = (n) => "  ".repeat(n);
  const lines = [];
  lines.push(`${ind(1)}//----------------------------------------------------------------------------`);
  lines.push(`${ind(1)}// Module ${order} — ${L.title}`);
  lines.push(`${ind(1)}//----------------------------------------------------------------------------`);
  lines.push(`${ind(1)}{`);
  lines.push(`${ind(2)}slug: ${q(L.slug)},`);
  lines.push(`${ind(2)}order: ${order},`);
  lines.push(`${ind(2)}title: ${q(L.title)},`);
  lines.push(`${ind(2)}tagline: ${q(L.tagline)},`);
  lines.push(`${ind(2)}description:`);
  lines.push(`${ind(3)}${q(L.description)},`);
  lines.push(`${ind(2)}videoUrl: ${L.videoUrl ? q(L.videoUrl) : `PLACEHOLDER_VIDEO(${order})`},`);
  if (L.pdfs?.length) {
    lines.push(`${ind(2)}pdfs: [`);
    for (const p of L.pdfs) lines.push(`${ind(3)}{ label: ${q(p.label)}, href: ${q(`/academy/${L.slug}/${pdfName(p.file)}`)} },`);
    lines.push(`${ind(2)}],`);
  } else lines.push(`${ind(2)}pdfs: [],`);
  lines.push(`${ind(2)}images: [],`);
  lines.push(`${ind(2)}keyPoints: [`);
  for (const k of L.keyPoints) lines.push(`${ind(3)}${q(k)},`);
  lines.push(`${ind(2)}],`);
  lines.push(`${ind(2)}lesson: [`);
  for (const s of L.lesson) {
    lines.push(`${ind(3)}{`);
    lines.push(`${ind(4)}heading: ${q(s.heading)},`);
    lines.push(`${ind(4)}paragraphs: [`);
    for (const p of s.paragraphs) lines.push(`${ind(5)}${q(p)},`);
    lines.push(`${ind(4)}],`);
    if (s.bullets?.length) {
      lines.push(`${ind(4)}bullets: [`);
      for (const b of s.bullets) lines.push(`${ind(5)}${q(b)},`);
      lines.push(`${ind(4)}],`);
    }
    lines.push(`${ind(3)}},`);
  }
  lines.push(`${ind(2)}],`);
  lines.push(`${ind(2)}quiz: [`);
  for (const qq of L.quiz) {
    lines.push(`${ind(3)}{`);
    lines.push(`${ind(4)}question: ${q(qq.question)},`);
    lines.push(`${ind(4)}options: [`);
    for (const o of qq.options) lines.push(`${ind(5)}${q(o)},`);
    lines.push(`${ind(4)}],`);
    lines.push(`${ind(4)}correctIndex: ${qq.correctIndex},`);
    lines.push(`${ind(4)}explanation:`);
    lines.push(`${ind(5)}${q(qq.explanation)},`);
    lines.push(`${ind(3)}},`);
  }
  lines.push(`${ind(2)}],`);
  lines.push(`${ind(1)}},`);
  return lines.join("\n");
}

function pdfName(file) { return path.basename(file).toLowerCase().replace(/[^a-z0-9.-]+/g, "-"); }
function q(s) { return JSON.stringify(String(s)); }

//==============================================================================
// price — Stripe Product + one-time Price → Vercel env + .env.local
//==============================================================================
// Touches money: only runs with an explicit --usd N (typed by Brett), and `run`
// only calls it after the gate. Idempotent: if the env var already exists in
// .env.local the step is skipped. --dry-run prints the plan and exits.
async function price(courseId, { projectDir = null } = {}) {
  if (!courseId || !/^[a-z0-9-]+$/.test(courseId)) die("Usage: price <course-id> --usd 99 [--dry-run]");
  const usd = flags.usd;
  if (!(Number.isFinite(usd) && usd > 0)) die("price: --usd <amount> is required (e.g. --usd 99). Free courses need no price.");
  const courses = await courseTable();
  const course = courses.find((c) => c.id === courseId);
  if (!course) die(`price: course "${courseId}" is not in modules.ts — run add first`);
  const envName = course.priceEnv ?? `${CONFIG.stripePriceEnvPrefix}${courseId.toUpperCase().replace(/-/g, "_")}`;
  const env = readEnvFile();

  if (env[envName] && !flags.force) {
    console.log(`✓ ${envName} already set (${env[envName].slice(0, 14)}…) — skipping. Use --force to create a new price.`);
    const r = { done: true, envName, priceId: env[envName], skipped: "already set" };
    if (projectDir) { saveState(projectDir, { price: r }); updateStatusDoc(projectDir); }
    return r;
  }
  const productName = `${CONFIG.stripeProductPrefix}${course.title}`;
  const plan = [
    `Stripe Product   "${productName}"`,
    `Stripe Price     $${usd.toFixed(2)} USD one-time`,
    `Vercel env       ${envName} (production)`,
    `.env.local       ${envName}=price_…`,
  ];
  if (flags.dryRun) { console.log(`price --dry-run (nothing created):\n  ${plan.join("\n  ")}`); return { dryRun: true, envName }; }

  const key = [REDACTED];
  if (!key) {
    console.log([
      `✗ STRIPE_SECRET_KEY is not in .env.local — create the price by hand:`,
      `  1. dashboard.stripe.com → Products → Add product → "${productName}", one-time $${usd}`,
      `  2. copy the price id (price_…)`,
      `  3. npx vercel env add ${envName} production   (paste the id)`,
      `  4. add ${envName}=price_… to .env.local`,
    ].join("\n"));
    process.exit(1);
  }
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(key);
  const live = key.startsWith("sk_live_");
  console.log(`… creating ${live ? "LIVE" : "test"} Stripe product + price:\n  ${plan.join("\n  ")}`);
  const product = await stripe.products.create({
    name: productName,
    description: course.description,
    metadata: { academy_course: courseId, site: CONFIG.site },
  });
  const priceObj = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(usd * 100),
    currency: "usd",
    metadata: { academy_course: courseId },
  });
  console.log(`✓ ${product.id} / ${priceObj.id}`);

  // Vercel production env (stdin carries the value). Non-fatal: print the manual command on failure.
  const v = spawnSync("npx", ["vercel", "env", "add", envName, "production", "--force"], { cwd: ROOT, input: priceObj.id, encoding: "utf8" });
  if (v.status === 0) console.log(`✓ vercel env ${envName} (production)`);
  else console.warn(`⚠ vercel env add failed — run by hand: npx vercel env add ${envName} production   (value ${priceObj.id})\n${(v.stderr || v.stdout).trim().slice(-300)}`);

  appendFileSync(CONFIG.envFile, `${readFileSync(CONFIG.envFile, "utf8").endsWith("\n") ? "" : "\n"}${envName}=${priceObj.id}\n`);
  console.log(`✓ .env.local ${envName}`);
  const result = { done: true, envName, productId: product.id, priceId: priceObj.id, usd, live, vercel: v.status === 0, at: new Date().toISOString() };
  if (projectDir) { saveState(projectDir, { price: result }); updateStatusDoc(projectDir); }
  return result;
}

function readEnvFile() {
  if (!existsSync(CONFIG.envFile)) return {};
  const out = {};
  for (const line of readFileSync(CONFIG.envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}
//==============================================================================
// produce — NotebookLM pieces (existing script) + narration; per-piece state
//==============================================================================
async function produce(target) {
  const P = await resolveProject(target);
  const wanted = (P.lesson?.produce ?? PIECES).filter((k) => !flags.only || flags.only.includes(k));
  if (flags.only) for (const k of flags.only) if (!PIECES.includes(k)) die(`--only: unknown piece "${k}" (${PIECES.join(", ")})`);
  const state = loadState(P.dir);
  const st = { ...(state.produce ?? {}) };
  const pending = wanted.filter((k) => flags.force || !st[k]?.done);
  if (!pending.length) { console.log(`✓ produce: nothing pending (${wanted.join(", ")} done)`); return st; }
  console.log(`produce ${P.slug}: ${pending.join(", ")}`);

  // NotebookLM pieces — one call, the wrapped script starts them in parallel.
  const nlm = pending.filter((k) => NLM_PIECES.includes(k));
  if (nlm.length) {
    const r = spawnSync("node", [CONFIG.notebooklmScript, P.slug, "--only", nlm.join(",")], { cwd: ROOT, stdio: "inherit" });
    const artefact = {
      audio: path.join(CONFIG.publicAcademy, P.slug, "deep-dive.m4a"),
      video: path.join(CONFIG.publicAcademy, P.slug, "video-overview.mp4"),
      flashcards: path.join(CONFIG.flashcardsDir, `${P.slug}.json`),
      quiz: path.join(ROOT, ".notebooklm", P.slug, "quiz.json"),
    };
    for (const k of nlm) {
      if (existsSync(artefact[k]) && statSync(artefact[k]).mtimeMs > Date.now() - 6 * 3600e3) {
        st[k] = { done: true, file: rel(artefact[k]), at: new Date().toISOString() };
        if (k === "quiz") { copyFileSync(artefact[k], path.join(P.dir, "quiz-draft.json")); st[k].note = "quiz-draft.json in the project folder — NotebookLM's take, never auto-applied"; }
      } else {
        st[k] = { failed: r.status !== 0 ? "notebooklm script failed (not signed in? run: notebooklm login)" : "not generated — daily quota or NotebookLM error; resume later", at: new Date().toISOString() };
      }
      console.log(st[k].done ? `✓ ${k} → ${st[k].file}` : `⚠ ${k}: ${st[k].failed}`);
    }
    saveState(P.dir, { produce: st });
    updateStatusDoc(P.dir);
  }

  if (pending.includes("narration")) {
    try {
      st.narration = await narrate(target, { quiet: true });
    } catch (e) {
      st.narration = { failed: e.message.slice(0, 300), at: new Date().toISOString() };
      console.log(`⚠ narration: ${st.narration.failed}`);
    }
    saveState(P.dir, { produce: st });
    updateStatusDoc(P.dir);
  }
  backup(P.dir, P.slug);
  const done = wanted.filter((k) => st[k]?.done), failed = wanted.filter((k) => st[k]?.failed);
  console.log(`\nproduce: done ${done.join(", ") || "—"}${failed.length ? ` | failed ${failed.join(", ")} (re-run produce to retry)` : ""}`);
  return st;
}

//==============================================================================
// narrate — lesson → markdown → Kokoro (am_michael) → audio[] "Read Aloud"
//==============================================================================
async function narrate(target, { quiet = false } = {}) {
  const P = await resolveProject(target);
  const { academyModules } = await loadModules();
  const mod = academyModules.find((m) => m.slug === P.slug);
  if (!mod) throw new Error(`narrate: "${P.slug}" is not in modules.ts yet — run add first`);
  const href = `/academy/${P.slug}/${CONFIG.narrationFile}`;
  const dest = path.join(CONFIG.publicAcademy, P.slug, CONFIG.narrationFile);
  const modulesSrc = readFileSync(CONFIG.modulesTs, "utf8");
  if (!flags.force && existsSync(dest) && modulesSrc.includes(JSON.stringify(href))) {
    if (!quiet) console.log(`✓ narration already installed (${href}) — use --force to redo`);
    return { done: true, file: rel(dest), at: new Date().toISOString() };
  }
  if (!existsSync(CONFIG.narrateScript)) throw new Error(`narrate.sh not found at ${CONFIG.narrateScript}`);

  const L = P.lesson ?? mod; // prefer lesson.json (source of truth) but modules.ts works too
  const md = narrationMarkdown(L);
  const work = P.dir ?? path.join(ROOT, ".notebooklm", P.slug);
  mkdirSync(work, { recursive: true });
  const mdPath = path.join(work, "narration.md");
  writeFileSync(mdPath, md);
  const tmpOut = path.join(os.tmpdir(), `${P.slug}-${CONFIG.narrationFile}`);
  const words = wc(md);
  console.log(`… narrating ${words} words with ${CONFIG.narrationVoice} (≈${Math.max(1, Math.round(words / 330))} min render)`);
  const r = spawnSync(CONFIG.narrateScript, [mdPath, tmpOut, CONFIG.narrationVoice], { encoding: "utf8" });
  if (r.status !== 0 || !existsSync(tmpOut)) throw new Error(`narrate.sh failed: ${(r.stderr || r.stdout || "").trim().slice(-400)}`);
  // Rename so the installer's basename → read-aloud.m4a.
  const staged = path.join(os.tmpdir(), CONFIG.narrationFile);
  copyFileSync(tmpOut, staged);
  const inst = spawnSync("node", [CONFIG.installScript, P.slug, staged, "--label", CONFIG.narrationLabel(mod.title)], { cwd: ROOT, encoding: "utf8" });
  if (inst.status !== 0) throw new Error(`academy-install failed: ${(inst.stderr || inst.stdout).trim().slice(-400)}`);
  const seconds = Number((spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest], { encoding: "utf8" }).stdout || "0").trim()) | 0;
  const result = { done: true, file: rel(dest), seconds, voice: CONFIG.narrationVoice, at: new Date().toISOString() };
  if (P.dir) { saveState(P.dir, { produce: { ...(loadState(P.dir).produce ?? {}), narration: result } }); updateStatusDoc(P.dir); }
  console.log(`✓ narration → ${result.file} (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}), wired into audio[] as "${CONFIG.narrationLabel(mod.title)}"`);
  return result;
}

/** What the narrator reads: title, each section (heading, paragraphs, bullets), key points. No blurb, no quiz. */
function narrationMarkdown(L) {
  const out = [`# ${L.title}`, ""];
  for (const s of L.lesson) {
    out.push(`## ${s.heading}`, "");
    for (const p of s.paragraphs) out.push(p, "");
    if (s.bullets?.length) { for (const b of s.bullets) out.push(`- ${b}`); out.push(""); }
  }
  out.push("## Key points", "");
  for (const k of L.keyPoints) out.push(`- ${k}`);
  out.push("");
  return out.join("\n");
}
//==============================================================================
// ship — tsc, next build, commit, push, vercel --prod, URL check
//==============================================================================
async function ship(target) {
  const P = await resolveProject(target);
  const state = loadState(P.dir);
  const { academyModules, courseForModule } = await loadModules();
  const mod = academyModules.find((m) => m.slug === P.slug);
  if (!mod) die(`ship: "${P.slug}" is not in modules.ts — run add first`);
  const course = courseForModule(mod);
  const url = `${CONFIG.siteUrl}${CONFIG.modulePath(P.slug)}`;

  if (state.ship?.done && !flags.force) {
    const pendingPaths = changedPaths(P.slug);
    if (!pendingPaths.length) { console.log(`✓ ship already done → ${state.ship.url}`); return state.ship; }
    console.log(`ship: previously shipped, ${pendingPaths.length} file(s) changed since — shipping again`);
  }

  run$("npx", ["tsc", "--noEmit"]);
  run$("npm", ["run", "build"]); // catches runtime content errors the type-check cannot
  console.log("✓ tsc + next build clean");

  const paths = changedPaths(P.slug);
  if (flags.dryRun) {
    console.log(`ship --dry-run — would commit:\n  ${paths.join("\n  ") || "(nothing)"}\n  git commit -m ${q(commitMessage(mod, course, state))}\n  git push origin ${CONFIG.gitBranch}\n  ${CONFIG.deployCmd.join(" ")}\n  check ${url}`);
    return { dryRun: true, url };
  }

  let committed = false;
  if (paths.length) {
    git(["add", "--", ...paths]);
    git(["commit", "-m", commitMessage(mod, course, state)]);
    committed = true;
    console.log(`✓ committed ${paths.length} path(s)`);
    git(["push", "origin", CONFIG.gitBranch]);
    console.log("✓ pushed");
  } else console.log("  (nothing new to commit)");

  let deployed = false;
  if (!flags.noDeploy) {
    run$(CONFIG.deployCmd[0], CONFIG.deployCmd.slice(1));
    deployed = true;
    console.log("✓ deployed");
  }

  // Live check: the module route must exist (200 for members, 307/302 → login otherwise). 404 = not live.
  let httpCode = null;
  if (deployed) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const c = spawnSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", url], { encoding: "utf8" }).stdout.trim();
      httpCode = Number(c);
      if ([200, 302, 307].includes(httpCode)) break;
      await new Promise((r) => setTimeout(r, 10_000));
    }
    if (![200, 302, 307].includes(httpCode)) die(`ship: ${url} answered ${httpCode} after deploy — check Vercel logs.`);
    console.log(`✓ live: ${url} (${httpCode})`);
  }
  const result = { done: true, url, committed, deployed, httpCode, at: new Date().toISOString() };
  saveState(P.dir, { ship: result });
  updateStatusDoc(P.dir);
  backup(P.dir, P.slug);
  return result;
}

function commitMessage(mod, course, state) {
  const bits = [`Academy: add ${mod.title} to ${course?.title ?? "Academy"}`];
  const produced = Object.entries(state.produce ?? {}).filter(([, v]) => v?.done).map(([k]) => k);
  if (produced.length) bits.push(`(${produced.join(", ")})`);
  if (state.add?.shifted) bits.push(`— ${state.add.shifted} later modules renumbered`);
  return bits.join(" ");
}

/** Repo paths this lesson touches that have uncommitted changes. */
function changedPaths(slug) {
  const candidates = [
    rel(CONFIG.modulesTs), rel(CONFIG.badgesTs),
    path.join(rel(CONFIG.publicAcademy), slug), path.join(rel(CONFIG.flashcardsDir), `${slug}.json`),
  ].filter((p) => existsSync(path.join(ROOT, p)));
  const out = git(["status", "--porcelain", "--", ...candidates]).split("\n").filter(Boolean);
  return [...new Set(out.map((l) => l.slice(3).trim().replace(/\/$/, "")))];
}

//==============================================================================
// status
//==============================================================================
async function status(target) {
  const P = await resolveProject(target);
  const s = loadState(P.dir);
  const mark = (v) => (v?.done ? "✅ done" : v?.failed ? `❌ ${v.failed}` : "⬜ pending");
  console.log(`${s.title ?? P.slug} (${P.slug})\nproject: ${P.dir}\n`);
  console.log(`add       ${mark(s.add)}${s.add?.done ? ` — module ${s.add.order} in ${s.add.courseId}` : ""}`);
  console.log(`price     ${s.price ? mark(s.price) + (s.price.priceId ? ` — ${s.price.envName}` : "") : "— n/a"}`);
  const want = P.lesson?.produce ?? PIECES;
  for (const k of PIECES) console.log(`${k.padEnd(10)}${want.includes(k) ? mark(s.produce?.[k]) : "— not requested"}`);
  console.log(`ship      ${mark(s.ship)}${s.ship?.url ? ` — ${s.ship.url}` : ""}`);
  const lj = path.join(P.dir, "lesson.json");
  if (existsSync(lj)) console.log(`\nResume: node scripts/academy-lesson.mjs run "${lj}" --go`);
}

//==============================================================================
// run — validate → add → [gate] → price? → produce → ship
//==============================================================================
// First call (no --go): validate + add, print the gate summary, stop. Nothing
// deployed, nothing spent. Brett replies "go" → second call with --go finishes.
// --no-review does both in one go.
async function run(file) {
  const { lesson: L, dir, stats } = await validate(file, { quiet: true });
  const addRes = await add(file);
  const st = loadState(dir);
  const approved = flags.go || flags.noReview || st.approved;
  if (!approved) {
    console.log("\n" + gateSummary(L, stats, await courseTable(), addRes));
    console.log(`\n(local edits only — nothing deployed or spent)\nContinue:  node scripts/academy-lesson.mjs run "${path.resolve(file)}" --go [--only …]`);
    updateStatusDoc(dir);
    return;
  }
  saveState(dir, { approved: true });

  if (typeof L.course === "object" && L.course.new.priceUsd > 0 && !st.price?.done) {
    flags.usd = L.course.new.priceUsd;
    await price(L.course.new.id, { projectDir: dir });
  }
  await produce(file);
  const shipped = await ship(file);
  console.log("\n" + report(dir, L, shipped));
}

/** Forge-style closing report (<120 words). */
function report(dir, L, shipped) {
  const s = loadState(dir);
  const done = PIECES.filter((k) => s.produce?.[k]?.done);
  const failed = PIECES.filter((k) => s.produce?.[k]?.failed);
  const lines = [
    `SHIPPED — ${L.title} → ${s.add?.courseId} (module ${s.add?.order})`,
    `Live: ${shipped?.url ?? "(not deployed)"}`,
    `Produced: ${done.join(", ") || "nothing"}${s.price?.priceId ? ` · Stripe ${s.price.envName}` : ""}`,
  ];
  if (failed.length) lines.push(`Failed: ${failed.join(", ")} — resume later: Academy: resume ${dir}/`);
  if (!L.videoUrl) lines.push("Video: placeholder — send the YouTube link when filmed.");
  if (s.add?.shifted) lines.push(`Renumbered ${s.add.shifted} later modules; certification now requires every module including this one.`);
  return lines.join("\n");
}

function run$(cmd, args) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) die(`${cmd} ${args.join(" ")} failed`);
}

//==============================================================================
// helpers
//==============================================================================
function loadLesson(file) {
  if (!file) die("lesson.json path required");
  const abs = path.resolve(file);
  if (!existsSync(abs)) die(`Not found: ${file}`);
  let lesson;
  try { lesson = JSON.parse(readFileSync(abs, "utf8")); } catch (e) { die(`lesson.json is not valid JSON: ${e.message}`); }
  return { lesson, dir: path.dirname(abs), file: abs };
}

async function loadModules() {
  return import(CONFIG.modulesTs + `?t=${Date.now()}`);
}
async function courseTable() { return (await loadModules()).academyCourses; }

function template(name, vars) {
  const p = path.join(TEMPLATES_DIR, name);
  let body = existsSync(p) ? readFileSync(p, "utf8") : `# ${name.replace(".md", "")} — <title>\n`;
  return body.replace(/<title>/g, vars.title).replace(/<slug>/g, vars.slug).replace(/<dir>/g, vars.dir).replace(/<date>/g, today());
}

/**
 * Find the project for a slug or a lesson.json path.
 * Looks in the Desktop "LMS - …" folders for a lesson.json (or .state.json) with that slug;
 * falls back to no project folder (state is then kept in .notebooklm/<slug>/).
 */
async function resolveProject(target) {
  if (!target) die("slug or lesson.json path required");
  if (target.endsWith(".json")) {
    const { lesson, dir } = loadLesson(target);
    return { slug: lesson.slug, dir, lesson };
  }
  if (!/^[a-z0-9-]+$/.test(target)) die(`Bad slug "${target}"`);
  if (existsSync(CONFIG.projectsDir)) {
    for (const name of readdirSync(CONFIG.projectsDir)) {
      if (!name.startsWith(CONFIG.projectPrefix)) continue;
      const dir = path.join(CONFIG.projectsDir, name);
      const lj = path.join(dir, "lesson.json");
      try {
        const lesson = existsSync(lj) ? JSON.parse(readFileSync(lj, "utf8")) : null;
        if (lesson?.slug === target || loadState(dir).slug === target) return { slug: target, dir, lesson };
      } catch { /* skip unreadable project */ }
    }
  }
  const fallback = path.join(ROOT, ".notebooklm", target);
  mkdirSync(fallback, { recursive: true });
  return { slug: target, dir: fallback, lesson: null };
}

function git(args, opts = {}) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", ...opts });
  if (r.status !== 0 && !opts.allowFail) die(`git ${args.join(" ")} failed: ${(r.stderr || r.stdout || "").trim()}`);
  return r.stdout ?? "";
}

/** Copy the project folder to ~/Backups/lms-<slug>/<date>/ (iCloud eviction insurance). */
function backup(dir, slug) {
  try {
    const dest = path.join(CONFIG.backupsDir, `lms-${slug}`, today());
    mkdirSync(dest, { recursive: true });
    cpSync(dir, dest, { recursive: true, filter: (s) => !/\/\.DS_Store$/.test(s) });
    console.log(`✓ backup → ${dest}`);
  } catch (e) {
    console.warn(`⚠ backup skipped: ${e.message}`);
  }
}

/** Rewrite the pipeline block in PROJECT-STATUS.md from .state.json. */
function updateStatusDoc(dir, extra = {}) {
  const p = path.join(dir, "PROJECT-STATUS.md");
  if (!existsSync(p)) return;
  const s = loadState(dir);
  const mark = (v) => (v?.done ? "✅" : v?.failed ? `❌ ${v.failed}` : v?.skipped ? "⏭ skipped" : "⬜");
  const lines = [
    "<!-- pipeline:start — rewritten by academy-lesson.mjs; edit outside this block -->",
    `Updated: ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
    "",
    `| Step | State |`,
    `|---|---|`,
    `| add (modules.ts + badges.ts) | ${mark(s.add)}${s.add?.done ? ` module ${s.add.order} in ${s.add.courseId}` : ""} |`,
    `| price (Stripe) | ${s.price ? mark(s.price) + (s.price.priceId ? ` ${s.price.priceId}` : "") : "— (not a new paid course)"} |`,
    ...PIECES.map((k) => `| produce: ${k} | ${mark(s.produce?.[k])} |`),
    `| ship (commit + deploy) | ${mark(s.ship)}${s.ship?.url ? ` ${s.ship.url}` : ""} |`,
    "",
    `Resume: \`node scripts/academy-lesson.mjs run "${path.join(dir, "lesson.json")}" --go\``,
    "<!-- pipeline:end -->",
  ].join("\n");
  let doc = readFileSync(p, "utf8");
  const re = /<!-- pipeline:start[\s\S]*?<!-- pipeline:end -->/;
  doc = re.test(doc) ? doc.replace(re, lines) : doc.trimEnd() + "\n\n## Pipeline\n\n" + lines + "\n";
  writeFileSync(p, doc);
}

function stateFile(dir) { return path.join(dir, ".state.json"); }
function loadState(dir) { const p = stateFile(dir); return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {}; }
function saveState(dir, patch) {
  const s = { ...loadState(dir), ...patch, updated: new Date().toISOString() };
  writeFileSync(stateFile(dir), JSON.stringify(s, null, 2) + "\n");
  return s;
}

function wc(s) { return String(s).trim().split(/\s+/).filter(Boolean).length; }
function keywords(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length >= 5 && !STOP.has(w));
}
function walkStrings(v, fn, where = "") {
  if (typeof v === "string") fn(v, where || "root");
  else if (Array.isArray(v)) v.forEach((x, i) => walkStrings(x, fn, `${where}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkStrings(x, fn, where ? `${where}.${k}` : k);
}
function slugify(s) { return s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60); }
function isDataless(p) {
  const r = spawnSync("ls", ["-lO", p], { encoding: "utf8" });
  return /dataless/.test(r.stdout ?? "");
}
function today() { return new Date().toISOString().slice(0, 10); }
function rel(p, from = ROOT) { return path.relative(from, p); }
function die(msg) { console.error(`✗ ${msg}`); process.exit(1); }

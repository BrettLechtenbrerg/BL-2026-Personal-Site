#!/usr/bin/env node
// Academy lesson video and audio -> the private Cloudflare R2 bucket (docs/ACADEMY.md, "Lesson media on R2").
//   node scripts/academy-media-r2.mjs upload           copy anything new or changed to R2, then check every copy
//   node scripts/academy-media-r2.mjs verify [--deep]  check every copy (size + fingerprint); --deep also downloads each one
//   node scripts/academy-media-r2.mjs build            run by `npm run build`: on Vercel it uploads, checks, then leaves
//                                                      the media out of the deployment; anywhere else it does nothing
// It never deletes anything from R2 and never removes a file on a Mac.
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, readdirSync, realpathSync, rmSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MEDIA_FILE_RE, MEDIA_SLUG_RE, mediaKey, mediaType, presignUrl, r2Config } from "../src/lib/r2-presign.mjs";

const ROOT = realpathSync(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const MEDIA_DIR = path.join(ROOT, "public", "academy");
const MEDIA_ENDING = /\.(mp4|m4a|mp3|mov|webm|wav)$/i;
const mode = process.argv[2] || "";
const deep = process.argv.includes("--deep");

function fail(message) {
  console.error(`\n[academy-media] STOPPED: ${message}`);
  process.exit(1);
}

// On a Mac the keys live in .env.local; only the three R2 lines are read from it.
function config() {
  const env = { ...process.env };
  const file = path.join(ROOT, ".env.local");
  if (!env.R2_ACCESS_KEY_ID && existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^(R2_[A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return r2Config(env);
}

function localMedia() {
  const items = [];
  const odd = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (MEDIA_ENDING.test(entry.name)) {
        const parts = path.relative(MEDIA_DIR, abs).split(path.sep);
        if (parts.length === 2 && MEDIA_SLUG_RE.test(parts[0]) && MEDIA_FILE_RE.test(parts[1])) {
          items.push({ abs, key: mediaKey(parts[0], parts[1]), size: statSync(abs).size, type: mediaType(parts[1]) });
        } else odd.push(path.relative(ROOT, abs));
      }
    }
  };
  if (existsSync(MEDIA_DIR)) walk(MEDIA_DIR);
  // The gate only serves public/academy/<lesson>/<lower-case-name>; anything else would go missing on the live site.
  if (odd.length) fail(`these media files are not at public/academy/<lesson>/<lower-case-name>:\n  ${odd.join("\n  ")}`);
  return items.sort((a, b) => (a.key < b.key ? -1 : 1));
}

const hashFile = (abs, algorithm) => new Promise((resolve, reject) => {
  const hash = createHash(algorithm);
  createReadStream(abs).on("data", (chunk) => hash.update(chunk)).on("end", () => resolve(hash.digest())).on("error", reject);
});

async function call(what, url, init) {
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      const code = ((await res.text()).match(/<Code>([^<]+)<\/Code>/) || [])[1] || "";
      lastError = `${res.status} ${code}`.trim();
      if (res.status < 500 && res.status !== 429) break;
    } catch (err) {
      lastError = err instanceof Error ? (err.cause?.code || err.message) : "network error";
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 2000));
  }
  throw new Error(`${what}: ${lastError}`);
}

async function listRemote(cfg) {
  const remote = new Map();
  const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  let token = "";
  do {
    const query = { "list-type": "2", prefix: "academy/", ...(token ? { "continuation-token": token } : {}) };
    const xml = await (await call("listing the bucket", presignUrl({ config: cfg, query, expiresSeconds: 300 }))).text();
    for (const block of xml.match(/<Contents>[\s\S]*?<\/Contents>/g) || []) {
      const pick = (tag) => unescape((block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)) || [])[1] || "");
      remote.set(pick("Key"), { size: Number(pick("Size")), etag: pick("ETag").replace(/"/g, "").toLowerCase() });
    }
    token = /<IsTruncated>true<\/IsTruncated>/.test(xml) ? unescape((xml.match(/<NextContinuationToken>([^<]+)</) || [])[1] || "") : "";
  } while (token);
  return remote;
}

async function pool(items, size, worker) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) await worker(items[next++]);
  }));
}

const gb = (bytes) => `${(bytes / 1e9).toFixed(2)} GB`;
const matches = (item, remote) => {
  const copy = remote.get(item.key);
  return !!copy && copy.size === item.size && copy.etag === item.md5.toString("hex");
};

async function fingerprint(items) {
  await pool(items, 4, async (item) => { item.md5 = await hashFile(item.abs, "md5"); });
}

async function upload(cfg, items, remote) {
  const todo = items.filter((item) => !matches(item, remote));
  if (!todo.length) return 0;
  console.log(`[academy-media] copying ${todo.length} file(s) to R2 (${gb(todo.reduce((n, i) => n + i.size, 0))})...`);
  let done = 0;
  await pool(todo, 4, async (item) => {
    // R2 refuses the upload if what arrives does not match this fingerprint.
    const headers = { "Content-Type": item.type, "Content-MD5": item.md5.toString("base64") };
    const url = presignUrl({ config: cfg, method: "PUT", key: item.key, headers, expiresSeconds: 3600 });
    await call(`uploading ${item.key}`, url, { method: "PUT", headers, body: await readFile(item.abs) });
    console.log(`  ${String(++done).padStart(3)}/${todo.length}  ${item.key}`);
  });
  return todo.length;
}

// Size + fingerprint as R2 reports them, for every local file. Returns the keys that do not match.
async function check(cfg, items) {
  const remote = await listRemote(cfg);
  const bad = items.filter((item) => !matches(item, remote)).map((item) => item.key);
  const local = new Set(items.map((item) => item.key));
  const extra = [...remote.keys()].filter((key) => !local.has(key));
  console.log(`[academy-media] ${items.length - bad.length} of ${items.length} copies on R2 match the originals (size and fingerprint), ${gb(items.reduce((n, i) => n + i.size, 0))}.`);
  if (extra.length) console.log(`[academy-media] note: ${extra.length} file(s) on R2 have no original here (left alone): ${extra.slice(0, 5).join(", ")}`);
  return bad;
}

async function deepCheck(cfg, items) {
  const bad = [];
  let done = 0;
  await pool(items, 4, async (item) => {
    const res = await call(`downloading ${item.key}`, presignUrl({ config: cfg, key: item.key, expiresSeconds: 3600 }));
    const hash = createHash("sha256");
    for await (const chunk of res.body) hash.update(chunk);
    if (!hash.digest().equals(await hashFile(item.abs, "sha256"))) bad.push(item.key);
    if (++done % 10 === 0 || done === items.length) console.log(`  downloaded and compared ${done}/${items.length}`);
  });
  console.log(`[academy-media] deep check: ${items.length - bad.length} of ${items.length} downloads are identical to the originals.`);
  return bad;
}

// Files are only ever left out inside Vercel's own build machine (Linux), or in a scratch copy under the temp folder
// named by ACADEMY_MEDIA_REHEARSAL_DIR. Never in a real project folder on a Mac.
function mayLeaveOut() {
  if (process.env.VERCEL === "1" && process.platform === "linux") return true;
  const rehearsal = process.env.ACADEMY_MEDIA_REHEARSAL_DIR;
  if (!rehearsal || !existsSync(rehearsal) || realpathSync(rehearsal) !== ROOT) return false;
  const inTemp = [tmpdir(), "/tmp"].some((dir) => ROOT.startsWith(realpathSync(dir) + path.sep));
  return inTemp && !existsSync(path.join(ROOT, ".git"));
}

async function main() {
  if (!["upload", "verify", "build"].includes(mode)) fail("use: upload | verify [--deep] | build");
  if (mode === "build" && !mayLeaveOut()) {
    console.log("[academy-media] not a Vercel build: lesson media stays where it is, nothing to do.");
    return;
  }
  const cfg = config();
  if (!cfg) fail("the R2 keys are missing (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). Nothing was changed.");
  const items = localMedia();
  if (!items.length) {
    if (mode === "build") return console.log("[academy-media] no lesson media in this build, nothing to do.");
    fail("no lesson media found under public/academy.");
  }
  await fingerprint(items);
  if (mode !== "verify") await upload(cfg, items, await listRemote(cfg));
  const bad = await check(cfg, items);
  if (bad.length) fail(`${bad.length} cop${bad.length === 1 ? "y does" : "ies do"} not match:\n  ${bad.join("\n  ")}`);
  if (deep) {
    const differs = await deepCheck(cfg, items);
    if (differs.length) fail(`${differs.length} download(s) differ from the originals:\n  ${differs.join("\n  ")}`);
  }
  if (mode === "build") {
    for (const item of items) rmSync(item.abs);
    console.log(`[academy-media] left ${items.length} lesson media files (${gb(items.reduce((n, i) => n + i.size, 0))}) out of this deployment; members play them from R2.`);
  }
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));

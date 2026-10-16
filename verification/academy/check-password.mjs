// Academy Forge — "Change password" checks against a LOCAL dev server
// (engine-owned, copied by install.sh). Creates a throwaway member
// (academy-check+<random>@example.invalid) straight in the database, runs the
// checks, and deletes the member at the end, whatever happens. No signup, so
// no welcome or business email. Start the server with email OFF so the
// "password changed" notice goes nowhere:
//   RESEND_API_KEY= npx next dev -p 4191 -H 127.0.0.1
//   node verification/academy/check-password.mjs          (BASE=http://127.0.0.1:4191)
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const repo = new URL("../..", import.meta.url).pathname;
const saved = { ...process.env };
require(repo + "node_modules/@next/env").loadEnvConfig(repo, false, { info() {}, error() {} });
const env = { ...process.env };
process.env = saved;
const { createClient } = require(repo + "node_modules/@supabase/supabase-js");
const bcrypt = require(repo + "node_modules/bcryptjs");

const BASE = process.env.BASE || "http://127.0.0.1:4191";
assert.ok(/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE), "only run against a local server");
const srcDir = fs.existsSync(repo + "src/content/academy.config.ts") ? "src/" : "";
const configSrc = fs.readFileSync(repo + srcDir + "content/academy.config.ts", "utf8");
const cookieName = configSrc.match(/"session":\s*\{[^}]*"cookie":\s*"([^"]+)"/)?.[1];
const slug = configSrc.match(/"slug":\s*"([^"]+)"/)?.[1];
assert.ok(cookieName && slug, "session cookie name + slug found in academy.config.ts");
// Same rule as lib/academy-session.ts getSecret() in development.
const secret = env.ACADEMY_SESSION_SECRET?.length >= 32 ? env.ACADEMY_SESSION_SECRET : `${slug}-academy-dev-only-secret-not-for-production`;
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const hmac = (p) => crypto.createHmac("sha256", secret).update(p).digest("hex");
const session = (id, ttl = 600_000) => { const p = `v1.${id}.${Date.now() + ttl}`; return `${p}.${hmac(p)}`; };
const grant = (id, ttl = 600_000) => { const p = `pwreset.v1.${id}.${Date.now() + ttl}`; return `${p}.${hmac(p)}`; };

async function call(method, { sess, grantValue, body, origin } = {}) {
  const cookies = [];
  if (sess) cookies.push(`${cookieName}=${sess}`);
  if (grantValue) cookies.push(`${cookieName}-pwreset=${grantValue}`);
  const res = await fetch(`${BASE}/api/academy/password`, {
    method,
    headers: { "Content-Type": "application/json", ...(cookies.length ? { Cookie: cookies.join("; ") } : {}), ...(origin ? { Origin: origin } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => ({})), setCookie: res.headers.get("set-cookie") || "" };
}
async function login(email, password) {
  const res = await fetch(`${BASE}/api/academy/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  return res.status;
}

const email = `academy-check+${crypto.randomBytes(6).toString("hex")}@example.invalid`;
const startPassword = crypto.randomBytes(12).toString("hex");
const { data: created, error: createError } = await db
  .from("me_users")
  .insert({ name: "Academy Check (temporary)", email, password_hash: await bcrypt.hash(startPassword, 10) })
  .select("id")
  .single();
if (createError) throw createError;
const me = { id: created.id, email };
const otherId = crypto.randomUUID();

try {
  // Not signed in.
  assert.equal((await call("GET")).status, 401);
  assert.equal((await call("POST", { body: { newPassword: "whatever-123" } })).status, 401);

  const sess = session(me.id);
  // Signed in, no email-link grant: old password required.
  assert.equal((await call("GET", { sess })).json.canSkipCurrent, false);
  assert.equal((await call("POST", { sess, body: { newPassword: "short" } })).status, 400, "8 characters minimum");
  assert.equal((await call("POST", { sess, body: { newPassword: "x".repeat(101) } })).status, 400, "100 characters maximum");
  assert.equal((await call("POST", { sess, body: { newPassword: "new-pass-123" } })).status, 400, "no current password");

  // Grants that must NOT count: someone else's, expired, forged, or a session cookie.
  for (const [why, g] of [
    ["another member's grant", grant(otherId)],
    ["expired grant", grant(me.id, -1000)],
    ["bad signature", grant(me.id).slice(0, -2) + "00"],
    ["session cookie used as a grant", session(me.id)],
  ]) {
    assert.equal((await call("GET", { sess, grantValue: g })).json.canSkipCurrent, false, why);
  }
  assert.equal((await call("POST", { sess, grantValue: grant(otherId), body: { newPassword: "new-pass-123" } })).status, 400, "other member's grant can't skip");

  // A grant is not a session.
  assert.equal((await call("GET", { grantValue: grant(me.id) })).status, 401, "grant alone is not a login");

  // Valid grant, but the request comes from another site.
  const g = grant(me.id);
  assert.equal((await call("POST", { sess, grantValue: g, origin: "https://evil.example", body: { newPassword: "new-pass-123" } })).status, 403);

  // Valid grant: new password without the old one; grant cookie cleared.
  assert.equal((await call("GET", { sess, grantValue: g })).json.canSkipCurrent, true);
  const r1 = await call("POST", { sess, grantValue: g, origin: BASE, body: { newPassword: "new-pass-123" } });
  assert.equal(r1.status, 200, JSON.stringify(r1.json));
  assert.match(r1.setCookie, new RegExp(`${cookieName}-pwreset=;`), "grant cookie cleared");
  assert.equal(await login(me.email, "new-pass-123"), 200, "new password logs in");

  // With the old (current) password instead.
  assert.equal((await call("POST", { sess, body: { currentPassword: "new-pass-123", newPassword: "newer-pass-456" } })).status, 200);
  assert.equal(await login(me.email, "newer-pass-456"), 200);
  assert.equal(await login(me.email, "new-pass-123"), 401, "previous password no longer works");

  // Wrong current password: 5 tries per member per 15 minutes (a successful change resets the count).
  const wrong = { sess, body: { currentPassword: "not-it", newPassword: "x-pass-789" } };
  for (let i = 0; i < 5; i++) assert.equal((await call("POST", wrong)).status, 400, `wrong try ${i + 1}`);
  assert.equal((await call("POST", wrong)).status, 429, "sixth wrong try is refused");
  assert.equal(await login(me.email, "newer-pass-456"), 200, "wrong tries changed nothing");
  console.log(`password (${slug}): sign-in required, old password or email-link grant, grant bound to member, cross-site refused, rate limit — OK`);
} finally {
  const { error: deleteError } = await db.from("me_users").delete().eq("id", me.id);
  if (deleteError) console.error(`CLEAN-UP FAILED — delete the temporary member ${email} by hand:`, deleteError.message);
  else console.log("Temporary check member deleted.");
}

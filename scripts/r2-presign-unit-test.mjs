// Unit tests for src/lib/r2-presign.mjs:  node --test scripts/r2-presign-unit-test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { presignUrl, r2Config } from "../src/lib/r2-presign.mjs";

// Amazon's published worked example ("Authenticating Requests: Using Query Parameters", Signature V4).
test("matches Amazon's published example signature", () => {
  const url = presignUrl({
    config: { accessKeyId: "AKIAIOSFODNN7EXAMPLE", secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", host: "examplebucket.s3.amazonaws.com", bucket: "", region: "us-east-1" },
    key: "test.txt", expiresSeconds: 86400, now: new Date("2013-05-24T00:00:00Z"),
  });
  assert.equal(url, "https://examplebucket.s3.amazonaws.com/test.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20130524%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20130524T000000Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404");
});

test("R2 links point at the account's private bucket and never contain the secret", () => {
  const config = r2Config({ R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "b".repeat(32), R2_SECRET_ACCESS_KEY: "c".repeat(64) });
  const url = new URL(presignUrl({ config, key: "academy/fire-yourself/video-overview.mp4", expiresSeconds: 21600 }));
  assert.equal(url.host, "a".repeat(32) + ".r2.cloudflarestorage.com");
  assert.equal(url.pathname, "/bl-academy-media/academy/fire-yourself/video-overview.mp4");
  assert.equal(url.searchParams.get("X-Amz-Expires"), "21600");
  assert.match(url.searchParams.get("X-Amz-Signature"), /^[0-9a-f]{64}$/);
  assert.ok(!url.href.includes("c".repeat(64)));
});

test("signed headers and extra query values are part of the link", () => {
  const config = r2Config({ R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "b".repeat(32), R2_SECRET_ACCESS_KEY: "c".repeat(64) });
  const base = { config, method: "PUT", key: "academy/x/deep-dive.m4a", now: new Date("2026-11-17T00:00:00Z") };
  const a = new URL(presignUrl({ ...base, headers: { "Content-Type": "audio/mp4" } }));
  const b = new URL(presignUrl({ ...base, headers: { "Content-Type": "video/mp4" } }));
  assert.equal(a.searchParams.get("X-Amz-SignedHeaders"), "content-type;host");
  assert.notEqual(a.searchParams.get("X-Amz-Signature"), b.searchParams.get("X-Amz-Signature"));
  const list = new URL(presignUrl({ config, query: { "list-type": "2", prefix: "academy/a b/" } }));
  assert.equal(list.pathname, "/bl-academy-media");
  assert.equal(list.searchParams.get("prefix"), "academy/a b/");
});

test("no keys means no config; bad expiry is refused", () => {
  assert.equal(r2Config({ R2_ACCOUNT_ID: "x" }), null);
  assert.throws(() => presignUrl({ config: null }));
  const config = r2Config({ R2_ACCOUNT_ID: "a", R2_ACCESS_KEY_ID: "b", R2_SECRET_ACCESS_KEY: "c" });
  assert.throws(() => presignUrl({ config, key: "k", expiresSeconds: 604801 }));
});

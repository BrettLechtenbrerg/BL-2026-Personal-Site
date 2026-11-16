// node --test --experimental-strip-types scripts/my-tools-unit-test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS, isUp, checkUrl, checkAll, toolUrls } from '../src/lib/my-tools.ts';

test('a sign-in wall counts as up; errors and no answer count as down', () => {
  for (const c of [200, 204, 301, 307, 401, 403]) assert.equal(isUp(c), true, String(c));
  for (const c of [null, 404, 410, 500, 502, 503]) assert.equal(isUp(c), false, String(c));
});

test('checkUrl reports the status code, and a timeout or network error as down', async () => {
  assert.deepEqual((await checkUrl('https://a.test', async () => ({ status: 200 }))).up, true);
  const down = await checkUrl('https://a.test', async () => ({ status: 404 }));
  assert.equal(down.up, false); assert.equal(down.code, 404);
  const err = await checkUrl('https://a.test', async () => { throw new Error('ECONNREFUSED'); });
  assert.equal(err.up, false); assert.equal(err.code, null);
  const keepAlive = setTimeout(() => {}, 1000); // AbortSignal.timeout's timer doesn't hold the event loop open
  const slow = await checkUrl('https://a.test', (_u, init) => new Promise((_r, reject) => init.signal.addEventListener('abort', () => reject(new Error('timeout')))), 30);
  assert.equal(slow.up, false);
  clearTimeout(keepAlive);
});

test('checkAll only checks the fixed dashboard list, each address once', async () => {
  const seen: string[] = [];
  const out = await checkAll(TOOLS, async (u) => { seen.push(u); return { status: 200 }; });
  assert.deepEqual(seen.sort(), toolUrls().sort());
  assert.equal(new Set(seen).size, seen.length);
  assert.ok(seen.every((u) => u.startsWith('https://')));
  assert.equal(Object.keys(out).length, seen.length);
});

test('all five dashboards are listed, and no sign-in code ships in the page', () => {
  assert.deepEqual(TOOLS.map((t) => t.id), ['speakers-edge', 'launch-portal', 'visibility-edge', 'book-studio', 'audiobook-studio']);
  assert.ok(!JSON.stringify(TOOLS).includes('EDGE-2026'));
});

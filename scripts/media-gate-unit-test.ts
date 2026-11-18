// Unit tests for src/lib/media-gate.ts:  node --test --experimental-strip-types scripts/media-gate-unit-test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { mediaGate, MEDIA_LINK_SECONDS, type MediaLesson } from '../src/lib/media-gate.ts';
import { r2Config } from '../src/lib/r2-presign.mjs';
import { academyCourses, academyModules, courseForModule, getModule } from '../src/content/academy/modules.ts';

const config = r2Config({ R2_ACCOUNT_ID: 'a'.repeat(32), R2_ACCESS_KEY_ID: 'b'.repeat(32), R2_SECRET_ACCESS_KEY: 'c'.repeat(64) });
const lessons: Record<string, MediaLesson> = {
  'fire-yourself': { courseId: 'business-tools', hrefs: ['/academy/fire-yourself/video-overview.mp4', '/academy/fire-yourself/deep-dive.m4a'] },
};
const USER = '11111111-2222-3333-4444-555555555555';
let ownedCalls = 0;
const gate = (over: Partial<Parameters<typeof mediaGate>[0]> = {}, owned: string[] = ['business-tools']) =>
  mediaGate({
    slug: 'fire-yourself', file: 'video-overview.mp4', userId: USER, config,
    findLesson: (slug) => lessons[slug],
    ownedCourses: async () => { ownedCalls++; return new Set(owned); },
    ...over,
  });

test('signed out: 401, and nothing is looked up', async () => {
  ownedCalls = 0;
  for (const file of ['video-overview.mp4', 'nope.mp4']) {
    const r = await gate({ userId: null, file });
    assert.equal(r.status, 401);
  }
  assert.equal(ownedCalls, 0);
});

test('signed in without the course: 403, no link', async () => {
  const r = await gate({}, ['reclaiming-the-clock']);
  assert.equal(r.status, 403);
  assert.ok(!('location' in r));
});

test('signed in with the course: sent to an expiring link on the private bucket', async () => {
  const r = await gate({ file: 'deep-dive.m4a' });
  assert.equal(r.status, 302);
  const url = new URL((r as { location: string }).location);
  assert.equal(url.host, 'a'.repeat(32) + '.r2.cloudflarestorage.com');
  assert.equal(url.pathname, '/bl-academy-media/academy/fire-yourself/deep-dive.m4a');
  assert.equal(url.searchParams.get('X-Amz-Expires'), String(MEDIA_LINK_SECONDS));
  assert.match(url.searchParams.get('X-Amz-Signature') ?? '', /^[0-9a-f]{64}$/);
});

test('unknown lesson or file: 404', async () => {
  const cases: [string, string][] = [
    ['fire-yourself', 'other.mp4'], ['no-such-lesson', 'video-overview.mp4'], ['fire-yourself', 'workbook.pdf'],
    ['..', 'video-overview.mp4'], ['fire-yourself', '../ideal-week/video-overview.mp4'], ['Fire-Yourself', 'video-overview.mp4'],
    ['fire-yourself', 'video-overview.mp4/'], ['fire-yourself', ''],
  ];
  for (const [slug, file] of cases) assert.equal((await gate({ slug, file })).status, 404, `${slug}/${file}`);
});

test('R2 keys missing: 503 for an owner, never a broken link', async () => {
  assert.equal((await gate({ config: null })).status, 503);
});

test('the link is the same all hour and changes the next hour', async () => {
  const at = async (iso: string) => ((await gate({ now: new Date(iso) })) as { location: string }).location;
  assert.equal(await at('2026-11-18T15:00:01Z'), await at('2026-11-18T15:59:59Z'));
  assert.notEqual(await at('2026-11-18T15:59:59Z'), await at('2026-11-18T16:00:00Z'));
  assert.match(await at('2026-11-18T15:40:00Z'), /X-Amz-Date=20261118T150000Z/);
});

// The real lesson list: every video and audio file a lesson points at opens for an owner and for nobody else.
test('every lesson media file in modules.ts is gated by its own course', async () => {
  const findLesson = (slug: string): MediaLesson | undefined => {
    const m = getModule(slug);
    const course = m && courseForModule(m);
    if (!m || !course) return undefined;
    return { courseId: course.id, hrefs: [...(m.audio ?? []), ...(m.videoFiles ?? [])].map((t) => t.href) };
  };
  const allCourses = academyCourses.map((c) => c.id);
  let count = 0;
  for (const m of academyModules) {
    const course = courseForModule(m)!;
    for (const { href } of [...(m.audio ?? []), ...(m.videoFiles ?? [])]) {
      const [, , slug, file] = href.split('/');
      assert.equal(slug, m.slug, href);
      assert.ok(existsSync(path.join(import.meta.dirname, '..', 'public', href)), `missing on disk: ${href}`);
      const mine = await mediaGate({ slug, file, userId: USER, config, findLesson, ownedCourses: async () => new Set([course.id]) });
      assert.equal(mine.status, 302, href);
      const others = await mediaGate({ slug, file, userId: USER, config, findLesson, ownedCourses: async () => new Set(allCourses.filter((id) => id !== course.id)) });
      assert.equal(others.status, 403, href);
      count++;
    }
  }
  // Nothing on disk is left out of the lesson list (it would be on R2 with no way to play it).
  const academyDir = path.join(import.meta.dirname, '..', 'public', 'academy');
  const onDisk = readdirSync(academyDir, { recursive: true }).filter((f) => /\.(mp4|m4a|mp3|mov|webm|wav)$/i.test(String(f))).length;
  assert.equal(count, onDisk);
});

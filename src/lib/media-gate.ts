// Who may play a lesson's video or audio. The files sit in a private Cloudflare R2 bucket; a member who is signed in
// and owns the lesson's course gets a link to the file that stops working after a few hours.
// Used by src/app/api/media/academy/[slug]/[file]/route.ts. Kept free of Next imports so it can be unit-tested.
import { MEDIA_FILE_RE, MEDIA_SLUG_RE, mediaKey, presignUrl } from "./r2-presign.mjs";

export const MEDIA_LINK_SECONDS = 6 * 60 * 60;
const HOUR_MS = 60 * 60 * 1000;

export interface MediaLesson {
  courseId: string;
  /** The lesson's own media addresses, e.g. /academy/fire-yourself/video-overview.mp4 */
  hrefs: string[];
}

export type MediaGateResult =
  | { status: 302; location: string }
  | { status: 401 | 403 | 404 | 503; error: string };

export async function mediaGate(input: {
  slug: string;
  file: string;
  userId: string | null;
  findLesson: (slug: string) => MediaLesson | undefined;
  ownedCourses: (userId: string) => Promise<Set<string>>;
  config: ReturnType<typeof import("./r2-presign.mjs").r2Config>;
  now?: Date;
}): Promise<MediaGateResult> {
  const { slug, file, userId } = input;
  if (!userId) return { status: 401, error: "Not signed in. Please log in to the academy to play this lesson." };
  if (!MEDIA_SLUG_RE.test(slug) || !MEDIA_FILE_RE.test(file)) return { status: 404, error: "No such lesson file." };

  const lesson = input.findLesson(slug);
  if (!lesson || !lesson.hrefs.includes(`/academy/${slug}/${file}`)) return { status: 404, error: "No such lesson file." };

  const owned = await input.ownedCourses(userId);
  if (!owned.has(lesson.courseId)) return { status: 403, error: "This lesson is part of a course you have not unlocked yet." };

  if (!input.config) return { status: 503, error: "Lesson media is not set up yet (R2 keys missing)." };

  // Signed from the top of the hour, so every request in that hour gets the same link (players ask again on each skip).
  const now = new Date(Math.floor((input.now ?? new Date()).getTime() / HOUR_MS) * HOUR_MS);
  return { status: 302, location: presignUrl({ config: input.config, key: mediaKey(slug, file), expiresSeconds: MEDIA_LINK_SECONDS, now }) };
}

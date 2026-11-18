//==============================================================================
// Lesson media gate (site-owned): /academy/<lesson>/<file>.mp4|.m4a
//==============================================================================
// On Vercel the lesson video and audio are not in the deployment (they live in
// a private Cloudflare R2 bucket), so next.config.ts sends those addresses
// here. Signed in and owns the course -> redirect to a link that expires.
// Otherwise 401 / 403. See docs/ACADEMY.md, "Lesson media on R2".
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { getOwnedCourses } from "@/lib/academy-access";
import { courseForModule, getModule } from "@/content/academy/modules";
import { mediaGate, type MediaLesson } from "@/lib/media-gate";
import { r2Config } from "@/lib/r2-presign.mjs";

const NO_STORE = { "Cache-Control": "private, no-store" };

function findLesson(slug: string): MediaLesson | undefined {
  const m = getModule(slug);
  const course = m && courseForModule(m);
  if (!m || !course) return undefined;
  return { courseId: course.id, hrefs: [...(m.audio ?? []), ...(m.videoFiles ?? [])].map((t) => t.href) };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) {
    auth.headers.set("Cache-Control", NO_STORE["Cache-Control"]);
    return auth;
  }
  const { slug, file } = await params;
  const result = await mediaGate({ slug, file, userId: auth, findLesson, ownedCourses: getOwnedCourses, config: r2Config() });
  if (result.status === 302) return new NextResponse(null, { status: 302, headers: { Location: result.location, ...NO_STORE } });
  return NextResponse.json({ error: result.error }, { status: result.status, headers: NO_STORE });
}

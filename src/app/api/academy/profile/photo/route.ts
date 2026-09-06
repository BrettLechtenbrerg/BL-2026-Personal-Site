//==============================================================================
// ACADEMY — Profile photo. Member-only, own row only.
// POST   multipart/form-data { file }  → stores in the public `academy-avatars`
//        bucket as <userId>.<ext>, sets me_users.photo_url, returns { photoUrl }.
// DELETE → removes the object and clears photo_url.
// The browser downsizes to a 256px JPEG first; the server still sniffs magic
// bytes and caps size so a raw client can't push arbitrary files.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db } from "@/lib/academy-db";

const BUCKET = "academy-avatars";
const MAX_BYTES = 2 * 1024 * 1024;

/** Detect image type from magic bytes — never trust the client's MIME. */
function sniff(bytes: Uint8Array): { mime: string; ext: string } | null {
  const [a, b, c, d] = bytes;
  if (a === 0xff && b === 0xd8 && c === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (a === 0x89 && b === 0x50 && c === 0x4e && d === 0x47) return { mime: "image/png", ext: "png" };
  const riff = a === 0x52 && b === 0x49 && c === 0x46 && d === 0x46;
  const webp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (riff && webp) return { mime: "image/webp", ext: "webp" };
  return null;
}

const EXTS = ["jpg", "png", "webp"];

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 2 MB." }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images." }, { status: 400 });
  }

  const supabase = db();
  const path = `${auth}.${kind.ext}`;
  // Drop stale variants so a PNG→JPEG re-upload doesn't leave an orphan.
  await supabase.storage.from(BUCKET).remove(EXTS.filter((e) => e !== kind.ext).map((e) => `${auth}.${e}`));
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: kind.mime, upsert: true, cacheControl: "3600" });
  if (upErr) {
    console.error("[profile/photo] upload failed:", upErr.message);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }

  // Version query busts the CDN cache after a replace.
  const photoUrl = `${supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await supabase.from("me_users").update({ photo_url: photoUrl }).eq("id", auth);
  if (dbErr) return NextResponse.json({ error: "Could not save photo." }, { status: 500 });
  return NextResponse.json({ photoUrl });
}

export async function DELETE() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  await supabase.storage.from(BUCKET).remove(EXTS.map((e) => `${auth}.${e}`));
  const { error } = await supabase.from("me_users").update({ photo_url: null }).eq("id", auth);
  if (error) return NextResponse.json({ error: "Could not remove photo." }, { status: 500 });
  return NextResponse.json({ success: true });
}

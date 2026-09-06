//==============================================================================
// ACADEMY — Events API (office hours, live calls) — members only
//==============================================================================
// GET    → all events from 90 days ago onward, soonest first.
// POST   { title, description?, startsAt, endsAt, link? } → create (admin only)
// PATCH  { id, recordingUrl }  → attach a recording after the call (admin only)
// DELETE { id }                → remove (admin only)
// Links must be http(s) — rendered as plain <a href> client-side.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getUserById } from "@/lib/academy-db";

const UUID_RE = /^[0-9a-f-]{36}$/i;
const MAX_TITLE = 120;
const MAX_DESC = 2000;

function httpUrl(value: unknown): string | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString().slice(0, 500) : null;
  } catch {
    return null;
  }
}

function isoDate(value: unknown): string | null {
  const d = new Date(String(value ?? ""));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

async function requireAdmin(): Promise<NextResponse | string> {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;
  if ((await getUserById(auth))?.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }
  return auth;
}

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await db()
    .from("me_events")
    .select("id, title, description, starts_at, ends_at, link, recording_url")
    .gte("ends_at", since)
    .order("starts_at", { ascending: true });
  return NextResponse.json({ events: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const p = await request.json().catch(() => ({}));
  const title = String(p?.title ?? "").trim().slice(0, MAX_TITLE);
  const description = String(p?.description ?? "").trim().slice(0, MAX_DESC) || null;
  const startsAt = isoDate(p?.startsAt);
  const endsAt = isoDate(p?.endsAt);
  const link = httpUrl(p?.link);
  if (p?.link && !link) {
    return NextResponse.json({ error: "Link must be a full http(s) URL." }, { status: 400 });
  }
  if (!title || !startsAt || !endsAt || endsAt <= startsAt) {
    return NextResponse.json({ error: "Title, start and end (after start) are required." }, { status: 400 });
  }

  const { error } = await db()
    .from("me_events")
    .insert({ title, description, starts_at: startsAt, ends_at: endsAt, link });
  if (error) return NextResponse.json({ error: "Could not create event." }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const p = await request.json().catch(() => ({}));
  const id = String(p?.id ?? "");
  const recordingUrl = httpUrl(p?.recordingUrl);
  if (!UUID_RE.test(id) || (p?.recordingUrl && !recordingUrl)) {
    return NextResponse.json({ error: "Invalid recording link." }, { status: 400 });
  }
  const { error } = await db().from("me_events").update({ recording_url: recordingUrl }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update event." }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const p = await request.json().catch(() => ({}));
  const id = String(p?.id ?? "");
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  const { error } = await db().from("me_events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete event." }, { status: 500 });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import {
  checkBotSignals,
  rejectBot,
  HONEYPOT_FIELD,
  ELAPSED_FIELD,
} from "@/lib/bot-protection";

// These three forms used to post straight from the browser to GoHighLevel, so
// nothing checked them (10 Nov 2026). They now pass the bot gate and spam
// filter here first; the body is forwarded unchanged, so the GHL workflows
// see the same fields as before.
const WEBHOOKS: Record<string, string> = {
  ebook:
    process.env.GHL_EBOOK_WEBHOOK_URL ||
    "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/6b344d66-7b41-4533-a8e1-e747a3da3143",
  "book-brett":
    process.env.GHL_BOOK_BRETT_WEBHOOK_URL ||
    "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/d9dd43d9-b424-44bd-b7ec-409bd33163db",
  "masters-edge-apply":
    process.env.GHL_APPLY_WEBHOOK_URL ||
    "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/035c7c0c-d9c7-47d5-ae85-4d0e6855d23e",
};

const MAX_BODY_CHARS = 20_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const verdict = checkBotSignals(request, body);
  if (!verdict.ok) return rejectBot(verdict);

  const form = typeof body.form === "string" ? body.form : "";
  if (!Object.hasOwn(WEBHOOKS, form)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 400 });
  }
  if (typeof body.email !== "string" || !EMAIL_RE.test(body.email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const payload = { ...body };
  delete payload.form;
  delete payload[HONEYPOT_FIELD];
  delete payload[ELAPSED_FIELD];
  const json = JSON.stringify(payload);
  if (json.length > MAX_BODY_CHARS) {
    return NextResponse.json({ error: "That is too long to send." }, { status: 413 });
  }

  try {
    const ghl = await fetch(WEBHOOKS[form], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    if (!ghl.ok) {
      console.error(`[ghl-form] ${form} webhook failed:`, ghl.status);
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error(`[ghl-form] ${form} webhook error:`, error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

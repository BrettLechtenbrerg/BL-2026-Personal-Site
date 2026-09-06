//==============================================================================
// CRM — one-click unsubscribe
//==============================================================================
// GET  /api/unsubscribe?token=…   (link in the email footer)
// POST /api/unsubscribe?token=…   (RFC 8058 List-Unsubscribe-Post, mail clients)
// Token = HMAC(contact_id) minted by sendMessage(); no PII in the URL, can't
// be forged for another contact. Idempotent.
//==============================================================================

import { NextResponse } from "next/server";
import { setMarketingConsent, verifyUnsubscribeToken } from "@/lib/messaging/consent";

export const dynamic = "force-dynamic";

async function handle(request: Request, html: boolean) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  let contactId: string | null = null;
  try {
    contactId = token ? verifyUnsubscribeToken(token) : null;
  } catch (err) {
    console.error("[unsubscribe] misconfigured:", err);
  }
  if (!contactId) {
    return html
      ? new NextResponse(page("That unsubscribe link isn't valid."), { status: 400, headers: HTML })
      : NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }
  try {
    await setMarketingConsent({ contactId, channel: "email", granted: false, source: "unsubscribe_link" });
  } catch (err) {
    console.error("[unsubscribe] failed:", err);
    return html
      ? new NextResponse(page("Something went wrong — please try again."), { status: 500, headers: HTML })
      : NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
  return html
    ? new NextResponse(page("You're unsubscribed. You won't get marketing emails from Brett."), { headers: HTML })
    : NextResponse.json({ ok: true });
}

export const GET = (r: Request) => handle(r, true);
export const POST = (r: Request) => handle(r, false);

const HTML = { "Content-Type": "text/html; charset=utf-8" };
const page = (msg: string) =>
  `<!doctype html><meta name="viewport" content="width=device-width"><body style="font-family:system-ui;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#222"><h1 style="font-size:1.25rem">Brett Lechtenberg</h1><p>${msg}</p></body>`;

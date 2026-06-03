import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// THE MASTER'S EDGE — WORKBOOK LEAD CAPTURE (GoHighLevel)
// ============================================================================
// Mirrors the TSAI /api/workshop-lead pattern: fire a GHL inbound webhook on
// "started" (participant enters name/email) and "completed" (participant
// exports/emails their workbook).
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │  TODO — BRETT: GHL WORKFLOW + AUTOMATION NOT BUILT YET                  │
// │                                                                        │
// │  This route is wired and live but currently has NO destination URLs.   │
// │  To finish the integration, do BOTH of these later:                    │
// │                                                                        │
// │  1. In GoHighLevel, create two Workflows, each starting with an        │
// │     "Inbound Webhook" trigger:                                         │
// │       • "Master's Edge Workbook — Started"                             │
// │       • "Master's Edge Workbook — Completed"                           │
// │     Build the email/tag/pipeline automation inside each workflow.      │
// │                                                                        │
// │  2. Copy each workflow's inbound webhook URL into Vercel env vars      │
// │     (Project → Settings → Environment Variables), then redeploy:       │
// │       GHL_WORKBOOK_STARTED_URL   = https://services.leadconnectorhq... │
// │       GHL_WORKBOOK_COMPLETED_URL = https://services.leadconnectorhq... │
// │                                                                        │
// │  Until those env vars are set, lead events are accepted and logged     │
// │  but NOT forwarded (the page never breaks — webhook is fire-and-forget)│
// └──────────────────────────────────────────────────────────────────────┘

const GHL_STARTED_URL = process.env.GHL_WORKBOOK_STARTED_URL;
const GHL_COMPLETED_URL = process.env.GHL_WORKBOOK_COMPLETED_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const webhookUrl =
      body.event === "completed" ? GHL_COMPLETED_URL : GHL_STARTED_URL;

    // TODO(Brett): remove this guard once the GHL env vars are configured.
    if (!webhookUrl) {
      console.warn(
        `[workbook-lead] GHL webhook URL not configured for event "${body.event}". ` +
          `Lead accepted but NOT forwarded. Set GHL_WORKBOOK_STARTED_URL / GHL_WORKBOOK_COMPLETED_URL in Vercel.`
      );
      return NextResponse.json({ success: true, forwarded: false });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("[workbook-lead] GHL webhook failed:", response.status);
      return NextResponse.json(
        { error: "Webhook failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, forwarded: true });
  } catch (error) {
    console.error("[workbook-lead] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

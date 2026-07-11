import { NextRequest, NextResponse } from "next/server";
import { checkBotSignals, rejectBot } from "@/lib/bot-protection";

// Lead API for the Rockstar Team diagnostic quiz (book lead magnet).
// Set GHL_TEAM_WEBHOOK_URL to a GoHighLevel inbound webhook whose workflow:
//   1. creates/updates the contact and tags it with `gapTag`,
//   2. emails the lead the book download link (bookUrl),
//   3. notifies Brett with the diagnosis.
// Until it is set, leads are logged server-side so nothing is lost.
const GHL_TEAM_WEBHOOK_URL = process.env.GHL_TEAM_WEBHOOK_URL;

const BOOK_URL =
  "https://www.brettlechtenberg.com/books/how-to-build-a-rockstar-team.pdf";

const GAP_NAMES: Record<string, string> = {
  "gap-recognition": "Gap #1: The Recognition Gap (Treat Them Like Rockstars)",
  "gap-connection": "Gap #2: The Connection Gap (Make Them Feel Like Family)",
  "gap-ownership": "Gap #3: The Ownership Gap (Ownership & Control)",
  "gap-feedback": "Gap #4: The Feedback Gap (Feedback & Investing in Progress)",
  "gap-vision": "Gap #5: The Vision Gap (Communicate the Vision)",
  "gap-hiring": "Gap #6: The Hiring Gap (Hiring a Great Team)",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const verdict = checkBotSignals(request, body);
    if (!verdict.ok) return rejectBot(verdict);

    const { name, email, topGap, scores, answers } = body as {
      name?: string;
      email?: string;
      topGap?: string;
      scores?: Record<string, number>;
      answers?: Record<string, string>;
    };

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!topGap || !GAP_NAMES[topGap]) {
      return NextResponse.json(
        { error: "Missing quiz result." },
        { status: 400 }
      );
    }

    // Readable summary for the notification email.
    const scoreLines = scores
      ? Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .map(([gap, score]) => `${GAP_NAMES[gap] ?? gap}: ${score}`)
          .join("\n")
      : "";
    const answerLines = answers
      ? Object.entries(answers)
          .map(([q, a]) => `${q}: ${a}`)
          .join("\n")
      : "";

    const payload = {
      // Primary fields (GHL contact field names)
      email,
      firstName: name,
      // Backup field names for compatibility
      name,
      contactEmail: email,
      first_name: name,
      // Diagnosis
      topGap,
      gapName: GAP_NAMES[topGap],
      gapTag: topGap, // e.g. "gap-vision" — use as the contact tag in GHL
      gapScores: scoreLines,
      gapAnswers: answerLines,
      // Book delivery link for the workflow email
      bookUrl: BOOK_URL,
      // Metadata
      quizType: "rockstar-team",
      source: "rockstar-team-quiz",
      timestamp: new Date().toISOString(),
    };

    if (!GHL_TEAM_WEBHOOK_URL) {
      console.log("[team-lead] (no webhook configured) new lead:\n", payload);
      return NextResponse.json({ success: true, delivered: "logged" });
    }

    const ghlResponse = await fetch(GHL_TEAM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!ghlResponse.ok) {
      console.error(
        "GHL team webhook error:",
        ghlResponse.status,
        await ghlResponse.text()
      );
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, delivered: "webhook" });
  } catch (error) {
    console.error("Team lead error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

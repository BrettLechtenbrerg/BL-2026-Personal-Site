import type { Metadata } from "next";

// HIDDEN COURSE — same mechanism as the TSAI workshops:
// noindex + not in sitemap.ts + not linked in the Header nav.
// The unlinked URL (/masters-edge/workbook) is shared directly with participants.
export const metadata: Metadata = {
  title: "The Master's Edge — Participant Workbook | Brett Lechtenberg",
  description:
    "Interactive participant workbook for The Master's Edge: Four Weeks to Peak Performance. Complete every activity on any device — laptop, tablet, or phone.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "The Master's Edge — Participant Workbook",
    description:
      "Four Weeks to Peak Performance. Clarify. Simplify. Maximize. Complete your activities on any device.",
    url: "https://www.brettlechtenberg.com/masters-edge/workbook",
  },
};

export default function WorkbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

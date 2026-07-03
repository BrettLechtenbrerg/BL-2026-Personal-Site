import type { Metadata } from "next";

// HIDDEN DRAFT PAGE — Speaking Page v3 (Best of v1 + v2 + Juan Diego video).
// noindex + not in sitemap.ts + not linked in the Header nav.
// Side-by-side review draft; live page remains /speaking untouched.
// Promote by moving this content to /speaking, then delete this route.
export const metadata: Metadata = {
  title: {
    absolute: "Keynote Speaker & Corporate Trainer | Brett Lechtenberg",
  },
  description:
    "Science-backed keynotes and corporate training in peak performance, leadership, ethical sales, and people-first AI — built on The Master's Edge methodology.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SpeakingV3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

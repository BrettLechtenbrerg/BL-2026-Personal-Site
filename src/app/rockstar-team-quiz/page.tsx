// ROCKSTAR TEAM QUIZ, "Horizon" page top (Group 4, 31 Oct 2026). Words unchanged (tag pre-horizon-inner-2026-10-30).
// The quiz itself (src/components/RockstarTeamQuiz.tsx: questions, scoring, results, lead form, /api/team-lead) is untouched.
// Top photo: Brett with the America First Credit Union team (speaking-gallery), lightly smoothed so it loads fast on phones.
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { HorizonPage, PageHero } from "@/components/horizon/kit";
import RockstarTeamQuiz from "@/components/RockstarTeamQuiz";

export const metadata: Metadata = {
  title: "Rockstar Team Quiz | Brett Lechtenberg",
  description:
    "6 quick questions to diagnose the #1 gap between you and a rockstar team, and get the complete 'How To Build A Rockstar Team' book free.",
  alternates: {
    canonical: "https://www.brettlechtenberg.com/rockstar-team-quiz",
  },
  openGraph: {
    title: "What's the #1 gap between you and a rockstar team?",
    description:
      "Take the free 2-minute diagnostic and get Brett Lechtenberg's 'How To Build A Rockstar Team' book free.",
    url: "https://www.brettlechtenberg.com/rockstar-team-quiz",
  },
};

export default function RockstarTeamQuizPage() {
  return (
    <>
      <Header />
      <main id="main">
        <HorizonPage>
          <PageHero
            id="quiz-title"
            eyebrow="Free 2-Minute Diagnostic"
            lines={[<>Build a <em>Rockstar Team</em>, Not a</>, "Revolving Door"]}
            lede="After 30 years of building teams through the toughest economies, Brett distilled team-building into 15 strategies. This quiz finds the ONE gap costing you the most, then hands you the full book that fixes it, free."
            photo={{ src: "/horizon/quiz-team-soft.jpg", alt: "", w: 1600, h: 993, pos: "50% 20%", beside: true }}
          />
        </HorizonPage>
        <div className="quiz-host">
          <RockstarTeamQuiz />
        </div>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import RockstarTeamQuiz from "@/components/RockstarTeamQuiz";

export const metadata: Metadata = {
  title: "Rockstar Team Quiz | Brett Lechtenberg",
  description:
    "6 quick questions to diagnose the #1 gap between you and a rockstar team — and get the complete 'How To Build A Rockstar Team' book free.",
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
      <main className="pt-20">
        {/* Intro band */}
        <section className="bg-black text-white py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block rounded-full bg-cranberry px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Free 2-Minute Diagnostic
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold">
              Build a <span className="text-gold">Rockstar Team</span> — Not a
              Revolving Door
            </h1>
            <p className="mt-4 text-lg text-white/80">
              After 23+ years of building teams through the toughest economies,
              Brett distilled team-building into 15 strategies. This quiz finds
              the ONE gap costing you the most — then hands you the full book
              that fixes it, free.
            </p>
          </div>
        </section>

        <RockstarTeamQuiz />
      </main>
      <Footer />
    </>
  );
}

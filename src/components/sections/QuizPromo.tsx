import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

const GAPS = [
  "Recognition",
  "Connection",
  "Ownership",
  "Feedback",
  "Vision",
  "Hiring",
];

export function QuizPromo() {
  return (
    <section className="py-24 bg-gold-light/15 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Artwork */}
          <div className="relative hidden sm:block order-last lg:order-first">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cranberry/20 to-gold/20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-3">
              <Image
                src="/images/quiz/gap-recognition.webp"
                alt="Team celebrating a win — recognition"
                width={480}
                height={320}
                className="rounded-2xl border border-black/5 object-cover h-full shadow-lg"
              />
              <Image
                src="/images/quiz/gap-vision.webp"
                alt="Leader pointing a team toward a shared vision"
                width={480}
                height={320}
                className="rounded-2xl border border-black/5 object-cover h-full shadow-lg"
              />
            </div>
          </div>

          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cranberry/10 border border-cranberry/20 px-4 py-1.5 text-sm font-semibold text-cranberry mb-5">
              <ClipboardCheck className="w-4 h-4" />
              Free 2-Minute Diagnostic
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              What&apos;s the #1 gap between you and a{" "}
              <span className="bg-gradient-to-r from-cranberry to-gold-dark bg-clip-text text-transparent">
                rockstar team
              </span>
              ?
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed mb-6">
              6 quick questions. Get your biggest team-building gap diagnosed —
              and the complete <em>How To Build A Rockstar Team</em> book that
              fixes it, free.
            </p>
            <ul className="flex flex-wrap gap-2 mb-8">
              {GAPS.map((gap) => (
                <li
                  key={gap}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-warm-gray"
                >
                  {gap}
                </li>
              ))}
            </ul>
            <Link
              href="/rockstar-team-quiz"
              className="shine inline-flex items-center gap-2 bg-cranberry text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cranberry-dark transition-all duration-300 shadow-xl shadow-cranberry/25 hover:-translate-y-1"
            >
              Take the free quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

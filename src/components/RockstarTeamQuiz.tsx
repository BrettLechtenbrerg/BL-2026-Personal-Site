"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  HeartHandshake,
  KeyRound,
  MessageSquare,
  Compass,
  UserPlus,
  BookOpen,
  CalendarCheck,
} from "lucide-react";
import { useBotProtection } from "@/lib/useBotProtection";
import { links } from "@/lib/utils";

// ---------------------------------------------------------------------------
// The Rockstar Team diagnostic quiz — book lead magnet.
// 6 scored questions (one per team-building gap from "How To Build A Rockstar
// Team"), email capture, then a personalized diagnosis of the visitor's #1
// team gap with the full book delivered free as the fix. Answers POST to
// /api/team-lead → CRM webhook, which tags the contact and emails the book.
// Mirrors the 7 Deadly Sins quiz on totalsuccessai.com.
// ---------------------------------------------------------------------------

const BOOK_PATH = "/books/how-to-build-a-rockstar-team.pdf";

const ACCENT = "#9B1B30"; // brand cranberry
const ACCENT_LIGHT = "#C4324A";

type GapId =
  | "gap-recognition"
  | "gap-connection"
  | "gap-ownership"
  | "gap-feedback"
  | "gap-vision"
  | "gap-hiring";

type Question = {
  gap: GapId;
  prompt: string;
  // Options ordered best → worst; index = gap score (0–3).
  options: string[];
};

type GapResult = {
  name: string;
  headline: string;
  cost: string;
  chapter: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
};

const QUESTIONS: Question[] = [
  {
    gap: "gap-recognition",
    prompt: "When your team members do great work, what usually happens?",
    options: [
      "They get specific, public praise — and real rewards",
      "I thank them, but it\u2019s generic and inconsistent",
      "Honestly, good work mostly goes unnoticed",
      "They only hear from me when something goes wrong",
    ],
  },
  {
    gap: "gap-connection",
    prompt:
      "How well do you know your team as people — not just as employees?",
    options: [
      "Deeply — birthdays, families, what\u2019s going on in their lives",
      "I know the basics, but we rarely go deeper",
      "We keep it strictly business",
      "I barely know them beyond their job title",
    ],
  },
  {
    gap: "gap-ownership",
    prompt: "How much real ownership do your team members have?",
    options: [
      "They run projects, create, and have a real voice",
      "I delegate tasks, but every decision still comes back to me",
      "They do exactly what I say — nothing more",
      "I end up redoing their work anyway, so why bother",
    ],
  },
  {
    gap: "gap-feedback",
    prompt: "How does your team find out how they\u2019re doing?",
    options: [
      "Daily — clear expectations, real feedback, real training",
      "Occasional check-ins, when I remember",
      "An annual review\u2026 when it happens",
      "They find out when something blows up",
    ],
  },
  {
    gap: "gap-vision",
    prompt:
      "Does your team know WHY your business exists — beyond making money?",
    options: [
      "Yes — they can say it, and they see their place in it",
      "I\u2019ve mentioned it, but it doesn\u2019t drive the daily work",
      "The vision lives only in my head",
      "Vision? We\u2019re just trying to survive the week",
    ],
  },
  {
    gap: "gap-hiring",
    prompt:
      "What does it take to get hired — and get a raise — on your team?",
    options: [
      "A real process to get in, and a clear path to a raise",
      "Some screening, but raises are ad hoc",
      "If they show up and seem OK, they\u2019re hired",
      "I hire whoever applies — I need warm bodies",
    ],
  },
];

const RESULTS: Record<GapId, GapResult> = {
  "gap-recognition": {
    name: "The Recognition Gap",
    headline:
      "Your team doesn\u2019t feel like rockstars — so they don\u2019t play like rockstars",
    cost: "Your clients will be treated exactly the way you treat your staff. Team members who never hear specific praise quietly disengage — and your customers feel it before you do.",
    chapter: "Strategies 1\u20138 — Treat Them Like Rockstars",
    image: "/images/quiz/gap-recognition.webp",
    imageAlt: "A team celebrating a team member like a rockstar on stage",
    icon: <Star size={14} aria-hidden />,
  },
  "gap-connection": {
    name: "The Connection Gap",
    headline: "People don\u2019t leave companies — they leave strangers",
    cost: "Everyone wants to feel that their work — and their life — matters to the person they work for. Without a genuine personal connection, your best people are one better offer away from gone.",
    chapter: "Strategies 9\u201310 — Make Them Feel Like Family",
    image: "/images/quiz/gap-connection.webp",
    imageAlt: "A business owner and team member connecting over coffee",
    icon: <HeartHandshake size={14} aria-hidden />,
  },
  "gap-ownership": {
    name: "The Ownership Gap",
    headline: "A team with no ownership will never own the results",
    cost: "When every decision runs through you, you become the bottleneck — and your team learns to wait instead of think. Give them projects, boundaries, and a voice, and they\u2019ll surprise you.",
    chapter: "Strategies 11\u201312 — Give Them Ownership & Control",
    image: "/images/quiz/gap-ownership.webp",
    imageAlt: "A leader handing a golden key of ownership to a team member",
    icon: <KeyRound size={14} aria-hidden />,
  },
  "gap-feedback": {
    name: "The Feedback Gap",
    headline: "Your team can\u2019t win a game with no scoreboard",
    cost: "No pre-shift direction, no post-shift feedback, no investment in their progress — and then we wonder why people underperform. Daily engagement is what separates rockstar teams from warm bodies.",
    chapter: "Strategies 13\u201314 — Feedback & Investing in Progress",
    image: "/images/quiz/gap-feedback.webp",
    imageAlt: "A leader giving an energizing team huddle pep talk",
    icon: <MessageSquare size={14} aria-hidden />,
  },
  "gap-vision": {
    name: "The Vision Gap",
    headline:
      "Your team can\u2019t follow a vision that lives only in your head",
    cost: "People — especially your youngest team members — want a cause, not just a paycheck. Teach them the WHY of your business and you become the shiny thing they\u2019d otherwise chase elsewhere.",
    chapter: "Strategy 15 — Communicate the Vision",
    image: "/images/quiz/gap-vision.webp",
    imageAlt: "A leader pointing a team toward a north-star vision",
    icon: <Compass size={14} aria-hidden />,
  },
  "gap-hiring": {
    name: "The Hiring Gap",
    headline: "Every gamble hire costs you months and thousands",
    cost: "If getting hired takes no effort and the path to a raise is a mystery, you\u2019ll keep attracting people who treat the job the same way. Make them jump through some hoops — the right ones stay.",
    chapter: "Bonus — Hiring a Great Team (Including Millennials)",
    image: "/images/quiz/gap-hiring.webp",
    imageAlt: "One glowing candidate crossing stepping stones to a golden door",
    icon: <UserPlus size={14} aria-hidden />,
  },
};

// Book order doubles as tie-break priority: on equal scores, the earlier
// gap (as ordered in the book) wins.
const GAP_ORDER: GapId[] = [
  "gap-recognition",
  "gap-connection",
  "gap-ownership",
  "gap-feedback",
  "gap-vision",
  "gap-hiring",
];

const ANALYZING_STEPS = [
  "Scoring your answers\u2026",
  "Weighing all 6 team gaps\u2026",
  "Preparing your diagnosis\u2026",
];

type Phase = "quiz" | "analyzing" | "result";

export default function RockstarTeamQuiz() {
  const [step, setStep] = useState(0); // 0..5 questions, then capture
  const [scores, setScores] = useState<Partial<Record<GapId, number>>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("quiz");
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const { honeypotProps, withBotFields } = useBotProtection();

  const totalSteps = QUESTIONS.length + 1;
  const isCapture = step === QUESTIONS.length;
  const progress = Math.round((step / totalSteps) * 100);

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (analyzeStep < ANALYZING_STEPS.length - 1) {
      const t = setTimeout(() => setAnalyzeStep((s) => s + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("result"), 800);
    return () => clearTimeout(t);
  }, [phase, analyzeStep]);

  function selectOption(question: Question, option: string, index: number) {
    if (justSelected) return;
    setScores((prev) => ({ ...prev, [question.gap]: index }));
    setAnswers((prev) => ({ ...prev, [question.prompt]: option }));
    setJustSelected(option);
    setTimeout(() => {
      setJustSelected(null);
      setStep((s) => s + 1);
    }, 350);
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  // Highest score wins; ties go to the earlier (per the book) gap.
  const topGap: GapId = GAP_ORDER.reduce<GapId>(
    (best, gap) => ((scores[gap] ?? 0) > (scores[best] ?? 0) ? gap : best),
    GAP_ORDER[0]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/team-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          withBotFields({ name, email, topGap, scores, answers })
        ),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setAnalyzeStep(0);
      setPhase("analyzing");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const result = RESULTS[topGap];
  const firstName = name.trim().split(" ")[0] || "Friend";

  return (
    <section className="bg-gold-light/20 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            What&apos;s the #1 gap between you and a rockstar team?
          </h2>
          <p className="mt-3 text-warm-gray">
            6 quick questions. Get your biggest team-building gap diagnosed —
            and the full book that fixes it, free.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
          {/* Result banner image sits flush at the top of the card */}
          <AnimatePresence>
            {phase === "result" && (
              <motion.div
                key="banner"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full aspect-[3/2] max-h-72"
              >
                <Image
                  src={result.image}
                  alt={result.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority={false}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 35%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 md:p-10 pt-4 flex-1 flex flex-col">
            {/* Progress bar */}
            {phase === "quiz" && (
              <div className="mb-8">
                <div className="h-2 w-full bg-gold-light/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_LIGHT})`,
                    }}
                    initial={false}
                    animate={{ width: `${Math.max(progress, 8)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-2 text-sm text-warm-gray">
                  {isCapture
                    ? "Last step"
                    : `Question ${step + 1} of ${QUESTIONS.length}`}
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {phase === "analyzing" ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="relative mx-auto mb-6 h-16 w-16">
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-gold-light/40"
                        aria-hidden
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-transparent"
                        style={{ borderTopColor: ACCENT }}
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.9,
                          ease: "linear",
                        }}
                        aria-hidden
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={analyzeStep}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-lg font-medium text-black"
                      >
                        {ANALYZING_STEPS[analyzeStep]}
                      </motion.p>
                    </AnimatePresence>
                  </motion.div>
                ) : phase === "result" ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="text-center"
                  >
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <span aria-hidden>{result.icon}</span>
                      {firstName}, your #1 team gap: {result.name}
                    </span>
                    <h3 className="mt-4 text-2xl md:text-3xl font-bold text-black">
                      {result.headline}
                    </h3>
                    <p className="mt-3 text-warm-gray">{result.cost}</p>

                    {/* The fix: the full book, free */}
                    <div
                      className="mt-6 rounded-xl border-2 border-dashed p-5 text-left"
                      style={{
                        borderColor: "#D4AF3766",
                        backgroundColor: "#FDF8EA",
                      }}
                    >
                      <p className="flex items-center gap-2 font-bold text-black">
                        <BookOpen
                          size={16}
                          aria-hidden
                          style={{ color: ACCENT }}
                        />
                        The fix is in your inbox
                      </p>
                      <p className="mt-1 text-sm text-warm-gray">
                        We&apos;ve emailed you the complete{" "}
                        <em>How To Build A Rockstar Team</em> — free. Your
                        battle plan is &ldquo;{result.chapter}&rdquo;. Start
                        there.
                      </p>
                      <a
                        href={BOOK_PATH}
                        target="_blank"
                        rel="noopener"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: ACCENT }}
                      >
                        Or download it right now{" "}
                        <ArrowRight size={12} aria-hidden />
                      </a>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-3">
                      <a
                        href={links.booking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-warm-gray transition-colors"
                      >
                        <CalendarCheck size={14} aria-hidden />
                        Talk through your results with Brett{" "}
                        <ArrowRight size={14} aria-hidden />
                      </a>
                      <Link
                        href="/coaching"
                        className="text-sm font-medium text-warm-gray underline underline-offset-4 hover:text-black transition-colors"
                      >
                        Or see how coaching builds rockstar teams
                      </Link>
                    </div>
                  </motion.div>
                ) : isCapture ? (
                  <motion.form
                    key="capture"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl font-bold text-black text-center">
                      Where should we send your diagnosis + free book?
                    </h3>
                    <p className="text-center text-sm text-warm-gray">
                      You&apos;ll get the complete{" "}
                      <em>How To Build A Rockstar Team</em> — not a sample.
                    </p>

                    {/* Honeypot — hidden from humans */}
                    <input {...honeypotProps} />

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-warm-gray/40 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-warm-gray/40 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none"
                        placeholder="you@company.com"
                      />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full text-white font-semibold py-3 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {submitting
                        ? "Sending\u2026"
                        : "Reveal my #1 gap + send my free book"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key={QUESTIONS[step].gap}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                  >
                    <h3 className="text-2xl font-bold text-black text-center mb-6">
                      {QUESTIONS[step].prompt}
                    </h3>
                    <div className="grid gap-3">
                      {QUESTIONS[step].options.map((option, index) => {
                        const selected = justSelected === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              selectOption(QUESTIONS[step], option, index)
                            }
                            className={`flex items-center justify-between text-left px-5 py-4 rounded-lg border-2 transition-all ${
                              selected
                                ? "text-white"
                                : "border-warm-gray/30 hover:bg-gold-light/20 text-black"
                            }`}
                            style={
                              selected
                                ? {
                                    backgroundColor: ACCENT,
                                    borderColor: ACCENT,
                                  }
                                : undefined
                            }
                          >
                            <span>{option}</span>
                            <AnimatePresence>
                              {selected && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1.15, opacity: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 18,
                                  }}
                                  className="text-white"
                                >
                                  <Check size={16} aria-hidden />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back button */}
            {phase === "quiz" && step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="mt-6 inline-flex items-center gap-2 text-warm-gray hover:text-black transition-colors self-start"
              >
                <ArrowLeft size={12} aria-hidden /> Back
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

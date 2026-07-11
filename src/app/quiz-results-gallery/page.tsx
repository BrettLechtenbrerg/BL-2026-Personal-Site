import Image from "next/image";
import {
  Star,
  HeartHandshake,
  KeyRound,
  MessageSquare,
  Compass,
  UserPlus,
  ArrowRight,
  CalendarCheck,
  BookOpen,
  DoorOpen,
  ListOrdered,
  Mail,
  Cog,
  Tags,
  Send,
  Bell,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Internal gallery — renders all 6 personalized result cards side by side so
// the team can review imagery/copy without retaking the quiz 6 times, plus a
// visual flow diagram of the whole funnel. Mirrors the RESULTS config in
// components/RockstarTeamQuiz.tsx; if you change that file, update this
// gallery to match. Same pattern as totalsuccessai.com/quiz-results-gallery.
// ---------------------------------------------------------------------------

const ACCENT = "#9B1B30";

type GalleryResult = {
  gap: string;
  name: string;
  headline: string;
  cost: string;
  chapter: string;
  image: string;
  icon: React.ReactNode;
};

const GALLERY: GalleryResult[] = [
  {
    gap: "gap-recognition",
    name: "The Recognition Gap",
    headline:
      "Your team doesn\u2019t feel like rockstars — so they don\u2019t play like rockstars",
    cost: "Your clients will be treated exactly the way you treat your staff. Team members who never hear specific praise quietly disengage — and your customers feel it before you do.",
    chapter: "Strategies 1\u20138 — Treat Them Like Rockstars",
    image: "/images/quiz/gap-recognition.webp",
    icon: <Star size={14} aria-hidden />,
  },
  {
    gap: "gap-connection",
    name: "The Connection Gap",
    headline: "People don\u2019t leave companies — they leave strangers",
    cost: "Everyone wants to feel that their work — and their life — matters to the person they work for. Without a genuine personal connection, your best people are one better offer away from gone.",
    chapter: "Strategies 9\u201310 — Make Them Feel Like Family",
    image: "/images/quiz/gap-connection.webp",
    icon: <HeartHandshake size={14} aria-hidden />,
  },
  {
    gap: "gap-ownership",
    name: "The Ownership Gap",
    headline: "A team with no ownership will never own the results",
    cost: "When every decision runs through you, you become the bottleneck — and your team learns to wait instead of think. Give them projects, boundaries, and a voice, and they\u2019ll surprise you.",
    chapter: "Strategies 11\u201312 — Give Them Ownership & Control",
    image: "/images/quiz/gap-ownership.webp",
    icon: <KeyRound size={14} aria-hidden />,
  },
  {
    gap: "gap-feedback",
    name: "The Feedback Gap",
    headline: "Your team can\u2019t win a game with no scoreboard",
    cost: "No pre-shift direction, no post-shift feedback, no investment in their progress — and then we wonder why people underperform. Daily engagement is what separates rockstar teams from warm bodies.",
    chapter: "Strategies 13\u201314 — Feedback & Investing in Progress",
    image: "/images/quiz/gap-feedback.webp",
    icon: <MessageSquare size={14} aria-hidden />,
  },
  {
    gap: "gap-vision",
    name: "The Vision Gap",
    headline:
      "Your team can\u2019t follow a vision that lives only in your head",
    cost: "People — especially your youngest team members — want a cause, not just a paycheck. Teach them the WHY of your business and you become the shiny thing they\u2019d otherwise chase elsewhere.",
    chapter: "Strategy 15 — Communicate the Vision",
    image: "/images/quiz/gap-vision.webp",
    icon: <Compass size={14} aria-hidden />,
  },
  {
    gap: "gap-hiring",
    name: "The Hiring Gap",
    headline: "Every gamble hire costs you months and thousands",
    cost: "If getting hired takes no effort and the path to a raise is a mystery, you\u2019ll keep attracting people who treat the job the same way. Make them jump through some hoops — the right ones stay.",
    chapter: "Bonus — Hiring a Great Team (Including Millennials)",
    image: "/images/quiz/gap-hiring.webp",
    icon: <UserPlus size={14} aria-hidden />,
  },
];

function ResultCard({ result }: { result: GalleryResult }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={result.image}
          alt={result.headline}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 35%)",
          }}
        />
      </div>
      <div className="p-6 pt-2 text-center flex-1 flex flex-col">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            {result.icon}
            Brett, your #1 team gap: {result.name}
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-bold text-black">
          {result.headline}
        </h3>
        <p className="mt-2 text-warm-gray text-sm">{result.cost}</p>
        <p className="mt-3 text-sm font-semibold text-black">
          Battle plan: {result.chapter}
        </p>
        <div className="mt-5 flex flex-col items-center gap-2">
          <span
            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg"
            style={{ backgroundColor: ACCENT }}
          >
            <BookOpen size={14} aria-hidden />
            Download the free book <ArrowRight size={14} aria-hidden />
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-warm-gray">
            <CalendarCheck size={14} aria-hidden />
            Talk through your results with Brett
          </span>
        </div>
        <p className="mt-4 text-xs uppercase tracking-wide text-warm-gray">
          Tag: {result.gap}
        </p>
      </div>
    </div>
  );
}

export default function QuizResultsGalleryPage() {
  return (
    <main className="min-h-screen bg-gold-light/20">
      <div className="bg-gold text-black text-center text-sm font-bold py-2 px-4">
        INTERNAL PREVIEW · QUIZ RESULT VARIATIONS · NOT INDEXED · DO NOT SHARE
        PUBLICLY
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Rockstar Team Quiz — Result Variations
          </h1>
          <p className="mt-3 text-warm-gray max-w-2xl mx-auto">
            All 6 personalized result screens side by side — one per team gap.
            Buttons here are non-functional mockups; take the real quiz at{" "}
            <span className="font-semibold">/rockstar-team-quiz</span> to see
            the animated reveal.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {GALLERY.map((result) => (
            <ResultCard key={result.gap} result={result} />
          ))}
        </div>

        <FlowDiagram />
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Visual flow diagram of the whole funnel: entry points → 6 scored questions
// → capture → analyzing → 6-way gap branch → result screen → lead delivery.
// ---------------------------------------------------------------------------

function FlowNode({
  icon,
  title,
  sub,
  accent = "#1A1A1A",
  light = false,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  accent?: string;
  light?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-md border-2 ${
        light ? "bg-white" : "text-white"
      }`}
      style={{
        backgroundColor: light ? undefined : accent,
        borderColor: accent,
      }}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          light ? "text-white" : "bg-white/15 text-white"
        }`}
        style={{ backgroundColor: light ? accent : undefined }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="text-left">
        <span
          className={`block text-sm font-bold leading-tight ${
            light ? "text-black" : ""
          }`}
        >
          {title}
        </span>
        {sub && (
          <span
            className={`block text-xs leading-tight ${
              light ? "text-warm-gray" : "text-white/75"
            }`}
          >
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}

function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden>
      <div className="h-5 w-0.5 bg-black/30" />
      {label && (
        <span className="my-0.5 rounded-full bg-black/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warm-gray">
          {label}
        </span>
      )}
      <div className="h-5 w-0.5 bg-black/30" />
      <svg width="12" height="7" viewBox="0 0 12 7" className="text-black/30">
        <path d="M0 0 L6 7 L12 0" fill="currentColor" />
      </svg>
    </div>
  );
}

function FlowDiagram() {
  const gaps = [
    { n: 1, label: "Recognition", icon: <Star size={13} aria-hidden /> },
    {
      n: 2,
      label: "Connection",
      icon: <HeartHandshake size={13} aria-hidden />,
    },
    { n: 3, label: "Ownership", icon: <KeyRound size={13} aria-hidden /> },
    { n: 4, label: "Feedback", icon: <MessageSquare size={13} aria-hidden /> },
    { n: 5, label: "Vision", icon: <Compass size={13} aria-hidden /> },
    { n: 6, label: "Hiring", icon: <UserPlus size={13} aria-hidden /> },
  ];

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <span
          className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Live at /rockstar-team-quiz
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold text-black">
          Book Lead Magnet: The Rockstar Team Diagnostic
        </h2>
        <p className="mt-2 text-warm-gray max-w-xl mx-auto">
          A quiz funnel that diagnoses a visitor&apos;s #1 team-building gap —
          then delivers the full{" "}
          <em>How To Build A Rockstar Team</em> book as the fix.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Entry points */}
        <div className="mx-auto max-w-md">
          <FlowNode
            icon={<DoorOpen size={16} />}
            title="Entry points"
            sub="Books page promo · footer link · social & email links"
            light
            accent={ACCENT}
          />
          <DownArrow />
          <FlowNode
            icon={<ListOrdered size={16} />}
            title="6 scored questions"
            sub="One per team gap — each answer scores 0–3 (~2 minutes)"
            accent={ACCENT}
          />
          <DownArrow />
          <FlowNode
            icon={<Mail size={16} />}
            title="Name + Email capture"
            sub={'"Where should we send your diagnosis + free book?"'}
            light
            accent={ACCENT}
          />
          <DownArrow label="analyzing… highest gap score wins" />
        </div>

        {/* 6-way gap branch */}
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gaps.map((g) => (
            <div
              key={g.n}
              className="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center shadow-sm"
              style={{ borderColor: ACCENT }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: ACCENT }}
                aria-hidden
              >
                {g.icon}
              </span>
              <span className="text-[11px] font-bold leading-tight text-black">
                Gap {g.n}
                <br />
                {g.label}
              </span>
            </div>
          ))}
        </div>

        {/* Result screen contents */}
        <div className="mx-auto mt-6 max-w-2xl">
          <div
            className="rounded-xl border-2 border-dashed p-4"
            style={{ borderColor: "#9B1B3066", backgroundColor: "#FDF3F5" }}
          >
            <p className="text-center text-sm font-bold uppercase tracking-wide text-black">
              Personalized result screen
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                <Star
                  className="mx-auto"
                  size={16}
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <p className="mt-1 text-xs font-bold text-black">
                  Your #1 gap revealed
                </p>
                <p className="text-xs text-warm-gray">
                  Branded artwork + what it&apos;s costing you
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                <BookOpen
                  className="mx-auto"
                  size={16}
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <p className="mt-1 text-xs font-bold text-black">
                  The fix: full book, free
                </p>
                <p className="text-xs text-warm-gray">
                  &quot;Your battle plan is chapter X&quot;
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                <CalendarCheck
                  className="mx-auto"
                  size={16}
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <p className="mt-1 text-xs font-bold text-black">
                  Next step CTA
                </p>
                <p className="text-xs text-warm-gray">
                  Book a call · Coaching page
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery pipeline */}
        <div className="mx-auto mt-6 max-w-md">
          <DownArrow label="meanwhile, behind the scenes" />
          <FlowNode
            icon={<Cog size={16} />}
            title="/api/team-lead → CRM webhook"
            sub="Gap scores + winning gap + answers forwarded"
            accent={ACCENT}
          />
          <DownArrow />
          <div className="grid gap-3 sm:grid-cols-3">
            <FlowNode
              icon={<Tags size={16} />}
              title="Tagged by gap"
              sub="e.g. gap-vision"
              light
              accent={ACCENT}
            />
            <FlowNode
              icon={<Send size={16} />}
              title="Book delivered"
              sub="Email with the full PDF"
              light
              accent={ACCENT}
            />
            <FlowNode
              icon={<Bell size={16} />}
              title="Brett notified"
              sub="Diagnosis + contact info"
              light
              accent={ACCENT}
            />
          </div>
          <DownArrow label="later" />
          <FlowNode
            icon={<Mail size={16} />}
            title="Gap-specific follow-up sequence"
            sub="Emails speak directly to their diagnosed team gap"
            light
            accent={ACCENT}
          />
        </div>
      </div>
    </section>
  );
}

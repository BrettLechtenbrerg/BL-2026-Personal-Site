"use client";

// Speaking & Training — four-lane talk structure (10 talks, collapsible
// cards), live-action bento gallery, Juan Diego live speaking video,
// outcomes grid, and testimonials. Promoted from the v3 draft July 3, 2026.

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { LogoScroller } from "@/components/sections/LogoScroller";
import { LiveClip } from "@/components/ui/LiveClip";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronDown,
  Lightbulb,
  Play,
  Quote,
  Smile,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// ── From live /speaking (v1): outcomes grid + action gallery ──────────────
const outcomes = [
  { icon: Sparkles, title: "Transformative Impact", description: "Lasting impact, practical tools, and genuine inspiration", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Target, title: "Tailored Customization", description: "High-level customization that resonates with your specific audience", gradient: "from-gold to-gold-dark" },
  { icon: Lightbulb, title: "Actionable Insights", description: "Strategies they can implement immediately", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Zap, title: "Dynamic Energy", description: "High energy ensuring a memorable experience", gradient: "from-gold to-gold-dark" },
  { icon: Users, title: "Evidence-Based", description: "Science-backed strategies from original research", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Smile, title: "Engaging Humor", description: "Substance combined with fun", gradient: "from-gold to-gold-dark" },
];

// Size sequence L,m,m,L,m,m,L,L tiles the 4-col bento into 5 full rows — no holes.
const galleryImages = [
  { src: "/speaking-gallery/america-first-training.jpg", alt: "Brett with the America First Credit Union team — Super Ethical Sales & Team Building, August 2026", size: "large" },
  { src: "/speaking-gallery/murray-chamber-training.webp", alt: "Murray Chamber of Commerce Training", size: "medium" },
  { src: "/speaking-gallery/speaking-2.png", alt: "Brett engaging with audience", size: "medium" },
  { src: "/speaking-gallery/speaking-1.png", alt: "Brett delivering keynote presentation", size: "large" },
  { src: "/speaking-gallery/speaking-3.png", alt: "Interactive workshop session", size: "medium" },
  { src: "/speaking-gallery/murray-chamber-2.jpeg", alt: "Team training at Murray Chamber", size: "medium" },
  { src: "/speaking-gallery/referral-community.png", alt: "Referral Community Event", size: "large" },
  { src: "/speaking-gallery/speaking-4.jpg", alt: "Brett on stage", size: "large" },
];

type Talk = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  paragraphs: string[];
  proof?: string;
  bestFor: string;
  leavesWith: string[];
  flagship?: boolean;
};

type Lane = {
  number: string;
  name: string;
  problem: string;
  intro: string;
  talks: Talk[];
};

const lanes: Lane[] = [
  {
    number: "01",
    name: "Peak Performance & Mindset",
    problem:
      "The problem this lane solves: \u201cOur people are stretched thin, distracted, and running on willpower.\u201d",
    intro:
      "Willpower is not a strategy. In this lane, Brett replaces the fragmented, outside-in grind with an integrated, inside-out operating system — positive mindset, personal motivation, and the strategic, intentional use of flow states — so performance stops being a fight and starts being a design.",
    talks: [
      {
        id: "masters-edge",
        title: "The Master's Edge",
        subtitle: "The Science of Inside-Out Transformation · Flagship Keynote",
        duration: "60–90 min keynote or full-day workshop",
        flagship: true,
        paragraphs: [
          "Most performance advice hands you someone else's toolkit and hopes it fits. The Master's Edge does the opposite: it teaches your people to build their own — using First Principles to clarify what actually matters, Frontloading to simplify the path, and Flow to maximize execution.",
          "Drawn from Brett's forthcoming book of the same name, this is the keynote that reframes high performance as something you architect from the inside out — not something you white-knuckle from the outside in.",
        ],
        bestFor:
          "Conferences, leadership summits, corporate kickoffs, and any audience ready to trade hustle culture for mastery.",
        leavesWith: [
          "A three-pillar framework (First Principles, Frontloading, Flow) they can apply to any goal, role, or challenge.",
          "The Clarify → Simplify → Maximize sequence for cutting through overwhelm and acting on what matters.",
          "A working understanding of flow states — and how to trigger them deliberately instead of waiting for them.",
        ],
      },
      {
        id: "limitless-mindset",
        title: "The Limitless Mindset",
        subtitle:
          "The Little-Known Mindset Shifts That Upgrade Your Business and Your Life",
        duration: "60–90 min keynote or workshop",
        paragraphs: [
          "Confidence isn't a personality trait — it's a trainable skill. In this high-energy keynote, Brett draws on 40 years of martial arts mastery and decades of coaching to show audiences how identity drives behavior, and how two words — \u201cI AM\u201d and \u201cI CAN\u201d — rewire what people believe is possible.",
          "This is Brett's signature motivational experience: part science, part story, and closed with a moment audiences carry with them long after the event.",
        ],
        bestFor:
          "General sessions, associations, sales kickoffs, graduations, and audiences that need genuine motivation with substance behind it.",
        leavesWith: [
          "The I AM / I CAN identity principle for converting self-talk into self-direction.",
          "Practical tools for dismantling limiting beliefs at the root instead of managing them at the surface.",
          "A shared, memorable close that turns an audience of individuals into a room of believers.",
        ],
      },
      {
        id: "reclaiming-the-clock",
        title: "Reclaiming The Clock",
        subtitle:
          "Mastering Habits, Productivity & the Truth About Leveraging Time · Based on Brett's book",
        duration: "60–90 min keynote or half-day workshop",
        paragraphs: [
          "Time management isn't a calendar problem — it's a clarity problem. Based on Brett's book Reclaiming The Clock, this talk applies First Principles thinking to the modern workday: instead of squeezing more into a broken design, your people learn to rebuild their days from scratch around their highest-leverage work.",
          "No gimmicks, no app-of-the-month. Because hacks are for hacks — and your time deserves a system.",
        ],
        bestFor:
          "Corporate training days, productivity-focused events, and teams drowning in busyness that isn't producing results.",
        leavesWith: [
          "A first-principles audit that separates high-leverage work from inherited habit.",
          "Habit and energy-rhythm strategies for protecting deep, focused work every day.",
          "A personal time architecture they design in the room and implement Monday morning.",
        ],
      },
      {
        id: "flow-by-design",
        title: "Flow by Design",
        subtitle:
          "The Research-Backed Science of Peak States, Faster Learning & Effortless Performance",
        duration: "60–90 min keynote",
        paragraphs: [
          "Flow — the state where focus sharpens, time bends, and performance feels effortless — is not luck. It's a trainable, repeatable condition with known triggers and known blockers. Brett's thesis on using flow states to accelerate human learning and skill acquisition was reviewed by the Flow Research Collective and described as making \u201ca compelling, empirical case.\u201d",
          "In this keynote, he translates that research into a practical playbook: how individuals and teams can strategically and intentionally engineer the conditions where their best work happens on purpose.",
        ],
        bestFor:
          "Performance-driven organizations, L&D and training teams, athletic and high-pressure professions, and innovation cultures.",
        leavesWith: [
          "The flow cycle and its triggers — and how to build them into daily work instead of hoping for them.",
          "The most common flow blockers in modern workplaces and how to remove them.",
          "A team-level framework for designing training and work environments where flow is the norm, not the exception.",
        ],
      },
    ],
  },
  {
    number: "02",
    name: "Leadership & Team Culture",
    problem:
      "The problem this lane solves: \u201cOur teams don't trust each other, and our leaders can't get everyone pulling in the same direction.\u201d",
    intro:
      "Culture isn't a poster on the wall — it's the operating system your people run on. In this lane, Brett combines the research (Google's Project Aristotle, psychological safety, team cohesion science) with 30 years of building real teams to show leaders how trust, clarity, and shared identity produce what pressure and policy never will: a team that reaches flow together.",
    talks: [
      {
        id: "winning-team-culture",
        title: "Winning Team Culture",
        subtitle:
          "The Science & Art of Developing an Empowered Team of Motivated Professionals",
        duration: "Half-day or full-day training (keynote version available)",
        paragraphs: [
          "The best teams in the world aren't the most talented — they're the most connected. This keynote and training experience gives leaders the research-backed mechanics of high-trust culture: psychological safety, shared purpose, honest communication, and the conditions that let a group of individuals become a crew.",
          "Delivered as a keynote or a hands-on training block, this is Brett's most requested corporate program — because culture is the one advantage competitors can't copy.",
        ],
        bestFor:
          "Leadership teams, company retreats, departments navigating change, and organizations serious about retention and engagement.",
        leavesWith: [
          "The trust-and-safety conditions research shows separate elite teams from average ones.",
          "Practical leadership behaviors that build connection and accountability at the same time.",
          "A shared team identity exercise that people reference for months afterward.",
        ],
      },
      {
        id: "road-less-traveled",
        title: "The Road Less Traveled (Mastery Edition)",
        subtitle:
          "What 40 Years of Martial Arts Mastery Teaches Leaders About Excellence, Patience & Longevity",
        duration: "45–60 min keynote",
        paragraphs: [
          "Every leader wants the summit; few want the climb. In this reflective, story-driven talk, Brett — a certified 8th-degree black belt — shares what four decades on the mat reveal about real mastery: why shortcuts collapse, why fundamentals compound, and why the leaders who endure are the ones who fall in love with the path itself.",
          "This is the talk for rooms that want depth over tactics — a meditation on excellence with the credibility of someone who has lived it.",
        ],
        bestFor:
          "Leadership retreats, executive off-sites, milestone events, and audiences hungry for wisdom rather than checklists.",
        leavesWith: [
          "The mastery mindset: how deliberate, patient practice outperforms intensity and shortcuts over time.",
          "A leadership lens for developing people the way masters develop students — fundamentals first.",
          "Renewed conviction that the long road is the fast road.",
        ],
      },
    ],
  },
  {
    number: "03",
    name: "Sales & Ethical Influence",
    problem:
      "The problem this lane solves: \u201cOur reps struggle to close — and the old-school sales training we've tried feels manipulative.\u201d",
    intro:
      "Brett's sales philosophy fits on one line: \u201cI'm not selling, I'm serving.\u201d This lane replaces pressure tactics with ethical influence — a transformation-over-transaction approach where reps learn to guide honest decisions, protect the relationship, and close more because of it. It's sales training your people won't need a shower after.",
    talks: [
      {
        id: "honest-close",
        title: "The Honest Close",
        subtitle:
          "The Three Beliefs Behind Every Yes — and the Ethical Framework That Earns Them",
        duration: "60–90 min keynote or half-day training",
        paragraphs: [
          "Every sale rests on three beliefs: the solution exists, we can find it together, and it's worth it. When reps struggle, it's almost never a script problem — it's a belief problem, usually the third one. This keynote and training experience diagnoses where belief breaks down and rebuilds the close as an act of service: honest questions, real clarity, and an invitation the client is glad they accepted.",
          "Built for teams navigating commission-based selling, new sales roles, or a market that's grown allergic to pressure.",
        ],
        proof:
          "Field-tested with America First Credit Union's business development team.",
        bestFor:
          "Sales teams and kickoffs, financial services and credit unions, business development groups, and any organization where relationships are the product.",
        leavesWith: [
          "The Three Beliefs framework for diagnosing exactly where a sale — or a salesperson — gets stuck.",
          "An ethical closing sequence that increases conversions while strengthening trust.",
          "State-management tools (including a 90-second reset) for staying confident and present through rejection.",
        ],
      },
      {
        id: "category-of-one",
        title: "A Category of One",
        subtitle:
          "Maximize Resilience & Problem-Solving to Position Your Business in a Class by Itself",
        duration: "60–90 min keynote",
        paragraphs: [
          "When you compete on price, everyone loses — especially you. This talk shows business owners and sales organizations how to escape the comparison trap entirely: using First Principles thinking to identify what only you can offer, and building a market position where the question is never \u201cwhy you?\u201d but \u201chow soon can we start?\u201d",
          "Differentiation isn't a tagline. It's a discipline — and it starts from the inside out.",
        ],
        bestFor:
          "Entrepreneur groups, chambers of commerce, franchise conventions, and competitive industries where everyone sounds the same.",
        leavesWith: [
          "A first-principles process for uncovering the value proposition competitors can't duplicate.",
          "Resilience and problem-solving frames that turn market pressure into positioning advantage.",
          "A clear next step for translating \u201cdifferent\u201d into premium pricing and loyal clients.",
        ],
      },
    ],
  },
  {
    number: "04",
    name: "AI for Humans",
    problem:
      "The problem this lane solves: \u201cAI is moving fast, and we don't know what it means for our people.\u201d",
    intro:
      "Brett's position on artificial intelligence is refreshingly human: automate the tasks, amplify the people. As co-founder of Total Success AI and a working practitioner — not a futurist with slides — he helps organizations adopt AI from first principles: clarify the real problem, simplify the workflow, and free your people to do the deep, creative, relational work only humans can do.",
    talks: [
      {
        id: "who-owns-the-outcome",
        title: "Who Owns the Outcome?",
        subtitle:
          "The Leadership Question That Decides Whether AI Transforms Your Organization — or Quietly Damages It",
        duration: "15–25 min keynote, expandable to 45–60 min",
        paragraphs: [
          "AI can automate the task. It cannot own the outcome. That responsibility still belongs to a human — and the organizations that thrive in the AI era will be the ones whose leaders understand exactly where the machine's job ends and human judgment begins.",
          "In this keynote, Brett cuts through both the hype and the fear, giving leaders a first-principles decision framework for what to automate, what to keep human, and how to lead people through the transition with trust intact.",
        ],
        bestFor:
          "Executive teams, boards, leadership summits, and industry conferences wrestling with AI strategy and workforce questions.",
        leavesWith: [
          "A clear ownership framework: where AI accountability must stay human, and why.",
          "A first-principles method for choosing automation targets based on real problems, not trends.",
          "Language and leadership moves for bringing anxious teams along instead of leaving them behind.",
        ],
      },
      {
        id: "ai-edge",
        title: "The AI Edge",
        subtitle: "Build It Before You Leave · Hands-On Workshop",
        duration:
          "Half-day or full-day workshop; 90-minute starter version available",
        paragraphs: [
          "Most AI training is a demo reel. This is a build session. Every participant arrives with one real challenge from their actual work — and leaves with a working AI solution they built in the room, plus the first-principles skill to build the next one on their own.",
          "No hype, no jargon, no \u201c10 prompt hacks\u201d — because a prompt trick is a hack, and a system built on first principles is a tool. This workshop delivers tools.",
        ],
        bestFor:
          "Corporate teams, chambers of commerce, small business groups, credit unions, and any organization that wants capability, not just awareness.",
        leavesWith: [
          "A working AI solution to a real problem from their own role — finished before the session ends.",
          "A repeatable first-principles process for identifying and building the next automation.",
          "The confidence to use AI on Monday morning, not \u201csomeday.\u201d",
        ],
      },
    ],
  },
];

// Alternating light backgrounds for lane sections, matching the site's gradient rhythm.
const laneBackgrounds = [
  "bg-gradient-to-b from-white via-cranberry/5 to-gold/5",
  "bg-gradient-to-b from-white via-gold/5 to-cranberry/5",
  "bg-gradient-to-b from-white via-cranberry/5 to-gold/5",
  "bg-gradient-to-b from-white via-gold/5 to-cranberry/5",
];

function TalkCard({ talk, index }: { talk: Talk; index: number }) {
  // Flagship keynote starts open; everything else starts as a scannable
  // title row so the four lanes read like a menu, not a manuscript.
  const [expanded, setExpanded] = useState(!!talk.flagship);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {talk.flagship && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
      )}
      <div
        className={`relative rounded-2xl shadow-lg border h-full transition-all duration-300 group-hover:shadow-xl overflow-hidden ${
          talk.flagship
            ? "border-gold/60 bg-gradient-to-br from-orange-50/60 via-white to-gold/10"
            : "border-gray-100 bg-white"
        }`}
      >
        {/* Always-visible header — click to expand/collapse */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="w-full text-left p-8 pb-6 cursor-pointer"
        >
          {talk.flagship && (
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-3.5 h-3.5 text-gold-dark fill-gold-dark" />
              <span className="text-gold-dark font-semibold text-xs tracking-wide uppercase">
                Flagship Keynote
              </span>
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-black mb-1 font-heading">
                {talk.title}
              </h3>
              <p className="text-cranberry font-medium italic">{talk.subtitle}</p>
              <p className="text-sm text-warm-gray mt-2">
                <span className="font-semibold text-black">Duration:</span>{" "}
                {talk.duration}
              </p>
            </div>
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border flex-shrink-0 mt-1 transition-all duration-300 ${
                expanded
                  ? "bg-cranberry border-cranberry text-white rotate-180"
                  : "bg-white border-gray-200 text-cranberry group-hover:border-cranberry/50"
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </span>
          </div>
          {!expanded && (
            <p className="text-sm text-cranberry font-semibold mt-3">
              See full description →
            </p>
          )}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="px-8 pb-8">
                {talk.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-warm-gray leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                {talk.proof && (
                  <p className="inline-flex items-center gap-2 bg-cranberry/5 border border-cranberry/20 rounded-full px-4 py-1.5 text-sm font-semibold text-cranberry mb-5">
                    <Star className="w-3.5 h-3.5 fill-cranberry text-cranberry" />
                    {talk.proof}
                  </p>
                )}
                <p className="text-sm text-warm-gray mb-5">
                  <span className="font-semibold text-cranberry">Best for:</span>{" "}
                  {talk.bestFor}
                </p>
                <div>
                  <p className="font-semibold text-black text-sm mb-2">
                    Your audience leaves with:
                  </p>
                  <ul className="space-y-2">
                    {talk.leavesWith.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-warm-gray">
                        <span className="w-1.5 h-1.5 bg-gold-dark rounded-full flex-shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function LaneSection({ lane, laneIndex }: { lane: Lane; laneIndex: number }) {
  return (
    <section className={`py-20 ${laneBackgrounds[laneIndex]} relative overflow-hidden`}>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-gold-dark font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Lane {lane.number}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-heading">
            {lane.name}
          </h2>
          <p className="text-cranberry italic mb-4">{lane.problem}</p>
          <p className="text-warm-gray leading-relaxed max-w-3xl">{lane.intro}</p>
        </motion.div>

        <div className="space-y-8">
          {lane.talks.map((talk, index) => (
            <TalkCard key={talk.id} talk={talk} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SpeakingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* ===== 1. HERO ===== */}
        <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          <Image
            src="/heroes/speaking.jpg"
            alt="Speaker on stage with dramatic lighting"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-cranberry/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/30 rounded-full blur-[100px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold font-semibold text-sm tracking-[0.25em] uppercase mb-6"
            >
              Keynotes · Corporate Training · Workshops
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading"
            >
              Your Audience Leaves{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Changed
              </span>{" "}
              — Not Just Entertained
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Science-backed keynotes and training built on one promise:
              transformation over transaction. Every talk is grounded in the
              Master&apos;s Edge methodology — Frontloading, First Principles, and
              the strategic use of Flow — so your people don&apos;t just hear new
              ideas. They leave with clarity, motivation, and tools they use
              Monday morning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button href="/book-brett" size="lg">
                Book Brett for Your Event
              </Button>
              <Button
                href="/media-kit"
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white hover:border-white"
              >
                View the Media Kit
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ===== 2. TRUST BAR ===== */}
        <LogoScroller />
        {/* Supporting text for SEO/accessibility (carousel logos are images) */}
        <div className="bg-gray-50 py-6">
          <p className="text-center text-sm text-warm-gray/80 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            From Fortune 500 teams like American Express and Delta to America
            First Credit Union and chambers of commerce across Utah, Brett
            delivers transformation that outlasts the event.
          </p>
        </div>

        {/* ===== NEW: SEE BRETT LIVE — Juan Diego video + matching testimonial ===== */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[500px] h-[500px] bg-cranberry/30 rounded-full blur-[130px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/25 rounded-full blur-[110px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* The clip */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full max-w-[340px] sm:max-w-[380px]"
              >
                <LiveClip
                  src="/videos/juan-diego-clip.mp4"
                  poster="/videos/juan-diego-poster.jpg"
                  label="Brett Lechtenberg speaking live at Juan Diego Catholic High School"
                />
              </motion.div>

              {/* Context + testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-5 py-2 mb-6">
                  <Play className="w-4 h-4 text-gold" />
                  <span className="text-cranberry-light font-semibold text-sm">
                    Live From the Room
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
                  Don&apos;t Take Our Word for It.{" "}
                  <span className="text-shimmer bg-gradient-to-r from-gold via-cranberry-light to-gold bg-clip-text text-transparent">
                    Watch.
                  </span>
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Unedited footage from Brett&apos;s recent session at Juan Diego
                  Catholic High School — no studio, no script, just Brett doing
                  what he does in front of a live room.
                </p>

                {/* Juan Diego testimonial — same venue as the footage */}
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <Quote className="w-6 h-6 text-gold mb-3" />
                  <p className="text-white/90 italic leading-relaxed mb-4">
                    &ldquo;The impact of this two-phase event on our team has been
                    nothing short of extraordinary. The lessons learned have not
                    only improved our performance on the field but have also
                    instilled a renewed sense of confidence and camaraderie.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      DL
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Danny Larson</p>
                      <p className="text-gold text-xs">
                        Head Football Coach, Juan Diego High School
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== FROM V1: WHAT YOU CAN EXPECT ===== */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center font-heading"
            >
              What You Can <span className="text-cranberry">Expect</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${outcome.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className="relative flex items-start gap-4 bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-br ${outcome.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                      <outcome.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">{outcome.title}</h3>
                      <p className="text-warm-gray text-sm">{outcome.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 3. UMBRELLA INTRO ===== */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cranberry/10 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8 font-heading">
                One Methodology.{" "}
                <span className="text-cranberry">
                  Four Ways It Transforms Your People.
                </span>
              </h2>
              <div className="space-y-5 text-lg text-warm-gray leading-relaxed text-left">
                <p>
                  Every Brett Lechtenberg keynote and training is built on the
                  same foundation: the Master&apos;s Edge — a science-backed system
                  for inside-out transformation validated by a thesis reviewed
                  by the Flow Research Collective and forged through 30 years of
                  business ownership and four decades on the martial arts mat.
                </p>
                <p>
                  Brett doesn&apos;t do off-the-shelf content, and he doesn&apos;t do
                  shortcuts. As he puts it: &ldquo;Hacks are for hacks.&rdquo;
                  What he delivers instead is a custom-fit experience built from
                  three scientific pillars — First Principles to CLARIFY,
                  Frontloading to SIMPLIFY, and Flow to MAXIMIZE — tailored to
                  your room, your industry, and your outcomes.
                </p>
                <p>
                  Choose the lane that matches the problem you&apos;re solving. The
                  transformation is guaranteed to be his.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== 4. LANE 1 ===== */}
        <LaneSection lane={lanes[0]} laneIndex={0} />

        {/* ===== PULL-QUOTE BAND (between Lane 1 and Lane 2) ===== */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gold/25 rounded-full blur-[110px]"
            />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Quote className="w-10 h-10 text-gold mx-auto mb-6" />
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-6">
                &ldquo;Hacks are for{" "}
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                  hacks
                </span>
                .&rdquo;
              </p>
              <p className="text-gold font-semibold tracking-wide">
                — Brett Lechtenberg
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== LANES 2–4 ===== */}
        <LaneSection lane={lanes[1]} laneIndex={1} />
        <LaneSection lane={lanes[2]} laneIndex={2} />
        <LaneSection lane={lanes[3]} laneIndex={3} />

        {/* ===== 5. CUSTOMIZATION LINE ===== */}
        <section className="py-10 bg-white border-t border-gray-100">
          <p className="text-center text-sm text-warm-gray px-4 sm:px-6 lg:px-8">
            All talks can be customized to your audience and event format.{" "}
            <a
              href="/book-brett"
              className="font-semibold text-cranberry hover:underline"
            >
              Request a custom presentation
            </a>
          </p>
        </section>

        {/* ===== FROM V1: BRETT IN ACTION GALLERY (bento, no unverified stats) ===== */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-cranberry/30 rounded-full blur-[150px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gold/25 rounded-full blur-[120px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6">
                <Camera className="w-4 h-4 text-gold" />
                <span className="text-gold font-semibold text-sm">Gallery</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
                Brett in{" "}
                <span className="bg-gradient-to-r from-cranberry via-gold to-cranberry bg-clip-text text-transparent">
                  Action
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                From corporate boardrooms to championship teams — delivering
                transformation everywhere.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                    image.size === "large"
                      ? "col-span-2 row-span-2"
                      : "col-span-1 row-span-1"
                  }`}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500 z-0" />
                  <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 group-hover:border-gold/50 transition-all duration-500">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-medium text-sm md:text-base drop-shadow-lg">
                        {image.alt}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-gold to-cranberry rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FROM V1: SPEAKING TESTIMONIAL ===== */}
        <section className="py-20 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg italic text-black mb-4 pt-4">
                    &ldquo;Brett is as good an instructor as I have been around. His
                    training methods and information are always cutting-edge.&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold">
                      MG
                    </div>
                    <div>
                      <p className="font-bold text-black">Matt Gibbons</p>
                      <p className="text-sm text-cranberry">
                        President, Murray Area Chamber of Commerce
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* [America First] Initial text feedback from Lindsey Powers, day
                  after the Aug 4, 2026 Super Ethical Sales & Team Building
                  session. Swap in the formal letter of recommendation when it
                  arrives. */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold via-cranberry to-gold rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg italic text-black mb-4 pt-4">
                    &ldquo;Thank you again, Brett!! I heard some more great comments
                    from our team that they really enjoyed your training!&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-cranberry flex items-center justify-center text-white font-bold">
                      LP
                    </div>
                    <div>
                      <p className="font-bold text-black">Lindsey Powers</p>
                      <p className="text-sm text-cranberry">
                        America First Credit Union · Super Ethical Sales &
                        Team Building, August 2026
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== 6. MEDIA KIT BLOCK ===== */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cranberry/30 rounded-full blur-[120px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-heading">
                  Everything Your{" "}
                  <span className="bg-gradient-to-r from-gold via-cranberry-light to-gold bg-clip-text text-transparent">
                    Event Team
                  </span>{" "}
                  Needs
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Planning an event is hard enough. Booking Brett is easy. The
                  full media kit — speaker one-sheet, headshots, ready-to-read
                  introductions, and A/V requirements — is one click away, ready
                  to share with your committee.
                </p>
                <Button href="/media-kit" variant="secondary" size="lg">
                  Get the Media Kit
                </Button>
              </motion.div>

              {/* [PLACEHOLDER: dedicated speaking reel — using homepage
                  "Brett in Action" ABC4 embed until a reel exists] */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/Dq7agUEBr6I"
                      title="Brett Lechtenberg on Good Things Utah"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Good Things Utah</p>
                    <p className="text-gray-400 text-sm">
                      ABC4 Utah - Peak Performance Interview
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== 7. CLOSING CTA ===== */}
        <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cranberry-light/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-heading">
                The First Step Is Always a Conversation
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                No pitch. No pressure. Just a genuine discussion about your
                event, your audience, and the transformation you want them to
                walk away with. If Brett&apos;s the right fit, you&apos;ll know. If he&apos;s
                not, he&apos;ll tell you — and point you toward someone who is.
              </p>
              <Button href="/book-brett" size="lg" variant="secondary">
                Book Brett for Your Event
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

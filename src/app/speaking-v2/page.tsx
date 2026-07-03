"use client";

// HIDDEN DRAFT — Speaking Page v2 (Four-Lane Restructure).
// Built per CLAUDE_CODE_SPEC_Speaking_Page_v2.md (July 3, 2026).
// Live /speaking is untouched. This page is noindex (see layout.tsx),
// not in the sitemap, and not linked in the nav.

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { LogoScroller } from "@/components/sections/LogoScroller";
import { motion } from "framer-motion";
import { Play, Quote, Star } from "lucide-react";
import Image from "next/image";

type Talk = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  paragraphs: string[];
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
        className={`relative rounded-2xl p-8 shadow-lg border h-full transition-all duration-300 group-hover:shadow-xl ${
          talk.flagship
            ? "border-gold/60 bg-gradient-to-br from-orange-50/60 via-white to-gold/10"
            : "border-gray-100 bg-white"
        }`}
      >
        {talk.flagship && (
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-3.5 h-3.5 text-gold-dark fill-gold-dark" />
            <span className="text-gold-dark font-semibold text-xs tracking-wide uppercase">
              Flagship Keynote
            </span>
          </div>
        )}
        {/*
          [The Honest Close] Proof line to add after August 4:
          "Field-tested with America First Credit Union's business development team."
        */}
        <h3 className="text-2xl font-bold text-black mb-1 font-heading">
          {talk.title}
        </h3>
        <p className="text-cranberry font-medium italic mb-4">{talk.subtitle}</p>
        {talk.paragraphs.map((paragraph, i) => (
          <p key={i} className="text-warm-gray leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
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
        <p className="text-sm text-warm-gray mt-5 pt-4 border-t border-gray-100">
          <span className="font-semibold text-black">Duration:</span>{" "}
          {talk.duration}
        </p>
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

export default function SpeakingV2Page() {
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
            From Fortune 500 teams like American Express and Delta to chambers
            of commerce across Utah, Brett delivers transformation that outlasts
            the event.
          </p>
        </div>

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

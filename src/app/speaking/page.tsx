// SPEAKING & TRAINING, "Horizon" design (Group 2, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Four lanes of talks (collapsible cards), live sizzle reel, outcomes, gallery and testimonials.
import Image from "next/image";
import Link from "next/link";
import { Camera, Lightbulb, Play, Quote, Smile, Sparkles, Target, Users, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, LogoStrip, PageHero, Stats, VideoPoster } from "@/components/horizon/kit";
import { LiveClip } from "@/components/ui/LiveClip";
import { TalkCard } from "./TalkCard";

// ── From live /speaking (v1): outcomes grid + action gallery ──────────────
const outcomes = [
  { icon: Sparkles, title: "Lasting Impact", description: "Practical tools your people keep using after the event ends" },
  { icon: Target, title: "Tailored Customization", description: "High-level customization that resonates with your specific audience", gold: true },
  { icon: Lightbulb, title: "Actionable Insights", description: "Strategies they can implement immediately" },
  { icon: Zap, title: "Grounded Presence", description: "Calm, confident delivery that holds a room without hype", gold: true },
  { icon: Users, title: "Evidence-Based", description: "Science-backed strategies from original research" },
  { icon: Smile, title: "Engaging Humor", description: "Substance combined with fun", gold: true },
];

// Added Sep 27 2026 (Website-Fixes spec 2.2). Quotes are verbatim; Sam
// Beard credit line per CLAUDE.md Credential Standards.
const extraTestimonials = [
  {
    quote:
      "In my lifetime I have had the opportunity to meet extraordinary people from around the world and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    initials: "SB",
    role: "Creator of 6 Presidential Programs for 8 United States Presidents, Founder, National Development Council",
  },
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    initials: "BS",
    role: "Olympic Silver Medalist\u00a0· 3-Time Olympian",
  },
];

// Size sequence L,m,m,L,m,m,L,L tiles the 4-col bento into 5 full rows — no holes.
const galleryImages = [
  { src: "/speaking-gallery/america-first-training.jpg", alt: "Brett with the America First Credit Union team, Super Ethical Sales & Team Building, August 2026", size: "large" },
  { src: "/speaking-gallery/murray-chamber-training.webp", alt: "Women in Business Empowerment Training, Murray Chamber of Commerce, May 2026", size: "medium" },
  { src: "/speaking-gallery/speaking-2.png", alt: "Financial Literacy Event, Heber Valley Chamber, Utah Valley University", size: "medium" },
  { src: "/speaking-gallery/speaking-1.png", alt: "Digital Marketing Training, Park City Chamber", size: "large" },
  { src: "/speaking-gallery/speaking-3.png", alt: "Team Building Training, Blair Education Center, Park City Hospital", size: "medium" },
  { src: "/speaking-gallery/murray-chamber-2.jpeg", alt: "Team training at Murray Chamber", size: "medium" },
  { src: "/speaking-gallery/referral-community.png", alt: "Referral Community Event", size: "large" },
  { src: "/speaking-gallery/speaking-4.jpg", alt: "AI for Business Owners, Park City Chamber, Blair Education Center", size: "large" },
];

export type Talk = {
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

export type Lane = {
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
      "Willpower is not a strategy. In this lane, Brett replaces the fragmented, outside-in grind with an integrated, inside-out operating system built on positive mindset, personal motivation, and the intentional use of flow states, so performance stops being a fight and starts being a design.",
    talks: [
      {
        id: "masters-edge",
        title: "The Master's Edge",
        subtitle: "The Science of Inside-Out Transformation · Flagship Keynote",
        duration: "60 to 90 min keynote or full-day workshop",
        flagship: true,
        paragraphs: [
          "Most performance advice hands you someone else's toolkit and hopes it fits. The Master's Edge does the opposite: it teaches your people to build their own, using First Principles to clarify what actually matters, Frontloading to simplify the path, and Flow to maximize execution.",
          "Drawn from Brett's new book of the same name, out now in paperback and on Kindle, this is the keynote that reframes high performance as something you build from the inside out, not something you white-knuckle from the outside in.",
        ],
        bestFor:
          "Conferences, leadership summits, corporate kickoffs, and any audience ready to trade hustle culture for mastery.",
        leavesWith: [
          "A three-pillar framework (First Principles, Frontloading, Flow) they can apply to any goal, role, or challenge.",
          "The Clarify → Simplify → Maximize sequence for cutting through overwhelm and acting on what matters.",
          "A working understanding of flow states and how to trigger them deliberately instead of waiting for them.",
        ],
      },
      {
        id: "limitless-mindset",
        title: "The Limitless Mindset",
        subtitle:
          "The Little-Known Mindset Shifts That Upgrade Your Business and Your Life",
        duration: "60 to 90 min keynote or workshop",
        paragraphs: [
          "Confidence isn't a personality trait. It's a trainable skill. In this high-energy keynote, Brett draws on 40 years of martial arts mastery and decades of coaching to show audiences how identity drives behavior, and how two words (\u201cI AM\u201d and \u201cI CAN\u201d) rewire what people believe is possible.",
          "This is Brett's signature motivational experience: part science, part story, and closed with a moment audiences carry with them long after the event.",
        ],
        bestFor:
          "General sessions, associations, sales kickoffs, graduations, and audiences that need genuine motivation with substance behind it.",
        leavesWith: [
          "The I AM / I CAN identity principle for converting self-talk into self-direction.",
          "Practical tools for dismantling limiting beliefs at the root instead of managing them at the surface.",
          "A shared, memorable close that turns a room full of strangers into a room of believers.",
        ],
      },
      {
        id: "reclaiming-the-clock",
        title: "Reclaiming The Clock",
        subtitle:
          "Mastering Habits, Productivity & the Truth About Leveraging Time · Based on Brett's book",
        duration: "60 to 90 min keynote or half-day workshop",
        paragraphs: [
          "Time management isn't a calendar problem. It's a clarity problem. Based on Brett's book Reclaiming The Clock, this talk applies First Principles thinking to the modern workday: instead of squeezing more into a broken design, your people learn to rebuild their days from scratch around the work that matters most.",
          "No gimmicks, no app-of-the-month. Because hacks are for hacks, and your time deserves a system.",
        ],
        bestFor:
          "Corporate training days, productivity-focused events, and teams drowning in busyness that isn't producing results.",
        leavesWith: [
          "A first-principles audit that separates the work that moves the needle from inherited habit.",
          "Habit and energy-rhythm strategies for protecting deep, focused work every day.",
          "A personal time architecture they design in the room and implement Monday morning.",
        ],
      },
      {
        id: "flow-by-design",
        title: "Flow by Design",
        subtitle:
          "The Research-Backed Science of Peak States, Faster Learning & Effortless Performance",
        duration: "60 to 90 min keynote",
        paragraphs: [
          "Flow, the state where focus sharpens, time bends, and performance feels effortless, is not luck. It's a trainable, repeatable condition with known triggers and known blockers. Brett's thesis on using flow states to accelerate human learning and skill acquisition was reviewed by the Flow Research Collective and described as making \u201ca compelling, empirical case.\u201d",
          "In this keynote, he translates that research into a practical playbook: how people and teams can strategically and intentionally engineer the conditions where their best work happens on purpose.",
        ],
        bestFor:
          "Performance-driven organizations, learning and development teams, athletic and high-pressure professions, and innovation cultures.",
        leavesWith: [
          "The flow cycle and its triggers, and how to build them into daily work instead of hoping for them.",
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
      "Culture isn't a poster on the wall. It's the operating system your people run on. In this lane, Brett combines the research (Google's Project Aristotle, psychological safety, team cohesion science) with 30 years of building real teams to show leaders how trust, clarity, and shared identity produce what pressure and policy never will: a team that reaches flow together.",
    talks: [
      {
        id: "winning-team-culture",
        title: "Winning Team Culture",
        subtitle:
          "The Science & Art of Developing an Empowered Team of Motivated Professionals",
        duration: "Half-day or full-day training (keynote version available)",
        paragraphs: [
          "The best teams in the world aren't the most talented. They're the most connected. This keynote and training experience gives leaders the research-backed mechanics of high-trust culture: psychological safety, shared purpose, honest communication, and the conditions that turn a group of people into a crew.",
          "Delivered as a keynote or a hands-on training block, this is Brett's most requested corporate program, because culture is the one advantage competitors can't copy.",
        ],
        proof: "Brett's most requested corporate program.",
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
        duration: "45 to 60 min keynote",
        paragraphs: [
          "Every leader wants the summit; few want the climb. In this reflective, story-driven talk, Brett, a certified 8th-degree black belt, shares what four decades on the mat reveal about real mastery: why shortcuts collapse, why fundamentals compound, and why the leaders who endure are the ones who fall in love with the path itself.",
          "This is the talk for rooms that want depth over tactics: a meditation on excellence with the credibility of someone who has lived it.",
        ],
        bestFor:
          "Leadership retreats, executive off-sites, milestone events, and audiences hungry for wisdom rather than checklists.",
        leavesWith: [
          "The mastery mindset: how deliberate, patient practice outperforms intensity and shortcuts over time.",
          "A leadership lens for developing people the way masters develop students: fundamentals first.",
          "Renewed conviction that the long road is the fast road.",
        ],
      },
    ],
  },
  {
    number: "03",
    name: "AI for Humans",
    problem:
      "The problem this lane solves: \u201cAI is moving fast, and we don't know what it means for our people.\u201d",
    intro:
      "Brett's position on artificial intelligence is refreshingly human: automate the tasks, amplify the people. As co-founder of Total Success AI and a working practitioner, not a futurist with slides, he helps organizations adopt AI from first principles: clarify the real problem, simplify the workflow, and free your people to do the deep, creative, relational work only humans can do.",
    talks: [
      {
        id: "who-owns-the-outcome",
        title: "Who Owns the Outcome?",
        subtitle:
          "The Leadership Question That Decides Whether AI Transforms Your Organization or Quietly Damages It",
        duration: "15 to 25 min keynote, expandable to 45 to 60 min",
        paragraphs: [
          "AI can automate the task. It cannot own the outcome. That responsibility still belongs to a human, and the organizations that thrive in the AI era will be the ones whose leaders understand exactly where the machine's job ends and human judgment begins.",
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
          "Most AI training is a demo reel. This is a build session. Everyone arrives with one real challenge from their actual work and leaves with a working AI tool they built in the room, plus the first-principles skill to build the next one on their own.",
          "No hype, no jargon, no \u201c10 prompt hacks,\u201d because a prompt trick is a hack, and a system built on first principles is a tool. This workshop delivers tools.",
        ],
        bestFor:
          "Corporate teams, chambers of commerce, small business groups, credit unions, and any organization that wants capability, not just awareness.",
        leavesWith: [
          "A working AI tool for a real problem from their own role, finished before the session ends.",
          "A repeatable first-principles process for identifying and building the next automation.",
          "The confidence to use AI on Monday morning, not \u201csomeday.\u201d",
        ],
      },
    ],
  },
  {
    number: "04",
    name: "Sales & Ethical Influence",
    problem:
      "The problem this lane solves: \u201cOur reps struggle to close, and the old-school sales training we've tried feels manipulative.\u201d",
    intro:
      "Brett's sales philosophy fits on one line: \u201cI'm not selling, I'm serving.\u201d This lane replaces pressure tactics with ethical influence: a transformation-over-transaction approach where reps learn to guide honest decisions, protect the relationship, and close more because of it. It's sales training your people won't need a shower after.",
    talks: [
      {
        id: "honest-close",
        title: "The Honest Close",
        subtitle:
          "The Three Beliefs Behind Every Yes and the Ethical Framework That Earns Them",
        duration: "60 to 90 min keynote or half-day training",
        paragraphs: [
          "Every sale rests on three beliefs: the solution exists, we can find it together, and it's worth it. When reps struggle, it's almost never a script problem. It's a belief problem, usually the third one. This keynote and training experience diagnoses where belief breaks down and rebuilds the close as an act of service: honest questions, real clarity, and an invitation the client is glad they accepted.",
          "Built for teams navigating commission-based selling, new sales roles, or a market that's grown allergic to pressure.",
        ],
        proof:
          "Field-tested with America First Credit Union's business development team.",
        bestFor:
          "Sales teams and kickoffs, financial services and credit unions, business development groups, and any organization where relationships are the product.",
        leavesWith: [
          "The Three Beliefs framework for diagnosing exactly where a sale (or a salesperson) gets stuck.",
          "An ethical closing sequence that increases conversions while strengthening trust.",
          "State-management tools (including a 90-second reset) for staying confident and present through rejection.",
        ],
      },
      {
        id: "category-of-one",
        title: "A Category of One",
        subtitle:
          "Position Yourself So Far Ahead That Comparison Becomes Irrelevant",
        duration: "60 to 90 min keynote",
        paragraphs: [
          "When you compete on price, everyone loses, especially you. This talk shows business owners and sales organizations how to escape the comparison trap entirely: using First Principles thinking to identify what only you can offer, and building a market position where the question is never \u201cwhy you?\u201d but \u201chow soon can we start?\u201d",
          "Differentiation isn't a tagline. It's a discipline, and it starts from the inside out.",
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
];

// Verified stats (Session 22, Aug 8 2026, figures confirmed by Brett; see CLAUDE.md Credential Standards).
const stats = [
  { value: 250, suffix: "+", label: "Talks, Trainings & Seminars" },
  { value: 100, suffix: "+", label: "Businesses Coached", color: "t-cran" },
  { value: 30, suffix: "+", label: "Years in Business" },
  { value: 8, label: "Books · 5 Bestsellers", color: "t-cran" },
];

function LaneSection({ lane, tone }: { lane: Lane; tone: string }) {
  return (
    <section className={`sec ${tone}`} aria-labelledby={`lane-${lane.number}`}>
      <div className="rail lane">
        <div className="lane-head" data-rise>
          <p className="kicker">Lane {lane.number}</p>
          <h2 id={`lane-${lane.number}`} className="h2">{lane.name}</h2>
          <p className="lane-problem">{lane.problem}</p>
          <p className="body-lg">{lane.intro}</p>
        </div>
        <ul className="talks" data-stagger>
          {lane.talks.map((talk) => <TalkCard key={talk.id} talk={talk} />)}
        </ul>
      </div>
    </section>
  );
}

const quotes = [
  {
    quote: "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
    name: "Matt Gibbons",
    initials: "MG",
    role: "President, Murray Area Chamber of Commerce",
  },
  // Juan Diego testimonial (moved from under the reel, Sep 27 2026)
  {
    quote:
      "The impact of this two-phase event on our team has been nothing short of extraordinary. The lessons learned have not only improved our performance on the field but have also instilled a renewed sense of confidence and camaraderie.",
    name: "Danny Larson",
    initials: "DL",
    role: "Head Football Coach, Juan Diego High School",
  },
  ...extraTestimonials,
];

export default function SpeakingPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="speaking-title"
            eyebrow="Keynotes · Corporate Training · Workshops"
            lines={["Your Audience Leaves", <><em>Changed</em>, Not Just Entertained</>]}
            lede={<>Science-backed keynotes and training built on one promise: transformation over transaction. Every talk is grounded in the Master&apos;s Edge methodology of First Principles, Frontloading, and the strategic use of Flow, so your people don&apos;t just hear new ideas. They leave with clarity, motivation, and tools they use Monday morning.</>}
            photo={{ src: "/heroes/speaking.jpg", alt: "Speaker on stage with dramatic lighting", w: 1920, h: 1280, pos: "40% 45%" }}
            side="right"
            wide
          >
            <Btn href="/book-brett" size="lg" arrow>Book Brett for Your Event</Btn>
            <Btn href="/media-kit" variant="glass" size="lg">View the Media Kit</Btn>
          </PageHero>

          {/* Trust bar: logos, supporting text (the logos are images) and verified numbers */}
          <LogoStrip id="speaking-logos" hideMartialArts>
            <div className="rail trust-more">
              <p className="trust-line">
                From America First Credit Union, Packsize, and Purple to American Express, Delta, and chambers of commerce across Utah, Brett
                delivers transformation that outlasts the event.
              </p>
              <Stats items={stats} className="stats-compact" />
            </div>
          </LogoStrip>

          {/* See Brett live: sizzle reel + America First feedback */}
          <section className="sec sec-night-2" aria-labelledby="live-title">
            <div className="rail split split-even">
              <div data-rise>
                <LiveClip
                  src="/videos/sizzle-reel-2026.mp4"
                  poster="/videos/sizzle-reel-poster.jpg"
                  label="Brett Lechtenberg 2026 speaker sizzle reel"
                  aspect="wide"
                  caption="▶ Watch the 3:27 sizzle reel (with sound)"
                />
              </div>
              <div className="live-copy" data-rise>
                <p className="chip"><Play aria-hidden="true" />Live From the Room</p>
                <h2 id="live-title" className="h2">Don&apos;t Take Our Word for It. <em>Watch.</em></h2>
                <p className="body-lg">
                  Three minutes, no pitch. Live keynotes, corporate trainings, and the business owners, executives, and teams Brett works with.
                  Watch it and you&apos;ll know whether he&apos;s right for your room.
                </p>
                {/* [America First] Initial text feedback from Lindsey Powers, day after the Aug 4, 2026 Super Ethical Sales & Team
                    Building session. Swap in the formal letter of recommendation when it arrives. */}
                <figure className="glass dquote">
                  <Quote className="dquote-mark" aria-hidden="true" />
                  <blockquote>&ldquo;Thank you again, Brett!! I heard some more great comments from our team that they really enjoyed your training!&rdquo;</blockquote>
                  <figcaption>
                    <span className="initials" aria-hidden="true">LP</span>
                    <span>
                      <span className="q-name">Lindsey Powers</span>
                      <span className="q-title">America First Credit Union · Super Ethical Sales &amp; Team Building, August 2026</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* What you can expect */}
          <section className="sec sec-paper" aria-labelledby="expect-title">
            <div className="rail">
              <h2 id="expect-title" className="h2 sec-title center" data-rise>What You Can <em>Expect</em></h2>
              <ul className="card-grid cols-3" data-stagger>
                {outcomes.map((o) => (
                  <li key={o.title} className="paper-card row-card">
                    <span className={`ico-badge${o.gold ? " is-gold" : ""}`} aria-hidden="true"><o.icon /></span>
                    <div>
                      <h3>{o.title}</h3>
                      <p>{o.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* One methodology */}
          <section className="sec sec-paper-2" aria-labelledby="method-title">
            <div className="rail narrow" data-rise>
              <h2 id="method-title" className="h2 sec-title center">One Methodology. <em>Four Ways It Transforms Your People.</em></h2>
              <div className="prose">
                <p>
                  Every Brett Lechtenberg keynote and training is built on the same foundation: the Master&apos;s Edge, a science-backed system for
                  inside-out transformation, grounded in a thesis reviewed by the Flow Research Collective and forged through 30 years of business
                  ownership and four decades on the martial arts mat.
                </p>
                <figure className="pull-fig">
                  <Quote className="pull-mark" aria-hidden="true" />
                  <blockquote>&ldquo;Excellent. The paper makes a compelling, empirical case for the utilization of flow for accelerated learning and skill acquisition.&rdquo;</blockquote>
                  <figcaption>&mdash; Flow Research Collective, on Brett&apos;s flow research</figcaption>
                </figure>
                <p>
                  Brett doesn&apos;t do off-the-shelf content, and he doesn&apos;t do shortcuts. As he puts it: &ldquo;Hacks are for hacks.&rdquo; What he
                  delivers instead is a custom-fit experience built from three pillars, First Principles to Clarify, Frontloading to Simplify, and Flow
                  to Maximize, then tailored to your room, your industry, and your outcomes.
                </p>
                <p>Choose the lane that matches the problem you&apos;re solving. The delivery is his. The transformation is yours.</p>
              </div>
            </div>
          </section>

          <LaneSection lane={lanes[0]} tone="sec-paper" />

          {/* Pull-quote band between Lane 1 and Lane 2 */}
          <section className="sec sec-night hacks" aria-label="Hacks are for hacks">
            <div className="rail center" data-rise>
              <Quote className="hacks-mark" aria-hidden="true" />
              <p className="display-2 hacks-q">&ldquo;Hacks are for <em>hacks</em>.&rdquo;</p>
              <p className="hacks-by">— Brett Lechtenberg</p>
            </div>
          </section>

          <LaneSection lane={lanes[1]} tone="sec-paper" />
          <LaneSection lane={lanes[2]} tone="sec-paper-2" />
          <LaneSection lane={lanes[3]} tone="sec-paper" />

          {/* Customization line */}
          <div className="custom-line">
            <p className="rail">
              All talks can be customized to your audience and event format.{" "}
              <Link href="/book-brett">Request a custom presentation</Link>
            </p>
          </div>

          {/* Brett in Action gallery (bento, no unverified stats) */}
          <section className="sec sec-night" aria-labelledby="gallery-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip chip-gold"><Camera aria-hidden="true" />Gallery</p>
                <h2 id="gallery-title" className="h2">Brett in <em>Action</em></h2>
                <p className="body-lg">From corporate boardrooms to championship teams, Brett delivers transformation everywhere.</p>
              </div>
              <ul className="bento" data-stagger>
                {galleryImages.map((image) => (
                  <li key={image.src} className={`bento-tile${image.size === "large" ? " is-large" : ""}`}>
                    <Image src={image.src} alt={image.alt} fill sizes={image.size === "large" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} />
                    <p className="bento-cap">{image.alt}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Speaking testimonials */}
          <section className="sec sec-paper" aria-label="What event hosts say">
            <div className="rail">
              <ul className="quote-grid" data-stagger>
                {quotes.map((t, i) => (
                  <li key={t.name} className="paper-card qcard">
                    <span className={`qcard-mark${i % 2 ? " is-gold" : ""}`} aria-hidden="true"><Quote /></span>
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <p className="qcard-by">
                      <span className="initials" aria-hidden="true">{t.initials}</span>
                      <span><span className="q-name">{t.name}</span><span className="q-title">{t.role}</span></span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Media kit block */}
          <section className="sec sec-night-2" aria-labelledby="kit-title">
            <div className="rail split split-even">
              <div className="kit-copy" data-rise>
                <h2 id="kit-title" className="h2">Everything Your <em>Event Team</em> Needs</h2>
                <p className="body-lg">
                  Planning an event is hard enough. Booking Brett is easy. The full media kit (speaker one-sheet, headshots, ready-to-read
                  introductions, and AV requirements) is one click away, ready to share with your committee.
                </p>
                <div><Btn href="/media-kit" variant="gold" size="lg">Get the Media Kit</Btn></div>
              </div>
              {/* [PLACEHOLDER: dedicated speaking reel; using homepage "Brett in Action" ABC4 video until a reel exists] */}
              <div data-rise>
                <VideoPoster
                  id="Dq7agUEBr6I"
                  title="Brett Lechtenberg on Good Things Utah"
                  poster="/horizon/good-things-utah-poster.jpg"
                  sizes="(min-width: 1024px) 600px, 92vw"
                  label={
                    <div className="video-label">
                      <span className="ico-badge" aria-hidden="true"><Play /></span>
                      <span><span className="v-name">Good Things Utah</span><span className="v-sub">ABC4 Utah - Peak Performance Interview</span></span>
                    </div>
                  }
                />
              </div>
            </div>
          </section>

          <FinalCta
            id="speaking-final"
            title="The First Step Is Always a Conversation"
            text={<>No pitch. No pressure. Just a genuine discussion about your event, your audience, and the transformation you want them to walk away with. If Brett&apos;s the right fit, you&apos;ll know. If he&apos;s not, he&apos;ll tell you and point you toward someone who is.</>}
            photo={{ src: "/heroes/speaking.jpg", w: 1920, h: 1280, pos: "40% 50%" }}
          >
            <Btn href="/book-brett" variant="gold" size="lg">Book Brett for Your Event</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

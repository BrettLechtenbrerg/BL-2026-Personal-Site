// HOME, "Horizon" design (Version D, built 30 Oct 2026 from the Horizon master: ~/dev/pts-style-mockups/HORIZON-D-MASTER.md).
// Words, links and numbers are unchanged from the previous home page (restore point: git tag pre-horizon-2026-10-30).
// Styles: src/styles/horizon.css (.bl-h). Motion, golden path and the click-to-play video: HorizonMotion.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { links } from "@/lib/utils";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const newTab = <span className="sr-only"> (opens in a new tab)</span>;

const pillars = [
  { main: "CLARIFY", sub: "Goals, Dreams, Desires" },
  { main: "SIMPLIFY", sub: "Life, Business, Relationships", gold: true },
  { main: "MAXIMIZE", sub: "Focus, Confidence, Actions, Results" },
];

// Official client order (Sep 27 2026): business clients, then chambers, USA Martial Arts last.
const logos = [
  { name: "America First Credit Union", src: "/logos/america-first.png", w: 1240, h: 403, px: 46 },
  { name: "Packsize", src: "/logos/packsize.png", w: 1016, h: 208, px: 30 },
  { name: "Purple", src: "/logos/purple.jpg", w: 174, h: 174, px: 60, mul: true },
  { name: "Thumbtack", src: "/logos/thumbtack.png", w: 1698, h: 756, px: 46 },
  { name: "MemberSolutions", src: "/logos/membersolutions.jpg", w: 190, h: 192, px: 60, mul: true },
  { name: "American Express", src: "/logos/american-express.png", w: 512, h: 512, px: 62 },
  { name: "Delta", src: "/logos/delta.png", w: 3840, h: 2160, px: 50 },
  { name: "Murray Chamber", src: "/logos/murray-chamber.png", w: 204, h: 126, px: 54 },
  { name: "Park City Chamber", src: "/logos/park-city-chamber.png", w: 5126, h: 1344, px: 36 },
  { name: "Heber Valley Chamber", src: "/logos/heber-valley-chamber.png", w: 2109, h: 1381, px: 54 },
  { name: "USA Martial Arts", src: "/logos/usa-martial-arts.png", w: 124, h: 185, px: 62 },
];

const steps = [
  {
    title: "First Principles",
    description:
      "Clarify. Strip away assumptions and see the real problem. Most people spend years solving the wrong problems because they never question the inherited beliefs underneath them.",
  },
  {
    title: "Frontloading",
    description:
      "Simplify. Be prepared, not surprised. Load the knowledge, tools, and mental frameworks you need before you face the challenge, not during and not after.",
  },
  {
    title: "Flow",
    description:
      "Maximize. Build the conditions for peak performance. Flow isn't random luck. It's a reproducible state with specific, measurable conditions.",
  },
];

// Pillar photos, crossfading behind the golden path (compass and climber: CC0, rawpixel 3285521 / 3336900).
const pillarPhotos = [
  { src: "/horizon/first-principles-compass.jpg", w: 1600, h: 1067 },
  { src: "/heroes/books.jpg", w: 1920, h: 1775 },
  { src: "/horizon/flow-climber.jpg", w: 1600, h: 1067 },
];

const pathways = [
  {
    title: "Speaking & Training",
    headline: "Your Audience Leaves Changed, Not Just Entertained",
    description:
      "Keynotes, workshops, and training sessions built on The Master's Edge methodology. Every session is customized. Every audience leaves with practical tools they can apply immediately.",
    href: "/speaking",
    cta: "Explore Speaking",
    img: { src: "/heroes/speaking.jpg", w: 1920, h: 1280, pos: "50% 50%" },
  },
  {
    title: "Executive Coaching",
    headline: "Become the Leader Your Business Needs You to Be",
    description:
      "One-on-one and team coaching through The Master's Edge program. We build a custom toolkit that fits you, your situation, and no one else.",
    href: "/coaching",
    cta: "Explore Coaching",
    img: { src: "/heroes/coaching.jpg", w: 1920, h: 2879, pos: "50% 25%" },
  },
  {
    title: "AI Advisory",
    headline: "Free Your People to Do What Only Humans Can",
    description:
      "Through Total Success AI, Brett helps businesses hand the repetitive tasks to AI, so your team can focus on relationships, creativity, and high-value work.",
    href: "/ai-advisory",
    cta: "Explore AI Advisory",
    img: { src: "/heroes/ai-advisory.jpg", w: 1920, h: 1080, pos: "60% 50%" },
  },
];

const stats = [
  { value: 30, suffix: "+", label: "Years in Business", color: "t-gold" },
  { value: 8, suffix: "", label: "Books Authored", sublabel: "(5 Bestsellers)", color: "t-cran" },
  { value: 8, suffix: "th", label: "Degree Black Belt", color: "t-gold" },
  { value: 1000, suffix: "'s", label: "Trained", color: "t-cran" },
];

const testimonials = [
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist, 3x Olympian",
    photo: { src: "/testimonials/bill-schuffenhauer.jpg", w: 400, h: 400 },
  },
  {
    quote:
      "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of initiatives for eight U.S. Presidents",
    photo: { src: "/testimonials/sam-beard.jpg", w: 224, h: 225 },
  },
];

const GAPS = ["Recognition", "Connection", "Ownership", "Feedback", "Vision", "Hiring"];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <div className="bl-h bl-h-home bl-h-motion">
          {/* HERO: the Limitless horizon at dusk; content-height, photo anchored to its top edge. */}
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-top">
              <div className="hero-media" aria-hidden="true" data-hero-media>
                <Image data-hero-img src="/horizon/limitless-horizon.jpg" alt="" width={3200} height={2133} sizes="100vw" preload />
                <div className="hero-dawn" data-dawn />
                <div className="hero-grade" />
                <div className="hero-sun" />
              </div>
              <div className="rail hero-grid">
                <div className="hero-content" data-hero-content>
                  <p className="eyebrow" data-hero-fade>Peak Performance Coaching</p>
                  <div className="horizon" data-horizon aria-hidden="true" />
                  <h1 id="hero-title" className="display">
                    <span className="line"><span>Achieve More</span></span>{" "}
                    <span className="line"><span><em>Without Doing More</em></span></span>
                  </h1>
                  <p className="lede" data-hero-fade>
                    Build the focus, leadership, and AI advantage to accomplish more, lead more effectively, and perform at your best, without adding more hours or overwhelm.
                  </p>
                  <div className="hero-ctas" data-hero-fade>
                    <a className="btn btn-cran" href={links.booking} {...ext}>
                      Talk With Brett
                      <ArrowRight className="ico arrow" aria-hidden="true" />
                      {newTab}
                    </a>
                    <Link className="btn btn-glass" href="/masters-edge">Learn More</Link>
                  </div>
                </div>
                <figure className="hero-portrait" data-hero-fade>
                  <div className="portrait-frame">
                    <Image
                      src="/media-kit/brett-twins-nobg.png"
                      alt="Brett Lechtenberg - Peak Performance Coach"
                      width={1545}
                      height={1999}
                      sizes="(min-width: 1024px) 470px, 420px"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </div>
                  <figcaption className="glass badge">
                    <span className="badge-v">30+</span>
                    <span className="badge-k">Years Experience</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            <ul className="rail pillars" aria-label="Clarify, Simplify, Maximize">
              {pillars.map((p) => (
                <li key={p.main} className={`glass pillar${p.gold ? " pillar-gold" : ""}`} data-pillar>
                  <span className="p-main">{p.main}</span>
                  <span className="p-sub">{p.sub}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CLIENT LOGOS */}
          <section className="logos" aria-labelledby="logos-title">
            <p className="rail logos-k" id="logos-title">Trusted by Leading Organizations</p>
            <div className="rail">
            <div className="logo-viewport">
              <ul className="logo-track animate-scroll">
                {[...logos, ...logos].map((l, i) => {
                  const dup = i >= logos.length;
                  return (
                    <li key={`${l.name}-${i}`} className="logo-tile" aria-hidden={dup || undefined} data-dup={dup || undefined}>
                      <Image
                        className={l.mul ? "mul" : undefined}
                        src={l.src}
                        alt={dup ? "" : l.name}
                        width={l.w}
                        height={l.h}
                        sizes="200px"
                        style={{ "--h": `${l.px}px` } as React.CSSProperties}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            </div>
          </section>

          {/* THE PROBLEM */}
          <section className="problem" aria-labelledby="problem-title">
            <div className="rail problem-inner" data-rise>
              <p className="kicker">You know there&apos;s more</p>
              <h2 id="problem-title" className="h2">
                You&apos;ve Built Something Real. <em>But Something&apos;s Missing.</em>
              </h2>
              <p className="body-lg">
                You&apos;ve worked hard to get here. Your business is running, your team is
                counting on you, and by most measures you&apos;re successful. But something
                doesn&apos;t match. The results don&apos;t reflect the effort. The days feel
                reactive instead of intentional. And the version of yourself you know is
                possible, the one who leads with clarity, operates in flow, and builds
                something truly extraordinary, keeps getting pushed to &quot;someday.&quot;
              </p>
              <p className="problem-turn">That gap isn&apos;t about working harder. It&apos;s about operating differently.</p>
            </div>
          </section>

          {/* THE MASTER'S EDGE: golden path through the three pillars */}
          <section className="journey" aria-labelledby="solution-title">
            <div className="journey-bg" aria-hidden="true">
              <div className="journey-bg-pin">
                {pillarPhotos.map((p, i) => (
                  <Image key={p.src} className={i === 0 ? "is-on" : undefined} data-jbg src={p.src} alt="" width={p.w} height={p.h} sizes="100vw" />
                ))}
              </div>
            </div>
            <div className="rail journey-grid">
              <div className="journey-copy" data-rise>
                <p className="kicker">The Master&apos;s Edge</p>
                <h2 id="solution-title" className="h2">A Proven System for <em>Peak Performance</em></h2>
                <p className="body-lg">
                  The Master&apos;s Edge is Brett&apos;s proprietary coaching methodology, built
                  on 30+ years of real-world business experience, flow state research
                  reviewed by the Flow Research Collective, and the same progressive mastery framework that creates black
                  belts.
                </p>
              </div>
              <div className="journey-map" data-map>
                <svg className="journey-svg" aria-hidden="true" focusable="false">
                  <path className="path-ghost" data-ghost d="" />
                  <path className="path-live" data-path d="" />
                </svg>
                <ol className="stops">
                  {steps.map((s) => (
                    <li key={s.title} className="stop" data-stop>
                      <span className="stop-node" data-node aria-hidden="true" />
                      <div className="stop-body">
                        <h3 className="stop-what">{s.title}</h3>
                        <p>{s.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="rail">
              <div className="glass result" data-rise>
                <p className="result-line">
                  The result? You <strong className="t-cran">Clarify</strong> what matters,{" "}
                  <strong className="t-gold">Simplify</strong> how you operate, and{" "}
                  <strong className="t-cran">Maximize</strong> your results.
                </p>
                <Link className="btn btn-gold" href="/masters-edge">Explore The Master&apos;s Edge</Link>
              </div>
            </div>
          </section>

          {/* HOW BRETT WORKS WITH YOU: three cards side by side */}
          <section className="pathways" aria-labelledby="pathways-title">
            <div className="rail">
              <h2 id="pathways-title" className="h2 pathways-head" data-rise>How Brett Works <em>With You</em></h2>
              <ul className="pathway-cards" data-stagger>
                {pathways.map((p) => (
                  <li key={p.title} className="slide">
                    <Image src={p.img.src} alt="" width={p.img.w} height={p.img.h} sizes="(min-width: 1024px) 420px, (min-width: 700px) 50vw, 92vw" style={{ objectPosition: p.img.pos }} />
                    <div className="glass slide-copy">
                      <p className="slide-k">{p.title}</p>
                      <h3>{p.headline}</h3>
                      <p className="slide-p">{p.description}</p>
                      <Link className="slide-link" href={p.href}>
                        {p.cta}
                        <ArrowRight className="ico" aria-hidden="true" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* WHY BRETT */}
          <section className="cred" aria-labelledby="cred-title">
            <div className="cred-media" aria-hidden="true">
              <Image data-drift src="/heroes/masters-edge.jpg" alt="" width={1920} height={1280} sizes="100vw" />
            </div>
            <div className="rail">
              <h2 id="cred-title" className="h2 cred-title" data-rise>Why <em>Brett</em></h2>
              <div className="glass cred-panel" data-rise>
                <ul className="stats">
                  {stats.map((s) => (
                    <li key={s.label}>
                      <span className={`stat-v ${s.color}`} data-count={s.value} data-suffix={s.suffix}>
                        {s.value.toLocaleString("en-US")}{s.suffix}
                      </span>
                      <span className="stat-l">{s.label}</span>
                      {s.sublabel && <span className="stat-s">{s.sublabel}</span>}
                    </li>
                  ))}
                </ul>
                <p className="body-lg">
                  Brett Lechtenberg is a peak performance coach, speaker, and author who
                  has spent three decades helping people discover who they&apos;re meant to
                  become. As the creator of{" "}
                  <strong>The Master&apos;s Edge</strong>, an
                  8th-degree black belt with over 40 years in martial arts, and a flow
                  state researcher whose work was reviewed by the{" "}
                  <strong className="t-gold">Flow Research Collective</strong>, Brett
                  brings a depth of real-world experience that most coaches simply
                  can&apos;t match.
                </p>
                <p className="cred-turn">
                  He only teaches what he&apos;s tested in his own business. That&apos;s the
                  difference.
                </p>
                <Link className="btn btn-gold" href="/about">More About Brett</Link>
              </div>
            </div>
          </section>

          {/* IN THEIR WORDS */}
          <section className="words" aria-labelledby="words-title">
            <div className="words-media" aria-hidden="true">
              <Image data-drift src="/heroes/testimonials.jpg" alt="" width={1920} height={1280} sizes="100vw" />
            </div>
            <div className="rail">
              <div className="words-head" data-rise>
                <p className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</p>
                <h2 id="words-title" className="h2">In Their <em>Words</em></h2>
              </div>
              <div className="quotes">
                {testimonials.map((t) => (
                  <figure key={t.name} className="glass quote" data-rise>
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption>
                      <Image src={t.photo.src} alt="" width={t.photo.w} height={t.photo.h} sizes="60px" />
                      <span>
                        <span className="q-name">{t.name}</span>
                        <span className="q-title">{t.title}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="center" data-rise>
                <Link className="btn btn-cran" href="/testimonials">
                  See More Testimonials
                  <ArrowRight className="ico arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* ROCKSTAR TEAM QUIZ */}
          <section className="quiz" aria-labelledby="quiz-title">
            <div className="rail quiz-grid">
              <div className="quiz-art" data-rise>
                <Image src="/images/quiz/gap-recognition.webp" alt="Team celebrating a win: recognition" width={1536} height={1024} sizes="(min-width: 1024px) 300px, 46vw" />
                <Image src="/images/quiz/gap-vision.webp" alt="Leader pointing a team toward a shared vision" width={1662} height={946} sizes="(min-width: 1024px) 300px, 46vw" />
              </div>
              <div className="quiz-copy" data-rise>
                <p className="kicker">Free 2-Minute Diagnostic</p>
                <h2 id="quiz-title" className="h2">
                  What&apos;s the #1 gap between you and a <em>rockstar team</em>?
                </h2>
                <p className="body-lg">
                  6 quick questions. Get your biggest team-building gap diagnosed,
                  and get the complete <em>How To Build A Rockstar Team</em> book that
                  fixes it, free.
                </p>
                <ul className="gaps">
                  {GAPS.map((gap) => <li key={gap}>{gap}</li>)}
                </ul>
                <Link className="btn btn-cran" href="/rockstar-team-quiz">
                  Take the free quiz
                  <ArrowRight className="ico arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* BRETT IN ACTION: the YouTube player loads only on Play */}
          <section className="media" aria-labelledby="media-title">
            <div className="rail">
              <div className="media-head" data-rise>
                <p className="kicker">As Seen On</p>
                <h2 id="media-title" className="h2">Brett in <em>Action</em></h2>
                <p className="body-lg">Watch Brett share insights on peak performance, flow state, and The Master&apos;s Edge methodology.</p>
              </div>
              <div className="media-grid">
                <div data-rise>
                  <div className="vplayer" data-yt="Dq7agUEBr6I" data-yt-title="Brett Lechtenberg on Good Things Utah">
                    <a className="vposter" href="https://www.youtube.com/watch?v=Dq7agUEBr6I" {...ext} aria-label="Play video: Brett Lechtenberg on Good Things Utah (plays from YouTube)">
                      <Image src="/horizon/good-things-utah-poster.jpg" alt="" width={1280} height={720} sizes="(min-width: 1024px) 840px, 92vw" />
                      <span className="vplay" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="video-label">
                    <span>
                      <span className="v-name">Good Things Utah</span>
                      <span className="v-sub">ABC4 Utah: Peak Performance Interview</span>
                    </span>
                  </div>
                </div>
                <aside className="featured" data-rise aria-labelledby="featured-title">
                  <h3 id="featured-title" className="h3">Featured On</h3>
                  <ul className="feat-list">
                    <li>
                      <Image src="/logos/good-things-utah.webp" alt="Good Things Utah" width={900} height={506} sizes="80px" />
                      <span><span className="f-name">Good Things Utah</span><span className="f-sub">ABC4 Utah</span></span>
                    </li>
                    <li>
                      <span className="f-mark f-cran" aria-hidden="true">CW30</span>
                      <span><span className="f-name">The Daily Dish</span><span className="f-sub">CW30 Utah</span></span>
                    </li>
                    <li>
                      <span className="f-mark f-gold" aria-hidden="true">Profiles</span>
                      <span><span className="f-name">Profiles in Caring</span><span className="f-sub">Community Feature</span></span>
                    </li>
                  </ul>
                  <div className="feat-stats">
                    <p><span className="fs-v t-gold">250+</span><span className="fs-l">Talks &amp; Trainings</span></p>
                    <p><span className="fs-v t-cran">8</span><span className="fs-l">Published Books</span></p>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* FINAL CALL TO ACTION: back to the horizon */}
          <section className="final" aria-labelledby="final-title">
            <div className="final-media" aria-hidden="true">
              <Image data-drift src="/horizon/limitless-horizon.jpg" alt="" width={3200} height={2133} sizes="100vw" />
            </div>
            <div className="rail">
              <div className="glass final-panel" data-rise>
                <h2 id="final-title" className="display-2">The First Step Is Always a <em>Conversation</em></h2>
                <p className="body-lg">
                  No pitch. No pressure. Just a genuine discussion about where you are,
                  where you want to be, and whether The Master&apos;s Edge is the right fit.
                </p>
                <a className="btn btn-cran btn-lg" href="https://www.speaktobrett.com" {...ext}>
                  Talk With Brett{newTab}
                </a>
              </div>
            </div>
          </section>
          <HorizonMotion />
        </div>
      </main>
      <Footer />
    </>
  );
}

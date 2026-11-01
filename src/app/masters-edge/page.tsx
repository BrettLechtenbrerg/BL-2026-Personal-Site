// THE MASTER'S EDGE (methodology), "Horizon" design (Group 1, 30 Oct 2026). Words unchanged (tag pre-horizon-inner-2026-10-30).
import Link from "next/link";
import { Brain, Building2, Sparkles, Target, Wrench, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Book3D, Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const foundations = [
  {
    icon: Target,
    title: "First Principles Thinking",
    drives: "CLARIFY",
    description:
      "Strip away assumptions and see the real problem. Most people spend years solving the wrong problem because they never question the beliefs they inherited. We question them until the real target is obvious.",
  },
  {
    icon: Sparkles,
    title: "Frontloading",
    drives: "SIMPLIFY",
    description:
      "Be prepared, not surprised. We load the knowledge, tools, and mental frameworks you need before the hard moment arrives, so it finds you ready instead of scrambling.",
    gold: true,
  },
  {
    icon: Zap,
    title: "Flow",
    drives: "MAXIMIZE",
    description:
      "Flow isn't random luck. It's a repeatable state with specific, measurable conditions. We set up the environment, routines, and triggers that let your best work show up on purpose.",
  },
];

const pillars = [
  {
    icon: Brain,
    title: "Mindset Mastery",
    subtitle: "Focus • Resilience • Confidence",
    description:
      "Before you can change what you do, you have to change how you think. We build the focus, resilience, and confidence that hold up under pressure.",
  },
  {
    icon: Wrench,
    title: "Skillset Enhancement",
    subtitle: "Tools • Techniques • Practice",
    description:
      "Once your mindset is right, we build the practical skills. Specific, high-impact tools matched to your situation, not a generic template.",
  },
  {
    icon: Building2,
    title: "Systems Design",
    subtitle: "Systems • Habits • Environment",
    description:
      "The piece most programs miss. We design the environment, systems, and routines that keep peak performance going long after the session ends.",
  },
];

export default function MastersEdgePage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="me-title"
            eyebrow={<>The Master&apos;s Edge</>}
            lines={["The Methodology Behind the", <em key="t">Transformation</em>]}
            lede="A science-backed coaching system, custom-built to help business leaders, teams, and people like you reach peak performance. Built on 30+ years of real-world experience and flow state research reviewed by the Flow Research Collective."
            photo={{ src: "/heroes/masters-edge.jpg", alt: "Mountain peak at sunrise representing transformation", w: 1920, h: 1280, pos: "60% 40%" }}
          >
            <Btn href={links.booking} external size="lg" arrow>Book a Conversation</Btn>
          </PageHero>

          {/* The promise */}
          <section className="sec sec-paper" aria-labelledby="promise-title">
            <div className="rail narrow" data-rise>
              <h2 id="promise-title" className="h2 sec-title center">It Starts With a <em>Promise</em></h2>
              <div className="paper-card prose center">
                <p>
                  Every Master&apos;s Edge engagement begins the same way:{" "}
                  <em className="ink">We will build a custom set of tools that fits you, your situation, and no one else.</em>
                </p>
                <p>
                  This is not a pre-packaged program. There are no templates borrowed from someone else&apos;s success story. The Master&apos;s Edge is a
                  diagnostic, science-backed process that identifies the specific gaps between where you are and where you&apos;re capable of being, then
                  builds a custom toolkit to close them.
                </p>
              </div>
            </div>
          </section>

          {/* Three layers */}
          <section className="sec sec-night" aria-labelledby="layers-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <h2 id="layers-title" className="h2">Three Layers. <em>One System.</em></h2>
                <p className="body-lg">The Master&apos;s Edge has three layers. Each one builds on the one below it. Skip a layer and the system breaks.</p>
              </div>

              <h3 className="layer-k" data-rise>Layer 1: The Science (Three Pillars)</h3>
              <ul className="card-grid cols-3 layer" data-stagger>
                {foundations.map((f) => (
                  <li key={f.title} className="glass gcard">
                    <span className={`ico-badge${f.gold ? " is-gold" : ""}`} aria-hidden="true"><f.icon /></span>
                    <p className="tag">→ Drives {f.drives}</p>
                    <h4>{f.title}</h4>
                    <p>{f.description}</p>
                  </li>
                ))}
              </ul>

              <h3 className="layer-k" data-rise>Layer 2: The Methodology (Mind, Skills, Systems)</h3>
              <ul className="card-grid cols-3 layer" data-stagger>
                {pillars.map((p) => (
                  <li key={p.title} className="glass gcard">
                    <span className="ico-badge" aria-hidden="true"><p.icon /></span>
                    <h4>{p.title}</h4>
                    <p className="phase-sub">{p.subtitle}</p>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>

              <div className="glass layer3" data-rise>
                <div className="layer3-line" aria-hidden="true" />
                <h3 className="layer3-k">Layer 3: The Transformation</h3>
                <p className="layer3-words">
                  <span className="t-cran">CLARIFY.</span> <span className="t-gold">SIMPLIFY.</span> <span className="t-cran">MAXIMIZE.</span>
                </p>
                <p className="body-lg">
                  This is what happens to the person who goes through The Master&apos;s Edge. You get crystal clear about what you really want. You simplify
                  how you operate. And you maximize your life, your business, and your impact.
                </p>
              </div>
            </div>
          </section>

          {/* Research */}
          <section className="sec sec-paper" aria-labelledby="research-title">
            <div className="rail narrow" data-rise>
              <h2 id="research-title" className="h2 sec-title center">Built on <em>Research</em>, Not Theory</h2>
              <div className="prose">
                <p>Most peak performance programs are built on concepts borrowed from books. The Master&apos;s Edge is built on original research.</p>
                <p>
                  Brett conducted a formal research thesis testing whether deliberate manipulation of flow states could accelerate how fast people learn
                  complex skills and how long they retain them. The research was reviewed by the{" "}
                  <strong>Flow Research Collective</strong>, Steven Kotler&apos;s peak performance research organization.
                </p>
                <blockquote className="pull">
                  <p>&ldquo;Excellent. The paper makes a compelling, empirical case for the utilization of flow for accelerated learning and skill acquisition.&rdquo;</p>
                  <cite>— Flow Research Collective</cite>
                </blockquote>
              </div>
            </div>
          </section>

          {/* The book */}
          <section className="sec sec-paper-2" aria-labelledby="book-title">
            <div className="rail narrow split" data-rise>
              <Link href="/books/masters-edge" className="book3d-link cover-3d">
                <Book3D src="/books/masters-edge-cover.jpg" alt="The Master's Edge by Brett Lechtenberg, book cover" w={800} h={1200} spine="/horizon/books/masters-edge-spine.jpg" spineColor="#efe9df" depth={0.093} sizes="250px" />
              </Link>
              <div className="book-copy">
                <p className="kicker">New Book · Out Now</p>
                <h2 id="book-title" className="h2">Read the Whole Method in <em>The Master&apos;s Edge</em></h2>
                <p className="body-lg">
                  Brett&apos;s new book puts the full system in your hands: nineteen chapters on Mindset, Skillset, and Systems Design, each taught parable
                  first, principle second, practice always. In paperback and on Kindle.
                </p>
                <div className="hero-ctas">
                  <Btn href={links.mastersEdgePaperback} external size="lg">Buy the Book on Amazon</Btn>
                  <Btn href="/books/masters-edge" variant="ink" size="lg">About the Book</Btn>
                </div>
              </div>
            </div>
          </section>

          <FinalCta
            id="me-final"
            title="The First Step Is Always a Conversation"
            text={<>No pitch. No pressure. Just a genuine discussion about where you are, where you want to be, and whether The Master&apos;s Edge is the right fit.</>}
            photo={{ src: "/heroes/masters-edge.jpg", w: 1920, h: 1280, pos: "60% 45%" }}
          >
            <Btn href={links.booking} external variant="gold" size="lg">Book a Conversation</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

// COACHING, "Horizon" design (Group 1, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
import { ChevronRight, Sparkles, Target, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const phases = [
  {
    phase: "Phase 1",
    title: "CLARIFY",
    subtitle: "First Principles Diagnostic",
    description:
      "We strip away assumptions and surface-level symptoms to find what's actually happening. What are the real problems? What inherited patterns are creating invisible ceilings?",
    icon: Target,
  },
  {
    phase: "Phase 2",
    title: "SIMPLIFY",
    subtitle: "Frontloaded Toolkit",
    description:
      "We build the specific tools, frameworks, and systems you need before the next high-stakes moment demands them. Every tool is built for you. There are no templates.",
    icon: Sparkles,
    gold: true,
  },
  {
    phase: "Phase 3",
    title: "MAXIMIZE",
    subtitle: "Flow State Operation",
    description:
      "With clarity achieved and the right systems in place, peak performance becomes accessible. You stop surviving and start operating from intention, flow, and compounding results.",
    icon: Zap,
  },
];

const problems = [
  "Revenue that's plateaued despite increasing effort",
  "Days consumed by operational firefighting instead of strategy",
  "A team that depends on you for every decision",
  "Personal relationships and well-being suffering under the weight",
  "The nagging feeling that you're capable of much more",
];

const results = [
  {
    quote: "I have been blown away with the powerful mindset tools, branding systems, and business building strategies. I added 43 percent to my best month of the year.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance",
    stat: "+43%",
    statLabel: "Revenue",
  },
  {
    quote: "Brett has an innate ability to break down complicated subjects into easy to learn and quick to implement subject matter. He has helped me motivate my staff, implement more cash generation systems, and build a culture of fun and positive growth.",
    name: "John Nottingham",
    title: "Sword and Shield Security",
  },
];

const faqs = [
  {
    q: "Who is The Master's Edge coaching for?",
    a: "Business owners, executives, and leaders who know they're capable of more but can't identify what's holding them back. People who have tried generic programs and found them too broad.",
  },
  {
    q: "How is this different from other coaching programs?",
    a: "Two things. First, every tool we build is custom. There are no templates. Second, the methodology is grounded in original flow state research reviewed by the Flow Research Collective.",
  },
  {
    q: "How long does it take to see results?",
    a: "Most clients experience a shift in clarity and mindset within the first few sessions. Tangible business results typically emerge within 60 to 90 days.",
  },
];

export default function CoachingPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="coaching-title"
            eyebrow="Executive & Business Coaching"
            lines={[<>Become the Leader Your Business <em>Needs</em></>, "You to Be"]}
            lede={<>The Master&apos;s Edge coaching program builds a custom toolkit around your specific goals, challenges, and situation. It&apos;s grounded in the science of peak performance and tested over decades of real-world results.</>}
            photo={{ src: "/heroes/coaching-hero.webp", alt: "Brett Lechtenberg - Executive Coach", w: 3828, h: 1672, pos: "22% 30%" }}
            side="right"
          >
            <Btn href={links.booking} external size="lg" arrow>Start a Conversation</Btn>
          </PageHero>

          {/* The problem */}
          <section className="sec sec-paper" aria-labelledby="ceiling-title">
            <div className="rail narrow">
              <div className="sec-head" data-rise>
                <h2 id="ceiling-title" className="h2">You&apos;ve Hit a Ceiling. And Working Harder <em>Isn&apos;t Breaking Through It.</em></h2>
                <p className="body-lg">
                  You&apos;ve built a successful business through determination and hard work. But now the strategies that got you here aren&apos;t getting you
                  further. You might be experiencing:
                </p>
              </div>
              <ul className="ticks" data-stagger>
                {problems.map((item) => (
                  <li key={item}><ChevronRight aria-hidden="true" /><span>{item}</span></li>
                ))}
              </ul>
              <div className="callout callout-night center ceiling-turn" data-rise>
                <p>
                  You don&apos;t need another course, another book, or another podcast. You need a system that changes how you operate,{" "}
                  <span className="t-gold">from the inside out.</span>
                </p>
              </div>
            </div>
          </section>

          {/* The process */}
          <section className="sec sec-night" aria-labelledby="process-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <h2 id="process-title" className="h2">How The Master&apos;s Edge <em>Coaching Works</em></h2>
                <p className="body-lg">
                  Every engagement begins with the same promise:{" "}
                  <em className="promise">We will build a custom set of tools that fits you, your situation, and no one else.</em>
                </p>
              </div>
              <ul className="card-grid cols-3" data-stagger>
                {phases.map((p) => (
                  <li key={p.phase} className="glass gcard center">
                    <span className={`ico-badge${p.gold ? " is-gold" : ""}`} aria-hidden="true"><p.icon /></span>
                    <p className="tag">{p.phase}</p>
                    <h3 className={`big ${p.gold ? "t-gold" : "t-cran"}`}>{p.title}</h3>
                    <p className="phase-sub">{p.subtitle}</p>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Results */}
          <section className="sec sec-paper" aria-labelledby="results-title">
            <div className="rail narrow">
              <h2 id="results-title" className="h2 sec-title center" data-rise>Real Results From <em>Real Clients</em></h2>
              <div className="row-list" data-stagger>
                {results.map((t) => (
                  <figure key={t.name} className="paper-card pquote">
                    {t.stat && <div className="stat-chip"><b>{t.stat}</b><span>{t.statLabel}</span></div>}
                    <div>
                      <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption>
                        <span className="initials" aria-hidden="true">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                        <span><span className="q-name">{t.name}</span><span className="q-title">{t.title}</span></span>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Common questions */}
          <section className="sec sec-night-2" aria-labelledby="faq-title">
            <div className="rail narrow">
              <h2 id="faq-title" className="h2 sec-title center" data-rise>Common <em>Questions</em></h2>
              <div className="faq" data-stagger>
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <FinalCta
            id="coaching-final"
            title="The First Step Is Always a Conversation"
            text={<>Not a sales call. A real conversation about where you are, where you want to be, and whether The Master&apos;s Edge is the right fit.</>}
            photo={{ src: "/heroes/coaching.jpg", w: 1920, h: 2879, pos: "50% 30%" }}
          >
            <Btn href={links.booking} external variant="gold" size="lg">Start a Conversation</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

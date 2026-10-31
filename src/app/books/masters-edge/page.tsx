// THE MASTER'S EDGE (book), "Horizon" design (Group 3, 30 Oct 2026). Words unchanged from the previous page
// (tag pre-horizon-inner-2026-10-30). Paperback and Kindle links are the same Amazon links as before.
import Image from "next/image";
import Link from "next/link";
import { Brain, Dumbbell, Lightbulb, Quote, ScrollText, ShoppingCart, Sparkles, Swords, Tablet, Workflow } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Book3D, Btn, FinalCta, HorizonPage, NewTab, PageHero, ext } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const pillars = [
  {
    icon: Brain,
    title: "First Principles (Clarify)",
    description:
      "Strip away assumptions and see the real problem. Most people spend years solving the wrong problems because they never question the beliefs underneath them.",
  },
  {
    icon: Swords,
    title: "Frontloading (Simplify)",
    description:
      "Be prepared, not surprised. Load the knowledge, tools, and mental frameworks you need before the challenge shows up, not during and not after.",
    gold: true,
  },
  {
    icon: Workflow,
    title: "Flow (Maximize)",
    description:
      "Flow isn't random luck. It's a repeatable state with specific conditions you can set up on purpose, so pressure turns into presence.",
  },
];

// The 19 chapter topics, in book order (manuscript, Oct 2026).
const chapters = [
  "The Master's Edge",
  "Acceptance",
  "Personal Responsibility",
  "Fixed vs Growth Mindset",
  "Optimism",
  "Resilience",
  "Tenacity",
  "G.R.I.T.",
  "Anti-Anxiety",
  "Personal Confidence",
  "Lead With Your Strengths",
  "Compassionate Communication",
  "Goal Setting",
  "Consistency",
  "Help First",
  "The Trust Trinity",
  "Engineering Flow",
  "Strong Ethical Character",
  "The Six Pillars: Building Systems That Teach",
];

const howItTeaches = [
  {
    title: "Parable first",
    icon: ScrollText,
    description: "Every chapter opens with a short parable, so the lesson lands before the explanation starts.",
  },
  {
    title: "Principle second",
    icon: Lightbulb,
    gold: true,
    description: "Then the idea underneath the story, in plain language, so you know why it works and when to use it.",
  },
  {
    title: "Practice always",
    icon: Dumbbell,
    description:
      "Then exercises you can put to work right away. Every framework was tested on real students in Brett's academy before he taught it to a business audience.",
  },
];

function BuyButtons() {
  return (
    <>
      <Btn href={links.mastersEdgePaperback} external variant="gold" size="lg"><ShoppingCart className="ico" aria-hidden="true" />Buy the Paperback</Btn>
      <Btn href={links.mastersEdgeKindle} external variant="glass" size="lg"><Tablet className="ico" aria-hidden="true" />Get It on Kindle</Btn>
    </>
  );
}

export default function MastersEdgeBookPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="book-title"
            eyebrow={<><Sparkles className="eyebrow-ico" aria-hidden="true" />New Book: Out Now in Paperback and on Kindle</>}
            lines={["The Master's", <em key="e">Edge</em>]}
            pre={
              <>
                <p className="book-sub">Mastering Business and Life Through Mindset, Skillset, and Systems Design</p>
                <p className="book-tag">Ancient Discipline · Modern Leadership</p>
              </>
            }
            lede="Mastery is a system you can build, on the mat and in the boardroom. Brett has taught it for more than thirty years to students, families, and business owners. The Master's Edge puts that system in your hands."
            photo={{ src: "/heroes/masters-edge.jpg", alt: "", w: 1920, h: 1280, pos: "60% 40%" }}
            aside={
              <a className="book3d-link" href={links.mastersEdgePaperback} {...ext} aria-label="Buy The Master's Edge on Amazon (opens in a new tab)">
                <Book3D
                  src="/books/masters-edge-cover.jpg"
                  alt="Cover of The Master's Edge: Mastering Business and Life Through Mindset, Skillset, and Systems Design, by Brett Lechtenberg"
                  w={800}
                  h={1200}
                  spine="/horizon/books/masters-edge-spine.jpg"
                  spineColor="#efe9df"
                  depth={0.093}
                  sizes="(min-width: 1024px) 300px, 260px"
                  preload
                />
              </a>
            }
          >
            <BuyButtons />
            <p className="hero-note">Available on Amazon. 253 pages.</p>
          </PageHero>

          {/* About the book */}
          <section className="sec sec-paper" aria-labelledby="about-book-title">
            <div className="rail narrow">
              <div className="center" data-rise>
                <h2 id="about-book-title" className="h2 sec-title">The same path that forges a black belt <em>forges a master.</em></h2>
                <div className="prose">
                  <p>
                    Its nineteen chapters grew out of a decade of monthly leadership lessons and cover three disciplines: Mindset, Skillset, and Systems
                    Design. You&apos;ll work through acceptance, resilience, flow, trust, and ethical character.
                  </p>
                  <p>Every chapter shows how its skill works on both sides of your front door: in your business and at home.</p>
                </div>
              </div>
            </div>
            {/* How each chapter teaches: three steps joined by a gold line, in the full-width rail (Brett, 30 Oct: the
                narrow three boxes looked cramped). Step numbers come from CSS so the page text stays the same. */}
            <div className="rail">
              <ol className="teach-steps" data-stagger>
                {howItTeaches.map((step) => (
                  <li key={step.title} className="paper-card teach-step">
                    <span className={`ico-badge${"gold" in step && step.gold ? " is-gold" : ""}`} aria-hidden="true"><step.icon /></span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* The science */}
          <section className="sec sec-night" aria-labelledby="science-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <h2 id="science-title" className="h2">The Science <em>Behind It</em></h2>
                <p className="body-lg">
                  One methodology, three pillars. It&apos;s the same framework Brett teaches from corporate keynotes to the 12-week Master&apos;s Edge
                  program, and the book closes with his flow research thesis, reviewed by the Flow Research Collective.
                </p>
              </div>
              <ul className="card-grid cols-3" data-stagger>
                {pillars.map((p) => (
                  <li key={p.title} className="glass gcard">
                    <span className={`ico-badge${p.gold ? " is-gold" : ""}`} aria-hidden="true"><p.icon /></span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Chapters */}
          <section className="sec sec-paper-2" aria-labelledby="inside-title">
            <div className="rail narrow">
              <div className="sec-head center" data-rise>
                <h2 id="inside-title" className="h2">What&apos;s Inside the <em>Book</em></h2>
                <p className="body-lg">Nineteen chapters, each one a skill you can practice.</p>
              </div>
              <ol className="chapters" data-stagger>
                {chapters.map((chapter, i) => (
                  <li key={chapter}>
                    <span className="ch-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ch-name">{chapter}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Praise */}
          <section className="sec sec-night-2 praise" aria-label="Praise for the book">
            <figure className="rail praise-fig" data-rise>
              <Quote className="praise-mark" aria-hidden="true" />
              <blockquote>&ldquo;Brett Lechtenberg is one of the most multi-talented people I have ever met.&rdquo;</blockquote>
              <figcaption>
                <span className="portrait" aria-hidden="true">
                  <Image src="/testimonials/sam-beard.jpg" alt="" fill sizes="64px" style={{ objectPosition: "38% 22%" }} />
                </span>
                <span>
                  <span className="q-name">Sam Beard</span>
                  <span className="q-title">Creator of 6 Presidential Programs for 8 United States Presidents · Founder, National Development Council</span>
                </span>
              </figcaption>
            </figure>
          </section>

          <FinalCta
            id="book-final"
            title={<>Get Your <em>Copy</em></>}
            text={<>Read it in paperback or on Kindle. Want Brett to bring the method to your team in person, or copies for your event? Let&apos;s talk.</>}
            photo={{ src: "/heroes/masters-edge.jpg", w: 1920, h: 1280, pos: "50% 60%" }}
          >
            <div className="final-ctas"><BuyButtons /></div>
            <div className="final-links">
              <a href={links.booking} {...ext}>Talk With Brett →<NewTab /></a>
              <Link href="/speaking">Bring It to Your Team →</Link>
              <Link href="/masters-edge">Explore the Methodology →</Link>
            </div>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

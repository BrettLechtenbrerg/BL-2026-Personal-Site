// ABOUT, "Horizon" design (Group 1, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Brett's picks (30 Oct): top photo = his 8th Dan certificate from Grand Master Na; The Journey = the travelling golden line.
import Image from "next/image";
import { Award, BookOpen, Brain, Building, Bot, GraduationCap, Handshake, Landmark, ShieldCheck, Tv } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";
import { Journey, type TimelineItem } from "./Journey";

const timeline: TimelineItem[] = [
  {
    year: "1980s",
    title: "The Journey Begins",
    description: "Started martial arts training, beginning a lifelong pursuit of mastery and discipline that would shape everything to come.",
    image: { src: "/timeline/8th-dan.webp", w: 1130, h: 734 },
  },
  {
    year: "1990s",
    title: "Founds Personal Mastery Martial Arts",
    description: "Opened Personal Mastery Martial Arts & Family Success Center in Sandy, Utah, a living laboratory for testing peak performance principles.",
    image: { src: "/timeline/pmma-logo.webp", w: 2250, h: 2527 },
  },
  {
    year: "2000s",
    title: "Author & Speaker Emerges",
    description: "Published first books on safety, time management, and personal empowerment. Began speaking at corporations and conferences nationwide.",
    image: { src: "/timeline/anti-bully.webp", w: 500, h: 383 },
  },
  {
    year: "2010s",
    title: "Flow State Research",
    description: "Completed formal research thesis on flow states and accelerated learning. Reviewed by the Flow Research Collective (Steven Kotler's organization).",
    image: { src: "/timeline/thesis.webp", w: 2166, h: 1558 },
  },
  {
    year: "2020s",
    title: "The Master's Edge is Born",
    description: "Synthesized 30+ years of experience into a proprietary coaching methodology. Began working with executives, business owners, and high performers.",
    image: { src: "/timeline/masters-edge.webp", w: 768, h: 1206 },
  },
  {
    year: "Today",
    title: "Total Success AI & Beyond",
    description: "Co-founded Total Success AI to bring human-centered AI implementation to businesses. Continues coaching, speaking, and transforming lives.",
    // TSAI logo checked with ~/dev/forge/engines/guards/logo_guard.py (30 Oct 2026: correct logo).
    image: { src: "/timeline/tsai-logo.webp", w: 1080, h: 1080 },
  },
];

const credentials = [
  {
    icon: Building,
    title: "30+ Years as a Business Owner",
    description:
      "Brett founded Personal Mastery Martial Arts & Family Success Center in Sandy, Utah and has run it for over three decades. It's been his laboratory, the place where every strategy was tested before it was ever taught.",
  },
  {
    icon: Award,
    title: "8th-Degree Black Belt, 40+ Years in Martial Arts",
    description:
      "More than a rank, it's a way of thinking. The same progressive mastery, discipline, and flow state awareness that creates black belts is the foundation of The Master's Edge.",
    gold: true,
  },
  {
    icon: Brain,
    title: "Flow State Researcher",
    description:
      "Brett completed a formal research thesis on using flow states to speed up human learning. The research was reviewed by the Flow Research Collective, Steven Kotler's peak performance organization.",
  },
  {
    icon: BookOpen,
    title: "Author of 8 Books (5 Bestsellers)",
    description:
      "From time management to family safety to personal empowerment, Brett's books reflect the breadth of his expertise. His newest is The Master's Edge (October 2026), which follows Powerful AI Strategies for Business Owners (August 2026).",
    gold: true,
  },
  {
    icon: Bot,
    title: "Co-Founder of Total Success AI",
    description:
      "Brett brings the same Master's Edge methodology to AI adoption, helping businesses implement technology in a way that puts people first.",
  },
];

const also = [
  { icon: Landmark, text: "32nd-Degree Master Mason" },
  { icon: ShieldCheck, text: "3x graduate of International Training Commission Executive Protection School", gold: true },
  { icon: GraduationCap, text: "BA in Business Operations, Western Washington University" },
  { icon: Tv, text: "Featured on Good Things Utah, Channel 4, Channel 13", gold: true },
  { icon: Handshake, text: "Trusted by America First Credit Union, American Express, Delta Airlines, Citigroup" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="about-title"
            eyebrow="About Brett"
            lines={["30 Years of Watching", <><em>Impossible Transformations</em> Happen</>]}
            lede={<>Brett Lechtenberg has spent three decades helping people discover who they&apos;re meant to become through martial arts, coaching, speaking, writing, and mentorship.</>}
            photo={{ src: "/horizon/about-8th-dan-certificate.jpg", alt: "Brett Lechtenberg receiving his 8th Dan certificate from Grand Master Na", w: 1494, h: 1410, pos: "58% 16%", beside: true }}
          />

          {/* How It Started */}
          <section className="sec sec-paper" aria-labelledby="started-title">
            <div className="rail narrow" data-rise>
              <h2 id="started-title" className="h2 sec-title">How It <em>Started</em></h2>
              <div className="paper-card prose">
                <p>I still remember the moment everything changed.</p>
                <p>
                  I was working with a shy, anxious kid who wouldn&apos;t make eye contact. His parents were desperate. School was a struggle. Other
                  activities had failed. They&apos;d brought him to martial arts as a last resort.
                </p>
                <p>
                  Three months later, that same kid walked into my office, looked me straight in the eye, and said:{" "}
                  <em className="ink">&ldquo;Thank you for believing in me when I didn&apos;t believe in myself.&rdquo;</em>
                </p>
                <p>
                  That&apos;s when I realized: the kicks and punches were never the point. They were just the delivery system for something much bigger.
                  What I was really teaching was transformation. Self-belief. The discovery of who someone was always capable of being.
                </p>
                <div className="callout callout-night">
                  <p>
                    That was over 25 years ago. Since then, I&apos;ve watched thousands of transformations like that one. And I&apos;ve learned something:
                    everyone has <span className="t-gold">extraordinary potential</span> inside them. Most people just need someone to see it first.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Journey items={timeline} />

          {/* The Experience Behind the Method */}
          <section className="sec sec-paper" aria-labelledby="experience-title">
            <div className="rail narrow">
              <h2 id="experience-title" className="h2 sec-title center" data-rise>The Experience Behind the <em>Method</em></h2>
              <ul className="row-list" data-stagger>
                {credentials.map((c) => (
                  <li key={c.title} className="paper-card row-card">
                    <span className={`ico-badge${c.gold ? " is-gold" : ""}`} aria-hidden="true"><c.icon /></span>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="honors">
                <h3 className="honors-title" data-rise>Also</h3>
                <ul className="honors-grid" data-stagger>
                  {also.map((h) => (
                    <li key={h.text} className="honor">
                      <span className={`ico-badge${h.gold ? " is-gold" : ""}`} aria-hidden="true"><h.icon /></span>
                      <p>{h.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* What I Believe */}
          <section className="sec sec-paper-2" aria-labelledby="believe-title">
            <div className="rail narrow" data-rise>
              <h2 id="believe-title" className="h2 sec-title center">What I <em>Believe</em></h2>
              <div className="paper-card prose">
                <p>
                  In 30 years, I&apos;ve never met someone without extraordinary potential. I&apos;ve only met people who haven&apos;t discovered it yet.
                </p>
                <p>
                  The best teachers don&apos;t create followers. They create leaders who no longer need them. That&apos;s always been my goal. Not to
                  impress you with what I know, but to unlock what&apos;s already inside you.
                </p>
                <div className="callout callout-cran">
                  <p>
                    I don&apos;t teach theory. I teach what I&apos;ve tested. In my own business, on my own mat, with my own team. If it hasn&apos;t worked
                    for me, I don&apos;t teach it to you.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Beyond Business */}
          <section className="sec sec-night-2" aria-labelledby="beyond-title">
            <div className="rail narrow split" data-rise>
              <div className="round-photo">
                <Image src="/heroes/family.webp" alt="Brett Lechtenberg with family" width={703} height={703} sizes="300px" />
              </div>
              <div className="beyond-copy">
                <h2 id="beyond-title" className="h2">Beyond <em>Business</em></h2>
                <p className="body-lg">
                  Brett lives in Sandy, Utah with his family. When he&apos;s not coaching, training, or speaking, you&apos;ll find him at Personal Mastery
                  Martial Arts, still on the mat, still learning, still practicing what he teaches.
                </p>
              </div>
            </div>
          </section>

          <FinalCta id="about-final" title={<>Let&apos;s Talk About What&apos;s Possible</>} photo={{ src: "/horizon/limitless-horizon.jpg", w: 3200, h: 2133, pos: "46% 35%" }}>
            <Btn href={links.booking} external variant="gold" size="lg">Talk With Brett</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

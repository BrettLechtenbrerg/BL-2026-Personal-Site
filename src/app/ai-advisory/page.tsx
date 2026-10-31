// AI ADVISORY, "Horizon" design (Group 2, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Top photo: the site's larger AI photo (the old one was 275 px wide, too small for a full-width top), softened slightly
// (public/horizon/ai-advisory-soft.jpg) because its fine wires made it 3x heavier than the other page tops; same description.
import Image from "next/image";
import { BarChart3, Brain, Clock, Cog, GraduationCap, Handshake, Rocket, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const tiers = [
  {
    icon: GraduationCap,
    title: "Teach You",
    subtitle: "Foundational",
    description:
      "We train your team to understand and use AI effectively. From foundational literacy to advanced prompt engineering.",
    bestFor: "Teams new to AI who want to build internal capability",
  },
  {
    icon: Handshake,
    title: "Do It With You",
    subtitle: "Collaborative",
    description:
      "We work alongside your team to implement AI into your specific workflows, training programs, and operations.",
    bestFor: "Businesses ready to integrate AI but wanting expert guidance",
    gold: true,
  },
  {
    icon: Cog,
    title: "Do It For You",
    subtitle: "Full Service",
    description:
      "We handle the full AI implementation, from strategy to custom tool development to managed services.",
    bestFor: "Organizations that want AI handled from start to finish",
  },
];

const impactAreas = [
  { icon: Rocket, title: "Future-Proofing", description: "Anticipate market trends and position your business ahead of change" },
  { icon: Brain, title: "Prompt Engineering", description: "Learn to communicate with AI tools effectively, saving massive time and money", gold: true },
  { icon: Zap, title: "Business Automation", description: "Automate repetitive tasks so your team can focus on high-value work" },
  { icon: Sparkles, title: "Content Creation", description: "Generate, improve, and repurpose content at scale", gold: true },
];

const threeStepProcess = [
  {
    title: "AI Impact Analysis",
    points: [
      "We analyze your workflows and show you how AI can save time, cut costs, and boost revenue.",
      "Get clarity on which AI tools will give you the biggest return on your investment.",
    ],
  },
  {
    title: "Precision Tool Selection",
    points: [
      "Set clear goals with our team and get AI recommendations tailored to your business.",
      "We help you choose tools that streamline operations and improve your bottom line.",
    ],
  },
  {
    title: "Effortless Integration",
    gold: true,
    points: [
      "We implement AI for you or guide you every step of the way.",
      "Achieve smooth adoption without the overwhelm or guesswork.",
    ],
  },
];

const whatWeBring = [
  {
    icon: TrendingUp,
    title: "Stay Ahead of The Curve",
    description: "AI training and future-proofing strategies help you stay ahead of the curve. You adapt faster when the market shifts, spot new opportunities sooner, and keep a real competitive edge.",
  },
  {
    icon: Clock,
    title: "Increased Efficiency and Productivity",
    description: "AI-driven tools can handle repetitive, data-heavy tasks far more quickly and accurately than humans, freeing up time for more strategic or creative work. By automating routine processes, AI helps improve efficiency, reduce costs, and streamline overall operations.",
  },
  {
    icon: BarChart3,
    title: "Deeper Insights and Better Decision-Making",
    description: "AI algorithms can analyze large amounts of data in real time and provide actionable insights, uncover patterns, and predict trends. That helps business owners and their teams make better-informed decisions, stay ahead of market shifts, and sharpen their strategies.",
  },
];

export default function AIAdvisoryPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="ai-title"
            eyebrow="AI Advisory · Powered by Total Success AI"
            lines={["Free Your People to Do", <>What Only <em>Humans</em> Can</>]}
            lede={<>AI isn&apos;t here to replace your team. It&apos;s here to handle the repetitive so they can focus on what matters: relationships, creativity, and high-value work. Through Total Success AI, Brett helps businesses implement AI the right way.</>}
            photo={{ src: "/horizon/ai-advisory-soft.jpg", alt: "Brett Lechtenberg - AI Advisory", w: 1920, h: 1080, pos: "62% 45%" }}
            wide
          >
            <Btn href={links.booking} external size="lg" arrow>Talk With Brett About AI</Btn>
          </PageHero>

          {/* The approach */}
          <section className="sec sec-paper" aria-labelledby="approach-title">
            <div className="rail narrow" data-rise>
              <h2 id="approach-title" className="h2 sec-title center">AI Done Right Starts With <em>People</em>, Not Technology</h2>
              <div className="paper-card prose center">
                <p>
                  Most AI consultants lead with the technology. We lead with the problem. Using the same first-principles approach that powers The
                  Master&apos;s Edge, we start by understanding what your business actually needs. Then we build AI tools that serve your people, not the
                  other way around.
                </p>
              </div>
            </div>
          </section>

          {/* The 3-step process */}
          <section className="sec sec-night" aria-labelledby="process-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip chip-gold"><Zap aria-hidden="true" />Proven Methodology</p>
                <h2 id="process-title" className="h2">Our Proven <em>3-Step Process</em></h2>
                <p className="body-lg">Three steps that take you from &ldquo;where do we start?&rdquo; to AI that&apos;s working in your business.</p>
              </div>
              <ol className="card-grid cols-3 steps" data-stagger>
                {threeStepProcess.map((step, index) => (
                  <li key={step.title} className="glass gcard step">
                    <span className="step-num" aria-hidden="true">{index + 1}</span>
                    <p className="tag">STEP {index + 1}</p>
                    <h3>{step.title}</h3>
                    <ul className="step-points">
                      {step.points.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Three tiers */}
          <section className="sec sec-paper" aria-labelledby="tiers-title">
            <div className="rail">
              <h2 id="tiers-title" className="h2 sec-title center" data-rise>Choose Your Level of <em>Support</em></h2>
              <ul className="card-grid cols-3" data-stagger>
                {tiers.map((tier) => (
                  <li key={tier.title} className="paper-card tier">
                    <span className={`ico-badge${tier.gold ? " is-gold" : ""}`} aria-hidden="true"><tier.icon /></span>
                    <p className="kicker">{tier.subtitle}</p>
                    <h3>{tier.title}</h3>
                    <p>{tier.description}</p>
                    <p className="tier-best"><b>Best for:</b> {tier.bestFor}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Impact areas */}
          <section className="sec sec-paper-2" aria-labelledby="impact-title">
            <div className="rail">
              <h2 id="impact-title" className="h2 sec-title center" data-rise>Four Areas Where AI Creates <em>Immediate Impact</em></h2>
              <ul className="card-grid cols-2" data-stagger>
                {impactAreas.map((area) => (
                  <li key={area.title} className="paper-card row-card">
                    <span className={`ico-badge${area.gold ? " is-gold" : ""}`} aria-hidden="true"><area.icon /></span>
                    <div>
                      <h3>{area.title}</h3>
                      <p>{area.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What we bring */}
          <section className="sec sec-night-2" aria-labelledby="bring-title">
            <div className="rail">
              <h2 id="bring-title" className="h2 sec-title center" data-rise>What Brett and His Team Will Bring To <em>Your Business</em></h2>
              <ul className="card-grid cols-3" data-stagger>
                {whatWeBring.map((item, i) => (
                  <li key={item.title} className="glass gcard">
                    <span className={`ico-badge${i === 1 ? " is-gold" : ""}`} aria-hidden="true"><item.icon /></span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Total Success AI */}
          <section className="sec sec-paper" aria-labelledby="tsai-title">
            <div className="rail narrow center tsai" data-rise>
              {/* TSAI logo checked with ~/dev/forge/engines/guards/logo_guard.py (30 Oct 2026: correct logo). */}
              <span className="tsai-logo"><Image src="/timeline/tsai-logo.webp" alt="Total Success AI Logo" width={96} height={96} /></span>
              <h2 id="tsai-title" className="h2">Powered by <em>Total Success AI</em></h2>
              <p className="body-lg">
                Brett&apos;s AI advisory services are delivered through Total Success AI, co-founded with Manny Torres. Visit Total Success AI for deeper
                AI consulting, implementation, and custom tools.
              </p>
              <div><Btn href={links.ai} external size="lg" arrow>Visit Total Success AI</Btn></div>
            </div>
          </section>

          <FinalCta
            id="ai-final"
            title="Not Sure Where to Start With AI?"
            text={<>Let&apos;s have a conversation about your business, your team, and where AI could create the most impact.</>}
            photo={{ src: "/horizon/ai-advisory-soft.jpg", w: 1920, h: 1080, pos: "60% 50%" }}
          >
            <Btn href={links.booking} external variant="gold" size="lg">Talk With Brett</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

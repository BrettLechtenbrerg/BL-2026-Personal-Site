// THE MASTER'S EDGE PROGRAM (12 weeks), "Horizon" design (Group 2, 30 Oct 2026). Words unchanged from the previous page
// (tag pre-horizon-inner-2026-10-30). Prices removed 31 Oct 2026 (Brett is changing pricing models): the old Investment
// section is now "Two Ways to Work With Brett" (group and personal coaching, no prices).
import Image from "next/image";
import {
  BookOpen, Check, Clock, FileText, Filter, MessageCircle, Rocket, Sparkles, Target, Users, Video, Wrench, X, Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";
import { ProgramFaq } from "./ProgramFaq";

// Phase data for the 12-week program
const phases = [
  {
    phase: 1,
    title: "CLARIFY",
    weeks: "Weeks 1 to 4",
    tagline: "",
    accent: "cranberry",
    icon: Target,
    weeks_detail: [
      { week: 1, title: "First Principles Audit", desc: "Identify where your time, energy, attention, and leadership are being drained." },
      { week: 2, title: "Identity and Standards Reset", desc: "Define the standards, habits, and identity required for your next level." },
      { week: 3, title: "Energy Architecture", desc: "Build a more intentional structure for managing your physical, mental, and emotional energy." },
      { week: 4, title: "Focus and Elimination", desc: "Cut noise, remove friction, and create greater clarity around what matters most." },
    ],
  },
  {
    phase: 2,
    title: "SIMPLIFY",
    weeks: "Weeks 5 to 8",
    tagline: "",
    accent: "gold",
    icon: Filter,
    weeks_detail: [
      { week: 5, title: "Decision-Making Under Pressure", desc: "Make stronger decisions with less hesitation and more confidence." },
      { week: 6, title: "Leadership Rhythm and Presence", desc: "Strengthen how you lead yourself and others through consistency, presence, and intention." },
      { week: 7, title: "Operational Simplicity", desc: "Reduce complexity and build cleaner systems for execution." },
      { week: 8, title: "Communication and Alignment", desc: "Improve how you communicate expectations, priorities, and direction." },
    ],
  },
  {
    phase: 3,
    title: "MAXIMIZE",
    weeks: "Weeks 9 to 12",
    tagline: "",
    accent: "gradient",
    icon: Rocket,
    weeks_detail: [
      { week: 9, title: "Flow State Engineering", desc: "Create the conditions for deeper focus, better performance, and higher-quality output." },
      { week: 10, title: "Performance Under Stress", desc: "Develop the ability to stay steady, clear, and effective when pressure rises." },
      { week: 11, title: "Sustainable High Performance", desc: "Build a rhythm that supports strong results without constant burnout." },
      { week: 12, title: "Integration and Expansion", desc: "Turn what you have learned into a long-term way of operating, leading, and performing." },
    ],
  },
];

// What's included items
const included = [
  {
    icon: Users,
    title: "12 weekly live group coaching sessions",
    desc: "",
  },
  {
    icon: FileText,
    title: "Custom diagnostic assessment",
    desc: "",
  },
  {
    icon: Wrench,
    title: "The Master's Edge Toolkit",
    desc: "",
  },
  {
    icon: MessageCircle,
    title: "Private community access",
    desc: "",
  },
  {
    icon: Video,
    title: "2 private 1:1 coaching sessions",
    desc: "",
  },
  {
    icon: Zap,
    title: "Flow state research materials",
    desc: "",
  },
  {
    icon: Clock,
    title: "30 days of post-program support",
    desc: "",
  },
  {
    icon: BookOpen,
    title: "Lifetime access to program materials",
    desc: "",
  },
];

// Who it's for / not for
const forYou = [
  "You are a business owner, executive, or leader who has built real momentum and knows you are still operating below your full capability",
  "You are ready to strengthen focus, leadership, execution, and performance",
  "You have found other coaching too generic or too surface-level",
  "You are willing to be honest, do the work, and apply what you learn",
  "You want a more intentional system for how you lead and operate",
  "You value being part of a small group of serious, growth-minded people",
];

const notForYou = [
  "You are looking for a quick fix",
  "You want motivation without implementation",
  "You are not ready to change how you currently operate",
  "You are unwilling to look honestly at what is not working",
  "You are simply shopping for the cheapest option",
];

// Brett's stats
const stats = [
  { value: "30+", label: "Years Coaching Experience" },
  { value: "250+", label: "Talks, Trainings & Seminars" },
  { value: "100+", label: "Businesses Coached" },
  { value: "8", label: "Books" },
  { value: "8th", label: "Degree Black Belt" },
];

// Testimonials
const testimonials = [
  {
    quote: "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist\u00a0· 3-Time Olympian",
    initials: "BS",
  },
  {
    quote: "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of Initiatives for Eight U.S. Presidents",
    initials: "SB",
  },
  {
    quote: "Brett has an innate ability to break down complicated subjects into easy to learn and quick to implement subject matter. He has helped me motivate my staff, implement more cash generation systems, and build a culture of fun and positive growth.",
    name: "John Nottingham",
    title: "Sword and Shield Security",
    initials: "JN",
  },
  {
    quote: "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
    name: "Matt Gibbons",
    title: "President, Murray Area Chamber of Commerce",
    initials: "MG",
  },
  {
    quote: "Excellent. The paper makes a compelling, empirical case for the utilization of flow for accelerated learning and skill acquisition.",
    name: "Flow Research Collective",
    title: "Steven Kotler's Peak Performance Organization",
    initials: "FRC",
  },
  {
    quote: "I have been blown away with the powerful mindset tools, branding systems, and business building strategies. I added 43 percent to my best month of the year.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance",
    initials: "RB",
    highlight: "+43% Revenue",
  },
];

// FAQ items
const faqs = [
  {
    q: "When does the next cohort start?",
    a: "The next cohort start date will be shared after your application is reviewed and approved.",
  },
  {
    q: "How much time should I expect to commit each week?",
    a: "Plan for the live coaching session, implementation time, and reflection. This program is designed for real growth, not passive consumption.",
  },
  {
    q: "Is this virtual or in person?",
    a: "The program is delivered virtually so you can participate from anywhere.",
  },
  {
    q: "What if I miss a session?",
    a: "If you miss a live session, you will still have access to the program materials and support.",
  },
  {
    q: "How is this different from 1:1 coaching?",
    a: "The Master's Edge combines the power of live coaching, structured curriculum, practical tools, and a small-group environment that creates momentum, insight, and accountability.",
  },
  {
    q: "Is there a refund policy?",
    a: "Please review the program terms during the application process. If you have questions before applying, book a conversation first.",
  },
  {
    q: "What if I still have questions?",
    a: "Book a short conversation and we will talk through where you are, what you want, and whether this program is the right fit.",
  },
];

// Client logos ("Trusted by teams at:")
const programLogos = [
  { name: "America First Credit Union", src: "/logos/america-first.png" },
  { name: "American Express", src: "/logos/american-express.png" },
  { name: "Delta", src: "/logos/delta.png" },
  { name: "Packsize", src: "/logos/packsize.png" },
  { name: "Purple", src: "/logos/purple.jpg" },
  { name: "Thumbtack", src: "/logos/thumbtack.png" },
  { name: "Member Solutions", src: "/logos/membersolutions.jpg" },
  { name: "Murray Chamber", src: "/logos/murray-chamber.png" },
  { name: "Heber Valley Chamber", src: "/logos/heber-valley-chamber.png" },
  { name: "Park City Chamber", src: "/logos/park-city-chamber.png" },
  { name: "USA Martial Arts", src: "/logos/usa-martial-arts.png" },
];

export default function MastersEdgeProgramPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="program-title"
            eyebrow={<><Sparkles className="eyebrow-ico" aria-hidden="true" />Limited Enrollment for each Cohort</>}
            lines={["12 Weeks That Change How You", <><em>Focus</em>, <em>Lead</em>, <em>Operate</em>, and <em>Perform</em></>]}
            lede={<>The Master&apos;s Edge is a 12-week group coaching program for business owners and leaders who want sharper focus, stronger leadership, better execution, and a more intentional way to operate in business and life. Applications are now open for the upcoming cohorts.</>}
            photo={{ src: "/heroes/masters-edge.jpg", alt: "Mountain peak at sunrise representing transformation", w: 1920, h: 1280, pos: "60% 40%" }}
            wide
          >
            <Btn href="/masters-edge-program/apply" size="lg" arrow>Apply Now (Limited to 12 Members)</Btn>
            <Btn href="#program" variant="glass" size="lg">See What&apos;s Inside</Btn>
          </PageHero>

          {/* Who it's for */}
          <section className="sec sec-paper" aria-labelledby="who-title">
            <div className="rail narrow" data-rise>
              <h2 id="who-title" className="h2 sec-title">Who This Program Is For</h2>
              <div className="prose">
                <p>
                  The Master&apos;s Edge is built for business owners, executives, and growth-minded leaders who have already achieved meaningful success but
                  know they are still operating below their full capability.
                </p>
                <p>
                  If you are carrying too much, reacting too often, struggling to maintain focus, or leading without the structure and rhythm you know you
                  need, this program was designed for you.
                </p>
                <p>Over 12 weeks, you will learn how to:</p>
                <ul className="ticks">
                  {["Clarify what matters most", "Lead with more confidence and consistency", "Simplify the way you operate", "Make better decisions with less hesitation", "Build a stronger system for execution, energy, and performance"].map((t) => (
                    <li key={t}><Check aria-hidden="true" /><span>{t}</span></li>
                  ))}
                </ul>
                <p>This is not generic motivation. It is a structured coaching experience designed to help you operate at a higher level in business and life.</p>
              </div>
            </div>
          </section>

          {/* The gap */}
          <section className="problem" aria-labelledby="off-title">
            <div className="rail problem-inner" data-rise>
              <h2 id="off-title" className="h2">You&apos;ve Built Something Real. <em>But Something&apos;s Off.</em></h2>
              <div className="prose prose-dark">
                <p>You&apos;ve built something meaningful. From the outside, it may look like things are working. Revenue is solid. The team is growing. People see progress.</p>
                <p><strong>But you know there is another level you have not fully stepped into yet.</strong></p>
                <p>
                  Too many days still feel reactive instead of intentional. The same problems keep showing up. The business depends on you more than it
                  should. And the version of yourself you know is possible, the one who leads with clarity, operates from flow, and performs at a higher
                  level, keeps getting pushed further down the road.
                </p>
                <p>That gap is not about working harder. It is about building a different way to operate.</p>
              </div>
              <p className="problem-turn">The Master&apos;s Edge Program is that system.</p>
            </div>
          </section>

          {/* Twelve weeks, three phases */}
          <section id="program" className="sec sec-paper-2" aria-labelledby="phases-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <h2 id="phases-title" className="h2">12 Weeks. Three Phases. <em>One Transformation.</em></h2>
                <p className="body-lg">This program is designed to move you from scattered and reactive to clear, structured, and high-performing.</p>
                <p className="body-lg">Every week builds on the last. By Week 12, you&apos;ll have more than a set of new tools. You&apos;ll have a new way of running your week.</p>
              </div>
              <ol className="card-grid cols-3 phases" data-stagger>
                {phases.map((phase) => (
                  <li key={phase.phase} className={`paper-card phase is-${phase.accent}`}>
                    <div className="phase-top">
                      <span className={`ico-badge${phase.accent === "gold" ? " is-gold" : ""}`} aria-hidden="true"><phase.icon /></span>
                      <div>
                        <p className="kicker">Phase {phase.phase}</p>
                        <h3>{phase.title}</h3>
                      </div>
                    </div>
                    <p className="phase-weeks">{phase.weeks}</p>
                    <ol className="weeks">
                      {phase.weeks_detail.map((week) => (
                        <li key={week.week}>
                          <p className="wk">Week {week.week}</p>
                          <p className="wk-title">{week.title}</p>
                          <p className="wk-desc">{week.desc}</p>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* What's included */}
          <section className="sec sec-night" aria-labelledby="included-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <h2 id="included-title" className="h2">Everything You Get in <em>The Master&apos;s Edge Program</em></h2>
                <p className="body-lg">This is a high-touch coaching experience designed to give you both transformation and practical tools you can use immediately.</p>
              </div>
              <ul className="included" data-stagger>
                {included.map((item, i) => (
                  <li key={item.title} className="glass">
                    <span className={`ico-badge${i % 2 ? " is-gold" : ""}`} aria-hidden="true"><item.icon /></span>
                    <h3>{item.title}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* For / not for */}
          <section className="sec sec-paper" aria-labelledby="fit-title">
            <div className="rail">
              <h2 id="fit-title" className="h2 sec-title center" data-rise>This Program Is <em>Not for Everyone</em></h2>
              <div className="fit" data-stagger>
                <div className="paper-card fit-yes">
                  <h3><span className="fit-ico" aria-hidden="true"><Check /></span>This program is for you if...</h3>
                  <ul>
                    {forYou.map((item, i) => <li key={i}><Check aria-hidden="true" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <div className="paper-card fit-no">
                  <h3><span className="fit-ico" aria-hidden="true"><X /></span>This program is not for you if...</h3>
                  <ul>
                    {notForYou.map((item, i) => <li key={i}><X aria-hidden="true" /><span>{item}</span></li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Built by Brett */}
          <section className="sec sec-night-2" aria-labelledby="built-title">
            <div className="rail">
              <h2 id="built-title" className="h2 sec-title center" data-rise>Built by Someone Who&apos;s <em>Done the Work</em></h2>
              <div className="builtby">
                <div className="builtby-photo" data-rise>
                  <Image src="/media-kit/brett-twins-nobg.png" alt="Brett Lechtenberg" fill sizes="(min-width: 1024px) 420px, 80vw" />
                </div>
                <div className="builtby-copy" data-rise>
                  <div className="prose prose-dark">
                    <p>Brett Lechtenberg has spent decades helping people and organizations think, lead, and perform at a higher level.</p>
                    <p>
                      With more than 30 years of coaching, training, and leadership experience, Brett has worked with business owners, teams, and
                      organizations across a wide range of industries. His work blends real-world leadership development, flow state research, personal
                      discipline, and high-performance strategy into a practical system that creates lasting change.
                    </p>
                    <p>
                      He has delivered 250+ talks, trainings, and seminars, coached 100+ businesses, written eight books (five of them bestsellers), and
                      spent more than 40 years immersed in martial arts and human performance.
                    </p>
                    <p>Brett only teaches what he has tested himself. That is the difference.</p>
                  </div>
                  <ul className="mini-stats">
                    {stats.map((stat, i) => (
                      <li key={stat.label}><b className={i % 2 ? "t-cran" : "t-gold"}>{stat.value}</b><span>{stat.label}</span></li>
                    ))}
                  </ul>
                  <div className="trusted">
                    <p>Trusted by teams at:</p>
                    <ul className="logo-grid">
                      {programLogos.map((logo) => (
                        <li key={logo.name}><Image src={logo.src} alt={logo.name} fill sizes="120px" /></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* In their words */}
          <section className="sec sec-paper" aria-labelledby="words-title">
            <div className="rail">
              <h2 id="words-title" className="h2 sec-title center" data-rise>In Their <em>Words</em></h2>
              <ul className="quote-grid cols-3" data-stagger>
                {testimonials.map((t) => (
                  <li key={t.name} className="paper-card tcard">
                    <p className="tcard-q">&quot;{t.quote}&quot;</p>
                    {t.highlight && <p className="tcard-hi">{t.highlight}</p>}
                    <p className="qcard-by">
                      <span className="initials" aria-hidden="true">{t.initials}</span>
                      <span><span className="q-name">{t.name}</span><span className="q-title">{t.title}</span></span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Coaching options: Brett is changing his pricing models (31 Oct 2026), so no prices are shown.
              Wording uses only facts stated elsewhere on the site (this program; the one-on-one /coaching page). */}
          <section className="sec sec-night" aria-labelledby="options-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="kicker">Coaching Options</p>
                <h2 id="options-title" className="h2">Two Ways to Work <em>With Brett</em></h2>
                <p className="body-lg">
                  Choose the format that fits how you grow best: alongside a small group of leaders, or one-on-one with Brett.
                  The details and investment for each are shared personally in your conversation with Brett.
                </p>
              </div>
              <div className="prices" data-stagger>
                <div className="glass price is-best">
                  <p className="price-badge">Small Group · 12 Weeks</p>
                  <h3>Group Coaching</h3>
                  <p className="price-model">The Master&apos;s Edge Cohort</p>
                  <p className="price-desc">
                    Grow alongside a small group of business owners and leaders who are working on the same things you are. The
                    group creates momentum, insight, and accountability.
                  </p>
                  <ul className="price-list">
                    <li><Check aria-hidden="true" />12 weekly live group coaching sessions</li>
                    <li><Check aria-hidden="true" />Private 1:1 sessions with Brett</li>
                    <li><Check aria-hidden="true" />Custom diagnostic assessment and The Master&apos;s Edge Toolkit</li>
                    <li><Check aria-hidden="true" />Private community and post-program support</li>
                    <li><Check aria-hidden="true" />Limited to 12 members per cohort</li>
                  </ul>
                  <Btn href="/masters-edge-program/apply" variant="gold" size="lg">Apply for the Cohort</Btn>
                </div>
                <div className="glass price">
                  <p className="price-badge">Private · Custom</p>
                  <h3>Personal Coaching</h3>
                  <p className="price-model">One-on-One With Brett</p>
                  <p className="price-desc">
                    A fully custom engagement built around your goals, your business, and your situation, using the same
                    Master&apos;s Edge methodology applied only to you.
                  </p>
                  <ul className="price-list">
                    <li><Check aria-hidden="true" />One-on-one coaching sessions with Brett</li>
                    <li><Check aria-hidden="true" />A custom toolkit that fits you and no one else</li>
                    <li><Check aria-hidden="true" />First Principles, Frontloading, and Flow, tailored to your situation</li>
                    <li><Check aria-hidden="true" />Also available for leadership teams</li>
                  </ul>
                  <Btn href="/coaching" size="lg">Explore Personal Coaching</Btn>
                </div>
              </div>
              <div className="price-talk" data-rise>
                <p>Not sure yet? Book a free 15-minute conversation with Brett. No pitch. No pressure. Just a real discussion about whether this is the right fit.</p>
                <Btn href={links.booking} external variant="glass">Book a 15-Minute Conversation</Btn>
              </div>
            </div>
          </section>

          {/* Common questions */}
          <section className="sec sec-paper-2" aria-labelledby="faq-title">
            <div className="rail narrow">
              <h2 id="faq-title" className="h2 sec-title center" data-rise>Common <em>Questions</em></h2>
              <ProgramFaq faqs={faqs} />
            </div>
          </section>

          <FinalCta
            id="program-final"
            title="The First Step Is Always a Conversation"
            text={<>No pitch. No pressure. Just a real conversation about where you are, where you want to go, and whether The Master&apos;s Edge is the right next step.</>}
            photo={{ src: "/heroes/masters-edge.jpg", w: 1920, h: 1280, pos: "60% 45%" }}
          >
            <div className="final-ctas">
              <Btn href="/masters-edge-program/apply" variant="gold" size="lg">Apply Now</Btn>
              <Btn href={links.booking} external variant="glass" size="lg">Book a Conversation</Btn>
            </div>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

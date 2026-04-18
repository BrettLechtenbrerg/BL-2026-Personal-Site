"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Target,
  Filter,
  Rocket,
  Users,
  FileText,
  Wrench,
  MessageCircle,
  Video,
  BookOpen,
  Clock,
  Sparkles,
  Check,
  X,
  ChevronDown,
  Award,
  Mic,
  Building2,
  BookMarked,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Phase data for the 12-week program
const phases = [
  {
    phase: 1,
    title: "CLARIFY",
    weeks: "Weeks 1-4",
    tagline: "Strip away the noise. Find the real problems. Build the foundation.",
    accent: "cranberry",
    icon: Target,
    weeks_detail: [
      { week: 1, title: "The First Principles Audit", desc: "Identify inherited beliefs and invisible ceilings" },
      { week: 2, title: "Values Architecture", desc: "Align daily operations with what actually matters" },
      { week: 3, title: "Priority Mapping", desc: "The Frontloading Framework for decision-making" },
      { week: 4, title: "The Clarity Checkpoint", desc: "Your custom diagnostic and Phase 2 blueprint" },
    ],
  },
  {
    phase: 2,
    title: "SIMPLIFY",
    weeks: "Weeks 5-8",
    tagline: "Eliminate what doesn't serve you. Build systems that do.",
    accent: "gold",
    icon: Filter,
    weeks_detail: [
      { week: 5, title: "The Frontloading System", desc: "Load knowledge and tools before you need them" },
      { week: 6, title: "Energy Architecture", desc: "Design your days around peak performance windows" },
      { week: 7, title: "The Elimination Protocol", desc: "Remove the 80% that produces nothing" },
      { week: 8, title: "System Building", desc: "Your custom operating system for daily execution" },
    ],
  },
  {
    phase: 3,
    title: "MAXIMIZE",
    weeks: "Weeks 9-12",
    tagline: "With clarity and systems in place, unlock your highest gear.",
    accent: "gradient",
    icon: Rocket,
    weeks_detail: [
      { week: 9, title: "Flow State Engineering", desc: "The conditions for consistent peak performance" },
      { week: 10, title: "Performance Optimization", desc: "Compound the gains across business and life" },
      { week: 11, title: "Scaling Your Edge", desc: "Extend your operating system to your team" },
      { week: 12, title: "The Master's Edge Integration", desc: "Lock in the transformation, build forward" },
    ],
  },
];

// What's included items
const included = [
  {
    icon: Users,
    title: "12 Weekly Group Coaching Sessions",
    desc: "90-minute sessions with Brett. Small group (max 8). Live, interactive, not a webinar.",
  },
  {
    icon: FileText,
    title: "Custom Diagnostic Assessment",
    desc: "Personalized assessment at Week 1 and Week 12 to measure your transformation quantitatively.",
  },
  {
    icon: Wrench,
    title: "The Master's Edge Toolkit",
    desc: "Proprietary frameworks, worksheets, and tools built for your specific situation. Not templates. Custom.",
  },
  {
    icon: MessageCircle,
    title: "Private Community Access",
    desc: "Direct access to Brett and your cohort between sessions. Accountability, support, and real-time problem-solving.",
  },
  {
    icon: Video,
    title: "2 Private 1:1 Sessions with Brett",
    desc: "One at the start (Week 1) and one at the midpoint (Week 6). 45 minutes each. Just you and Brett.",
  },
  {
    icon: Zap,
    title: "Flow State Research Materials",
    desc: "Brett's original research on deliberate flow manipulation, validated by the Flow Research Collective. Not available anywhere else.",
  },
  {
    icon: Clock,
    title: "30-Day Post-Program Support",
    desc: "The program doesn't end at Week 12. You get 30 days of continued access to the community and one final check-in call.",
  },
  {
    icon: BookOpen,
    title: "Lifetime Access to Program Materials",
    desc: "Every framework, worksheet, and recording. Yours forever.",
  },
];

// Who it's for / not for
const forYou = [
  "You're a business owner, executive, or leader making $150K+ and you know you're operating below your capability",
  "You've tried coaching programs before and found them too generic",
  "You're willing to do the work, not just consume content",
  "You want a custom system, not a one-size-fits-all framework",
  "You value small groups where you get real attention, not a 500-person cohort",
];

const notForYou = [
  "You're looking for a quick fix or magic bullet",
  "You're not willing to be honest about what's not working",
  "You just want motivation without implementation",
  "You're looking for the cheapest option available",
  "You're not ready to change how you operate",
];

// Brett's stats
const stats = [
  { value: "30+", label: "Years Experience" },
  { value: "100+", label: "Speaking Events" },
  { value: "50+", label: "Corporate Clients" },
  { value: "7", label: "Books Authored" },
  { value: "8th", label: "Degree Black Belt" },
];

// Testimonials
const testimonials = [
  {
    quote: "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "3x Olympian, Olympic Silver Medalist",
    initials: "BS",
  },
  {
    quote: "I have been blown away with the powerful mindset tools, branding systems, and business building strategies. I added 43 percent to my best month of the year.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance",
    initials: "RB",
    highlight: "43%",
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
];

// FAQ items
const faqs = [
  {
    q: "When does the next cohort start?",
    a: "The founding cohort is forming now. Once we have 6-8 committed members, we lock the start date (typically within 2-3 weeks of filling). You'll know your exact start date within 48 hours of being accepted.",
  },
  {
    q: "What day and time are the sessions?",
    a: "Sessions are scheduled based on the cohort's availability. We find a time that works for everyone before we start. Most cohorts meet on a weekday evening or Saturday morning.",
  },
  {
    q: "How much time commitment is required per week?",
    a: "Plan for 3-4 hours per week: the 90-minute group session plus implementation time for your custom toolkit. The tools are designed to integrate into your existing work, not add to it.",
  },
  {
    q: "Is this in-person or virtual?",
    a: "Sessions are virtual (Zoom) so location doesn't limit who can join. The private community is always-on between sessions.",
  },
  {
    q: "What if I miss a session?",
    a: "Every session is recorded. But the real value is in the live interaction and the small-group dynamic, so we ask that you commit to attending at least 10 of the 12 sessions.",
  },
  {
    q: "How is this different from the 1:1 coaching?",
    a: "The 1:1 coaching (at $3,000/month) is fully individualized. The Master's Edge Program gives you 80% of the same methodology at a fraction of the cost, plus the added benefit of a peer cohort. Many clients start with the program and upgrade to 1:1 later.",
  },
  {
    q: "What's the refund policy?",
    a: "If after the first two sessions you feel this isn't the right fit, we'll refund your investment in full. No questions, no friction. Brett only wants people in the program who are getting value from it.",
  },
  {
    q: "I'm interested but have more questions.",
    a: "Book a 15-minute conversation with Brett. It's not a sales call. It's a genuine discussion to see if there's a fit.",
  },
];

// Client logos
const clientLogos = [
  { name: "American Express", src: "/logos/american-express.png" },
  { name: "Delta", src: "/logos/delta.png" },
  { name: "Packsize", src: "/logos/packsize.png" },
  { name: "Purple", src: "/logos/purple.jpg" },
  { name: "Thumbtack", src: "/logos/thumbtack.png" },
  { name: "Member Solutions", src: "/logos/membersolutions.jpg" },
  { name: "Murray Chamber", src: "/logos/murray-chamber.png" },
  { name: "Heber Valley Chamber", src: "/logos/heber-valley-chamber.png" },
  { name: "Park City Chamber", src: "/logos/park-city-chamber.png" },
  { name: "Good Things Utah", src: "/logos/good-things-utah.webp" },
];

// FAQ Accordion component
function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-black group-hover:text-cranberry transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-cranberry' : 'text-gray-400'}`} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-warm-gray leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
}

export default function MastersEdgeProgramPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* SECTION 1: HERO */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/masters-edge.jpg"
            alt="Mountain peak at sunrise representing transformation"
            fill
            className="object-cover opacity-50"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

          {/* Animated background orbs */}
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

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Scarcity badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-5 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Limited Enrollment — Founding Cohort</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              12 Weeks That Change How You{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Focus
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Lead
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Operate
              </span>
              , and{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Perform
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              The Master&apos;s Edge Group Coaching Program takes the methodology behind 100+ corporate trainings and puts it to work on your business, your leadership, and your life. Applications now open for the founding cohort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button href="/masters-edge-program/apply" size="lg">
                Apply Now — Limited to 8 Members
              </Button>
              <Button href="#program" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                See What&apos;s Inside
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-cranberry to-gold" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
                You&apos;ve Built Something Real.{" "}
                <span className="text-cranberry">But Something&apos;s Off.</span>
              </h2>

              <div className="space-y-6 text-lg text-warm-gray leading-relaxed">
                <p>
                  You&apos;re successful by most definitions. Revenue is solid. The team is growing. People look at what you&apos;ve built and see someone who has it figured out.
                </p>
                <p>
                  <strong className="text-black">But you know the truth.</strong>
                </p>
                <p>
                  The days feel reactive instead of intentional. You&apos;re solving the same problems on repeat. The business runs, but it runs you. And the version of yourself you know is possible — the one who leads with clarity, operates from flow, and builds something extraordinary — keeps getting pushed to &quot;someday.&quot;
                </p>
                <p>
                  That gap isn&apos;t about working harder. It&apos;s about operating from a completely different system.
                </p>
                <p className="text-xl font-semibold text-black pt-4 border-t border-gray-100">
                  The Master&apos;s Edge Program is that system.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: THE PROGRAM - 12 Weeks, 3 Phases */}
        <section id="program" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                12 Weeks. Three Phases.{" "}
                <span className="text-gold">One Transformation.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Every week builds on the last. By Week 12, you won&apos;t just have new tools. You&apos;ll have a new operating system.
              </p>
            </motion.div>

            {/* Phase Cards */}
            <div className="grid lg:grid-cols-3 gap-8">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity ${
                    phase.accent === "cranberry" ? "bg-gradient-to-r from-cranberry to-cranberry-dark" :
                    phase.accent === "gold" ? "bg-gradient-to-r from-gold to-gold-dark" :
                    "bg-gradient-to-r from-cranberry via-gold to-cranberry"
                  }`} />

                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                    {/* Phase header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        phase.accent === "cranberry" ? "bg-gradient-to-br from-cranberry to-cranberry-dark" :
                        phase.accent === "gold" ? "bg-gradient-to-br from-gold to-gold-dark" :
                        "bg-gradient-to-br from-cranberry to-gold"
                      }`}>
                        <phase.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${
                          phase.accent === "cranberry" ? "text-cranberry-light" :
                          phase.accent === "gold" ? "text-gold" :
                          "text-gold"
                        }`}>
                          Phase {phase.phase}
                        </p>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-2">{phase.weeks}</p>
                    <p className="text-white/80 mb-6 italic">&quot;{phase.tagline}&quot;</p>

                    {/* Weekly breakdown */}
                    <div className="space-y-4 flex-grow">
                      {phase.weeks_detail.map((week) => (
                        <div key={week.week} className="border-l-2 border-white/20 pl-4">
                          <p className="text-gold font-semibold text-sm">Week {week.week}</p>
                          <p className="text-white font-medium">{week.title}</p>
                          <p className="text-gray-500 text-sm">{week.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: WHAT'S INCLUDED */}
        <section className="py-24 bg-gradient-to-b from-white via-gold/5 to-cranberry/5 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Everything You Get in{" "}
                <span className="text-cranberry">The Master&apos;s Edge Program</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {included.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-cranberry/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-warm-gray text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: WHO THIS IS FOR / NOT FOR */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black">
                This Program Is <span className="text-cranberry">Not for Everyone</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              {/* For You */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100"
              >
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  This IS for you if...
                </h3>
                <ul className="space-y-4">
                  {forYou.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-warm-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not For You */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100"
              >
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  This is NOT for you if...
                </h3>
                <ul className="space-y-4">
                  {notForYou.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-warm-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 6: ABOUT BRETT */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black">
                Built by Someone Who&apos;s{" "}
                <span className="text-cranberry">Done the Work</span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cranberry to-gold rounded-2xl blur-lg opacity-20" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/media-kit/brett-twins-nobg.png"
                    alt="Brett Lechtenberg"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-lg text-warm-gray leading-relaxed">
                  Brett Lechtenberg has spent 30+ years helping people discover who they&apos;re meant to become. As an 8th-degree black belt with over 40 years in martial arts, the author of 7 books (5 bestsellers), and a peak performance coach who has trained teams at American Express, Delta, Purple, Packsize, and 50+ other organizations, Brett brings a depth of real-world experience that most coaches simply can&apos;t match.
                </p>
                <p className="text-lg text-warm-gray leading-relaxed">
                  The Master&apos;s Edge isn&apos;t something Brett learned from a book. It&apos;s a methodology he built, tested in his own businesses, validated through original flow state research with the Flow Research Collective, and refined through 100+ speaking events and thousands of coaching hours.
                </p>
                <p className="text-xl font-semibold text-black">
                  He only teaches what he&apos;s tested himself. That&apos;s the difference.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-6 border-t border-gray-200">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-cranberry">{stat.value}</p>
                      <p className="text-xs text-warm-gray">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Client logos */}
                <div className="pt-6">
                  <p className="text-sm text-gray-500 mb-4">Trusted by teams at:</p>
                  <div className="flex flex-wrap gap-6 items-center">
                    {clientLogos.map((logo) => (
                      <div key={logo.name} className="relative h-8 w-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 7: TESTIMONIALS */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                In Their <span className="text-gold">Words</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry to-gold rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full flex flex-col">
                    <p className="text-gray-300 italic flex-grow mb-6">
                      &quot;{testimonial.quote}&quot;
                      {testimonial.highlight && (
                        <span className="block mt-2 text-gold font-bold text-xl not-italic">
                          +{testimonial.highlight} Revenue
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center text-white font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: PRICING */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cranberry/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Investment
              </h2>
              <p className="text-gray-400">
                Founding Cohort Pricing — Available for a Limited Time
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Founding Member */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cranberry to-cranberry-dark rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-gray-900 rounded-2xl p-8 border border-cranberry/30 h-full flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1 mb-6 self-start">
                    <span className="text-gold font-semibold text-sm">FOUNDING RATE</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Founding Member</h3>
                  <p className="text-gray-400 text-sm mb-6">Recommended</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$997</span>
                    <span className="text-gray-400">/month for 3 months</span>
                    <p className="text-gray-500 text-sm mt-2">Total: $2,991</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Everything listed above
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      12 weekly group sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      2 private 1:1 sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Lifetime access
                    </li>
                  </ul>

                  <p className="text-gray-500 text-sm mb-6 italic">
                    This rate is only available for the founding cohort. Future cohorts will be priced at $1,500/month.
                  </p>

                  <Button href="/masters-edge-program/apply" size="lg" className="w-full">
                    Apply Now
                  </Button>
                </div>
              </motion.div>

              {/* Pay in Full */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gray-900 rounded-2xl p-8 border border-gold/30 h-full flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/40 rounded-full px-4 py-1 mb-6 self-start">
                    <span className="text-cranberry-light font-semibold text-sm">BEST VALUE</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Pay in Full</h3>
                  <p className="text-gray-400 text-sm mb-6">Save $300</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$2,691</span>
                    <span className="text-gray-400"> one-time</span>
                    <p className="text-green-400 text-sm mt-2">You save $300</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Everything in Founding Member
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      <strong className="text-gold">Bonus:</strong> 3rd private 1:1 session
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Priority scheduling
                    </li>
                  </ul>

                  <Button href="/masters-edge-program/apply" variant="secondary" size="lg" className="w-full">
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Book a conversation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-gray-400 mb-4">
                Not sure yet? Book a free 15-minute conversation with Brett. No pitch. No pressure. Just a real discussion about whether this is the right fit.
              </p>
              <Button href={links.booking} external variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Book a Conversation
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 9: FAQ */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black">
                Common <span className="text-cranberry">Questions</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 10: FINAL CTA */}
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                The First Step Is Always a Conversation
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                No pitch. No pressure. Just a genuine discussion about where you are, where you want to be, and whether The Master&apos;s Edge is the right fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/masters-edge-program/apply" size="lg" variant="secondary">
                  Apply to The Master&apos;s Edge Program
                </Button>
                <Button href={links.booking} external size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Book a Conversation First
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

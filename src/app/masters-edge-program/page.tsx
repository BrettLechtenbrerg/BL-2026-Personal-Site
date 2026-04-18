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
    weeks: "Weeks 1–4",
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
    weeks: "Weeks 5–8",
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
    weeks: "Weeks 9–12",
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
  { value: "100+", label: "Speaking Events" },
  { value: "50+", label: "Corporate Clients" },
  { value: "7", label: "Books" },
  { value: "8th", label: "Degree Black Belt" },
];

// Testimonials
const testimonials = [
  {
    quote: "Brett really knows flow, peak performance, and goals. He has a deep understanding of what it takes to perform at a high level and teaches it in a way that makes it practical and powerful.",
    name: "Bill Schuffenhauer",
    title: "3x Olympian, Olympic Silver Medalist",
    initials: "BS",
  },
  {
    quote: "Brett has a unique ability to combine leadership, mindset, and practical strategy in a way that creates real transformation.",
    name: "Sam Beard",
    title: "Creator of Initiatives for Eight U.S. Presidents",
    initials: "SB",
  },
  {
    quote: "His training helped me think more clearly, lead more intentionally, and create stronger results in both business and life.",
    name: "John Nottingham",
    title: "Sword and Shield Security",
    initials: "JN",
  },
  {
    quote: "This work helped me identify where I was getting in my own way and gave me practical tools to perform at a much higher level.",
    name: "Matt Gibbons",
    title: "President, Murray Area Chamber of Commerce",
    initials: "MG",
  },
  {
    quote: "Brett's work reflects a serious understanding of flow, performance, and how to help people apply those ideas in meaningful ways.",
    name: "Flow Research Collective",
    title: "Steven Kotler's Peak Performance Organization",
    initials: "FRC",
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
  { name: "USA Martial Arts", src: "/logos/usa-martial-arts.png" },
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
              The Master&apos;s Edge is a 12-week group coaching program for business owners and leaders who want sharper focus, stronger leadership, better execution, and a more intentional way to operate in business and life. Applications are now open for the upcoming cohorts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button href="/masters-edge-program/apply" size="lg">
                Apply Now — Limited to 12 Members
              </Button>
              <Button href="#program" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                See What&apos;s Inside
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: WHO THIS PROGRAM IS FOR */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
                Who This Program Is For
              </h2>

              <div className="space-y-6 text-lg text-warm-gray leading-relaxed">
                <p>
                  The Master&apos;s Edge is built for business owners, executives, and growth-minded leaders who have already achieved meaningful success but know they are still operating below their full capability.
                </p>
                <p>
                  If you are carrying too much, reacting too often, struggling to maintain focus, or leading without the structure and rhythm you know you need, this program was designed for you.
                </p>
                <p className="font-semibold text-black">
                  Over 12 weeks, you will learn how to:
                </p>
                <ul className="space-y-3 pl-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cranberry flex-shrink-0 mt-1" />
                    <span>Clarify what matters most</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cranberry flex-shrink-0 mt-1" />
                    <span>Lead with more confidence and consistency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cranberry flex-shrink-0 mt-1" />
                    <span>Simplify the way you operate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cranberry flex-shrink-0 mt-1" />
                    <span>Make better decisions with less hesitation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cranberry flex-shrink-0 mt-1" />
                    <span>Build a stronger system for execution, energy, and performance</span>
                  </li>
                </ul>
                <p className="pt-4 border-t border-gray-100">
                  This is not generic motivation. It is a structured coaching experience designed to help you operate at a higher level in business and life.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: EMOTIONAL CONNECTION */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
                  You&apos;ve built something meaningful. From the outside, it may look like things are working. Revenue is solid. The team is growing. People see progress.
                </p>
                <p>
                  <strong className="text-black">But you know there is another level you have not fully stepped into yet.</strong>
                </p>
                <p>
                  Too many days still feel reactive instead of intentional. The same problems keep showing up. The business depends on you more than it should. And the version of yourself you know is possible — the one who leads with clarity, operates from flow, and performs at a higher level — keeps getting pushed further down the road.
                </p>
                <p>
                  That gap is not about working harder. It is about building a different way to operate.
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
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-4">
                This program is designed to move you from scattered and reactive to clear, structured, and high-performing.
              </p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Every week builds on the last. By Week 12, you will not just have new tools. You will have a new operating system.
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

                    <p className="text-gray-400 text-sm mb-6">{phase.weeks}</p>

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
              <p className="text-lg text-warm-gray max-w-3xl mx-auto">
                This is a high-touch coaching experience designed to give you both transformation and practical tools you can use immediately.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {included.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-cranberry/20 transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-black">{item.title}</h3>
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
                  This program is for you if...
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
                  This program is not for you if...
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
                  Brett Lechtenberg has spent decades helping people and organizations elevate the way they think, lead, and perform.
                </p>
                <p className="text-lg text-warm-gray leading-relaxed">
                  With more than 30 years of coaching, training, and leadership experience, Brett has worked with business owners, teams, and organizations across a wide range of industries. His work blends real-world leadership development, flow state research, personal discipline, and high-performance strategy into a practical system that creates lasting change.
                </p>
                <p className="text-lg text-warm-gray leading-relaxed">
                  He has delivered 100+ speaking events, worked with 50+ corporate clients, written 7 books, and spent more than 40 years immersed in martial arts and human performance.
                </p>
                <p className="text-xl font-semibold text-black">
                  Brett only teaches what he has tested himself. That is the difference.
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

                  <h3 className="text-xl font-bold text-white mb-6">Founding Member</h3>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$997</span>
                    <span className="text-gray-400">/month for 3 months</span>
                    <p className="text-gray-500 text-sm mt-2">Total Investment: $2,991</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Full 12-week program access
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      All live group coaching sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      2 private 1:1 sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Toolkit, community, and post-program support
                    </li>
                  </ul>

                  <p className="text-gray-500 text-sm mb-6 italic">
                    Future cohorts will be priced at $1,500/month.
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

                  <h3 className="text-xl font-bold text-white mb-6">Pay in Full</h3>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$2,691</span>
                    <span className="text-gray-400"> one-time payment</span>
                    <p className="text-green-400 text-sm mt-2">Save $300</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Everything in the Founding Member option
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      Bonus 3rd private 1:1 session
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
                Book a 15-Minute Conversation
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
                No pitch. No pressure. Just a real conversation about where you are, where you want to go, and whether The Master&apos;s Edge is the right next step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/masters-edge-program/apply" size="lg" variant="secondary">
                  Apply Now
                </Button>
                <Button href={links.booking} external size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Book a Conversation
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

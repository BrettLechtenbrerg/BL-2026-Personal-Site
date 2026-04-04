"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Brain, Wrench, Building2, Sparkles, Target, Zap } from "lucide-react";
import Image from "next/image";

const foundations = [
  {
    icon: Target,
    title: "First Principles Thinking",
    drives: "CLARIFY",
    description:
      "Strip away assumptions. See the real problem. Most people spend years solving the wrong problems because they never question the inherited beliefs underneath them.",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    icon: Sparkles,
    title: "Frontloading",
    drives: "SIMPLIFY",
    description:
      "Be prepared, not surprised. Loading the knowledge, tools, and mental frameworks you need before you face the challenge — not during, not after.",
    gradient: "from-gold to-gold-dark",
  },
  {
    icon: Zap,
    title: "Flow",
    drives: "MAXIMIZE",
    description:
      "Engineer the conditions for peak performance. Flow is not random luck — it's a reproducible state with specific, measurable conditions.",
    gradient: "from-cranberry to-cranberry-dark",
  },
];

const pillars = [
  {
    icon: Brain,
    title: "Mindset Mastery",
    subtitle: "Focus • Resilience • Confidence",
    description:
      "Before you can change what you do, you have to change how you think. Building the internal architecture for peak performance under pressure.",
  },
  {
    icon: Wrench,
    title: "Skillset Enhancement",
    subtitle: "Tools • Techniques • Practice",
    description:
      "Once the mindset is right, we build the practical capabilities. Specific, high-leverage tools matched to your situation.",
  },
  {
    icon: Building2,
    title: "Support Structure",
    subtitle: "Systems • Habits • Environment",
    description:
      "The piece most programs miss. We design the environment, systems, and routines that make peak performance sustainable.",
  },
];

export default function MastersEdgePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark with animated orbs */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/masters-edge.jpg"
            alt="Mountain peak at sunrise representing transformation"
            fill
            className="object-cover opacity-30"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          {/* Animated background */}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-5 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-cranberry-light font-semibold text-sm">The Master&apos;s Edge</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              The Methodology Behind the{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Transformation
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              A science-backed, custom-built coaching system for unlocking peak
              performance in business leaders, teams, and individuals. Built on 30+
              years of real-world experience and validated flow state research.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button href={links.booking} external size="lg">
                Book a Conversation
              </Button>
            </motion.div>
          </div>
        </section>

        {/* The Promise - Gradient background */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-black mb-6 text-center">
                It Starts With a <span className="text-cranberry">Promise</span>
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <p className="text-lg text-warm-gray leading-relaxed text-center">
                  Every Master&apos;s Edge engagement begins the same way:{" "}
                  <em className="text-black font-semibold">
                    We will build a custom set of tools that fits you, your situation,
                    and no one else.
                  </em>
                </p>
                <p className="text-lg text-warm-gray leading-relaxed text-center mt-4">
                  This is not a pre-packaged program. There are no templates borrowed
                  from someone else&apos;s success story. The Master&apos;s Edge is a
                  diagnostic, science-backed process that identifies the specific gaps
                  between where you are and where you&apos;re capable of being — then
                  builds a custom toolkit to close them.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Three Foundations - Dark section */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Three Layers. <span className="text-gold">One System.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                The Master&apos;s Edge operates on three integrated layers. Each builds
                on the one below it. Skip a layer and the system breaks.
              </p>
            </motion.div>

            {/* Layer 1: The Science */}
            <div className="mb-20">
              <h3 className="text-xl font-bold text-cranberry-light mb-8 text-center">
                Layer 1: The Science — Three Foundations
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {foundations.map((foundation, index) => (
                  <motion.div
                    key={foundation.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${foundation.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`} />
                    <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${foundation.gradient} flex items-center justify-center mb-6`}>
                        <foundation.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-gold font-bold text-sm mb-2">
                        → Drives {foundation.drives}
                      </p>
                      <h4 className="text-xl font-bold text-white mb-3">
                        {foundation.title}
                      </h4>
                      <p className="text-gray-400">{foundation.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Layer 2: The Methodology */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-cranberry-light mb-8 text-center">
                Layer 2: The Methodology — Three Pillars
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {pillars.map((pillar, index) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center mb-6">
                      <pillar.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-gold text-sm font-medium mb-3">
                      {pillar.subtitle}
                    </p>
                    <p className="text-gray-400">{pillar.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Layer 3: The Transformation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-40" />
              <div className="relative text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-12 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">
                  Layer 3: The Transformation Promise
                </h3>
                <p className="text-4xl lg:text-5xl font-bold">
                  <span className="text-cranberry">CLARIFY.</span>{" "}
                  <span className="text-gold">SIMPLIFY.</span>{" "}
                  <span className="text-cranberry">MAXIMIZE.</span>
                </p>
                <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
                  This is what happens to the person who goes through The Master&apos;s
                  Edge. You get crystal clear about what you really want. You simplify
                  how you operate. And you maximize your life, your business, and your
                  impact.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Research - Gradient section */}
        <section className="py-24 bg-gradient-to-b from-white via-gold/5 to-cranberry/5 relative overflow-hidden">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-6 text-center">
                Built on <span className="text-cranberry">Research</span>, Not Theory
              </h2>
              <p className="text-lg text-warm-gray leading-relaxed mb-8">
                Most peak performance programs are built on concepts borrowed from
                books. The Master&apos;s Edge is built on original research.
              </p>
              <p className="text-lg text-warm-gray leading-relaxed mb-8">
                Brett conducted a formal research thesis testing whether deliberate
                manipulation of flow states could accelerate how fast people learn
                complex skills and how long they retain them. The research was reviewed
                and validated by the{" "}
                <span className="text-gold font-semibold">
                  Flow Research Collective
                </span>{" "}
                — Steven Kotler&apos;s peak performance research organization.
              </p>
              <blockquote className="relative border-l-4 border-gold pl-6 py-6 bg-gradient-to-r from-gold/10 to-transparent rounded-r-xl">
                <div className="absolute -left-3 top-6 w-6 h-6 bg-gold rounded-full" />
                <p className="text-xl italic text-black">
                  &ldquo;Excellent. The paper makes a compelling, empirical case for
                  the utilization of flow for accelerated learning and skill
                  acquisition.&rdquo;
                </p>
                <cite className="text-warm-gray mt-4 block font-semibold">
                  — Flow Research Collective
                </cite>
              </blockquote>
            </motion.div>
          </div>
        </section>

        {/* CTA - Bold gradient */}
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
                No pitch. No pressure. Just a genuine discussion about where you are,
                where you want to be, and whether The Master&apos;s Edge is the right
                fit.
              </p>
              <Button href={links.booking} external size="lg" variant="secondary">
                Book a Conversation
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

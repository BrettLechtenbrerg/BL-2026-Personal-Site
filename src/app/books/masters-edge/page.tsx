"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Brain, Swords, Workflow, Sparkles } from "lucide-react";
import Image from "next/image";

const pillars = [
  {
    icon: Brain,
    title: "Mindset",
    description:
      "The internal operating system of mastery — confidence, focus, and the flow-state research that turns pressure into presence.",
  },
  {
    icon: Swords,
    title: "Skillset",
    description:
      "Deliberate practice principles drawn from 30+ years of martial arts mastery, translated for leaders, sellers, and builders.",
  },
  {
    icon: Workflow,
    title: "Systems Design",
    description:
      "The structures that make excellence repeatable — so results stop depending on willpower and start compounding.",
  },
];

export default function MastersEdgeBookPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cranberry/30 rounded-full blur-[100px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/40 rounded-full px-5 py-2 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">
                    New Book — Coming Q4 2026
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
                >
                  The Master&apos;s{" "}
                  <span className="bg-gradient-to-r from-gold via-gold to-cranberry bg-clip-text text-transparent">
                    Edge
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm uppercase tracking-[0.25em] text-gold mb-6"
                >
                  Ancient Discipline · Modern Leadership
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
                >
                  The definitive guide to Brett&apos;s peak performance
                  methodology — mindset, skillset, and systems design, built on
                  30+ years of real-world testing and original flow state
                  research validated by the Flow Research Collective.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button href="/masters-edge" size="lg">
                    Explore the Methodology
                  </Button>
                  <Button
                    href={links.booking}
                    external
                    size="lg"
                    className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
                  >
                    Talk With Brett
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative max-w-md mx-auto w-full"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-gold via-cranberry to-gold rounded-3xl blur-xl opacity-40" />
                <TiltCard className="relative">
                  <Image
                    src="/books/masters-edge-shelf.jpg"
                    alt="The Master's Edge hardcover on a bookstore shelf as a staff pick"
                    width={1024}
                    height={1536}
                    priority
                    className="relative rounded-2xl shadow-2xl border border-white/10"
                  />
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pillars - Light */}
        <section className="py-24 bg-gradient-to-b from-white via-gold/5 to-cranberry/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-cranberry to-gold" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                What&apos;s Inside the <span className="text-cranberry">Book</span>
              </h2>
              <p className="text-lg text-warm-gray max-w-2xl mx-auto">
                One methodology, three disciplines — the same framework Brett
                teaches from corporate keynotes to the 12-week Master&apos;s
                Edge program.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-white rounded-2xl p-8 border-2 border-gold/30 group-hover:border-gold/60 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="w-14 h-14 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center mb-6">
                      <pillar.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-warm-gray leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon CTA - Cranberry gradient */}
        <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cranberry-light/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Arriving <span className="text-gold">4th Quarter 2026</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                The Master&apos;s Edge is in its final stages. Want the
                methodology before the book lands — or want Brett to bring it
                to your team in person?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href={links.booking} external size="lg" variant="secondary">
                  Talk With Brett
                </Button>
                <Button
                  href="/speaking"
                  size="lg"
                  className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
                >
                  Bring It to Your Team
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

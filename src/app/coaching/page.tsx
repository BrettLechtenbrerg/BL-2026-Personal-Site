"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users, Quote, ChevronRight, Target, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

const phases = [
  {
    phase: "Phase 1",
    title: "CLARIFY",
    subtitle: "First Principles Diagnostic",
    description:
      "We strip away assumptions and surface-level symptoms to find what's actually happening. What are the real problems? What inherited patterns are creating invisible ceilings?",
    icon: Target,
    gradient: "from-cranberry to-cranberry-dark",
    color: "text-cranberry",
  },
  {
    phase: "Phase 2",
    title: "SIMPLIFY",
    subtitle: "Frontloaded Toolkit",
    description:
      "We build the specific tools, frameworks, and systems you need — before the next high-stakes moment demands them. Your custom toolkit addresses Mindset, Skillset, and Support Structure.",
    icon: Sparkles,
    gradient: "from-gold to-gold-dark",
    color: "text-gold",
  },
  {
    phase: "Phase 3",
    title: "MAXIMIZE",
    subtitle: "Flow State Operation",
    description:
      "With clarity achieved and the right systems in place, peak performance becomes accessible. You stop surviving and start operating from intention, flow, and compounding results.",
    icon: Zap,
    gradient: "from-cranberry to-cranberry-dark",
    color: "text-cranberry",
  },
];

export default function CoachingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark gradient */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/coaching.jpg"
            alt="Professional coaching session"
            fill
            className="object-cover opacity-35"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cranberry/30 rounded-full blur-[100px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6"
            >
              <Users className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Executive & Business Coaching</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Become the Leader Your Business{" "}
              <span className="bg-gradient-to-r from-gold via-gold to-cranberry bg-clip-text text-transparent">
                Needs
              </span>{" "}
              You to Be
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              The Master&apos;s Edge coaching program builds a custom toolkit around
              your specific goals, challenges, and situation — grounded in the
              science of peak performance and validated by decades of real-world results.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button href={links.booking} external size="lg">
                Start a Conversation
              </Button>
            </motion.div>
          </div>
        </section>

        {/* The Problem - Gradient background */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-6">
                You&apos;ve Hit a Ceiling. And Working Harder <span className="text-cranberry">Isn&apos;t Breaking Through It.</span>
              </h2>
              <p className="text-lg text-warm-gray leading-relaxed mb-6">
                You&apos;ve built a successful business through determination and hard
                work. But now the strategies that got you here aren&apos;t getting you
                further. You might be experiencing:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Revenue that's plateaued despite increasing effort",
                  "Days consumed by operational firefighting instead of strategy",
                  "A team that depends on you for every decision",
                  "Personal relationships and well-being suffering under the weight",
                  "The nagging feeling that you're capable of much more",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 items-center bg-white rounded-lg p-4 shadow-md border-l-4 border-cranberry"
                  >
                    <ChevronRight className="w-5 h-5 text-cranberry flex-shrink-0" />
                    <span className="text-warm-gray">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl p-8 text-center">
                <p className="text-xl text-white font-semibold">
                  You don&apos;t need another course, another book, or another podcast. You
                  need a system that changes how you operate — <span className="text-gold">from the inside out.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Process - Dark section */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gold/25 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                How The Master&apos;s Edge <span className="text-gold">Coaching Works</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Every engagement begins with the same promise:{" "}
                <em className="text-white">
                  We will build a custom set of tools that fits you, your situation, and no one else.
                </em>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${phase.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 h-full flex flex-col">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${phase.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg flex-shrink-0`}>
                      <phase.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-400 mb-2 flex-shrink-0">{phase.phase}</p>
                    <h3 className={`text-3xl font-bold ${phase.color} mb-1 flex-shrink-0`}>
                      {phase.title}
                    </h3>
                    <p className="text-gold font-medium mb-4 flex-shrink-0">{phase.subtitle}</p>
                    <p className="text-gray-400 flex-grow">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Results - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center"
            >
              Real Results From <span className="text-cranberry">Real Clients</span>
            </motion.h2>
            <div className="space-y-8">
              {[
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
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex items-start gap-6">
                    {testimonial.stat && (
                      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl p-6 text-white min-w-[100px]">
                        <span className="text-3xl font-black">{testimonial.stat}</span>
                        <span className="text-xs text-white/80">{testimonial.statLabel}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                        <Quote className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg italic text-black mb-4 pt-4">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold">
                          {testimonial.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-black">{testimonial.name}</p>
                          <p className="text-sm text-cranberry">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - Dark section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Common <span className="text-gold">Questions</span>
            </motion.h2>
            <div className="space-y-6">
              {[
                {
                  q: "Who is The Master's Edge coaching for?",
                  a: "Business owners, executives, and leaders who know they're capable of more but can't identify what's holding them back. People who have tried generic programs and found them too broad.",
                },
                {
                  q: "How is this different from other coaching programs?",
                  a: "Two things. First, every tool we build is custom — there are no templates. Second, the methodology is grounded in original flow state research validated by the Flow Research Collective.",
                },
                {
                  q: "How long does it take to see results?",
                  a: "Most clients experience a shift in clarity and mindset within the first few sessions. Tangible business results typically emerge within 60-90 days.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold via-cranberry to-gold rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Bold gradient */}
        <section className="py-24 bg-gradient-to-br from-gold via-gold-dark to-cranberry text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cranberry/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-black">
                The First Step Is Always a Conversation
              </h2>
              <p className="text-lg text-black/80 mb-10 max-w-2xl mx-auto">
                Not a sales call. A real conversation about where you are, where you
                want to be, and whether The Master&apos;s Edge is the right fit.
              </p>
              <Button href={links.booking} external size="lg" className="bg-black text-white hover:bg-gray-900">
                Start a Conversation
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

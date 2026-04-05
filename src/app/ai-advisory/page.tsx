"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Handshake, Cog, Bot, Sparkles, Zap, Brain, Rocket } from "lucide-react";
import Image from "next/image";

const tiers = [
  {
    icon: GraduationCap,
    title: "Teach You",
    subtitle: "Foundational",
    description:
      "We train your team to understand and use AI effectively. From foundational literacy to advanced prompt engineering.",
    bestFor: "Teams new to AI who want to build internal capability",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    icon: Handshake,
    title: "Do It With You",
    subtitle: "Collaborative",
    description:
      "We work alongside your team to implement AI into your specific workflows, training programs, and operations.",
    bestFor: "Businesses ready to integrate AI but wanting expert guidance",
    gradient: "from-gold to-gold-dark",
  },
  {
    icon: Cog,
    title: "Do It For You",
    subtitle: "Full Service",
    description:
      "We handle the full AI implementation — from strategy to custom tool development to managed services.",
    bestFor: "Organizations wanting turnkey AI solutions",
    gradient: "from-cranberry to-cranberry-dark",
  },
];

const impactAreas = [
  { icon: Rocket, title: "Future-Proofing", description: "Anticipate market trends and position your business ahead of change", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Brain, title: "Prompt Engineering", description: "Learn to communicate with AI tools effectively — saving massive time and money", gradient: "from-gold to-gold-dark" },
  { icon: Zap, title: "Business Automation", description: "Automate repetitive tasks so your team can focus on high-value work", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Sparkles, title: "Content Creation", description: "Generate, optimize, and repurpose content at scale", gradient: "from-gold to-gold-dark" },
];

export default function AIAdvisoryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark futuristic */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/ai-advisory.jpg"
            alt="AI and technology visualization"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[150px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cranberry/30 rounded-full blur-[120px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-5 py-2 mb-6"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm">AI Advisory — Powered by Total Success AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Free Your People to Do What Only{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cranberry to-gold bg-clip-text text-transparent">
                Humans
              </span>{" "}
              Can
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              AI isn&apos;t here to replace your team. It&apos;s here to handle the
              repetitive so they can focus on what matters: relationships,
              creativity, and high-value work. Through Total Success AI, Brett helps
              businesses implement AI the right way.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button href={links.booking} external size="lg">
                Explore AI Solutions
              </Button>
            </motion.div>
          </div>
        </section>

        {/* The Approach - Gradient */}
        <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-cranberry/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cranberry to-gold" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-6">
                AI Done Right Starts With <span className="text-cranberry">People</span>, Not Technology
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <p className="text-lg text-warm-gray leading-relaxed">
                  Most AI consultants lead with the technology. We lead with the problem.
                  Using the same first-principles approach that powers The Master&apos;s
                  Edge, we start by understanding what your business actually needs —
                  then build AI solutions that serve your people, not the other way around.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Three Tiers - Dark */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Choose Your Level of <span className="text-gold">Support</span>
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${tier.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tier.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg flex-shrink-0`}>
                      <tier.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-400 mb-1 flex-shrink-0">{tier.subtitle}</p>
                    <h3 className="text-2xl font-bold text-white mb-4 flex-shrink-0">{tier.title}</h3>
                    <p className="text-gray-400 mb-6 flex-grow">{tier.description}</p>
                    <p className="text-sm text-gray-500 mt-auto flex-shrink-0">
                      <span className="font-semibold text-gold">Best for:</span> {tier.bestFor}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Areas - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center"
            >
              Four Areas Where AI Creates <span className="text-cranberry">Immediate Impact</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${area.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex items-start gap-6 h-full group-hover:shadow-2xl transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <area.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black mb-2">{area.title}</h3>
                      <p className="text-warm-gray">{area.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Total Success AI - Dark */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
          />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cranberry rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Powered by <span className="text-gold">Total Success AI</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Brett&apos;s AI advisory services are delivered through Total Success AI,
                co-founded with Manny Torres. For deeper AI consulting, implementation,
                and custom solutions.
              </p>
              <Button href={links.ai} external variant="secondary" size="lg">
                Visit Total Success AI
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA - Bold gradient */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-cranberry to-cranberry-dark text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Not Sure Where to Start With AI?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Let&apos;s have a conversation about your business, your team, and where
                AI could create the most impact.
              </p>
              <Button href={links.booking} external size="lg" variant="secondary">
                Talk to Brett
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

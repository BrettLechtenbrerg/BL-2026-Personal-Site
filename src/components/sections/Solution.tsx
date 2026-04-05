"use client";

import { motion } from "framer-motion";
import { Brain, Wrench, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const pillars = [
  {
    icon: Brain,
    title: "Mindset Mastery",
    description:
      "Build the focus, resilience, and confidence to perform at your peak — especially when conditions aren't ideal.",
    gradient: "from-cranberry to-cranberry-dark",
    iconBg: "bg-cranberry",
    shadow: "shadow-cranberry/30",
  },
  {
    icon: Wrench,
    title: "Skillset Enhancement",
    description:
      "Develop practical, high-leverage capabilities tailored to your situation: leadership, communication, productivity, strategic thinking.",
    gradient: "from-gold to-gold-dark",
    iconBg: "bg-gold",
    shadow: "shadow-gold/30",
  },
  {
    icon: Building2,
    title: "Support Structure",
    description:
      "Design the environment, systems, habits, and relationships that sustain peak performance over time.",
    gradient: "from-cranberry to-cranberry-dark",
    iconBg: "bg-cranberry",
    shadow: "shadow-cranberry/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export function Solution() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />

      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cranberry/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cranberry to-cranberry-dark text-white rounded-full px-5 py-2 mb-6 shadow-lg shadow-cranberry/30">
            <span className="font-semibold text-sm">The Master&apos;s Edge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            A Proven System for{" "}
            <span className="bg-gradient-to-r from-cranberry to-gold bg-clip-text text-transparent">
              Peak Performance
            </span>
          </h2>
          <p className="text-lg text-warm-gray max-w-3xl mx-auto leading-relaxed">
            The Master&apos;s Edge is Brett&apos;s proprietary coaching methodology — built
            on 30+ years of real-world business experience, validated flow state
            research, and the same progressive mastery framework that creates black
            belts.
          </p>
        </motion.div>

        {/* Three Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={cardVariants}
              className="group relative"
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />

              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 ${pillar.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${pillar.shadow} flex-shrink-0`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-3 flex-shrink-0">{pillar.title}</h3>
                <p className="text-warm-gray leading-relaxed flex-grow">{pillar.description}</p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl bg-gradient-to-r ${pillar.gradient}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Result Statement - Dark card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="relative inline-block bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl p-10 md:p-14 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cranberry/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/20 rounded-full blur-[80px]" />

            <p className="relative text-xl md:text-2xl text-white mb-8">
              The result? You{" "}
              <span className="font-bold text-cranberry">Clarify</span> what matters,{" "}
              <span className="font-bold text-gold">Simplify</span> how you
              operate, and{" "}
              <span className="font-bold text-cranberry">Maximize</span> your results.
            </p>
            <Button href="/masters-edge" variant="secondary" size="lg">
              Explore The Master&apos;s Edge
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
    color: "cranberry",
  },
  {
    icon: Wrench,
    title: "Skillset Enhancement",
    description:
      "Develop practical, high-leverage capabilities tailored to your situation: leadership, communication, productivity, strategic thinking.",
    color: "gold",
  },
  {
    icon: Building2,
    title: "Support Structure",
    description:
      "Design the environment, systems, habits, and relationships that sustain peak performance over time.",
    color: "cranberry",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function Solution() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
            The Master&apos;s Edge
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            A Proven System for Peak Performance
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
              className="group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  pillar.color === "cranberry"
                    ? "bg-cranberry/10 text-cranberry"
                    : "bg-gold/20 text-gold-dark"
                }`}
              >
                <pillar.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-black mb-3">{pillar.title}</h3>
              <p className="text-warm-gray leading-relaxed">{pillar.description}</p>

              {/* Hover accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
                  pillar.color === "cranberry" ? "bg-cranberry" : "bg-gold"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Result Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xl text-black mb-8">
            The result? You{" "}
            <span className="font-bold text-cranberry">Clarify</span> what matters,{" "}
            <span className="font-bold text-gold-dark">Simplify</span> how you
            operate, and{" "}
            <span className="font-bold text-cranberry">Maximize</span> your results.
          </p>
          <Button href="/masters-edge" variant="outline" size="lg">
            Explore The Master&apos;s Edge
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

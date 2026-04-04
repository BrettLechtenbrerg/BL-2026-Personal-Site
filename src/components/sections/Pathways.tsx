"use client";

import { motion } from "framer-motion";
import { Mic2, Users, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

const pathways = [
  {
    icon: Mic2,
    title: "Speaking & Training",
    headline: "Your Audience Leaves Changed, Not Just Entertained",
    description:
      "Keynotes, workshops, and training sessions built on The Master's Edge methodology. Every session is customized. Every audience leaves with practical tools they can apply immediately.",
    href: "/speaking",
    cta: "Explore Speaking",
  },
  {
    icon: Users,
    title: "Executive Coaching",
    headline: "Become the Leader Your Business Needs You to Be",
    description:
      "One-on-one and team coaching through The Master's Edge program. We build a custom toolkit that fits you, your situation, and no one else.",
    href: "/coaching",
    cta: "Explore Coaching",
  },
  {
    icon: Bot,
    title: "AI Advisory",
    headline: "Free Your People to Do What Only Humans Can",
    description:
      "Through Total Success AI, Brett helps businesses turn AI into a leverage point — automating repetitive tasks so your team can focus on relationships, creativity, and high-value work.",
    href: "/ai-advisory",
    cta: "Explore AI Solutions",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

export function Pathways() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            How Brett Works With You
          </h2>
        </motion.div>

        {/* Three Pathways */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {pathways.map((pathway, index) => (
            <motion.div
              key={pathway.title}
              variants={cardVariants}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Top accent bar */}
              <div
                className={`h-2 ${
                  index === 1 ? "bg-gold" : "bg-cranberry"
                }`}
              />

              <div className="p-8">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    index === 1
                      ? "bg-gold/10 text-gold-dark"
                      : "bg-cranberry/10 text-cranberry"
                  }`}
                >
                  <pathway.icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <p
                  className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                    index === 1 ? "text-gold-dark" : "text-cranberry"
                  }`}
                >
                  {pathway.title}
                </p>

                {/* Headline */}
                <h3 className="text-xl font-bold text-black mb-4 leading-tight">
                  {pathway.headline}
                </h3>

                {/* Description */}
                <p className="text-warm-gray leading-relaxed mb-6">
                  {pathway.description}
                </p>

                {/* CTA */}
                <Link
                  href={pathway.href}
                  className={`inline-flex items-center gap-2 font-semibold transition-all group-hover:gap-3 ${
                    index === 1
                      ? "text-gold-dark hover:text-gold"
                      : "text-cranberry hover:text-cranberry-dark"
                  }`}
                >
                  {pathway.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

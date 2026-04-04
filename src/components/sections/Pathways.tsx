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
    gradient: "from-cranberry to-cranberry-dark",
    iconColor: "text-cranberry-light",
  },
  {
    icon: Users,
    title: "Executive Coaching",
    headline: "Become the Leader Your Business Needs You to Be",
    description:
      "One-on-one and team coaching through The Master's Edge program. We build a custom toolkit that fits you, your situation, and no one else.",
    href: "/coaching",
    cta: "Explore Coaching",
    gradient: "from-gold to-gold-dark",
    iconColor: "text-gold",
  },
  {
    icon: Bot,
    title: "AI Advisory",
    headline: "Free Your People to Do What Only Humans Can",
    description:
      "Through Total Success AI, Brett helps businesses turn AI into a leverage point — automating repetitive tasks so your team can focus on relationships, creativity, and high-value work.",
    href: "/ai-advisory",
    cta: "Explore AI Solutions",
    gradient: "from-cranberry to-cranberry-dark",
    iconColor: "text-cranberry-light",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 15 },
  },
};

export function Pathways() {
  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-80 h-80 bg-cranberry/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gold/25 rounded-full blur-[120px]"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            How Brett Works{" "}
            <span className="bg-gradient-to-r from-cranberry via-gold to-cranberry bg-clip-text text-transparent">
              With You
            </span>
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
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${pathway.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

              <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 h-full">
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${pathway.gradient}`} />

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${pathway.gradient} shadow-lg`}>
                    <pathway.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${pathway.iconColor}`}>
                    {pathway.title}
                  </p>

                  {/* Headline */}
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                    {pathway.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {pathway.description}
                  </p>

                  {/* CTA */}
                  <Link
                    href={pathway.href}
                    className={`inline-flex items-center gap-2 font-semibold transition-all group-hover:gap-3 ${pathway.iconColor}`}
                  >
                    {pathway.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

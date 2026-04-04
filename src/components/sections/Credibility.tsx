"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";

const stats = [
  { value: "30+", label: "Years in Business" },
  { value: "7", label: "Books Authored", sublabel: "(5 Bestsellers)" },
  { value: "8th°", label: "Black Belt" },
  { value: "1000s", label: "Trained" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export function Credibility() {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Why <span className="text-cranberry">Brett</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className="text-center"
            >
              <p className="text-5xl lg:text-6xl font-bold text-gold mb-2">
                {stat.value}
              </p>
              <p className="text-gray-300 font-medium">{stat.label}</p>
              {stat.sublabel && (
                <p className="text-gray-500 text-sm">{stat.sublabel}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Brett Lechtenberg is a peak performance coach, speaker, and author who
            has spent three decades helping people discover who they&apos;re meant to
            become. As the creator of{" "}
            <span className="text-white font-semibold">The Master&apos;s Edge</span>, an
            8th-degree black belt with over 40 years in martial arts, and a flow
            state researcher validated by the{" "}
            <span className="text-gold">Flow Research Collective</span>, Brett
            brings a depth of real-world experience that most coaches simply
            can&apos;t match.
          </p>
          <p className="text-xl text-white font-semibold mb-10">
            He only teaches what he&apos;s tested in his own business. That&apos;s the
            difference.
          </p>
          <Button href="/about" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
            More About Brett
          </Button>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-cranberry/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-40 top-1/3 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

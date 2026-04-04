"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "30+", label: "Years in Business", color: "text-gold" },
  { value: "7", label: "Books Authored", sublabel: "(5 Bestsellers)", color: "text-cranberry-light" },
  { value: "8th°", label: "Black Belt", color: "text-gold" },
  { value: "1000s", label: "Trained", color: "text-cranberry-light" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

export function Credibility() {
  return (
    <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/50 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cranberry-light/10 rounded-full blur-[120px]" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />

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
            Why <span className="text-gold">Brett</span>
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
              className="text-center relative"
            >
              {/* Glow behind stat */}
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className={`text-5xl lg:text-6xl font-black ${stat.color} mb-2`}>
                  {stat.value}
                </p>
                <p className="text-white font-medium">{stat.label}</p>
                {stat.sublabel && (
                  <p className="text-white/60 text-sm">{stat.sublabel}</p>
                )}
              </div>
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
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Brett Lechtenberg is a peak performance coach, speaker, and author who
              has spent three decades helping people discover who they&apos;re meant to
              become. As the creator of{" "}
              <span className="text-white font-semibold">The Master&apos;s Edge</span>, an
              8th-degree black belt with over 40 years in martial arts, and a flow
              state researcher validated by the{" "}
              <span className="text-gold font-semibold">Flow Research Collective</span>, Brett
              brings a depth of real-world experience that most coaches simply
              can&apos;t match.
            </p>
            <p className="text-xl text-white font-bold mb-10">
              He only teaches what he&apos;s tested in his own business. That&apos;s the
              difference.
            </p>
            <Button href="/about" variant="secondary" size="lg">
              More About Brett
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

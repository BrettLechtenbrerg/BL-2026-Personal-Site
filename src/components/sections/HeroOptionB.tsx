"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// OPTION B: "Centered Impact"
// - Full-width centered layout
// - Brett as background/side element
// - Centered headline + single CTA
// - Credentials as horizontal bar below
// - Bold, Apple-style feel

export function HeroOptionB() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Full background image of Brett */}
      <Image
        src="/brett-hero.webp"
        alt="Brett Lechtenberg"
        fill
        className="object-cover object-top opacity-40"
        priority
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      {/* Subtle color accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cranberry/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold/15 rounded-full blur-[150px]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-cranberry-light font-semibold tracking-widest uppercase text-sm mb-6"
          >
            Peak Performance Coaching
          </motion.p>

          {/* Big Bold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-8"
          >
            Gain{" "}
            <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
              The Master&apos;s Edge
            </span>
          </motion.h1>

          {/* Short punchy subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Clarify your goals. Simplify your approach. Maximize your results.
          </motion.p>

          {/* Single Bold CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button href={links.booking} external size="lg" className="text-lg px-10 py-5">
              Start the Conversation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Credentials Bar - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <div className="bg-gradient-to-t from-black to-transparent pt-16 pb-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16">
              {[
                { value: "30+", label: "Years in Business" },
                { value: "8th°", label: "Black Belt" },
                { value: "7", label: "Books Published" },
                { value: "1000s", label: "Leaders Coached" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-black text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

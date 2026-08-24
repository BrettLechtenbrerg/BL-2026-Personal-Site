"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen sm:min-h-[90vh] flex items-start pt-8 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero background image */}
      <Image
        src="/heroes/homepage.jpg"
        alt="Leadership and peak performance"
        fill
        className="object-cover opacity-40"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

      {/* Subtle animated gradient orbs - toned down */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-cranberry/30 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content - slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow with icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-cranberry-light font-medium text-sm">
                Peak Performance Coaching
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Achieve More{" "}
              <span className="text-shimmer bg-gradient-to-r from-gold via-cranberry-light to-cranberry bg-clip-text text-transparent">
                Without Doing More
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl"
            >
              Build the focus, leadership, and AI advantage to accomplish more, lead more effectively, and perform at your best&mdash;without adding more hours or overwhelm.
            </motion.p>

            {/* CTAs - 2 buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button href={links.booking} external size="lg">
                Talk With Brett
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                href="/masters-edge"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Image - slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Breathing glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cranberry/40 via-gold/30 to-cranberry/40 rounded-3xl blur-2xl opacity-50 animate-pulse-slow" />

            {/* Image frame */}
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:border-gold/40 hover:shadow-gold/20">
              <Image
                src="/media-kit/brett-twins-nobg.png"
                alt="Brett Lechtenberg - Peak Performance Coach"
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                priority
              />
              {/* Sweeping light on hover */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>

            {/* Single floating badge - 30+ Years - TOP RIGHT */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-4 -right-4"
            >
              <div className="animate-float bg-gradient-to-br from-gold to-gold-dark rounded-xl shadow-2xl shadow-gold/30 p-4">
                <p className="text-black font-black text-2xl">30+</p>
                <p className="text-black/70 text-xs font-semibold">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Value Pillars - Clarify, Simplify, Maximize */}
      {/* Only visible on 2xl+ (desktop) - floating inside hero */}
      <div className="hidden 2xl:block absolute bottom-40 left-0 right-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-6">
            {[
              { main: "CLARIFY", sub: "Goals, Dreams, Desires", gradient: "from-cranberry to-cranberry-dark" },
              { main: "SIMPLIFY", sub: "Life, Business, Relationships", gradient: "from-gold to-gold-dark" },
              { main: "MAXIMIZE", sub: "Focus, Confidence, Actions, Results", gradient: "from-cranberry to-cranberry-dark" },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.main}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                className="group relative"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${pillar.gradient} rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                <div className={`shine relative bg-gradient-to-r ${pillar.gradient} rounded-full px-8 py-4 text-center shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-transform duration-300`}>
                  <p className="text-white font-black text-xl tracking-wider mb-1">
                    {pillar.main}
                  </p>
                  <p className="text-white/80 text-sm font-medium">
                    {pillar.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-cranberry/70"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

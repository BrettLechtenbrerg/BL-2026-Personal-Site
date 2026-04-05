"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// OPTION C: "Above the Fold Focus"
// - Keep side-by-side layout
// - Remove ALL badges and pillars from hero
// - Just: Headline → Short subhead → One button → Photo
// - Ultra-clean, lets copy and photo do the work

export function HeroOptionC() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Minimal background - just subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cranberry/10 via-transparent to-gold/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content - Minimal & Direct */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Simple headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Discover Who You&apos;re{" "}
              <span className="text-cranberry-light">Meant</span>{" "}
              to Become
            </h1>

            {/* Short subhead */}
            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-md">
              Peak performance coaching for leaders ready to
              clarify, simplify, and maximize.
            </p>

            {/* Single CTA */}
            <Button href={links.booking} external size="lg">
              Talk to Brett
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Image - Clean, no badges, no effects */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/brett-hero.webp"
                alt="Brett Lechtenberg"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

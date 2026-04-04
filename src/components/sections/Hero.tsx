"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cranberry/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content - slides from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1], // Spring bounce
              delay: 0.2,
            }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4"
            >
              Peak Performance Coaching for Businesses, Teams, and Individuals
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6"
            >
              Discover Who You&apos;re{" "}
              <span className="text-cranberry">Meant</span> to Become
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-warm-gray leading-relaxed mb-8 max-w-xl"
            >
              Brett Lechtenberg helps leaders unlock peak performance through{" "}
              <span className="text-black font-semibold">The Master&apos;s Edge</span> — a
              proven methodology built on 30+ years of real-world experience,
              original flow state research, and strategies tested in his own
              business.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button href={links.booking} external size="lg">
                Talk to Brett
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button href="/masters-edge" variant="outline" size="lg">
                Explore The Master&apos;s Edge
              </Button>
            </motion.div>
          </motion.div>

          {/* Image container - slides from left with overlap dock effect */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1], // Spring bounce
              delay: 0.1,
            }}
            className="order-1 lg:order-2 relative"
          >
            {/* Glassmorphism card behind image */}
            <div className="absolute inset-4 lg:inset-0 lg:-right-8 bg-gradient-to-br from-cranberry/20 to-gold/20 rounded-3xl blur-2xl" />

            {/* Image frame with gold accent */}
            <div className="relative">
              {/* Decorative gold ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -inset-4 border-4 border-gold/30 rounded-3xl"
              />

              {/* Placeholder for Brett's photo */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-2xl">
                {/* Replace this with actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full" />
                    <p className="text-sm font-medium">Brett Lechtenberg</p>
                    <p className="text-xs mt-1">Professional Photo Here</p>
                  </div>
                </div>
              </div>

              {/* Floating credential badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
              >
                <p className="text-gold font-bold text-2xl">30+</p>
                <p className="text-xs text-warm-gray">Years in Business</p>
              </motion.div>

              {/* Second floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute -top-4 -right-4 bg-cranberry text-white rounded-xl shadow-xl p-4"
              >
                <p className="font-bold text-2xl">8th°</p>
                <p className="text-xs opacity-90">Black Belt</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

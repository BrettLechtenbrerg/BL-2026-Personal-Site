"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const trustedLogos = [
  { name: "American Express", src: "/logos/american-express.svg", width: 140 },
  { name: "Delta Airlines", src: "/logos/delta.svg", width: 120 },
  { name: "Citigroup", src: "/logos/citigroup.svg", width: 100 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-cranberry/40 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cranberry/20 rounded-full blur-[80px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
            }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow with icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-4 py-2 mb-6"
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
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Discover Who You&apos;re{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Meant
              </span>{" "}
              to Become
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl"
            >
              Brett Lechtenberg helps leaders unlock peak performance through{" "}
              <span className="text-gold font-semibold">The Master&apos;s Edge</span> — a
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
              <Button href="/masters-edge" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Explore The Master&apos;s Edge
              </Button>
            </motion.div>

            {/* Trust badges with logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <p className="text-gray-500 text-sm mb-6">Trusted by leaders at</p>
              <div className="flex flex-wrap items-center gap-8">
                {trustedLogos.map((logo) => (
                  <div key={logo.name} className="opacity-70 hover:opacity-100 transition-opacity">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image container */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.1,
            }}
            className="order-1 lg:order-2 relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-60" />

            {/* Image frame */}
            <div className="relative">
              {/* Animated border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold via-50% to-cranberry rounded-3xl opacity-30"
                style={{ backgroundSize: "200% 100%" }}
              />

              {/* Brett's Photo */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-cranberry/20 via-black to-gold/20 rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/brett-hero.webp"
                  alt="Brett Lechtenberg - Peak Performance Coach and 8th Degree Black Belt"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating credential badges */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-gold to-gold-dark rounded-2xl shadow-2xl shadow-gold/20 p-5"
              >
                <p className="text-black font-black text-3xl">30+</p>
                <p className="text-black/70 text-sm font-medium">Years in Business</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-cranberry to-cranberry-dark text-white rounded-2xl shadow-2xl shadow-cranberry/30 p-5"
              >
                <p className="font-black text-3xl">8th°</p>
                <p className="text-white/80 text-sm font-medium">Black Belt</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4"
              >
                <p className="text-cranberry font-black text-2xl">7</p>
                <p className="text-gray-600 text-xs font-medium">Books<br/>Published</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

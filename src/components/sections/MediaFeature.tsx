"use client";

import { motion } from "framer-motion";
import { Play, Tv } from "lucide-react";
import Image from "next/image";

export function MediaFeature() {
  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cranberry/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gold/25 rounded-full blur-[80px]"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6">
            <Tv className="w-4 h-4 text-gold" />
            <span className="text-gold font-semibold text-sm">As Seen On</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Brett in{" "}
            <span className="bg-gradient-to-r from-cranberry via-gold to-cranberry bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Watch Brett share insights on peak performance, flow state, and The Master&apos;s Edge methodology.
          </p>
        </motion.div>

        {/* Video & Logo Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Video */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring" as const, stiffness: 80, damping: 15 }}
            className="lg:col-span-2"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

              {/* Video container */}
              <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/Dq7agUEBr6I"
                    title="Brett Lechtenberg on Good Things Utah"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Video label */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Good Things Utah</p>
                  <p className="text-gray-400 text-sm">ABC4 Utah - Peak Performance Interview</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured On Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring" as const, stiffness: 80, damping: 15, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-6">Featured On</h3>

              <div className="space-y-4">
                {/* Good Things Utah */}
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors">
                  <Image
                    src="/logos/good-things-utah.webp"
                    alt="Good Things Utah"
                    width={80}
                    height={45}
                    className="h-11 w-auto rounded"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">Good Things Utah</p>
                    <p className="text-gray-400 text-xs">ABC4 Utah</p>
                  </div>
                </div>

                {/* The Daily Dish */}
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors">
                  <div className="w-20 h-11 bg-gradient-to-br from-cranberry to-cranberry-dark rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">CW30</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">The Daily Dish</p>
                    <p className="text-gray-400 text-xs">CW30 Utah</p>
                  </div>
                </div>

                {/* Profiles in Caring */}
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors">
                  <div className="w-20 h-11 bg-gradient-to-br from-gold to-gold-dark rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xs text-center leading-tight">Profiles</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Profiles in Caring</p>
                    <p className="text-gray-400 text-xs">Community Feature</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gold font-black text-2xl">100+</p>
                  <p className="text-gray-400 text-xs">Speaking Events</p>
                </div>
                <div>
                  <p className="text-cranberry-light font-black text-2xl">7</p>
                  <p className="text-gray-400 text-xs">Published Books</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

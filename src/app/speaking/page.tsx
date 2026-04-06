"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { LogoScroller } from "@/components/sections/LogoScroller";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Target, Lightbulb, Zap, Users, Smile, Mic2, Quote, Camera } from "lucide-react";
import Image from "next/image";

const outcomes = [
  { icon: Sparkles, title: "Transformative Impact", description: "Lasting impact, practical tools, and genuine inspiration", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Target, title: "Tailored Customization", description: "High-level customization that resonates with your specific audience", gradient: "from-gold to-gold-dark" },
  { icon: Lightbulb, title: "Actionable Insights", description: "Strategies they can implement immediately", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Zap, title: "Dynamic Energy", description: "High energy ensuring a memorable experience", gradient: "from-gold to-gold-dark" },
  { icon: Users, title: "Evidence-Based", description: "Science-backed strategies from original research", gradient: "from-cranberry to-cranberry-dark" },
  { icon: Smile, title: "Engaging Humor", description: "Substance combined with fun", gradient: "from-gold to-gold-dark" },
];

const talks = [
  {
    title: "The Master's Edge",
    subtitle: "Peak Performance Through Mastery of Mindset, Skillset, and Support Structure",
    description: "The flagship presentation. A deep dive into the methodology that has transformed thousands.",
    bestFor: "Corporate events, leadership summits, conference keynotes",
  },
  {
    title: "Reclaiming The Clock",
    subtitle: "Mastering Habits, Productivity, and the Truth About Time",
    description: "A first-principles approach to eliminating time management myths and building systems that work.",
    bestFor: "Business owners, entrepreneurs, chamber events",
  },
  {
    title: "A Category of One",
    subtitle: "Position Yourself So Far Ahead That Comparison Becomes Irrelevant",
    description: "How to use first principles thinking to differentiate in ways competitors can't copy.",
    bestFor: "Sales conferences, industry events, competitive environments",
  },
  {
    title: "The Limitless Mindset",
    subtitle: "Breaking Through the Mental Barriers Between You and Your Best Performance",
    description: "The mindset shifts that dramatically upgrade business and life satisfaction.",
    bestFor: "Motivational events, personal development conferences",
  },
  {
    title: "Winning Team Culture",
    subtitle: "The Science of Building an Empowered Team of Motivated Professionals",
    description: "How to engineer flow states at the team level and build sustainable peak performance.",
    bestFor: "Corporate retreats, management training, sports organizations",
  },
];

const galleryImages = [
  { src: "/speaking-gallery/speaking-1.png", alt: "Brett delivering keynote presentation", size: "large" },
  { src: "/speaking-gallery/murray-chamber-training.webp", alt: "Murray Chamber of Commerce Training", size: "medium" },
  { src: "/speaking-gallery/speaking-2.png", alt: "Brett engaging with audience", size: "medium" },
  { src: "/speaking-gallery/referral-community.png", alt: "Referral Community Event", size: "large" },
  { src: "/speaking-gallery/speaking-3.png", alt: "Interactive workshop session", size: "medium" },
  { src: "/speaking-gallery/murray-chamber-2.jpeg", alt: "Team training at Murray Chamber", size: "medium" },
  { src: "/speaking-gallery/speaking-4.jpg", alt: "Brett on stage", size: "large" },
];

export default function SpeakingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark gradient */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/speaking.jpg"
            alt="Speaker on stage with dramatic lighting"
            fill
            className="object-cover opacity-50"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-cranberry/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/30 rounded-full blur-[100px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-5 py-2 mb-6"
            >
              <Mic2 className="w-4 h-4 text-gold" />
              <span className="text-cranberry-light font-semibold text-sm">Speaking & Training</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Your Audience Leaves{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Changed
              </span>
              , Not Just Entertained
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Keynotes, workshops, and training sessions built on The Master&apos;s Edge
              methodology. Every session delivers both inspiration and practical tools
              — because your audience deserves more than motivation that fades by Monday.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button href={links.booking} external size="lg">
                Book Brett for Your Event
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Client Logos - Scrolling */}
        <LogoScroller />

        {/* What You Can Expect - Gradient background */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center"
            >
              What You Can <span className="text-cranberry">Expect</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${outcome.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className="relative flex items-start gap-4 bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full group-hover:shadow-xl transition-all duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-br ${outcome.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <outcome.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">{outcome.title}</h3>
                      <p className="text-warm-gray text-sm">{outcome.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brett in Action Gallery - Dark section */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-cranberry/30 rounded-full blur-[150px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gold/25 rounded-full blur-[120px]"
            />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6">
                <Camera className="w-4 h-4 text-gold" />
                <span className="text-gold font-semibold text-sm">Gallery</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Brett in{" "}
                <span className="bg-gradient-to-r from-cranberry via-gold to-cranberry bg-clip-text text-transparent">
                  Action
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                From corporate boardrooms to championship teams — delivering transformation everywhere.
              </p>
            </motion.div>

            {/* Bento Grid Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                    image.size === "large"
                      ? "col-span-2 row-span-2"
                      : "col-span-1 row-span-1"
                  }`}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500 z-0" />

                  {/* Image container */}
                  <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 group-hover:border-gold/50 transition-all duration-500">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-medium text-sm md:text-base drop-shadow-lg">
                        {image.alt}
                      </p>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-gold to-cranberry rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { number: "100+", label: "Speaking Events" },
                { number: "50+", label: "Corporate Clients" },
                { number: "10K+", label: "Lives Impacted" },
                { number: "30+", label: "Years Experience" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry to-gold rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group-hover:border-gold/30 transition-all">
                    <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gold via-cranberry-light to-gold bg-clip-text text-transparent">
                      {stat.number}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Signature Talks - Dark section */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-80 h-80 bg-cranberry/30 rounded-full blur-[100px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Signature <span className="text-gold">Talks</span>
            </motion.h2>
            <div className="space-y-6">
              {talks.map((talk, index) => (
                <motion.div
                  key={talk.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-1">{talk.title}</h3>
                    <p className="text-gold font-medium mb-4">{talk.subtitle}</p>
                    <p className="text-gray-400 mb-4">{talk.description}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-cranberry-light">Best for:</span> {talk.bestFor}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-400 mt-8">
              All talks available as 60-minute keynotes, 90-minute workshops, or full-day interactive training sessions.
            </p>
          </div>
        </section>

        {/* Testimonials - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {[
                {
                  quote: "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
                  name: "Matt Gibbons",
                  title: "President, Murray Area Chamber of Commerce",
                },
                {
                  quote: "The impact of this two-phase event on our team has been nothing short of extraordinary. The lessons learned have not only improved our performance on the field but have also instilled a renewed sense of confidence and camaraderie.",
                  name: "Danny Larson",
                  title: "Head Football Coach, Juan Diego High School",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-full flex items-center justify-center">
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-lg italic text-black mb-4 pt-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-black">{testimonial.name}</p>
                        <p className="text-sm text-cranberry">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Bold cranberry gradient */}
        <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cranberry-light/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Let&apos;s Make Your Event Unforgettable
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Tell Brett about your event, your audience, and what you&apos;re hoping
                to achieve. He&apos;ll take it from there.
              </p>
              <Button href={links.booking} external size="lg" variant="secondary">
                Book Brett for Your Event
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

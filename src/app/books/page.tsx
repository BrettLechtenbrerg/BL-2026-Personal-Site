"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { EbookModal } from "@/components/ui/EbookModal";
import { links } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, Play, Tv, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const books = [
  {
    title: "The Master's Edge",
    status: "Coming Soon",
    description:
      "The definitive guide to Brett's proprietary peak performance methodology. Built on 30+ years of experience and original flow state research.",
    bestseller: false,
    upcoming: true,
    image: "/books/masters-edge.png",
    gradient: "bg-gradient-to-br from-cranberry/10 via-white to-gold/10",
  },
  {
    title: "Reclaiming The Clock",
    status: "Bestseller",
    description:
      "How to have more time, reduce stress, and increase peace of mind in a world of unparalleled distraction.",
    bestseller: true,
    image: "/books/reclaiming-the-clock.png",
    gradient: "bg-gradient-to-br from-gold/10 via-white to-cranberry/5",
  },
  {
    title: "The Anti-Bully Program",
    status: "#1 Amazon Bestseller",
    description:
      "A straightforward and insightful training program for families navigating bullying.",
    bestseller: true,
    image: "/books/anti-bully-program.png",
    gradient: "bg-gradient-to-tr from-cranberry/8 via-white to-gold/10",
  },
  {
    title: "The Anti-Cyber Bully Program",
    status: "#1 Amazon Bestseller",
    description: "Clear, actionable guidance for parents dealing with cyberbullying.",
    bestseller: true,
    image: "/books/anti-cyber-bully-program.png",
    gradient: "bg-gradient-to-bl from-gold/8 via-white to-cranberry/10",
  },
  {
    title: "Bullyproof: Unleash the Hero in Your Kid",
    status: "#1 Amazon Bestseller (Contributing Author)",
    description:
      "A collaborative work bringing together experts on child empowerment and safety.",
    bestseller: true,
    image: "/books/bullyproof.png",
    imageScale: "scale-[0.85]",
    gradient: "bg-gradient-to-r from-cranberry/5 via-gold/10 to-cranberry/5",
  },
  {
    title: "The Ultimate Travel Safety Program",
    status: "Bestseller",
    description:
      "Essential safety training for travelers, missionaries, and anyone heading abroad.",
    bestseller: true,
    image: "/books/travel-safety-program.png",
    imageScale: "scale-[0.85]",
    gradient: "bg-gradient-to-tl from-gold/10 via-white to-cranberry/8",
  },
  {
    title: "Protecting Your Castle",
    status: "Published",
    description:
      "The premier anti-home burglary and safety training program for homeowners and renters.",
    bestseller: false,
    image: "/books/protecting-your-castle.png",
    gradient: "bg-gradient-to-br from-cranberry/10 via-white to-gold/8",
  },
  {
    title: "How to Build a Rockstar Team",
    status: "Free eBook",
    description:
      "The essential guide to building, leading, and retaining a team of motivated professionals who perform at their best.",
    bestseller: false,
    freebie: true,
    image: "/books/rockstar-team.png",
    gradient: "bg-gradient-to-bl from-gold/10 via-white to-cranberry/10",
  },
];

const usaTodayImages = [
  { src: "/usa-today/butler-elementary.png", alt: "Brett's Anti-Bullying Program featured at Butler Elementary - USA Today" },
  { src: "/usa-today/phoenix-antibullying.png", alt: "USA Today coverage of Anti-Bullying program in Phoenix" },
  { src: "/usa-today/screenshot-2015.png", alt: "USA Today feature article 2015" },
  { src: "/usa-today/screenshot-2019.png", alt: "USA Today feature article 2019" },
  { src: "/usa-today/lp-bully.png", alt: "Anti-Bully Program featured in USA Today" },
  { src: "/usa-today/draper.jpg", alt: "Brett's program in Draper - USA Today" },
];

export default function BooksPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % usaTodayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + usaTodayImages.length) % usaTodayImages.length);
  };

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % usaTodayImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/books.jpg"
            alt="Library with books representing knowledge and publishing"
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
              className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cranberry/30 rounded-full blur-[100px]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6"
            >
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Books & Media</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Ideas That Have Helped{" "}
              <span className="bg-gradient-to-r from-gold via-gold to-cranberry bg-clip-text text-transparent">
                Thousands
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              Seven books, five bestsellers, and a growing library of media
              appearances — all built on one principle:{" "}
              <span className="text-white font-semibold">teach what you&apos;ve tested.</span>
            </motion.p>
          </div>
        </section>

        {/* Books - Gradient */}
        <section className="py-24 bg-gradient-to-b from-white via-gold/5 to-cranberry/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-cranberry to-gold" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center"
            >
              Brett&apos;s <span className="text-cranberry">Books</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {books.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative rounded-2xl ${"freebie" in book && book.freebie ? "cursor-pointer" : ""}`}
                  onClick={"freebie" in book && book.freebie ? () => setIsEbookModalOpen(true) : undefined}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${
                    book.upcoming
                      ? 'from-cranberry via-gold to-cranberry opacity-50 group-hover:opacity-60'
                      : "freebie" in book && book.freebie
                        ? 'from-green-500 via-emerald-400 to-green-500 opacity-40 group-hover:opacity-60'
                        : book.bestseller
                          ? 'from-gold via-cranberry to-gold opacity-0 group-hover:opacity-50'
                          : 'from-cranberry via-gold to-cranberry opacity-0 group-hover:opacity-30'
                  } rounded-2xl blur-lg transition-opacity duration-300`} />
                  <div className={`relative rounded-2xl p-8 border-2 h-full flex flex-col overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 ${
                    book.upcoming
                      ? "border-cranberry/60 group-hover:border-cranberry"
                      : "freebie" in book && book.freebie
                        ? "border-green-500/60 group-hover:border-green-500"
                        : book.bestseller
                          ? "border-gold/40 group-hover:border-gold/70"
                          : "border-cranberry/30 group-hover:border-cranberry/50"
                  } ${"gradient" in book && book.gradient ? book.gradient : "bg-white"}`}>
                    {/* Background Book Cover Image */}
                    {book.image && (
                      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={book.image}
                          alt=""
                          fill
                          className={`object-contain opacity-15 grayscale ${"imageScale" in book && book.imageScale ? book.imageScale : ""}`}
                        />
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header with title and badge */}
                      <div className="flex items-start justify-between mb-4 flex-shrink-0">
                        <h3 className="text-xl font-bold text-black">{book.title}</h3>
                        {"freebie" in book && book.freebie ? (
                          <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full flex-shrink-0 animate-pulse">
                            <span className="text-xs font-bold text-green-600">FREE</span>
                          </div>
                        ) : book.bestseller && (
                          <div className="flex items-center gap-1 bg-gold/10 px-3 py-1 rounded-full flex-shrink-0">
                            <Star className="w-4 h-4 text-gold fill-gold" />
                            <span className="text-xs font-semibold text-gold">Bestseller</span>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <p className={`text-sm font-semibold mb-4 flex-shrink-0 ${
                        book.upcoming
                          ? "text-cranberry"
                          : "freebie" in book && book.freebie
                            ? "text-green-600"
                            : "text-gold"
                      }`}>
                        {book.status}
                      </p>

                      {/* Description */}
                      <p className="text-warm-gray flex-grow">{book.description}</p>

                      {/* Coming Soon placeholder for upcoming books */}
                      {book.upcoming && !book.image && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-cranberry">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">Coming Soon</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Media - Dark */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-96 h-96 bg-cranberry/25 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Brett in the <span className="text-gold">Media</span>
            </motion.h2>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-8">
                <Tv className="w-4 h-4 text-gold" />
                <span className="text-gray-400 text-sm">As Seen On</span>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                {["Good Things Utah", "The Daily Dish (CW30)", "Channel 4", "Channel 13", "Profiles in Caring"].map((name, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold to-cranberry rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 text-white font-semibold group-hover:border-white/20 transition-all duration-300">
                      {name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Good Things Utah - Master's Edge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      src="https://www.youtube.com/embed/Dq7agUEBr6I"
                      title="Brett Lechtenberg on Good Things Utah"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-gray-400 text-sm">Good Things Utah - The Master&apos;s Edge</span>
                </div>
              </motion.div>

              {/* Profiles in Caring */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-gold via-cranberry to-gold rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      src="https://www.youtube.com/embed/tos_1uWdW4E?start=1"
                      title="Brett Lechtenberg - Profiles in Caring"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-gray-400 text-sm">Profiles in Caring</span>
                </div>
              </motion.div>

              {/* Daily Dish */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      src="https://www.youtube.com/embed/tHNnmrkqPrM"
                      title="Brett Lechtenberg on The Daily Dish - CW30"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-gray-400 text-sm">The Daily Dish - CW30</span>
                </div>
              </motion.div>

              {/* Wild Bear X on Good Things Utah */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-gold via-cranberry to-gold rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      src="https://www.youtube.com/embed/A4yGZCZL2S8"
                      title="Brett Lechtenberg on Good Things Utah - Wild Bear X"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-gray-400 text-sm">Good Things Utah - Wild Bear X</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USA Today Feature - Carousel */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-cranberry/10 border border-cranberry/20 rounded-full px-5 py-2 mb-6">
                <Newspaper className="w-4 h-4 text-cranberry" />
                <span className="text-cranberry font-semibold text-sm">National Press</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Featured in <span className="text-cranberry">USA Today</span>
              </h2>
              <p className="text-lg text-warm-gray max-w-2xl mx-auto">
                Brett&apos;s anti-bullying programs have received national recognition and coverage.
              </p>
            </motion.div>

            {/* Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative max-w-4xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-xl opacity-20" />

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Image container */}
                <div className="relative aspect-[16/10] bg-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={usaTodayImages[currentImage].src}
                        alt={usaTodayImages[currentImage].alt}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Caption and dots */}
                <div className="p-6 bg-gradient-to-r from-cranberry/5 to-gold/5">
                  <p className="text-center text-warm-gray text-sm mb-4">
                    {usaTodayImages[currentImage].alt}
                  </p>
                  <div className="flex justify-center gap-2">
                    {usaTodayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImage
                            ? "bg-cranberry w-8"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Image counter */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-full">
                {currentImage + 1} / {usaTodayImages.length}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Free Book CTA - Gradient */}
        <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cranberry-light/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Get Your Free Copy of <span className="text-gold">How to Build a Rockstar Team</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Brett&apos;s essential guide to building, leading, and retaining
                a team of motivated professionals — delivered to your inbox.
              </p>
              <button
                onClick={() => setIsEbookModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5" />
                Get the Free eBook
              </button>
            </motion.div>
          </div>
        </section>

        {/* CTA - Gold gradient */}
        <section className="py-24 bg-gradient-to-br from-gold via-gold-dark to-cranberry relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-black">
                Want Brett to Write the Next Chapter With You?
              </h2>
              <Button href={links.booking} external size="lg" className="bg-black text-white hover:bg-gray-900">
                Talk With Brett
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* eBook Lead Capture Modal */}
      <EbookModal
        isOpen={isEbookModalOpen}
        onClose={() => setIsEbookModalOpen(false)}
      />
    </>
  );
}

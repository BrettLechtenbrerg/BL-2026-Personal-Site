"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star, BookOpen, Play, Tv } from "lucide-react";
import Image from "next/image";

const books = [
  {
    title: "The Master's Edge",
    status: "Coming Soon",
    description:
      "The definitive guide to Brett's proprietary peak performance methodology. Built on 30+ years of experience and original flow state research.",
    bestseller: false,
    upcoming: true,
    image: null,
  },
  {
    title: "Reclaiming The Clock",
    status: "Bestseller",
    description:
      "How to have more time, reduce stress, and increase peace of mind in a world of unparalleled distraction.",
    bestseller: true,
    image: "/books/reclaiming-the-clock.png",
  },
  {
    title: "The Anti-Bully Program",
    status: "#1 Amazon Bestseller",
    description:
      "A straightforward and insightful training program for families navigating bullying.",
    bestseller: true,
    image: "/books/anti-bully-program.png",
  },
  {
    title: "The Anti-Cyber Bully Program",
    status: "#1 Amazon Bestseller",
    description: "Clear, actionable guidance for parents dealing with cyberbullying.",
    bestseller: true,
    image: "/books/anti-cyber-bully-program.png",
  },
  {
    title: "Bullyproof: Unleash the Hero in Your Kid",
    status: "#1 Amazon Bestseller (Contributing Author)",
    description:
      "A collaborative work bringing together experts on child empowerment and safety.",
    bestseller: true,
    image: "/books/bullyproof.png",
  },
  {
    title: "The Ultimate Travel Safety Program",
    status: "Bestseller",
    description:
      "Essential safety training for travelers, missionaries, and anyone heading abroad.",
    bestseller: true,
    image: "/books/travel-safety-program.png",
  },
  {
    title: "Protecting Your Castle",
    status: "Published",
    description:
      "The premier anti-home burglary and safety training program for homeowners and renters.",
    bestseller: false,
    image: "/books/protecting-your-castle.png",
  },
];

export default function BooksPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/books.jpg"
            alt="Library with books representing knowledge and publishing"
            fill
            className="object-cover opacity-40"
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
                  className="group relative rounded-2xl"
                >
                  {book.upcoming ? (
                    <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-2xl blur-lg opacity-40" />
                  ) : (
                    <div className={`absolute -inset-1 bg-gradient-to-r ${book.bestseller ? 'from-gold to-gold-dark' : 'from-cranberry to-cranberry-dark'} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  )}
                  <div className={`relative rounded-2xl p-8 border-2 h-full flex flex-col ${
                    book.upcoming
                      ? "border-cranberry bg-gradient-to-br from-cranberry/10 via-white to-gold/10"
                      : "border-gray-100 bg-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  }`}>
                    {/* Header with title and bestseller badge */}
                    <div className="flex items-start justify-between mb-4 flex-shrink-0">
                      <h3 className="text-xl font-bold text-black">{book.title}</h3>
                      {book.bestseller && (
                        <div className="flex items-center gap-1 bg-gold/10 px-3 py-1 rounded-full flex-shrink-0">
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <span className="text-xs font-semibold text-gold">Bestseller</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <p className={`text-sm font-semibold mb-4 flex-shrink-0 ${
                      book.upcoming ? "text-cranberry" : "text-gold"
                    }`}>
                      {book.status}
                    </p>

                    {/* Book Cover Image */}
                    <div className="flex justify-center mb-6">
                      {book.image ? (
                        <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                          <Image
                            src={book.image}
                            alt={`${book.title} book cover`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-48 h-64 rounded-lg flex items-center justify-center ${
                          book.upcoming
                            ? "bg-gradient-to-br from-cranberry/20 to-gold/20 border-2 border-dashed border-cranberry/40"
                            : "bg-gray-100"
                        }`}>
                          <div className="text-center">
                            <BookOpen className={`w-12 h-12 mx-auto mb-2 ${
                              book.upcoming ? "text-cranberry" : "text-gray-400"
                            }`} />
                            <span className={`text-sm font-medium ${
                              book.upcoming ? "text-cranberry" : "text-gray-400"
                            }`}>
                              {book.upcoming ? "Coming Soon" : "Cover"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-warm-gray text-center flex-grow">{book.description}</p>
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
                {["Good Things Utah", "Channel 4", "Channel 13", "Profiles in Caring"].map((name, index) => (
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

            {/* Video */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                  <iframe
                    src="https://www.youtube.com/embed/Dq7agUEBr6I"
                    title="Brett Lechtenberg on Good Things Utah"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-gray-400">Good Things Utah Interview</span>
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
                Get Your Free Copy of <span className="text-gold">Reclaiming The Clock</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Brett&apos;s bestselling book on habit management and time creation —
                delivered to your inbox.
              </p>
              <Button href={links.booking} external variant="secondary" size="lg">
                Get the Free Book
              </Button>
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
                Talk to Brett
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

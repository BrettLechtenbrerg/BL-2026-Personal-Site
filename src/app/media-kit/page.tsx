"use client";

// Talk & Training Topics uses the four-lane structure per
// CLAUDE_CODE_SPEC_Speaking_Page_v2.md (Section 9). Promoted from the
// /media-kit-v2 draft on July 3, 2026 after side-by-side review.

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Download, FileText, Image as ImageIcon, Mic2, Monitor, User, Copy, Check, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LiveClip } from "@/components/ui/LiveClip";

const talkLanes = [
  {
    lane: "Peak Performance & Mindset",
    talks: [
      {
        title: "The Master's Edge",
        subtitle: "The Science of Inside-Out Transformation",
        duration: "60 to 90 min keynote or full-day workshop",
        bestFor: "Corporate events, leadership summits, conference keynotes",
      },
      {
        title: "The Limitless Mindset",
        subtitle: "Breaking Through the Mental Barriers Between You and Your Best Performance",
        duration: "60 to 90 min keynote or workshop",
        bestFor: "Company kickoffs, leadership retreats, conference keynotes",
      },
      {
        title: "Reclaiming The Clock",
        subtitle: "Mastering Habits, Productivity, and the Truth About Time",
        duration: "60 to 90 min keynote or half-day workshop",
        bestFor: "Business owners, entrepreneurs, chamber events",
      },
      {
        title: "Flow by Design",
        subtitle: "The Research-Backed Science of Peak States, Faster Learning, and Effortless Performance",
        duration: "60 to 90 min keynote",
        bestFor: "Conferences, high-performance teams, healthcare and technology audiences",
      },
    ],
  },
  {
    lane: "Leadership & Team Culture",
    talks: [
      {
        title: "Winning Team Culture",
        subtitle: "The Science of Building an Empowered Team of Motivated Professionals",
        duration: "Half-day or full-day training",
        bestFor: "Corporate retreats, management training, sports organizations",
      },
      {
        title: "The Road Less Traveled (Mastery Edition)",
        subtitle: "What 40 Years of Martial Arts Mastery Teaches Leaders About Excellence, Patience, and Longevity",
        duration: "45 to 60 min keynote",
        bestFor: "Leadership retreats, founder and owner groups, closing keynotes",
      },
    ],
  },
  {
    lane: "AI for Humans",
    talks: [
      {
        title: "Who Owns the Outcome?",
        subtitle: "The Leadership Question That Decides Whether AI Transforms Your Organization or Quietly Damages It",
        duration: "15 to 25 min keynote, expandable to 45 to 60 min",
        bestFor: "Executive meetings, leadership summits, board retreats, company kickoffs",
      },
      {
        title: "The AI Edge",
        subtitle: "Build It Before You Leave. A Hands-On Workshop",
        duration: "Half-day or full-day workshop; 90-minute starter version available",
        bestFor: "Leadership teams, operations and sales teams, company retreats where people need to leave with something working",
      },
    ],
  },
  {
    lane: "Sales & Ethical Influence",
    talks: [
      {
        title: "The Honest Close",
        subtitle: "The Three Beliefs Behind Every Yes and the Ethical Framework That Earns Them",
        duration: "60 to 90 min keynote or half-day training",
        bestFor: "Sales team meetings, credit unions and financial services, any team tired of pressure tactics",
      },
      {
        title: "A Category of One",
        subtitle: "Position Yourself So Far Ahead That Comparison Becomes Irrelevant",
        duration: "60 to 90 min keynote",
        bestFor: "Sales conferences, industry events, competitive environments",
      },
    ],
  },
];

const avRequirements = [
  "Wireless clip-on microphone (preferred) or handheld",
  "LCD projector and screen for presentations",
  "HDMI connection for laptop (adapter provided if needed)",
  "Confidence monitor or ability to see slides",
  "Stage lighting appropriate for video recording",
  "Small table for materials/water",
  "Brett may bring a videographer or set up a camera to record the session for his own promotional use. Please let us know in advance if your organization has restrictions.",
];

// Stage and event photos (Website-Fixes spec 3.8, Sep 27 2026). Captions match
// the /speaking gallery. More photos coming: add entries here.
const eventPhotos = [
  { src: "/speaking-gallery/america-first-training.jpg", label: "America First Credit Union", description: "Brett with the America First Credit Union team, Super Ethical Sales & Team Building, August 2026" },
  { src: "/speaking-gallery/murray-chamber-training.webp", label: "Murray Chamber of Commerce", description: "Women in Business Empowerment Training, Murray Chamber of Commerce, May 2026" },
];

const shortBio = `Brett Lechtenberg is a peak performance coach, author of seven books including five bestsellers, and the creator of The Master's Edge methodology. With over 30 years as a business owner and an 8th-degree black belt, Brett brings real-world business experience, original flow state research, and proven leadership principles to every audience he serves.`;

const longBio = `Brett Lechtenberg is a peak performance coach, bestselling author, and the creator of The Master's Edge, a transformational methodology that helps leaders unlock their full potential through three pillars: First Principles to clarify, Frontloading to simplify, and Flow to maximize.

For over three decades, Brett has run Personal Mastery Martial Arts in Sandy, Utah, a living laboratory where every strategy was tested before it was ever taught. That real-world experience, combined with his formal research on flow states reviewed by the Flow Research Collective, gives Brett a perspective that resonates with audiences from corporate boardrooms to championship sports teams.

An 8th-degree black belt and author of seven books, five of them bestsellers, on topics ranging from personal safety to time management to AI, Brett has spoken at organizations including America First Credit Union, Packsize, Purple, Thumbtack, American Express, Delta, and chambers of commerce across Utah. His approach combines evidence-based strategies with engaging storytelling and practical application, so audiences leave not just inspired but equipped with tools they can use immediately.

Brett is also co-founder of Total Success AI, where he helps businesses adopt AI with a human-centered approach, and author of Powerful AI Strategies for Business Owners. His next book, The Master's Edge, is coming October 2026.`;

const shortIntro = `Please welcome Brett Lechtenberg, peak performance coach, author of seven books including five bestsellers, and creator of The Master's Edge methodology. With over 30 years as a business owner and an 8th-degree black belt, Brett brings practical, tested strategies for achieving peak performance. Please welcome, Brett Lechtenberg!`;

const longIntro = `Our next speaker is someone who doesn't just teach peak performance. He lives it.

Brett Lechtenberg has spent over 30 years running his own business, testing every strategy he teaches in the real world before sharing it with others. He's an 8th-degree black belt, author of seven books including five bestsellers, and the creator of The Master's Edge, a methodology that has helped thousands of leaders clarify their goals, simplify their approach, and maximize their results.

His original research on flow states has been reviewed by the Flow Research Collective, and his client list includes America First Credit Union, Packsize, American Express, and Delta.

But what makes Brett different isn't just his credentials. It's his ability to take complex concepts and make them immediately actionable. Your audience won't just be inspired today. They'll leave with real tools they can use tomorrow.

Please give a warm welcome to Brett Lechtenberg!`;

export default function MediaKitPage() {
  const [copiedBio, setCopiedBio] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBio(type);
    setTimeout(() => setCopiedBio(null), 2000);
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-16 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Background Image */}
          <Image
            src="/heroes/speaking.jpg"
            alt="Brett Lechtenberg speaking at an event"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/40 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cranberry/30 rounded-full blur-[100px]"
            />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6"
            >
              <Download className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Media Kit</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Event Planner{" "}
              <span className="bg-gradient-to-r from-gold via-cranberry-light to-cranberry bg-clip-text text-transparent">
                Resources
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              Everything you need to promote Brett&apos;s appearance at your event:
              biography, headshots, introductions, topics, and AV requirements.
            </motion.p>
          </div>
        </section>

        {/* Speaker One-Sheet Download */}
        <section className="py-16 bg-gradient-to-b from-gold/10 via-white to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cranberry via-cranberry-dark to-black rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[80px]" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                    <FileText className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Speaker One-Sheet</h2>
                    <p className="text-white/70">Everything you need in a single PDF: bio, topics, testimonials &amp; more</p>
                  </div>
                </div>
                <a
                  href="/brett-lechtenberg-speaker-one-sheet.pdf"
                  download
                  className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-black font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Speaker Footage: 2026 sizzle reel (moved under the one-sheet, spec 3.7) */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[500px] h-[500px] bg-cranberry/30 rounded-full blur-[130px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/25 rounded-full blur-[110px]"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Speaker Footage</h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full"
              >
                <LiveClip
                  src="/videos/sizzle-reel-2026.mp4"
                  poster="/videos/sizzle-reel-poster.jpg"
                  label="Brett Lechtenberg 2026 speaker sizzle reel"
                  aspect="wide"
                  caption="▶ Watch the 2:56 sizzle reel (with sound)"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-heading">
                  See What Your Audience Gets
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Brett&apos;s official 2026 sizzle reel: live keynotes,
                  corporate trainings, and audience reaction in under three
                  minutes.
                </p>
                <a
                  href="/videos/sizzle-reel-2026.mp4"
                  download
                  className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-black font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg mb-6"
                >
                  <Download className="w-5 h-5" />
                  Download the reel
                </a>
                <p className="text-gray-400 text-sm">
                  Need raw video files or additional footage for event promotion?{" "}
                  <a href="/contact" className="text-gold hover:underline">Contact us</a>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Headshots */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">Headshots</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { src: "/media-kit/brett-headshot-nobg.webp", label: "Professional Headshot", description: "Transparent background, ideal for graphics", hasBg: false },
                { src: "/media-kit/brett-fullbody-nobg.webp", label: "Full Body Portrait", description: "Transparent background, ideal for banners", hasBg: false },
                { src: "/media-kit/brett-casual.webp", label: "Casual Portrait", description: "Approachable office setting", hasBg: true },
                { src: "/media-kit/brett-twins.png", label: "Dual Portrait", description: "Martial arts & business, black background", hasBg: true },
                { src: "/media-kit/brett-twins-nobg.png", label: "Dual Portrait (No BG)", description: "Martial arts & business, transparent", hasBg: false },
              ].map((photo, index) => (
                <motion.div
                  key={photo.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg ${!photo.hasBg ? 'bg-gradient-to-br from-gray-100 via-gray-50 to-white' : ''}`}>
                    <Image
                      src={photo.src}
                      alt={photo.label}
                      fill
                      className={`${photo.hasBg ? 'object-cover' : 'object-contain'} object-center`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <a
                        href={photo.src}
                        download
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                  <h3 className="font-semibold text-black">{photo.label}</h3>
                  <p className="text-warm-gray text-sm">{photo.description}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-warm-gray text-sm mt-8">
              Need different formats or higher resolution? <a href="/contact" className="text-cranberry hover:underline">Contact us</a>.
            </p>
          </div>
        </section>

        {/* Stage and Event Photos (spec 3.8) */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black">Stage and Event Photos</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventPhotos.map((photo, index) => (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-lg">
                    <Image
                      src={photo.src}
                      alt={photo.description}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <a
                        href={photo.src}
                        download
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                  <h3 className="font-semibold text-black">{photo.label}</h3>
                  <p className="text-warm-gray text-sm">{photo.description}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-warm-gray text-sm mt-8">
              More event photos are on the way. Need something specific? <a href="/contact" className="text-cranberry hover:underline">Contact us</a>.
            </p>
          </div>
        </section>

        {/* Biography */}
        <section className="py-20 bg-gradient-to-b from-cranberry/5 via-white to-gold/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black">Biography</h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-black">Short Bio (50 words)</h3>
                    <button
                      onClick={() => copyToClipboard(shortBio, "shortBio")}
                      className="flex items-center gap-1 text-sm text-cranberry hover:text-cranberry-dark transition-colors"
                    >
                      {copiedBio === "shortBio" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedBio === "shortBio" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-warm-gray leading-relaxed">{shortBio}</p>
                </motion.div>

                {/* Master's Edge cover (spec 3.11). Same mockup used on /books. */}
                <motion.figure
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                >
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden">
                    <Image
                      src="/books/masters-edge-stack.jpg"
                      alt="The Master's Edge by Brett Lechtenberg, book cover"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-sm font-semibold text-cranberry">
                    The Master&apos;s Edge, coming October 2026.
                  </figcaption>
                </motion.figure>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-black">Full Bio (200 words)</h3>
                    <button
                      onClick={() => copyToClipboard(longBio, "longBio")}
                      className="flex items-center gap-1 text-sm text-cranberry hover:text-cranberry-dark transition-colors"
                    >
                      {copiedBio === "longBio" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedBio === "longBio" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-warm-gray leading-relaxed whitespace-pre-line text-sm">{longBio}</p>
                </motion.div>
                <p className="text-warm-gray text-sm leading-relaxed mt-6">
                  <span className="font-semibold text-black">Recent clients</span>{" "}
                  include America First Credit Union, Packsize, Purple, Thumbtack,
                  MemberSolutions, American Express, Delta, and the Murray, Park
                  City, and Heber Valley Chambers of Commerce.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introductions */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Pre-Written Introductions</h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Short Introduction (30 sec)</h3>
                  <button
                    onClick={() => copyToClipboard(shortIntro, "shortIntro")}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors"
                  >
                    {copiedBio === "shortIntro" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedBio === "shortIntro" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed">{shortIntro}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Full Introduction (60-90 sec)</h3>
                  <button
                    onClick={() => copyToClipboard(longIntro, "longIntro")}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors"
                  >
                    {copiedBio === "longIntro" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedBio === "longIntro" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">{longIntro}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Talk Topics — FOUR-LANE STRUCTURE (the only changed section vs /media-kit) */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black">Talk & Training Topics</h2>
            </motion.div>

            <div className="space-y-10">
              {talkLanes.map((laneGroup) => (
                <div key={laneGroup.lane}>
                  <p className="text-gold-dark font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                    {laneGroup.lane}
                  </p>
                  <div className="space-y-4">
                    {laneGroup.talks.map((talk, index) => (
                      <motion.div
                        key={talk.title}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-cranberry/5 to-gold/5 rounded-2xl p-6 border border-gray-100"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-black">{talk.title}</h3>
                            <p className="text-cranberry font-medium">{talk.subtitle}</p>
                          </div>
                          <div className="text-sm text-warm-gray md:text-right md:flex-shrink-0">
                            <p><span className="font-semibold">Duration:</span> {talk.duration}</p>
                            <p><span className="font-semibold">Best for:</span> {talk.bestFor}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-warm-gray text-sm mt-8">
              All topics can be customized to your audience and event format. <a href="/book-brett" className="text-cranberry hover:underline">Request a custom presentation</a>.
            </p>
          </div>
        </section>

        {/* AV Requirements */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">AV & Technical Requirements</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-3xl"
            >
              <ul className="space-y-4">
                {avRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cranberry/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-cranberry" />
                    </div>
                    <span className="text-warm-gray">{req}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-warm-gray">
                  <span className="font-semibold text-black">Note:</span> Brett travels with his own presentation clicker and can adapt to most AV setups. For virtual events, he uses professional lighting and audio equipment from his studio.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-cranberry via-cranberry-dark to-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Book Brett?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Have questions or need something not listed here? We&apos;re happy to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/book-brett" variant="secondary" size="lg">
                  Request Booking
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Award, BookOpen, Brain, Building, Bot, Shield, GraduationCap, Users, Mic2, Sparkles } from "lucide-react";
import Image from "next/image";

const timeline = [
  {
    year: "1980s",
    title: "The Journey Begins",
    description: "Started martial arts training, beginning a lifelong pursuit of mastery and discipline that would shape everything to come.",
    icon: Award,
    gradient: "from-cranberry to-cranberry-dark",
    image: "/timeline/8th-dan.webp",
  },
  {
    year: "1990s",
    title: "Founds Personal Mastery Martial Arts",
    description: "Opened Personal Mastery Martial Arts & Family Success Center in Sandy, Utah — a living laboratory for testing peak performance principles.",
    icon: Building,
    gradient: "from-gold to-gold-dark",
    image: "/timeline/pmma-logo.webp",
  },
  {
    year: "2000s",
    title: "Author & Speaker Emerges",
    description: "Published first books on safety, time management, and personal empowerment. Began speaking at corporations and conferences nationwide.",
    icon: BookOpen,
    gradient: "from-cranberry to-cranberry-dark",
    image: "/timeline/anti-bully.webp",
  },
  {
    year: "2010s",
    title: "Flow State Research",
    description: "Completed formal research thesis on flow states and accelerated learning. Validated by the Flow Research Collective (Steven Kotler's organization).",
    icon: Brain,
    gradient: "from-gold to-gold-dark",
    image: "/timeline/thesis.webp",
  },
  {
    year: "2020s",
    title: "The Master's Edge is Born",
    description: "Synthesized 30+ years of experience into a proprietary coaching methodology. Began working with executives, business owners, and high performers.",
    icon: Sparkles,
    gradient: "from-cranberry to-cranberry-dark",
    image: "/timeline/masters-edge.webp",
  },
  {
    year: "Today",
    title: "Total Success AI & Beyond",
    description: "Co-founded Total Success AI to bring human-centered AI implementation to businesses. Continues coaching, speaking, and transforming lives.",
    icon: Bot,
    gradient: "from-gold to-gold-dark",
    image: "/timeline/tsai-logo.webp",
  },
];

const credentials = [
  {
    icon: Building,
    title: "30+ Years as a Business Owner",
    description:
      "Brett founded Personal Mastery Martial Arts & Family Success Center in Sandy, Utah and has run it for over three decades. It's been his laboratory — the place where every strategy was tested before it was ever taught.",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    icon: Award,
    title: "8th-Degree Black Belt, 40+ Years in Martial Arts",
    description:
      "More than a rank — it's a way of thinking. The same progressive mastery, discipline, and flow state awareness that creates black belts is the foundation of The Master's Edge.",
    gradient: "from-gold to-gold-dark",
  },
  {
    icon: Brain,
    title: "Flow State Researcher",
    description:
      "Brett completed a formal research thesis on utilizing flow states to enhance human learning. The research was reviewed and validated by the Flow Research Collective — Steven Kotler's peak performance organization.",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    icon: BookOpen,
    title: "Author of 7 Books (5 Bestsellers)",
    description:
      "From time management to family safety to personal empowerment, Brett's books reflect the breadth of his expertise. His seventh book — The Master's Edge — is forthcoming.",
    gradient: "from-gold to-gold-dark",
  },
  {
    icon: Bot,
    title: "Co-Founder of Total Success AI",
    description:
      "Brett brings the same Master's Edge methodology to AI adoption — helping businesses implement technology in a way that puts people first.",
    gradient: "from-cranberry to-cranberry-dark",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/about.jpg"
            alt="Martial arts training and discipline"
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
              <span className="text-cranberry-light font-semibold text-sm">About Brett</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              30 Years of Watching{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Impossible Transformations
              </span>{" "}
              Happen
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              Brett Lechtenberg has spent three decades helping people discover who
              they&apos;re meant to become — through martial arts, coaching, speaking,
              writing, and mentorship.
            </motion.p>
          </div>
        </section>

        {/* The Story - Gradient */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-8">
                How It <span className="text-cranberry">Started</span>
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="space-y-6 text-lg text-warm-gray">
                  <p>I still remember the moment everything changed.</p>
                  <p>
                    I was working with a shy, anxious kid who wouldn&apos;t make eye
                    contact. His parents were desperate. School was a struggle. Other
                    activities had failed. They&apos;d brought him to martial arts as a
                    last resort.
                  </p>
                  <p>
                    Three months later, that same kid walked into my office, looked me
                    straight in the eye, and said:{" "}
                    <em className="text-black font-semibold">
                      &ldquo;Thank you for believing in me when I didn&apos;t believe in
                      myself.&rdquo;
                    </em>
                  </p>
                  <p>
                    That&apos;s when I realized: the kicks and punches were never the
                    point. They were just the delivery system for something much bigger.
                    What I was really teaching was transformation. Self-belief. The
                    discovery of who someone was always capable of being.
                  </p>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl p-6 text-white">
                    <p className="font-semibold">
                      That was over 25 years ago. Since then, I&apos;ve watched thousands
                      of transformations like that one. And I&apos;ve learned something:
                      everyone has <span className="text-gold">extraordinary potential</span> inside them. Most people just
                      need someone to see it first.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline - The Journey (Light Mode) */}
        <section className="py-24 bg-gradient-to-b from-gold/5 via-white to-cranberry/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cranberry/15 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/15 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                The <span className="bg-gradient-to-r from-cranberry to-gold bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-warm-gray max-w-2xl mx-auto">
                Four decades of learning, teaching, and transformation — distilled into a methodology that works.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Center line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cranberry via-gold to-cranberry rounded-full hidden md:block" />

              <div className="space-y-12 md:space-y-0">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative md:mb-16">
                    {/* Timeline dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${item.gradient} border-4 border-white shadow-lg z-10 hidden md:block`}
                      style={{ top: "2rem" }}
                    />

                    {/* Content card - alternating sides */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 15,
                        delay: index * 0.1
                      }}
                      className={`relative md:w-[calc(50%-3rem)] ${
                        index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                      }`}
                    >
                      <div className="group relative">
                        {/* Glow effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />

                        <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                          {/* Background Image */}
                          {item.image && (
                            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                className="object-contain opacity-10 grayscale"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="relative z-10">
                            {/* Year badge */}
                            <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${item.gradient} rounded-full px-4 py-1 mb-4 shadow-md`}>
                              <span className="text-white font-bold text-sm">{item.year}</span>
                            </div>

                            <div className="flex items-start gap-4">
                              {/* Icon */}
                              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <item.icon className="w-6 h-6 text-white" />
                              </div>

                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                                <p className="text-warm-gray text-sm leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Arrow pointing to timeline (desktop) */}
                          <div
                            className={`absolute top-8 hidden md:block w-4 h-4 bg-white border-gray-100 transform rotate-45 ${
                              index % 2 === 0
                                ? "right-0 translate-x-1/2 border-t border-r"
                                : "left-0 -translate-x-1/2 border-b border-l"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Credentials - Dark */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-96 h-96 bg-gold/25 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              The Experience Behind the <span className="text-gold">Method</span>
            </motion.h2>
            <div className="space-y-6">
              {credentials.map((credential, index) => (
                <motion.div
                  key={credential.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${credential.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${credential.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <credential.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{credential.title}</h3>
                      <p className="text-gray-400">{credential.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional credentials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-gold" />
                Also
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-400">
                <li className="flex items-center gap-2"><span className="text-cranberry">•</span> 32nd-Degree Master Mason</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> 3x graduate of International Training Commission Executive Protection School</li>
                <li className="flex items-center gap-2"><span className="text-cranberry">•</span> BA in Business Operations, Western Washington University</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Featured on Good Things Utah, Channel 4, Channel 13</li>
                <li className="flex items-center gap-2"><span className="text-cranberry">•</span> Trusted by American Express, Delta Airlines, Citigroup</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Philosophy - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-8 text-center">
                What I <span className="text-cranberry">Believe</span>
              </h2>
              <div className="space-y-6 text-lg text-warm-gray bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <p>
                  In 30 years, I&apos;ve never met someone without extraordinary
                  potential. I&apos;ve only met people who haven&apos;t discovered it yet.
                </p>
                <p>
                  The best teachers don&apos;t create followers — they create leaders
                  who no longer need them. That&apos;s always been my goal. Not to
                  impress you with what I know, but to unlock what&apos;s already inside you.
                </p>
                <div className="bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl p-6 text-white">
                  <p className="font-semibold">
                    I don&apos;t teach theory. I teach what I&apos;ve tested. In my own
                    business, on my own mat, with my own team. If it hasn&apos;t worked
                    for me, I don&apos;t teach it to you.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Personal - Dark */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-10"
            >
              {/* Family Photo */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold via-cranberry to-gold rounded-full blur-lg opacity-40" />
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/20">
                  <Image
                    src="/heroes/family.webp"
                    alt="Brett Lechtenberg with family"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Beyond <span className="text-gold">Business</span>
                </h2>
                <p className="text-lg text-gray-400">
                  Brett lives in Sandy, Utah with his family. When he&apos;s not coaching,
                  training, or speaking, you&apos;ll find him at Personal Mastery Martial
                  Arts — still on the mat, still learning, still practicing what he teaches.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA - Bold gradient */}
        <section className="py-24 bg-gradient-to-br from-cranberry via-cranberry-dark to-black text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cranberry-light/30 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
                Let&apos;s Talk About What&apos;s Possible
              </h2>
              <Button href={links.booking} external size="lg" variant="secondary">
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

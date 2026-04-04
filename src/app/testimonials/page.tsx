"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote, Star, TrendingUp } from "lucide-react";

const marqueeTestimonials = [
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist, 3x Olympian",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    quote:
      "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of initiatives for eight U.S. Presidents",
    gradient: "from-gold to-gold-dark",
  },
  {
    quote:
      "In my military career, I had to perform in any condition, at any given time, without fail. If you want to learn that kind of mindset in business and building teams, then Brett Lechtenberg is definitely a person that I turn to.",
    name: "Green Beret",
    title: "Trauma Survival Specialist",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    quote:
      "Brett is one of my 300. Just like the Spartans of old had to pick 300 to face down their foes — no-nonsense, amazing people. Brett is someone I turn to when I need to pick my 300.",
    name: "8x World Karate Champion",
    title: "",
    gradient: "from-gold to-gold-dark",
  },
];

const businessResults = [
  {
    quote:
      "I added 43 percent to my best month of the year and I am on track to exceed that already this month. Brett has some truly remarkable business building strategies.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance",
    stat: "+43%",
    statLabel: "Revenue",
  },
  {
    quote:
      "He has helped me motivate my staff, implement more cash generation systems, and help build a culture of fun and positive growth.",
    name: "John Nottingham",
    title: "Sword and Shield Security",
  },
  {
    quote:
      "Brett has helped me more clearly understand marketing and branding — not only the implementation but the effect it has on my personal brand and the relationship I have with my community.",
    name: "Al Agon",
    title: "Perfect Balance Fitness",
  },
  {
    quote:
      "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
    name: "Matt Gibbons",
    title: "President, Murray Area Chamber of Commerce",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
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
              className="inline-flex items-center gap-2 mb-6"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-gold fill-gold" />
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              See What&apos;s{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Possible
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              Don&apos;t take Brett&apos;s word for it. Hear from the leaders, athletes,
              coaches, and business owners who&apos;ve experienced The Master&apos;s Edge firsthand.
            </motion.p>
          </div>
        </section>

        {/* Marquee Testimonials - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-black mb-12 text-center"
            >
              Featured <span className="text-cranberry">Testimonials</span>
            </motion.h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {marqueeTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100">
                    <div className={`absolute -top-5 left-8 w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                    <blockquote className="text-lg text-black leading-relaxed mb-6 pt-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                        {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-black">{testimonial.name}</p>
                        {testimonial.title && (
                          <p className="text-sm text-cranberry font-medium">{testimonial.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Results - Dark */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-96 h-96 bg-gold/25 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-5 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-gold font-semibold text-sm">Business Results</span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Results That Speak for <span className="text-gold">Themselves</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {businessResults.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold via-cranberry to-gold rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex gap-6">
                    {testimonial.stat && (
                      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-gold to-gold-dark rounded-xl p-6 text-black min-w-[100px]">
                        <span className="text-3xl font-black">{testimonial.stat}</span>
                        <span className="text-xs text-black/80">{testimonial.statLabel}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <blockquote className="text-gray-300 mb-4">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <cite className="text-white font-semibold">— {testimonial.name}</cite>
                      {testimonial.title && (
                        <p className="text-sm text-gold">{testimonial.title}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Ready to Write Your Own Transformation Story?
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

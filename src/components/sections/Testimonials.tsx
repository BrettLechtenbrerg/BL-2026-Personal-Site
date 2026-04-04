"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist, 3x Olympian",
  },
  {
    quote:
      "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of initiatives for eight U.S. Presidents",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
      <div className="absolute -top-20 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-cranberry/20 rounded-full blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-gold fill-gold" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            In Their{" "}
            <span className="bg-gradient-to-r from-cranberry to-gold bg-clip-text text-transparent">
              Words
            </span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: index * 0.15,
              }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

              <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100">
                {/* Quote icon */}
                <div className="absolute -top-5 left-8 w-12 h-12 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-2xl flex items-center justify-center shadow-lg shadow-cranberry/30">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Quote text */}
                <blockquote className="text-lg lg:text-xl text-black leading-relaxed mb-6 pt-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cranberry via-cranberry-dark to-gold flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-black">{testimonial.name}</p>
                    <p className="text-sm text-cranberry font-medium">{testimonial.title}</p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-b-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cranberry to-cranberry-dark text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-cranberry/30 transition-all hover:-translate-y-1"
          >
            See More Testimonials
            <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

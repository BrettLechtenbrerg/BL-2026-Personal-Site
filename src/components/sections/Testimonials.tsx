"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist, 3x Olympian",
    featured: true,
  },
  {
    quote:
      "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of initiatives for eight U.S. Presidents",
    featured: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-cranberry/5 via-white to-gold/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            In Their Words
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
              className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-100"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8 w-10 h-10 bg-cranberry rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Quote text */}
              <blockquote className="text-lg lg:text-xl text-black leading-relaxed mb-6 pt-4">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4">
                {/* Placeholder avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center text-white font-bold">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-bold text-black">{testimonial.name}</p>
                  <p className="text-sm text-warm-gray">{testimonial.title}</p>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cranberry via-gold to-cranberry rounded-b-2xl" />
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
            className="inline-flex items-center gap-2 text-cranberry font-semibold hover:text-cranberry-dark transition-colors"
          >
            See More Testimonials
            <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

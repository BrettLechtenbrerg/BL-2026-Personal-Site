"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote, Star, TrendingUp, Users, Award } from "lucide-react";

const featuredTestimonials = [
  {
    quote:
      "In my lifetime I have had the opportunity to meet extraordinary people from around the world and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Advisor to 8 U.S. Presidents",
    gradient: "from-gold to-gold-dark",
  },
  {
    quote:
      "Brett knows flow, peak performance and goals. I have been around a ton of business coaches and high level performers and Brett is a top tier trainer, teacher and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist & 3x Olympian",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    quote:
      "In my military career I had to perform in any conditions, at any given time, without fail. If you want to learn that kind of mindset in business and building teams then Brett Lechtenberg is definitely a person that I turn to help me with my goals and objectives.",
    name: "Sal Rossano",
    title: "Green Beret - Trauma Survival Specialist",
    gradient: "from-gold to-gold-dark",
  },
  {
    quote:
      "Brett is as good an instructor as I have been around. His training methods and information is always cutting edge. If you want to learn how to take your business to the next level with individual, or team training then Brett Lechtenberg is the person to get on your team.",
    name: "Matt Gibbons",
    title: "President, Murray Chamber of Commerce",
    gradient: "from-cranberry to-cranberry-dark",
  },
];

const businessResults = [
  {
    quote:
      "I have been blown away with the powerful mindset tools, branding systems and business building strategies Brett has shared with me. I added 43 percent to my best month of the year and I am on track to exceed that already this month. Brett has some truly remarkable business building strategies and peak performance systems.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance, Arlington, WA",
    stat: "+43%",
    statLabel: "Revenue",
  },
  {
    quote:
      "Brett has helped me more clearly understand marketing and branding. Not only the implementation but the effect it has on my personal brand and the relationship I have with my community. I could not recommend Brett and his team enough for their effectiveness and professionalism.",
    name: "Al Agon",
    title: "Perfect Balance Fitness, Miami, FL",
  },
  {
    quote:
      "Brett's books and training bring theory into practice. His trainings exist where the rubber meets the road. He not only teaches you the why, but he gives practical examples of how to implement the why. If you want to hit the next level, personally or as a business, Brett can help you get there.",
    name: "Ben Holt",
    title: "K2T3 PLLC, Sandy, UT",
  },
  {
    quote:
      "Brett is so experienced and knowledgeable with running a successful business. He is great at breaking down complex business systems into simple actions steps that are effective and give great results.",
    name: "Dorie Olds",
    title: "Beyond Creation Institute, Murray, UT",
  },
];

const moreTestimonials = [
  {
    quote:
      "Brett knows tons about business scaling, marketing, and how to improve the business! He has had success with his own businesses and can pass that along to you! He is always happy to help!",
    name: "Dwight Christie",
    title: "Dwight Christie Consulting, Midvale, UT",
    rating: 5,
  },
  {
    quote:
      "Brett will teach you from personal experience in running all of the businesses he has. How he can help you to market yours effectively. He is the go to person if you need help to grow your business.",
    name: "George Wilkinson",
    title: "LegalShield, Ada, OK",
    rating: 5,
  },
  {
    quote:
      "Master Brett Lechtenberg has a wealth of knowledge and experience in Mastery. He has worked hard to create a great system for helping his customers grow.",
    name: "Anthony Miles",
    title: "4th Wall Productions, Gilbert, AZ",
    rating: 5,
  },
  {
    quote:
      "Brett is an all around great and amazing individual. He truly cares about others, it's an honor and privilege to know him.",
    name: "Al Richards",
    title: "Triple A Concrete, West Jordan, UT",
    rating: 5,
  },
  {
    quote:
      "Brett came in and taught us some basic but in depth self defense moves and it was really useful! They were things that anyone of any size can use. I know that I will be going to him again to learn more!",
    name: "Alexus A.",
    title: "Thumbtack Review",
    rating: 5,
  },
  {
    quote:
      "Brett is very knowledgeable on self defense and taught us a lot of valuable tips and tricks for defending yourself in difficult situations. He is very approachable and wants people to be able to come to his classes so they can defend themselves.",
    name: "Brendan W.",
    title: "Thumbtack Review",
    rating: 5,
  },
  {
    quote:
      "If you want to know how to protect yourself and to make sure you go back to your family safely, he's the guy to go to! Amazing! As an EMT myself these basic skills that I was taught will help me in my career as well as in my professional life!",
    name: "Amanda W.",
    title: "Thumbtack Review",
    rating: 5,
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

        {/* Featured Testimonials - Gradient */}
        <section className="py-24 bg-gradient-to-b from-gold/10 via-white to-cranberry/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-cranberry/10 border border-cranberry/20 rounded-full px-5 py-2 mb-6">
                <Award className="w-4 h-4 text-cranberry" />
                <span className="text-cranberry font-semibold text-sm">High-Profile Endorsements</span>
              </div>
              <h2 className="text-3xl font-bold text-black">
                Featured <span className="text-cranberry">Testimonials</span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group h-full"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-100 h-full flex flex-col">
                    <div className={`absolute -top-5 left-8 w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                    <blockquote className="text-lg text-black leading-relaxed mb-6 pt-4 flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
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
                  className="group relative h-full"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold via-cranberry to-gold rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex gap-6 h-full">
                    {testimonial.stat && (
                      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-gold to-gold-dark rounded-xl p-6 text-black min-w-[100px] shrink-0">
                        <span className="text-3xl font-black">{testimonial.stat}</span>
                        <span className="text-xs text-black/80">{testimonial.statLabel}</span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <blockquote className="text-gray-300 mb-4 flex-1">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <div className="mt-auto">
                        <cite className="text-white font-semibold not-italic">— {testimonial.name}</cite>
                        {testimonial.title && (
                          <p className="text-sm text-gold">{testimonial.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* More Reviews - Light Gradient */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/10 relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cranberry/10 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 mb-6 shadow-sm">
                <Users className="w-4 h-4 text-cranberry" />
                <span className="text-black font-semibold text-sm">5-Star Reviews</span>
              </div>
              <h2 className="text-3xl font-bold text-black">
                More <span className="text-cranberry">Success Stories</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative h-full"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cranberry/50 to-gold/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-black text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.title}</p>
                      </div>
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

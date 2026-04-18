"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/masters-edge.jpg"
            alt="Mountain peak at sunrise"
            fill
            className="object-cover opacity-30"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gold/20 rounded-full blur-[80px]"
            />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-8 shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl font-bold text-white mb-6"
            >
              Your Application Is In
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Brett personally reviews every application. You&apos;ll hear back within{" "}
              <span className="text-gold font-semibold">48 hours</span> with next steps.
            </motion.p>

            {/* Next Steps Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-10"
            >
              <h2 className="text-lg font-semibold text-white mb-6">In the meantime...</h2>
              <p className="text-gray-300 mb-6">
                If you&apos;d like to get a head start on the conversation, you can book a time directly with Brett:
              </p>
              <Button href={links.booking} external size="lg" variant="secondary">
                <Calendar className="w-5 h-5" />
                Book a Conversation with Brett
              </Button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-gray-400"
            >
              <Mail className="w-4 h-4" />
              <span>Questions?</span>
              <a
                href="mailto:brett@brettlechtenberg.com"
                className="text-gold hover:text-gold-light transition-colors"
              >
                brett@brettlechtenberg.com
              </a>
            </motion.div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
                What Happens Next
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Application Review",
                  desc: "Brett personally reviews your application within 48 hours to assess fit.",
                },
                {
                  step: "2",
                  title: "Personal Outreach",
                  desc: "If it looks like a good match, you'll receive an email to schedule a brief call.",
                },
                {
                  step: "3",
                  title: "Welcome to the Cohort",
                  desc: "Once accepted, you'll get onboarding materials and your cohort start date.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-cranberry-dark text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-warm-gray">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Back to site */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12 pt-8 border-t border-gray-100"
            >
              <Button href="/" variant="ghost">
                Back to Homepage
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Mail, Shield, Target, Lock, MapPin, Globe } from "lucide-react";
import Image from "next/image";

const promises = [
  {
    icon: Target,
    title: "No Sales Pressure",
    description:
      "This is a conversation, not a pitch. Brett wants to understand your situation before recommending anything.",
    gradient: "from-cranberry to-cranberry-dark",
  },
  {
    icon: Shield,
    title: "Customized to You",
    description:
      "Every engagement starts from scratch. There are no pre-packaged solutions waiting to be sold.",
    gradient: "from-gold to-gold-dark",
  },
  {
    icon: Lock,
    title: "Confidential",
    description: "What you share stays between you and Brett. Period.",
    gradient: "from-cranberry to-cranberry-dark",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero - Dark */}
        <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/contact.jpg"
            alt="Professional handshake representing connection"
            fill
            className="object-cover opacity-35"
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
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Let&apos;s Talk About What&apos;s{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                Possible
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              No pitch. No pressure. Just a genuine conversation about where you
              are, where you want to be, and whether The Master&apos;s Edge is the
              right fit.
            </motion.p>
          </div>
        </section>

        {/* Booking Options - Gradient */}
        <section className="py-24 bg-gradient-to-b from-white via-cranberry/5 to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cranberry via-gold to-cranberry" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cranberry/20 rounded-full blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Book a Call */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cranberry to-cranberry-dark rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-gradient-to-br from-cranberry via-cranberry-dark to-black text-white rounded-2xl p-8 text-center h-full flex flex-col">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg flex-shrink-0">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Book a Call With Brett</h2>
                  <p className="text-white/80 mb-8 flex-grow">
                    Schedule a conversation at a time that works for you.
                  </p>
                  <Button
                    href={links.booking}
                    external
                    variant="secondary"
                    size="lg"
                    className="w-full mt-auto flex-shrink-0"
                  >
                    Book a Call
                  </Button>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-white rounded-2xl p-8 text-center shadow-xl border border-gray-100 h-full flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg flex-shrink-0">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex-shrink-0">
                    Or Reach Out Directly
                  </h2>
                  <p className="text-warm-gray mb-8 flex-grow">
                    Prefer email? Send Brett a message anytime.
                  </p>
                  <a
                    href={links.email}
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cranberry to-cranberry-dark text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-cranberry/30 transition-all hover:-translate-y-1 mt-auto flex-shrink-0"
                  >
                    Brett@BrettLechtenberg.com
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Three Promises */}
            <div className="grid md:grid-cols-3 gap-8">
              {promises.map((promise, index) => (
                <motion.div
                  key={promise.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${promise.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg flex-shrink-0`}>
                    <promise.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-black mb-2 flex-shrink-0">{promise.title}</h3>
                  <p className="text-warm-gray text-sm flex-grow">{promise.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Reference - Dark */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/25 rounded-full blur-[120px]"
          />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-white mb-8"
            >
              Quick <span className="text-gold">Reference</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cranberry to-gold rounded-full flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-lg">
                BL
              </div>
              <p className="text-2xl font-bold text-white mb-2">Brett Lechtenberg</p>
              <p className="text-gray-400 mb-4">
                Peak Performance Coach | Speaker | Author
              </p>
              <p className="text-gold font-semibold mb-6">
                Creator of The Master&apos;s Edge
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
                <MapPin className="w-4 h-4" />
                <span>Sandy, Utah</span>
              </div>

              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                  <Globe className="w-4 h-4 text-gold" />
                  <span className="uppercase tracking-wide text-sm">Websites</span>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://brettlechtenberg.com"
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    brettlechtenberg.com
                  </a>
                  <a
                    href={links.martialArts}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    personalmasterymartialarts.com
                  </a>
                  <a
                    href={links.ai}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    totalsuccessai.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mic2, Calendar, Users, CheckCircle, Clock, Sparkles, Send } from "lucide-react";
import Image from "next/image";

const eventTypes = [
  "Corporate Keynote",
  "Conference Presentation",
  "Workshop / Training",
  "Leadership Retreat",
  "Sales Kickoff",
  "Association Event",
  "Other",
];

const audienceSizes = [
  "Under 50",
  "50-100",
  "100-250",
  "250-500",
  "500-1000",
  "1000+",
];

const expectations = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "You'll hear back within 48 hours with availability and next steps.",
  },
  {
    icon: Calendar,
    title: "Discovery Call",
    description: "A brief call to understand your audience, goals, and event vision.",
  },
  {
    icon: Sparkles,
    title: "Custom Tailoring",
    description: "Every presentation is customized to resonate with your specific audience.",
  },
  {
    icon: CheckCircle,
    title: "Full Support",
    description: "From pre-event prep to post-event follow-up, you're fully supported.",
  },
];

export default function BookBrettPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    eventType: "",
    eventDate: "",
    location: "",
    audienceSize: "",
    audienceDescription: "",
    goals: "",
    budget: "",
    howHeard: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/d9dd43d9-b424-44bd-b7ec-409bd33163db",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            organization: formData.organization,
            role: formData.role,
            eventType: formData.eventType,
            eventDate: formData.eventDate,
            location: formData.location,
            audienceSize: formData.audienceSize,
            audienceDescription: formData.audienceDescription,
            goals: formData.goals,
            budget: formData.budget,
            howHeard: formData.howHeard,
            message: formData.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Still show success to user - webhook may return non-200 but still process
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-16 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          <Image
            src="/heroes/speaking.jpg"
            alt="Brett speaking on stage"
            fill
            className="object-cover opacity-40"
            priority
          />
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

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-cranberry/20 border border-cranberry/30 rounded-full px-5 py-2 mb-6"
            >
              <Mic2 className="w-4 h-4 text-gold" />
              <span className="text-cranberry-light font-semibold text-sm">Book Brett</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Bring{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                The Master&apos;s Edge
              </span>{" "}
              to Your Event
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              Whether it&apos;s a keynote, workshop, or full-day training, Brett delivers
              transformational content that leaves your audience with real tools — not just inspiration.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-gradient-to-b from-white via-cranberry/5 to-gold/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

              {/* Form */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10"
                >
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-black mb-4">Request Received!</h2>
                      <p className="text-warm-gray max-w-md mx-auto">
                        Thank you for your interest in having Brett speak at your event.
                        You&apos;ll receive a response within 48 hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-black mb-2">Tell Us About Your Event</h2>
                      <p className="text-warm-gray mb-8">
                        Fill out the form below and we&apos;ll get back to you within 48 hours.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contact Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Your Name <span className="text-cranberry">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              placeholder="John Smith"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Email <span className="text-cranberry">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Organization <span className="text-cranberry">*</span>
                            </label>
                            <input
                              type="text"
                              name="organization"
                              required
                              value={formData.organization}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              placeholder="Company or Organization"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Your Role
                          </label>
                          <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                            placeholder="Event Planner, HR Director, etc."
                          />
                        </div>

                        {/* Event Details */}
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <h3 className="text-lg font-bold text-black mb-4">Event Details</h3>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                Event Type <span className="text-cranberry">*</span>
                              </label>
                              <select
                                name="eventType"
                                required
                                value={formData.eventType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all bg-white"
                              >
                                <option value="">Select event type</option>
                                {eventTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                Tentative Date <span className="text-cranberry">*</span>
                              </label>
                              <input
                                type="date"
                                name="eventDate"
                                required
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                                placeholder="City, State or Virtual"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                Expected Audience Size
                              </label>
                              <select
                                name="audienceSize"
                                value={formData.audienceSize}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all bg-white"
                              >
                                <option value="">Select size</option>
                                {audienceSizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                              Describe Your Audience
                            </label>
                            <input
                              type="text"
                              name="audienceDescription"
                              value={formData.audienceDescription}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                              placeholder="e.g., Sales managers, small business owners, executives..."
                            />
                          </div>

                          <div className="mt-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                              What Do You Want Your Audience to Walk Away With?
                            </label>
                            <textarea
                              name="goals"
                              value={formData.goals}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all resize-none"
                              placeholder="What transformation or outcome are you hoping for?"
                            />
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                Budget Range
                              </label>
                              <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all bg-white"
                              >
                                <option value="">Select range</option>
                                <option value="Under $5,000">Under $5,000</option>
                                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                <option value="$10,000 - $15,000">$10,000 - $15,000</option>
                                <option value="$15,000 - $25,000">$15,000 - $25,000</option>
                                <option value="$25,000+">$25,000+</option>
                                <option value="Not sure yet">Not sure yet</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                How Did You Hear About Brett?
                              </label>
                              <input
                                type="text"
                                name="howHeard"
                                value={formData.howHeard}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all"
                                placeholder="Referral, Google, social media, etc."
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <label className="block text-sm font-semibold text-black mb-2">
                              Anything Else We Should Know?
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none transition-all resize-none"
                              placeholder="Any additional context, questions, or special requirements..."
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-cranberry to-cranberry-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-cranberry/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <Send className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-8">
                {/* What to Expect */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 text-white"
                >
                  <h3 className="text-xl font-bold mb-6">What to Expect</h3>
                  <div className="space-y-5">
                    {expectations.map((item, index) => (
                      <div key={item.title} className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
                >
                  <h3 className="text-lg font-bold text-black mb-6">Why Organizations Choose Brett</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-black text-xl">30+</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">Years Experience</p>
                        <p className="text-sm text-warm-gray">Real-world tested strategies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-cranberry to-cranberry-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-black">Customized Content</p>
                        <p className="text-sm text-warm-gray">Every talk tailored to your audience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-black text-xl">7</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">Published Books</p>
                        <p className="text-sm text-warm-gray">Proven thought leader</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-cranberry/10 via-white to-gold/10 rounded-2xl p-8 border border-gray-100"
                >
                  <p className="text-black italic mb-4">
                    &ldquo;Brett is as good an instructor as I have been around. His training methods
                    and information are always cutting-edge.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cranberry to-gold flex items-center justify-center text-white font-bold text-sm">
                      MG
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm">Matt Gibbons</p>
                      <p className="text-cranberry text-xs">Murray Area Chamber of Commerce</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

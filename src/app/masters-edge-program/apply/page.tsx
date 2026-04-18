"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Revenue range options
const revenueRanges = [
  "Under $100K",
  "$100K - $250K",
  "$250K - $500K",
  "$500K - $1M",
  "$1M+",
];

// How did you hear about us options
const referralSources = [
  "Website",
  "LinkedIn",
  "Referral",
  "Speaking Event",
  "Podcast",
  "Other",
];

// Investment options
const investmentOptions = [
  { value: "founding", label: "Founding Member ($997/mo × 3)" },
  { value: "pay-in-full", label: "Pay in Full ($2,691)" },
  { value: "not-sure", label: "Not sure yet" },
];

export default function ApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    revenueRange: "",
    referralSource: "",
    challenge: "",
    successOutcome: "",
    investmentOption: "",
    additionalInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Determine tags based on investment option
      const tags = ["ME Prospect"];
      if (formData.investmentOption === "founding") {
        tags.push("ME - Founding Member Interest");
      } else if (formData.investmentOption === "pay-in-full") {
        tags.push("ME - Pay in Full Interest");
      } else if (formData.investmentOption === "not-sure") {
        tags.push("ME - Wants Call");
      }

      // Split full name into first and last
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/6b344d66-7b41-4533-a8e1-e747a3da3143",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.company,
            jobTitle: formData.role,
            customField: {
              revenue_range: formData.revenueRange,
              referral_source: formData.referralSource,
              main_challenge: formData.challenge,
              success_outcome: formData.successOutcome,
              investment_preference: formData.investmentOption,
              additional_info: formData.additionalInfo,
            },
            tags,
            source: "Master's Edge Program Application",
          }),
        }
      );

      if (response.ok) {
        // Redirect to thank you page
        router.push("/masters-edge-program/thank-you");
      } else {
        setError("Something went wrong. Please try again or email brett@brettlechtenberg.com directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or email brett@brettlechtenberg.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/heroes/masters-edge.jpg"
            alt="Mountain peak at sunrise"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[400px] h-[400px] bg-cranberry/30 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/20 rounded-full blur-[80px]"
            />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-5 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold font-semibold text-sm">Founding Cohort Application</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Apply to{" "}
              <span className="bg-gradient-to-r from-cranberry via-cranberry-light to-gold bg-clip-text text-transparent">
                The Master&apos;s Edge Program
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto"
            >
              Tell us about yourself and your goals. Brett personally reviews every application.
            </motion.p>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10"
            >
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-black mb-2">
                    Full Name <span className="text-cranberry">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                    placeholder="John Smith"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                      Email <span className="text-cranberry">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Company & Role */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-black mb-2">
                      Company / Business Name <span className="text-cranberry">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-black mb-2">
                      Your Role / Title <span className="text-cranberry">*</span>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                      placeholder="CEO, Founder, VP Sales, etc."
                    />
                  </div>
                </div>

                {/* Revenue Range */}
                <div>
                  <label htmlFor="revenueRange" className="block text-sm font-semibold text-black mb-2">
                    Annual Revenue Range <span className="text-cranberry">*</span>
                  </label>
                  <select
                    id="revenueRange"
                    name="revenueRange"
                    value={formData.revenueRange}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black bg-white"
                  >
                    <option value="">Select a range</option>
                    {revenueRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Referral Source */}
                <div>
                  <label htmlFor="referralSource" className="block text-sm font-semibold text-black mb-2">
                    How did you hear about The Master&apos;s Edge? <span className="text-cranberry">*</span>
                  </label>
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black bg-white"
                  >
                    <option value="">Select an option</option>
                    {referralSources.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                {/* Main Challenge */}
                <div>
                  <label htmlFor="challenge" className="block text-sm font-semibold text-black mb-2">
                    What&apos;s the #1 challenge you&apos;re facing right now? <span className="text-cranberry">*</span>
                  </label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black resize-none"
                    placeholder="Be specific. The more detail, the better Brett can assess fit."
                  />
                </div>

                {/* Success Outcome */}
                <div>
                  <label htmlFor="successOutcome" className="block text-sm font-semibold text-black mb-2">
                    What would a successful outcome look like after 12 weeks? <span className="text-cranberry">*</span>
                  </label>
                  <textarea
                    id="successOutcome"
                    name="successOutcome"
                    value={formData.successOutcome}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black resize-none"
                    placeholder="Describe your ideal transformation."
                  />
                </div>

                {/* Investment Option */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Which investment option are you considering? <span className="text-cranberry">*</span>
                  </label>
                  <div className="space-y-3">
                    {investmentOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.investmentOption === option.value
                            ? "border-cranberry bg-cranberry/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="investmentOption"
                          value={option.value}
                          checked={formData.investmentOption === option.value}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 text-cranberry focus:ring-cranberry"
                        />
                        <span className="text-black">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-semibold text-black mb-2">
                    Anything else Brett should know?
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black resize-none"
                    placeholder="Optional"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cranberry to-cranberry-dark text-white py-4 rounded-lg font-semibold hover:from-cranberry-dark hover:to-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-cranberry/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Brett personally reviews every application. You&apos;ll hear back within 48 hours.
                </p>
              </div>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

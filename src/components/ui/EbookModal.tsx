"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EbookModal({ isOpen, onClose }: EbookModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
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
            email,
            tags: ["rockstar ebook"],
          }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Header with book image */}
              <div className="bg-gradient-to-br from-cranberry via-cranberry-dark to-black p-8 text-center">
                <div className="relative w-32 h-40 mx-auto mb-4">
                  <Image
                    src="/books/rockstar-team.png"
                    alt="How to Build a Rockstar Team"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Get Your Free Copy
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  How to Build a Rockstar Team
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {isSuccess ? (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      Check Your Email!
                    </h3>
                    <p className="text-warm-gray">
                      Your free eBook is on its way to your inbox.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 px-6 py-2 bg-cranberry text-white rounded-lg font-semibold hover:bg-cranberry-dark transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-warm-gray text-sm text-center mb-4">
                      Enter your details below and we&apos;ll send the eBook straight to your inbox.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-black mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-black mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cranberry focus:border-transparent outline-none transition-all text-black"
                        placeholder="john@example.com"
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cranberry to-cranberry-dark text-white py-4 rounded-lg font-semibold hover:from-cranberry-dark hover:to-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          Send Me the Free eBook
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

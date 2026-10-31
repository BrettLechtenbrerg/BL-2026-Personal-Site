"use client";

// APPLY (The Master's Edge Program), "Horizon" design (Group 4, 31 Oct 2026). Words unchanged (tag pre-horizon-inner-2026-10-30).
// The application is unchanged in behaviour: same fields, names, required marks, options, webhook, tags and redirect.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { HorizonPage, PageHero } from "@/components/horizon/kit";

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
      const tags = ["me-lead"];
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

      // Build investment option label for readability
      const investmentLabel =
        formData.investmentOption === "founding" ? "Founding Member ($997/mo × 3)" :
        formData.investmentOption === "pay-in-full" ? "Pay in Full ($2,691)" :
        "Not sure yet";

      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/035c7c0c-d9c7-47d5-ae85-4d0e6855d23e",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Contact info
            firstName,
            lastName,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,

            // Business info
            company_name: formData.company,
            job_title: formData.role,
            revenue_range: formData.revenueRange,

            // Application details
            referral_source: formData.referralSource,
            main_challenge: formData.challenge,
            success_outcome: formData.successOutcome,
            investment_preference: investmentLabel,
            additional_info: formData.additionalInfo || "None provided",

            // Tags for the workflow to apply
            tags: tags.join(", "),

            // Metadata
            source: "Master's Edge Program Application",
            submitted_at: new Date().toISOString(),
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
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="apply-title"
            eyebrow={<><Sparkles className="eyebrow-ico" aria-hidden="true" />Founding Cohort Application</>}
            lines={["Apply to", <em key="p">The Master&apos;s Edge Program</em>]}
            lede="Tell us about yourself and your goals. Brett personally reviews every application."
            photo={{ src: "/heroes/masters-edge.jpg", alt: "Mountain peak at sunrise", w: 1920, h: 1280, pos: "60% 40%" }}
          />

          <section className="sec sec-paper" aria-label="Application form">
            <div className="rail">
              <form onSubmit={handleSubmit} className="paper-card form-card is-calm apply-form" data-rise>
                <div className="form-stack">
                  {/* Full Name */}
                  <div className="fld">
                    <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                    <input className="inp" type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required autoComplete="name" placeholder="John Smith" />
                  </div>

                  {/* Email & Phone */}
                  <div className="form-grid cols-2">
                    <div className="fld">
                      <label htmlFor="email">Email <span className="req">*</span></label>
                      <input className="inp" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder="john@company.com" />
                    </div>
                    <div className="fld">
                      <label htmlFor="phone">Phone</label>
                      <input className="inp" type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" placeholder="(555) 123-4567" />
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="form-grid cols-2">
                    <div className="fld">
                      <label htmlFor="company">Company / Business Name <span className="req">*</span></label>
                      <input className="inp" type="text" id="company" name="company" value={formData.company} onChange={handleChange} required autoComplete="organization" placeholder="Acme Inc." />
                    </div>
                    <div className="fld">
                      <label htmlFor="role">Your Role / Title <span className="req">*</span></label>
                      <input className="inp" type="text" id="role" name="role" value={formData.role} onChange={handleChange} required autoComplete="organization-title" placeholder="CEO, Founder, Vice President of Sales, etc." />
                    </div>
                  </div>

                  {/* Revenue Range */}
                  <div className="fld">
                    <label htmlFor="revenueRange">Annual Revenue Range <span className="req">*</span></label>
                    <select className="inp" id="revenueRange" name="revenueRange" value={formData.revenueRange} onChange={handleChange} required>
                      <option value="">Select a range</option>
                      {revenueRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  {/* Referral Source */}
                  <div className="fld">
                    <label htmlFor="referralSource">How did you hear about The Master&apos;s Edge? <span className="req">*</span></label>
                    <select className="inp" id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange} required>
                      <option value="">Select an option</option>
                      {referralSources.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  {/* Main Challenge */}
                  <div className="fld">
                    <label htmlFor="challenge">What&apos;s the #1 challenge you&apos;re facing right now? <span className="req">*</span></label>
                    <textarea className="inp" id="challenge" name="challenge" value={formData.challenge} onChange={handleChange} required rows={3} placeholder="Be specific. The more detail, the better Brett can assess fit." />
                  </div>

                  {/* Success Outcome */}
                  <div className="fld">
                    <label htmlFor="successOutcome">What would a successful outcome look like after 12 weeks? <span className="req">*</span></label>
                    <textarea className="inp" id="successOutcome" name="successOutcome" value={formData.successOutcome} onChange={handleChange} required rows={3} placeholder="Describe your ideal transformation." />
                  </div>

                  {/* Investment Option */}
                  <fieldset className="fld">
                    <legend className="fld-k">Which investment option are you considering? <span className="req">*</span></legend>
                    <div className="opts">
                      {investmentOptions.map((option) => (
                        <label key={option.value} className="opt">
                          <input type="radio" name="investmentOption" value={option.value} checked={formData.investmentOption === option.value} onChange={handleChange} required />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Additional Info */}
                  <div className="fld">
                    <label htmlFor="additionalInfo">Anything else Brett should know?</label>
                    <textarea className="inp" id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={3} placeholder="Optional" />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="form-error" role="alert">
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" disabled={isSubmitting} className="btn btn-cran btn-lg form-submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="spin" aria-hidden="true" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="ico" aria-hidden="true" />
                        Submit Application
                      </>
                    )}
                  </button>

                  <p className="form-note">Brett personally reviews every application. You&apos;ll hear back within 48 hours.</p>
                </div>
              </form>
            </div>
          </section>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

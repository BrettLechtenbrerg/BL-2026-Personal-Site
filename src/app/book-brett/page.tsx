"use client";

// BOOK BRETT, "Horizon" design (Group 4, 31 Oct 2026). Words unchanged (tag pre-horizon-inner-2026-10-30).
// The form is unchanged in behaviour: same fields, names, required marks, options and webhook. Only the look changed
// (and each label is now tied to its field, so tapping a label focuses the field and screen readers read it).
import { useState } from "react";
import { Calendar, CheckCircle, Clock, Mic2, Play, Send, Sparkles, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { HorizonPage, PageHero } from "@/components/horizon/kit";
import { LiveClip } from "@/components/ui/LiveClip";
import { useBotProtection } from "@/lib/useBotProtection";

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
  const [error, setError] = useState("");
  const { honeypotProps, withBotFields } = useBotProtection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Through our own server (bot gate + spam filter), which forwards to GoHighLevel.
      const response = await fetch("/api/ghl-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          withBotFields({
            form: "book-brett",
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
          })
        ),
      });

      // The spam filter's refusal must be seen, or a real request wrongly caught is lost.
      if (response.status === 422) {
        setError("We could not send this form. Please email brett@brettlechtenberg.com.");
        return;
      }
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
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="book-title"
            eyebrow={<><Mic2 className="eyebrow-ico" aria-hidden="true" />Book Brett</>}
            lines={[<>Bring <em>The Master&apos;s Edge</em></>, "to Your Event"]}
            lede="Keynote, workshop, or full-day training, your audience leaves with real tools they can use on Monday, not a pep talk that fades by Friday."
            photo={{ src: "/heroes/book-brett-phoenix.jpg", alt: "Brett Lechtenberg speaking at USA Martial Arts in Phoenix", w: 1920, h: 1080, pos: "50% 20%", shift: "18%" }}
            video="/videos/book-brett-hero-phoenix.mp4"
            side="right"
          />

          <section className="sec sec-paper" aria-label="Booking request">
            <div className="rail book-layout">
              {/* Form */}
              <div className="paper-card form-card is-calm" data-rise>
                {isSubmitted ? (
                  <div className="form-done" role="status">
                    <span className="done-ico" aria-hidden="true"><CheckCircle /></span>
                    <h2>Request Received</h2>
                    <p>
                      Thank you for your interest in having Brett speak at your event.
                      You&apos;ll receive a response within 48 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2>Tell Us About Your Event</h2>
                    <p className="form-intro">Fill out the form below and we&apos;ll get back to you within 48 hours.</p>

                    <form onSubmit={handleSubmit} className="form-stack">
                      <input {...honeypotProps} />
                      {/* Contact Info */}
                      <div className="form-grid cols-2">
                        <div className="fld">
                          <label htmlFor="bb-name">Your Name <span className="req">*</span></label>
                          <input id="bb-name" className="inp" type="text" name="name" required autoComplete="name" value={formData.name} onChange={handleChange} placeholder="John Smith" />
                        </div>
                        <div className="fld">
                          <label htmlFor="bb-email">Email <span className="req">*</span></label>
                          <input id="bb-email" className="inp" type="email" name="email" required autoComplete="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" />
                        </div>
                      </div>

                      <div className="form-grid cols-2">
                        <div className="fld">
                          <label htmlFor="bb-phone">Phone Number</label>
                          <input id="bb-phone" className="inp" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" />
                        </div>
                        <div className="fld">
                          <label htmlFor="bb-org">Organization <span className="req">*</span></label>
                          <input id="bb-org" className="inp" type="text" name="organization" required autoComplete="organization" value={formData.organization} onChange={handleChange} placeholder="Company or Organization" />
                        </div>
                      </div>

                      <div className="fld">
                        <label htmlFor="bb-role">Your Role</label>
                        <input id="bb-role" className="inp" type="text" name="role" autoComplete="organization-title" value={formData.role} onChange={handleChange} placeholder="Event Planner, People Director, etc." />
                      </div>

                      {/* Event Details */}
                      <div className="form-part">
                        <h3>Event Details</h3>

                        <div className="form-grid cols-2">
                          <div className="fld">
                            <label htmlFor="bb-type">Event Type <span className="req">*</span></label>
                            <select id="bb-type" className="inp" name="eventType" required value={formData.eventType} onChange={handleChange}>
                              <option value="">Select event type</option>
                              {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="fld">
                            <label htmlFor="bb-date">Tentative Date <span className="req">*</span></label>
                            <input id="bb-date" className="inp" type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange} />
                          </div>
                        </div>

                        <div className="form-grid cols-2">
                          <div className="fld">
                            <label htmlFor="bb-location">Location</label>
                            <input id="bb-location" className="inp" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, State or Virtual" />
                          </div>
                          <div className="fld">
                            <label htmlFor="bb-size">Expected Audience Size</label>
                            <select id="bb-size" className="inp" name="audienceSize" value={formData.audienceSize} onChange={handleChange}>
                              <option value="">Select size</option>
                              {audienceSizes.map(size => (
                                <option key={size} value={size}>{size.replace("-", " to ")}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="fld">
                          <label htmlFor="bb-audience">Describe Your Audience</label>
                          <input id="bb-audience" className="inp" type="text" name="audienceDescription" value={formData.audienceDescription} onChange={handleChange} placeholder="e.g., Sales managers, small business owners, executives..." />
                        </div>

                        <div className="fld">
                          <label htmlFor="bb-goals">What Do You Want Your Audience to Walk Away With?</label>
                          <textarea id="bb-goals" className="inp" name="goals" value={formData.goals} onChange={handleChange} rows={3} placeholder="What transformation or outcome are you hoping for?" />
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="form-part">
                        <div className="form-grid cols-2">
                          <div className="fld">
                            <label htmlFor="bb-budget">Budget Range</label>
                            <select id="bb-budget" className="inp" name="budget" value={formData.budget} onChange={handleChange}>
                              <option value="">Select range</option>
                              <option value="Under $5,000">Under $5,000</option>
                              <option value="$5,000 - $10,000">$5,000 to $10,000</option>
                              <option value="$10,000 - $15,000">$10,000 to $15,000</option>
                              <option value="$15,000 - $25,000">$15,000 to $25,000</option>
                              <option value="$25,000+">$25,000+</option>
                              <option value="Not sure yet">Not sure yet</option>
                            </select>
                          </div>
                          <div className="fld">
                            <label htmlFor="bb-heard">How Did You Hear About Brett?</label>
                            <input id="bb-heard" className="inp" type="text" name="howHeard" value={formData.howHeard} onChange={handleChange} placeholder="Referral, Google, social media, etc." />
                          </div>
                        </div>

                        <div className="fld">
                          <label htmlFor="bb-message">Anything Else We Should Know?</label>
                          <textarea id="bb-message" className="inp" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Any additional context, questions, or special requirements..." />
                        </div>
                      </div>

                      {error && (
                        <div className="form-error" role="alert">
                          <p>{error}</p>
                        </div>
                      )}

                      <button type="submit" disabled={isSubmitting} className="btn btn-cran btn-lg form-submit">
                        {isSubmitting ? (
                          <>
                            <span className="spin-ring" aria-hidden="true" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Request
                            <Send className="ico" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="side" data-stagger>
                {/* What to Expect */}
                <div className="dark-card">
                  <h3>What to Expect</h3>
                  <ul className="expect">
                    {expectations.map((item) => (
                      <li key={item.title}>
                        <span className="ico-badge" aria-hidden="true"><item.icon /></span>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* See Brett in Action: 2026 sizzle reel */}
                <div className="dark-card">
                  <div className="dc-head">
                    <Play aria-hidden="true" />
                    <h3 className="dc-title">See Brett in Action</h3>
                  </div>
                  <p className="dc-sub">The official 3:27 sizzle reel: keynotes, trainings, and live audiences.</p>
                  <LiveClip
                    src="/videos/sizzle-reel-2026.mp4"
                    poster="/videos/sizzle-reel-poster.jpg"
                    label="Brett Lechtenberg 2026 speaker sizzle reel"
                    aspect="wide"
                    caption="▶ Watch with sound"
                  />
                </div>

                {/* Quick Stats */}
                <div className="paper-card why-card">
                  <h3>Why Organizations Choose Brett</h3>
                  <ul className="why-list">
                    <li>
                      <span className="why-num">30+</span>
                      <div><b>Years Experience</b><span>Real-world tested strategies</span></div>
                    </li>
                    <li>
                      <span className="why-num is-cran" aria-hidden="true"><Users /></span>
                      <div><b>Customized Content</b><span>Every talk tailored to your audience</span></div>
                    </li>
                    <li>
                      <span className="why-num">8</span>
                      <div><b>Published Books</b><span>Proven thought leader</span></div>
                    </li>
                  </ul>
                </div>

                {/* Testimonial */}
                <figure className="paper-card side-quote">
                  <blockquote>
                    &ldquo;Brett is as good an instructor as I have been around. His training methods
                    and information are always cutting-edge.&rdquo;
                  </blockquote>
                  <figcaption className="qcard-by">
                    <span className="initials">MG</span>
                    <span>
                      <span className="q-name">Matt Gibbons</span>
                      <span className="q-title">Murray Area Chamber of Commerce</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { Sparkles, Target, Lightbulb, Zap, Users, Smile } from "lucide-react";

export const metadata = {
  title: "Speaking & Training | Brett Lechtenberg",
  description:
    "Keynotes, workshops, and training sessions built on The Master's Edge methodology. Your audience leaves changed, not just entertained.",
};

const outcomes = [
  { icon: Sparkles, title: "Transformative Impact", description: "Lasting impact, practical tools, and genuine inspiration" },
  { icon: Target, title: "Tailored Customization", description: "High-level customization that resonates with your specific audience" },
  { icon: Lightbulb, title: "Actionable Insights", description: "Strategies they can implement immediately" },
  { icon: Zap, title: "Dynamic Energy", description: "High energy ensuring a memorable experience" },
  { icon: Users, title: "Evidence-Based", description: "Science-backed strategies from original research" },
  { icon: Smile, title: "Engaging Humor", description: "Substance combined with fun" },
];

const talks = [
  {
    title: "The Master's Edge",
    subtitle: "Peak Performance Through Mastery of Mindset, Skillset, and Support Structure",
    description: "The flagship presentation. A deep dive into the methodology that has transformed thousands.",
    bestFor: "Corporate events, leadership summits, conference keynotes",
  },
  {
    title: "Reclaiming The Clock",
    subtitle: "Mastering Habits, Productivity, and the Truth About Time",
    description: "A first-principles approach to eliminating time management myths and building systems that work.",
    bestFor: "Business owners, entrepreneurs, chamber events",
  },
  {
    title: "A Category of One",
    subtitle: "Position Yourself So Far Ahead That Comparison Becomes Irrelevant",
    description: "How to use first principles thinking to differentiate in ways competitors can't copy.",
    bestFor: "Sales conferences, industry events, competitive environments",
  },
  {
    title: "The Limitless Mindset",
    subtitle: "Breaking Through the Mental Barriers Between You and Your Best Performance",
    description: "The mindset shifts that dramatically upgrade business and life satisfaction.",
    bestFor: "Motivational events, personal development conferences",
  },
  {
    title: "Winning Team Culture",
    subtitle: "The Science of Building an Empowered Team of Motivated Professionals",
    description: "How to engineer flow states at the team level and build sustainable peak performance.",
    bestFor: "Corporate retreats, management training, sports organizations",
  },
];

export default function SpeakingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              Speaking & Training
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Your Audience Leaves Changed, Not Just Entertained
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed mb-8">
              Keynotes, workshops, and training sessions built on The Master&apos;s Edge
              methodology. Every session delivers both inspiration and practical tools
              — because your audience deserves more than motivation that fades by
              Monday.
            </p>
            <Button href={links.booking} external size="lg">
              Book Brett for Your Event
            </Button>
          </div>
        </section>

        {/* Client Logos */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-warm-gray mb-6">
              Brett has spoken at and conducted training for organizations including:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {["American Express", "Delta Airlines", "Citigroup", "Murray Area Chamber"].map((name) => (
                <div key={name} className="text-gray-400 font-semibold">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Can Expect */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              What You Can Expect
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outcomes.map((outcome) => (
                <div key={outcome.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-cranberry/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <outcome.icon className="w-6 h-6 text-cranberry" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{outcome.title}</h3>
                    <p className="text-warm-gray text-sm">{outcome.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signature Talks */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Signature Talks
            </h2>
            <div className="space-y-8">
              {talks.map((talk, index) => (
                <div
                  key={talk.title}
                  className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-cranberry"
                >
                  <h3 className="text-2xl font-bold text-black mb-1">{talk.title}</h3>
                  <p className="text-cranberry font-medium mb-4">{talk.subtitle}</p>
                  <p className="text-warm-gray mb-4">{talk.description}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Best for:</span> {talk.bestFor}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-warm-gray mt-8">
              All talks available as 60-minute keynotes, 90-minute workshops, or
              full-day interactive training sessions.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {[
                {
                  quote: "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
                  name: "Matt Gibbons",
                  title: "President, Murray Area Chamber of Commerce",
                },
                {
                  quote: "The impact of this two-phase event on our team has been nothing short of extraordinary. The lessons learned have not only improved our performance on the field but have also instilled a renewed sense of confidence and camaraderie.",
                  name: "Danny Larson",
                  title: "Head Football Coach, Juan Diego High School",
                },
              ].map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="border-l-4 border-gold pl-6 py-4"
                >
                  <p className="text-lg italic text-black mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <cite className="text-warm-gray">
                    — <span className="font-semibold">{testimonial.name}</span>,{" "}
                    {testimonial.title}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Let&apos;s Make Your Event Unforgettable
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Tell Brett about your event, your audience, and what you&apos;re hoping
              to achieve. He&apos;ll take it from there.
            </p>
            <Button href={links.booking} external size="lg">
              Book Brett for Your Event
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

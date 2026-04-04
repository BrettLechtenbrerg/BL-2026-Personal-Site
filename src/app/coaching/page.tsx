import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";

export const metadata = {
  title: "Executive & Business Coaching | Brett Lechtenberg",
  description:
    "The Master's Edge coaching program builds a custom toolkit around your specific goals, challenges, and situation.",
};

export default function CoachingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              Executive & Business Coaching
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Become the Leader Your Business Needs You to Be
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed mb-8">
              The Master&apos;s Edge coaching program builds a custom toolkit around
              your specific goals, challenges, and situation — grounded in the
              science of peak performance and validated by decades of real-world
              results.
            </p>
            <Button href={links.booking} external size="lg">
              Start a Conversation
            </Button>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-6">
              You&apos;ve Hit a Ceiling. And Working Harder Isn&apos;t Breaking Through It.
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed mb-6">
              You&apos;ve built a successful business through determination and hard
              work. But now the strategies that got you here aren&apos;t getting you
              further. You might be experiencing:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Revenue that's plateaued despite increasing effort",
                "Days consumed by operational firefighting instead of strategy",
                "A team that depends on you for every decision",
                "Personal relationships and well-being suffering under the weight",
                "The nagging feeling that you're capable of much more",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-warm-gray">
                  <span className="text-cranberry font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-lg text-black font-semibold">
              You don&apos;t need another course, another book, or another podcast. You
              need a system that changes how you operate — from the inside out.
            </p>
          </div>
        </section>

        {/* The Process */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-4 text-center">
              How The Master&apos;s Edge Coaching Works
            </h2>
            <p className="text-lg text-warm-gray text-center mb-16 max-w-3xl mx-auto">
              Every engagement begins with the same promise:{" "}
              <em className="text-black">
                We will build a custom set of tools that fits you, your situation,
                and no one else.
              </em>
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  phase: "Phase 1",
                  title: "CLARIFY",
                  subtitle: "First Principles Diagnostic",
                  description:
                    "We strip away assumptions and surface-level symptoms to find what's actually happening. What are the real problems? What inherited patterns are creating invisible ceilings?",
                },
                {
                  phase: "Phase 2",
                  title: "SIMPLIFY",
                  subtitle: "Frontloaded Toolkit",
                  description:
                    "We build the specific tools, frameworks, and systems you need — before the next high-stakes moment demands them. Your custom toolkit addresses Mindset, Skillset, and Support Structure.",
                },
                {
                  phase: "Phase 3",
                  title: "MAXIMIZE",
                  subtitle: "Flow State Operation",
                  description:
                    "With clarity achieved and the right systems in place, peak performance becomes accessible. You stop surviving and start operating from intention, flow, and compounding results.",
                },
              ].map((phase, index) => (
                <div
                  key={phase.phase}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center"
                >
                  <p className="text-sm text-warm-gray mb-2">{phase.phase}</p>
                  <h3 className="text-3xl font-bold text-cranberry mb-1">
                    {phase.title}
                  </h3>
                  <p className="text-gold font-medium mb-4">{phase.subtitle}</p>
                  <p className="text-warm-gray">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Real Results From Real Clients
            </h2>
            <div className="space-y-8">
              {[
                {
                  quote: "I have been blown away with the powerful mindset tools, branding systems, and business building strategies. I added 43 percent to my best month of the year.",
                  name: "Rob Balderas",
                  title: "Balderas Family Insurance",
                },
                {
                  quote: "Brett has an innate ability to break down complicated subjects into easy to learn and quick to implement subject matter. He has helped me motivate my staff, implement more cash generation systems, and build a culture of fun and positive growth.",
                  name: "John Nottingham",
                  title: "Sword and Shield Security",
                },
              ].map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="border-l-4 border-gold pl-6 py-4 bg-gray-50 rounded-r-xl"
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

        {/* FAQ */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Common Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: "Who is The Master's Edge coaching for?",
                  a: "Business owners, executives, and leaders who know they're capable of more but can't identify what's holding them back. People who have tried generic programs and found them too broad.",
                },
                {
                  q: "How is this different from other coaching programs?",
                  a: "Two things. First, every tool we build is custom — there are no templates. Second, the methodology is grounded in original flow state research validated by the Flow Research Collective.",
                },
                {
                  q: "How long does it take to see results?",
                  a: "Most clients experience a shift in clarity and mindset within the first few sessions. Tangible business results typically emerge within 60-90 days.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-bold text-black mb-2">{faq.q}</h3>
                  <p className="text-warm-gray">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The First Step Is Always a Conversation
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Not a sales call. A real conversation about where you are, where you
              want to be, and whether The Master&apos;s Edge is the right fit.
            </p>
            <Button href={links.booking} external size="lg">
              Start a Conversation
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

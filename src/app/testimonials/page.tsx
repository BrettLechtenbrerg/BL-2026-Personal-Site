import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { Quote } from "lucide-react";

export const metadata = {
  title: "Testimonials | Brett Lechtenberg",
  description:
    "Don't take Brett's word for it. Hear from the leaders, athletes, coaches, and business owners who've experienced The Master's Edge firsthand.",
};

const marqueeTestimonials = [
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist, 3x Olympian",
  },
  {
    quote:
      "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of initiatives for eight U.S. Presidents",
  },
  {
    quote:
      "In my military career, I had to perform in any condition, at any given time, without fail. If you want to learn that kind of mindset in business and building teams, then Brett Lechtenberg is definitely a person that I turn to.",
    name: "Green Beret",
    title: "Trauma Survival Specialist",
  },
  {
    quote:
      "Brett is one of my 300. Just like the Spartans of old had to pick 300 to face down their foes — no-nonsense, amazing people. Brett is someone I turn to when I need to pick my 300.",
    name: "8x World Karate Champion",
    title: "",
  },
];

const businessResults = [
  {
    quote:
      "I added 43 percent to my best month of the year and I am on track to exceed that already this month. Brett has some truly remarkable business building strategies.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance",
  },
  {
    quote:
      "He has helped me motivate my staff, implement more cash generation systems, and help build a culture of fun and positive growth.",
    name: "John Nottingham",
    title: "Sword and Shield Security",
  },
  {
    quote:
      "Brett has helped me more clearly understand marketing and branding — not only the implementation but the effect it has on my personal brand and the relationship I have with my community.",
    name: "Al Agon",
    title: "Perfect Balance Fitness",
  },
  {
    quote:
      "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge.",
    name: "Matt Gibbons",
    title: "President, Murray Area Chamber of Commerce",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              See What&apos;s Possible
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed">
              Don&apos;t take Brett&apos;s word for it. Hear from the leaders, athletes,
              coaches, and business owners who&apos;ve experienced The Master&apos;s Edge
              firsthand.
            </p>
          </div>
        </section>

        {/* Marquee Testimonials */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Featured Testimonials
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {marqueeTestimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="relative bg-gray-50 rounded-2xl p-8 lg:p-10"
                >
                  <div className="absolute -top-4 left-8 w-10 h-10 bg-cranberry rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  <blockquote className="text-lg text-black leading-relaxed mb-6 pt-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cranberry to-cranberry-dark flex items-center justify-center text-white font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-black">{testimonial.name}</p>
                      {testimonial.title && (
                        <p className="text-sm text-warm-gray">{testimonial.title}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Results */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Results That Speak for Themselves
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {businessResults.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-gold"
                >
                  <blockquote className="text-warm-gray mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <cite className="text-black font-semibold">
                    — {testimonial.name}
                  </cite>
                  {testimonial.title && (
                    <p className="text-sm text-warm-gray">{testimonial.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Write Your Own Transformation Story?
            </h2>
            <Button href={links.booking} external size="lg">
              Talk to Brett
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

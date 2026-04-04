import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { Star } from "lucide-react";

export const metadata = {
  title: "Books & Media | Brett Lechtenberg",
  description:
    "Seven books, five bestsellers, and a growing library of media appearances — all built on one principle: teach what you've tested.",
};

const books = [
  {
    title: "The Master's Edge",
    status: "Coming Soon",
    description:
      "The definitive guide to Brett's proprietary peak performance methodology. Built on 30+ years of experience and original flow state research.",
    bestseller: false,
    upcoming: true,
  },
  {
    title: "Reclaiming The Clock",
    status: "Bestseller",
    description:
      "How to have more time, reduce stress, and increase peace of mind in a world of unparalleled distraction.",
    bestseller: true,
  },
  {
    title: "The Anti-Bully Program",
    status: "#1 Amazon Bestseller",
    description:
      "A straightforward and insightful training program for families navigating bullying.",
    bestseller: true,
  },
  {
    title: "The Anti-Cyber Bully Program",
    status: "#1 Amazon Bestseller",
    description: "Clear, actionable guidance for parents dealing with cyberbullying.",
    bestseller: true,
  },
  {
    title: "Bullyproof: Unleash the Hero in Your Kid",
    status: "#1 Amazon Bestseller (Contributing Author)",
    description:
      "A collaborative work bringing together experts on child empowerment and safety.",
    bestseller: true,
  },
  {
    title: "The Ultimate Travel Safety Program",
    status: "Bestseller",
    description:
      "Essential safety training for travelers, missionaries, and anyone heading abroad.",
    bestseller: true,
  },
  {
    title: "Protecting Your Castle",
    status: "Published",
    description:
      "The premier anti-home burglary and safety training program for homeowners and renters.",
    bestseller: false,
  },
];

export default function BooksPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-gold/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Ideas That Have Helped Thousands
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed">
              Seven books, five bestsellers, and a growing library of media
              appearances — all built on one principle:{" "}
              <span className="text-black font-semibold">
                teach what you&apos;ve tested.
              </span>
            </p>
          </div>
        </section>

        {/* Books */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Brett&apos;s Books
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {books.map((book) => (
                <div
                  key={book.title}
                  className={`rounded-2xl p-8 border-2 ${
                    book.upcoming
                      ? "border-cranberry bg-cranberry/5"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">{book.title}</h3>
                    {book.bestseller && (
                      <div className="flex items-center gap-1 text-gold">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-semibold">Bestseller</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-cranberry font-semibold mb-3">
                    {book.status}
                  </p>
                  <p className="text-warm-gray">{book.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Brett in the Media
            </h2>
            <div className="text-center mb-12">
              <p className="text-warm-gray uppercase tracking-wide text-sm mb-6">
                As Seen On
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                {[
                  "Good Things Utah",
                  "Channel 4",
                  "Channel 13",
                  "Profiles in Caring",
                ].map((name) => (
                  <div key={name} className="text-gray-400 font-semibold text-lg">
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Video placeholder */}
            <div className="max-w-3xl mx-auto">
              <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">Good Things Utah Interview Video</p>
              </div>
            </div>
          </div>
        </section>

        {/* Free Book CTA */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-cranberry to-cranberry-dark rounded-3xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                Get Your Free Copy of Reclaiming The Clock
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Brett&apos;s bestselling book on habit management and time creation —
                delivered to your inbox.
              </p>
              <Button
                href={links.booking}
                external
                variant="secondary"
                size="lg"
              >
                Get the Free Book
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Want Brett to Write the Next Chapter With You?
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

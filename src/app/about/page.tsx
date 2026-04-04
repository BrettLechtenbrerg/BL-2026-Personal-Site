import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";

export const metadata = {
  title: "About Brett | Brett Lechtenberg",
  description:
    "Brett Lechtenberg has spent three decades helping people discover who they're meant to become — through martial arts, coaching, speaking, writing, and mentorship.",
};

const credentials = [
  {
    title: "30+ Years as a Business Owner",
    description:
      "Brett founded Personal Mastery Martial Arts & Family Success Center in Sandy, Utah and has run it for over three decades. It's been his laboratory — the place where every strategy was tested before it was ever taught.",
  },
  {
    title: "8th-Degree Black Belt, 40+ Years in Martial Arts",
    description:
      "More than a rank — it's a way of thinking. The same progressive mastery, discipline, and flow state awareness that creates black belts is the foundation of The Master's Edge.",
  },
  {
    title: "Flow State Researcher",
    description:
      "Brett completed a formal research thesis on utilizing flow states to enhance human learning. The research was reviewed and validated by the Flow Research Collective — Steven Kotler's peak performance organization.",
  },
  {
    title: "Author of 7 Books (5 Bestsellers)",
    description:
      "From time management to family safety to personal empowerment, Brett's books reflect the breadth of his expertise. His seventh book — The Master's Edge — is forthcoming.",
  },
  {
    title: "Co-Founder of Total Success AI",
    description:
      "Brett brings the same Master's Edge methodology to AI adoption — helping businesses implement technology in a way that puts people first.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              About Brett
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              30 Years of Watching Impossible Transformations Happen
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed">
              Brett Lechtenberg has spent three decades helping people discover who
              they&apos;re meant to become — through martial arts, coaching, speaking,
              writing, and mentorship.
            </p>
          </div>
        </section>

        {/* The Story */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-8">How It Started</h2>
            <div className="prose prose-lg max-w-none text-warm-gray">
              <p className="text-lg leading-relaxed mb-6">
                I still remember the moment everything changed.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                I was working with a shy, anxious kid who wouldn&apos;t make eye
                contact. His parents were desperate. School was a struggle. Other
                activities had failed. They&apos;d brought him to martial arts as a
                last resort.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Three months later, that same kid walked into my office, looked me
                straight in the eye, and said:{" "}
                <em className="text-black">
                  &ldquo;Thank you for believing in me when I didn&apos;t believe in
                  myself.&rdquo;
                </em>
              </p>
              <p className="text-lg leading-relaxed mb-6">
                That&apos;s when I realized: the kicks and punches were never the
                point. They were just the delivery system for something much bigger.
                What I was really teaching was transformation. Self-belief. The
                discovery of who someone was always capable of being.
              </p>
              <p className="text-lg leading-relaxed text-black font-semibold">
                That was over 25 years ago. Since then, I&apos;ve watched thousands
                of transformations like that one. And I&apos;ve learned something:
                everyone has extraordinary potential inside them. Most people just
                need someone to see it first.
              </p>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              The Experience Behind the Method
            </h2>
            <div className="space-y-8">
              {credentials.map((credential) => (
                <div
                  key={credential.title}
                  className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-cranberry"
                >
                  <h3 className="text-xl font-bold text-black mb-2">
                    {credential.title}
                  </h3>
                  <p className="text-warm-gray">{credential.description}</p>
                </div>
              ))}
            </div>

            {/* Additional credentials */}
            <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-lg font-bold text-black mb-4">Also</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-warm-gray">
                <li>• 32nd-Degree Master Mason</li>
                <li>• 3x graduate of International Training Commission Executive Protection School</li>
                <li>• BA in Business Operations, Western Washington University</li>
                <li>• Featured on Good Things Utah, Channel 4, Channel 13</li>
                <li>• Trusted by American Express, Delta Airlines, Citigroup</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              What I Believe
            </h2>
            <div className="space-y-6 text-lg text-warm-gray">
              <p>
                In 30 years, I&apos;ve never met someone without extraordinary
                potential. I&apos;ve only met people who haven&apos;t discovered it yet.
              </p>
              <p>
                The best teachers don&apos;t create followers — they create leaders
                who no longer need them. That&apos;s always been my goal. Not to
                impress you with what I know, but to unlock what&apos;s already inside
                you.
              </p>
              <p className="text-black font-semibold">
                I don&apos;t teach theory. I teach what I&apos;ve tested. In my own
                business, on my own mat, with my own team. If it hasn&apos;t worked
                for me, I don&apos;t teach it to you.
              </p>
            </div>
          </div>
        </section>

        {/* Personal */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Beyond Business</h2>
            <p className="text-lg text-warm-gray">
              Brett lives in Sandy, Utah with his family. When he&apos;s not coaching,
              training, or speaking, you&apos;ll find him at Personal Mastery Martial
              Arts — still on the mat, still learning, still practicing what he
              teaches.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Let&apos;s Talk About What&apos;s Possible
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

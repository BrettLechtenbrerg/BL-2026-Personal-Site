import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";

export const metadata = {
  title: "The Master's Edge | Brett Lechtenberg",
  description:
    "A science-backed, custom-built coaching system for unlocking peak performance in business leaders, teams, and individuals.",
};

export default function MastersEdgePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              The Master&apos;s Edge
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              The Methodology Behind the Transformation
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed mb-8">
              A science-backed, custom-built coaching system for unlocking peak
              performance in business leaders, teams, and individuals. Built on 30+
              years of real-world experience and validated flow state research.
            </p>
            <Button href={links.booking} external size="lg">
              Book a Conversation
            </Button>
          </div>
        </section>

        {/* The Promise */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-6 text-center">
              It Starts With a Promise
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed text-center">
              Every Master&apos;s Edge engagement begins the same way:{" "}
              <em className="text-black font-semibold">
                We will build a custom set of tools that fits you, your situation,
                and no one else.
              </em>
            </p>
            <p className="text-lg text-warm-gray leading-relaxed text-center mt-4">
              This is not a pre-packaged program. There are no templates borrowed
              from someone else&apos;s success story. The Master&apos;s Edge is a
              diagnostic, science-backed process that identifies the specific gaps
              between where you are and where you&apos;re capable of being — then
              builds a custom toolkit to close them.
            </p>
          </div>
        </section>

        {/* Three Foundations */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-4 text-center">
              Three Layers. One System.
            </h2>
            <p className="text-lg text-warm-gray text-center mb-16 max-w-3xl mx-auto">
              The Master&apos;s Edge operates on three integrated layers. Each builds
              on the one below it. Skip a layer and the system breaks.
            </p>

            {/* The Science */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-cranberry mb-8 text-center">
                Layer 1: The Science — Three Foundations
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "First Principles Thinking",
                    drives: "CLARIFY",
                    description:
                      "Strip away assumptions. See the real problem. Most people spend years solving the wrong problems because they never question the inherited beliefs underneath them.",
                  },
                  {
                    title: "Frontloading",
                    drives: "SIMPLIFY",
                    description:
                      "Be prepared, not surprised. Loading the knowledge, tools, and mental frameworks you need before you face the challenge — not during, not after.",
                  },
                  {
                    title: "Flow",
                    drives: "MAXIMIZE",
                    description:
                      "Engineer the conditions for peak performance. Flow is not random luck — it's a reproducible state with specific, measurable conditions.",
                  },
                ].map((foundation) => (
                  <div
                    key={foundation.title}
                    className="bg-white rounded-2xl p-8 shadow-lg"
                  >
                    <p className="text-gold font-bold text-sm mb-2">
                      → Drives {foundation.drives}
                    </p>
                    <h4 className="text-xl font-bold text-black mb-3">
                      {foundation.title}
                    </h4>
                    <p className="text-warm-gray">{foundation.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Methodology */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-cranberry mb-8 text-center">
                Layer 2: The Methodology — Three Pillars
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Mindset Mastery",
                    subtitle: "Focus • Resilience • Confidence",
                    description:
                      "Before you can change what you do, you have to change how you think. Building the internal architecture for peak performance under pressure.",
                  },
                  {
                    title: "Skillset Enhancement",
                    subtitle: "Tools • Techniques • Practice",
                    description:
                      "Once the mindset is right, we build the practical capabilities. Specific, high-leverage tools matched to your situation.",
                  },
                  {
                    title: "Support Structure",
                    subtitle: "Systems • Habits • Environment",
                    description:
                      "The piece most programs miss. We design the environment, systems, and routines that make peak performance sustainable.",
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.title}
                    className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-cranberry"
                  >
                    <h4 className="text-xl font-bold text-black mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-cranberry text-sm font-medium mb-3">
                      {pillar.subtitle}
                    </p>
                    <p className="text-warm-gray">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Transformation */}
            <div className="text-center bg-black text-white rounded-3xl p-12">
              <h3 className="text-xl font-bold mb-4">
                Layer 3: The Transformation Promise
              </h3>
              <p className="text-4xl font-bold">
                <span className="text-cranberry">CLARIFY.</span>{" "}
                <span className="text-gold">SIMPLIFY.</span>{" "}
                <span className="text-cranberry">MAXIMIZE.</span>
              </p>
              <p className="text-gray-300 mt-6 max-w-2xl mx-auto">
                This is what happens to the person who goes through The Master&apos;s
                Edge. You get crystal clear about what you really want. You simplify
                how you operate. And you maximize your life, your business, and your
                impact.
              </p>
            </div>
          </div>
        </section>

        {/* Research */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-6 text-center">
              Built on Research, Not Theory
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed mb-8">
              Most peak performance programs are built on concepts borrowed from
              books. The Master&apos;s Edge is built on original research.
            </p>
            <p className="text-lg text-warm-gray leading-relaxed mb-8">
              Brett conducted a formal research thesis testing whether deliberate
              manipulation of flow states could accelerate how fast people learn
              complex skills and how long they retain them. The research was reviewed
              and validated by the{" "}
              <span className="text-black font-semibold">
                Flow Research Collective
              </span>{" "}
              — Steven Kotler&apos;s peak performance research organization.
            </p>
            <blockquote className="border-l-4 border-gold pl-6 py-4 bg-gold/5 rounded-r-xl">
              <p className="text-xl italic text-black">
                &ldquo;Excellent. The paper makes a compelling, empirical case for
                the utilization of flow for accelerated learning and skill
                acquisition.&rdquo;
              </p>
              <cite className="text-warm-gray mt-2 block">
                — Flow Research Collective
              </cite>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The First Step Is Always a Conversation
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              No pitch. No pressure. Just a genuine discussion about where you are,
              where you want to be, and whether The Master&apos;s Edge is the right
              fit.
            </p>
            <Button href={links.booking} external size="lg">
              Book a Conversation
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { GraduationCap, Handshake, Cog } from "lucide-react";

export const metadata = {
  title: "AI Advisory | Brett Lechtenberg",
  description:
    "Through Total Success AI, Brett helps businesses implement AI the right way — strategically, intentionally, and with people at the center.",
};

const tiers = [
  {
    icon: GraduationCap,
    title: "Teach You",
    subtitle: "Foundational",
    description:
      "We train your team to understand and use AI effectively. From foundational literacy to advanced prompt engineering.",
    bestFor: "Teams new to AI who want to build internal capability",
  },
  {
    icon: Handshake,
    title: "Do It With You",
    subtitle: "Collaborative",
    description:
      "We work alongside your team to implement AI into your specific workflows, training programs, and operations.",
    bestFor: "Businesses ready to integrate AI but wanting expert guidance",
  },
  {
    icon: Cog,
    title: "Do It For You",
    subtitle: "Full Service",
    description:
      "We handle the full AI implementation — from strategy to custom tool development to managed services.",
    bestFor: "Organizations wanting turnkey AI solutions",
  },
];

const impactAreas = [
  { title: "Future-Proofing", description: "Anticipate market trends and position your business ahead of change" },
  { title: "Prompt Engineering", description: "Learn to communicate with AI tools effectively — saving massive time and money" },
  { title: "Business Automation", description: "Automate repetitive tasks so your team can focus on high-value work" },
  { title: "Content Creation", description: "Generate, optimize, and repurpose content at scale" },
];

export default function AIAdvisoryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              AI Advisory — Powered by Total Success AI
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Free Your People to Do What Only Humans Can
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed mb-8">
              AI isn&apos;t here to replace your team. It&apos;s here to handle the
              repetitive so they can focus on what matters: relationships,
              creativity, and high-value work. Through Total Success AI, Brett helps
              businesses implement AI the right way.
            </p>
            <Button href={links.booking} external size="lg">
              Explore AI Solutions
            </Button>
          </div>
        </section>

        {/* The Approach */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">
              AI Done Right Starts With People, Not Technology
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed">
              Most AI consultants lead with the technology. We lead with the problem.
              Using the same first-principles approach that powers The Master&apos;s
              Edge, we start by understanding what your business actually needs —
              then build AI solutions that serve your people, not the other way
              around.
            </p>
          </div>
        </section>

        {/* Three Tiers */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Choose Your Level of Support
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <div
                  key={tier.title}
                  className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-cranberry"
                >
                  <div className="w-14 h-14 bg-cranberry/10 rounded-xl flex items-center justify-center mb-6">
                    <tier.icon className="w-7 h-7 text-cranberry" />
                  </div>
                  <p className="text-sm text-warm-gray mb-1">{tier.subtitle}</p>
                  <h3 className="text-2xl font-bold text-black mb-4">{tier.title}</h3>
                  <p className="text-warm-gray mb-6">{tier.description}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Best for:</span> {tier.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Four Areas Where AI Creates Immediate Impact
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {impactAreas.map((area) => (
                <div key={area.title} className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-black mb-2">{area.title}</h3>
                  <p className="text-warm-gray">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Total Success AI */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">
              Powered by Total Success AI
            </h2>
            <p className="text-lg text-warm-gray mb-8">
              Brett&apos;s AI advisory services are delivered through Total Success AI,
              co-founded with Manny Torres. For deeper AI consulting, implementation,
              and custom solutions.
            </p>
            <Button href={links.ai} external variant="secondary" size="lg">
              Visit Total Success AI
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Not Sure Where to Start With AI?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Let&apos;s have a conversation about your business, your team, and where
              AI could create the most impact.
            </p>
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

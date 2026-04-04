import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Solution } from "@/components/sections/Solution";
import { Pathways } from "@/components/sections/Pathways";
import { Credibility } from "@/components/sections/Credibility";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <Hero />

        {/* Social Proof Bar */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-warm-gray mb-6">
              Brett has spoken at and conducted training for organizations including:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {["American Express", "Delta Airlines", "Citigroup", "Murray Area Chamber"].map((name) => (
                <div key={name} className="text-gray-400 font-semibold text-sm lg:text-base">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-cranberry font-semibold tracking-wide uppercase text-sm mb-4">
              You know there&apos;s more
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              You&apos;ve Built Something Real. But Something&apos;s Missing.
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed max-w-3xl mx-auto">
              You&apos;ve worked hard to get here. Your business is running, your team is
              counting on you, and by most measures you&apos;re successful. But something
              doesn&apos;t match. The results don&apos;t reflect the effort. The days feel
              reactive instead of intentional. And the version of yourself you know is
              possible — the one who leads with clarity, operates in flow, and builds
              something truly extraordinary — keeps getting pushed to &quot;someday.&quot;
            </p>
            <p className="text-lg text-black font-semibold mt-6">
              That gap isn&apos;t about working harder. It&apos;s about operating differently.
            </p>
          </div>
        </section>

        {/* The Solution - Master's Edge Introduction */}
        <Solution />

        {/* Three Pathways */}
        <Pathways />

        {/* Credibility / Why Brett */}
        <Credibility />

        {/* Testimonials */}
        <Testimonials />

        {/* As Seen On - Media Logos */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-warm-gray mb-6 uppercase tracking-wide">
              As Seen On
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {["Good Things Utah", "Channel 4", "Channel 13", "Profiles in Caring"].map((name) => (
                <div key={name} className="text-gray-400 font-medium">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cranberry/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              The First Step Is Always a Conversation
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              No pitch. No pressure. Just a genuine discussion about where you are,
              where you want to be, and whether The Master&apos;s Edge is the right fit.
            </p>
            <a
              href="https://www.speaktobrett.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cranberry text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-cranberry-dark transition-all duration-300 shadow-xl shadow-cranberry/30 hover:shadow-2xl hover:shadow-cranberry/40 hover:-translate-y-1"
            >
              Talk to Brett
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

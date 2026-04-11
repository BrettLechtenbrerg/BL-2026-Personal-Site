import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Solution } from "@/components/sections/Solution";
import { Pathways } from "@/components/sections/Pathways";
import { Credibility } from "@/components/sections/Credibility";
import { Testimonials } from "@/components/sections/Testimonials";
import { MediaFeature } from "@/components/sections/MediaFeature";
import { LogoScroller } from "@/components/sections/LogoScroller";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <Hero />

        {/* Value Pillars - Clarify, Simplify, Maximize */}
        {/* Hidden on mobile/tablet - visible on lg+ (laptops & desktops) */}
        {/* -mt-24 pulls it up to cover the white gradient from Hero */}
        <section className="hidden lg:block bg-gradient-to-b from-black via-gray-900 to-gray-800 py-8 -mt-24 relative z-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center gap-6">
              {[
                { main: "CLARIFY", sub: "Goals, Dreams, Desires", gradient: "from-cranberry to-cranberry-dark" },
                { main: "SIMPLIFY", sub: "Life, Business, Relationships", gradient: "from-gold to-gold-dark" },
                { main: "MAXIMIZE", sub: "Focus, Confidence, Actions, Results", gradient: "from-cranberry to-cranberry-dark" },
              ].map((pillar) => (
                <div key={pillar.main} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${pillar.gradient} rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <div className={`relative bg-gradient-to-r ${pillar.gradient} rounded-full px-8 py-4 text-center shadow-xl hover:scale-105 transition-transform duration-300`}>
                    <p className="text-white font-black text-xl tracking-wider mb-1">
                      {pillar.main}
                    </p>
                    <p className="text-white/80 text-sm font-medium">
                      {pillar.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Bar - Scrolling Logos */}
        <LogoScroller />

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

        {/* Media Feature with YouTube Video */}
        <MediaFeature />

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
              Talk With Brett
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <Hero />

        {/* Social Proof Section - Coming Soon */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-warm-gray mb-8">
              Brett has spoken at and conducted training for organizations including:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
              {/* Logo placeholders */}
              {["American Express", "Delta Airlines", "Citigroup", "Chamber of Commerce"].map((name) => (
                <div key={name} className="text-gray-400 font-semibold">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Problem Section - Placeholder */}
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

        {/* CTA Section */}
        <section className="py-24 bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The First Step Is Always a Conversation
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              No pitch. No pressure. Just a genuine discussion about where you are,
              where you want to be, and whether The Master&apos;s Edge is the right fit.
            </p>
            <a
              href="https://www.speaktobrett.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cranberry text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cranberry-dark transition-colors shadow-lg shadow-cranberry/25"
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

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";
import { Calendar, Mail, Shield, Target, Lock } from "lucide-react";

export const metadata = {
  title: "Contact | Brett Lechtenberg",
  description:
    "No pitch. No pressure. Just a genuine conversation about where you are, where you want to be, and whether The Master's Edge is the right fit.",
};

const promises = [
  {
    icon: Target,
    title: "No Sales Pressure",
    description:
      "This is a conversation, not a pitch. Brett wants to understand your situation before recommending anything.",
  },
  {
    icon: Shield,
    title: "Customized to You",
    description:
      "Every engagement starts from scratch. There are no pre-packaged solutions waiting to be sold.",
  },
  {
    icon: Lock,
    title: "Confidential",
    description: "What you share stays between you and Brett. Period.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-cranberry/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Let&apos;s Talk About What&apos;s Possible
            </h1>
            <p className="text-xl text-warm-gray leading-relaxed">
              No pitch. No pressure. Just a genuine conversation about where you
              are, where you want to be, and whether The Master&apos;s Edge is the
              right fit.
            </p>
          </div>
        </section>

        {/* Booking Options */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Book a Call */}
              <div className="bg-cranberry text-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Book a Call With Brett</h2>
                <p className="text-white/80 mb-6">
                  Schedule a conversation at a time that works for you.
                </p>
                <Button
                  href={links.booking}
                  external
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Book a Call
                </Button>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-cranberry/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-cranberry" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4">
                  Or Reach Out Directly
                </h2>
                <p className="text-warm-gray mb-6">
                  Prefer email? Send Brett a message anytime.
                </p>
                <a
                  href={links.email}
                  className="inline-flex items-center justify-center gap-2 w-full bg-white border-2 border-cranberry text-cranberry px-6 py-4 rounded-lg font-semibold hover:bg-cranberry hover:text-white transition-colors"
                >
                  Brett@BrettLechtenberg.com
                </a>
              </div>
            </div>

            {/* Three Promises */}
            <div className="grid md:grid-cols-3 gap-8">
              {promises.map((promise) => (
                <div key={promise.title} className="text-center">
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <promise.icon className="w-7 h-7 text-gold-dark" />
                  </div>
                  <h3 className="font-bold text-black mb-2">{promise.title}</h3>
                  <p className="text-warm-gray text-sm">{promise.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-8">Quick Reference</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-xl font-bold text-black mb-2">Brett Lechtenberg</p>
              <p className="text-warm-gray mb-4">
                Peak Performance Coach | Speaker | Author
              </p>
              <p className="text-cranberry font-semibold mb-6">
                Creator of The Master&apos;s Edge
              </p>
              <p className="text-warm-gray mb-8">Sandy, Utah</p>

              <div className="border-t border-gray-100 pt-8">
                <p className="text-sm text-warm-gray mb-4 uppercase tracking-wide">
                  Websites
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://brettlechtenberg.com"
                    className="text-cranberry hover:text-cranberry-dark font-medium"
                  >
                    brettlechtenberg.com
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href={links.martialArts}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cranberry hover:text-cranberry-dark font-medium"
                  >
                    personalmasterymartialarts.com
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href={links.ai}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cranberry hover:text-cranberry-dark font-medium"
                  >
                    totalsuccessai.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

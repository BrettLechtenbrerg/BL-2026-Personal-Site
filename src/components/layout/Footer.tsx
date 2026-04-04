import Link from "next/link";
import { links } from "@/lib/utils";

const quickLinks = [
  { name: "About Brett", href: "/about" },
  { name: "Speaking & Training", href: "/speaking" },
  { name: "Coaching", href: "/coaching" },
  { name: "AI Advisory", href: "/ai-advisory" },
  { name: "Books & Media", href: "/books" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold mb-2">
              <span className="text-cranberry">Brett</span> Lechtenberg
            </h3>
            <p className="text-warm-gray text-sm mb-4">
              Peak Performance Coach | Speaker | Author
            </p>
            <p className="text-sm text-warm-gray">
              Creator of The Master&apos;s Edge
            </p>
            <p className="mt-6 text-gold font-semibold">
              Clarify. Simplify. Maximize.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-gray mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-cranberry transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-gray mb-4">
              Connect
            </h4>
            <div className="space-y-3">
              <a
                href={links.email}
                className="block text-sm text-gray-300 hover:text-cranberry transition-colors"
              >
                Brett@BrettLechtenberg.com
              </a>
              <a
                href={links.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-300 hover:text-cranberry transition-colors"
              >
                speaktobrett.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-gray">
            &copy; {new Date().getFullYear()} Brett Lechtenberg. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-warm-gray hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-warm-gray hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

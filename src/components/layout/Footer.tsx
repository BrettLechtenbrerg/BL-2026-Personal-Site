import Link from "next/link";
import Image from "next/image";
import { links } from "@/lib/utils";

// Social media icons as SVG components (brand icons not available in lucide)
const LinkedInIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
  </svg>
);

const quickLinks = [
  { name: "About Brett", href: "/about" },
  { name: "Speaking & Training", href: "/speaking" },
  { name: "Coaching", href: "/coaching" },
  { name: "AI Advisory", href: "/ai-advisory" },
  { name: "Books & Media", href: "/books" },
  { name: "Rockstar Team Quiz", href: "/rockstar-team-quiz" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Blog", href: "/blog" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// Site footer, "Horizon" design (30 Oct 2026): same links and words as before, restyled on dark.
export function Footer() {
  return (
    <div className="bl-h">
      <footer className="site-footer">
        <div className="rail">
          <div className="footer-cols">
            <div className="f-brand">
              <div className="f-logo">
                <Image src="/logo.jpg" alt="" width={56} height={56} />
                <h2 className="f-title">
                  <span className="brand-first">Brett</span> Lechtenberg
                </h2>
              </div>
              <p className="fine">Peak Performance Coach | Speaker | Author</p>
              <p className="fine">Creator of The Master&apos;s Edge</p>
              <p className="f-motto">Clarify. Simplify. Maximize.</p>
            </div>

            <nav aria-label="Footer">
              <h2 className="footer-h">Quick Links</h2>
              <ul className="f-links">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="footer-h">Connect</h2>
              <ul className="f-links">
                <li><a href={links.email}>Brett@BrettLechtenberg.com</a></li>
                <li><a href={links.booking} {...ext}>speaktobrett.com</a></li>
              </ul>
              <div className="socials">
                <a href="https://www.linkedin.com/in/brettlechtenberg" {...ext} aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href="https://www.facebook.com/BrettGLechtenberg" {...ext} aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="https://www.instagram.com/blechtenberg/" {...ext} aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-base">
            <p className="fine">&copy; {new Date().getFullYear()} Brett Lechtenberg. All rights reserved.</p>
            <div className="f-legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Home } from "lucide-react";
import { academyConfig } from "@/content/academy.config";

//==============================================================================
// Academy — way back to the public website (GIFT CONNECT, 4 Oct 2026: members
// had no path from the Academy back to the main site). Shown on EVERY academy
// page: in the sticky header (always on screen) and as a large button at the
// bottom of the page. Accent fill so it never reads as one of the member tabs;
// text in the background colour (the accent/bg pair is the brand's AA pair in
// both themes). Off when the profile sets academy.backToMainSite = false.
//==============================================================================

export default function BackToMainSite({ variant }: { variant: "header" | "footer" }) {
  if (academyConfig.academy.backToMainSite === false) return null;
  if (variant === "header") {
    return (
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg bg-academy-accent px-2.5 py-2 text-sm font-bold sm:px-3 text-academy-bg shadow-sm transition-opacity hover:opacity-90"
      >
        <Home size={18} aria-hidden="true" />
        {/* Under 360px the header also holds the Español switch: icon only, name kept for screen readers. */}
        <span className="max-[359px]:sr-only sm:hidden">Main site</span>
        <span className="hidden sm:inline">Back to main site</span>
      </Link>
    );
  }
  return (
    <div className="no-print mx-auto flex max-w-6xl justify-center border-t border-academy-fg/10 px-4 pb-16 pt-10 print:hidden">
      <Link
        href="/"
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-academy-accent px-6 py-3 text-center font-heading text-base font-bold text-academy-bg shadow-md transition-opacity hover:opacity-90 sm:text-lg"
      >
        <Home size={22} aria-hidden="true" />
        Back to the main website
      </Link>
    </div>
  );
}

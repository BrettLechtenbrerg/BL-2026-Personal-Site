//==============================================================================
// Academy — SITE-OWNED extras (seeded once by the Academy Forge installer,
// never overwritten). Engine pages render these slots; empty by default.
//==============================================================================
//   DashboardExtras      under the dashboard
//   ModuleExtras         under an unlocked lesson (slug = module slug)
//   ProgramNav           above and below a partner program library
// Server components: they may read files or data. Extra top-menu links live
// in the separate SiteNav.ts (the menu runs in the browser).
//==============================================================================

import Link from "next/link";

export function DashboardExtras() {
  return null;
}

export function ModuleExtras({ slug }: { slug: string }) {
  void slug;
  return null;
}

/** Default: an "All programs" link above the library, nothing below. */
export function ProgramNav({ slug, position }: { slug: string; position: "top" | "bottom" }) {
  void slug;
  if (position === "bottom") return null;
  return (
    // --focus-ring: same theme-ink focus ring as the library below (see PartnerProgram.tsx).
    <div className="mb-3" style={{ "--focus-ring": "var(--academy-fg)" } as React.CSSProperties}>
      <Link href="/academy/modules" className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4">
        All programs
      </Link>
    </div>
  );
}

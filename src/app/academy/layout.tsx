//==============================================================================
// Academy — hidden shell (noindex + member nav). Brand-agnostic; names come from academy.config.
//==============================================================================
// Hidden per docs/COURSE_PATTERN.md: noindex here, NOT in sitemap.ts, NOT in
// the site header. Members reach it via a direct link from the owner.
//==============================================================================

import type { Metadata } from "next";
import AcademyNav from "@/components/academy/AcademyNav";
import { academyCourses } from "@/content/academy/modules";
import ChannelSidebar from "@/components/academy/ChannelSidebar";
import BackToMainSite from "@/components/academy/BackToMainSite";
import { academyConfig } from "@/content/academy.config";
import { partnerPrograms } from "@/content/academy/partner-programs";
import { partnerSummaries } from "@/lib/academy-partner-programs";
import { THEME_SCRIPT } from "@/lib/academy-theme";

export const metadata: Metadata = {
  // absolute: the host site's title template would repeat the site name.
  title: { absolute: `${academyConfig.academy.name} | ${academyConfig.academy.kicker}` },
  description: academyConfig.academy.description,
  robots: { index: false, follow: false },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="academy-root"
      suppressHydrationWarning
      className="min-h-screen bg-gradient-to-br from-academy-bg via-[var(--academy-mid)] to-academy-bg text-academy-fg"
    >
      {/* Full page loads: apply the saved light/dark choice, else the brand default, before first
          paint. Clicking in from the main site skips this script; ThemeToggle covers that case. */}
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <AcademyNav
        courses={academyCourses.map(({ id, title, emoji }) => ({ id, title, emoji }))}
        programs={partnerSummaries(partnerPrograms)}
      />
      {/* The footer "Back to main site" button brings its own bottom space. */}
      <div className={`mx-auto flex max-w-6xl gap-6 px-4 pt-6 ${academyConfig.academy.backToMainSite === false ? "pb-24" : "pb-12"}`}>
        <ChannelSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <BackToMainSite variant="footer" />
    </div>
  );
}

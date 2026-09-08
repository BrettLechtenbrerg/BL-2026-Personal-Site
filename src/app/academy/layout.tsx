//==============================================================================
// Master's Edge Academy — hidden shell (noindex + member nav)
//==============================================================================
// Hidden per docs/COURSE_PATTERN.md: noindex here, NOT in sitemap.ts, NOT in
// Header.tsx. Members reach it via a direct link from Brett.
//==============================================================================

import type { Metadata } from "next";
import AcademyNav from "@/components/academy/AcademyNav";
import { academyCourses } from "@/content/academy/modules";
import ChannelSidebar from "@/components/academy/ChannelSidebar";

export const metadata: Metadata = {
  title: "Master's Edge Academy | Brett Lechtenberg",
  description: "Private learning academy for Master's Edge members.",
  robots: { index: false, follow: false },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="academy-root"
      suppressHydrationWarning
      className="min-h-screen bg-gradient-to-br from-black via-(--academy-mid) to-black text-white"
    >
      {/* Apply saved light/dark preference before first paint (see ThemeToggle). */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var t=localStorage.getItem('academy-theme');if(t==='light'||(!t&&matchMedia('(prefers-color-scheme: light)').matches))document.currentScript.parentElement.classList.add('academy-light')}catch(e){}",
        }}
      />
      <AcademyNav
        courses={academyCourses.map(({ id, title, emoji }) => ({ id, title, emoji }))}
      />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-6">
        <ChannelSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

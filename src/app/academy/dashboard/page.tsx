//==============================================================================
// Academy — dashboard (server wrapper strips quiz answers from module data)
//==============================================================================

import { orderedModules } from "@/content/academy/modules";
import Dashboard from "@/components/academy/Dashboard";
import SurveyDueCard from "@/components/academy/surveys/SurveyDueCard";
import { DashboardExtras } from "@/components/academy/SiteExtras";
import { surveysEnabled } from "@/lib/surveys";

// Re-render at most every 10 minutes, so date-based site extras (e.g. GIFT CONNECT's
// "Today's Vroom Tip") turn over soon after midnight. Member data loads in the browser.
export const revalidate = 600;

export default function DashboardPage() {
  const modules = orderedModules().map((m) => ({
    slug: m.slug,
    order: m.order,
    title: m.title,
  }));
  return (
    <>
      {/* Member surveys: shows only when one is due (and a results link for the survey team). */}
      {surveysEnabled && <SurveyDueCard />}
      <Dashboard modules={modules} />
      {/* Site-owned slot (components/academy/SiteExtras.tsx); empty by default. */}
      <DashboardExtras />
    </>
  );
}

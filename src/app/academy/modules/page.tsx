//==============================================================================
// Academy — module grid (server component: strips quiz answers before the
// data reaches the client bundle)
//==============================================================================

import { orderedModules } from "@/content/academy/modules";
import ModulesGrid from "@/components/academy/ModulesGrid";

export default function ModulesPage() {
  const modules = orderedModules().map((m) => ({
    slug: m.slug,
    order: m.order,
    title: m.title,
    tagline: m.tagline,
    description: m.description,
    questionCount: m.quiz.length,
  }));
  return <ModulesGrid modules={modules} />;
}

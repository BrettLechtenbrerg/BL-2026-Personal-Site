//==============================================================================
// Academy — module grid (server component: strips quiz answers before the
// data reaches the client bundle)
//==============================================================================

import { orderedModules, academyCourses } from "@/content/academy/modules";
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
  const courses = academyCourses.map((c) => ({
    id: c.id,
    title: c.title,
    emoji: c.emoji,
    description: c.description,
    fromOrder: c.fromOrder,
    toOrder: c.toOrder,
    cover: c.cover,
  }));
  return <ModulesGrid modules={modules} courses={courses} />;
}

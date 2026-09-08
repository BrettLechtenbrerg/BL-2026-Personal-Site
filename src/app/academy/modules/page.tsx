//==============================================================================
// Academy — module grid (server component: strips quiz answers before the
// data reaches the client bundle)
//==============================================================================

import { orderedModules, academyCourses } from "@/content/academy/modules";
import { coursePriceLabels } from "@/lib/stripe";
import ModulesGrid from "@/components/academy/ModulesGrid";

// Prices come from Stripe at request time (cached per server process) —
// never baked into a build-time static page.
export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const priceLabels = await coursePriceLabels();
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
    paid: Boolean(c.priceEnv),
    priceLabel: priceLabels[c.id],
  }));
  return <ModulesGrid modules={modules} courses={courses} />;
}

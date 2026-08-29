//==============================================================================
// Academy — dashboard (server wrapper strips quiz answers from module data)
//==============================================================================

import { orderedModules } from "@/content/academy/modules";
import Dashboard from "@/components/academy/Dashboard";

export default function DashboardPage() {
  const modules = orderedModules().map((m) => ({
    slug: m.slug,
    order: m.order,
    title: m.title,
  }));
  return <Dashboard modules={modules} />;
}

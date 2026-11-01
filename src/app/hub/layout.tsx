import type { Metadata } from "next";
import HubFrame from "@/components/hub/HubFrame";

// POWER HUB — Brett's private back office (Budget, Messaging, Academy; CRM
// later). noindex + not in sitemap.ts + not linked in the nav + /hub/ is
// disallowed in robots.ts. The real security boundary is the HMAC session
// cookie every /api/hub/* route verifies (src/lib/hub-session.ts); this
// metadata just keeps the pages out of search results.
export const metadata: Metadata = {
  title: "Power Hub",
  description: "Internal back office.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <HubFrame>{children}</HubFrame>;
}
